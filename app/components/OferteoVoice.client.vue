<template>
  <div class="ov-voice" :class="{ 'ov-active': active, 'ov-compact': compact, 'ov-has-message': error || notice }">
    <div class="ov-bar">
      <div v-if="!compact || active" class="ov-description">
        <span v-if="!compact" class="ov-orb" :class="{ 'ov-speaking': playing }" aria-hidden="true"><i /><i /><i /><i /></span>
        <div><strong>{{ label }}</strong><small v-if="!compact || connected">{{ compact ? remainingLabel : active ? `${remainingLabel} · możesz też pisać` : mode === 'search' ? 'Opowiedz, a propozycje pojawią się w rozmowie' : 'Opowiedz, a szkic oferty zaktualizuje się na żywo' }}</small></div>
      </div>
      <div class="ov-controls">
        <template v-if="connected">
          <button type="button" class="ov-mute" :aria-pressed="muted" :aria-label="muted ? 'Włącz mikrofon' : 'Wycisz mikrofon'" @click="toggleMute"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2m-7 9v3m-4 0h8"/><path v-if="muted" d="m3 3 18 18"/></svg></button>
          <button type="button" class="ov-end" @click="stop()">Zakończ</button>
        </template>
        <button v-else-if="active" type="button" class="ov-end" @click="stop()">Anuluj</button>
        <button v-else type="button" class="ov-start" :disabled="disabled || !available" :title="!available ? availabilityLabel : undefined" :aria-label="!available ? `Porozmawiaj. ${availabilityLabel}` : 'Porozmawiaj — rozpocznij rozmowę głosową'" @click="start"><svg v-if="compact" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2m-7 9v3m-4 0h8"/></svg>Porozmawiaj <span v-if="!compact" aria-hidden="true">↗</span></button>
      </div>
    </div>
    <p v-if="error" class="ov-error" role="alert">{{ error }}</p>
    <p v-else-if="notice" class="ov-note" role="status">{{ notice }}</p>
    <p v-else-if="active && startupPhase === 'microphone'" class="ov-note" role="status">Zezwól tej stronie na mikrofon w przeglądarce. Jeśli pojawi się prośba systemu, zatwierdź ją również.</p>
    <p v-else-if="!compact" class="ov-note" role="status">{{ available ? 'Rozmowa z AI · mikrofon włączasz przyciskiem · do 3 minut' : availabilityLabel }}</p>
    <button v-if="!compact && !available && !active" class="ov-audio" type="button" :disabled="checking || disabled" @click="emit('retry')">{{ checking ? 'Sprawdzanie…' : 'Sprawdź połączenie ponownie' }}</button>
    <button v-if="connected" class="ov-audio" type="button" @click="resumePlayback">Nie słyszysz? Włącz dźwięk</button>
    <span class="ov-sr-only" role="status">{{ compact && !active ? !available ? availabilityLabel : 'Rozmowa głosowa dostępna, do 3 minut.' : label }}</span>
  </div>
</template>

<script setup lang="ts">
import type { UIMessage } from 'ai'
import { onBeforeRouteLeave } from 'vue-router'
import type { OferteoMessage } from '~~/shared/types/oferteo'
import { OFERTEO_REALTIME_MODEL, OFERTEO_VOICE_SECONDS, voiceInstructions, type OferteoVoiceMode, type VoiceMessage } from '~~/shared/oferteo-realtime'
import type { OferteoRealtimeSession } from '~/utils/oferteoRealtimeSession'
import { oferteoUiFailure } from '~~/shared/oferteo-errors'
import { OferteoVoiceStartupError, waitForOferteoVoiceStep, type OferteoVoiceStartupPhase } from '~/utils/oferteoVoiceStartup'

const props = defineProps<{
  mode: OferteoVoiceMode
  compact?: boolean
  available: boolean
  checking?: boolean
  unavailableReason?: string
  disabled: boolean
  messages: OferteoMessage[]
  updateWorkspace: (signal: AbortSignal) => Promise<unknown>
}>()
const emit = defineEmits<{ active: [value: boolean]; transcript: [messages: VoiceMessage[]]; retry: []; 'credits-exhausted': []; 'request-failed': [cause: unknown] }>()
const active = ref(false)
const connected = ref(false)
const playing = ref(false)
const muted = ref(false)
const working = ref(false)
const error = ref('')
const notice = ref('')
const remaining = ref(OFERTEO_VOICE_SECONDS)
const startupPhase = ref<OferteoVoiceStartupPhase>('microphone')
const remainingLabel = computed(() => `${Math.floor(remaining.value / 60)}:${String(remaining.value % 60).padStart(2, '0')}`)
const availabilityLabel = computed(() => props.checking ? 'Sprawdzam dostępność rozmowy…' : props.unavailableReason || 'Rozmowa głosowa wymaga aktywnego połączenia z AI.')
const label = computed(() => !active.value ? 'Wolisz porozmawiać?' : !connected.value ? startupPhase.value === 'microphone' ? 'Czekam na mikrofon…' : startupPhase.value === 'loading' ? 'Przygotowuję rozmowę…' : 'Łączę rozmowę…' : working.value ? (props.mode === 'search' ? 'Szukam propozycji…' : 'Aktualizuję ofertę…') : playing.value ? 'Asystent mówi' : muted.value ? 'Mikrofon wyciszony' : 'Słucham Cię')
let session: OferteoRealtimeSession | undefined
let stream: MediaStream | undefined
let timer: ReturnType<typeof setInterval> | undefined
let controller: AbortController | undefined
let generation = 0
let busy = false
let cachedKey = ''
let cachedResult: unknown
let localMessages: VoiceMessage[] = []
let creditsFailure = false

