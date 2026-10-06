import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { test, type TestContext } from 'node:test'
import { createApp, defineEventHandler, readBody, toNodeListener, type H3Event } from 'h3'
import { oferteoRequestCancellation, sendOferteoStream } from '../server/utils/oferteoStream.ts'

async function serve(t: TestContext, handler: (event: H3Event) => Promise<void>) {
  const app = createApp().use(defineEventHandler(handler))
  const server = createServer(toNodeListener(app))
  t.after(async () => {
    server.closeAllConnections()
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => { server.off('error', reject); resolve() })
  })
  const address = server.address()
  assert.ok(address && typeof address === 'object')
  return `http://127.0.0.1:${address.port}/api/oferto/chat`
}

function listenerCounts(event: H3Event) {
  return { requestAborted: event.node.req.listenerCount('aborted'), responseClose: event.node.res.listenerCount('close') }
}

async function readUntilPartial(reader: ReadableStreamDefaultReader<Uint8Array>, decoder: TextDecoder) {
  let text = ''
  while (!text.split('\n\n').slice(0, -1).some(frame => frame.startsWith('data: ') && frame.includes('"type":"partial"'))) {
    const chunk = await reader.read()
    assert.equal(chunk.done, false, 'the response must deliver a partial before EOF')
    text += decoder.decode(chunk.value, { stream: true })
  }
  return text
}

async function readToEnd(reader: ReadableStreamDefaultReader<Uint8Array>, decoder: TextDecoder, text: string) {
  while (true) {
    const chunk = await reader.read()
    if (chunk.done) return text + decoder.decode()
    text += decoder.decode(chunk.value, { stream: true })
  }
}

function events(text: string) {
  return text.split('\n\n').filter(frame => frame.startsWith('data: ')).map(frame => JSON.parse(frame.slice(6)))
}

test('real HTTP POST flushes partial SSE before final success or a safe mid-stream error', { timeout: 5_000 }, async (t) => {
  for (const outcome of ['success', 'error'] as const) {
    const gate = Promise.withResolvers<void>()
    const disposed = Promise.withResolvers<{ before: ReturnType<typeof listenerCounts>, after: ReturnType<typeof listenerCounts> }>()
    let operationFinished = false
    let bodyRead = false
    let operationSignal: AbortSignal | undefined
    const url = await serve(t, async event => {
      const body = await readBody(event)
      assert.deepEqual(body, { message: 'Żółć i łazienka 🛁' })
      bodyRead = event.node.req.readableEnded
      const before = listenerCounts(event)
      const cancellation = oferteoRequestCancellation(event)
      try {
        await sendOferteoStream(event, cancellation, async (signal, onPartial) => {
          operationSignal = signal
          assert.equal(signal.aborted, false, 'a completed POST body must not cancel the response')
          onPartial({ message: 'Pierwsze słowa — łazienka 🛁' })
          await gate.promise
          signal.throwIfAborted()
          operationFinished = true
          if (outcome === 'error') throw { statusCode: 429, message: 'SECRET provider details', data: { retryAfterSeconds: 17, secret: 'SECRET' } }
          return { message: 'Pełna odpowiedź', offers: [] }
        })
      } finally {
        disposed.resolve({ before, after: listenerCounts(event) })
      }
    })
    t.after(() => gate.resolve())
    const response = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      body: JSON.stringify({ message: 'Żółć i łazienka 🛁' }),
    })
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('content-type'), 'text/event-stream; charset=utf-8')
    assert.equal(response.headers.get('cache-control'), 'no-store, no-transform')
    assert.equal(response.headers.get('x-accel-buffering'), 'no')
    assert.equal(response.headers.get('content-length'), null)
    assert.ok(response.body)
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    const partialText = await readUntilPartial(reader, decoder)
    assert.equal(bodyRead, true)
    assert.equal(operationFinished, false, 'network bytes must arrive before the operation gate opens')
    assert.equal(operationSignal?.aborted, false)
    assert.deepEqual(events(partialText), [{ type: 'partial', data: { message: 'Pierwsze słowa — łazienka 🛁' } }])
    gate.resolve()
    const allText = await readToEnd(reader, decoder, partialText)
    reader.releaseLock()
    const received = events(allText)
    assert.equal(received.length, 2)
    assert.deepEqual(received[1], outcome === 'success'
      ? { type: 'result', data: { message: 'Pełna odpowiedź', offers: [] } }
      : { type: 'error', error: { statusCode: 429, data: { code: 'AI_RATE_LIMITED', retryable: true, retryAfterSeconds: 17 } } })
    assert.doesNotMatch(allText, /SECRET/)
    assert.equal(operationSignal?.aborted, false, 'normal EOF must not mark a successful request as cancelled')
    const cleanup = await disposed.promise
    assert.deepEqual(cleanup.after, cleanup.before, 'response and request cancellation listeners must be removed')
  }
})

test('aborting a real fetch body cancels the server operation and removes listeners', { timeout: 5_000 }, async (t) => {
  const aborted = Promise.withResolvers<void>()
  const disposed = Promise.withResolvers<{ signal: AbortSignal, before: ReturnType<typeof listenerCounts>, after: ReturnType<typeof listenerCounts> }>()
  const url = await serve(t, async event => {
    assert.deepEqual(await readBody(event), { message: 'Stop po pierwszych słowach' })
    const before = listenerCounts(event)
    const cancellation = oferteoRequestCancellation(event)
    try {
      await sendOferteoStream(event, cancellation, async (signal, onPartial) => {
        signal.addEventListener('abort', () => aborted.resolve(), { once: true })
        onPartial({ message: 'Generowanie w toku' })
        await aborted.promise
        signal.throwIfAborted()
        return { message: 'Niedozwolony wynik po anulowaniu' }
      })
    } finally {
      disposed.resolve({ signal: cancellation.controller.signal, before, after: listenerCounts(event) })
    }
  })
  const controller = new AbortController()
  const response = await fetch(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
    body: JSON.stringify({ message: 'Stop po pierwszych słowach' }), signal: controller.signal,
  })
  assert.ok(response.body)
  const reader = response.body.getReader()
  const text = await readUntilPartial(reader, new TextDecoder())
  assert.deepEqual(events(text), [{ type: 'partial', data: { message: 'Generowanie w toku' } }])
  const rejectedRead = assert.rejects(reader.read(), error => (error as Error).name === 'AbortError')
  controller.abort()
  await rejectedRead
  reader.releaseLock()
  await aborted.promise
  const cleanup = await disposed.promise
  assert.equal(cleanup.signal.aborted, true)
  assert.deepEqual(cleanup.after, cleanup.before, 'disconnect cleanup must remove both cancellation listeners')
})
