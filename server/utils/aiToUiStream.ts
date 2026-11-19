import type { AiToUiStreamEvent } from '../../shared/types/ai-to-ui.ts'

export type AiToUiStreamRun = (send: (event: AiToUiStreamEvent) => void, signal: AbortSignal) => Promise<void>
export type AiToUiStreamFailure = (error: unknown) => { statusCode: number, code: string }

/**
 * One reply as server-sent events. `run` emits provisional replies and then the
 * validated result. If it rejects, the client gets a single app-owned `error`
 * event: no exception text, prompt or provider payload leaves the server.
 * Aborting `controller` (client gone) closes the stream and stops `run`.
 */
export function createAiToUiEventStream(
  controller: AbortController,
  run: AiToUiStreamRun,
  describeError: AiToUiStreamFailure,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  let closed = false
  let close = () => {}
  return new ReadableStream<Uint8Array>({
    start(output) {
      close = () => {
        if (closed) return
        closed = true
        controller.signal.removeEventListener('abort', close)
        output.close()
      }
      const send = (event: AiToUiStreamEvent) => {
        if (!closed && !controller.signal.aborted) output.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
      }
      controller.signal.addEventListener('abort', close, { once: true })
      if (controller.signal.aborted) {
        close()
        return
      }
      // A comment frame gets the response headers out before the first event.
      output.enqueue(encoder.encode(': open\n\n'))
      void run(send, controller.signal)
        .catch((error: unknown) => send({ type: 'error', error: describeError(error) }))
        .finally(close)
    },
    cancel() {
      // The reader went away. The readable is already closed for us.
      closed = true
      controller.signal.removeEventListener('abort', close)
      controller.abort()
    },
  })
}