function stop(message = '') {
  generation++
  controller?.abort()
  if (timer) clearInterval(timer)
  timer = undefined
  const previous = session
  session = undefined
  previous?.disconnect()
  stream?.getTracks().forEach(track => track.stop())
  stream = undefined
  active.value = false
  connected.value = false
  playing.value = false
  working.value = false
  busy = false
  emit('active', false)
  if (message) notice.value = message
}
function fail(cause: Error) {
  const failure = oferteoUiFailure(cause)
  if (failure.creditsExhausted) {
    creditsFailure = true
    error.value = failure.message
    emit('credits-exhausted')
    stop()
    return
  }
  const status = cause.message.match(/setup: (\d+)/)?.[1]
  if (failure.retryAt) emit('request-failed', cause)
  error.value = cause.name === 'NotAllowedError' ? 'Zezwól na mikrofon w ustawieniach przeglądarki i spróbuj ponownie. Możesz też napisać wiadomość.'
    : cause.name === 'NotFoundError' ? 'Nie znaleziono mikrofonu. Podłącz go lub kontynuuj tekstem.'
      : cause.name === 'NotReadableError' ? 'Nie udało się uruchomić mikrofonu. Sprawdź dostęp w ustawieniach systemu i czy inna aplikacja go nie blokuje. Możesz kontynuować tekstem.'
        : cause instanceof OferteoVoiceStartupError || cause.message === 'Realtime session startup timed out' ? cause instanceof OferteoVoiceStartupError && cause.phase === 'microphone'
          ? 'Przeglądarka nie udostępniła mikrofonu w ciągu 20 sekund. Sprawdź zgodę na mikrofon w przeglądarce i systemie, a potem spróbuj ponownie. Możesz też pisać.'
          : 'Uruchomienie rozmowy trwa zbyt długo. Spróbuj ponownie lub kontynuuj tekstem — dotychczasowa rozmowa jest zachowana.'
          : status ? failure.message
            : 'Nie udało się utrzymać rozmowy głosowej. Spróbuj ponownie lub kontynuuj tekstem — dotychczasowa rozmowa jest zachowana.'
  stop()
}
async function start() {
  if (active.value || props.disabled || !props.available) return
  error.value = ''; notice.value = ''; creditsFailure = false
  if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia || !window.AudioContext) {
    error.value = 'Ta przeglądarka nie obsługuje rozmowy głosowej. Otwórz stronę przez HTTPS w aktualnej przeglądarce lub kontynuuj tekstem.'
    return
  }
  const context = props.messages.map(({ role, content }) => ({ role, content }))
  if (context.reduce((sum, message) => sum + message.content.length, 0) > 9000 || context.length >= 16) {
    error.value = 'Rozpocznij nową rozmowę, aby włączyć głos — obecna osiągnęła limit demo.'
    return
  }
  active.value = true
  startupPhase.value = 'microphone'
  emit('active', true)
  const attempt = ++generation
  controller = new AbortController()
  const signal = controller.signal
  const current = () => attempt === generation && !signal.aborted
  localMessages = []; cachedKey = ''; cachedResult = undefined; muted.value = false
  try {
    const acquired = await waitForOferteoVoiceStep(navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false }), {
      phase: 'microphone', signal, timeoutMs: 20_000,
      onLateValue: lateStream => lateStream.getTracks().forEach(track => track.stop()),
    })
    if (!current()) { acquired.getTracks().forEach(track => track.stop()); return }
    stream = acquired
    acquired.getAudioTracks().forEach(track => track.addEventListener('ended', () => { if (current()) fail(new Error('Microphone disconnected')) }, { once: true }))
    startupPhase.value = 'loading'
    const [{ OferteoRealtimeSession: Session }, { gateway }] = await waitForOferteoVoiceStep(Promise.all([import('~/utils/oferteoRealtimeSession'), import('ai')]), { phase: 'loading', signal, timeoutMs: 15_000 })
    if (!current()) return
    startupPhase.value = 'connecting'
    let markReady: () => void = () => {}
    const ready = new Promise<void>(resolve => { markReady = resolve })
    session = new Session({
      model: gateway.experimental_realtime(OFERTEO_REALTIME_MODEL),
      api: { token: `/api/oferto/realtime?mode=${props.mode}` },
      maxEvents: 40,
      startupTimeoutMs: 25_000,
      sessionConfig: {
        instructions: voiceInstructions(props.mode, context),
        outputModalities: ['audio'],
        inputAudioTranscription: {},
        outputAudioTranscription: {},
        inputAudioFormat: { type: 'audio/pcm', rate: 16000 },
        outputAudioFormat: { type: 'audio/pcm', rate: 24000 },
        turnDetection: { type: 'server-vad' },
      },
      onToolCall: async ({ toolCall }) => {
        if (!current() || toolCall.toolName !== 'update_workspace') return { error: 'Niedostępne narzędzie.' }
        const key = JSON.stringify(localMessages.filter(message => message.role === 'user'))
        if (key === '[]') return { error: 'Transkrypcja jeszcze nie dotarła. Ponów po otrzymaniu wypowiedzi użytkownika.' }
        if (key === cachedKey) return cachedResult
        if (busy) return { error: 'Poprzednie wyszukiwanie jeszcze trwa. Poczekaj na wynik.' }
        busy = true; working.value = true
        try {
          const result = await props.updateWorkspace(signal)
          if (!current()) return { error: 'Rozmowa zakończona.' }
          cachedKey = key; cachedResult = result
          return result
        } catch (cause) {
          const failure = oferteoUiFailure(cause)
          if (current() && failure.creditsExhausted) {
            creditsFailure = true
            error.value = failure.message
            emit('credits-exhausted')
            stop()
          } else if (current()) {
            error.value = failure.message
            if (failure.retryAt) { emit('request-failed', cause); stop() }
          }
          return { error: 'Aktualizacja nie powiodła się. Poprzednie wyniki są nieaktualne dla nowych wymagań. Nie przedstawiaj ich jako nowych.' }
        } finally {
          if (current()) { busy = false; working.value = false }
        }
      },
      onError: cause => { if (current()) fail(cause) },
    }, (key, value) => {
      if (!current()) return
      if (key === 'status') {
        if (value === 'connected' && !connected.value) {
          connected.value = true
          markReady()
          session?.startAudioCapture(acquired)
          void session?.resumePlayback().catch(cause => { if (current()) fail(cause) })
          remaining.value = OFERTEO_VOICE_SECONDS
          const deadline = Date.now() + OFERTEO_VOICE_SECONDS * 1000
          timer = setInterval(() => {
            remaining.value = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
            if (!remaining.value) stop('Minęły 3 minuty. Możesz kontynuować tekstem lub rozpocząć kolejną rozmowę głosową.')
          }, 500)
        } else if (value === 'disconnected') stop('Rozmowa głosowa zakończona. Możesz kontynuować tekstem.')
        // The SDK publishes `error` before invoking onError with its cause.
        // Teardown here would retire the attempt and suppress that callback.
      }
      if (key === 'isPlaying') playing.value = Boolean(value)
      if (key === 'messages') {
        localMessages = (value as UIMessage[]).filter(message => message.role !== 'system').map(message => ({
          voiceId: `${attempt}:${message.id}`, role: message.role as 'user' | 'assistant',
          content: message.parts.filter(part => part.type === 'text').map(part => part.text).join(''),
        })).filter(message => message.content.trim())
        emit('transcript', localMessages)
        if (props.messages.reduce((sum, message) => sum + message.content.length, 0) > 9000 || props.messages.length >= 16) stop('Osiągnięto limit rozmowy w demie. Rozpocznij nową rozmowę.')
      }
    })
    if (current()) await Promise.all([
      session.connect(),
      waitForOferteoVoiceStep(ready, { phase: 'connecting', signal, timeoutMs: 30_000 }),
    ])
  } catch (cause) { if (current()) fail(cause instanceof Error ? cause : new Error('Voice failed')) }
}
function toggleMute() {
  if (!stream || !connected.value) return
  muted.value = !muted.value
  stream.getAudioTracks().forEach(track => { track.enabled = !muted.value })
  if (muted.value) session?.clearAudioBuffer()
}
function sendText(text: string) {
  if (!session || !connected.value || !text.trim()) return false
  session.sendTextMessage(text.trim())
  return true
}
async function resumePlayback() {
  const attempt = generation
  const currentSession = session
  try { await currentSession?.resumePlayback() } catch (cause) {
    if (attempt === generation && currentSession === session) fail(cause instanceof Error ? cause : new Error('Playback failed'))
  }
}
function hide() { if (document.hidden && active.value) stop('Rozmowa wstrzymana po opuszczeniu karty. Włącz ją ponownie, gdy wrócisz.') }
function leave() { stop() }
onMounted(() => { document.addEventListener('visibilitychange', hide); window.addEventListener('pagehide', leave) })
onBeforeRouteLeave(() => { stop() })
onBeforeUnmount(() => { stop(); document.removeEventListener('visibilitychange', hide); window.removeEventListener('pagehide', leave) })
defineExpose({ stop, sendText })
watch(() => props.available, available => {
  if (!available && active.value) stop()
  else if (available && creditsFailure) { error.value = ''; creditsFailure = false }
})
</script>

