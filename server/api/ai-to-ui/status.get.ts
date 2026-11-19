import { defineEventHandler, setHeader } from 'h3'
import { AI_TO_UI_MODEL, isAiToUiVercelProduction, resolveAiToUiMode } from '../../utils/aiToUi'
import { AI_TO_UI_DAILY_LIMIT } from '../../utils/aiToUiDailyLimit'
import type { AiToUiStatus } from '../../../shared/types/ai-to-ui'

// Tells the page who picks the view before the first question is asked.
// It reports configuration only and never calls a model or the gateway.
export default defineEventHandler((event): AiToUiStatus => {
  setHeader(event, 'Cache-Control', 'no-store')
  const config = useRuntimeConfig(event)
  const production = isAiToUiVercelProduction()
  const { mode, missingKey } = resolveAiToUiMode({
    dev: import.meta.dev === true,
    optIn: config.aiToUiLocalAi,
    apiKey: String(config.aiGatewayApiKey || ''),
    production,
    databaseUrl: String(config.oferteoDatabaseUrl || ''),
  })
  return {
    mode,
    model: mode === 'ai' ? String(config.aiToUiModel || AI_TO_UI_MODEL) : null,
    missingKey,
    dailyLimit: production ? AI_TO_UI_DAILY_LIMIT : null,
  }
})
