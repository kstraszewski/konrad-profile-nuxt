import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test, type TestContext } from 'node:test'
import ts from 'typescript'
import { parse } from '@vue/compiler-sfc'
import { computed, ref } from 'vue'
import { gateway } from 'ai'
import { OferteoRealtimeSession } from '../app/utils/oferteoRealtimeSession.ts'
import { microphonePermissionState, OferteoVoiceStartupError, waitForOferteoVoiceStep } from '../app/utils/oferteoVoiceStartup.ts'
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
  capturing: { value: boolean }
  microphonePermission: { value: PermissionState | 'unknown' }
  microphoneHint: { value: string }
  microphoneDelayed: { value: boolean }
  microphoneIssue: { value: boolean }
  label: { value: string }
  error: { value: string }
  events: Array<[string, ...unknown[]]>
}
function voiceHarness(t: TestContext, updateWorkspace: (signal: AbortSignal) => Promise<unknown> = async () => ({})): VoiceHarness {
  const events: VoiceHarness['events'] = []
  const noLifecycle = () => {}
  const bindings = {
    ref, computed, onMounted: noLifecycle, onBeforeUnmount: noLifecycle,
    onBeforeRouteLeave: noLifecycle, watch: noLifecycle, defineExpose: noLifecycle,
    defineProps: () => ({ mode: 'search', available: true, disabled: false, messages: [], updateWorkspace }),
    defineEmits: () => (name: string, ...args: unknown[]) => events.push([name, ...args]),
    OFERTEO_REALTIME_MODEL, OFERTEO_VOICE_SECONDS, voiceInstructions, oferteoUiFailure,
    microphonePermissionState, OferteoVoiceStartupError, waitForOferteoVoiceStep,
    __loadSession: async () => ({ OferteoRealtimeSession }), __loadAi: async () => ({ gateway }),
  }
  const component = new Function(...Object.keys(bindings), `${executable}\nreturn { start, stop, resumePlayback, active, connected, capturing, microphonePermission, microphoneHint, microphoneDelayed, microphoneIssue, label, error }`)(...Object.values(bindings)) as VoiceHarness
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
  sent: Array<{ type: string; item?: { type: string; callId?: string; output?: string } }> = []
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
function browserFixture(t: TestContext, getMicrophone: () => Promise<MediaStream>, setupStatus = 200, queryPermission?: (descriptor: PermissionDescriptor) => Promise<{ state: PermissionState }>) {
  let setupRequests = 0
  let microphoneRequests = 0
  FakeWebSocket.instances = []
  FakeAudioContext.instances = []
  const globals = {
    window: { isSecureContext: true, AudioContext: FakeAudioContext },
    navigator: {
      mediaDevices: { getUserMedia: () => { microphoneRequests++; return getMicrophone() } },
      ...(queryPermission ? { permissions: { query: queryPermission } } : {}),
    },
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
  assert.equal(component.microphoneIssue.value, true, 'timeout keeps the microphone recovery instructions available')
  assert.equal(browser.setupRequests(), 0)
  const late = fakeStream()
  microphone.resolve(late.stream)
  await flushEvents()
  assert.deepEqual(late.tracks.map(track => track.stops), [1, 1])
  assert.equal(browser.setupRequests(), 0)
})

test('permission denial settles a pending microphone immediately without starting the SDK and cleans up a late stream', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const microphone = deferred<MediaStream>()
  const order: string[] = []
  const browser = browserFixture(t, () => { order.push('microphone'); return microphone.promise }, 200, async descriptor => {
    assert.equal(descriptor.name, 'microphone')
    order.push('permission-query')
    return { state: 'denied' }
  })
  const component = voiceHarness(t)
  await component.start()
  assert.deepEqual(order, ['microphone', 'permission-query'], 'getUserMedia must run first in the original click handler')
  assert.equal(component.active.value, false)
  assert.equal(component.connected.value, false)
  assert.equal(component.microphonePermission.value, 'denied')
  assert.equal(component.microphoneIssue.value, true)
  assert.match(component.error.value, /Dostęp do mikrofonu jest zablokowany/)
  assert.equal(browser.setupRequests(), 0)
  assert.equal(FakeWebSocket.instances.length, 0)
  const finalEvents = component.events.length
  t.mock.timers.tick(20_000)
  await flushEvents()
  assert.equal(component.events.length, finalEvents, 'retired timers must not fail the stopped attempt again')
  const late = fakeStream()
  microphone.resolve(late.stream)
  await flushEvents()
  assert.deepEqual(late.tracks.map(track => track.stops), [1, 1])
})

