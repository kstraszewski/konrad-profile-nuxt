import { z } from 'zod'
import { AI_TO_UI_LIMITS, AI_TO_UI_VIEWS } from '../../shared/types/ai-to-ui.ts'
import type { AiToUiMessage, AiToUiMode, AiToUiReply } from '../../shared/types/ai-to-ui.ts'

// Pure logic for /api/ai-to-ui: no Nitro, no network. Covered by scripts/test-ai-to-ui.ts.

export const AI_TO_UI_MODEL = 'google/gemini-3.5-flash-lite'
export const AI_TO_UI_MAX_BODY_BYTES = 6_000
export const AI_TO_UI_ANSWER_CHARS = 360

export const aiToUiRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().trim().min(1).max(AI_TO_UI_ANSWER_CHARS + 40),
  }).strict()).min(1).max(AI_TO_UI_LIMITS.historyMessages),
}).strict().superRefine(({ messages }, context) => {
  if (messages.at(-1)?.role !== 'user') {
    context.addIssue({ code: 'custom', message: 'The last message must be the question.' })
  }
  if (messages.some(message => message.role === 'user' && message.content.length > AI_TO_UI_LIMITS.questionChars)) {
    context.addIssue({ code: 'custom', message: 'A question is too long.' })
  }
})

const contractorSchema = z.strictObject({
  name: z.string().trim().min(1).max(60),
  note: z.string().trim().min(1).max(140),
  priceZl: z.number().int().positive().max(10_000_000),
  startInDays: z.number().int().min(0).max(730),
  workDays: z.number().int().min(1).max(730),
  warrantyMonths: z.number().int().min(0).max(240),
  rating: z.number().min(0).max(5),
  reviews: z.number().int().min(0).max(100_000),
})
const checklistItemSchema = z.strictObject({
  label: z.string().trim().min(1).max(140),
  hint: z.string().trim().min(1).max(200),
})

const MAX_CONTRACTORS = 6
const MAX_CHECKLIST_ITEMS = 8

/** The model generates the view, its data, and the answer in streaming order. */
export const aiToUiChoiceSchema = z.strictObject({
  view: z.enum(AI_TO_UI_VIEWS).describe(
    'The reply view. Use comparison for a contractor comparison table, checklist for questions to ask before accepting a quote, or text for a plain text reply.',
  ),
  contractors: z.array(contractorSchema).max(MAX_CONTRACTORS).describe(
    'For comparison, generate 2 to 6 fictional contractor profiles suited to the request. Otherwise return an empty array.',
  ),
  items: z.array(checklistItemSchema).max(MAX_CHECKLIST_ITEMS).describe(
    'For checklist, generate 1 to 8 useful questions with hints suited to the request. Otherwise return an empty array.',
  ),
  answer: z.string().trim().min(1).max(AI_TO_UI_ANSWER_CHARS).describe(
    'A short answer in English. Use one or two sentences of plain text.',
  ),
}).superRefine(({ view, contractors, items }, context) => {
  if (view === 'comparison' ? contractors.length < 2 : contractors.length !== 0) {
    context.addIssue({ code: 'custom', path: ['contractors'], message: 'Comparison needs at least two contractor rows. Other views need an empty array.' })
  }
  if (view === 'checklist' ? items.length === 0 : items.length !== 0) {
    context.addIssue({ code: 'custom', path: ['items'], message: 'Checklist needs at least one item. Other views need an empty array.' })
  }
})
export type AiToUiChoice = z.infer<typeof aiToUiChoiceSchema>

/**
 * Model text is displayed as plain text only. Remove markup, keep it short and
 * match the page's typography rules: no long dashes, no semicolons.
 */
