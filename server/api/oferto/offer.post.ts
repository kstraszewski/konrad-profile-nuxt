import { createError, defineEventHandler, setHeader } from 'h3'
import { assertOferteoAiAvailable, hasOferteoAiCredentials } from '../../utils/oferteoAi'
import { withOferteoAiRetryAfter } from '../../utils/oferteoAiAvailability'
import { OFERTEO_MODEL } from '../../utils/oferteoCore'
import { createOfferWithAi, createSampleOffer, offerCreatorRequestSchema } from '../../utils/oferteoCreator'
import { assertOferteoOrigin, enforceOferteoRateLimit, readOferteoJson } from '../../utils/oferteoGuard'
import { offerStreamPreview, oferteoRequestCancellation, sendOferteoStream, wantsOferteoStream } from '../../utils/oferteoStream'
import type { OfferCreatorPartial } from '../../../shared/types/oferteo-stream'
import type { OfferCreatorResponse } from '../../../shared/types/oferteo-creator'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')
  assertOferteoOrigin(event)
  const parsed = offerCreatorRequestSchema.safeParse(await readOferteoJson(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Sprawdź wiadomość (maks. 1500 znaków) i szkic lub rozpocznij nową ofertę.' })
  const config = useRuntimeConfig(event)
  const apiKey = String(config.aiGatewayApiKey || '')
  const model = String(config.oferteoAiModel || OFERTEO_MODEL)
  const live = hasOferteoAiCredentials(apiKey)
  const cancellation = oferteoRequestCancellation(event)
  try {
    return await withOferteoAiRetryAfter(event, async () => {
      if (live) await assertOferteoAiAvailable(apiKey)
      await enforceOferteoRateLimit(event, String(config.oferteoDatabaseUrl || ''), live)
      cancellation.controller.signal.throwIfAborted()
      if (wantsOferteoStream(event)) return sendOferteoStream<OfferCreatorResponse, OfferCreatorPartial>(event, cancellation, async (signal, onPartial) => live
        ? createOfferWithAi(parsed.data.messages, parsed.data.draft, apiKey, model, {
          signal, onPartial: partial => onPartial(offerStreamPreview(partial, parsed.data.draft, parsed.data.messages)),
        })
        : createSampleOffer(parsed.data.messages, parsed.data.draft))
      return live
        ? await createOfferWithAi(parsed.data.messages, parsed.data.draft, apiKey, model, { signal: cancellation.controller.signal })
        : createSampleOffer(parsed.data.messages, parsed.data.draft)
    })
  } finally { cancellation.dispose() }
})
