<template>
  <main class="oc-page" :style="viewportStyle" @keydown.esc="activePane === 'preview' && returnToChat()">
    <a class="oc-skip" href="#oc-composer">Przejdź do rozmowy</a>
    <header class="oc-header">
      <NuxtLink to="/oferteo" class="oc-logo" aria-label="Oferteo — oba demka"><span>o</span>ferte<span>o</span></NuxtLink>
      <nav class="oc-demo-nav" aria-label="Wybierz demo">
        <NuxtLink to="/oferto/demo"><span>01</span> <span>Szukanie</span></NuxtLink>
        <NuxtLink to="/oferto/demo-2" aria-current="page"><span>02</span> <span>Kreator oferty</span></NuxtLink>
      </nav>
      <div class="oc-connection"><span :class="{ 'is-live': isLive }" />{{ connectionLabel }}<button v-if="statusError || aiPaused" type="button" :disabled="statusPending" aria-label="Sprawdź dostępność asystenta" @click="refreshStatus()">↻</button></div>
      <NuxtLink class="oc-back-link" to="/oferteo">O projekcie <span aria-hidden="true">↗</span></NuxtLink>
    </header>

    <div class="oc-mobile-switch" aria-label="Widok kreatora">
      <button ref="chatTab" type="button" :aria-pressed="activePane === 'chat'" aria-controls="oc-chat-panel" @click="activePane = 'chat'">Rozmowa</button>
      <button ref="previewTab" type="button" :aria-pressed="activePane === 'preview'" aria-controls="oc-preview-panel" @click="openPreview()">Podgląd oferty <span v-if="version">{{ version }}</span></button>
    </div>

    <div class="oc-workspace ph-no-capture" :class="{ 'oc-preview-active': activePane === 'preview' }">
      <section id="oc-chat-panel" class="oc-chat" aria-labelledby="oc-chat-title">
        <div class="oc-chat-toolbar">
          <div class="oc-toolbar-title"><span class="oc-avatar" aria-hidden="true">✳</span><div><h1 id="oc-chat-title">Kreator oferty</h1><p>Opowiedz o swojej pracy. Ułożymy resztę.</p></div></div>
          <button class="oc-reset" type="button" :disabled="pending || !messages.length" aria-label="Rozpocznij nową ofertę" title="Nowa oferta" @click="resetConversation"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10a8 8 0 1 1 1 7M4 4v6h6" /></svg></button>
        </div>

        <div ref="messageBox" class="oc-messages" role="log" tabindex="0" aria-label="Rozmowa z kreatorem oferty" aria-live="polite" :aria-busy="pending">
          <div class="oc-transcript">
            <div class="oc-welcome">
              <span class="oc-eyebrow">TWOJA WIEDZA. DOBRA OFERTA.</span>
              <h2>Ty znasz się na pracy.<br>Ja pomogę ją opisać.</h2>
              <p>Powiedz, co robisz, dla kogo i na jakich warunkach. Wspólnie stworzymy ofertę, którą klient łatwo zrozumie.</p>
              <div class="oc-welcome-flow"><span>Opowiedz</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 10h14m-5-5 5 5-5 5" /></svg><span>Dopracuj</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 10h14m-5-5 5 5-5 5" /></svg><span>Skopiuj ofertę</span></div>
            </div>
            <div v-if="!messages.length" class="oc-examples">
              <p>Sprawdź na fikcyjnym przykładzie</p>
              <button v-for="(example, index) in examples" :key="example.title" type="button" :disabled="pending || aiPaused || retrySeconds > 0" @click="startExample(index)"><span class="oc-example-icon" aria-hidden="true">{{ example.icon }}</span><span><strong>{{ example.title }}</strong><small>{{ example.subtitle }}</small></span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" /></svg></button>
            </div>

            <article v-for="(message, index) in messages" :key="index" class="oc-message" :class="`oc-message-${message.role}`" :data-message-index="index">
              <span v-if="message.role === 'assistant'" class="oc-small-avatar" aria-hidden="true">✳</span>
              <div class="oc-message-body"><span class="oc-message-name">{{ message.role === 'user' ? 'Ty' : 'Asystent Oferteo' }}</span><p>{{ message.content }}</p>
                <div v-if="message.result" class="oc-draft-result">
                  <div class="oc-result-heading"><span class="oc-result-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M14 3H5v18h14V8l-5-5Zm0 0v5h5M8 12h8m-8 4h5" /></svg></span><div><strong>{{ message.result.version === 1 ? 'Pierwszy szkic gotowy' : 'Oferta zaktualizowana' }}</strong><span>Wersja {{ message.result.version }} · {{ message.result.ready ? 'do Twojej akceptacji' : 'uzupełniamy szczegóły' }}</span></div><span class="oc-result-check" aria-label="Utworzono">✓</span></div>
                  <p class="oc-result-title">{{ message.result.title }}</p>
                  <ul v-if="message.result.changes.length"><li v-for="change in message.result.changes.slice(0, 3)" :key="change">{{ change }}</li></ul>
                  <button type="button" @click="openPreview()">Otwórz bieżący podgląd <span aria-hidden="true">↗</span></button>
                </div>
              </div>
            </article>
            <div v-if="pending && !hasStreamingText" class="oc-message oc-message-assistant oc-pending"><span class="oc-small-avatar" aria-hidden="true">✳</span><div><span class="oc-thinking"><i /><i /><i /></span><p>{{ hasDraft ? 'Dopracowuję Twoją ofertę…' : 'Układam informacje w ofertę…' }}</p><small>Podgląd aktualizuje się w trakcie odpowiedzi.</small></div></div>
            <div v-if="error" class="oc-error" role="alert"><p>{{ error }}</p><button v-if="aiPaused" type="button" :disabled="statusPending" @click="refreshStatus()">{{ statusPending ? 'Sprawdzam…' : 'Sprawdź dostępność' }}</button><button v-else-if="failedRequest && failure?.retryable !== false" type="button" :disabled="pending || !canRetry" @click="requestReply()">{{ retrySeconds ? `Ponów za ${retrySeconds} s` : 'Spróbuj ponownie' }} <span aria-hidden="true">↻</span></button></div>
            <div v-else-if="cancelled" class="oc-error" role="status"><p>Generowanie zatrzymane. Poprzedni szkic jest zachowany.</p><button type="button" :disabled="pending || !canRetry" @click="requestReply()">Spróbuj ponownie <span aria-hidden="true">↻</span></button></div>
          </div>
        </div>

        <div class="oc-composer-wrap">
          <OferteoVoice ref="voice" mode="creator" :available="!aiPaused && status?.mode === 'live'" :checking="statusPending" :unavailable-reason="voiceUnavailableReason" :disabled="pending || retrySeconds > 0" :messages="finalMessages" :update-workspace="updateVoiceWorkspace" @active="voiceActive = $event" @transcript="syncVoiceTranscript" @retry="refreshStatus()" @credits-exhausted="onVoiceCreditsExhausted" @request-failed="error = setFailure($event)" />
          <div v-if="suggestions.length && !pending && !error" class="oc-suggestions" aria-label="Pomysły na kolejną wiadomość"><button v-for="suggestion in suggestions" :key="suggestion" type="button" :disabled="aiPaused || retrySeconds > 0" @click="send(suggestion)">{{ suggestion }}</button></div>
          <form id="oc-composer" class="oc-composer" @submit.prevent="send(input)">
            <label class="oc-sr-only" for="oc-prompt">Opisz usługę lub poproś o zmianę oferty</label>
            <textarea id="oc-prompt" ref="composer" v-model="input" :disabled="pending" rows="2" maxlength="1500" :placeholder="hasDraft ? 'Co zmieniamy? Np. skróć opis i wyróżnij zakres…' : 'Np. remontuję łazienki w Warszawie. Chcę opisać swoją usługę…'" @keydown.enter.exact="onEnter" />
            <div class="oc-composer-bottom"><span>{{ hasDraft ? 'Każdą zmianę możesz opisać w rozmowie' : 'Zacznij od tego, co robisz najlepiej' }}</span><button v-if="pending" class="oc-stop" type="button" aria-label="Zatrzymaj generowanie oferty" @click="stopRequest">Zatrzymaj</button><button v-else type="submit" :disabled="aiPaused || retrySeconds > 0 || !input.trim()" :aria-label="aiPaused ? 'Asystent niedostępny — brak środków' : 'Wyślij wiadomość'"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6" /></svg></button></div>
          </form>
          <p class="oc-private-note"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 9h10v8H5zM7 9V6a3 3 0 0 1 6 0v3" /></svg>{{ mode === 'demo' || (!mode && status?.mode === 'demo') ? 'Tryb przykładowy · odpowiedzi scenariuszowe bez AI.' : 'To szkic. Niczego nie publikujemy ani nie wysyłamy.' }}</p>
        </div>
      </section>

      <section id="oc-preview-panel" class="oc-preview" aria-labelledby="oc-preview-title">
        <div class="oc-preview-toolbar"><div><h2 id="oc-preview-title">Twoja oferta</h2><span v-if="version" class="oc-version">Wersja {{ version }}</span><span v-else class="oc-preview-label">PODGLĄD NA ŻYWO</span></div><div class="oc-export-actions"><button v-if="pending" type="button" aria-label="Zatrzymaj generowanie oferty" @click="stopRequest">Zatrzymaj</button><button type="button" :disabled="!hasDraft || pending" @click="copyOffer"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /></svg>{{ exportState === 'copied' ? 'Skopiowano' : 'Kopiuj' }}</button><button class="oc-download" type="button" :disabled="!hasDraft || pending" aria-label="Pobierz ofertę jako plik tekstowy" title="Pobierz jako tekst" @click="downloadOffer"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2v10m-4-4 4 4 4-4M3 13v4h14v-4" /></svg></button></div></div>
        <div v-if="exportMessage" class="oc-export-feedback" :class="{ 'is-error': exportState === 'error' }" role="status">{{ exportMessage }}</div>
        <div ref="previewBox" class="oc-preview-canvas" tabindex="0" aria-label="Treść przygotowanej oferty">
          <div v-if="isExample" class="oc-example-notice"><span aria-hidden="true">◇</span> Fikcyjny przykład do demonstracji</div>
          <OferteoOfferDraft :draft="offerDraft" :ready="ready && !pending" :version="version" :pending="pending" />
          <div class="oc-preview-hint"><span aria-hidden="true">✳</span><p>{{ hasDraft ? 'Masz lepszy pomysł na zdanie? Napisz w czacie, co zmienić.' : 'Tutaj pojawi się Twoja oferta. Uzupełnimy ją w trakcie rozmowy.' }}</p></div>
          <p v-if="hasDraft" class="oc-draft-disclaimer">Sprawdź treść i warunki przed użyciem. Oferta pozostaje szkicem w tej sesji.</p>
        </div>
        <div class="oc-preview-footer"><span><span :class="{ 'is-ready': ready }" />{{ pending ? 'Przygotowuję zmiany…' : hasDraft ? ready ? 'Szkic do sprawdzenia' : 'Szkic w przygotowaniu' : 'Czekam na Twój pomysł' }}</span><button type="button" @click="returnToChat()">{{ hasDraft ? 'Dopracuj w rozmowie' : 'Zacznij rozmowę' }} <span aria-hidden="true">↗</span></button></div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { mergeOferteoVoiceTranscript, voiceRequestMessages, type VoiceMessage } from '~~/shared/oferteo-realtime'
