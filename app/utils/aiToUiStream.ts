import type { AiToUiMessage, AiToUiReply, AiToUiStreamEvent } from '../../shared/types/ai-to-ui.ts'

type ReadOptions = { signal?: AbortSignal, onPartial?: (reply: AiToUiReply) => void }

// Failures carry a status code only. The page maps it to its own copy.
const brokenStream = () => ({ statusCode: 502 })
const isReply = (value: unknown): value is AiToUiReply =>
  typeof value === 'object' && value !== null && typeof (value as { view?: unknown }).view === 'string'
  && typeof (value as { answer?: unknown }).answer === 'string'

/**
 * Read one reply from a server-sent event stream. Frames are decoded
 * independently of network chunks, including UTF-8 split across them.
 * A stream that ends without a `result` event is a failure.
 */
export async function readAiToUiStream(body: ReadableStream<Uint8Array>, options: ReadOptions = {}): Promise<AiToUiReply> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let result: AiToUiReply | undefined
  const abort = () => { void reader.cancel().catch(() => {}) }
  options.signal?.addEventListener('abort', abort, { once: true })

  const consume = (frame: string) => {
    const data = frame.split(/\r?\n/).filter(line => line.startsWith('data:'))
      .map(line => line.slice(5).replace(/^ /, '')).join('\n')
    if (!data) return // Comment frames.
    let event: AiToUiStreamEvent
    try {
      event = JSON.parse(data)
    } catch {
      throw brokenStream()
    }
    if (event?.type === 'error') throw { statusCode: Number(event.error?.statusCode) || 502 }
    if (event?.type === 'partial' && isReply(event.data)) options.onPartial?.(event.data)
    else if (event?.type === 'result' && isReply(event.data)) result = event.data
    else throw brokenStream()
  }

  try {
    options.signal?.throwIfAborted()
    while (!result) {
      const { value, done } = await reader.read()
      options.signal?.throwIfAborted()
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true })
      // A broken stream must not grow without bound.
      if (buffer.length > 256_000) throw brokenStream()
      let boundary: RegExpExecArray | null
      while (!result && (boundary = /\r?\n\r?\n/.exec(buffer))) {
        const frame = buffer.slice(0, boundary.index)
        buffer = buffer.slice(boundary.index + boundary[0].length)
        consume(frame)
      }
      if (done && !result) throw brokenStream()
    }
    return result
  } finally {
    options.signal?.removeEventListener('abort', abort)
    // Let go of the connection without waiting for it: the reply is already complete.
    void reader.cancel().catch(() => {})
    reader.releaseLock()
  }
}

/** Ask a question and follow the reply as it is built. */
export async function requestAiToUiReply(messages: AiToUiMessage[], options: ReadOptions = {}): Promise<AiToUiReply> {
  const response = await fetch('/api/ai-to-ui/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
    credentials: 'same-origin',
    body: JSON.stringify({ messages }),
    signal: options.signal,
  })
  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { data?: { code?: unknown } } | null
    const code = typeof payload?.data?.code === 'string' ? payload.data.code : undefined
    throw { statusCode: response.status, code }
  }
  if (!response.headers.get('content-type')?.includes('text/event-stream') || !response.body) throw brokenStream()
  return readAiToUiStream(response.body, options)
}
