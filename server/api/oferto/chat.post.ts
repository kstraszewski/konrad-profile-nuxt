import { defineEventHandler, setHeader } from 'h3'
import { analyzeOferteoWithAi, hasOferteoAiCredentials } from '../../utils/oferteoAi'
import { analyzeDemoConversation, buildChatResponse, OFERTEO_MODEL } from '../../utils/oferteoCore'
import { getOferteoCatalog } from '../../utils/oferteoDatabase'
import { assertOferteoOrigin, enforceOferteoRateLimit, readOferteoRequest } from '../../utils/oferteoGuard'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')
  assertOferteoOrigin(event)
  const { messages } = await readOferteoRequest(event)
  const config = useRuntimeConfig(event)
  const databaseUrl = String(config.oferteoDatabaseUrl || '')
  const apiKey = String(config.aiGatewayApiKey || '')
  const model = String(config.oferteoAiModel || OFERTEO_MODEL)
  const live = hasOferteoAiCredentials(apiKey)
  await enforceOferteoRateLimit(event, databaseUrl, live)
  const { catalog, source } = await getOferteoCatalog(databaseUrl)
  const analysis = live ? await analyzeOferteoWithAi(messages, catalog, apiKey, model) : analyzeDemoConversation(messages)
  return buildChatResponse(catalog, analysis, live ? 'live' : 'demo', source, model)
})
