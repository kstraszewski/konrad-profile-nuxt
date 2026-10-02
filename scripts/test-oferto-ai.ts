import assert from 'node:assert/strict'
import { test } from 'node:test'
import { APICallError } from 'ai'
import { GatewayFailedDependencyError, GatewayInternalServerError, GatewayRateLimitError } from '@ai-sdk/gateway'
import { analyzeOferteoWithAi, assertOferteoAiAvailable, checkOferteoAiAvailability, handleOferteoAiFailure, oferteoGateway } from '../server/utils/oferteoAi.ts'
import { classifyOferteoAiFailure, createOferteoAiFailureError, createOferteoAiHealth, creditsAvailability, OFERTEO_AI_CREDITS_MESSAGE } from '../server/utils/oferteoAiAvailability.ts'
import { createOfferWithAi } from '../server/utils/oferteoCreator.ts'
import { emptyOfferDraft } from '../shared/types/oferteo-creator.ts'
import type { OferteoMessage } from '../shared/types/oferteo.ts'

const gatewayError = (statusCode: number, responseHeaders?: Record<string, string>) => new APICallError({
  message: 'Upstream diagnostic with private payload',
  statusCode,
  url: 'https://ai-gateway.vercel.sh/v4/ai/language-model',
  requestBodyValues: { prompt: 'private conversation' },
  responseBody: 'private upstream details',
  responseHeaders,
})
const creditsError = (error: unknown) => {
  assert.equal(typeof error, 'object')
  const value = error as { statusCode?: number, message?: string, statusMessage?: string, data?: unknown }
  assert.equal(value.statusCode, 402)
  assert.equal(value.message, OFERTEO_AI_CREDITS_MESSAGE)
  assert.equal(value.statusMessage, 'AI credits exhausted')
  assert.deepEqual(value.data, { code: 'AI_CREDITS_EXHAUSTED', retryable: false })
  return true
}
const messages: OferteoMessage[] = [{ role: 'user', content: 'Szukam remontu łazienki w Warszawie.' }]
const credits = (balance: string) => ({ balance, total_used: '0' })
const response = (body: unknown, status = 200, headers: Record<string, string> = {}) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json', ...headers },
})

test('credit preflight accepts SDK balance strings without exposing amounts', () => {
  for (const balance of ['0', '0.0000', '-0.01', '-1e-9']) assert.equal(creditsAvailability({ balance }), 'credits_exhausted')
  for (const balance of ['1', '0.000000001', '1e-12', ' +0.25 ']) assert.equal(creditsAvailability({ balance }), 'ready')
  for (const balance of ['', ' ', 'NaN', 'Infinity', '1.2 PLN', '0x10', 1, null]) assert.equal(creditsAvailability({ balance }), 'unavailable')
  assert.equal(creditsAvailability({ availableBalance: '0', balance: '10' }), 'credits_exhausted')
  assert.equal(creditsAvailability({ availableBalance: '0.12' }), 'ready')
  assert.equal(creditsAvailability(undefined), 'unavailable')
})

test('financial 402 survives SDK wrappers and final retry causes', () => {
  const financial = new GatewayInternalServerError({ statusCode: 402, cause: gatewayError(402) })
  for (const error of [financial, { cause: financial }, { lastError: financial, errors: [gatewayError(429), financial] }, { errors: [gatewayError(429), financial] }]) {
    assert.deepEqual(classifyOferteoAiFailure(error), { kind: 'credits_exhausted' })
  }
  assert.deepEqual(classifyOferteoAiFailure({ lastError: gatewayError(429), errors: [financial, gatewayError(429)] }), { kind: 'rate_limited' })
  const mapped = createOferteoAiFailureError(classifyOferteoAiFailure(financial))
  creditsError(mapped)
  const serialized = JSON.stringify(mapped)
  assert.equal(serialized.includes('private'), false)
  assert.equal(serialized.includes('balance'), false)
  assert.equal(serialized.includes('cause'), false)
  assert.deepEqual(classifyOferteoAiFailure(mapped), { kind: 'credits_exhausted' })
})

test('provider quotas and unrelated text cannot masquerade as Gateway credit exhaustion', () => {
  const provider = new APICallError({ message: 'insufficient_quota', url: 'https://api.openai.com/v1/responses', requestBodyValues: {}, statusCode: 429 })
  assert.deepEqual(classifyOferteoAiFailure(provider), { kind: 'rate_limited' })
  const dependency = new GatewayFailedDependencyError({ cause: { statusCode: 402, message: 'provider quota' } })
  assert.deepEqual(classifyOferteoAiFailure(dependency), { kind: 'unavailable' })
  assert.deepEqual(classifyOferteoAiFailure({ statusCode: 402, url: 'https://api.example.com/models' }), { kind: 'unavailable' })
  assert.deepEqual(classifyOferteoAiFailure({ message: '402 insufficient credits', data: { response: { status: 402 } } }), { kind: 'unavailable' })
  const cyclic: { cause?: unknown } = {}
  cyclic.cause = cyclic
  assert.deepEqual(classifyOferteoAiFailure(cyclic), { kind: 'unavailable' })
})

