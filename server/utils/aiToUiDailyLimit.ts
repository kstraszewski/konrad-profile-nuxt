import { neon } from '@neondatabase/serverless'
import { aiToUiError } from './aiToUiRequest.ts'

export const AI_TO_UI_DAILY_LIMIT = 50
const AI_TO_UI_QUOTA_TIMEOUT_MS = 5_000

type Reservation =
  | { allowed: true, remaining: number }
  | { allowed: false, retryAfterSeconds: number }

/** Reserve one model attempt across all instances before starting inference. */
export async function reserveAiToUiDailySlot(databaseUrl: string): Promise<Reservation> {
  try {
    const sql = neon(databaseUrl, { fetchOptions: { signal: AbortSignal.timeout(AI_TO_UI_QUOTA_TIMEOUT_MS) } })
    // The shared table already has a primary key on key and an expiry index.
    // Keep the previous day's row for a grace period so a request queued at
    // midnight cannot recreate that day's quota after the Oferteo cleanup.
    const [row] = await sql`
      WITH quota_clock AS (
        SELECT statement_timestamp() AS requested_at
      ), quota_window AS (
        SELECT requested_at,
               'ai-to-ui:daily:' || to_char(requested_at AT TIME ZONE 'Europe/Warsaw', 'YYYY-MM-DD') AS key,
               (date_trunc('day', requested_at AT TIME ZONE 'Europe/Warsaw') + interval '1 day')
                 AT TIME ZONE 'Europe/Warsaw' AS reset_at
        FROM quota_clock
      ), reservation AS (
        INSERT INTO oferteo_rate_limits AS limits (key, hits, expires_at)
        SELECT key, 1, reset_at + interval '24 hours' FROM quota_window
        ON CONFLICT (key) DO UPDATE SET hits = limits.hits + 1
        WHERE limits.hits < ${AI_TO_UI_DAILY_LIMIT}
        RETURNING hits
      )
      SELECT (SELECT hits FROM reservation) AS hits,
             GREATEST(1, CEIL(EXTRACT(EPOCH FROM reset_at - requested_at)))::integer AS retry_after_seconds
      FROM quota_window
    `
    const hits = row?.hits
    const retryAfterSeconds = row?.retry_after_seconds
    if (hits === null && Number.isInteger(retryAfterSeconds) && retryAfterSeconds > 0) {
      return { allowed: false, retryAfterSeconds }
    }
    if (Number.isInteger(hits) && hits > 0 && hits <= AI_TO_UI_DAILY_LIMIT) {
      return { allowed: true, remaining: AI_TO_UI_DAILY_LIMIT - hits }
    }
    throw new Error('Invalid quota result')
  } catch {
    // A missing database, a timeout, or an invalid response must prevent spend.
    throw aiToUiError(503, 'Service Unavailable', 'AI_QUOTA_UNAVAILABLE')
  }
}