import type { OferteoMessage, OferteoStatus } from '~~/shared/types/oferteo'
import { emptyOfferDraft, type OfferCreatorResponse, type OfferDraft } from '~~/shared/types/oferteo-creator'
import type { OfferCreatorPartial } from '~~/shared/types/oferteo-stream'
import { OFERTEO_CREDITS_MESSAGE, oferteoUiFailure } from '~~/shared/oferteo-errors'
import { requestOferteoStream } from '~/utils/oferteoStream'

useSeoMeta({ title: 'Kreator oferty — demo 2 AI dla Oferteo | Konrad Straszewski', description: 'Stwórz ofertę swojej usługi w rozmowie z asystentem AI. Opisz zakres, warunki i cenę, a potem dopracuj szkic.', robots: 'noindex, nofollow' })
useHead({ htmlAttrs: { lang: 'pl', class: 'oc-fullscreen' }, bodyAttrs: { class: 'oc-fullscreen' }, meta: [{ name: 'theme-color', content: '#ffffff' }, { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content' }] })
// The protected status route needs the browser's BotID challenge.
const { data: status, error: statusError, pending: statusPending, refresh: refreshStatus } = await useFetch<OferteoStatus>('/api/oferto/status', { server: false, retry: false })
const { failure, aiPaused, canRetry, retrySeconds, setFailure, clearFailure } = useOferteoAvailability(status)
const voiceUnavailableReason = computed(() => aiPaused.value ? OFERTEO_CREDITS_MESSAGE : statusError.value
  ? oferteoUiFailure(statusError.value).message
  : status.value?.mode === 'unavailable' ? 'Obsługa rozmów jest chwilowo niedostępna. Spróbuj ponownie za chwilę.'
    : 'Rozmowa głosowa wymaga aktywnego połączenia z AI.')

type ChatMessage = OferteoMessage & { voiceId?: string; streaming?: number; result?: { version: number; title: string; ready: boolean; changes: string[] } }
const messages = ref<ChatMessage[]>([])
const finalMessages = computed(() => messages.value.filter(message => message.streaming === undefined))
const hasStreamingText = computed(() => messages.value.some(message => message.streaming !== undefined && message.content))
const voice = ref<{ stop: () => void; sendText: (text: string) => boolean } | null>(null)
const voiceActive = ref(false)
const offerDraft = ref<OfferDraft | null>(null)
const input = ref('')
const suggestions = ref<string[]>([])
const pending = ref(false)
const error = ref('')
const cancelled = ref(false)
watch(aiPaused, (paused, wasPaused) => { if (!paused && wasPaused) error.value = failure.value?.message || '' })
function onVoiceCreditsExhausted() { error.value = setFailure({ statusCode: 402 }) }
const failedRequest = ref(false)
const mode = ref<'live' | 'demo' | null>(null)
const ready = ref(false)
const version = ref(0)
const isExample = ref(false)
const activePane = ref<'chat' | 'preview'>('chat')
const messageBox = ref<HTMLElement | null>(null)
const previewBox = ref<HTMLElement | null>(null)
const composer = ref<HTMLTextAreaElement | null>(null)
const chatTab = ref<HTMLButtonElement | null>(null)
const previewTab = ref<HTMLButtonElement | null>(null)
const viewportStyle = ref<{ height: string; top: string }>()
const exportState = ref<'idle' | 'copied' | 'downloaded' | 'error'>('idle')
const exportMessage = ref('')
const isLive = computed(() => !aiPaused.value && status.value?.mode !== 'unavailable' && (mode.value === 'live' || (mode.value !== 'demo' && status.value?.aiConfigured === true)))
const connectionLabel = computed(() => aiPaused.value ? 'Brak środków na AI' : pending.value ? 'Pracuję nad ofertą' : isLive.value ? 'Asystent jest gotowy' : statusError.value ? 'Sprawdź połączenie' : status.value?.mode === 'unavailable' ? 'AI chwilowo niedostępne' : status.value ? 'Tryb przykładowy' : 'Łączenie…')
const hasDraft = computed(() => !!offerDraft.value && !!(offerDraft.value.title || offerDraft.value.description || offerDraft.value.company || offerDraft.value.service || offerDraft.value.location || offerDraft.value.scope.length || offerDraft.value.price || offerDraft.value.timing || offerDraft.value.conditions.length || offerDraft.value.nextStep))
let controller: AbortController | undefined
let streamSequence = 0
let retryMessages: OferteoMessage[] | undefined
let unmounted = false
let scrollReplyOnReturn = false

const examples = [
  { title: 'Remonty łazienek', subtitle: 'Zakres prac, cena i warunki', icon: '⌂', prompt: 'To fikcyjny przykład do demo. Firma: Łazienka od Nowa. Usługa: kompleksowy remont łazienki. Lokalizacja: Warszawa. Zakres: demontaż starego wyposażenia, hydroizolacja, układanie płytek, montaż prysznica i armatury. Cena: od 18 000 zł brutto za robociznę. Termin: rozpoczęcie do uzgodnienia, realizacja około 3 tygodni. Warunki: materiały kupuje klient, ostateczna wycena po oględzinach. Przygotuj ofertę.' },
  { title: 'Malowanie mieszkań', subtitle: 'Czytelna oferta lokalnej firmy', icon: '▧', prompt: 'To fikcyjny przykład do demo. Firma: Kolor i Spokój. Usługa: malowanie mieszkań. Lokalizacja: Wrocław. Zakres: zabezpieczenie mebli i podłóg, przygotowanie ścian, dwukrotne malowanie, sprzątanie po pracy. Cena: od 30 zł brutto za m² robocizny. Termin: do uzgodnienia. Warunki: farby kupuje klient, zakres przygotowania ścian ustalamy po oględzinach. Przygotuj ofertę.' },
  { title: 'Projektowanie ogrodów', subtitle: 'Pomysł zamieniony w konkrety', icon: '♧', prompt: 'To fikcyjny przykład do demo. Firma: Zielony Plan. Usługa: projektowanie ogrodów. Lokalizacja: Kraków i zdalnie. Zakres: konsultacja, koncepcja ogrodu, plan nasadzeń, lista roślin. Cena: od 2 500 zł brutto za projekt. Termin: około 4 tygodni od konsultacji. Warunki: oferta nie obejmuje wykonania ogrodu, jedna runda poprawek w cenie. Przygotuj ofertę.' },
]

function syncViewport() {
  const viewport = window.visualViewport
  if (viewport && viewport.scale === 1) viewportStyle.value = { height: `${viewport.height}px`, top: `${viewport.offsetTop}px` }
}
onMounted(() => {
  syncViewport()
  window.visualViewport?.addEventListener('resize', syncViewport)
  window.visualViewport?.addEventListener('scroll', syncViewport)
})
watch(activePane, pane => {
  if (pane === 'chat' && scrollReplyOnReturn) {
    scrollReplyOnReturn = false
    void scrollMessages(true)
  }
})
async function openPreview() {
  activePane.value = 'preview'
  await nextTick()
  previewBox.value?.focus({ preventScroll: true })
}
async function returnToChat() {
  activePane.value = 'chat'
  await nextTick()
  if (!pending.value) composer.value?.focus({ preventScroll: true })
  else messageBox.value?.focus({ preventScroll: true })
}
async function scrollMessages(toLatestReply = false) {
  await nextTick()
  const box = messageBox.value
  if (!box) return
  const reply = toLatestReply ? box.querySelector<HTMLElement>(`[data-message-index="${messages.value.length - 1}"]`) : null
  box.scrollTop = reply ? box.scrollTop + reply.getBoundingClientRect().top - box.getBoundingClientRect().top - 18 : box.scrollHeight
}
function followsMessages() {
  const box = messageBox.value
  return !box || box.scrollHeight - box.scrollTop - box.clientHeight < 100
}
function startExample(index: number) {
  if (pending.value || aiPaused.value || retrySeconds.value > 0) return
  isExample.value = true
  void send(examples[index]!.prompt)
}
function onEnter(event: KeyboardEvent) {
  if (event.isComposing) return
  event.preventDefault()
  void send(input.value)
}
async function send(value: string) {
  const content = value.trim()
  if (!content || content.length > 1500 || pending.value || aiPaused.value || retrySeconds.value > 0) return
  if (voiceActive.value) { if (voice.value?.sendText(content)) { input.value = ''; suggestions.value = [] }; return }
  clearFailure()
  const history = failedRequest.value && finalMessages.value.at(-1)?.role === 'user' ? finalMessages.value.slice(0, -1) : finalMessages.value
  if (history.length >= 16 || history.reduce((total, message) => total + message.content.length, 0) + content.length > 9000) {
    failedRequest.value = false
    error.value = 'Osiągnięto limit długości rozmowy w demie. Skopiuj swoją ofertę i rozpocznij nową przyciskiem ↻ w nagłówku.'
    await scrollMessages()
    return
  }
  messages.value = [...history, { role: 'user', content }]
  retryMessages = undefined
  input.value = ''
  suggestions.value = []
  await requestReply()
}
async function requestReply() {
  const history = retryMessages || voiceRequestMessages(finalMessages.value)
  if (pending.value || !canRetry.value || history.at(-1)?.role !== 'user') return
  try { await requestDraft(history) } catch { /* requestDraft retains the failed turn and its retry state. */ }
}
async function requestDraft(history: OferteoMessage[], voiceSignal?: AbortSignal) {
  const previousDraft = offerDraft.value ? { ...offerDraft.value, scope: [...offerDraft.value.scope], conditions: [...offerDraft.value.conditions] } : null
  const requestController = new AbortController()
  controller = requestController
  const abortFromVoice = () => requestController.abort()
  if (voiceSignal?.aborted) abortFromVoice()
  else voiceSignal?.addEventListener('abort', abortFromVoice, { once: true })
  const streamId = ++streamSequence
  let followFinalReply = true
  const current = () => !unmounted && controller === requestController && !requestController.signal.aborted
  pending.value = true
  failedRequest.value = false
  error.value = ''
  cancelled.value = false
  suggestions.value = []
  clearFailure()
  exportMessage.value = ''
  exportState.value = 'idle'
  try {
    await scrollMessages()
    requestController.signal.throwIfAborted()
    const result = await requestOferteoStream<OfferCreatorResponse, OfferCreatorPartial>('/api/oferto/offer', { messages: history, draft: previousDraft }, {
      signal: requestController.signal,
      onPartial(partial) {
        if (!current()) return
        const following = followsMessages()
        if (typeof partial.message === 'string') {
          const reply = messages.value.find(message => message.streaming === streamId)
          if (reply) reply.content = partial.message
          else if (partial.message) messages.value.push({ role: 'assistant', content: partial.message, streaming: streamId })
        }
        if (partial.draft) {
          const fields = Object.fromEntries(Object.entries(partial.draft).filter(([, value]) => value !== undefined))
          offerDraft.value = { ...emptyOfferDraft(), ...offerDraft.value, ...fields }
        }
        if (following) {
          if (!messageBox.value?.getClientRects().length) scrollReplyOnReturn = true
          else void nextTick(() => { if (messageBox.value) messageBox.value.scrollTop = messageBox.value.scrollHeight })
        }
      },
    })
    requestController.signal.throwIfAborted()
    if (!current()) return result
    followFinalReply = followsMessages()
    const changed = JSON.stringify(previousDraft) !== JSON.stringify(result.draft)
    offerDraft.value = result.draft
    ready.value = result.ready
    if (changed && hasDraft.value) version.value += 1
    const reply: ChatMessage = { role: 'assistant', content: result.message, result: changed && hasDraft.value ? { version: version.value, title: result.draft.title || result.draft.service || 'Twoja oferta', ready: result.ready, changes: result.changes } : undefined }
    const index = messages.value.findIndex(message => message.streaming === streamId)
    if (index < 0) messages.value.push(reply)
    else messages.value.splice(index, 1, reply)
    suggestions.value = result.suggestions.slice(0, 3)
    mode.value = result.mode
    retryMessages = undefined
    return result
  } catch (cause: unknown) {
    if (!unmounted && controller === requestController) {
      followFinalReply = followsMessages()
      messages.value = messages.value.filter(message => message.streaming !== streamId)
      offerDraft.value = previousDraft
      suggestions.value = []
      retryMessages = history
      failedRequest.value = true
      if (requestController.signal.aborted) cancelled.value = true
      else error.value = setFailure(cause)
    }
    throw cause
  } finally {
    voiceSignal?.removeEventListener('abort', abortFromVoice)
    if (!unmounted && controller === requestController) {
      controller = undefined
      pending.value = false
      if (followFinalReply) {
        if (!messageBox.value?.getClientRects().length) scrollReplyOnReturn = true
        else await scrollMessages(messages.value.at(-1)?.role === 'assistant')
      }
      if (composer.value?.getClientRects().length && (document.activeElement === document.body || document.activeElement === composer.value)) composer.value.focus({ preventScroll: true })
    }
  }
}
function syncVoiceTranscript(transcript: VoiceMessage[]) {
  mergeOferteoVoiceTranscript(messages.value, transcript)
  if (!messageBox.value?.getClientRects().length) scrollReplyOnReturn = true
  else void scrollMessages()
}
async function updateVoiceWorkspace(signal: AbortSignal) {
  if (aiPaused.value) throw { statusCode: 402 }
  if (pending.value || !canRetry.value) throw new Error('Oczekiwanie na wynik')
  return requestDraft(voiceRequestMessages(finalMessages.value, true), signal)
}
function stopRequest() {
  controller?.abort()
  if (voiceActive.value) voice.value?.stop()
}
function resetConversation() {
  if (pending.value) return
  if (!retrySeconds.value) clearFailure()
  voice.value?.stop()
  messages.value = []
  offerDraft.value = null
  input.value = ''
  suggestions.value = []
  error.value = ''
  cancelled.value = false
  failedRequest.value = false
  retryMessages = undefined
  mode.value = null
  ready.value = false
  version.value = 0
  isExample.value = false
  exportState.value = 'idle'
  exportMessage.value = ''
  scrollReplyOnReturn = false
  activePane.value = 'chat'
  nextTick(() => { if (messageBox.value) messageBox.value.scrollTop = 0; if (previewBox.value) previewBox.value.scrollTop = 0; composer.value?.focus({ preventScroll: true }) })
}
function offerText() {
  const draft = offerDraft.value
  if (!draft) return ''
  return [isExample.value ? 'FIKCYJNY PRZYKŁAD DO DEMONSTRACJI\n' : '', draft.title || draft.service || 'Oferta', draft.company ? `Firma: ${draft.company}` : '', draft.service ? `Usługa: ${draft.service}` : '', draft.location ? `Obszar działania: ${draft.location}` : '', '', draft.description, '', 'ZAKRES USŁUGI', draft.scope.length ? draft.scope.map(item => `• ${item}`).join('\n') : 'Do ustalenia', '', `CENA\n${draft.price || 'Do ustalenia'}`, '', `TERMIN\n${draft.timing || 'Do ustalenia'}`, '', 'WARUNKI', draft.conditions.length ? draft.conditions.map(item => `• ${item}`).join('\n') : 'Do ustalenia', draft.nextStep ? `\nKOLEJNY KROK\n${draft.nextStep}` : '', '\nSzkic oferty — sprawdź treść i warunki przed użyciem.'].join('\n').replace(/\n{3,}/g, '\n\n')
}
async function copyOffer() {
  if (!hasDraft.value || pending.value) return
  try {
    await navigator.clipboard.writeText(offerText())
    exportState.value = 'copied'
    exportMessage.value = 'Treść oferty skopiowana. Możesz ją teraz wkleić i udostępnić.'
  } catch {
    exportState.value = 'error'
    exportMessage.value = 'Przeglądarka nie pozwoliła skopiować tekstu. Użyj przycisku pobierania obok.'
  }
}
function downloadOffer() {
  if (!hasDraft.value || pending.value) return
  let url: string | undefined
  try {
    url = URL.createObjectURL(new Blob([offerText()], { type: 'text/plain;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'oferta-oferteo.txt'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    exportState.value = 'downloaded'
    exportMessage.value = 'Przygotowano plik oferta-oferteo.txt do pobrania.'
  } catch {
    exportState.value = 'error'
    exportMessage.value = 'Nie udało się pobrać pliku. Spróbuj skopiować treść oferty.'
  } finally {
    if (url) { const objectUrl = url; window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000) }
  }
}
onBeforeUnmount(() => {
  unmounted = true
  controller?.abort()
  window.visualViewport?.removeEventListener('resize', syncViewport)
  window.visualViewport?.removeEventListener('scroll', syncViewport)
})
</script>

<style scoped src="~/assets/css/oferteo-creator.css"></style>
<style scoped>
.oc-composer-bottom > .oc-stop { width: auto; min-width: 84px; padding-inline: 12px; font-size: 11px; font-weight: 700; }
</style>
