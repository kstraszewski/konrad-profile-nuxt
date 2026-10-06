import type { OferteoStreamEvent } from '../../shared/types/oferteo-stream.ts'

const streamFailure = () => ({ statusCode: 502, data: { code: 'AI_UNAVAILABLE', retryable: true } })

/** Decode SSE frames independently of network chunks, including split UTF-8. */
export async function readOferteoStream<Result, Partial>(
  body: ReadableStream<Uint8Array>,
  options: { signal?: AbortSignal; onPartial?: (partial: Partial) => void } = {},
): Promise<Result> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let result: Result | undefined
  let complete = false
  const abort = () => { void reader.cancel().catch(() => {}) }
  options.signal?.addEventListener('abort', abort, { once: true })
  const consume = (frame: string) => {
    const data = frame.split(/\r?\n/).filter(line => line.startsWith('data:'))
      .map(line => line.slice(5).replace(/^ /, '')).join('\n')
    if (!data) return // Heartbeats and SSE comments.
    let event: OferteoStreamEvent<Result, Partial>
    try { event = JSON.parse(data) } catch { throw streamFailure() }
    if (!event || typeof event !== 'object') throw streamFailure()
    if (event.type === 'error') throw event.error || streamFailure()
    if (event.type === 'partial' && event.data && typeof event.data === 'object') options.onPartial?.(event.data)
    else if (event.type === 'result' && event.data && typeof event.data === 'object') { result = event.data; complete = true }
    else throw streamFailure()
  }
  try {
    options.signal?.throwIfAborted()
    while (!complete) {
      const { value, done } = await reader.read()
      options.signal?.throwIfAborted()
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true })
      // A broken/malicious stream must not accumulate unbounded data.
      if (buffer.length > 256_000) throw streamFailure()
      let boundary: RegExpExecArray | null
      while ((boundary = /\r?\n\r?\n/.exec(buffer))) {
        const frame = buffer.slice(0, boundary.index)
        buffer = buffer.slice(boundary.index + boundary[0].length)
        consume(frame)
        if (complete) break
      }
      if (done) {
        if (!complete) throw streamFailure() // EOF without a validated result is failure.
        break
      }
    }
    return result!
  } finally {
    options.signal?.removeEventListener('abort', abort)
    await reader.cancel().catch(() => {})
    reader.releaseLock()
  }
}

export async function requestOferteoStream<Result, Partial>(
  url: string,
  body: unknown,
  options: { signal?: AbortSignal; onPartial?: (partial: Partial) => void } = {},
): Promise<Result> {
  const timeout = new AbortController()
  const timer = setTimeout(() => timeout.abort(new DOMException('Request timed out', 'TimeoutError')), 65_000)
  const signal = options.signal ? AbortSignal.any([options.signal, timeout.signal]) : timeout.signal
  try {
    signal.throwIfAborted()
    const response = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      credentials: 'same-origin', body: JSON.stringify(body), signal,
    })
    if (!response.ok) {
      const data: unknown = await response.json().catch(() => ({}))
      throw { statusCode: response.status, data, response }
    }
    if (!response.headers.get('content-type')?.includes('text/event-stream') || !response.body) throw streamFailure()
    return await readOferteoStream<Result, Partial>(response.body, { ...options, signal })
  } finally { clearTimeout(timer) }
}
