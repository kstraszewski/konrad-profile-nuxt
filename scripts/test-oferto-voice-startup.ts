import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test, type TestContext } from 'node:test'
import ts from 'typescript'
import { parse } from '@vue/compiler-sfc'
import { computed, ref } from 'vue'
import { gateway } from 'ai'
import { OferteoRealtimeSession } from '../app/utils/oferteoRealtimeSession.ts'
import { OferteoVoiceStartupError, waitForOferteoVoiceStep } from '../app/utils/oferteoVoiceStartup.ts'
import { OFERTEO_REALTIME_MODEL, OFERTEO_VOICE_SECONDS, voiceInstructions } from '../shared/oferteo-realtime.ts'
import { OFERTEO_CREDITS_MESSAGE, oferteoUiFailure } from '../shared/oferteo-errors.ts'

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (cause: unknown) => void
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
async function flushEvents() { for (let i = 0; i < 60; i++) await Promise.resolve() }
function fakeStream() {
  const tracks = Array.from({ length: 2 }, () => Object.assign(new EventTarget(), {
    enabled: true, muted: false, readyState: 'live', stops: 0,
    stop() { this.stops++; this.readyState = 'ended' },
  }))
  const stream = { getTracks: () => tracks, getAudioTracks: () => tracks } as unknown as MediaStream
  return { stream, tracks }
}
const stopStream = (stream: MediaStream) => stream.getTracks().forEach(track => track.stop())

test('unanswered microphone permission times out and releases every track if permission arrives late', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const microphone = deferred<MediaStream>()
  const controller = new AbortController()
  const pending = waitForOferteoVoiceStep(microphone.promise, {
    phase: 'microphone', signal: controller.signal, timeoutMs: 20_000, onLateValue: stopStream,
  })
  const rejected = assert.rejects(pending, cause => {
    assert.ok(cause instanceof OferteoVoiceStartupError)
    assert.equal(cause.phase, 'microphone')
    return true
  })
  t.mock.timers.tick(20_000)
  await rejected
  const late = fakeStream()
  microphone.resolve(late.stream)
  await flushEvents()
  assert.deepEqual(late.tracks.map(track => track.stops), [1, 1])
})

test('cancellation settles immediately without waiting for the browser and cleans up a late stream', { timeout: 1_000 }, async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const microphone = deferred<MediaStream>()
  const controller = new AbortController()
  const pending = waitForOferteoVoiceStep(microphone.promise, {
    phase: 'microphone', signal: controller.signal, timeoutMs: 20_000, onLateValue: stopStream,
  })
  const rejected = assert.rejects(pending, { name: 'AbortError' })
  controller.abort()
  await rejected
  const late = fakeStream()
  microphone.resolve(late.stream)
  await flushEvents()
  t.mock.timers.tick(20_000)
  assert.deepEqual(late.tracks.map(track => track.stops), [1, 1])
})

test('an already cancelled attempt rejects before accepting even an immediately available stream', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const controller = new AbortController()
  controller.abort()
  const late = fakeStream()
  await assert.rejects(waitForOferteoVoiceStep(Promise.resolve(late.stream), {
    phase: 'microphone', signal: controller.signal, timeoutMs: 20_000, onLateValue: stopStream,
  }), { name: 'AbortError' })
  assert.deepEqual(late.tracks.map(track => track.stops), [1, 1])
})

test('microphone denial keeps the original browser error and absorbs later cancellation', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const controller = new AbortController()
  const denied = new DOMException('Permission denied', 'NotAllowedError')
  await assert.rejects(waitForOferteoVoiceStep(Promise.reject(denied), {
    phase: 'microphone', signal: controller.signal, timeoutMs: 20_000,
  }), cause => cause === denied)
  controller.abort()
  t.mock.timers.tick(20_000)
})

test('successful startup retains stream ownership and cannot fire a later timeout or cancellation', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const controller = new AbortController()
  const acquired = fakeStream()
  assert.equal(await waitForOferteoVoiceStep(Promise.resolve(acquired.stream), {
    phase: 'microphone', signal: controller.signal, timeoutMs: 20_000, onLateValue: stopStream,
  }), acquired.stream)
  controller.abort()
  t.mock.timers.tick(60_000)
  assert.deepEqual(acquired.tracks.map(track => track.stops), [0, 0])
})

