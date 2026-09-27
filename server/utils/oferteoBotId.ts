import { checkBotId } from 'botid/server'
import { createError, getRequestHeaders } from 'h3'
import type { H3Event } from 'h3'

export function isOferteoApiPath(pathname: string) {
  // Check decoded paths too so encoded route names cannot bypass the middleware.
  let path: string
  try { path = decodeURIComponent(pathname) } catch { return false }
  return path === '/api/oferto' || path.startsWith('/api/oferto/')
}

export async function assertOferteoHuman(event: H3Event, verify: typeof checkBotId = checkBotId) {
  let verdict: Awaited<ReturnType<typeof checkBotId>>
  try {
    verdict = await verify({
      advancedOptions: {
        headers: getRequestHeaders(event),
        checkLevel: 'basic',
      },
    })
  } catch {
    // A failed verification must never fall through to Neon or paid inference.
    throw createError({
      statusCode: 503,
      statusMessage: 'Weryfikacja przeglądarki jest chwilowo niedostępna. Odśwież stronę i spróbuj ponownie.',
    })
  }
  if (verdict.isBot || !verdict.isHuman) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Nie udało się potwierdzić, że korzystasz z przeglądarki. Odśwież stronę i spróbuj ponownie.',
    })
  }
}