test('rate limiting honors Retry-After seconds, dates and SDK cause headers', () => {
  const now = Date.parse('2026-10-02T10:00:00Z')
  assert.deepEqual(classifyOferteoAiFailure(gatewayError(429, { 'Retry-After': '25' }), now), { kind: 'rate_limited', retryAfterSeconds: 25 })
  assert.deepEqual(classifyOferteoAiFailure(gatewayError(429, { 'retry-after': 'Fri, 02 Oct 2026 10:00:07 GMT' }), now), { kind: 'rate_limited', retryAfterSeconds: 7 })
  assert.deepEqual(classifyOferteoAiFailure(new GatewayRateLimitError({ cause: gatewayError(429, { 'retry-after-ms': '1500' }) }), now), { kind: 'rate_limited', retryAfterSeconds: 2 })
  assert.deepEqual(classifyOferteoAiFailure(gatewayError(429, { 'retry-after': '-3' }), now), { kind: 'rate_limited' })
  const mapped = createOferteoAiFailureError({ kind: 'rate_limited', retryAfterSeconds: 25 })
  assert.equal(mapped.statusCode, 429)
  assert.deepEqual(mapped.data, { code: 'AI_RATE_LIMITED', retryable: true, retryAfterSeconds: 25 })
})

test('preflight shares concurrent probes, caches healthy credentials and isolates keys', async () => {
  let now = 0
  let reads = 0
  let finish!: (value: unknown) => void
  const health = createOferteoAiHealth(() => now)
  const read = () => { reads++; return new Promise<unknown>(resolve => { finish = resolve }) }
  const first = health.check('a', true, read)
  const second = health.check('a', true, read)
  assert.equal(reads, 1)
  finish({ balance: '0.15' })
  assert.deepEqual(await first, { availability: 'ready' })
  assert.deepEqual(await second, { availability: 'ready' })
  await health.assertReady('a', true, read)
  assert.equal(reads, 1)
  assert.deepEqual(await health.check('b', false, read), { availability: 'unconfigured' })
  assert.equal(reads, 1)
  assert.deepEqual(await health.check('b', true, async () => ({ balance: '0' })), { availability: 'credits_exhausted', failure: { kind: 'credits_exhausted' } })
  now = 60_000
  assert.deepEqual(await health.check('a', true, async () => ({ balance: '0' })), { availability: 'credits_exhausted', failure: { kind: 'credits_exhausted' } })
})

test('zero credits block paid work for 60 seconds and recover after a fresh probe', async () => {
  let now = 0
  let reads = 0
  const health = createOferteoAiHealth(() => now)
  const read = async () => { reads++; return { availableBalance: reads === 1 ? '0' : '1' } }
  await assert.rejects(health.assertReady('key', true, read), creditsError)
  now = 59_999
  await assert.rejects(health.assertReady('key', true, read), creditsError)
  assert.equal(reads, 1)
  now = 60_000
  await health.assertReady('key', true, read)
  assert.equal(reads, 2)
})

test('mid-request 402 wins over stale credit probes and later concurrent 429', async () => {
  let now = 0
  let finish!: (value: unknown) => void
  const health = createOferteoAiHealth(() => now)
  const probe = health.check('key', true, () => new Promise(resolve => { finish = resolve }))
  now = 5_000
  health.recordFailure('key', gatewayError(402))
  finish({ balance: '10' })
  assert.equal((await probe).availability, 'credits_exhausted')
  health.recordFailure('key', gatewayError(429, { 'retry-after': '2' }))
  now = 64_999
  await assert.rejects(health.assertReady('key', true, async () => { throw new Error('unexpected read') }), creditsError)
  now = 65_000
  await health.assertReady('key', true, async () => ({ balance: '1' }))
})

test('429 cooldown reflects remaining Retry-After and unknown errors do not clear healthy state', async () => {
  let now = 0
  let reads = 0
  const health = createOferteoAiHealth(() => now)
  const read = async () => { reads++; return { balance: '1' } }
  await health.assertReady('key', true, read)
  health.recordFailure('key', new Error('output schema failure'))
  await health.assertReady('key', true, read)
  assert.equal(reads, 1)
  health.recordFailure('key', gatewayError(429, { 'retry-after': '75' }))
  now = 20_000
  await assert.rejects(health.assertReady('key', true, read), error => {
    assert.equal((error as { statusCode: number }).statusCode, 429)
    assert.deepEqual((error as { data: unknown }).data, { code: 'AI_RATE_LIMITED', retryable: true, retryAfterSeconds: 55 })
    return true
  })
  assert.equal(reads, 1)
  now = 75_000
  await health.assertReady('key', true, read)
  assert.equal(reads, 2)
})

