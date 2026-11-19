<script setup lang="ts">
import type { Component } from 'vue'
import AiToUiChecklist from '~/components/AiToUiChecklist.vue'
import AiToUiComparison from '~/components/AiToUiComparison.vue'
import AiToUiText from '~/components/AiToUiText.vue'
import { requestAiToUiReply } from '~/utils/aiToUiStream'
import { aiToUiScenario, sampleComparison } from '~~/shared/data/ai-to-ui'
import { AI_TO_UI_LIMITS } from '~~/shared/types/ai-to-ui'
import type { AiToUiMessage, AiToUiReply, AiToUiStatus, AiToUiView } from '~~/shared/types/ai-to-ui'

// The response type picks the component. This map is the whole "AI to UI" step.
const views: Record<AiToUiView, { component: Component, label: string }> = {
  text: { component: AiToUiText, label: 'a text reply' },
  comparison: { component: AiToUiComparison, label: 'a comparison table' },
  checklist: { component: AiToUiChecklist, label: 'a checklist' },
}
const viewOf = (reply: AiToUiReply) => views[reply.view] ?? views.text

type AssistantEntry = {
  id: number
  role: 'assistant'
  reply: AiToUiReply
  streaming: boolean
  firstRenderMs?: number
  completeMs?: number
}
type Entry = { id: number, role: 'user', content: string } | AssistantEntry
type Failure = { message: string, retryable: boolean }

const examples = [
  'Compare contractors',
  'What should I ask before accepting a quote?',
  'How long does the renovation take?',
]
const REQUEST_TIMEOUT_MS = 20_000

const { data: status, error: statusError, refresh: refreshStatus } = useFetch<AiToUiStatus>('/api/ai-to-ui/status', { key: 'ai-to-ui-status' })

const uid = useId()
const entries = ref<Entry[]>([])
const draft = ref('')
const pending = ref(false)
const failure = ref<Failure | null>(null)
const announcement = ref('')
const log = ref<HTMLElement | null>(null)
const composer = ref<HTMLFormElement | null>(null)
const field = ref<HTMLTextAreaElement | null>(null)

let nextId = 1
let controller: AbortController | undefined
let unmounted = false

const mode = computed(() => {
  if (statusError.value) return 'unavailable'
  if (!status.value) return 'pending'
  return status.value.mode === 'ai' ? 'ai' : 'unavailable'
})
const modeLabel = computed(() => ({ ai: 'AI mode', unavailable: 'AI unavailable', pending: 'Checking AI' })[mode.value])
const modeNote = computed(() => {
  if (mode.value === 'ai') {
    const model = status.value?.model
    const dailyLimit = status.value?.dailyLimit
    const limit = dailyLimit ? ` The demo shares a limit of ${dailyLimit} questions per day.` : ''
    return `The model${model ? ` (${model})` : ''} chooses the view and streams its data and reply.${limit}`
  }
  if (mode.value === 'pending') return 'Checking live AI availability.'
  if (import.meta.dev && status.value?.missingKey) return 'Configure an AI Gateway key to start the local AI demo.'
  return 'Live AI is currently unavailable.'
})
const canAsk = computed(() => mode.value === 'ai' && !pending.value)
const canSend = computed(() => canAsk.value && draft.value.trim().length > 0)
// Until the first snapshot arrives there is only the loading line to show.
const awaitingFirstSnapshot = computed(() => pending.value && entries.value.at(-1)?.role === 'user')
const elapsedNumber = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const formatElapsed = (ms: number) => `${elapsedNumber.format(ms)} ms`

function requestHistory(): AiToUiMessage[] {
  return entries.value
    .map((entry): AiToUiMessage => entry.role === 'user'
      ? { role: 'user', content: entry.content }
      : { role: 'assistant', content: entry.reply.answer })
    .slice(-AI_TO_UI_LIMITS.historyMessages)
}

