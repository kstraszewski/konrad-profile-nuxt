import { createHmac } from 'node:crypto'
import { createError, getHeader, getRequestURL, getRequestWebStream, setHeader } from 'h3'
import type { H3Event } from 'h3'
import { MAX_BODY_BYTES, chatRequestSchema } from './oferteoCore'
import { oferteoSql } from './oferteoDatabase'

export function assertOferteoOrigin(event: H3Event) {
  const origin = getHeader(event, 'origin')
  const expected = getRequestURL(event, { xForwardedHost: false, xForwardedProto: true }).origin
  if (!origin || origin !== expected || getHeader(event, 'sec-fetch-site') === 'cross-site') {
    throw createError({ statusCode: 403, statusMessage: 'Rozpocznij rozmowę na stronie demo.' })
  }
  if (!getHeader(event, 'content-type')?.toLowerCase().startsWith('application/json')) {
    throw createError({ statusCode: 415, statusMessage: 'Wymagany format JSON.' })
  }
}

export async function readOferteoJson(event: H3Event): Promise<unknown> {
  const declaredLength = Number(getHeader(event, 'content-length') ?? 0)
  if (declaredLength > MAX_BODY_BYTES) throw createError({ statusCode: 413, statusMessage: 'Wiadomość jest zbyt długa.' })
  const stream = getRequestWebStream(event)
  if (!stream) throw createError({ statusCode: 400, statusMessage: 'Brak wiadomości.' })
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  let timedOut = false
  const timeout = setTimeout(() => { timedOut = true; void reader.cancel().catch(() => {}) }, 5_000)
  try {
    while (true) {
      const result = await reader.read()
      if (result.done) break
      total += result.value.byteLength
      if (total > MAX_BODY_BYTES) {
        void reader.cancel().catch(() => {})
        throw createError({ statusCode: 413, statusMessage: 'Wiadomość jest zbyt długa.' })
      }
      chunks.push(result.value)
    }
  } finally {
    clearTimeout(timeout)
    reader.releaseLock()
  }
  if (timedOut) throw createError({ statusCode: 408, statusMessage: 'Przesyłanie wiadomości trwało zbyt długo.' })
  let body: unknown
  try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch {
    throw createError({ statusCode: 400, statusMessage: 'Nieprawidłowa wiadomość JSON.' })
  }
  return body
}

export async function readOferteoRequest(event: H3Event) {
  const body = await readOferteoJson(event)
  const parsed = chatRequestSchema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Sprawdź wiadomość (maks. 1500 znaków) lub rozpocznij nową rozmowę.' })
  return parsed.data
}

const demoWindows = new Map<string, { hits: number, expiresAt: number }>()

// Only a one-way, daily rotating HMAC enters Neon. No IP addresses, messages,
// contact details, prompts, or completion text are stored by this application.
export async function enforceOferteoRateLimit(event: H3Event, databaseUrl: string, live: boolean) {
  if (live && !databaseUrl && process.env.NODE_ENV === 'production') {
    throw createError({ statusCode: 503, statusMessage: 'Tryb AI wymaga skonfigurowanej bazy demo.' })
  }
  const now = Date.now()
  const day = Math.floor(now / 86_400_000)
  const slot = Math.floor(now / 900_000)
  // Vercel overwrites this header at its trusted edge. Else use the socket address.
  const ip = (process.env.VERCEL === '1' ? getHeader(event, 'x-vercel-forwarded-for') : undefined)
    ?? event.node.req.socket?.remoteAddress ?? 'local'
  const hash = createHmac('sha256', databaseUrl || 'local-sample-mode').update(`${day}:${ip}`).digest('hex')
  const windows = [
    { key: `visitor:${hash}:${slot}`, limit: 12, expiresAt: (slot + 1) * 900_000 },
    { key: `day:${hash}:${day}`, limit: 40, expiresAt: (day + 1) * 86_400_000 },
    { key: `global:${day}`, limit: 200, expiresAt: (day + 1) * 86_400_000 },
  ]
  let counts: number[]
  if (databaseUrl) {
    try {
      const sql = oferteoSql(databaseUrl)
      const rows = await sql.transaction([
        ...windows.map(window => sql`
          INSERT INTO oferteo_rate_limits (key, hits, expires_at)
          VALUES (${window.key}, 1, ${new Date(window.expiresAt).toISOString()}::timestamptz)
          ON CONFLICT (key) DO UPDATE SET hits = oferteo_rate_limits.hits + 1
          RETURNING hits
        `),
        sql`DELETE FROM oferteo_rate_limits WHERE expires_at < NOW()`,
      ])
      counts = rows.slice(0, 3).map(result => Number(result[0]?.hits ?? Infinity))
    } catch {
      throw createError({ statusCode: 503, statusMessage: 'Nie udało się sprawdzić limitu rozmów. Spróbuj ponownie później.' })
    }
  } else {
    for (const [key, value] of demoWindows) if (value.expiresAt < now) demoWindows.delete(key)
    counts = windows.map(window => {
      const hits = (demoWindows.get(window.key)?.hits ?? 0) + 1
      demoWindows.set(window.key, { hits, expiresAt: window.expiresAt })
      return hits
    })
  }
  const exceeded = windows.find((window, index) => counts[index]! > window.limit)
  if (exceeded) {
    setHeader(event, 'Retry-After', String(Math.ceil((exceeded.expiresAt - now) / 1_000)))
    throw createError({ statusCode: 429, statusMessage: 'Limit rozmów w demo został osiągnięty. Spróbuj ponownie później.' })
  }
}
