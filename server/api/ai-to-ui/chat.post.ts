import { createGateway } from 'ai'
import { defineEventHandler, getHeader, getRequestURL, readRawBody, sendStream, setHeader } from 'h3'
import type { H3Event } from 'h3'
import {
  AI_TO_UI_MAX_BODY_BYTES, AI_TO_UI_MODEL, aiToUiRequestSchema, buildAiToUiPartialReply, buildAiToUiReply,
  isAiToUiVercelProduction, resolveAiToUiMode, takeAiToUiCallSlot,
} from '../../utils/aiToUi'
import { assertAiToUiHuman } from '../../utils/aiToUiBotId'
import { reserveAiToUiDailySlot } from '../../utils/aiToUiDailyLimit'
import { isAiToUiTimeout, streamAiToUiChoice } from '../../utils/aiToUiModel'
import { aiToUiError, isBufferedAiToUiRequest, readAiToUiBody, refuseAiToUiUpload } from '../../utils/aiToUiRequest'
import { createAiToUiEventStream } from '../../utils/aiToUiStream'
import type { AiToUiStreamFailure, AiToUiStreamRun } from '../../utils/aiToUiStream'

function assertSameOriginJson(event: H3Event) {
  const origin = getHeader(event, 'origin')
  const expected = getRequestURL(event, { xForwardedHost: false, xForwardedProto: true }).origin
  if ((origin && origin !== expected) || getHeader(event, 'sec-fetch-site') === 'cross-site') {
    throw aiToUiError(403, 'Forbidden', 'FORBIDDEN')
  }
  if (!getHeader(event, 'content-type')?.toLowerCase().startsWith('application/json')) {
    throw aiToUiError(415, 'Unsupported Media Type', 'INVALID_REQUEST')
  }
}

/** Parse at most AI_TO_UI_MAX_BODY_BYTES of JSON, whatever Content-Length claims. */
async function readLimitedJson(event: H3Event): Promise<unknown> {
  const { req, res } = event.node
  const tooLarge = () => aiToUiError(413, 'Payload Too Large', 'INVALID_REQUEST')
  if (Number(getHeader(event, 'content-length') ?? 0) > AI_TO_UI_MAX_BODY_BYTES) {
    refuseAiToUiUpload(req, res)
    throw tooLarge()
  }
  const body = isBufferedAiToUiRequest(req)
    ? await readRawBody(event, false)
    : await readAiToUiBody(req, res, { maxBytes: AI_TO_UI_MAX_BODY_BYTES })
  if (!body?.byteLength) throw aiToUiError(400, 'Bad Request', 'INVALID_REQUEST')
  if (body.byteLength > AI_TO_UI_MAX_BODY_BYTES) throw tooLarge()
  try {
    return JSON.parse(body.toString('utf8'))
  } catch {
    throw aiToUiError(400, 'Bad Request', 'INVALID_REQUEST')
  }
}

// A rejected request is a plain HTTP error. An accepted one is answered as
// server-sent events: provisional replies while a model writes, then the result.
export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')
  assertSameOriginJson(event)
  const request = aiToUiRequestSchema.safeParse(await readLimitedJson(event))
  if (!request.success) throw aiToUiError(400, 'Bad Request', 'INVALID_REQUEST')
  const { messages } = request.data

  const config = useRuntimeConfig(event)
  const apiKey = String(config.aiGatewayApiKey || '').trim()
  const databaseUrl = String(config.oferteoDatabaseUrl || '').trim()
  const production = isAiToUiVercelProduction()
  const { mode } = resolveAiToUiMode({ dev: import.meta.dev === true, optIn: config.aiToUiLocalAi, apiKey, production, databaseUrl })
  if (mode === 'unavailable') {
    throw aiToUiError(503, 'Service Unavailable', 'AI_UNAVAILABLE')
  }

  await assertAiToUiHuman(event)
  if (production) {
    const slot = await reserveAiToUiDailySlot(databaseUrl)
    if (!slot.allowed) {
      setHeader(event, 'Retry-After', slot.retryAfterSeconds)
      throw aiToUiError(429, 'Too Many Requests', 'AI_DAILY_LIMIT')
    }
  } else {
    const retryAfterSeconds = takeAiToUiCallSlot()
    if (retryAfterSeconds) {
      setHeader(event, 'Retry-After', retryAfterSeconds)
      throw aiToUiError(429, 'Too Many Requests', 'RATE_LIMITED')
    }
  }

  const model = createGateway({ apiKey })(String(config.aiToUiModel || AI_TO_UI_MODEL))
  const run: AiToUiStreamRun = async (send, signal) => {
    let sent = ''
    const choice = await streamAiToUiChoice(messages, {
      model,
      signal,
      onPartial: (partial) => {
        const reply = buildAiToUiPartialReply(partial)
        if (!reply) return
        const snapshot = JSON.stringify(reply)
        if (snapshot === sent) return
        sent = snapshot
        send({ type: 'partial', data: reply })
      },
    })
    send({ type: 'result', data: buildAiToUiReply(choice) })
  }
  const describeError: AiToUiStreamFailure = (error) => {
    const timedOut = isAiToUiTimeout(error)
    // Log the error class only: never the prompt, the key or a provider body.
    console.warn(`[ai-to-ui] model call failed: ${timedOut ? 'timeout' : error instanceof Error ? error.name : 'unknown'}`)
    return timedOut ? { statusCode: 504, code: 'MODEL_TIMEOUT' } : { statusCode: 502, code: 'MODEL_FAILED' }
  }

  // Stop paying for a reply nobody is waiting for.
  const controller = new AbortController()
  const { res } = event.node
  const onClose = () => { if (!res.writableEnded) controller.abort() }
  res.once('close', onClose)
  setHeader(event, 'Content-Type', 'text/event-stream; charset=utf-8')
  setHeader(event, 'Cache-Control', 'no-store, no-transform')
  setHeader(event, 'X-Accel-Buffering', 'no')
  return sendStream(event, createAiToUiEventStream(controller, run, describeError))
    .finally(() => res.off('close', onClose))
})