test('unsupported, rejected, or pending permission diagnostics cannot delay microphone acquisition or SDK startup', async t => {
  for (const mode of ['unsupported', 'rejected', 'pending']) {
    await t.test(mode, async subtest => {
      const microphone = fakeStream()
      const pendingPermission = deferred<{ state: PermissionState }>()
      const query = mode === 'unsupported' ? undefined : mode === 'rejected'
        ? async () => { throw new TypeError('Unsupported permission name') }
        : () => pendingPermission.promise
      const browser = browserFixture(subtest, async () => microphone.stream, 200, query)
      const component = voiceHarness(subtest)
      const startup = component.start()
      await flushEvents()
      assert.equal(browser.microphoneRequests(), 1)
      assert.equal(browser.setupRequests(), 1)
      const socket = FakeWebSocket.instances[0]!
      assert.ok(socket)
      socket.open()
      socket.emit({ type: 'session-updated', sessionId: 'permission-fallback' })
      await startup
      assert.equal(component.connected.value, true)
      assert.equal(component.microphonePermission.value, 'unknown')
      assert.equal(component.error.value, '')
      assert.equal(component.microphoneIssue.value, false)
      pendingPermission.resolve({ state: 'denied' })
      await flushEvents()
      assert.equal(component.connected.value, true, 'a diagnostic received after microphone startup cannot stop the session')
      assert.equal(component.error.value, '')
    })
  }
})

test('a granted browser permission explains a stalled device and delayed help appears at five seconds', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const microphone = deferred<MediaStream>()
  const browser = browserFixture(t, () => microphone.promise, 200, async () => ({ state: 'granted' }))
  const component = voiceHarness(t)
  const startup = component.start()
  await flushEvents()
  assert.equal(component.microphonePermission.value, 'granted')
  assert.match(component.microphoneHint.value, /Zgoda przeglądarki jest przyznana/)
  assert.equal(component.label.value, 'Czekam na mikrofon…')
  assert.equal(component.microphoneDelayed.value, false)
  t.mock.timers.tick(4_999)
  await flushEvents()
  assert.equal(component.microphoneDelayed.value, false)
  t.mock.timers.tick(1)
  await flushEvents()
  assert.equal(component.microphoneDelayed.value, true)
  assert.equal(component.active.value, true)
  assert.equal(browser.setupRequests(), 0)
  component.stop()
  await startup
  const late = fakeStream()
  microphone.resolve(late.stream)
  await flushEvents()
  assert.deepEqual(late.tracks.map(track => track.stops), [1, 1])
})

test('an unknown permission switches to recovery guidance at five seconds and cancel clears the help timer', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const microphone = deferred<MediaStream>()
  browserFixture(t, () => microphone.promise)
  const component = voiceHarness(t)
  const startup = component.start()
  await flushEvents()
  assert.match(component.microphoneHint.value, /Zezwól tej stronie/)
  t.mock.timers.tick(5_000)
  await flushEvents()
  assert.equal(component.microphoneDelayed.value, true)
  assert.match(component.microphoneHint.value, /Jeśli nie widzisz pytania o zgodę/)
  component.stop()
  await startup
  t.mock.timers.tick(20_000)
  await flushEvents()
  assert.equal(component.active.value, false)
  assert.equal(component.microphoneIssue.value, false)
  assert.equal(component.error.value, '')
})

