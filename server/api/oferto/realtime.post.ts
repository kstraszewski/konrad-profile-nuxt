import { createError, defineEventHandler, getQuery, setHeader } from 'h3'
import { experimental_getRealtimeToolDefinitions, tool } from 'ai'
import { z } from 'zod'
import { OFERTEO_REALTIME_MODEL } from '../../../shared/oferteo-realtime'
import { assertOferteoAiAvailable, handleOferteoAiFailure, hasOferteoAiCredentials, oferteoGateway } from '../../utils/oferteoAi'
import { withOferteoAiRetryAfter } from '../../utils/oferteoAiAvailability'
import { logOferteoAiFailure } from '../../utils/oferteoAiDiagnostics'
import { assertOferteoOrigin, enforceOferteoRateLimit, readOferteoJson } from '../../utils/oferteoGuard'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')
  assertOferteoOrigin(event)
  const mode = z.enum(['search', 'creator']).safeParse(getQuery(event).mode)
  // The SDK submits sessionConfig; it is not trusted for minting credentials.
  const body = z.object({ sessionConfig: z.record(z.string(), z.unknown()).optional() }).strict().safeParse(await readOferteoJson(event))
  if (!mode.success || !body.success) throw createError({ statusCode: 400, statusMessage: 'Nieprawidłowe ustawienia rozmowy głosowej.' })
  const config = useRuntimeConfig(event)
  const apiKey = String(config.aiGatewayApiKey || '')
  if (!hasOferteoAiCredentials(apiKey)) throw createError({ statusCode: 503, statusMessage: 'Rozmowa głosowa wymaga połączenia z AI.' })
  return withOferteoAiRetryAfter(event, async () => {
    await assertOferteoAiAvailable(apiKey)
    await enforceOferteoRateLimit(event, String(config.oferteoDatabaseUrl || ''), true)
    const tools = await experimental_getRealtimeToolDefinitions({ tools: {
      update_workspace: tool({
        description: mode.data === 'search' ? 'Wyszukaj wykonawców i pokaż karty na podstawie bieżącej transkrypcji użytkownika.' : 'Utwórz lub popraw szkic oferty na podstawie bieżącej transkrypcji użytkownika.',
        inputSchema: z.object({}).strict(),
      }),
    } })
    try {
      const token = await oferteoGateway(apiKey).experimental_realtime.getToken({ model: OFERTEO_REALTIME_MODEL, expiresAfterSeconds: 60 })
      return { ...token, tools }
    } catch (error) {
      // Never log token bodies, credentials, provider payloads or conversation text.
      logOferteoAiFailure('realtime-token', error, OFERTEO_REALTIME_MODEL, apiKey || process.env.AI_GATEWAY_API_KEY ? 'api-key' : 'oidc')
      throw handleOferteoAiFailure(apiKey, error, 'Nie udało się uruchomić rozmowy głosowej. Spróbuj ponownie lub napisz wiadomość.')
    }
  })
})