function describeFailure(cause: unknown, timedOut: boolean): Failure {
  if (timedOut) return { message: 'The reply timed out. Your question is still in the chat.', retryable: true }
  // Display app-owned copy for known error codes.
  const error = (cause && typeof cause === 'object' ? cause : {}) as { statusCode?: number, status?: number, code?: string }
  const code = Number(error.statusCode ?? error.status ?? 0)
  if (!code) {
    // No status means the request never got an answer. Say which side is down.
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return { message: 'Check your internet connection and try again.', retryable: true }
    }
    return {
      message: import.meta.dev
        ? 'Check that the local server is running, then try again.'
        : 'The server is unavailable. Try again in a moment.',
      retryable: true,
    }
  }
  if ([400, 413, 415].includes(code)) {
    return { message: `Enter a question of up to ${AI_TO_UI_LIMITS.questionChars} characters and send it again.`, retryable: false }
  }
  if (error.code === 'AI_BOT_BLOCKED') return { message: 'The browser verification did not pass. Reload the page and try again.', retryable: false }
  if (error.code === 'AI_BOT_CHECK_UNAVAILABLE') return { message: 'Browser verification is temporarily unavailable. Try again in a moment.', retryable: true }
  if (error.code === 'AI_DAILY_LIMIT') return { message: 'The demo reached its daily limit. Try again after midnight in Warsaw.', retryable: false }
  if (code === 408) return { message: 'Sending your question timed out. Try again.', retryable: true }
  if (code === 429) return { message: 'Too many questions in a short time. Wait a moment and try again.', retryable: true }
  if (code === 504) return { message: 'The model took too long to reply. Try again.', retryable: true }
  if (code === 503) return { message: 'Live AI is temporarily unavailable. Try again in a moment.', retryable: true }
  if (code === 502) return { message: 'The model could not complete the reply. Try again.', retryable: true }
  return { message: 'The server encountered an error. Try again.', retryable: true }
}

/** Keep the latest question and its answer in view without jumping when they already fit. */
async function reveal() {
  await nextTick()
  const list = log.value
  const question = list ? [...list.querySelectorAll<HTMLElement>('[data-role="user"]')].at(-1) : undefined
  const last = list?.lastElementChild
  if (!question || !last) return
  const visibleBottom = Math.min(window.innerHeight, composer.value?.getBoundingClientRect().top ?? window.innerHeight)
  if (question.getBoundingClientRect().top >= 0 && last.getBoundingClientRect().bottom <= visibleBottom) return
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  question.scrollIntoView({ block: 'start', behavior: calm ? 'auto' : 'smooth' })
}

async function requestReply() {
  if (!canAsk.value || entries.value.at(-1)?.role !== 'user') return
  const startedAt = performance.now()
  pending.value = true
  failure.value = null
  announcement.value = 'Question sent. Preparing a reply.'
  let timedOut = false
  controller = new AbortController()
  const timer = setTimeout(() => {
    timedOut = true
    controller?.abort()
  }, REQUEST_TIMEOUT_MS)
  void reveal()
  // One entry per reply: snapshots update it in place, so a view keeps its
  // own state (sort order, ticked boxes) while its text is still arriving.
  let assistant: AssistantEntry | undefined
  const show = (reply: AiToUiReply, streaming: boolean) => {
    if (assistant) {
      assistant.reply = reply
      assistant.streaming = streaming
      return assistant
    }
    const entry = reactive<AssistantEntry>({ id: nextId++, role: 'assistant', reply, streaming })
    assistant = entry
    entries.value.push(entry)
    void nextTick(() => {
      if (!unmounted) entry.firstRenderMs = performance.now() - startedAt
    })
    void reveal()
    return entry
  }
  try {
    const reply = await requestAiToUiReply(requestHistory(), {
      signal: controller.signal,
      onPartial: (snapshot) => { if (!unmounted) show(snapshot, true) },
    })
    if (unmounted) return
    const entry = show(reply, false)
    await nextTick()
    if (unmounted) return
    entry.completeMs = performance.now() - startedAt
    announcement.value = `Reply ready. Showing ${viewOf(reply).label}. ${reply.answer}`
  } catch (cause) {
    if (unmounted) return
    // Provisional output is dropped. Only a validated reply stays in the history.
    entries.value = entries.value.filter(entry => entry.id !== assistant?.id)
    failure.value = describeFailure(cause, timedOut)
    announcement.value = ''
  } finally {
    clearTimeout(timer)
    if (!unmounted) {
      pending.value = false
      void reveal()
    }
  }
}

