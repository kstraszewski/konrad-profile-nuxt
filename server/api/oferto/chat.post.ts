import { defineEventHandler, setHeader } from 'h3'
import { analyzeOferteoWithAi, assertOferteoAiAvailable, hasOferteoAiCredentials } from '../../utils/oferteoAi'
import { withOferteoAiRetryAfter } from '../../utils/oferteoAiAvailability'
import { analyzeDemoConversation, buildChatResponse, OFERTEO_MODEL } from '../../utils/oferteoCore'
import { getOferteoCatalog } from '../../utils/oferteoDatabase'
import { assertOferteoOrigin, enforceOferteoRateLimit, readOferteoRequest } from '../../utils/oferteoGuard'
import { chatStreamPreview, oferteoRequestCancellation, sendOferteoStream, wantsOferteoStream } from '../../utils/oferteoStream'
import type { OferteoChatPartial } from '../../../shared/types/oferteo-stream'
import type { OferteoChatResponse } from '../../../shared/types/oferteo'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')
  assertOferteoOrigin(event)
  const { messages } = await readOferteoRequest(event)
  const config = useRuntimeConfig(event)
  const databaseUrl = String(config.oferteoDatabaseUrl || '')
  const apiKey = String(config.aiGatewayApiKey || '')
  const model = String(config.oferteoAiModel || OFERTEO_MODEL)
  const live = hasOferteoAiCredentials(apiKey)
  const cancellation = oferteoRequestCancellation(event)
  try {
    return await withOferteoAiRetryAfter(event, async () => {
      if (live) await assertOferteoAiAvailable(apiKey)
      await enforceOferteoRateLimit(event, databaseUrl, live)
      const { catalog, source } = await getOferteoCatalog(databaseUrl)
      cancellation.controller.signal.throwIfAborted()
      if (wantsOferteoStream(event)) return sendOferteoStream<OferteoChatResponse, OferteoChatPartial>(event, cancellation, async (signal, onPartial) => {
        const analysis = live ? await analyzeOferteoWithAi(messages, catalog, apiKey, model, {
          signal, onPartial: partial => onPartial(chatStreamPreview(partial, catalog, messages)),
        }) : analyzeDemoConversation(messages)
        return buildChatResponse(catalog, analysis, live ? 'live' : 'demo', source, model)
      })
      const analysis = live ? await analyzeOferteoWithAi(messages, catalog, apiKey, model, { signal: cancellation.controller.signal }) : analyzeDemoConversation(messages)
      return buildChatResponse(catalog, analysis, live ? 'live' : 'demo', source, model)
    })
  } finally { cancellation.dispose() }
})