test('a late permission reply from a cancelled attempt cannot stop or change a newer microphone startup', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const firstMicrophone = deferred<MediaStream>()
  const secondMicrophone = deferred<MediaStream>()
  const oldPermission = deferred<{ state: PermissionState }>()
  let microphoneRequests = 0
  let permissionRequests = 0
  const browser = browserFixture(t, () => ++microphoneRequests === 1 ? firstMicrophone.promise : secondMicrophone.promise, 200,
    () => ++permissionRequests === 1 ? oldPermission.promise : Promise.resolve({ state: 'granted' }))
  const component = voiceHarness(t)
  const firstStartup = component.start()
  await flushEvents()
  component.stop()
  await firstStartup
  const secondStartup = component.start()
  await flushEvents()
  assert.equal(component.microphonePermission.value, 'granted')
  const eventsBeforeOldReply = component.events.length
  oldPermission.resolve({ state: 'denied' })
  await flushEvents()
  assert.equal(component.active.value, true)
  assert.equal(component.microphonePermission.value, 'granted')
  assert.equal(component.microphoneIssue.value, false)
  assert.equal(component.error.value, '')
  assert.equal(component.events.length, eventsBeforeOldReply)
  assert.equal(browser.setupRequests(), 0)
  assert.equal(browser.microphoneRequests(), 2)
  t.mock.timers.tick(5_000)
  await flushEvents()
  assert.equal(component.microphoneDelayed.value, true, 'the new attempt must retain its own recovery timer')
  component.stop()
  await secondStartup
  const firstLate = fakeStream()
  const secondLate = fakeStream()
  firstMicrophone.resolve(firstLate.stream)
  secondMicrophone.resolve(secondLate.stream)
  await flushEvents()
  assert.deepEqual(firstLate.tracks.map(track => track.stops), [1, 1])
  assert.deepEqual(secondLate.tracks.map(track => track.stops), [1, 1])
})