async function ask(question: string) {
  const content = question.trim()
  if (!content || !canAsk.value || content.length > AI_TO_UI_LIMITS.questionChars) return
  // A question that never got an answer is replaced instead of stacking up.
  if (entries.value.at(-1)?.role === 'user') entries.value.pop()
  entries.value.push({ id: nextId++, role: 'user', content })
  draft.value = ''
  await requestReply()
}

function onEnter(event: KeyboardEvent) {
  if (event.isComposing) return
  event.preventDefault()
  void ask(draft.value)
}

// Grow with the question up to the CSS max-height, then scroll inside.
watch(draft, async () => {
  await nextTick()
  const element = field.value
  if (!element) return
  element.style.height = 'auto'
  element.style.height = `${element.scrollHeight + element.offsetHeight - element.clientHeight}px`
})

onBeforeUnmount(() => {
  unmounted = true
  controller?.abort()
})
</script>

<template>
  <!-- ph-no-capture: questions typed here are not sent to product analytics. -->
  <section class="atu-chat ph-no-capture" :aria-labelledby="`${uid}-title`">
    <header class="atu-chat__head">
      <div class="atu-chat__head-top">
        <p class="atu-chat__kicker">Demo scenario</p>
        <p class="atu-mode" :class="`atu-mode--${mode}`"><i aria-hidden="true" />{{ modeLabel }}</p>
      </div>
      <h2 :id="`${uid}-title`">{{ aiToUiScenario.title }}</h2>
      <p class="atu-chat__summary">{{ aiToUiScenario.summary }}</p>
      <p class="atu-chat__mode-note">{{ modeNote }}</p>
    </header>

    <div class="atu-chat__body">
      <div v-if="!entries.length && mode === 'ai'" class="atu-chat__empty">
        <p class="atu-chat__empty-title">Ask about this renovation.</p>
        <p>Choose an example below or type your own question and select Send.</p>
      </div>

      <div v-else-if="!entries.length && statusError" class="atu-error" role="alert">
        <p>Could not check whether the model is available.</p>
        <button type="button" @click="refreshStatus()">Check again</button>
      </div>

      <ol v-else-if="entries.length" ref="log" class="atu-chat__log" aria-label="Conversation history">
        <template v-for="entry in entries" :key="entry.id">
          <li v-if="entry.role === 'user'" class="atu-msg atu-msg--user" data-role="user">
            <span class="atu-sr">You. </span>
            <p>{{ entry.content }}</p>
          </li>
          <li v-else class="atu-msg atu-msg--bot" :class="{ 'is-streaming': entry.streaming }" :aria-busy="entry.streaming">
            <span class="atu-sr">Assistant. </span>
            <p class="atu-trace">
              <span>View <code>{{ entry.reply.view }}</code></span>
              <span v-if="entry.firstRenderMs !== undefined">First render <strong>{{ formatElapsed(entry.firstRenderMs) }}</strong></span>
              <span v-if="entry.completeMs !== undefined">Complete <strong>{{ formatElapsed(entry.completeMs) }}</strong></span>
              <span v-else-if="entry.streaming">Streaming</span>
            </p>
            <component :is="viewOf(entry.reply).component" :reply="entry.reply" />
          </li>
        </template>

        <li v-if="awaitingFirstSnapshot" class="atu-msg atu-msg--bot atu-pending">
          <span class="atu-pending__dots" aria-hidden="true"><i /><i /><i /></span>
          The model is choosing a view
        </li>

        <li v-if="failure" class="atu-msg atu-msg--bot">
          <div class="atu-error" role="alert">
            <p><strong>Unable to get a reply.</strong> {{ failure.message }}</p>
            <button v-if="failure.retryable" type="button" :disabled="!canAsk" @click="requestReply">Try again</button>
          </div>
        </li>
      </ol>

      <details class="atu-sample">
        <summary>View sample result</summary>
        <p class="atu-sample__note">Saved example for “Compare contractors”. You can sort the fictional quotes below.</p>
        <AiToUiComparison :reply="sampleComparison" />
      </details>

      <div class="atu-chat__examples">
        <p :id="`${uid}-examples`" class="atu-chat__kicker">Example questions</p>
        <div class="atu-chat__chips" role="group" :aria-labelledby="`${uid}-examples`">
          <!-- aria-disabled keeps keyboard focus on the button while a reply loads. -->
          <button v-for="example in examples" :key="example" type="button" class="atu-chip" :aria-disabled="!canAsk" @click="ask(example)">{{ example }}</button>
        </div>
      </div>
    </div>

    <!-- Pinned to the viewport only once there is a conversation to scroll through. -->
    <form ref="composer" class="atu-composer" :class="{ 'atu-composer--pinned': entries.length }" @submit.prevent="ask(draft)">
      <label class="atu-sr" :for="`${uid}-field`">Your question about the bathroom renovation</label>
      <textarea
        :id="`${uid}-field`"
        ref="field"
        v-model="draft"
        rows="1"
        :maxlength="AI_TO_UI_LIMITS.questionChars"
        placeholder="Type your question"
        enterkeyhint="send"
        autocomplete="off"
        @keydown.enter.exact="onEnter"
      />
      <button type="submit" class="atu-send" :aria-disabled="!canSend">Send <HomeIcon name="arrow-up" :size="18" /></button>
      <p class="atu-composer__meta">
        <span class="atu-composer__hint">Enter to send, Shift+Enter for a new line</span>
        <span aria-hidden="true">{{ draft.length }}/{{ AI_TO_UI_LIMITS.questionChars }}</span>
      </p>
    </form>

    <p class="atu-sr" role="status" aria-live="polite">{{ announcement }}</p>
  </section>
