import { getHeader, sendStream, setHeader, type H3Event } from 'h3'
import type { OferteoStreamEvent, OferteoStreamFailure, OferteoChatPartial, OfferCreatorPartial } from '../../shared/types/oferteo-stream.ts'
import { analysisSchema, buildChatResponse, emptyBrief, normalizePolish, safeProjectGuidance } from './oferteoCore.ts'
import { assertOfferFactsGrounded, offerDraftSchema } from './oferteoCreator.ts'
import { emptyOfferDraft, type OfferDraft } from '../../shared/types/oferteo-creator.ts'
import type { OferteoContractor, OferteoMessage } from '../../shared/types/oferteo.ts'

export function wantsOferteoStream(event: H3Event) {
  return getHeader(event, 'accept')?.split(',').some(value => value.trim().split(';')[0] === 'text/event-stream') ?? false
}

export function oferteoRequestCancellation(event: H3Event) {
  const controller = new AbortController()
  const disconnect = () => { if (!event.node.res.writableEnded) controller.abort() }
  event.node.res.once('close', disconnect)
  event.node.req.once('aborted', disconnect)
  if (event.node.req.aborted || event.node.res.destroyed) controller.abort()
  return {
    controller,
    dispose: () => {
      event.node.res.off('close', disconnect)
      event.node.req.off('aborted', disconnect)
    },
  }
}

/** Only app-owned status/code fields leave an established stream. */
export function oferteoStreamFailure(cause: unknown): OferteoStreamFailure {
  const error = cause && typeof cause === 'object' ? cause as { statusCode?: number; data?: Record<string, unknown> } : {}
  const statusCode = [402, 429].includes(Number(error.statusCode)) ? Number(error.statusCode) : 502
  const retryAfter = Number(error.data?.retryAfterSeconds)
  return { statusCode, data: {
    code: statusCode === 402 ? 'AI_CREDITS_EXHAUSTED' : statusCode === 429 ? 'AI_RATE_LIMITED' : 'AI_UNAVAILABLE',
    retryable: statusCode !== 402,
    ...(statusCode === 429 && Number.isFinite(retryAfter) ? { retryAfterSeconds: Math.max(1, Math.min(86400, Math.ceil(retryAfter))) } : {}),
  } }
}

export function createOferteoDataStream<Result, Partial>(
  controller: AbortController,
  operation: (signal: AbortSignal, onPartial: (partial: Partial) => void) => Promise<Result>,
) {
  const encoder = new TextEncoder()
  let closed = false
  let heartbeat: ReturnType<typeof setInterval> | undefined
  let abort: () => void = () => {}
  return new ReadableStream<Uint8Array>({
    start(output) {
      const close = () => {
        if (closed) return
        closed = true
        clearInterval(heartbeat)
        controller.signal.removeEventListener('abort', abort)
        output.close()
      }
      const push = (event: OferteoStreamEvent<Result, Partial>) => {
        if (!closed && !controller.signal.aborted) output.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
      }
      abort = close
      controller.signal.addEventListener('abort', abort, { once: true })
      if (controller.signal.aborted) { close(); return }
      output.enqueue(encoder.encode(': connected\n\n'))
      heartbeat = setInterval(() => { if (!closed) output.enqueue(encoder.encode(': ping\n\n')) }, 10_000)
      void (async () => {
        try {
          const data = await operation(controller.signal, partial => push({ type: 'partial', data: partial }))
          push({ type: 'result', data })
        } catch (cause) {
          if (!controller.signal.aborted) push({ type: 'error', error: oferteoStreamFailure(cause) })
        } finally { close() }
      })()
    },
    cancel() {
      // The consumer owns the closed readable after cancel, so do not close twice.
      closed = true
      clearInterval(heartbeat)
      controller.signal.removeEventListener('abort', abort)
      controller.abort()
    },
  })
}

export function sendOferteoStream<Result, Partial>(
  event: H3Event,
  cancellation: ReturnType<typeof oferteoRequestCancellation>,
  operation: (signal: AbortSignal, onPartial: (partial: Partial) => void) => Promise<Result>,
) {
  setHeader(event, 'Content-Type', 'text/event-stream; charset=utf-8')
  setHeader(event, 'Cache-Control', 'no-store, no-transform')
  setHeader(event, 'X-Accel-Buffering', 'no')
  return sendStream(event, createOferteoDataStream(cancellation.controller, operation))
    .finally(cancellation.dispose)
}

export function chatStreamPreview(partial: unknown, catalog: OferteoContractor[], messages: OferteoMessage[]): OferteoChatPartial {
  const raw = partial && typeof partial === 'object' ? partial as { message?: unknown; brief?: unknown; intent?: unknown } : {}
  const preview: OferteoChatPartial = {}
  const brief = analysisSchema.shape.brief.partial().safeParse(raw.brief)
  if (brief.success) preview.brief = brief.data
  const message = analysisSchema.shape.message.safeParse(raw.message)
  if (message.success) {
    const completeBrief = analysisSchema.shape.brief.safeParse(raw.brief)
    const intent = analysisSchema.shape.intent.safeParse(raw.intent)
    // Preserve the final response's factual boundaries during streaming too.
    // The model emits brief/intent first, so advice can grow after this gate.
    if (completeBrief.success && intent.success) {
      const brief = completeBrief.data
      const supported = brief.service && /lazien|bathroom|glazur|plytk|prysznic|wanna/.test(normalizePolish(brief.service))
        && (!brief.city || /^warszawa(?:\s|,|$)/.test(normalizePolish(brief.city)))
      if (!supported || !['search', 'compare', 'quote_checklist'].includes(intent.data)) {
        preview.message = buildChatResponse(catalog, { brief, intent: intent.data, contractorIds: [] }, 'live', 'snapshot').message
      } else {
        const facts = { ...emptyBrief(), scope: messages.filter(item => item.role === 'user').map(item => item.content).join('\n') }
        const guidance = safeProjectGuidance(message.data, catalog, facts)
        // Empty text retracts a prefix that becomes an unsupported claim.
        preview.message = guidance || ''
      }
    }
  }
  return preview
}

export function offerStreamPreview(partial: unknown, previous: OfferDraft | null, messages: OferteoMessage[]): OfferCreatorPartial {
  const raw = partial && typeof partial === 'object' ? partial as { message?: unknown; draft?: unknown; suggestions?: unknown } : {}
  const preview: OfferCreatorPartial = {}
  if (typeof raw.message === 'string' && raw.message.length <= 900) preview.message = raw.message
  if (raw.draft && typeof raw.draft === 'object') {
    const draft: Partial<OfferDraft> = {}
    for (const field of Object.keys(offerDraftSchema.shape) as (keyof OfferDraft)[]) {
      const value = (raw.draft as Record<string, unknown>)[field]
      const parsed = offerDraftSchema.shape[field].safeParse(value)
      if (!parsed.success) continue
      if (field === 'company' || field === 'price' || field === 'timing') {
        try { assertOfferFactsGrounded({ ...emptyOfferDraft(), [field]: parsed.data }, previous, messages) }
        catch { continue }
      }
      Object.assign(draft, { [field]: parsed.data })
    }
    preview.draft = draft
  }
  if (Array.isArray(raw.suggestions) && raw.suggestions.length <= 3 && raw.suggestions.every(item => typeof item === 'string' && item.length <= 140)) preview.suggestions = raw.suggestions
  return preview
}