test('loading and connection deadlines identify the actual stalled startup step', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  for (const phase of ['loading', 'connecting'] as const) {
    const pending = waitForOferteoVoiceStep(new Promise<void>(() => {}), {
      phase, signal: new AbortController().signal, timeoutMs: 15_000,
    })
    const rejected = assert.rejects(pending, cause => cause instanceof OferteoVoiceStartupError && cause.phase === phase)
    t.mock.timers.tick(15_000)
    await rejected
  }
})

// Run the production script setup, keeping Vue refs and the real AI SDK. Only
// Nuxt component macros, lifecycle registration and browser I/O are fixtures.
// This catches callback ordering regressions without checking source strings.
const source = readFileSync(new URL('../app/components/OferteoVoice.client.vue', import.meta.url), 'utf8')
const script = parse(source).descriptor.scriptSetup
assert.ok(script)
const parsed = ts.createSourceFile('OferteoVoice.ts', script.content, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS)
const transformed = ts.transform(parsed, [context => root => {
  const visit: ts.Visitor = node => {
    if (ts.isImportDeclaration(node)) return undefined
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      const target = node.arguments[0]
      assert.ok(target && ts.isStringLiteral(target), 'startup imports must have a known module target')
      const loaders: Record<string, string> = { '~/utils/oferteoRealtimeSession': '__loadSession', ai: '__loadAi' }
      assert.ok(loaders[target.text], `unexpected startup import: ${target.text}`)
      return ts.factory.createCallExpression(ts.factory.createIdentifier(loaders[target.text]!), undefined, [])
    }
    return ts.visitEachChild(node, visit, context)
  }
  return ts.visitNode(root, visit) as ts.SourceFile
}])
const executable = ts.transpileModule(ts.createPrinter().printFile(transformed.transformed[0]!), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText
transformed.dispose()

interface VoiceHarness {
  start: () => Promise<void>
  stop: () => void
  resumePlayback: () => Promise<void>
  active: { value: boolean }
  connected: { value: boolean }
  label: { value: string }
  error: { value: string }
  events: Array<[string, ...unknown[]]>
}
function voiceHarness(t: TestContext): VoiceHarness {
  const events: VoiceHarness['events'] = []
  const noLifecycle = () => {}
  const bindings = {
    ref, computed, onMounted: noLifecycle, onBeforeUnmount: noLifecycle,
    onBeforeRouteLeave: noLifecycle, watch: noLifecycle, defineExpose: noLifecycle,
    defineProps: () => ({ mode: 'search', available: true, disabled: false, messages: [], updateWorkspace: async () => ({}) }),
    defineEmits: () => (name: string, ...args: unknown[]) => events.push([name, ...args]),
    OFERTEO_REALTIME_MODEL, OFERTEO_VOICE_SECONDS, voiceInstructions, oferteoUiFailure,
    OferteoVoiceStartupError, waitForOferteoVoiceStep,
    __loadSession: async () => ({ OferteoRealtimeSession }), __loadAi: async () => ({ gateway }),
  }
  const component = new Function(...Object.keys(bindings), `${executable}\nreturn { start, stop, resumePlayback, active, connected, label, error }`)(...Object.values(bindings)) as VoiceHarness
  component.events = events
  t.after(() => component.stop())
  return component
}

class FakeWebSocket {
  static OPEN = 1
  static instances: FakeWebSocket[] = []
  readyState = 0
  bufferedAmount = 0
  onopen: (() => void) | null = null
  onclose: ((event: unknown) => void) | null = null
  onerror: (() => void) | null = null
  onmessage: ((event: { data: string }) => void) | null = null
  sent: Array<{ type: string }> = []
  constructor() { FakeWebSocket.instances.push(this) }
  open() { this.readyState = FakeWebSocket.OPEN; this.onopen?.() }
  send(data: string) { this.sent.push(JSON.parse(data)) }
  emit(event: unknown) { this.onmessage?.({ data: JSON.stringify(event) }) }
  close() { this.readyState = 3; this.onclose?.({ code: 1000, reason: '', wasClean: true }) }
}
class FakeAudioContext {
  static instances: FakeAudioContext[] = []
  state = 'suspended'
  currentTime = 0
  sampleRate = 24_000
  destination = {}
  constructor() { FakeAudioContext.instances.push(this) }
  async resume() { this.state = 'running' }
  async close() { this.state = 'closed' }
  createMediaStreamSource() { return { connect() {}, disconnect() {} } }
  createScriptProcessor() { return { connect() {}, disconnect() {}, onaudioprocess: null } }
}
function browserFixture(t: TestContext, getMicrophone: () => Promise<MediaStream>, setupStatus = 200) {
  let setupRequests = 0
  let microphoneRequests = 0
  FakeWebSocket.instances = []
  FakeAudioContext.instances = []
  const globals = {
    window: { isSecureContext: true, AudioContext: FakeAudioContext },
    navigator: { mediaDevices: { getUserMedia: () => { microphoneRequests++; return getMicrophone() } } },
    WebSocket: FakeWebSocket, AudioContext: FakeAudioContext,
    fetch: async (input: unknown, options?: RequestInit) => {
      assert.equal(input, '/api/oferto/realtime?mode=search')
      assert.equal(options?.method, 'POST')
      setupRequests++
      return new Response(JSON.stringify({ token: 'test-client-secret', url: 'wss://example.invalid/realtime' }), {
        status: setupStatus, headers: { 'content-type': 'application/json' },
      })
    },
  }
  for (const [key, value] of Object.entries(globals)) {
    const previous = Object.getOwnPropertyDescriptor(globalThis, key)
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value })
    t.after(() => { if (previous) Object.defineProperty(globalThis, key, previous); else Reflect.deleteProperty(globalThis, key) })
  }
  return { setupRequests: () => setupRequests, microphoneRequests: () => microphoneRequests }
}

