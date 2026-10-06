<template>
  <main class="od-page" :style="viewportStyle" @keydown.esc="showPlan && closePlan()">
    <a class="od-skip" href="#assistant">Przejdź do asystenta</a>
    <header class="od-app-header">
      <div class="od-app-brand">
        <NuxtLink to="/oferteo" class="od-logo" aria-label="Oferteo — propozycja współpracy"><span>o</span>ferte<span>o</span></NuxtLink>
        <h1>Znajdź wykonawcę <span>DEMO</span></h1>
      </div>
      <div class="od-app-actions">
        <NuxtLink to="/oferto/demo-2" class="od-other-demo" aria-label="Demo 2 — kreator oferty"><span class="od-desktop-label">Kreator oferty</span><span class="od-mobile-label">Kreator</span></NuxtLink>
        <button v-if="messages.length" class="od-reset" type="button" :disabled="pending" aria-label="Rozpocznij nową rozmowę" title="Nowa rozmowa" @click="resetConversation"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10a8 8 0 1 1 1 7M4 4v6h6" /></svg></button>
        <button class="od-about-button" type="button" aria-label="O demie" title="O demie" @click="infoDialog?.showModal()"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.5"/></svg></button>
      </div>
    </header>

    <section id="assistant" class="od-workspace ph-no-capture" :class="{ 'od-plan-open': showPlan }" aria-label="Asystent Oferteo">
      <div v-if="messages.length" class="od-mobile-tabs" aria-label="Widok asystenta">
        <button ref="planToggle" type="button" :class="{ 'od-tab-active': !showPlan }" :aria-pressed="!showPlan" aria-controls="od-chat-panel" @click="closePlan">Rozmowa</button>
        <button type="button" :class="{ 'od-tab-active': showPlan }" :aria-pressed="showPlan" aria-controls="od-project-plan" @click="showPlan = true">Wykonawcy <span v-if="latestResult?.offers.length">{{ latestResult.offers.length }}</span></button>
      </div>
      <div class="od-app-grid">
        <div id="od-chat-panel" class="od-chat" :class="{ 'od-chat-empty': !messages.length }">
          <div class="od-chat-toolbar">
            <span class="od-toolbar-avatar" aria-hidden="true">✳</span>
            <div><h2>Asystent Oferteo</h2><p>Od pomysłu do odpowiedniego wykonawcy</p></div>
            <span class="od-toolbar-label">Rozmowa</span>
          </div>
          <div v-show="messages.length" ref="messageBox" class="od-messages" role="log" tabindex="0" aria-label="Rozmowa z asystentem" aria-live="polite" :aria-busy="pending">
            <div class="od-transcript">
              <div v-for="(message, index) in messages" :key="index" class="od-message" :class="`od-message-${message.role}`" :data-message-index="index">
                <span v-if="message.role === 'assistant'" class="od-mini-avatar" aria-hidden="true">✳</span>
                <div class="od-message-body">
                  <span class="od-message-name">{{ message.role === 'user' ? 'Ty' : 'Asystent Oferteo' }}</span>
                  <p>{{ message.content }}</p>
                  <button v-if="message.result?.offers.length && message.result === latestResult" class="od-result-link" type="button" aria-controls="od-project-plan" @click="viewResults"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5"/><path d="m12 12 4 4"/></svg>Zobacz wykonawców <span>{{ message.result.offers.length }}</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5"/></svg></button>
                </div>
              </div>
              <div v-if="pending && !streamingMessage" class="od-message od-message-assistant"><span class="od-mini-avatar" aria-hidden="true">✳</span><div class="od-pending-result"><div class="od-thinking"><span><i /><i /><i /></span> Szukam dopasowania…</div></div></div>
              <p v-if="streamNotice" class="od-connection-notice" role="status">{{ streamNotice }} <button v-if="retryMessages || messages.at(-1)?.role === 'user'" type="button" :disabled="pending || !canRetry" @click="requestReply">Spróbuj ponownie</button></p>
              <div v-if="error" class="od-error" role="alert"><p>{{ error }}</p><button v-if="aiPaused" type="button" :disabled="statusPending" @click="refreshStatus()">{{ statusPending ? 'Sprawdzam…' : 'Sprawdź dostępność' }}</button><button v-else-if="(retryMessages || messages.at(-1)?.role === 'user') && failure?.retryable !== false" type="button" :disabled="pending || !canRetry" @click="requestReply">{{ retrySeconds ? `Ponów za ${retrySeconds} s` : 'Spróbuj ponownie' }} <span aria-hidden="true">↻</span></button></div>
            </div>
          </div>

          <div v-if="!messages.length" class="od-welcome">
            <div class="od-welcome-content">
              <div class="od-intro">
                <p class="od-intro-label">Asystent Oferteo</p>
                <h2>Co chcesz zmienić w swoim domu?</h2>
                <p>Opisz prace, a pomogę Ci znaleźć wykonawcę.</p>
              </div>
              <div class="od-start-options" aria-label="Przykładowe opisy prac">
                <span>Wypróbuj przykład</span>
                <button v-for="(scenario, index) in scenarios" :key="scenario.label" type="button" :disabled="pending" :aria-label="`Wstaw przykład: ${scenario.label}`" @click="selectExample(index)">{{ scenario.label }}</button>
              </div>
            </div>
          </div>

          <div class="od-composer-wrap">
            <div class="od-composer-content">
              <div v-if="suggestions.length && !pending && !error" class="od-suggestions" aria-label="Sugerowane odpowiedzi"><button v-for="suggestion in suggestions" :key="suggestion" type="button" :disabled="aiPaused || retrySeconds > 0" @click="send(suggestion)">{{ suggestion }}</button></div>
              <div v-if="connectionNotice && (!error || !messages.length)" class="od-connection-notice" role="status">
                <span v-if="!error || messages.length">{{ connectionNotice }}</span>
                <button type="button" :disabled="statusPending || pending" @click="refreshStatus()">{{ statusPending ? 'Sprawdzam…' : aiPaused ? 'Sprawdź dostępność' : 'Ponów' }}</button>
              </div>
              <form class="od-composer" @submit.prevent="send(draft)">
                <label class="od-sr-only" for="od-prompt">Opisz, jakiego wykonawcy szukasz</label>
                <textarea id="od-prompt" ref="composer" v-model="draft" :disabled="pending" maxlength="1500" rows="1" placeholder="Np. chcę wyremontować łazienkę w Warszawie…" @keydown.enter.exact="onEnter" />
                <div class="od-composer-bottom">
                  <OferteoVoice ref="voice" compact mode="search" :available="!aiPaused && status?.mode === 'live'" :checking="statusPending" :unavailable-reason="voiceUnavailableReason" :disabled="pending || retrySeconds > 0" :messages="finalMessages" :update-workspace="updateVoiceWorkspace" @active="voiceActive = $event" @transcript="syncVoiceTranscript" @credits-exhausted="onVoiceCreditsExhausted" @request-failed="error = setFailure($event)" />
                  <button v-if="pending" class="od-send" type="button" aria-label="Zatrzymaj odpowiedź" title="Zatrzymaj" @click="stopReply"><svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="2" /></svg></button>
                  <button v-else class="od-send" type="submit" :disabled="aiPaused || retrySeconds > 0 || !draft.trim()" :aria-label="aiPaused ? 'Asystent niedostępny — brak środków' : 'Wyślij wiadomość'"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6" /></svg></button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <aside id="od-project-plan" ref="resultsPanel" class="od-sidebar" aria-label="Wykonawcy i Twoje zlecenie" tabindex="-1">
          <div class="od-results-toolbar"><div><p class="od-eyebrow">TWOJE DOPASOWANIA</p><h2>Wykonawcy dla Ciebie</h2></div><span class="od-results-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="m9 12 2 2 4-4"/><rect x="4" y="4" width="16" height="16" rx="5"/></svg></span></div>
          <button class="od-plan-back" type="button" @click="closePlan"><span aria-hidden="true">←</span> Wróć do rozmowy</button>
          <div class="od-sidebar-content">
            <div v-if="filledFields" class="od-brief">
              <div class="od-brief-heading"><span class="od-brief-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="m3 10 9-7 9 7M5 9v11h14V9M9 20v-7h6v7"/></svg></span><div><p>TWOJE ZLECENIE</p><h3>{{ brief.service || 'Ustalenia z rozmowy' }}</h3></div></div>
              <div v-if="brief.city || brief.area" class="od-brief-location"><span v-if="brief.city"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M15.5 8c0 4-5.5 8.5-5.5 8.5S4.5 12 4.5 8a5.5 5.5 0 0 1 11 0Z"/><circle cx="10" cy="8" r="1.75"/></svg>{{ brief.city }}</span><span v-if="brief.area">{{ brief.area }}</span></div>
              <details v-if="knownBriefFields.length" class="od-brief-details"><summary>Szczegóły zlecenia<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m6 8 4 4 4-4"/></svg></summary><dl><div v-for="field in knownBriefFields" :key="field.key"><dt>{{ field.label }}</dt><dd>{{ brief[field.key] }}</dd></div></dl><p class="od-brief-intro">Zmień ustalenia, pisząc w rozmowie.</p></details>
            </div>
            <div v-if="pending" class="od-results-updating" role="status"><span class="od-status-dot"/>{{ latestResult ? 'Aktualizuję dopasowania…' : 'Szukam wykonawców do Twojego zlecenia…' }}</div>
            <OferteoToolResult v-if="latestResult" :offers="latestResult.offers" :brief="latestResult.brief" />
            <div v-else class="od-results-empty">
              <div class="od-empty-illustration" aria-hidden="true"><div class="od-empty-card"><span/><div><i/><i/></div><svg viewBox="0 0 20 20" fill="none"><path d="m5 10 3 3 7-7"/></svg></div><span class="od-empty-search"><svg viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5"/></svg></span></div>
              <h3>Tu znajdziesz swoich wykonawców</h3>
              <p>Opisz, czego potrzebujesz. Dopasowane profile pojawią się tutaj — obok rozmowy.</p>
              <div class="od-empty-steps"><span><i>1</i> Opisz prace</span><span><i>2</i> Doprecyzuj szczegóły</span><span><i>3</i> Poznaj wykonawców</span></div>
            </div>
            <p v-if="latestResult?.offers.length" class="od-results-hint"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 4h12v9H9l-4 3v-3H4z"/></svg>Doprecyzuj potrzeby w rozmowie, aby zawęzić wybór.</p>
          </div>
        </aside>
      </div>
    </section>

    <dialog ref="infoDialog" class="od-info-dialog" aria-labelledby="od-info-title">
      <div class="od-dialog-header"><div><span class="od-eyebrow">PROPOZYCJA DLA OFERTEO</span><h2 id="od-info-title">O tym demie</h2></div><button type="button" aria-label="Zamknij informacje o demie" @click="infoDialog?.close()"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div>
    <section id="idea" class="od-idea-section"><div class="od-width"><div class="od-idea-intro"><p class="od-eyebrow">DLACZEGO TEN POMYSŁ?</p><h2>Klient zna swój problem.<br>Niekoniecznie zna branżę.</h2><p>„Chcę nową łazienkę” to początek rozmowy. Do dobrej wyceny potrzebne są jeszcze zakres, metraż i termin. Tu widzę miejsce dla asystenta.</p></div><div class="od-idea-grid"><article><span class="od-step-number">01 <span>WYZWANIE</span></span><h3>Od potrzeby do briefu<br> jest kilka pytań.</h3><p>Hipoteza: klient nie zawsze wie, jak opisać prace, a wykonawca musi dopytywać o podstawy przed wyceną.</p></article><article><span class="od-step-number">02 <span>PROPOZYCJA</span></span><h3>Rozmowa, która prowadzi<br> do konkretów.</h3><p>AI dopytuje prostym językiem, porządkuje ustalenia i wyjaśnia, dlaczego dany wykonawca może pasować.</p></article><article><span class="od-step-number">03 <span>CO SPRAWDZIĆ</span></span><h3>Czy łatwiej przejść<br> do dobrej rozmowy?</h3><p>W pilocie mierzyłbym kompletność briefu, przejścia do profili i liczbę dodatkowych pytań przed wyceną.</p></article></div><details class="od-how"><summary>Co działa pod spodem <span aria-hidden="true">+</span></summary><div><p><strong>Rozmowa → uporządkowany brief → katalog → uzasadnienie.</strong> DeepSeek V4.1 Flash przez Vercel AI Gateway analizuje opis i wybiera profile z niewielkiego katalogu publicznych danych Oferteo w Neon. Backend sprawdza identyfikatory firm, a ceny i terminy pozostają do potwierdzenia.</p><p>{{ status?.source === 'neon' ? `Katalog: Neon · ${status.catalogCount} profili.` : 'Katalog: lokalny zapis publicznych profili.' }} {{ isLive ? 'Połączenie z AI jest skonfigurowane.' : status?.mode === 'unavailable' ? 'Połączenie z AI jest chwilowo niedostępne.' : 'Bez konfiguracji AI dostępna jest jawnie oznaczona rozmowa przykładowa.' }} Demo jest niezależną propozycją Konrada Straszewskiego i nie jest oficjalną usługą Oferteo.</p><a href="https://www.oferteo.pl/remont-lazienki/warszawa" target="_blank" rel="noopener noreferrer">Źródło katalogu: Oferteo ↗</a></div></details></div></section>
    <footer class="od-footer od-width"><NuxtLink class="od-footer-author" to="/oferteo"><span class="od-author-mark">ks.</span><span>Pomysł i realizacja<strong>Konrad Straszewski</strong></span></NuxtLink><p>Propozycja dla Oferteo · wrzesień 2026</p><a href="mailto:koonradstraszewski@gmail.com">Porozmawiajmy <span aria-hidden="true">↗</span></a></footer>
    </dialog>
  </main>
