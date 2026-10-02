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
        <button v-if="filledFields" ref="planToggle" class="od-plan-toggle" type="button" :aria-label="showPlan ? 'Wróć do rozmowy' : 'Twój plan'" :aria-expanded="showPlan" aria-controls="od-project-plan" @click="showPlan = !showPlan"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 5H5v16h14V5h-3M8 3h8v4H8zM8 11h8m-8 4h5" /></svg><span>{{ showPlan ? 'Rozmowa' : 'Plan' }}</span></button>
        <button v-if="messages.length" class="od-reset" type="button" :disabled="pending" aria-label="Rozpocznij nową rozmowę" title="Nowa rozmowa" @click="resetConversation"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10a8 8 0 1 1 1 7M4 4v6h6" /></svg></button>
        <button class="od-about-button" type="button" aria-label="O demie" title="O demie" @click="infoDialog?.showModal()"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.5"/></svg></button>
      </div>
    </header>

    <section id="assistant" class="od-workspace ph-no-capture" :class="{ 'od-plan-open': showPlan, 'od-has-plan': filledFields > 0 }" aria-label="Asystent Oferteo">
      <div class="od-app-grid">
        <div class="od-chat" :class="{ 'od-chat-empty': !messages.length }">
          <div v-show="messages.length" ref="messageBox" class="od-messages" role="log" tabindex="0" aria-label="Rozmowa z asystentem" aria-live="polite" :aria-busy="pending">
            <div class="od-transcript">
              <div v-for="(message, index) in messages" :key="index" class="od-message" :class="[`od-message-${message.role}`, { 'od-message-with-results': message.result }]" :data-message-index="index">
                <span v-if="message.role === 'assistant'" class="od-mini-avatar" aria-hidden="true">✳</span>
                <div class="od-message-body">
                  <span class="od-message-name">{{ message.role === 'user' ? 'Ty' : 'Asystent Oferteo' }}</span>
                  <p>{{ message.content }}</p>
                  <OferteoToolResult v-if="message.result" :offers="message.result.offers" :brief="message.result.brief" />
                </div>
              </div>
              <div v-if="pending" class="od-message od-message-assistant"><span class="od-mini-avatar" aria-hidden="true">✳</span><div class="od-pending-result"><div class="od-thinking"><span><i /><i /><i /></span> Szukam dopasowania…</div></div></div>
              <div v-if="error" class="od-error" role="alert"><p>{{ error }}</p><button v-if="aiPaused" type="button" :disabled="statusPending" @click="refreshStatus()">{{ statusPending ? 'Sprawdzam…' : 'Sprawdź dostępność' }}</button><button v-else-if="messages.at(-1)?.role === 'user' && failure?.retryable !== false" type="button" :disabled="pending || !canRetry" @click="requestReply">{{ retrySeconds ? `Ponów za ${retrySeconds} s` : 'Spróbuj ponownie' }} <span aria-hidden="true">↻</span></button></div>
            </div>
          </div>

          <div class="od-composer-wrap">
            <div class="od-composer-content">
              <div v-if="!messages.length" class="od-intro">
                <p class="od-intro-label">Asystent Oferteo</p>
                <h2>Co chcesz zmienić w swoim domu?</h2>
                <p>Opisz prace, a pomogę Ci znaleźć wykonawcę.</p>
              </div>
              <div v-if="suggestions.length && !pending && !error" class="od-suggestions" aria-label="Sugerowane odpowiedzi"><button v-for="suggestion in suggestions" :key="suggestion" type="button" :disabled="aiPaused || retrySeconds > 0" @click="send(suggestion)">{{ suggestion }}</button></div>
              <form class="od-composer" @submit.prevent="send(draft)">
                <label class="od-sr-only" for="od-prompt">Opisz, jakiego wykonawcy szukasz</label>
                <textarea id="od-prompt" ref="composer" v-model="draft" :disabled="pending" maxlength="1500" rows="2" placeholder="Np. chcę wyremontować łazienkę w Warszawie…" @keydown.enter.exact="onEnter" />
                <div class="od-composer-bottom">
                  <OferteoVoice ref="voice" compact mode="search" :available="!aiPaused && status?.mode === 'live'" :checking="statusPending" :unavailable-reason="voiceUnavailableReason" :disabled="pending || retrySeconds > 0" :messages="messages" :update-workspace="updateVoiceWorkspace" @active="voiceActive = $event" @transcript="syncVoiceTranscript" @credits-exhausted="onVoiceCreditsExhausted" @request-failed="error = setFailure($event)" />
                  <button class="od-send" type="submit" :disabled="pending || aiPaused || retrySeconds > 0 || !draft.trim()" :aria-label="aiPaused ? 'Asystent niedostępny — brak środków' : pending ? 'Oczekiwanie na odpowiedź' : 'Wyślij wiadomość'"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6" /></svg></button>
                </div>
              </form>
              <div v-if="!messages.length" class="od-start-options" aria-label="Przykładowe opisy prac">
                <span>Wypróbuj przykład</span>
                <button v-for="(scenario, index) in scenarios" :key="scenario.label" type="button" :disabled="pending" :aria-label="`Wstaw przykład: ${scenario.label}`" @click="selectExample(index)">{{ scenario.label }}</button>
              </div>
              <div v-if="connectionNotice && (!error || !messages.length)" class="od-connection-notice" role="status">
                <span v-if="!error || messages.length">{{ connectionNotice }}</span>
                <button type="button" :disabled="statusPending || pending" @click="refreshStatus()">{{ statusPending ? 'Sprawdzam…' : aiPaused ? 'Sprawdź dostępność' : 'Ponów' }}</button>
              </div>
              <p class="od-chat-footnote">{{ mode === 'demo' || status?.mode === 'demo' ? 'Tryb przykładowy · bez połączenia z AI.' : 'Demo AI · rozmowa nie wysyła zapytań do firm.' }}</p>
            </div>
          </div>
        </div>

        <aside v-if="filledFields" id="od-project-plan" class="od-sidebar" aria-label="Podsumowanie Twojego zlecenia">
          <button class="od-plan-back" type="button" @click="closePlan"><span aria-hidden="true">←</span> Wróć do rozmowy</button>
          <div class="od-brief">
            <div class="od-brief-heading"><div><p>TWOJE ZLECENIE</p><h3>{{ brief.service || 'Ustalenia z rozmowy' }}</h3></div></div>
            <dl><div v-for="field in knownBriefFields" :key="field.key"><dt>{{ field.label }}</dt><dd>{{ brief[field.key] }}</dd></div></dl>
            <p class="od-brief-intro">Możesz zmienić te ustalenia w rozmowie.</p>
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
type ChatMessage = Message & { voiceId?: string; result?: Pick<ChatResponse, 'offers' | 'brief'> }
const messages = ref<ChatMessage[]>([])
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
const briefFields: { key: keyof Brief; label: string }[] = [{ key: 'city', label: 'Lokalizacja' }, { key: 'scope', label: 'Zakres prac' }, { key: 'area', label: 'Powierzchnia' }, { key: 'budget', label: 'Budżet' }, { key: 'timing', label: 'Termin' }]
const filledFields = computed(() => Object.values(brief.value).filter(Boolean).length)
const knownBriefFields = computed(() => briefFields.filter(field => brief.value[field.key]))
watch(filledFields, count => { if (!count && showPlan.value) closePlan() })
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
  if (messages.value.at(-1)?.role === 'user' && error.value) messages.value.pop()
  if (messages.value.length >= 16 || messages.value.reduce((total, message) => total + message.content.length, 0) + content.length > 9000) {
    error.value = 'Ta rozmowa osiągnęła limit demo. Rozpocznij nową rozmowę przyciskiem ↻ w nagłówku.'
    return
  }
  messages.value.push({ role: 'user', content })
  draft.value = ''
  suggestions.value = []
  await requestReply()
}
async function requestReply() {
  if (pending.value || !canRetry.value || messages.value.at(-1)?.role !== 'user') return
  pending.value = true
  error.value = ''
  clearFailure()
  await scrollMessages()
  controller = new AbortController()
  try {
    const result = await $fetch<ChatResponse>('/api/oferto/chat', { method: 'POST', body: { messages: voiceRequestMessages(messages.value) }, signal: controller.signal, timeout: 65000, retry: false })
    messages.value.push({
      role: 'assistant',
      content: result.message,
      result: result.offers.length ? { offers: result.offers, brief: { ...result.brief } } : undefined,
    })
    brief.value = result.brief
    suggestions.value = result.suggestions
    mode.value = result.mode
    if (statusError.value) await refreshStatus()
  } catch (cause: unknown) {
    error.value = setFailure(cause)
  } finally {
    pending.value = false
    if (showPlan.value) scrollReplyOnReturn = true
    else await scrollMessages(messages.value.at(-1)?.role === 'assistant')
    if (document.activeElement === document.body || document.activeElement === composer.value) {
      composer.value?.focus({ preventScroll: true })
    }
  }
}
function syncVoiceTranscript(transcript: VoiceMessage[]) {
  mergeOferteoVoiceTranscript(messages.value, transcript)
  void scrollMessages()
}
async function updateVoiceWorkspace(signal: AbortSignal) {
  if (aiPaused.value) throw { statusCode: 402 }
  if (pending.value || !canRetry.value) throw new Error('Oczekiwanie na wynik')
  pending.value = true; error.value = ''; suggestions.value = []
  try {
    const result = await $fetch<ChatResponse>('/api/oferto/chat', { method: 'POST', body: { messages: voiceRequestMessages(messages.value, true) }, signal, timeout: 65000, retry: false })
    if (signal.aborted) throw new Error('Rozmowa zakończona')
    brief.value = result.brief
    mode.value = result.mode
    messages.value.push({ role: 'assistant', content: result.message, result: { offers: result.offers, brief: { ...result.brief } } })
    if (showPlan.value) scrollReplyOnReturn = true
    else await scrollMessages(true)
    return result
  } catch (cause) {
    if (!signal.aborted) error.value = setFailure(cause)
    throw cause
  } finally { pending.value = false }
}
function resetConversation() {
  if (pending.value) return
  if (!retrySeconds.value) clearFailure()
  voice.value?.stop()
  showPlan.value = false
  scrollReplyOnReturn = false
  messages.value = []; brief.value = emptyBrief(); suggestions.value = []; draft.value = ''; error.value = ''; mode.value = null
  nextTick(() => composer.value?.focus({ preventScroll: true }))
}
onBeforeUnmount(() => {
  controller?.abort()
  window.visualViewport?.removeEventListener('resize', syncViewport)
  window.visualViewport?.removeEventListener('scroll', syncViewport)
})
</script>

<style scoped src="~/assets/css/oferteo-demo.css"></style>