test('concurrent financial exhaustion preserves a longer Retry-After in either order', async () => {
  for (const financialFirst of [true, false]) {
    let now = 0
    const health = createOferteoAiHealth(() => now)
    const financial = () => health.recordFailure('key', gatewayError(402))
    const limited = () => health.recordFailure('key', gatewayError(429, { 'retry-after': '120' }))
    if (financialFirst) financial(); else limited()
    now = 1_000
    if (financialFirst) limited(); else financial()
    now = 119_999
    await assert.rejects(health.assertReady('key', true, async () => { throw new Error('unexpected read') }), creditsError)
    now = financialFirst ? 121_000 : 120_000
    await health.assertReady('key', true, async () => ({ balance: '1' }))
  }
})

test('actual SDK preflight prevents matching and creator generation when balance is zero', async (t) => {
  const paths: string[] = []
  t.mock.method(globalThis, 'fetch', async (input: string | URL | Request) => {
    const url = new URL(input instanceof Request ? input.url : input.toString())
    paths.push(url.pathname)
    assert.equal(url.pathname, '/v1/credits', 'paid generation must never be called')
    return response(credits('0'))
  })
  const key = 'dummy-oferteo-test-zero'
  const previous = { ...emptyOfferDraft(), company: 'Moja Firma', description: 'Zachowany szkic.' }
  const before = structuredClone({ messages, previous })
  await assert.rejects(analyzeOferteoWithAi(messages, [], key), creditsError)
  await assert.rejects(createOfferWithAi(messages, previous, key), creditsError)
  assert.deepEqual({ messages, previous }, before)
  assert.deepEqual(paths, ['/v1/credits'])
  assert.equal((await checkOferteoAiAvailability(key)).availability, 'credits_exhausted')
})

test('actual SDK generation 402 is safe and pauses the next request without sample fallback', async (t) => {
  const paths: string[] = []
  t.mock.method(globalThis, 'fetch', async (input: string | URL | Request) => {
    const url = new URL(input instanceof Request ? input.url : input.toString())
    paths.push(url.pathname)
    if (url.pathname === '/v1/credits') return response(credits('0.1'))
    return response({ error: { type: 'quota_for_entity_exceeded', message: 'private account details' } }, 402)
  })
  const key = 'dummy-oferteo-test-midrequest-402'
  await assert.rejects(analyzeOferteoWithAi(messages, [], key), creditsError)
  await assert.rejects(createOfferWithAi(messages, emptyOfferDraft(), key), creditsError)
  assert.deepEqual(paths, ['/v1/credits', '/v4/ai/language-model'])
  assert.equal((await checkOferteoAiAvailability(key)).availability, 'credits_exhausted')
})

test('actual SDK generation 429 respects Retry-After with no automatic paid retries', async (t) => {
  const paths: string[] = []
  t.mock.method(globalThis, 'fetch', async (input: string | URL | Request) => {
    const url = new URL(input instanceof Request ? input.url : input.toString())
    paths.push(url.pathname)
    if (url.pathname === '/v1/credits') return response(credits('0.1'))
    return response({ error: { type: 'rate_limit_exceeded', message: 'Provider request limit' } }, 429, { 'Retry-After': '75' })
  })
  const key = 'dummy-oferteo-test-midrequest-429'
  const limited = (error: unknown) => {
    assert.equal((error as { statusCode: number }).statusCode, 429)
    assert.deepEqual((error as { data: unknown }).data, { code: 'AI_RATE_LIMITED', retryable: true, retryAfterSeconds: 75 })
    return true
  }
  await assert.rejects(analyzeOferteoWithAi(messages, [], key), limited)
  await assert.rejects(createOfferWithAi(messages, emptyOfferDraft(), key), limited)
  assert.deepEqual(paths, ['/v1/credits', '/v4/ai/language-model'])
  assert.equal((await checkOferteoAiAvailability(key)).availability, 'unavailable')
})

test('actual SDK realtime token 402 maps to the same safe paused state', async (t) => {
  const paths: string[] = []
  t.mock.method(globalThis, 'fetch', async (input: string | URL | Request) => {
    const url = new URL(input instanceof Request ? input.url : input.toString())
    paths.push(url.pathname)
    if (url.pathname === '/v1/credits') return response(credits('0.1'))
    return response({ error: { type: 'quota_for_entity_exceeded', message: 'private realtime details' } }, 402)
  })
  const key = 'dummy-oferteo-test-realtime-402'
  await assertOferteoAiAvailable(key)
  try {
    await oferteoGateway(key).experimental_realtime.getToken({ model: 'google/gemini-3.8-flash-live', expiresAfterSeconds: 60 })
    assert.fail('token minting should reject')
  } catch (error) { creditsError(handleOferteoAiFailure(key, error)) }
  await assert.rejects(assertOferteoAiAvailable(key), creditsError)
  assert.equal(paths.length, 2)
  assert.equal(paths[0], '/v1/credits')
  assert.match(paths[1]!, /realtime/)
})