</template>

<script setup lang="ts">
import type { OferteoBrief as Brief, OferteoMessage as Message, OferteoChatResponse as ChatResponse, OferteoStatus as Status } from '~~/shared/types/oferteo'
import { mergeOferteoVoiceTranscript, voiceRequestMessages, type VoiceMessage } from '~~/shared/oferteo-realtime'
import { OFERTEO_CREDITS_MESSAGE, oferteoUiFailure } from '~~/shared/oferteo-errors'
import type { OferteoChatPartial } from '~~/shared/types/oferteo-stream'
import { requestOferteoStream } from '~/utils/oferteoStream'
definePageMeta({ alias: ['/oferto/demo-1'] })
useSeoMeta({ title: 'Demo 1: szukanie wykonawcy — Oferteo | Konrad Straszewski', description: 'Wypróbuj asystenta, który pomaga opisać remont i dopasowuje wykonawców z publicznych profili Oferteo.', robots: 'noindex, nofollow' })
useHead({
  htmlAttrs: { lang: 'pl', class: 'od-fullscreen' },
  bodyAttrs: { class: 'od-fullscreen' },
  meta: [{ name: 'theme-color', content: '#ffffff' }, { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content' }],
})
// BotID needs the browser challenge; do not call this protected endpoint in SSR.
const { data: status, error: statusError, pending: statusPending, refresh: refreshStatus } = await useFetch<Status>('/api/oferto/status', { server: false, retry: false })
const { failure, aiPaused, canRetry, retrySeconds, setFailure, clearFailure } = useOferteoAvailability(status)
const voiceUnavailableReason = computed(() => aiPaused.value ? OFERTEO_CREDITS_MESSAGE : statusError.value
  ? oferteoUiFailure(statusError.value).message
  : status.value?.mode === 'unavailable' ? 'Obsługa rozmów jest chwilowo niedostępna. Spróbuj ponownie za chwilę.'
    : 'Rozmowa głosowa wymaga aktywnego połączenia z AI.')
const connectionNotice = computed(() => aiPaused.value ? OFERTEO_CREDITS_MESSAGE : statusError.value ? oferteoUiFailure(statusError.value).message
  : status.value?.mode === 'unavailable' ? 'Asystent jest chwilowo niedostępny.' : '')
const isLive = computed(() => !aiPaused.value && status.value?.mode !== 'unavailable' && (mode.value === 'live' || (mode.value !== 'demo' && status.value?.aiConfigured === true)))
const emptyBrief = (): Brief => ({ service: null, city: null, scope: null, area: null, budget: null, timing: null })
type ChatMessage = Message & { voiceId?: string; result?: Pick<ChatResponse, 'offers' | 'brief'>; streaming?: boolean }
const messages = ref<ChatMessage[]>([])
const finalMessages = computed(() => messages.value.filter(message => !message.streaming))
const streamingMessage = computed(() => messages.value.find(message => message.streaming))
const streamNotice = ref('')
const voice = ref<{ stop: () => void; sendText: (text: string) => boolean } | null>(null)
const voiceActive = ref(false)
const brief = ref<Brief>(emptyBrief())
const suggestions = ref<string[]>([])
const draft = ref('')
const pending = ref(false)
const error = ref('')
watch(aiPaused, (paused, wasPaused) => { if (!paused && wasPaused) error.value = failure.value?.message || '' })
function onVoiceCreditsExhausted() { error.value = setFailure({ statusCode: 402 }) }
const mode = ref<'live' | 'demo' | null>(null)
const selectedScenario = ref(0)
const showPlan = ref(false)
let scrollReplyOnReturn = false
const planToggle = ref<HTMLButtonElement | null>(null)
const infoDialog = ref<HTMLDialogElement | null>(null)
const viewportStyle = ref<{ height: string; top: string }>()
function closePlan() { showPlan.value = false; nextTick(() => (planToggle.value || composer.value)?.focus({ preventScroll: true })) }
watch(showPlan, open => {
  if (!open && scrollReplyOnReturn) {
    scrollReplyOnReturn = false
    void scrollMessages(messages.value.at(-1)?.role === 'assistant')
  }
})
function syncViewport() {
  const viewport = window.visualViewport
  // Let pinch zoom work normally; follow only keyboard/browser-chrome resizing.
  if (viewport && viewport.scale === 1) viewportStyle.value = { height: `${viewport.height}px`, top: `${viewport.offsetTop}px` }
}
onMounted(() => {
  syncViewport()
  window.visualViewport?.addEventListener('resize', syncViewport)
  window.visualViewport?.addEventListener('scroll', syncViewport)
})
const messageBox = ref<HTMLElement | null>(null)
const composer = ref<HTMLTextAreaElement | null>(null)
let controller: AbortController | undefined
let unmounted = false
const retryMessages = ref<Message[]>()
let followingStream = true
const briefFields: { key: keyof Brief; label: string }[] = [{ key: 'city', label: 'Lokalizacja' }, { key: 'scope', label: 'Zakres prac' }, { key: 'area', label: 'Powierzchnia' }, { key: 'budget', label: 'Budżet' }, { key: 'timing', label: 'Termin' }]
const filledFields = computed(() => Object.values(brief.value).filter(Boolean).length)
const knownBriefFields = computed(() => briefFields.filter(field => brief.value[field.key]))
const latestResult = computed(() => [...messages.value].reverse().find(message => message.result)?.result)
const resultsPanel = ref<HTMLElement | null>(null)
async function viewResults() {
  if (window.matchMedia('(max-width: 760px)').matches) showPlan.value = true
  await nextTick()
  resultsPanel.value?.focus({ preventScroll: true })
}
const scenarios = [
  { label: 'Remont łazienki', short: 'Cała łazienka do remontu', icon: '⌂', prompt: 'Chcę kompleksowo wyremontować łazienkę 6 m² w Warszawie. Trzeba wymienić płytki, prysznic i instalację wodną. Budżet do 30 tys. zł, najlepiej w ciągu 2 miesięcy. Kogo polecasz?' },
  { label: 'Wymiana płytek', short: 'Czas na nowe płytki', icon: '▦', prompt: 'Szukam glazurnika w Warszawie. Chcę wymienić płytki na ścianach i podłodze w łazience 5 m², bez zmian instalacji. Termin jest elastyczny, budżet jeszcze do ustalenia.' },
  { label: 'Łazienka dla seniora', short: 'Wygodniej dla bliskich', icon: '♡', prompt: 'Chcę dostosować łazienkę 4 m² dla starszej mamy w Warszawie. Potrzebuję prysznica bez progu zamiast wanny, uchwytów i antypoślizgowej podłogi. Nie wiem, od czego zacząć. Szukam firmy, która pomoże ustalić zakres.' }
]
async function scrollMessages(toLatestReply = false) {
  await nextTick()
  const box = messageBox.value
  if (!box) return
  const reply = toLatestReply ? box.querySelector<HTMLElement>(`[data-message-index="${messages.value.length - 1}"]`) : null
  // Show the start of a new reply so its result header is visible, even for a long shortlist.
  box.scrollTop = reply ? box.scrollTop + reply.getBoundingClientRect().top - box.getBoundingClientRect().top - 20 : box.scrollHeight
}
function loadScenario() { draft.value = scenarios[selectedScenario.value]!.prompt; nextTick(() => composer.value?.focus({ preventScroll: true })) }
function selectExample(index: number) { selectedScenario.value = index; loadScenario() }
function onEnter(event: KeyboardEvent) { if (event.isComposing) return; event.preventDefault(); send(draft.value) }
async function send(value: string) {
  const content = value.trim()
  if (!content || pending.value || aiPaused.value || retrySeconds.value > 0 || content.length > 1500) return
  if (voiceActive.value) { if (voice.value?.sendText(content)) { draft.value = ''; suggestions.value = [] }; return }
  clearFailure()
  if (messages.value.at(-1)?.role === 'user' && (error.value || streamNotice.value)) messages.value.pop()
  if (messages.value.length >= 16 || messages.value.reduce((total, message) => total + message.content.length, 0) + content.length > 9000) {
    error.value = 'Ta rozmowa osiągnęła limit demo. Rozpocznij nową rozmowę przyciskiem ↻ w nagłówku.'
    return
  }
  messages.value.push({ role: 'user', content })
  retryMessages.value = undefined
  draft.value = ''
  suggestions.value = []
  await requestReply()
}
async function requestReply() {
  const history = retryMessages.value || voiceRequestMessages(finalMessages.value)
  if (pending.value || !canRetry.value || history.at(-1)?.role !== 'user') return
  controller = new AbortController()
  try {
    await streamReply(controller.signal, history)
    if (statusError.value && !unmounted) void refreshStatus()
  } catch { /* streamReply has already mapped the error or intentional stop. */ }
}
function syncVoiceTranscript(transcript: VoiceMessage[]) {
  mergeOferteoVoiceTranscript(messages.value, transcript)
  void scrollMessages()
}
async function updateVoiceWorkspace(signal: AbortSignal) {
  if (aiPaused.value) throw { statusCode: 402 }
  if (pending.value || !canRetry.value) throw new Error('Oczekiwanie na wynik')
  controller = new AbortController()
  return streamReply(AbortSignal.any([signal, controller.signal]), voiceRequestMessages(finalMessages.value, true))
}
function stopReply() {
  controller?.abort()
  if (voiceActive.value) voice.value?.stop()
}
async function streamReply(signal: AbortSignal, history: Message[]) {
  const previousBrief = { ...brief.value }
  pending.value = true; error.value = ''; streamNotice.value = ''; suggestions.value = []
  clearFailure()
  await scrollMessages()
  followingStream = true
  try {
    const result = await requestOferteoStream<ChatResponse, OferteoChatPartial>('/api/oferto/chat', { messages: history }, {
      signal,
      onPartial: partial => {
        if (signal.aborted || unmounted) return
        const box = messageBox.value
        const following = !box || box.scrollHeight - box.scrollTop - box.clientHeight < 100
        followingStream = following
        if (partial.message !== undefined) {
          if (streamingMessage.value) streamingMessage.value.content = partial.message
          else if (partial.message) messages.value.push({ role: 'assistant', content: partial.message, streaming: true })
          if (!partial.message) messages.value = finalMessages.value
        }
        if (partial.brief) brief.value = { ...previousBrief, ...partial.brief }
        if (following) void nextTick(() => { if (messageBox.value) messageBox.value.scrollTop = messageBox.value.scrollHeight })
      },
    })
    signal.throwIfAborted()
    if (unmounted) return result
    const box = messageBox.value
    followingStream = !box || box.scrollHeight - box.scrollTop - box.clientHeight < 100
    messages.value = finalMessages.value
    retryMessages.value = undefined
    brief.value = result.brief
    mode.value = result.mode
    suggestions.value = result.suggestions
    messages.value.push({ role: 'assistant', content: result.message, result: { offers: result.offers, brief: { ...result.brief } } })
    return result
  } catch (cause) {
    if (!unmounted) {
      messages.value = finalMessages.value
      brief.value = previousBrief
      retryMessages.value = history
      if (signal.aborted) streamNotice.value = 'Odpowiedź zatrzymana. Możesz ponowić pytanie lub napisać nową wiadomość.'
      else error.value = setFailure(cause)
    }
    throw cause
  } finally {
    if (!unmounted) {
      const box = messageBox.value
      // A reader may scroll away after the last chunk or while waiting.
      followingStream = followingStream && (!box || box.scrollHeight - box.scrollTop - box.clientHeight < 100)
      pending.value = false
      if (followingStream && showPlan.value) scrollReplyOnReturn = true
      else if (followingStream) await scrollMessages(messages.value.at(-1)?.role === 'assistant')
      if (document.activeElement === document.body || document.activeElement === composer.value) composer.value?.focus({ preventScroll: true })
    }
  }
}
function resetConversation() {
  if (pending.value) return
  if (!retrySeconds.value) clearFailure()
  voice.value?.stop()
  showPlan.value = false
  scrollReplyOnReturn = false
  retryMessages.value = undefined
  messages.value = []; brief.value = emptyBrief(); suggestions.value = []; draft.value = ''; error.value = ''; streamNotice.value = ''; mode.value = null
  nextTick(() => composer.value?.focus({ preventScroll: true }))
}
onBeforeUnmount(() => {
  unmounted = true
  controller?.abort()
  window.visualViewport?.removeEventListener('resize', syncViewport)
  window.visualViewport?.removeEventListener('scroll', syncViewport)
})
</script>

<style scoped src="~/assets/css/oferteo-demo.css"></style>