test('the listening label follows real SDK audio track capture state', async t => {
  const microphone = fakeStream()
  browserFixture(t, async () => microphone.stream)
  const component = voiceHarness(t)
  const startup = component.start()
  await flushEvents()
  const socket = FakeWebSocket.instances[0]!
  socket.open()
  socket.emit({ type: 'session-updated', sessionId: 'capture-state' })
  await startup
  assert.equal(component.capturing.value, true)
  assert.equal(component.label.value, 'Słucham Cię')
  for (const track of microphone.tracks) { track.muted = true; track.dispatchEvent(new Event('mute')) }
  assert.equal(component.connected.value, true)
  assert.equal(component.capturing.value, false)
  assert.equal(component.label.value, 'Sprawdź mikrofon')
  microphone.tracks[0]!.muted = false
  microphone.tracks[0]!.dispatchEvent(new Event('unmute'))
  assert.equal(component.capturing.value, true)
  assert.equal(component.label.value, 'Słucham Cię')
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

async function connectedVoice(t: TestContext, updateWorkspace: (signal: AbortSignal) => Promise<unknown>) {
  browserFixture(t, async () => fakeStream().stream)
  const component = voiceHarness(t, updateWorkspace)
  const startup = component.start()
  await flushEvents()
  const socket = FakeWebSocket.instances[0]!
  socket.open()
  socket.emit({ type: 'session-updated', sessionId: 'workspace-test' })
  await startup
  return { component, socket }
}
async function workspaceCall(socket: FakeWebSocket, callId: string) {
  socket.emit({ type: 'function-call-arguments-done', callId, name: 'update_workspace', arguments: '{}' })
  await flushEvents()
}
function workspaceOutput(socket: FakeWebSocket, callId: string): Record<string, unknown> | undefined {
  const output = socket.sent.find(event => event.type === 'conversation-item-create' && event.item?.callId === callId)?.item?.output
  return output ? JSON.parse(output) : undefined
}

test('a tool call before a new audio transcription cannot return a cached result from the previous utterance', async t => {
  let updates = 0
  const { component, socket } = await connectedVoice(t, async () => ({ result: ++updates }))
  socket.emit({ type: 'input-transcription-completed', itemId: 'warsaw', transcript: 'Remont łazienki w Warszawie' })
  await workspaceCall(socket, 'first')
  assert.deepEqual(workspaceOutput(socket, 'first'), { result: 1 })
  await workspaceCall(socket, 'same-utterance')
  assert.deepEqual(workspaceOutput(socket, 'same-utterance'), { result: 1 })
  assert.equal(updates, 1, 'repeated calls within the same utterance should still use the cache')

  socket.emit({ type: 'speech-started', itemId: 'krakow' })
  await workspaceCall(socket, 'before-transcript')
  assert.match(String(workspaceOutput(socket, 'before-transcript')?.error), /Transkrypcja nowej wypowiedzi/)
  assert.equal(updates, 1)
  socket.emit({ type: 'speech-stopped', itemId: 'krakow' })
  socket.emit({ type: 'audio-committed', itemId: 'krakow' })
  await workspaceCall(socket, 'still-before-transcript')
  assert.ok(workspaceOutput(socket, 'still-before-transcript')?.error)
  assert.equal(updates, 1)

  socket.emit({ type: 'input-transcription-completed', itemId: 'krakow', transcript: 'Jednak w Krakowie' })
  await workspaceCall(socket, 'new-utterance')
  assert.deepEqual(workspaceOutput(socket, 'new-utterance'), { result: 2 })
  assert.equal(updates, 2)
  const lastTranscript = component.events.findLast(([name]) => name === 'transcript')?.[1] as Array<{ content: string }>
  assert.equal(lastTranscript.at(-1)?.content, 'Jednak w Krakowie')
})

test('a late transcription of an older audio item cannot unlock workspace results for a newer pending utterance', async t => {
  let updates = 0
  const { socket } = await connectedVoice(t, async () => ({ result: ++updates }))
  socket.emit({ type: 'input-transcription-completed', itemId: 'initial', transcript: 'Remont w Warszawie' })
  await workspaceCall(socket, 'initial-result')
  socket.emit({ type: 'speech-started', itemId: 'older' })
  socket.emit({ type: 'speech-stopped', itemId: 'older' })
  socket.emit({ type: 'speech-started', itemId: 'newer' })
  socket.emit({ type: 'input-transcription-completed', itemId: 'older', transcript: 'Zmień miasto na Kraków' })
  await workspaceCall(socket, 'newer-still-pending')
  assert.ok(workspaceOutput(socket, 'newer-still-pending')?.error)
  assert.equal(updates, 1)
  socket.emit({ type: 'input-transcription-completed', itemId: 'newer', transcript: 'I tylko z terminem w piątek' })
  await workspaceCall(socket, 'all-inputs-ready')
  assert.deepEqual(workspaceOutput(socket, 'all-inputs-ready'), { result: 2 })
})

test('an update completing after the user starts another utterance cannot become a successful or cached tool result', async t => {
  const firstUpdate = deferred<unknown>()
  let updates = 0
  let firstSignal: AbortSignal | undefined
  const { component, socket } = await connectedVoice(t, async signal => {
    if (++updates === 1) { firstSignal = signal; return firstUpdate.promise }
    return { result: updates }
  })
  socket.emit({ type: 'input-transcription-completed', itemId: 'initial', transcript: 'Remont w Warszawie' })
  await workspaceCall(socket, 'delayed-result')
  assert.equal(updates, 1)
  assert.equal(firstSignal?.aborted, false)
  assert.equal(workspaceOutput(socket, 'delayed-result'), undefined)
  socket.emit({ type: 'speech-started', itemId: 'changed' })
  await flushEvents()
  assert.equal(firstSignal?.aborted, true, 'new input must cancel the page request before it can commit old results')
  firstUpdate.resolve({ result: 'old-requirements' })
  await flushEvents()
  assert.match(String(workspaceOutput(socket, 'delayed-result')?.error), /Wymagania zmieniły się/)
  assert.equal(component.error.value, '', 'expected cancellation should not display a voice failure')
  socket.emit({ type: 'input-transcription-completed', itemId: 'changed', transcript: 'Jednak w Krakowie' })
  await workspaceCall(socket, 'updated-result')
  assert.deepEqual(workspaceOutput(socket, 'updated-result'), { result: 2 })
  assert.equal(updates, 2)
})

test('new speech, a late audio commit, or a late transcription cancels workspace I/O without displaying a voice error', async t => {
  for (const type of ['speech-started', 'audio-committed', 'input-transcription-completed']) {
    await t.test(type, async subtest => {
      const pending = deferred<unknown>()
      let requestSignal: AbortSignal | undefined
      const { component, socket } = await connectedVoice(subtest, async signal => {
        requestSignal = signal
        signal.addEventListener('abort', () => pending.reject(new DOMException('Cancelled', 'AbortError')), { once: true })
        return pending.promise
      })
      socket.emit({ type: 'input-transcription-completed', itemId: 'initial', transcript: 'Remont w Warszawie' })
      await workspaceCall(socket, 'cancelled-request')
      assert.equal(requestSignal?.aborted, false)
      socket.emit({ type, itemId: 'changed', transcript: 'Jednak w Krakowie' })
      await flushEvents()
      assert.equal(requestSignal?.aborted, true)
      assert.match(String(workspaceOutput(socket, 'cancelled-request')?.error), /Wymagania zmieniły się/)
      assert.equal(component.error.value, '')
      assert.equal(component.connected.value, true)
    })
  }
})

test('speech without an item ID waits for its committed audio item, and an empty transcription cannot reuse old requirements', async t => {
  let updates = 0
  const { socket } = await connectedVoice(t, async () => ({ result: ++updates }))
  socket.emit({ type: 'input-transcription-completed', itemId: 'initial', transcript: 'Remont w Warszawie' })
  await workspaceCall(socket, 'initial-result')
  socket.emit({ type: 'speech-started' })
  await workspaceCall(socket, 'unknown-input')
  assert.ok(workspaceOutput(socket, 'unknown-input')?.error)
  socket.emit({ type: 'audio-committed', itemId: 'empty' })
  socket.emit({ type: 'input-transcription-completed', itemId: 'empty', transcript: '' })
  await workspaceCall(socket, 'empty-input')
  assert.ok(workspaceOutput(socket, 'empty-input')?.error)
  assert.equal(updates, 1)
  socket.emit({ type: 'speech-started', itemId: 'retry' })
  socket.emit({ type: 'input-transcription-completed', itemId: 'retry', transcript: 'Jednak w Krakowie' })
  await workspaceCall(socket, 'retry-input')
  assert.deepEqual(workspaceOutput(socket, 'retry-input'), { result: 2 })
})

test('an older audio commit cannot identify a newer utterance that started without an item ID', async t => {
  let updates = 0
  const { socket } = await connectedVoice(t, async () => ({ result: ++updates }))
  socket.emit({ type: 'input-transcription-completed', itemId: 'initial', transcript: 'Remont w Warszawie' })
  await workspaceCall(socket, 'initial-result')
  socket.emit({ type: 'speech-started', itemId: 'older' })
  socket.emit({ type: 'speech-started' })
  socket.emit({ type: 'audio-committed', itemId: 'older' })
  socket.emit({ type: 'input-transcription-completed', itemId: 'older', transcript: 'Zmień miasto na Kraków' })
  await workspaceCall(socket, 'newer-unidentified')
  assert.ok(workspaceOutput(socket, 'newer-unidentified')?.error)
  assert.equal(updates, 1)
  socket.emit({ type: 'audio-committed', itemId: 'newer' })
  socket.emit({ type: 'input-transcription-completed', itemId: 'newer', transcript: 'Tylko z terminem w piątek' })
  await workspaceCall(socket, 'all-transcripts-ready')
  assert.deepEqual(workspaceOutput(socket, 'all-transcripts-ready'), { result: 2 })
})
