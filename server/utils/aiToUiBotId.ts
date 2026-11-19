import { isError, type H3Event } from 'h3'
import { aiToUiError } from './aiToUiRequest.ts'
import { assertOferteoHuman } from './oferteoBotId.ts'

export async function assertAiToUiHuman(event: H3Event) {
  try {
    await assertOferteoHuman(event)
  } catch (error) {
    if (isError(error) && error.statusCode === 403) {
      throw aiToUiError(403, 'Forbidden', 'AI_BOT_BLOCKED')
    }
    throw aiToUiError(503, 'Service Unavailable', 'AI_BOT_CHECK_UNAVAILABLE')
  }
}
