import { createError } from 'h3'

const probeStatements = [
  `EXPLAIN (COSTS OFF)
   INSERT INTO oferteo_rate_limits (key, hits, expires_at)
   VALUES ('__oferteo_storage_probe__', 1, NOW())
   ON CONFLICT (key) DO UPDATE SET hits = oferteo_rate_limits.hits + 1
   RETURNING hits`,
  'EXPLAIN (COSTS OFF) DELETE FROM oferteo_rate_limits WHERE expires_at < NOW()',
] as const

export async function probeOferteoLimitStorage(
  runProbe: (statements: readonly string[], options: { readOnly: true }) => PromiseLike<unknown>,
) {
  try {
    // Planning checks the same permissions, columns and conflict key as POST.
    // EXPLAIN without ANALYZE never executes these writes; readOnly is a second guard.
    await runProbe(probeStatements, { readOnly: true })
    return true
  } catch {
    return false
  }
}

export function createOferteoLimitStorageError() {
  return createError({
    statusCode: 503,
    statusMessage: 'Limit storage unavailable',
    message: 'Nie udało się sprawdzić limitu rozmów. Spróbuj ponownie później.',
    data: { code: 'LIMIT_STORAGE_UNAVAILABLE', retryable: true },
  })
}

export function createOferteoDemoLimitError(retryAfterSeconds: number) {
  return createError({
    statusCode: 429,
    statusMessage: 'Demo rate limited',
    message: 'Limit rozmów w demo został osiągnięty. Spróbuj ponownie później.',
    data: { code: 'DEMO_RATE_LIMITED', retryable: true, retryAfterSeconds },
  })
}
