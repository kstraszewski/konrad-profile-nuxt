import test from 'node:test'
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { readOferteoStream, requestOferteoStream } from '../app/utils/oferteoStream.ts'
import { chatStreamPreview, createOferteoDataStream, offerStreamPreview, oferteoRequestCancellation, oferteoStreamFailure } from '../server/utils/oferteoStream.ts'
import { oferteoUiFailure } from '../shared/oferteo-errors.ts'
import { emptyOfferDraft } from '../shared/types/oferteo-creator.ts'
import type { H3Event } from 'h3'
import type { OferteoContractor } from '../shared/types/oferteo.ts'
import { emptyBrief } from '../server/utils/oferteoCore.ts'

const encoder = new TextEncoder()
const frame = (event: unknown) => `data: ${JSON.stringify(event)}\n\n`
function bytes(chunks: Uint8Array[]) {
  return new ReadableStream<Uint8Array>({ start(controller) { chunks.forEach(chunk => controller.enqueue(chunk)); controller.close() } })
}
const deferred = <T = void>() => {
  let resolve!: (value: T) => void
  const promise = new Promise<T>(done => { resolve = done })
  return { promise, resolve }
}

test('SSE reads split Polish UTF-8, CRLF frames, comments and multiline data', async () => {
  const content = ': heartbeat\r\n\r\n' + frame({ type: 'partial', data: { message: 'Łazienka 🛁' } }).replaceAll('\n', '\r\n')
    + 'data: {"type":"result",\r\ndata: "data":{"message":"Gotowe — żółć"}}\r\n\r\n'
  const encoded = encoder.encode(content)
  for (let index = 1; index < encoded.length; index++) {
    const partials: unknown[] = []
    const result = await readOferteoStream(bytes([encoded.slice(0, index), encoded.slice(index)]), { onPartial: partial => partials.push(partial) })
    assert.deepEqual(partials, [{ message: 'Łazienka 🛁' }])
    assert.deepEqual(result, { message: 'Gotowe — żółć' })
  }
})

test('partial is delivered before the operation finishes, then result commits once', async () => {
  const gate = deferred()
  const arrived = deferred()
  const partials: unknown[] = []
  const stream = createOferteoDataStream(new AbortController(), async (_signal, onPartial) => {
    onPartial({ message: 'Pierwsze słowa' })
    await gate.promise
    onPartial({ message: 'Pierwsze słowa i dalsza odpowiedź' })
    return { message: 'Pełny wynik', offers: [] }
  })
  let finished = false
  const request = readOferteoStream(stream, { onPartial: partial => { partials.push(partial); arrived.resolve() } }).then(result => { finished = true; return result })
  await arrived.promise
  assert.equal(finished, false)
  assert.deepEqual(partials, [{ message: 'Pierwsze słowa' }])
  gate.resolve()
  assert.deepEqual(await request, { message: 'Pełny wynik', offers: [] })
  assert.equal(partials.length, 2)
})

test('mid-stream errors preserve credits and Retry-After without provider details', async () => {
  for (const statusCode of [402, 429, 502]) {
    const source = { statusCode, message: 'SECRET provider stack', data: { retryAfterSeconds: 19, secret: 'SECRET' } }
    const stream = createOferteoDataStream(new AbortController(), async (_signal, onPartial) => {
      onPartial({ message: 'Początek' })
      throw source
    })
    await assert.rejects(readOferteoStream(stream), cause => {
      assert.equal(JSON.stringify(cause).includes('SECRET'), false)
      const failure = oferteoUiFailure(cause, 1000)
      assert.equal(failure.creditsExhausted, statusCode === 402)
      if (statusCode === 429) assert.equal(failure.retryAt, 20_000)
      return true
    })
  }
  assert.deepEqual(oferteoStreamFailure(new Error('SECRET')), { statusCode: 502, data: { code: 'AI_UNAVAILABLE', retryable: true } })
})

test('truncated, invalid and oversized streams never commit a partial as final', async () => {
  for (const content of [frame({ type: 'partial', data: { message: 'Niepełna odpowiedź' } }), 'data: invalid\n\n', frame({ type: 'unknown' }), 'x'.repeat(256_001)]) {
    await assert.rejects(readOferteoStream(bytes([encoder.encode(content)])), cause => {
      assert.equal((cause as { statusCode: number }).statusCode, 502)
      return true
    })
  }
})

