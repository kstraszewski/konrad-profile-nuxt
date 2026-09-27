import { defineEventHandler, setHeader } from 'h3'
import { checkOferteoAiConfiguration, hasOferteoAiCredentials } from '../../utils/oferteoAi'
import { OFERTEO_MODEL } from '../../utils/oferteoCore'
import { getOferteoCatalog } from '../../utils/oferteoDatabase'
import type { OferteoStatus } from '../../../shared/types/oferteo'

export default defineEventHandler(async (event): Promise<OferteoStatus> => {
  setHeader(event, 'Cache-Control', 'no-store')
  const config = useRuntimeConfig(event)
  const databaseUrl = String(config.oferteoDatabaseUrl || '')
  const [{ catalog, source }, aiConfigured] = await Promise.all([
    getOferteoCatalog(databaseUrl),
    checkOferteoAiConfiguration(String(config.aiGatewayApiKey || '')),
  ])
  const mode = aiConfigured ? 'live' : hasOferteoAiCredentials(String(config.aiGatewayApiKey || '')) ? 'unavailable' : 'demo'
  return { mode, aiConfigured, databaseConfigured: source === 'neon', model: String(config.oferteoAiModel || OFERTEO_MODEL), catalogCount: catalog.length, source }
})
