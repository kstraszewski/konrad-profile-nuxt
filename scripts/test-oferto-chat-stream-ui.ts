import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test, type TestContext } from 'node:test'
import { parse } from '@vue/compiler-sfc'
import { computed, ref, type Ref } from 'vue'
import ts from 'typescript'
import { requestOferteoStream } from '../app/utils/oferteoStream.ts'
import { mergeOferteoVoiceTranscript, voiceRequestMessages, type VoiceMessage } from '../shared/oferteo-realtime.ts'
import { OFERTEO_CREDITS_MESSAGE, oferteoUiFailure } from '../shared/oferteo-errors.ts'
import type { OferteoBrief, OferteoChatResponse, OferteoMessage } from '../shared/types/oferteo.ts'

// Execute the page's production setup and stream decoder. Only Nuxt lifecycle,
// browser DOM and HTTP I/O are fixtures; no source-text behavior assertions.
const script = parse(readFileSync(new URL('../app/pages/oferto/demo.vue', import.meta.url), 'utf8')).descriptor.scriptSetup!
const parsed = ts.createSourceFile('chat-page.ts', script.content, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS)
const transformed = ts.transform(parsed, [context => root => {
  const visit: ts.Visitor = node => ts.isImportDeclaration(node) ? undefined : ts.visitEachChild(node, visit, context)
  return ts.visitNode(root, visit) as ts.SourceFile
}])
const executable = ts.transpileModule(ts.createPrinter().printFile(transformed.transformed[0]!), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText
transformed.dispose()

type ChatMessage = OferteoMessage & { streaming?: boolean; result?: Pick<OferteoChatResponse, 'brief' | 'offers'> }
interface ChatHarness {
  send: (text: string) => Promise<void>
  requestReply: () => Promise<void>
  stopReply: () => void
  syncVoiceTranscript: (messages: VoiceMessage[]) => void
  updateVoiceWorkspace: (signal: AbortSignal) => Promise<unknown>
  messageBox: Ref<HTMLElement | null>
  voiceActive: Ref<boolean>
  voice: Ref<{ stop: () => void; sendText: (text: string) => boolean } | null>
  messages: Ref<ChatMessage[]>
  finalMessages: Ref<ChatMessage[]>
  brief: Ref<OferteoBrief>
  pending: Ref<boolean>
  error: Ref<string>
  streamNotice: Ref<string>
}

async function chatHarness(t: TestContext): Promise<ChatHarness> {
  const previousDocument = Object.getOwnPropertyDescriptor(globalThis, 'document')
  Object.defineProperty(globalThis, 'document', { configurable: true, value: { body: {}, activeElement: {} } })
  t.after(() => {
    if (previousDocument) Object.defineProperty(globalThis, 'document', previousDocument)
    else Reflect.deleteProperty(globalThis, 'document')
  })
  const noop = () => {}
  const bindings = {
    ref, computed, watch: noop, onMounted: noop, onBeforeUnmount: noop, definePageMeta: noop, useSeoMeta: noop, useHead: noop,
    nextTick: async (callback?: () => void) => { await Promise.resolve(); callback?.() },
    useFetch: async () => ({ data: ref({ mode: 'live', aiConfigured: true }), error: ref(null), pending: ref(false), refresh: noop }),
    useOferteoAvailability: () => ({ failure: ref(null), aiPaused: ref(false), canRetry: ref(true), retrySeconds: ref(0),
      setFailure: (cause: unknown) => oferteoUiFailure(cause).message, clearFailure: noop }),
    mergeOferteoVoiceTranscript, voiceRequestMessages, OFERTEO_CREDITS_MESSAGE, oferteoUiFailure, requestOferteoStream,
  }
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
  const component = await new AsyncFunction(...Object.keys(bindings), `${executable}\nreturn { send, requestReply, stopReply, syncVoiceTranscript, updateVoiceWorkspace, messageBox, voiceActive, voice, messages, finalMessages, brief, pending, error, streamNotice }`)(...Object.values(bindings)) as ChatHarness
  t.after(() => component.stopReply())
  return component
}

function mockStreams(t: TestContext) {
  const requests: { history: OferteoMessage[]; signal: AbortSignal; output: ReadableStreamDefaultController<Uint8Array> }[] = []
  t.mock.method(globalThis, 'fetch', async (url: string, options: RequestInit) => {
    assert.equal(url, '/api/oferto/chat')
    assert.equal((options.headers as Record<string, string>).Accept, 'text/event-stream')
    let output!: ReadableStreamDefaultController<Uint8Array>
    const body = new ReadableStream<Uint8Array>({ start(controller) { output = controller } })
    requests.push({ history: JSON.parse(options.body as string).messages, signal: options.signal!, output })
    return new Response(body, { headers: { 'content-type': 'text/event-stream; charset=utf-8' } })
  })
  return {
    requests,
    send(data: unknown) { requests.at(-1)!.output.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`)) },
    close() { requests.at(-1)!.output.close() },
  }
}
const flush = () => new Promise<void>(resolve => setImmediate(resolve))
const result: OferteoChatResponse = {
  message: 'Doprecyzuj zakres remontu.', brief: { service: 'Remont łazienki', city: 'Warszawa', scope: null, area: null, budget: null, timing: null },
  offers: [], suggestions: ['Wymiana płytek'], mode: 'live', model: 'fixture', source: 'snapshot',
}

test('chat shows text and brief before completion and commits only the final response', { timeout: 2_000 }, async t => {
  const streams = mockStreams(t)
  const page = await chatHarness(t)
  const sending = page.send('Remont w Warszawie')
  await flush()
  streams.send({ type: 'partial', data: { message: 'Doprecyzuj', brief: { city: 'Warszawa' } } })
  await flush()
  assert.equal(page.pending.value, true)
  assert.equal(page.messages.value.at(-1)?.content, 'Doprecyzuj')
  assert.equal(page.finalMessages.value.length, 1)
  assert.equal(page.brief.value.city, 'Warszawa')
  streams.send({ type: 'result', data: result })
  await sending
  assert.equal(page.pending.value, false)
  assert.equal(page.messages.value.length, 2)
  assert.equal(page.messages.value.at(-1)?.content, result.message)
  assert.deepEqual(page.brief.value, result.brief)
  assert.equal(page.messages.value.some(message => message.streaming), false)
})

test('premature stream EOF rolls back the brief and removes partial text from retry history', { timeout: 2_000 }, async t => {
  const streams = mockStreams(t)
  const page = await chatHarness(t)
  const sending = page.send('Remont w Warszawie')
  await flush()
  streams.send({ type: 'partial', data: { message: 'Niepełna odpowiedź', brief: { city: 'Kraków' } } })
  await flush()
  streams.close()
  await sending
  assert.equal(page.brief.value.city, null)
  assert.equal(page.messages.value.length, 1)
  assert.equal(page.messages.value[0]?.role, 'user')
  assert.ok(page.error.value)
  const retry = page.requestReply()
  await flush()
  assert.deepEqual(streams.requests.at(-1)?.history, [{ role: 'user', content: 'Remont w Warszawie' }])
  streams.send({ type: 'result', data: result })
  await retry
  assert.equal(page.messages.value.length, 2)
})

test('intentional stop aborts the active stream, preserves the user turn and remains retryable', { timeout: 2_000 }, async t => {
  const streams = mockStreams(t)
  const page = await chatHarness(t)
  const sending = page.send('Remont w Warszawie')
  await flush()
  streams.send({ type: 'partial', data: { message: 'Niepełna odpowiedź', brief: { city: 'Kraków' } } })
  await flush()
  page.stopReply()
  await sending
  assert.equal(streams.requests[0]?.signal.aborted, true)
  assert.equal(page.pending.value, false)
  assert.equal(page.error.value, '')
  assert.ok(page.streamNotice.value)
  assert.equal(page.messages.value.length, 1)
  assert.equal(page.brief.value.city, null)
  const retry = page.requestReply()
  await flush()
  assert.deepEqual(streams.requests.at(-1)?.history, [{ role: 'user', content: 'Remont w Warszawie' }])
  streams.send({ type: 'result', data: result })
  await retry
  assert.equal(page.messages.value.length, 2)
})

test('cancelled voice workspace remains retryable after an assistant acknowledgement', { timeout: 2_000 }, async t => {
  const streams = mockStreams(t)
  const page = await chatHarness(t)
  page.syncVoiceTranscript([
    { voiceId: '1:user', role: 'user', content: 'Remont w Warszawie' },
    { voiceId: '1:assistant', role: 'assistant', content: 'Sprawdzam dopasowania.' },
  ])
  const controller = new AbortController()
  const workspace = page.updateVoiceWorkspace(controller.signal)
  await flush()
  streams.send({ type: 'partial', data: { message: 'Niepełne dopasowanie' } })
  await flush()
  controller.abort()
  await assert.rejects(workspace, { name: 'AbortError' })
  assert.equal(page.messages.value.at(-1)?.role, 'assistant')
  const retry = page.requestReply()
  await flush()
  assert.equal(streams.requests.length, 2, 'the assistant caption must not suppress retry of the failed user turn')
  assert.deepEqual(streams.requests.at(-1)?.history, [{ role: 'user', content: 'Remont w Warszawie' }])
  streams.send({ type: 'result', data: result })
  await retry
})

test('manual scroll away from the latest reply survives partials and stream completion', { timeout: 2_000 }, async t => {
  const streams = mockStreams(t)
  const page = await chatHarness(t)
  const box = {
    scrollHeight: 1_000, scrollTop: 0, clientHeight: 100,
    querySelector: () => ({ getBoundingClientRect: () => ({ top: 500 }) }),
    getBoundingClientRect: () => ({ top: 0 }),
  }
  page.messageBox.value = box as unknown as HTMLElement
  const sending = page.send('Remont w Warszawie')
  await flush()
  box.scrollTop = 200
  streams.send({ type: 'partial', data: { message: 'Doprecyzuj' } })
  await flush()
  assert.equal(box.scrollTop, 200)
  streams.send({ type: 'result', data: result })
  await sending
  assert.equal(box.scrollTop, 200, 'finishing the stream must preserve the position of a reader who scrolled away')
})

test('typing while microphone startup is pending cancels voice and sends the text request', { timeout: 2_000 }, async t => {
  const streams = mockStreams(t)
  const page = await chatHarness(t)
  let stopped = 0
  page.voiceActive.value = true
  page.voice.value = { sendText: () => false, stop() { stopped++ } }
  const sending = page.send('Remont w Warszawie')
  await flush()
  assert.equal(stopped, 1)
  assert.equal(page.voiceActive.value, false)
  assert.equal(streams.requests.length, 1)
  assert.deepEqual(streams.requests[0]?.history, [{ role: 'user', content: 'Remont w Warszawie' }])
  streams.send({ type: 'result', data: result })
  await sending
  assert.equal(page.messages.value.at(-1)?.content, result.message)
})