export function tidyAiToUiAnswer(raw: string, provisional = false): string {
  // While text is still arriving, a tag may be cut off before its closing bracket.
  const text = (provisional ? raw.replace(/<\/?[a-z][^>]*$/i, '') : raw)
    .replace(/<\/?[a-z][^>]*>/gi, ' ')
    .replace(/[*_`#]+/g, '')
    .replace(/(\d)\s*[‒-―]\s*(\d)/g, '$1-$2')
    .replace(/\s*[‒-―]\s*/g, ', ')
    .replace(/\s*;\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim()
  if (text.length <= AI_TO_UI_ANSWER_CHARS) return text
  const cut = text.slice(0, AI_TO_UI_ANSWER_CHARS)
  const sentenceEnd = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '))
  return sentenceEnd > 80 ? cut.slice(0, sentenceEnd + 1) : `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

function toReply(choice: AiToUiChoice, provisional = false): AiToUiReply {
  const answer = tidyAiToUiAnswer(choice.answer, provisional)
  const base = { mode: 'ai', answer } as const
  if (choice.view === 'comparison') {
    return { ...base, view: 'comparison', contractors: choice.contractors.map((row, index) => ({ ...row, id: `contractor-${index}` })) }
  }
  if (choice.view === 'checklist') {
    return { ...base, view: 'checklist', items: choice.items.map((item, index) => ({ ...item, id: `item-${index}` })) }
  }
  return { ...base, view: 'text' }
}

export function buildAiToUiReply(choice: AiToUiChoice): AiToUiReply {
  return toReply(choice)
}

function readValidPrefix<T>(value: unknown, limit: number, schema: z.ZodType<T>): T[] {
  if (!Array.isArray(value)) return []
  const entries: T[] = []
  for (const entry of value.slice(0, limit)) {
    const parsed = schema.safeParse(entry)
    if (!parsed.success) break
    entries.push(parsed.data)
  }
  return entries
}

/** Publish a view as soon as it has a valid item or readable text. */
export function buildAiToUiPartialReply(partial: unknown): AiToUiReply | null {
  if (typeof partial !== 'object' || partial === null) return null
  const raw = partial as Partial<Record<keyof AiToUiChoice, unknown>>
  const view = aiToUiChoiceSchema.shape.view.safeParse(raw.view)
  if (!view.success) return null

  const contractors = view.data === 'comparison' ? readValidPrefix(raw.contractors, MAX_CONTRACTORS, contractorSchema) : []
  const items = view.data === 'checklist' ? readValidPrefix(raw.items, MAX_CHECKLIST_ITEMS, checklistItemSchema) : []
  if (view.data === 'comparison' && !contractors.length) return null
  if (view.data === 'checklist' && !items.length) return null

  const answer = typeof raw.answer === 'string' ? raw.answer : ''
  const reply = toReply({ view: view.data, contractors, items, answer }, true)
  return reply.view === 'text' && !reply.answer ? null : reply
}

const isOptIn = (value: unknown) => ['1', 'true', 'on', 'yes'].includes(String(value).trim().toLowerCase())

export function isAiToUiVercelProduction() {
  return process.env.VERCEL === '1' && process.env.VERCEL_ENV === 'production'
}

/** Production requires durable quota storage. Local development is explicitly opt-in. */
export function resolveAiToUiMode(input: {
  dev: boolean
  optIn: unknown
  apiKey: string
  production?: boolean
  databaseUrl?: string
}): { mode: AiToUiMode, missingKey: boolean } {
  const requested = input.production || (input.dev && isOptIn(input.optIn))
  const hasKey = Boolean(input.apiKey.trim())
  const hasQuotaStorage = !input.production || Boolean(input.databaseUrl?.trim())
  return { mode: requested && hasKey && hasQuotaStorage ? 'ai' : 'unavailable', missingKey: Boolean(requested && !hasKey) }
}

/** History for the model: bounded by the request schema, starting with a question. */
export function aiToUiModelMessages(messages: AiToUiMessage[]): AiToUiMessage[] {
  const recent = messages.slice(-AI_TO_UI_LIMITS.historyMessages)
  const firstQuestion = recent.findIndex(message => message.role === 'user')
  return recent.slice(Math.max(0, firstQuestion)).map(({ role, content }) => ({ role, content }))
}

const AI_TO_UI_CALL_WINDOW_MS = 10 * 60_000
const AI_TO_UI_CALLS_PER_WINDOW = 20
const recentCalls: number[] = []

/** Per-process cap on model calls. Returns 0 when a call may run, else seconds to wait. */
export function takeAiToUiCallSlot(now = Date.now()): number {
  while (recentCalls.length && recentCalls[0]! <= now - AI_TO_UI_CALL_WINDOW_MS) recentCalls.shift()
  if (recentCalls.length >= AI_TO_UI_CALLS_PER_WINDOW) {
    return Math.max(1, Math.ceil((recentCalls[0]! + AI_TO_UI_CALL_WINDOW_MS - now) / 1_000))
  }
  recentCalls.push(now)
  return 0
}
