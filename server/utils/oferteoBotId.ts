import { checkBotId } from 'botid/server'
import { createError } from 'h3'
import type { H3Event } from 'h3'

export function isOferteoApiPath(pathname: string) {
  // Check decoded paths too so encoded route names cannot bypass the middleware.
  let path: string
  try { path = decodeURIComponent(pathname) } catch { return false }
  return path === '/api/oferto' || path.startsWith('/api/oferto/')
}

export async function assertOferteoHuman(event: H3Event, verify: typeof checkBotId = checkBotId) {
  // The SDK defaults to simulation whenever NODE_ENV is not "production".
  // Only the local development server may use it; previews must verify for real.
  const localDevelopment = process.env.NODE_ENV === 'development'
    && process.env.VERCEL !== '1' && !process.env.VERCEL_ENV
  const headers = event.node.req.headers
  if (!localDevelopment && !headers['x-is-human']) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Nie udało się potwierdzić, że korzystasz z przeglądarki. Odśwież stronę i spróbuj ponownie.',
    })
  }
  let verdict: Awaited<ReturnType<typeof checkBotId>>
  try {
    verdict = await verify({
      developmentOptions: { isDevelopment: localDevelopment },
      advancedOptions: {
        headers,
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
  if (verdict.isBot !== false || verdict.isHuman !== true || (!localDevelopment && verdict.bypassed === true)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Nie udało się potwierdzić, że korzystasz z przeglądarki. Odśwież stronę i spróbuj ponownie.',
    })
  }
}
