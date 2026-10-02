import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createOferteoDemoLimitError, createOferteoLimitStorageError, probeOferteoLimitStorage } from '../server/utils/oferteoLimitStorage.ts'
import { resolveOferteoStatusMode } from '../server/utils/oferteoStatusMode.ts'
import { oferteoUiFailure } from '../shared/oferteo-errors.ts'

const healthy = { databaseAvailable: true, limitStorageAvailable: true, aiAvailability: 'ready' as const, databaseUrlConfigured: true, production: true }

test('status probes the upsert and cleanup plans without consuming quota', async () => {
  let probes = 0
  const available = await probeOferteoLimitStorage(async (statements, options) => {
    probes++
    assert.deepEqual(options, { readOnly: true })
    assert.equal(statements.length, 2)
    for (const statement of statements) {
      assert.match(statement, /^EXPLAIN \(COSTS OFF\)/u)
      assert.doesNotMatch(statement, /ANALYZE/iu)
    }
    assert.match(statements[0]!, /INSERT INTO oferteo_rate_limits[\s\S]+ON CONFLICT \(key\) DO UPDATE[\s\S]+RETURNING hits/u)
    assert.match(statements[1]!, /DELETE FROM oferteo_rate_limits WHERE expires_at < NOW\(\)/u)
    return []
  })
  assert.equal(probes, 1)
  assert.equal(available, true)
  assert.equal(resolveOferteoStatusMode({ ...healthy, limitStorageAvailable: available }), 'live')
})

test('auth, grants, missing schema and missing conflict key block live status despite a healthy catalog', async () => {
  for (const code of ['28P01', '42501', '42P01', '42703', '42P10']) {
    const available = await probeOferteoLimitStorage(async () => { throw Object.assign(new Error('private-database-uri'), { code }) })
    assert.equal(available, false)
    assert.equal(resolveOferteoStatusMode({ ...healthy, limitStorageAvailable: available }), 'unavailable')
  }
  assert.equal(resolveOferteoStatusMode({ ...healthy, databaseAvailable: false }), 'unavailable')
})

test('a failed storage probe is retried after the runtime connection is repaired', async () => {
  let repaired = false
  let probes = 0
  const run = async () => { probes++; if (!repaired) throw new Error('private-credential'); return [] }
  assert.equal(await probeOferteoLimitStorage(run), false)
  repaired = true
  assert.equal(await probeOferteoLimitStorage(run), true)
  assert.equal(probes, 2)
})

test('storage failure is a safe retryable 503 while an actual quota limit remains 429', () => {
  const unavailable = createOferteoLimitStorageError()
  assert.equal(unavailable.statusCode, 503)
  assert.deepEqual(unavailable.data, { code: 'LIMIT_STORAGE_UNAVAILABLE', retryable: true })
  assert.doesNotMatch(JSON.stringify(unavailable.toJSON()), /postgres(?:ql)?:\/\//iu)
  assert.equal(oferteoUiFailure(unavailable).retryAt, 0)
  const exceeded = createOferteoDemoLimitError(120)
  assert.equal(exceeded.statusCode, 429)
  assert.deepEqual(exceeded.data, { code: 'DEMO_RATE_LIMITED', retryable: true, retryAfterSeconds: 120 })
  assert.equal(oferteoUiFailure(exceeded, 1000).retryAt, 121000)
})

test('storage checks preserve explicit local sample mode and production durability', () => {
  assert.equal(resolveOferteoStatusMode({ ...healthy, databaseUrlConfigured: false }), 'unavailable')
  assert.equal(resolveOferteoStatusMode({ ...healthy, databaseUrlConfigured: false, production: false }), 'live')
  assert.equal(resolveOferteoStatusMode({ ...healthy, aiAvailability: 'unconfigured' }), 'demo')
  assert.equal(resolveOferteoStatusMode({ ...healthy, aiAvailability: 'unconfigured', limitStorageAvailable: false }), 'unavailable')
})