test('production startup stays pending until the real SDK receives readiness, then captures the supplied stream', async t => {
  const microphone = fakeStream()
  const browser = browserFixture(t, async () => microphone.stream)
  const component = voiceHarness(t)
  let finished = false
  const startup = component.start().then(() => { finished = true })
  await flushEvents()
  assert.equal(browser.setupRequests(), 1)
  assert.equal(browser.microphoneRequests(), 1)
  assert.equal(FakeWebSocket.instances.length, 1)
  assert.equal(component.active.value, true)
  assert.equal(component.connected.value, false)
  assert.equal(component.label.value, 'Łączę rozmowę…')
  assert.equal(finished, false, 'connect() resolving before readiness must not finish UI startup')
  const socket = FakeWebSocket.instances[0]!
  socket.open()
  await flushEvents()
  assert.equal(socket.sent[0]?.type, 'session-update')
  assert.equal(finished, false, 'an open socket is still waiting for provider readiness')
  socket.emit({ type: 'session-updated', sessionId: 'test-session' })
  await startup
  assert.equal(component.connected.value, true)
  assert.equal(component.label.value, 'Słucham Cię')
  assert.equal(component.error.value, '')
  assert.equal(FakeAudioContext.instances.length, 2, 'one playback context and one supplied-stream capture context')
  component.stop()
  assert.ok(microphone.tracks.every(track => track.readyState === 'ended' && track.stops >= 1))
  assert.equal(socket.readyState, 3)
  assert.ok(FakeAudioContext.instances.every(context => context.state === 'closed'))
})

test('real SDK setup 402 reaches onError after status error and preserves the actionable credit failure', async t => {
  const microphone = fakeStream()
  const browser = browserFixture(t, async () => microphone.stream, 402)
  const component = voiceHarness(t)
  await component.start()
  assert.equal(browser.setupRequests(), 1)
  assert.equal(FakeWebSocket.instances.length, 0)
  assert.equal(component.active.value, false)
  assert.equal(component.connected.value, false)
  assert.equal(component.error.value, OFERTEO_CREDITS_MESSAGE)
  assert.equal(component.events.filter(([name]) => name === 'credits-exhausted').length, 1)
  assert.deepEqual(microphone.tracks.map(track => track.stops), [1, 1])
})

test('production microphone timeout leaves a retryable UI and cannot leak a late permission stream', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const microphone = deferred<MediaStream>()
  const browser = browserFixture(t, () => microphone.promise)
  const component = voiceHarness(t)
  const startup = component.start()
  assert.equal(component.label.value, 'Czekam na mikrofon…')
  t.mock.timers.tick(20_000)
  await startup
  assert.equal(component.active.value, false)
  assert.match(component.error.value, /mikrofonu w ciągu 20 sekund/)
  assert.equal(browser.setupRequests(), 0)
  const late = fakeStream()
  microphone.resolve(late.stream)
  await flushEvents()
  assert.deepEqual(late.tracks.map(track => track.stops), [1, 1])
  assert.equal(browser.setupRequests(), 0)
})

