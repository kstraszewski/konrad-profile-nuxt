import assert from 'node:assert/strict'
import { test } from 'node:test'
import { APICallError, RetryError } from 'ai'
import { GatewayModelNotFoundError, GatewayRateLimitError } from '@ai-sdk/gateway'
import { OFERTEO_REALTIME_MODEL } from '../shared/oferteo-realtime.ts'
import { logOferteoAiFailure, oferteoAiDiagnostic, type OferteoAiAuthMethod, type OferteoAiDiagnosticOperation } from '../server/utils/oferteoAiDiagnostics.ts'

const apiError = (statusCode: number) => new APICallError({
  message: 'private-user-text-and-secret-key',
  url: 'https://provider.invalid/private-url?token=private-token',
  requestBodyValues: { apiKey: 'private-api-key', messages: ['private-conversation'] },
  responseBody: 'private-response-body',
  responseHeaders: { authorization: 'Bearer private-authorization' },
  statusCode,
})

test('actual SDK gateway and API error chains produce only safe model, names, types and HTTP status', () => {
  const error = new GatewayModelNotFoundError({
    message: 'private-gateway-message',
    modelId: 'private-model-id',
    generationId: 'private-generation-id',
    cause: apiError(404),
  })
  assert.deepEqual(oferteoAiDiagnostic('realtime-token', { cause: error }, OFERTEO_REALTIME_MODEL), {
    operation: 'realtime-token', model: OFERTEO_REALTIME_MODEL,
    errorName: 'AI_APICallError', gatewayType: 'model_not_found', upstreamStatusCode: 404,
  })
})

test('a final SDK retry status takes priority over wrapper status, cause and earlier financial failures', () => {
  const finalError = new GatewayRateLimitError({ cause: apiError(429) })
  const retry = new RetryError({ message: 'private-retry-details', reason: 'maxRetriesExceeded', errors: [apiError(402), finalError] })
  const wrapped = { cause: { statusCode: 500, lastError: retry, errors: [apiError(401)], cause: apiError(402) } }
  assert.deepEqual(oferteoAiDiagnostic('credits', wrapped), {
    operation: 'credits', errorName: 'AI_APICallError', gatewayType: 'rate_limit_exceeded', upstreamStatusCode: 429,
  })
  assert.deepEqual(oferteoAiDiagnostic('credits', { errors: [apiError(402), apiError(503)] }), {
    operation: 'credits', errorName: 'AI_APICallError', upstreamStatusCode: 503,
  })
})

test('logging never passes exception objects or private strings to console', t => {
  const calls: unknown[][] = []
  t.mock.method(console, 'error', (...args: unknown[]) => { calls.push(args) })
  const error = apiError(401)
  Object.assign(error, { token: 'private-client-token', apiKey: 'private-api-key' })
  logOferteoAiFailure('credits', { cause: error })
  assert.deepEqual(calls, [['[oferto-ai]', { operation: 'credits', errorName: 'AI_APICallError', upstreamStatusCode: 401 }]])
  assert.equal(JSON.stringify(calls).includes('private'), false)
  assert.equal(calls[0]?.includes(error), false)
})

test('arbitrary operation, model, auth method, error names and provider types cannot inject strings into logs', () => {
  assert.equal(oferteoAiDiagnostic('private-operation' as OferteoAiDiagnosticOperation, apiError(500)), undefined)
  assert.deepEqual(oferteoAiDiagnostic('realtime-token', {
    name: 'private-error-name', type: 'private-provider-type',
    code: 'private-provider-code', status: 502, message: 'private-message',
  }, 'private-model' as typeof OFERTEO_REALTIME_MODEL, 'private-auth-key' as OferteoAiAuthMethod), { operation: 'realtime-token', upstreamStatusCode: 502 })
  assert.deepEqual(oferteoAiDiagnostic('credits', apiError(403), OFERTEO_REALTIME_MODEL), {
    operation: 'credits', errorName: 'AI_APICallError', upstreamStatusCode: 403,
  })
  for (const authMethod of ['api-key', 'oidc'] as const) {
    assert.deepEqual(oferteoAiDiagnostic('credits', apiError(401), undefined, authMethod), {
      operation: 'credits', authMethod, errorName: 'AI_APICallError', upstreamStatusCode: 401,
    })
  }
})

test('numeric HTTP statuses are bounded and other payload fields are never inspected', () => {
  for (const status of [undefined, null, true, 99, 600, NaN, Infinity, 429.5, 'secret-502', '502\n']) {
    assert.deepEqual(oferteoAiDiagnostic('credits', { status }), { operation: 'credits' })
  }
  assert.deepEqual(oferteoAiDiagnostic('credits', { status: '502' }), { operation: 'credits', upstreamStatusCode: 502 })
  assert.deepEqual(oferteoAiDiagnostic('credits', { statusCode: 'bad', status: 503 }), { operation: 'credits', upstreamStatusCode: 503 })
  let payloadReads = 0
  const error = {
    name: 'Error', statusCode: 500,
    get message() { payloadReads++; throw new Error('private-message') },
    get stack() { payloadReads++; throw new Error('private-stack') },
    get data() { payloadReads++; throw new Error('private-body') },
    get response() { payloadReads++; throw new Error('private-response') },
  }
  assert.deepEqual(oferteoAiDiagnostic('credits', error), { operation: 'credits', errorName: 'Error', upstreamStatusCode: 500 })
  assert.equal(payloadReads, 0)
})

test('cycles, hostile getters and deeply nested errors remain bounded and do not mask the original failure', () => {
  const cyclic: { cause?: unknown; statusCode: number } = { statusCode: 500 }
  cyclic.cause = cyclic
  assert.deepEqual(oferteoAiDiagnostic('credits', cyclic), { operation: 'credits', upstreamStatusCode: 500 })
  let nested: unknown = apiError(401)
  for (let i = 0; i < 13; i++) nested = { cause: nested }
  assert.deepEqual(oferteoAiDiagnostic('credits', nested), { operation: 'credits' })
  const hostile = new Proxy({}, { get() { throw new Error('private-getter') } })
  assert.deepEqual(oferteoAiDiagnostic('credits', hostile), { operation: 'credits' })
  const revoked = Proxy.revocable([], {})
  revoked.revoke()
  assert.deepEqual(oferteoAiDiagnostic('credits', { statusCode: 500, errors: revoked.proxy }), { operation: 'credits', upstreamStatusCode: 500 })
})

test('a failed diagnostic sink cannot replace the original request error', t => {
  t.mock.method(console, 'error', () => { throw new Error('sink unavailable') })
  assert.doesNotThrow(() => logOferteoAiFailure('credits', apiError(500), undefined, 'oidc'))
})