test('client Stop cancels a pending read and aborts server operation', async () => {
  const client = new AbortController()
  const server = new AbortController()
  const partial = deferred()
  const aborted = deferred()
  const stream = createOferteoDataStream(server, async (signal, onPartial) => {
    signal.addEventListener('abort', () => aborted.resolve(), { once: true })
    onPartial({ message: 'W trakcie' })
    await aborted.promise
    signal.throwIfAborted()
    return { message: 'Nie powinno się wyświetlić' }
  })
  const request = readOferteoStream(stream, { signal: client.signal, onPartial: () => partial.resolve() })
  await partial.promise
  client.abort()
  await assert.rejects(request, cause => (cause as Error).name === 'AbortError')
  await aborted.promise
  assert.equal(server.signal.aborted, true)
})

test('request negotiates SSE and rejects HTTP failures and JSON responses', async (t) => {
  const result = { message: 'Gotowe' }
  t.mock.method(globalThis, 'fetch', async (_url: unknown, init: RequestInit) => {
    assert.equal((init.headers as Record<string, string>).Accept, 'text/event-stream')
    assert.equal(init.credentials, 'same-origin')
    assert.deepEqual(JSON.parse(String(init.body)), { messages: [] })
    return new Response(frame({ type: 'result', data: result }), { headers: { 'Content-Type': 'text/event-stream' } })
  })
  assert.deepEqual(await requestOferteoStream('/api/oferto/chat', { messages: [] }), result)
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ data: { code: 'AI_CREDITS_EXHAUSTED' } }), { status: 402 }))
  await assert.rejects(requestOferteoStream('/api/oferto/chat', {}), cause => oferteoUiFailure(cause).creditsExhausted)
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } }))
  await assert.rejects(requestOferteoStream('/api/oferto/chat', {}))
})

test('request cancellation follows response disconnect, not a fully read POST body', () => {
  const req = Object.assign(new EventEmitter(), { aborted: false })
  const res = Object.assign(new EventEmitter(), { writableEnded: false, destroyed: false })
  const cancellation = oferteoRequestCancellation({ node: { req, res } } as unknown as H3Event)
  req.emit('close')
  assert.equal(cancellation.controller.signal.aborted, false)
  res.emit('close')
  assert.equal(cancellation.controller.signal.aborted, true)
  cancellation.dispose()
  assert.equal(req.listenerCount('aborted'), 0)
  assert.equal(res.listenerCount('close'), 0)
})

test('chat previews never expose contractor IDs, firm claims or invented numbers', () => {
  const catalog = [{ name: 'Firma Źródłowa' }] as OferteoContractor[]
  const messages = [{ role: 'user' as const, content: 'Łazienka 6 m² w Warszawie' }]
  const brief = { ...emptyBrief(), city: 'Warszawa', service: 'Remont łazienki', area: '6 m²' }
  const preview = chatStreamPreview({ message: 'Opisz łazienkę 6 m².', brief, intent: 'search', contractorIds: ['private-id'] }, catalog, messages)
  assert.deepEqual(preview, { message: 'Opisz łazienkę 6 m².', brief })
  for (const message of ['Koszt wynosi 100 zł.', 'Firma Źródłowa jest najlepsza.', 'https://secret.example']) {
    assert.equal(chatStreamPreview({ message, brief, intent: 'search' }, catalog, messages).message, '')
  }
  assert.equal(chatStreamPreview({ message: 'Porada przed ustaleniem intencji' }, catalog, messages).message, undefined)
  assert.equal(chatStreamPreview({ message: 'Cena to 6 zł.', brief, intent: 'price' }, catalog, messages).message?.includes('Cena to'), false)
  assert.equal(chatStreamPreview({ message: 'Odpowiedź nie na temat.', brief, intent: 'off_topic' }, catalog, messages).message?.includes('nie na temat'), false)
})

test('offer preview streams prose while commercial fields require grounded values', () => {
  const previous = { ...emptyOfferDraft(), company: 'Moja firma', price: 'od 100 zł brutto' }
  const messages = [{ role: 'user' as const, content: 'Firma: Moja firma. Cena: od 100 zł brutto. Termin: 2 tygodnie' }]
  const partial = { message: 'Przygotowuję', draft: { description: 'Remont łazienki', company: 'Wymyślona firma', price: '100 zł', timing: '2 tygodnie', scope: ['płytki', undefined] } }
  assert.deepEqual(offerStreamPreview(partial, previous, messages), { message: 'Przygotowuję', draft: { description: 'Remont łazienki', timing: '2 tygodnie' } })
  assert.deepEqual(offerStreamPreview({ draft: { company: 'Moja firma', price: 'od 100 zł brutto' } }, previous, messages).draft, { company: 'Moja firma', price: 'od 100 zł brutto' })
})
