import assert from 'node:assert/strict'
import { test, type TestContext } from 'node:test'
import { analyzeOferteoWithAi, checkOferteoAiAvailability, type OferteoMatchingPartial } from '../server/utils/oferteoAi.ts'
import { createOfferWithAi, type OfferCreatorAiPartial } from '../server/utils/oferteoCreator.ts'
import { emptyOfferDraft } from '../shared/types/oferteo-creator.ts'
import type { OferteoMessage } from '../shared/types/oferteo.ts'

const messages: OferteoMessage[] = [{ role: 'user', content: 'Firma: Alfa. Remont łazienki w Warszawie.' }]
const matching = {
  message: 'Zerknij na dopasowanych wykonawców.',
  brief: { service: 'Remont łazienki', city: 'Warszawa', scope: 'kompleksowy remont', area: null, budget: null, timing: null },
  intent: 'search', contractorIds: [],
}

function mockGatewayStream(t: TestContext) {
  const started = Promise.withResolvers<void>()
  const encoder = new TextEncoder()
  let controller!: ReadableStreamDefaultController<Uint8Array>
  let signal: AbortSignal | undefined
  let closed = false
  let creditsReads = 0
  t.mock.method(globalThis, 'fetch', async (input: string | URL | Request, init?: RequestInit) => {
    const url = new URL(input instanceof Request ? input.url : input.toString())
    if (url.pathname === '/v1/credits') {
      creditsReads++
      return Response.json({ balance: '1', total_used: '0' })
    }
    assert.equal(url.pathname, '/v4/ai/language-model')
    signal = init?.signal ?? undefined
    const body = new ReadableStream<Uint8Array>({ start(value) { controller = value } })
    signal?.addEventListener('abort', () => {
      if (!closed) { closed = true; controller.error(signal?.reason) }
    }, { once: true })
    started.resolve()
    return new Response(body, { headers: { 'content-type': 'text/event-stream' } })
  })
  const send = (part: unknown) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(part)}\n\n`))
  return {
    started: started.promise,
    get signal() { return signal },
    get creditsReads() { return creditsReads },
    start() {
      send({ type: 'stream-start', warnings: [] })
      send({ type: 'text-start', id: 'answer' })
    },
    text(delta: string) { send({ type: 'text-delta', id: 'answer', delta }) },
    error(error: unknown) { send({ type: 'error', error }) },
    finish() {
      send({ type: 'text-end', id: 'answer' })
      send({ type: 'finish', finishReason: { unified: 'stop', raw: 'stop' }, usage: {
        inputTokens: { total: 10, noCache: 10, cacheRead: 0, cacheWrite: 0 },
        outputTokens: { total: 20, text: 20, reasoning: 0 },
      } })
      closed = true
      controller.close()
    },
  }
}

test('matching emits real partial snapshots before the provider completes', { timeout: 3_000 }, async (t) => {
  const gateway = mockGatewayStream(t)
  const first = Promise.withResolvers<OferteoMatchingPartial>()
  let completed = false
  const generation = analyzeOferteoWithAi(messages, [], 'dummy-stream-matching', undefined, {
    onPartial(partial) { if (partial.message) first.resolve(partial) },
  }).then(value => { completed = true; return value })
  await gateway.started
  gateway.start()
  const json = JSON.stringify(matching)
  const prefix = '{"message":"Zerknij na'
  gateway.text(prefix)
  const partial = await first.promise
  assert.equal(partial.message, 'Zerknij na')
  assert.equal(partial.brief, undefined)
  assert.equal(completed, false, 'the partial must arrive while generation is still pending')
  gateway.text(json.slice(prefix.length))
  gateway.finish()
  assert.deepEqual(await generation, matching)
})

test('creator streams the message and draft while preserving final grounding', { timeout: 3_000 }, async (t) => {
  const gateway = mockGatewayStream(t)
  const draftPartial = Promise.withResolvers<OfferCreatorAiPartial>()
  const output = { message: 'Aktualizuję szkic.', draft: {
    ...emptyOfferDraft(), title: 'Remont łazienki', company: 'Alfa', service: 'Remont łazienki', location: 'Warszawa',
    scope: ['kompleksowy remont'], description: 'Remont łazienki w Warszawie.',
  }, suggestions: ['Podaj termin'] }
  let completed = false
  const generation = createOfferWithAi(messages, null, 'dummy-stream-creator', undefined, {
    onPartial(partial) { if (partial.draft?.title) draftPartial.resolve(partial) },
  }).then(value => { completed = true; return value })
  await gateway.started
  gateway.start()
  const json = JSON.stringify(output)
  const prefix = '{"message":"Aktualizuję szkic.","draft":{"title":"Remont łazienki"'
  gateway.text(prefix)
  assert.equal((await draftPartial.promise).draft?.title, 'Remont łazienki')
  assert.equal(completed, false)
  gateway.text(json.slice(prefix.length))
  gateway.finish()
  const result = await generation
  assert.deepEqual(result.draft, output.draft)
  assert.equal(result.mode, 'live')
  assert.equal(result.ready, true)
})

test('incomplete final JSON rejects safely after delivering partials', { timeout: 3_000 }, async (t) => {
  const gateway = mockGatewayStream(t)
  const partials: OferteoMatchingPartial[] = []
  const generation = analyzeOferteoWithAi(messages, [], 'dummy-stream-invalid', undefined, {
    onPartial(partial) { partials.push(partial) },
  })
  const rejected = assert.rejects(generation, (error: unknown) => {
    assert.equal((error as { statusCode: number }).statusCode, 502)
    assert.doesNotMatch(JSON.stringify(error), /private provider details/)
    return true
  })
  await gateway.started
  gateway.start()
  gateway.text('{"message":"Częściowa odpowiedź"}')
  gateway.finish()
  await rejected
  assert.ok(partials.some(partial => partial.message === 'Częściowa odpowiedź'))
})

test('mid-stream rate limits retain the Gateway error and Retry-After', { timeout: 3_000 }, async (t) => {
  const gateway = mockGatewayStream(t)
  const generation = analyzeOferteoWithAi(messages, [], 'dummy-stream-limited', undefined, { onPartial() {} })
  const rejected = assert.rejects(generation, (error: unknown) => {
    const value = error as { statusCode: number, data: unknown }
    assert.equal(value.statusCode, 429)
    assert.deepEqual(value.data, { code: 'AI_RATE_LIMITED', retryable: true, retryAfterSeconds: 40 })
    return true
  })
  await gateway.started
  gateway.start()
  gateway.error({ statusCode: 429, url: 'https://ai-gateway.vercel.sh/v4/ai/language-model', responseHeaders: { 'retry-after': '40' }, message: 'private provider details' })
  gateway.finish()
  await rejected
  assert.equal((await checkOferteoAiAvailability('dummy-stream-limited')).availability, 'unavailable')
})

test('creator rejects invented commercial facts after provisional output', { timeout: 3_000 }, async (t) => {
  const gateway = mockGatewayStream(t)
  const partials: OfferCreatorAiPartial[] = []
  const generation = createOfferWithAi(messages, null, 'dummy-stream-ungrounded', undefined, {
    onPartial(partial) { partials.push(partial) },
  })
  const rejected = assert.rejects(generation, (error: unknown) => {
    assert.equal((error as { statusCode: number }).statusCode, 502)
    return true
  })
  await gateway.started
  gateway.start()
  gateway.text(JSON.stringify({ message: 'Aktualizuję szkic.', draft: {
    ...emptyOfferDraft(), company: 'Firma wymyślona przez model', price: '900 zł', timing: 'jutro',
  }, suggestions: [] }))
  gateway.finish()
  await rejected
  assert.ok(partials.some(partial => partial.draft?.company), 'the final grounding check must still run after provisional snapshots')
})

test('a failed partial consumer aborts unfinished provider work', { timeout: 3_000 }, async (t) => {
  const gateway = mockGatewayStream(t)
  const generation = analyzeOferteoWithAi(messages, [], 'dummy-stream-callback-failed', undefined, {
    onPartial() { throw new Error('private HTTP write failure') },
  })
  const rejected = assert.rejects(generation, (error: unknown) => {
    assert.equal((error as { statusCode: number }).statusCode, 502)
    assert.doesNotMatch(JSON.stringify(error), /private HTTP write failure/)
    return true
  })
  await gateway.started
  gateway.start()
  gateway.text('{"message":"Zerknij na')
  await rejected
  assert.equal(gateway.signal?.aborted, true)
})

test('client abort reaches the provider and does not poison shared availability', { timeout: 3_000 }, async (t) => {
  const gateway = mockGatewayStream(t)
  const controller = new AbortController()
  const first = Promise.withResolvers<void>()
  const generation = analyzeOferteoWithAi(messages, [], 'dummy-stream-aborted', undefined, {
    signal: controller.signal, onPartial(partial) { if (partial.message) first.resolve() },
  })
  const reason = new DOMException('Client disconnected', 'AbortError')
  const rejected = assert.rejects(generation, error => error === reason)
  await gateway.started
  gateway.start()
  gateway.text('{"message":"Zerknij na')
  await first.promise
  controller.abort(reason)
  await rejected
  assert.equal(gateway.signal?.aborted, true)
  assert.equal((await checkOferteoAiAvailability('dummy-stream-aborted')).availability, 'ready')
  assert.equal(gateway.creditsReads, 1)
})

test('an already aborted request performs no Gateway work', async (t) => {
  let calls = 0
  t.mock.method(globalThis, 'fetch', async () => { calls++; throw new Error('Unexpected Gateway request') })
  const reason = new DOMException('Client disconnected', 'AbortError')
  const signal = AbortSignal.abort(reason)
  await assert.rejects(analyzeOferteoWithAi(messages, [], 'dummy-stream-preaborted', undefined, { signal, onPartial() {} }), error => error === reason)
  await assert.rejects(createOfferWithAi(messages, null, 'dummy-creator-preaborted', undefined, { signal, onPartial() {} }), error => error === reason)
  assert.equal(calls, 0)
})
