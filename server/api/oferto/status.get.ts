import { defineEventHandler, setHeader } from 'h3'
import { checkOferteoAiAvailability } from '../../utils/oferteoAi'
import { OFERTEO_MODEL } from '../../utils/oferteoCore'
import { getOferteoCatalog } from '../../utils/oferteoDatabase'
import { checkOferteoLimitStorage } from '../../utils/oferteoGuard'
import { resolveOferteoStatusMode } from '../../utils/oferteoStatusMode.ts'
import type { OferteoStatus } from '../../../shared/types/oferteo'

export default defineEventHandler(async (event): Promise<OferteoStatus> => {
  setHeader(event, 'Cache-Control', 'no-store')
  const config = useRuntimeConfig(event)
  const databaseUrl = String(config.oferteoDatabaseUrl || '')
  const [{ catalog, source, databaseAvailable }, aiHealth, limitStorageAvailable] = await Promise.all([
    getOferteoCatalog(databaseUrl).then(result => ({ ...result, databaseAvailable: true })).catch(() => ({
      catalog: [], source: databaseUrl ? 'neon' as const : 'snapshot' as const, databaseAvailable: false,
    })),
    checkOferteoAiAvailability(String(config.aiGatewayApiKey || '')),
    checkOferteoLimitStorage(databaseUrl),
  ])
  const aiConfigured = aiHealth.availability === 'ready'
  const mode = resolveOferteoStatusMode({ databaseAvailable, limitStorageAvailable, aiAvailability: aiHealth.availability,
    databaseUrlConfigured: Boolean(databaseUrl), production: process.env.NODE_ENV === 'production' })
  return { mode, aiConfigured, aiAvailability: aiHealth.availability, databaseConfigured: databaseAvailable && source === 'neon', model: String(config.oferteoAiModel || OFERTEO_MODEL), catalogCount: catalog.length, source }
})
