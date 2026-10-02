import { createError, defineEventHandler, setHeader } from 'h3'
import { assertOferteoAiAvailable, hasOferteoAiCredentials } from '../../utils/oferteoAi'
import { withOferteoAiRetryAfter } from '../../utils/oferteoAiAvailability'
import { OFERTEO_MODEL } from '../../utils/oferteoCore'
import { createOfferWithAi, createSampleOffer, offerCreatorRequestSchema } from '../../utils/oferteoCreator'
import { assertOferteoOrigin, enforceOferteoRateLimit, readOferteoJson } from '../../utils/oferteoGuard'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')
  assertOferteoOrigin(event)
  const parsed = offerCreatorRequestSchema.safeParse(await readOferteoJson(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Sprawdź wiadomość (maks. 1500 znaków) i szkic lub rozpocznij nową ofertę.' })
  const config = useRuntimeConfig(event)
  const apiKey = String(config.aiGatewayApiKey || '')
  const model = String(config.oferteoAiModel || OFERTEO_MODEL)
  const live = hasOferteoAiCredentials(apiKey)
  return withOferteoAiRetryAfter(event, async () => {
    if (live) await assertOferteoAiAvailable(apiKey)
    await enforceOferteoRateLimit(event, String(config.oferteoDatabaseUrl || ''), live)
    return live
      ? createOfferWithAi(parsed.data.messages, parsed.data.draft, apiKey, model)
      : createSampleOffer(parsed.data.messages, parsed.data.draft)
  })
})
