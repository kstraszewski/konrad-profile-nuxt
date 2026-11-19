import type { IncomingMessage, ServerResponse } from 'node:http'
import { createError } from 'h3'

export const AI_TO_UI_BODY_DEADLINE_MS = 5_000

// The page maps `data.code` to its own copy. No server text reaches the UI.
export const aiToUiError = (statusCode: number, statusMessage: string, code: string) =>
  createError({ statusCode, statusMessage, data: { code } })

/**
 * Serverless adapters and internal calls hand over a body that is already in
 * memory. Only a live Node stream has to be read chunk by chunk.
 */
export function isBufferedAiToUiRequest(req: IncomingMessage) {
  return Symbol.for('h3RawBody') in req || 'rawBody' in req || 'body' in req || '__unenv__' in req
}

/**
 * Give up on an upload: discard whatever still arrives and close the socket
 * once the response is out, so a client cannot keep the request open.
 */
export function refuseAiToUiUpload(req: IncomingMessage, res: ServerResponse) {
  if (req.httpVersionMajor < 2 && !res.headersSent) res.setHeader('Connection', 'close')
  req.resume()
}

/**
 * Buffer a request body from the Node stream with a size cap and a deadline.
 *
 * h3 v1's getRequestWebStream keeps its `data`/`end`/`error` listeners on the
 * request after reader.cancel(), so a late chunk lands on a closed controller.
 * Here every exit path removes the listeners it added, and a refused upload is
 * drained instead of being left paused.
 */
export function readAiToUiBody(
  req: IncomingMessage,
  res: ServerResponse,
  limits: { maxBytes: number, deadlineMs?: number },
): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    // Someone else has consumed or torn down this request: nothing left to read.
    if (req.readableEnded || req.destroyed) {
      reject(aiToUiError(400, 'Bad Request', 'INVALID_REQUEST'))
      return
    }
    const chunks: Buffer[] = []
    let total = 0
    const settle = (error: Error | null) => {
      clearTimeout(deadline)
      req.off('data', onData).off('end', onEnd).off('error', onAbort).off('close', onAbort)
      if (error) reject(error)
      else resolve(Buffer.concat(chunks, total))
    }
    const refuse = (error: Error) => {
      chunks.length = 0
      settle(error)
      refuseAiToUiUpload(req, res)
    }
    const onData = (chunk: Buffer | string) => {
      const bytes = typeof chunk === 'string' ? Buffer.from(chunk) : chunk
      total += bytes.byteLength
      if (total > limits.maxBytes) refuse(aiToUiError(413, 'Payload Too Large', 'INVALID_REQUEST'))
      else chunks.push(bytes)
    }
    const onEnd = () => settle(null)
    // `close` before `end` means the client went away mid-upload.
    const onAbort = () => settle(aiToUiError(400, 'Bad Request', 'INVALID_REQUEST'))
    const deadline = setTimeout(
      () => refuse(aiToUiError(408, 'Request Timeout', 'REQUEST_TIMEOUT')),
      limits.deadlineMs ?? AI_TO_UI_BODY_DEADLINE_MS,
    )
    req.on('data', onData).on('end', onEnd).on('error', onAbort).on('close', onAbort)
  })
}
