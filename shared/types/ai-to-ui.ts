// Contract between /api/ai-to-ui/* and the /ai-to-ui page.

export const AI_TO_UI_VIEWS = ['text', 'comparison', 'checklist'] as const
export type AiToUiView = (typeof AI_TO_UI_VIEWS)[number]

export type AiToUiMode = 'ai' | 'unavailable'

/** Enforced by the server. The page reads them so it never sends more. */
export const AI_TO_UI_LIMITS = {
  questionChars: 300,
  historyMessages: 6,
} as const

export interface AiToUiMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AiToUiContractor {
  id: string
  name: string
  note: string
  priceZl: number
  startInDays: number
  workDays: number
  warrantyMonths: number
  rating: number
  reviews: number
}

export interface AiToUiChecklistItem {
  id: string
  label: string
  hint: string
}

interface AiToUiReplyBase {
  mode: 'ai'
  /** A short answer from the model. */
  answer: string
}

export interface AiToUiTextReply extends AiToUiReplyBase {
  view: 'text'
}

export interface AiToUiComparisonReply extends AiToUiReplyBase {
  view: 'comparison'
  contractors: AiToUiContractor[]
}

export interface AiToUiChecklistReply extends AiToUiReplyBase {
  view: 'checklist'
  items: AiToUiChecklistItem[]
}

/** The view type decides which Vue component renders the reply. */
export type AiToUiReply = AiToUiTextReply | AiToUiComparisonReply | AiToUiChecklistReply

/**
 * Server-sent events on POST /api/ai-to-ui/chat. A `partial` reply is
 * provisional and may still change. Only `result` has passed the schema.
 */
export type AiToUiStreamEvent =
  | { type: 'partial', data: AiToUiReply }
  | { type: 'result', data: AiToUiReply }
  | { type: 'error', error: { statusCode: number, code: string } }

export interface AiToUiStatus {
  mode: AiToUiMode
  /** Model id, present only when a real model answers. */
  model: string | null
  /** Live AI is enabled, but its AI Gateway key is missing. */
  missingKey: boolean
  /** The site-wide daily limit on Vercel production. */
  dailyLimit: number | null
}