</template>

<style scoped>
.atu-chat { display: flex; flex-direction: column; min-width: 0; min-height: min(640px, calc(100svh - 160px)); border: 1px solid var(--atu-line); background: var(--atu-surface); scroll-margin-top: 16px; }
.atu-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.atu-chat__kicker { margin: 0; font-size: 11px; font-weight: 500; letter-spacing: 1.1px; line-height: 1.7; text-transform: uppercase; }

/* The same cobalt poster and blueprint grid as the homepage hero. */
.atu-chat__head { position: relative; isolation: isolate; overflow: hidden; padding: 22px 24px 20px; background: var(--atu-blue); color: #fff; }
.atu-chat__head::before { position: absolute; inset: 0; z-index: -1; background-image: linear-gradient(rgb(255 255 255 / .09) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / .09) 1px, transparent 1px); background-size: 28px 28px; background-position: -1px -1px; content: ''; -webkit-mask-image: radial-gradient(ellipse 90% 120% at 85% 0%, #000 20%, transparent 78%); mask-image: radial-gradient(ellipse 90% 120% at 85% 0%, #000 20%, transparent 78%); }
.atu-chat__head-top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 16px; }
.atu-chat__head h2 { margin: 16px 0 8px; font-size: clamp(25px, 2.7vw, 34px); font-weight: 500; letter-spacing: -1.1px; line-height: 1.08; }
.atu-chat__summary { max-width: 48ch; margin: 0; color: rgb(255 255 255 / .88); font-size: 14px; line-height: 1.55; }
.atu-chat__mode-note { margin: 18px 0 0; padding-top: 12px; border-top: 1px solid rgb(255 255 255 / .34); color: rgb(255 255 255 / .88); font-size: 12px; line-height: 1.55; }
.atu-mode { display: inline-flex; align-items: center; gap: 8px; margin: 0; padding: 6px 10px; background: var(--atu-lime); color: var(--atu-ink); font-size: 10px; font-weight: 600; letter-spacing: 1px; line-height: 1.4; text-transform: uppercase; }
.atu-mode i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.atu-mode--ai { background: #fff; color: var(--atu-blue); }
.atu-mode--pending,
.atu-mode--unavailable { background: none; box-shadow: inset 0 0 0 1px rgb(255 255 255 / .55); color: #fff; }

.atu-chat__body { display: flex; flex: 1; flex-direction: column; padding: 24px; }
.atu-chat__empty { padding: 8px 0 0; }
.atu-chat__empty-title { margin: 0 0 10px; font-size: clamp(24px, 2.4vw, 30px); font-weight: 500; letter-spacing: -.9px; line-height: 1.15; }
.atu-chat__empty p:last-child { max-width: 46ch; margin: 0; color: var(--atu-muted); font-size: 15px; line-height: 1.65; text-wrap: pretty; }

.atu-chat__log { display: grid; gap: 24px; margin: 0; padding: 0; list-style: none; }
.atu-msg { min-width: 0; scroll-margin-top: 20px; }
.atu-msg--user { justify-self: end; max-width: min(88%, 46ch); padding: 11px 15px; background: var(--atu-ink); color: #fff; font-size: 15px; line-height: 1.5; overflow-wrap: anywhere; }
.atu-msg--user p { margin: 0; white-space: pre-wrap; }
.atu-chat :deep(.atu-answer) { max-width: 60ch; margin: 0; font-size: 16px; line-height: 1.6; overflow-wrap: anywhere; text-wrap: pretty; }

/* A caret marks text that is still arriving. */
.atu-msg--bot.is-streaming :deep(.atu-answer)::after { display: inline-block; width: 7px; height: 1.05em; margin-left: 3px; background: var(--atu-blue); content: ''; vertical-align: -.16em; animation: atu-caret 1s steps(1) infinite; }

/* Keep both timings visible above the generated content. */
.atu-trace { display: flex; flex-wrap: wrap; gap: 2px 16px; margin: 0 0 8px; color: var(--atu-muted); font-family: var(--font-mono); font-size: 11px; line-height: 1.7; font-variant-numeric: tabular-nums; }
.atu-trace code { color: var(--atu-ink); font: inherit; }
.atu-trace strong { color: var(--atu-ink); font-weight: 600; }

.atu-pending { display: flex; align-items: center; gap: 12px; color: var(--atu-muted); font-size: 14px; line-height: 1.5; }
.atu-pending__dots { display: inline-flex; gap: 4px; }
.atu-pending__dots i { width: 6px; height: 6px; background: var(--atu-blue); animation: atu-pulse 900ms ease-in-out infinite; }
.atu-pending__dots i:nth-child(2) { animation-delay: 150ms; }
.atu-pending__dots i:nth-child(3) { animation-delay: 300ms; }

.atu-error { display: grid; gap: 12px; padding: 14px 16px; border: 1px solid var(--atu-alert); border-left-width: 4px; }
.atu-error p { margin: 0; font-size: 14px; line-height: 1.6; }
.atu-error strong { display: block; color: var(--atu-alert); font-weight: 600; }
.atu-error button { justify-self: start; min-height: 44px; padding: 0 16px; border: 0; border-radius: 0; background: var(--atu-ink); color: #fff; font-size: 14px; font-weight: 500; cursor: pointer; transition: background-color 180ms var(--atu-ease); }
.atu-error button:hover { background: var(--atu-blue); }

.atu-sample { margin-top: 16px; }
.atu-sample summary { display: list-item; width: fit-content; padding-block: 10px; color: var(--atu-blue); font-size: 14px; font-weight: 500; cursor: pointer; }
.atu-sample summary:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
.atu-sample__note { margin: 4px 0 12px; font-size: 14px; color: var(--atu-muted); }

/* Directly under the conversation, so both examples stay above the sticky composer. */
.atu-chat__examples { padding-top: 26px; }
.atu-chat__examples .atu-chat__kicker { color: var(--atu-muted); }
.atu-chat__chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.atu-chip { min-height: 44px; padding: 0 14px; border: 1px solid var(--atu-ink); border-radius: 0; background: none; color: var(--atu-ink); font-size: 14px; font-weight: 500; line-height: 1.2; text-align: left; cursor: pointer; transition: background-color 180ms var(--atu-ease), color 180ms var(--atu-ease), border-color 180ms var(--atu-ease); }
.atu-chip:hover { border-color: var(--atu-blue); background: var(--atu-blue); color: #fff; }
.atu-chip[aria-disabled='true'] { border-color: var(--atu-line); background: none; color: var(--atu-muted); cursor: not-allowed; }

.atu-composer { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px 10px; align-items: end; padding: 14px 24px max(12px, env(safe-area-inset-bottom)); border-top: 1px solid var(--atu-line); background: var(--atu-surface); }
.atu-composer--pinned { position: sticky; bottom: 0; z-index: 2; }
.atu-composer textarea { display: block; width: 100%; min-height: 48px; max-height: 144px; padding: 12px 14px; border: 1px solid var(--atu-ink); border-radius: 0; background: var(--atu-paper); color: var(--atu-ink); font-size: 16px; line-height: 1.45; resize: none; }
/* One line at any width: a wrapped placeholder would be clipped by the single row. */
.atu-composer textarea::placeholder { overflow: hidden; color: var(--atu-muted); opacity: 1; text-overflow: ellipsis; white-space: nowrap; }
.atu-composer textarea:focus-visible { outline: 2px solid var(--atu-blue); outline-offset: 2px; }
.atu-send { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 48px; padding: 0 18px; border: 0; border-radius: 0; background: var(--atu-ink); color: #fff; font-size: 14px; font-weight: 500; cursor: pointer; transition: background-color 180ms var(--atu-ease); }
.atu-send:hover { background: var(--atu-blue); }
.atu-send[aria-disabled='true'] { background: var(--atu-line); color: var(--atu-muted); cursor: not-allowed; }
.atu-composer__meta { display: flex; grid-column: 1 / -1; justify-content: space-between; gap: 12px; margin: 0; color: var(--atu-muted); font-size: 12px; line-height: 1.5; font-variant-numeric: tabular-nums; }

@keyframes atu-pulse { 0%, 100% { opacity: .25; } 40% { opacity: 1; } }
@keyframes atu-caret { 50% { opacity: 0; } }

@media (max-width: 560px) {
  .atu-chat__head { padding: 20px 18px 18px; }
  .atu-chat__head-top { gap: 8px 10px; }
  .atu-chat__head .atu-chat__kicker { font-size: 10px; letter-spacing: .8px; }
  .atu-mode { padding: 5px 8px; letter-spacing: .6px; }
  .atu-chat__head h2 { margin-top: 14px; }
  .atu-chat__mode-note { margin-top: 14px; }
  .atu-chat__body { padding: 20px 18px; }
  .atu-composer { padding-inline: 18px; }
  .atu-send { padding-inline: 14px; }
}
/* The key hint describes a hardware keyboard. */
@media (hover: none), (pointer: coarse) {
  .atu-composer__hint { visibility: hidden; }
}
@media (prefers-reduced-motion: reduce) {
  .atu-msg--bot.is-streaming :deep(.atu-answer)::after,
  .atu-pending__dots i { animation: none; }
  .atu-chip,
  .atu-send,
  .atu-error button { transition: none; }
}
</style>
