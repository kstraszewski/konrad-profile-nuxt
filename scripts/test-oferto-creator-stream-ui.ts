import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test, type TestContext } from 'node:test'
import { parse } from '@vue/compiler-sfc'
import { computed, nextTick, ref, watch, type Ref } from 'vue'
import ts from 'typescript'
import { requestOferteoStream } from '../app/utils/oferteoStream.ts'
import { mergeOferteoVoiceTranscript, voiceRequestMessages } from '../shared/oferteo-realtime.ts'
import { OFERTEO_CREDITS_MESSAGE, oferteoUiFailure } from '../shared/oferteo-errors.ts'
import { emptyOfferDraft, type OfferCreatorResponse, type OfferDraft } from '../shared/types/oferteo-creator.ts'
import type { OferteoMessage } from '../shared/types/oferteo.ts'

// Execute the production page setup and real stream helper, replacing only
// Nuxt lifecycle, browser DOM and HTTP I/O with fixtures.
const script = parse(readFileSync(new URL('../app/pages/oferto/demo-2.vue', import.meta.url), 'utf8')).descriptor.scriptSetup!
const parsed = ts.createSourceFile('creator-page.ts', script.content, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS)
const transformed = ts.transform(parsed, [context => root => {
  const visit: ts.Visitor = node => ts.isImportDeclaration(node) ? undefined : ts.visitEachChild(node, visit, context)
  return ts.visitNode(root, visit) as ts.SourceFile
}])
const executable = ts.transpileModule(ts.createPrinter().printFile(transformed.transformed[0]!), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText
transformed.dispose()

type CreatorMessage = OferteoMessage & { streaming?: number; result?: { version: number; changes: string[] } }
interface CreatorHarness {
  send: (text: string) => Promise<void>
  requestReply: () => Promise<void>
  stopRequest: () => void
  openPreview: () => Promise<void>
  returnToChat: () => Promise<void>
  messages: Ref<CreatorMessage[]>
  finalMessages: Ref<CreatorMessage[]>
  offerDraft: Ref<OfferDraft | null>
  version: Ref<number>
  ready: Ref<boolean>
  pending: Ref<boolean>
  cancelled: Ref<boolean>
  error: Ref<string>
  messageBox: Ref<HTMLElement | null>
  previewBox: Ref<HTMLElement | null>
  composer: Ref<HTMLTextAreaElement | null>
  activePane: Ref<'chat' | 'preview'>
  voiceActive: Ref<boolean>
  voice: Ref<{ stop: () => void; sendText: (text: string) => boolean } | null>
}

async function creatorHarness(t: TestContext): Promise<CreatorHarness> {
  const previousDocument = Object.getOwnPropertyDescriptor(globalThis, 'document')
  Object.defineProperty(globalThis, 'document', { configurable: true, value: { body: {}, activeElement: {} } })
  t.after(() => {
    if (previousDocument) Object.defineProperty(globalThis, 'document', previousDocument)
    else Reflect.deleteProperty(globalThis, 'document')
  })
  const noop = () => {}
  const bindings = {
    ref, computed, watch, nextTick, onMounted: noop, onBeforeUnmount: noop, useSeoMeta: noop, useHead: noop,
    useFetch: async () => ({ data: ref({ mode: 'live', aiConfigured: true }), error: ref(null), pending: ref(false), refresh: noop }),
    useOferteoAvailability: () => ({ failure: ref(null), aiPaused: ref(false), canRetry: ref(true), retrySeconds: ref(0),
      setFailure: (cause: unknown) => oferteoUiFailure(cause).message, clearFailure: noop }),
    mergeOferteoVoiceTranscript, voiceRequestMessages, OFERTEO_CREDITS_MESSAGE, oferteoUiFailure, emptyOfferDraft, requestOferteoStream,
  }
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
  const component = await new AsyncFunction(...Object.keys(bindings), `${executable}\nreturn { send, requestReply, stopRequest, openPreview, returnToChat, messages, finalMessages, offerDraft, version, ready, pending, cancelled, error, messageBox, previewBox, composer, activePane, voiceActive, voice }`)(...Object.values(bindings)) as CreatorHarness
  t.after(() => component.stopRequest())
  return component
}

function mockStreams(t: TestContext) {
  const requests: { history: OferteoMessage[]; draft: OfferDraft | null; signal: AbortSignal; output: ReadableStreamDefaultController<Uint8Array> }[] = []
  t.mock.method(globalThis, 'fetch', async (url: string, options: RequestInit) => {
    assert.equal(url, '/api/oferto/offer')
    assert.equal((options.headers as Record<string, string>).Accept, 'text/event-stream')
    let output!: ReadableStreamDefaultController<Uint8Array>
    const body = new ReadableStream<Uint8Array>({ start(controller) { output = controller } })
    const request = JSON.parse(options.body as string)
    requests.push({ history: request.messages, draft: request.draft, signal: options.signal!, output })
    return new Response(body, { headers: { 'content-type': 'text/event-stream; charset=utf-8' } })
  })
  return {
    requests,
    send(data: unknown) { requests.at(-1)!.output.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`)) },
    close() { requests.at(-1)!.output.close() },
  }
}
const flush = () => new Promise<void>(resolve => setImmediate(resolve))
const firstPrompt = 'Przygotuj ofertę remontu łazienki.'
const result: OfferCreatorResponse = {
  message: 'Szkic oferty jest gotowy.', draft: { ...emptyOfferDraft(), title: 'Remont łazienki', description: 'Kompleksowy remont łazienki.', scope: ['Układanie płytek'] },
  suggestions: ['Dodaj termin'], mode: 'live', model: 'fixture', ready: true, changes: ['Dodano zakres remontu'],
}

async function seedDraft(page: CreatorHarness, streams: ReturnType<typeof mockStreams>) {
  const sending = page.send(firstPrompt)
  await flush()
  streams.send({ type: 'result', data: result })
  await sending
}

function mobileMessageBox(page: CreatorHarness) {
  let position = 0
  let height = 1_000
  const visible = () => page.activePane.value === 'chat'
  const box = {
    get scrollHeight() { return visible() ? height : 0 },
    get clientHeight() { return visible() ? 100 : 0 },
    get scrollTop() { return visible() ? position : 0 },
    set scrollTop(value: number) { if (visible()) position = Math.max(0, Math.min(value, height - 100)) },
    getClientRects: () => visible() ? [1] : [],
    querySelector: () => ({ getBoundingClientRect: () => ({ top: 500 }) }),
    getBoundingClientRect: () => ({ top: 0 }),
    focus() {},
  }
  page.messageBox.value = box as unknown as HTMLElement
  return { box, grow() { height += 200 } }
}

test('creator streams text and draft before committing the final message and version', { timeout: 2_000 }, async t => {
  const streams = mockStreams(t)
  const page = await creatorHarness(t)
  const sending = page.send(firstPrompt)
  await flush()
  streams.send({ type: 'partial', data: { message: 'Szkic', draft: { title: 'Remont', scope: ['Układanie'] } } })
  await flush()
  assert.equal(page.pending.value, true)
  assert.equal(page.messages.value.at(-1)?.content, 'Szkic')
  assert.equal(page.finalMessages.value.length, 1)
  assert.equal(page.offerDraft.value?.title, 'Remont')
  assert.deepEqual(page.offerDraft.value?.scope, ['Układanie'])
  assert.equal(page.version.value, 0)
  assert.equal(page.ready.value, false)
  streams.send({ type: 'result', data: result })
  await sending
  assert.equal(page.messages.value.length, 2)
  assert.equal(page.messages.value.at(-1)?.content, result.message)
  assert.equal(page.messages.value.at(-1)?.result?.version, 1)
  assert.deepEqual(page.offerDraft.value, result.draft)
  assert.equal(page.version.value, 1)
  assert.equal(page.ready.value, true)
  assert.equal(page.messages.value.some(message => message.streaming !== undefined), false)

  const unchanged = page.send('Sprawdź szkic.')
  await flush()
  streams.send({ type: 'partial', data: { message: 'Sprawdzam', draft: { title: 'Roboczy tytuł' } } })
  await flush()
  assert.equal(page.version.value, 1, 'partial edits cannot create a committed version')
  streams.send({ type: 'result', data: result })
  await unchanged
  assert.equal(page.version.value, 1, 'the final draft is compared against the committed snapshot, not its preview')
  assert.deepEqual(page.offerDraft.value, result.draft)
})

test('premature creator EOF restores the committed draft and discards its transient reply', { timeout: 2_000 }, async t => {
  const streams = mockStreams(t)
  const page = await creatorHarness(t)
  await seedDraft(page, streams)
  const changing = page.send('Zmień opis oferty.')
  await flush()
  streams.send({ type: 'partial', data: { message: 'Niepełna odpowiedź', draft: { title: 'Niepełny tytuł', description: 'Urwany opis' } } })
  await flush()
  assert.equal(page.offerDraft.value?.description, 'Urwany opis')
  streams.close()
  await changing
  assert.deepEqual(page.offerDraft.value, result.draft)
  assert.equal(page.version.value, 1)
  assert.equal(page.ready.value, true)
  assert.equal(page.pending.value, false)
  assert.equal(page.messages.value.length, 3)
  assert.equal(page.messages.value.at(-1)?.role, 'user')
  assert.equal(page.messages.value.some(message => message.streaming !== undefined), false)
  assert.ok(page.error.value)
})

test('creator stop rolls back and retries with only final conversation and the committed draft', { timeout: 2_000 }, async t => {
  const streams = mockStreams(t)
  const page = await creatorHarness(t)
  await seedDraft(page, streams)
  const changing = page.send('Skróć opis.')
  await flush()
  streams.send({ type: 'partial', data: { message: 'Niepełna odpowiedź', draft: { description: 'Urwany opis' } } })
  await flush()
  page.stopRequest()
  await changing
  assert.equal(streams.requests.at(-1)?.signal.aborted, true)
  assert.deepEqual(page.offerDraft.value, result.draft)
  assert.equal(page.version.value, 1)
  assert.equal(page.error.value, '')
  assert.equal(page.cancelled.value, true)
  const retry = page.requestReply()
  await flush()
  assert.deepEqual(streams.requests.at(-1)?.history, [
    { role: 'user', content: firstPrompt }, { role: 'assistant', content: result.message }, { role: 'user', content: 'Skróć opis.' },
  ])
  assert.deepEqual(streams.requests.at(-1)?.draft, result.draft)
  const updated = { ...result, message: 'Opis został skrócony.', draft: { ...result.draft, description: 'Remont łazienki.' } }
  streams.send({ type: 'result', data: updated })
  await retry
  assert.equal(page.messages.value.length, 4)
  assert.equal(page.messages.value.at(-1)?.content, updated.message)
  assert.equal(page.version.value, 2)
  assert.equal(page.cancelled.value, false)
})

test('creator preserves manual scroll through partials, final commit and intentional stop', { timeout: 2_000 }, async t => {
  const streams = mockStreams(t)
  const page = await creatorHarness(t)
  const box = {
    scrollHeight: 1_000, scrollTop: 0, clientHeight: 100,
    getClientRects: () => [1],
    querySelector: () => ({ getBoundingClientRect: () => ({ top: 500 }) }),
    getBoundingClientRect: () => ({ top: 0 }),
  }
  page.messageBox.value = box as unknown as HTMLElement
  const sending = page.send(firstPrompt)
  await flush()
  box.scrollTop = 200
  streams.send({ type: 'partial', data: { message: 'Szkic' } })
  await flush()
  assert.equal(box.scrollTop, 200)
  streams.send({ type: 'result', data: result })
  await sending
  assert.equal(box.scrollTop, 200)
  const changing = page.send('Zmień opis.')
  await flush()
  box.scrollTop = 200
  streams.send({ type: 'partial', data: { message: 'Zmiana', draft: { description: 'Urwany opis' } } })
  await flush()
  page.stopRequest()
  await changing
  assert.equal(box.scrollTop, 200, 'stopping generation must also preserve the reader\'s position')
  assert.deepEqual(page.offerDraft.value, result.draft)
})

test('switching to preview during streaming preserves an earlier chat position on return', { timeout: 2_000 }, async t => {
  const streams = mockStreams(t)
  const page = await creatorHarness(t)
  const { box } = mobileMessageBox(page)
  const sending = page.send(firstPrompt)
  await flush()
  box.scrollTop = 200
  await page.openPreview()
  assert.equal(box.scrollHeight, 0, 'the hidden panel has the zero dimensions of display:none')
  streams.send({ type: 'partial', data: { message: 'Szkic', draft: { title: 'Remont' } } })
  await flush()
  await page.returnToChat()
  await nextTick()
  assert.equal(box.scrollTop, 200, 'hidden stream updates must preserve the reader\'s earlier position')
  streams.send({ type: 'result', data: result })
  await sending
  assert.equal(box.scrollTop, 200)
})

test('a stream completed in preview preserves an earlier chat position on return', { timeout: 2_000 }, async t => {
  const streams = mockStreams(t)
  const page = await creatorHarness(t)
  const { box } = mobileMessageBox(page)
  const sending = page.send(firstPrompt)
  await flush()
  box.scrollTop = 200
  await page.openPreview()
  streams.send({ type: 'partial', data: { message: 'Szkic', draft: { title: 'Remont' } } })
  await flush()
  streams.send({ type: 'result', data: result })
  await sending
  assert.equal(page.pending.value, false)
  await page.returnToChat()
  await nextTick()
  assert.equal(box.scrollTop, 200, 'completion while chat is hidden must not change its earlier reading position')
})

test('a chat following the bottom resumes following after streaming in the preview pane', { timeout: 2_000 }, async t => {
  const streams = mockStreams(t)
  const page = await creatorHarness(t)
  const { box, grow } = mobileMessageBox(page)
  const sending = page.send(firstPrompt)
  await flush()
  box.scrollTop = 900
  await page.openPreview()
  grow()
  streams.send({ type: 'partial', data: { message: 'Szkic', draft: { title: 'Remont' } } })
  await flush()
  await page.returnToChat()
  await nextTick()
  assert.equal(box.scrollTop, box.scrollHeight - box.clientHeight)
  assert.equal(box.scrollTop, 1_100)
  streams.send({ type: 'result', data: result })
  await sending
})

test('stopping from preview restores keyboard focus when its stop button disappears', { timeout: 2_000 }, async t => {
  const streams = mockStreams(t)
  const page = await creatorHarness(t)
  mobileMessageBox(page)
  let previewFocus = 0
  page.previewBox.value = { getClientRects: () => [1], focus() { previewFocus++ } } as unknown as HTMLElement
  page.composer.value = { getClientRects: () => [], focus() { assert.fail('the hidden composer must not receive focus') } } as unknown as HTMLTextAreaElement
  const sending = page.send(firstPrompt)
  await flush()
  await page.openPreview()
  previewFocus = 0
  streams.send({ type: 'partial', data: { message: 'Szkic' } })
  await flush()
  const stopButton = {}
  Object.assign(document, { activeElement: stopButton })
  // Native focus moves only when Vue flushes the stop button's removal.
  const stopWatching = watch(page.pending, pending => {
    if (!pending && document.activeElement === stopButton) Object.assign(document, { activeElement: document.body })
  }, { flush: 'post' })
  t.after(stopWatching)
  page.stopRequest()
  await sending
  assert.equal(page.cancelled.value, true)
  assert.equal(previewFocus, 1)

  const retry = page.requestReply()
  await flush()
  previewFocus = 0
  Object.assign(document, { activeElement: stopButton })
  page.stopRequest()
  const otherButton = {}
  Object.assign(document, { activeElement: otherButton })
  await retry
  assert.equal(document.activeElement, otherButton, 'an intentional focus change during cleanup must be preserved')
  assert.equal(previewFocus, 0)
})

test('creator text entry cancels pending microphone startup and continues over the text stream', { timeout: 2_000 }, async t => {
  const streams = mockStreams(t)
  const page = await creatorHarness(t)
  let stopped = 0
  page.voiceActive.value = true
  page.voice.value = { sendText: () => false, stop() { stopped++ } }
  const sending = page.send(firstPrompt)
  await flush()
  assert.equal(stopped, 1)
  assert.equal(page.voiceActive.value, false)
  assert.equal(streams.requests.length, 1)
  assert.deepEqual(streams.requests[0]?.history, [{ role: 'user', content: firstPrompt }])
  streams.send({ type: 'result', data: result })
  await sending
  assert.equal(page.messages.value.at(-1)?.content, result.message)
})
