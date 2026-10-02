import { computed, onScopeDispose, ref, watch, type Ref } from 'vue'
import type { OferteoStatus } from '../../shared/types/oferteo.ts'
import { oferteoUiFailure, type OferteoUiFailure } from '../../shared/oferteo-errors.ts'

export function useOferteoAvailability(status: Ref<OferteoStatus | null | undefined>) {
  const creditsExhausted = ref(false)
  const failure = ref<OferteoUiFailure | null>(null)
  const now = ref(Date.now())
  let timer: ReturnType<typeof setInterval> | undefined
  const aiPaused = computed(() => creditsExhausted.value || status.value?.aiAvailability === 'credits_exhausted')
  const retrySeconds = computed(() => Math.max(0, Math.ceil(((failure.value?.retryAt || 0) - now.value) / 1000)))
  const canRetry = computed(() => !aiPaused.value && failure.value?.retryable !== false && !retrySeconds.value)
  function clearFailure() {
    failure.value = null
    if (timer) clearInterval(timer)
    timer = undefined
  }
  function setFailure(cause: unknown) {
    clearFailure()
    now.value = Date.now()
    failure.value = oferteoUiFailure(cause, now.value)
    if (failure.value.creditsExhausted) creditsExhausted.value = true
    if (failure.value.retryAt > now.value) timer = setInterval(() => {
      now.value = Date.now()
      if (!retrySeconds.value && timer) { clearInterval(timer); timer = undefined }
    }, 1000)
    return failure.value.message
  }
  watch(status, value => {
    if (value?.aiAvailability === 'credits_exhausted') creditsExhausted.value = true
    else if (value?.aiAvailability === 'ready') {
      creditsExhausted.value = false
      if (failure.value?.creditsExhausted) failure.value = {
        message: 'Asystent znów jest dostępny. Możesz ponowić ostatnią wiadomość — niczego nie wysłaliśmy automatycznie.',
        retryable: true, creditsExhausted: false, retryAt: 0,
      }
    }
  }, { immediate: true })
  onScopeDispose(() => { if (timer) clearInterval(timer) })
  return { failure, aiPaused, canRetry, retrySeconds, setFailure, clearFailure }
}
