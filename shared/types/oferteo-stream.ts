import type { OferteoBrief } from './oferteo.ts'
import type { OfferDraft } from './oferteo-creator.ts'

export interface OferteoChatPartial {
  message?: string
  brief?: Partial<OferteoBrief>
}

export interface OfferCreatorPartial {
  message?: string
  draft?: Partial<OfferDraft>
  suggestions?: string[]
}

export interface OferteoStreamFailure {
  statusCode: number
  data?: { code?: string; retryable?: boolean; retryAfterSeconds?: number }
}

// Partials are previews; only a result commits the conversation/workspace.
export type OferteoStreamEvent<Result, Partial> =
  | { type: 'partial'; data: Partial }
  | { type: 'result'; data: Result }
  | { type: 'error'; error: OferteoStreamFailure }
