import assert from 'node:assert/strict'
import { test } from 'node:test'
import { effectScope, nextTick, ref } from 'vue'
import { useOferteoAvailability } from '../app/composables/useOferteoAvailability.ts'
import type { OferteoStatus } from '../shared/types/oferteo.ts'

const readyStatus: OferteoStatus = { mode: 'live', aiConfigured: true, aiAvailability: 'ready', databaseConfigured: true, catalogCount: 1, source: 'neon', model: 'test' }

test('credits pause survives a conversation reset and recovery keeps an explicit retry action', async () => {
  const scope = effectScope()
  try {
    const status = ref<OferteoStatus | null>(readyStatus)
    const state = scope.run(() => useOferteoAvailability(status))!
    state.setFailure({ statusCode: 402 })
    assert.equal(state.aiPaused.value, true)
    assert.equal(state.canRetry.value, false)
    state.clearFailure()
    assert.equal(state.aiPaused.value, true)
    state.setFailure({ statusCode: 402 })
    status.value = { ...readyStatus }
    await nextTick()
    assert.equal(state.aiPaused.value, false)
    assert.equal(state.canRetry.value, true)
    assert.match(state.failure.value!.message, /ponowić ostatnią wiadomość/)
    assert.match(state.failure.value!.message, /niczego nie wysłaliśmy automatycznie/)
  } finally { scope.stop() }
})

test('initial empty balance blocks spend, and a corrected request can clear a validation error', async () => {
  const scope = effectScope()
  try {
    const status = ref<OferteoStatus | null>({ ...readyStatus, mode: 'unavailable', aiConfigured: false, aiAvailability: 'credits_exhausted' })
    const state = scope.run(() => useOferteoAvailability(status))!
    assert.equal(state.aiPaused.value, true)
    status.value = { ...readyStatus }
    await nextTick()
    state.setFailure({ statusCode: 400 })
    assert.equal(state.canRetry.value, false)
    state.clearFailure()
    assert.equal(state.canRetry.value, true)
  } finally { scope.stop() }
})

test('429 cooldown prevents an immediate retry and resources are disposed with the page', () => {
  const scope = effectScope()
  try {
    const state = scope.run(() => useOferteoAvailability(ref<OferteoStatus | null>(readyStatus)))!
    state.setFailure({ statusCode: 429, data: { data: { retryAfterSeconds: 120 } } })
    assert.equal(state.canRetry.value, false)
    assert.equal(state.retrySeconds.value, 120)
    assert.equal(state.aiPaused.value, false)
  } finally { scope.stop() }
})
