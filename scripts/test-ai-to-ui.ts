import assert from 'node:assert/strict'
import { createServer, request, type IncomingMessage, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { after, before, test } from 'node:test'
import { createGateway, simulateReadableStream } from 'ai'
import { MockLanguageModelV4 } from 'ai/test'
import { readAiToUiStream } from '../app/utils/aiToUiStream.ts'
import { AI_TO_UI_LIMITS, type AiToUiReply, type AiToUiStreamEvent } from '../shared/types/ai-to-ui.ts'
import {
  AI_TO_UI_ANSWER_CHARS, AI_TO_UI_MODEL, aiToUiChoiceSchema, aiToUiModelMessages, aiToUiRequestSchema, buildAiToUiPartialReply,
  buildAiToUiReply, resolveAiToUiMode, takeAiToUiCallSlot, tidyAiToUiAnswer, type AiToUiChoice,
} from '../server/utils/aiToUi.ts'
import { AI_TO_UI_MAX_OUTPUT_TOKENS, isAiToUiTimeout, streamAiToUiChoice } from '../server/utils/aiToUiModel.ts'
import { readAiToUiBody } from '../server/utils/aiToUiRequest.ts'
import { createAiToUiEventStream } from '../server/utils/aiToUiStream.ts'

const usage = {
  inputTokens: { total: 10, noCache: 10, cacheRead: undefined, cacheWrite: undefined },
  outputTokens: { total: 20, text: 20, reasoning: undefined },
}
/** A model that streams the given text deltas, the way a provider sends tokens. */
const modelStreaming = (deltas: string[], chunkDelayInMs = 0) => new MockLanguageModelV4({
  doStream: async () => ({
    stream: simulateReadableStream({
      chunkDelayInMs,
      chunks: [
        { type: 'text-start' as const, id: 'answer' },
        ...deltas.map(delta => ({ type: 'text-delta' as const, id: 'answer', delta })),
        { type: 'text-end' as const, id: 'answer' },
        { type: 'finish' as const, finishReason: { unified: 'stop' as const, raw: undefined }, logprobs: undefined, usage },
      ],
    }),
  }),
})
/** A model that never answers and only ends when its call is aborted. */
const modelStalling = () => {
  let signal: AbortSignal | undefined
  const model = new MockLanguageModelV4({
    doStream: async ({ abortSignal }) => {
      signal = abortSignal
      return {
        stream: new ReadableStream({
          start(controller) {
            controller.enqueue({ type: 'text-start' as const, id: 'answer' })
            controller.enqueue({ type: 'text-delta' as const, id: 'answer', delta: '{"view":"text","contractors":[],"items":[],"answer":"Typically' })
            abortSignal?.addEventListener('abort', () => controller.error(abortSignal.reason), { once: true })
          },
        }),
      }
    },
  })
  return { model, get signal() { return signal } }
}
const question = [{ role: 'user' as const, content: 'What should I ask before accepting a quote?' }]

test('live Gateway model streams valid replies to the example questions', { skip: process.env.AI_TO_UI_LIVE_TEST !== '1' }, async () => {
  const apiKey = process.env.NUXT_AI_GATEWAY_API_KEY || process.env.AI_GATEWAY_API_KEY
  assert.ok(apiKey, 'Configure an AI Gateway key before running the live test.')
  const model = createGateway({ apiKey })(process.env.NUXT_AI_TO_UI_MODEL || AI_TO_UI_MODEL)
  for (const [content, view] of [
    ['Compare contractors', 'comparison'],
    ['What should I ask before accepting a quote?', 'checklist'],
    ['How long does the renovation take?', 'text'],
  ] as const) {
    let rendered = false
    const choice = await streamAiToUiChoice([{ role: 'user', content }], {
      model,
      onPartial: partial => { if (buildAiToUiPartialReply(partial)?.view === view) rendered = true },
    })
    assert.equal(choice.view, view, content)
    assert.ok(rendered, content)
  }
})

const contractors = [
  { name: 'Example Tile Co.', note: 'Tile layout included', priceZl: 22_500, startInDays: 14, workDays: 12, warrantyMonths: 24, rating: 4.4, reviews: 29 },
  { name: 'Example Bath Co.', note: 'Plumbing included', priceZl: 25_000, startInDays: 7, workDays: 10, warrantyMonths: 36, rating: 4.8, reviews: 19 },
  { name: 'Example Renovation Co.', note: 'Debris removal included', priceZl: 20_500, startInDays: 21, workDays: 15, warrantyMonths: 12, rating: 4.6, reviews: 52 },
] satisfies AiToUiChoice['contractors']
const items = [
  { label: 'Does the quote include debris removal?', hint: 'Ask for a separate line item if removal costs extra.' },
  { label: 'When are payments due?', hint: 'Ask which milestones trigger a payment.' },
  { label: 'What does the warranty cover?', hint: 'Ask about workmanship and waterproofing.' },
] satisfies AiToUiChoice['items']

test('the final reply uses generated rows with IDs that match the provisional rows', () => {
  const partial = buildAiToUiPartialReply({ view: 'comparison', contractors: contractors.slice(0, 1) })
  assert.ok(partial?.view === 'comparison')
  assert.equal(partial.answer, '')
  const final = buildAiToUiReply({ view: 'comparison', contractors, items: [], answer: 'Compare these fictional quotes.' })
  assert.ok(final.view === 'comparison')
  assert.deepEqual(final.contractors[0], partial.contractors[0])
  assert.deepEqual(final.contractors.map(({ id, ...contractor }) => contractor), contractors)
  assert.equal(new Set(final.contractors.map(({ id }) => id)).size, contractors.length)
})

test('only the selected view may carry generated rows or items', () => {
  const validText = { view: 'text', contractors: [], items: [], answer: 'Allow time for waterproofing to cure.' }
  assert.equal(aiToUiChoiceSchema.safeParse(validText).success, true)
  assert.equal(aiToUiChoiceSchema.safeParse({ ...validText, items }).success, false)
  assert.equal(aiToUiChoiceSchema.safeParse({ ...validText, contractors }).success, false)
  assert.equal(aiToUiChoiceSchema.safeParse({ ...validText, view: 'comparison' }).success, false)
  assert.equal(aiToUiChoiceSchema.safeParse({ ...validText, view: 'checklist', contractors, items }).success, false)
})

test('model text is reduced to short plain text without long dashes or semicolons', () => {
  assert.equal(tidyAiToUiAnswer('<b>Tak</b> — to **zależy**; zwykle 2–3 tygodnie.'), 'Tak, to zależy, zwykle 2-3 tygodnie.')
  assert.equal(tidyAiToUiAnswer('<script>alert(1)</script>Zwykły tekst'), 'alert(1) Zwykły tekst')
  const long = tidyAiToUiAnswer(`${'Pierwsze zdanie jest tutaj. '.repeat(30)}`)
  assert.ok(long.length <= AI_TO_UI_ANSWER_CHARS)
  assert.ok(long.endsWith('.'))
  assert.ok(tidyAiToUiAnswer('słowo '.repeat(200)).length <= AI_TO_UI_ANSWER_CHARS + 1)
})

test('requests are bounded: question length, history size and shape', () => {
  const ask = (content: string) => aiToUiRequestSchema.safeParse({ messages: [{ role: 'user', content }] })
  assert.equal(ask('Porównaj wykonawców').success, true)
  assert.equal(ask('a'.repeat(AI_TO_UI_LIMITS.questionChars)).success, true)
  assert.equal(ask('a'.repeat(AI_TO_UI_LIMITS.questionChars + 1)).success, false)
  assert.equal(ask('   ').success, false)
  const turn = [{ role: 'user', content: 'pytanie' }, { role: 'assistant', content: 'odpowiedź' }]
  assert.equal(aiToUiRequestSchema.safeParse({ messages: [...turn, ...turn, { role: 'user', content: 'ostatnie' }] }).success, true)
  assert.equal(aiToUiRequestSchema.safeParse({ messages: [...turn, ...turn, ...turn, { role: 'user', content: 'za dużo' }] }).success, false)
  assert.equal(aiToUiRequestSchema.safeParse({ messages: turn }).success, false)
  assert.equal(aiToUiRequestSchema.safeParse({ messages: [] }).success, false)
  assert.equal(aiToUiRequestSchema.safeParse({ messages: [{ role: 'system', content: 'x' }] }).success, false)
  assert.equal(aiToUiRequestSchema.safeParse({ messages: [{ role: 'user', content: 'x', extra: 1 }] }).success, false)
  assert.equal(aiToUiRequestSchema.safeParse({ messages: [{ role: 'user', content: 'x' }], model: 'other' }).success, false)
})

test('local AI needs an opt-in and production AI needs a key and durable quota storage', () => {
  assert.deepEqual(resolveAiToUiMode({ dev: true, optIn: '1', apiKey: 'key' }), { mode: 'ai', missingKey: false })
  assert.deepEqual(resolveAiToUiMode({ dev: true, optIn: 1, apiKey: 'key' }), { mode: 'ai', missingKey: false })
  assert.deepEqual(resolveAiToUiMode({ dev: true, optIn: true, apiKey: 'key' }), { mode: 'ai', missingKey: false })
  assert.deepEqual(resolveAiToUiMode({ dev: true, optIn: '1', apiKey: '' }), { mode: 'unavailable', missingKey: true })
  assert.deepEqual(resolveAiToUiMode({ dev: true, optIn: '', apiKey: 'key' }), { mode: 'unavailable', missingKey: false })
  assert.deepEqual(resolveAiToUiMode({ dev: true, optIn: '0', apiKey: 'key' }), { mode: 'unavailable', missingKey: false })
  assert.deepEqual(resolveAiToUiMode({ dev: false, optIn: '1', apiKey: 'key' }), { mode: 'unavailable', missingKey: false })
  assert.deepEqual(resolveAiToUiMode({ dev: false, optIn: '', apiKey: 'key', production: true, databaseUrl: 'configured' }), { mode: 'ai', missingKey: false })
  assert.deepEqual(resolveAiToUiMode({ dev: false, optIn: '', apiKey: 'key', production: true, databaseUrl: '' }), { mode: 'unavailable', missingKey: false })
  assert.deepEqual(resolveAiToUiMode({ dev: false, optIn: '', apiKey: '', production: true, databaseUrl: 'configured' }), { mode: 'unavailable', missingKey: true })
})

test('model history starts with a question and stays within the limit', () => {
  const history = Array.from({ length: 9 }, (_, index) => ({ role: index % 2 ? 'assistant' as const : 'user' as const, content: `m${index}` }))
  const sent = aiToUiModelMessages(history)
  assert.ok(sent.length <= AI_TO_UI_LIMITS.historyMessages)
  assert.equal(sent[0]!.role, 'user')
  assert.equal(sent.at(-1)!.content, 'm8')
})

test('model calls are capped per process', () => {
  const start = 1_000_000
  for (let call = 0; call < 20; call++) assert.equal(takeAiToUiCallSlot(start + call), 0)
  assert.ok(takeAiToUiCallSlot(start + 30) > 0)
  assert.equal(takeAiToUiCallSlot(start + 10 * 60_000 + 1), 0)
})

test('AI SDK streams model-generated checklist items before the answer', async () => {
  const expected = { view: 'checklist', contractors: [], items, answer: 'Start with these questions.' } satisfies AiToUiChoice
  const model = modelStreaming([
    '{"view":"check',
    'list","contractors":[],"items":[',
    JSON.stringify(items[0]),
    `,${items.slice(1).map(item => JSON.stringify(item)).join(',')}]`,
    ',"answer":"Start with ',
    'these questions."}',
  ])
  const snapshots: AiToUiReply[] = []
  const choice = await streamAiToUiChoice(question, { model, onPartial(partial) {
    const reply = buildAiToUiPartialReply(partial)
    if (reply) snapshots.push(reply)
  } })
  assert.deepEqual(choice, expected)
  const firstReply = snapshots[0]
  assert.ok(firstReply?.view === 'checklist')
  assert.equal(firstReply.answer, '')
  assert.equal(firstReply.items.length, 1)
  const final = buildAiToUiReply(choice)
  assert.ok(final.view === 'checklist')
  assert.deepEqual(firstReply.items[0], final.items[0])
  assert.deepEqual(final.items.map(({ id, ...item }) => item), items)
  assert.deepEqual(snapshots.at(-1), final)
  const [call] = model.doStreamCalls
  assert.equal(call!.maxOutputTokens, AI_TO_UI_MAX_OUTPUT_TOKENS)
  assert.equal(call!.responseFormat?.type, 'json')
  assert.equal(call!.prompt[0]!.role, 'system')
  assert.deepEqual(call!.prompt.slice(1).map(message => message.role), ['user'])
})

test('snapshots become replies only once there is something valid to show', () => {
  assert.equal(buildAiToUiPartialReply(undefined), null)
  assert.equal(buildAiToUiPartialReply({}), null)
  assert.equal(buildAiToUiPartialReply({ view: 'check' }), null)
  assert.equal(buildAiToUiPartialReply({ view: 'html', answer: '<table>' }), null)
  assert.equal(buildAiToUiPartialReply({ view: 'comparison' }), null)
  assert.equal(buildAiToUiPartialReply({ view: 'comparison', contractors: [{ name: 'Example Tile Co.' }] }), null)
  assert.equal(buildAiToUiPartialReply({ view: 'checklist', items: [{ label: 'What is included?' }] }), null)
  // A text answer has nothing to show until its first words arrive.
  assert.equal(buildAiToUiPartialReply({ view: 'text' }), null)
  assert.equal(buildAiToUiPartialReply({ view: 'text', answer: '' }), null)
  assert.deepEqual(buildAiToUiPartialReply({ view: 'text', answer: 'Typically 2' }), { mode: 'ai', view: 'text', answer: 'Typically 2' })
  // A tag that is still being written is not shown as text.
  assert.equal(buildAiToUiPartialReply({ view: 'text', answer: 'Yes <stro' })!.answer, 'Yes')
  assert.equal(tidyAiToUiAnswer('A small area of 5 < 6 m²', true), 'A small area of 5 < 6 m²')
})

test('streamed output outside the schema is rejected instead of rendered', async () => {
  for (const text of ['{"view":"html","answer":"<table></table>"}', '{"view":"text"}', 'to nie jest JSON']) {
    const snapshots: unknown[] = []
    await assert.rejects(streamAiToUiChoice(question, { model: modelStreaming([text]), onPartial: partial => snapshots.push(partial) }))
    assert.ok(snapshots.every(snapshot => buildAiToUiPartialReply(snapshot) === null), JSON.stringify(snapshots))
  }
})

test('a stalled model stream is aborted by the call timeout', async () => {
  const stalled = modelStalling()
  const startedAt = Date.now()
  await assert.rejects(
    streamAiToUiChoice(question, { model: stalled.model, timeoutMs: 40, onPartial() {} }),
    error => isAiToUiTimeout(error),
  )
  assert.ok(Date.now() - startedAt < 2_000)
  assert.equal(stalled.signal?.aborted, true)
  assert.equal(isAiToUiTimeout(new Error('other')), false)
})

test('a client that leaves stops the model call', async () => {
  const stalled = modelStalling()
  const client = new AbortController()
  const reason = new DOMException('Client disconnected', 'AbortError')
  const firstSnapshot = Promise.withResolvers<void>()
  const generation = streamAiToUiChoice(question, { model: stalled.model, signal: client.signal, onPartial: () => firstSnapshot.resolve() })
  const rejected = assert.rejects(generation, error => error === reason)
  await firstSnapshot.promise
  client.abort(reason)
  await rejected
  assert.equal(stalled.signal?.aborted, true)
})

test('a failing snapshot consumer stops the model call', async () => {
  const stalled = modelStalling()
  await assert.rejects(
    streamAiToUiChoice(question, { model: stalled.model, onPartial() { throw new Error('write failed') } }),
    /write failed/,
  )
  assert.equal(stalled.signal?.aborted, true)
})

const text: AiToUiReply = { mode: 'ai', view: 'text', answer: 'Zwykle od 2 do 4 tygodni, zależnie od zakresu.' }
const describe = () => ({ statusCode: 504, code: 'MODEL_TIMEOUT' })
const drain = async (stream: ReadableStream<Uint8Array>) => new TextDecoder().decode(await new Response(stream).arrayBuffer())

test('a reply travels as server-sent events: snapshots, then the validated result', async () => {
  const stream = createAiToUiEventStream(new AbortController(), async (send) => {
    send({ type: 'partial', data: { ...text, answer: 'Zwykle' } })
    send({ type: 'partial', data: { ...text, answer: 'Zwykle od 2 do 4 tygodni' } })
    send({ type: 'result', data: text })
  }, describe)
  const snapshots: string[] = []
  assert.deepEqual(await readAiToUiStream(stream, { onPartial: reply => snapshots.push(reply.answer) }), text)
  assert.deepEqual(snapshots, ['Zwykle', 'Zwykle od 2 do 4 tygodni'])
})

test('a failed reply becomes one app-owned error event', async () => {
  const failing = () => createAiToUiEventStream(new AbortController(), async (send) => {
    send({ type: 'partial', data: { ...text, answer: 'Zwykle' } })
    throw new Error('private provider details')
  }, describe)
  const raw = await drain(failing())
  assert.doesNotMatch(raw, /private provider details/)
  assert.match(raw, /"type":"error","error":\{"statusCode":504,"code":"MODEL_TIMEOUT"\}/)
  const snapshots: string[] = []
  await assert.rejects(
    readAiToUiStream(failing(), { onPartial: reply => snapshots.push(reply.answer) }),
    error => (error as { statusCode: number }).statusCode === 504,
  )
  assert.deepEqual(snapshots, ['Zwykle'])
})

test('a stream that ends without a result is a failure, not an empty reply', async () => {
  const empty = createAiToUiEventStream(new AbortController(), async () => {}, describe)
  await assert.rejects(readAiToUiStream(empty), error => (error as { statusCode: number }).statusCode === 502)
  const malformed = new Response('data: {"type":"result","data":{"view":"text"}}\n\n').body!
  await assert.rejects(readAiToUiStream(malformed), error => (error as { statusCode: number }).statusCode === 502)
})

test('closing the event stream from either side stops the work behind it', async () => {
  // The server side aborts: a reader sees the stream end without a result.
  const server = new AbortController()
  let workSignal: AbortSignal | undefined
  const stream = createAiToUiEventStream(server, (_send, signal) => {
    workSignal = signal
    return new Promise<void>((resolve) => { signal.addEventListener('abort', () => resolve(), { once: true }) })
  }, describe)
  const reading = assert.rejects(readAiToUiStream(stream), error => (error as { statusCode: number }).statusCode === 502)
  server.abort()
  await reading
  assert.equal(workSignal?.aborted, true)
  // The reader leaves: cancelling the stream aborts the controller.
  const other = new AbortController()
  await createAiToUiEventStream(other, () => new Promise<void>(() => {}), describe).cancel()
  assert.equal(other.signal.aborted, true)
})

test('the stream reader does not depend on how the network cuts the bytes', async () => {
  const events: AiToUiStreamEvent[] = [
    { type: 'partial', data: { ...text, answer: 'Zależy od zakresu, zwykle' } },
    { type: 'result', data: { ...text, answer: 'Zależy od zakresu, zwykle od 2 do 4 tygodni. Żółć, gęś, jaźń.' } },
  ]
  const bytes = new TextEncoder().encode(`: open\r\n\r\n${events.map(event => `data: ${JSON.stringify(event)}\n\n`).join('')}`)
  for (const size of [1, 2, 3, 7, 64, bytes.length]) {
    const chunked = new ReadableStream<Uint8Array>({
      start(controller) {
        // Odd sizes split frames and multi-byte characters across chunks.
        for (let offset = 0; offset < bytes.length; offset += size) controller.enqueue(bytes.slice(offset, offset + size))
        controller.close()
      },
    })
    const snapshots: string[] = []
    const reply = await readAiToUiStream(chunked, { onPartial: snapshot => snapshots.push(snapshot.answer) })
    assert.equal(reply.answer, 'Zależy od zakresu, zwykle od 2 do 4 tygodni. Żółć, gęś, jaźń.', `chunk size ${size}`)
    assert.deepEqual(snapshots, ['Zależy od zakresu, zwykle'])
  }
})

test('a reader that is cancelled mid-stream rejects with the abort reason', async () => {
  const client = new AbortController()
  const reason = new DOMException('Left the page', 'AbortError')
  const stream = createAiToUiEventStream(new AbortController(), () => new Promise<void>(() => {}), describe)
  const reading = assert.rejects(readAiToUiStream(stream, { signal: client.signal }), error => error === reason)
  client.abort(reason)
  await reading
})

// The body reader runs against a real HTTP server, the way Nitro's dev server calls it.
let server: Server
let port = 0
const seen: { status: number, bytes: number, listeners: number, connection: string | number | string[] | undefined }[] = []
const BODY_LIMIT = 200
const BODY_DEADLINE_MS = 150

before(async () => {
  server = createServer(async (req, res) => {
    let status = 200
    let bytes = 0
    try {
      bytes = (await readAiToUiBody(req, res, { maxBytes: BODY_LIMIT, deadlineMs: BODY_DEADLINE_MS })).byteLength
    } catch (error) {
      status = (error as { statusCode: number }).statusCode
    }
    const listeners = (['data', 'end', 'error', 'close'] as const).reduce((count, name) => count + req.listenerCount(name), 0)
    seen.push({ status, bytes, listeners, connection: res.getHeader('connection') })
    if (!res.destroyed) res.writeHead(status).end(String(bytes))
  })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  port = (server.address() as AddressInfo).port
})
after(() => new Promise<void>(resolve => {
  server.closeAllConnections()
  server.close(() => resolve())
}))

const send = (write: (req: ReturnType<typeof request>) => void) => new Promise<{ status: number, body: string }>((resolve, reject) => {
  const req = request({ host: '127.0.0.1', port, method: 'POST', path: '/', headers: { 'content-type': 'application/json' } }, (res: IncomingMessage) => {
    let body = ''
    res.setEncoding('utf8').on('data', chunk => { body += chunk }).on('end', () => resolve({ status: res.statusCode ?? 0, body }))
  })
  req.on('error', reject)
  write(req)
})

test('body reader returns a complete body and removes its listeners', async () => {
  seen.length = 0
  const payload = JSON.stringify({ messages: [{ role: 'user', content: 'Porównaj wykonawców' }] })
  const response = await send(req => req.end(payload))
  assert.equal(response.status, 200)
  assert.equal(Number(response.body), Buffer.byteLength(payload))
  assert.deepEqual(seen, [{ status: 200, bytes: Buffer.byteLength(payload), listeners: 0, connection: undefined }])
})

test('body reader stops at the size cap, even without Content-Length', async () => {
  seen.length = 0
  const response = await send((req) => {
    // Chunked upload: the size is only known as the bytes arrive.
    req.write('x'.repeat(BODY_LIMIT))
    req.write('x'.repeat(BODY_LIMIT))
    req.end('x'.repeat(BODY_LIMIT))
  })
  assert.equal(response.status, 413)
  assert.deepEqual(seen, [{ status: 413, bytes: 0, listeners: 0, connection: 'close' }])
})

test('body reader gives up on a stalled upload at the deadline and closes the connection', async () => {
  seen.length = 0
  const startedAt = Date.now()
  let closed = false
  const response = await send((req) => {
    req.on('close', () => { closed = true })
    req.write('{"messages":')
    // Never finish the body.
  })
  assert.equal(response.status, 408)
  assert.ok(Date.now() - startedAt >= BODY_DEADLINE_MS - 20)
  assert.deepEqual(seen, [{ status: 408, bytes: 0, listeners: 0, connection: 'close' }])
  await new Promise(resolve => setTimeout(resolve, 50))
  assert.equal(closed, true)
})

test('body reader settles when the client disconnects mid-upload', async () => {
  seen.length = 0
  await new Promise<void>((resolve) => {
    const req = request({ host: '127.0.0.1', port, method: 'POST', path: '/' })
    req.on('error', () => {})
    req.write('{"messages":')
    setTimeout(() => {
      req.destroy()
      resolve()
    }, 30)
  })
  await new Promise(resolve => setTimeout(resolve, 60))
  assert.equal(seen.length, 1)
  assert.equal(seen[0]!.status, 400)
  assert.equal(seen[0]!.listeners, 0)
})