test('production cancellation settles a waiting start and ignores a later microphone grant', { timeout: 1_000 }, async t => {
  const microphone = deferred<MediaStream>()
  const browser = browserFixture(t, () => microphone.promise)
  const component = voiceHarness(t)
  const startup = component.start()
  component.stop()
  await startup
  assert.equal(component.active.value, false)
  assert.equal(component.error.value, '')
  const late = fakeStream()
  microphone.resolve(late.stream)
  await flushEvents()
  assert.deepEqual(late.tracks.map(track => track.stops), [1, 1])
  assert.equal(browser.setupRequests(), 0)
  assert.equal(FakeWebSocket.instances.length, 0)
})

test('cancelling before SDK readiness settles startup, closes transport and ignores late readiness', { timeout: 1_000 }, async t => {
  const microphone = fakeStream()
  browserFixture(t, async () => microphone.stream)
  const component = voiceHarness(t)
  const startup = component.start()
  await flushEvents()
  const socket = FakeWebSocket.instances[0]!
  assert.ok(socket)
  socket.open()
  await flushEvents()
  component.stop()
  await startup
  socket.emit({ type: 'session-updated', sessionId: 'late-test-session' })
  await flushEvents()
  assert.equal(component.active.value, false)
  assert.equal(component.connected.value, false)
  assert.equal(component.error.value, '')
  assert.equal(socket.readyState, 3)
  assert.deepEqual(microphone.tracks.map(track => track.stops), [1, 1])
  assert.equal(FakeAudioContext.instances.length, 1, 'late readiness must never open audio capture')
})

test('a rejected manual playback request from a stopped session cannot stop a newer voice attempt', { timeout: 1_000 }, async t => {
  const firstMicrophone = fakeStream()
  const nextMicrophone = deferred<MediaStream>()
  let microphoneRequest = 0
  browserFixture(t, () => ++microphoneRequest === 1 ? Promise.resolve(firstMicrophone.stream) : nextMicrophone.promise)
  const component = voiceHarness(t)
  const firstStartup = component.start()
  await flushEvents()
  const socket = FakeWebSocket.instances[0]!
  socket.open()
  socket.emit({ type: 'session-updated', sessionId: 'first-test-session' })
  await firstStartup
  assert.equal(component.connected.value, true)
  const delayedPlayback = deferred<void>()
  t.mock.method(FakeAudioContext.instances[0]!, 'resume', () => delayedPlayback.promise)
  const oldPlaybackRequest = component.resumePlayback()
  await flushEvents()
  component.stop()
  const newerStartup = component.start()
  assert.equal(component.active.value, true)
  assert.equal(component.label.value, 'Czekam na mikrofon…')
  const eventsBeforeOldFailure = component.events.length
  delayedPlayback.reject(new Error('Old playback permission rejected'))
  await oldPlaybackRequest
  assert.equal(component.active.value, true, 'a stale playback failure must not cancel the newer attempt')
  assert.equal(component.connected.value, false)
  assert.equal(component.error.value, '')
  assert.equal(component.events.length, eventsBeforeOldFailure, 'stale failure must not emit another stop')
  component.stop()
  await newerStartup
  const late = fakeStream()
  nextMicrophone.resolve(late.stream)
  await flushEvents()
  assert.deepEqual(late.tracks.map(track => track.stops), [1, 1])
})

test('the real SDK startup deadline settles the UI and releases resources when provider readiness never arrives', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const microphone = fakeStream()
  browserFixture(t, async () => microphone.stream)
  const component = voiceHarness(t)
  const startup = component.start()
  await flushEvents()
  const socket = FakeWebSocket.instances[0]!
  socket.open()
  await flushEvents()
  assert.equal(component.active.value, true)
  assert.equal(component.connected.value, false)
  t.mock.timers.tick(25_000)
  await startup
  assert.equal(component.active.value, false)
  assert.equal(component.connected.value, false)
  assert.match(component.error.value, /Spróbuj ponownie lub kontynuuj tekstem/)
  assert.equal(socket.readyState, 3)
  assert.deepEqual(microphone.tracks.map(track => track.stops), [1, 1])
  assert.ok(FakeAudioContext.instances.every(context => context.state === 'closed'))
  socket.emit({ type: 'session-updated', sessionId: 'late-timeout-session' })
  await flushEvents()
  assert.equal(component.connected.value, false)
})