<style scoped>
.ov-voice { margin: 0 0 12px; padding: 12px 14px; border: 1px solid #e8e3db; border-radius: 16px; background: #fffcf7; color: #16345a; font-family: inherit; }
.ov-bar, .ov-description, .ov-controls { display: flex; align-items: center; gap: 10px; }
.ov-bar { justify-content: space-between; }
.ov-description { min-width: 0; }
.ov-description strong, .ov-description small { display: block; }
.ov-description strong { font-size: 13px; font-weight: 700; }
.ov-description small { margin-top: 3px; color: #677587; font-size: 11px; line-height: 1.4; }
.ov-orb { display: flex; align-items: center; justify-content: center; gap: 3px; width: 35px; height: 35px; flex-shrink: 0; border-radius: 50%; background: #fcedd9; color: #bc5a07; }
.ov-orb i { width: 3px; height: 9px; background: currentColor; border-radius: 4px; }
.ov-orb i:nth-child(2n) { height: 17px; }
.ov-speaking i { animation: ov-wave 600ms ease-in-out infinite alternate; }
.ov-speaking i:nth-child(2n) { animation-delay: -350ms; }
.ov-controls { flex-shrink: 0; gap: 7px; }
.ov-voice button { min-height: 40px; border: 0; border-radius: 10px; padding: 8px 12px; font: inherit; font-size: 12px; font-weight: 700; cursor: pointer; }
.ov-voice button:focus-visible { outline: 3px solid #226cb5; outline-offset: 3px; }
.ov-voice button:disabled { opacity: .45; cursor: not-allowed; }
.ov-start { background: #15375f; color: #fff; }
.ov-start span { margin-left: 7px; }
.ov-end { background: #fce9e4; color: #9a3422; }
.ov-mute { display: grid; place-items: center; background: #eaf0f5; color: #16345a; }
.ov-mute[aria-pressed=true] { background: #fce9e4; color: #9a3422; }
.ov-mute svg { width: 18px; height: 18px; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; }
.ov-note, .ov-error { margin: 8px 0 0; font-size: 10px; line-height: 1.5; color: #677587; }
.ov-error { color: #a43927; }
.ov-active { border-color: #edc997; }
.ov-voice .ov-audio { padding: 3px 0; min-height: 28px; background: transparent; color: #526b86; font-size: 10px; text-decoration: underline; }
.ov-sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
@keyframes ov-wave { to { transform: scaleY(.45); } }
@media (prefers-reduced-motion: reduce) { .ov-speaking i { animation: none; } }
@media (max-width: 480px) { .ov-voice { padding: 10px; margin-bottom: 8px; } .ov-description small { max-width: 155px; font-size: 10px; } .ov-controls { gap: 5px; } .ov-voice button { padding: 8px 10px; } .ov-orb { display: none; } }
.ov-compact { min-width: 0; max-width: 100%; margin: 0; padding: 0; border: 0; border-radius: 0; background: transparent; }
.ov-compact .ov-bar { justify-content: flex-start; flex-wrap: wrap; gap: 8px 12px; }
.ov-compact .ov-description > div { display: flex; align-items: center; flex-wrap: wrap; gap: 4px 8px; }
.ov-compact .ov-description strong { font-size: 12px; font-weight: 600; }
.ov-compact .ov-description small { margin: 0; font-size: 11px; font-variant-numeric: tabular-nums; }
.ov-compact .ov-start { display: inline-flex; align-items: center; gap: 7px; padding: 8px 10px; background: transparent; color: #526b86; font-weight: 600; }
.ov-compact .ov-start:hover:not(:disabled) { background: #f3f5f6; color: #16345a; }
.ov-compact .ov-start svg { width: 17px; height: 17px; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; }
.ov-compact .ov-note, .ov-compact .ov-error { font-size: 11px; overflow-wrap: anywhere; }
.ov-compact .ov-end { min-height: 36px; padding: 7px 10px; }
.ov-compact .ov-mute { min-height: 36px; padding: 7px 9px; }
.ov-compact .ov-audio { display: block; font-size: 11px; }
</style>
