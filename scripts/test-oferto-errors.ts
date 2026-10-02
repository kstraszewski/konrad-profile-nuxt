import assert from 'node:assert/strict'
import { test } from 'node:test'
import { OFERTEO_CREDITS_MESSAGE, oferteoUiFailure } from '../shared/oferteo-errors.ts'

test('exhausted credits are distinct from rate limits in fetch and realtime setup errors', () => {
  for (const cause of [{ statusCode: 402 }, { data: { data: { code: 'AI_CREDITS_EXHAUSTED', retryable: false } } }, new Error('Failed to fetch realtime setup: 402')]) {
    const failure = oferteoUiFailure(cause)
    assert.equal(failure.message, OFERTEO_CREDITS_MESSAGE)
    assert.equal(failure.creditsExhausted, true)
    assert.equal(failure.retryable, false)
  }
  const rateLimit = oferteoUiFailure({ statusCode: 429 }, 1000)
  assert.equal(rateLimit.creditsExhausted, false)
  assert.equal(rateLimit.retryable, true)
  assert.equal(rateLimit.retryAt, 61_000)
})

test('retry-after is respected from structured data and headers', () => {
  assert.equal(oferteoUiFailure({ statusCode: 429, data: { data: { retryAfterSeconds: 120 } } }, 1000).retryAt, 121_000)
  assert.equal(oferteoUiFailure({ statusCode: 429, data: { data: { retryAfterSeconds: 0 } } }, 1000).retryAt, 2000)
  assert.equal(oferteoUiFailure({ response: { status: 429, headers: new Headers({ 'retry-after': '30' }) } }, 1000).retryAt, 31_000)
  assert.equal(oferteoUiFailure({ response: { status: 429, headers: new Headers({ 'retry-after': 'Thu, 01 Jan 1970 00:02:00 GMT' }) } }, 1000).retryAt, 120_000)
})

test('error messages retain context without exposing raw provider or network bodies', () => {
  assert.match(oferteoUiFailure({ statusCode: 503, data: { data: { code: 'CATALOG_UNAVAILABLE' } } }).message, /Katalog wykonawców/)
  for (const cause of [new Error('private-token-or-prompt'), { statusCode: 502, data: { message: 'private-token-or-prompt', statusMessage: 'private-token-or-prompt' } }]) {
    const failure = oferteoUiFailure(cause)
    assert.doesNotMatch(failure.message, /private-token-or-prompt/)
    assert.match(failure.message, /zachowane/)
  }
  assert.equal(oferteoUiFailure({ statusCode: 403 }).retryable, false)
  assert.equal(oferteoUiFailure({ statusCode: 400 }).retryable, false)
})
