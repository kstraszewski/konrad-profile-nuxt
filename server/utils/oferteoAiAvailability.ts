import { createError, setHeader, type H3Event } from 'h3'

export type OferteoAiAvailability = 'ready' | 'unconfigured' | 'unavailable' | 'credits_exhausted'
export type OferteoAiFailure = {
  kind: 'credits_exhausted' | 'rate_limited' | 'unavailable'
  retryAfterSeconds?: number
}

export const OFERTEO_AI_CREDITS_MESSAGE = 'Asystent jest niedostępny, ponieważ wyczerpały się środki na usługę AI. Wróć po ich uzupełnieniu. Twoja rozmowa i szkic są zachowane.'

const unavailableFailure: OferteoAiFailure = { kind: 'unavailable' }

function record(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null ? value as Record<string, unknown> : undefined
}

function retryAfterSeconds(headers: unknown, now: number): number | undefined {
  const values = record(headers)
  if (!values) return undefined
  const read = (name: string) => Object.entries(values).find(([key]) => key.toLowerCase() === name)?.[1]
  const milliseconds = read('retry-after-ms')
  if (typeof milliseconds === 'string' && milliseconds.trim()) {
    const delay = Number(milliseconds)
    if (Number.isFinite(delay) && delay >= 0) return Math.ceil(delay / 1_000)
  }
  const header = read('retry-after')
  if (typeof header !== 'string' || !header.trim()) return undefined
  const seconds = Number(header)
  if (Number.isFinite(seconds)) return seconds >= 0 ? Math.ceil(seconds) : undefined
  const deadline = Date.parse(header)
  return Number.isFinite(deadline) ? Math.max(0, Math.ceil((deadline - now) / 1_000)) : undefined
}

/** Inspect only exception chains, never prompt text or arbitrary provider payloads. */
export function classifyOferteoAiFailure(error: unknown, now = Date.now()): OferteoAiFailure {
  const visited = new Set<object>()
  const inspect = (value: unknown, depth: number): OferteoAiFailure | undefined => {
    const current = record(value)
    if (!current || depth > 12 || visited.has(current)) return undefined
    visited.add(current)
    const data = record(current.data)
    if (data?.code === 'AI_CREDITS_EXHAUSTED') return { kind: 'credits_exhausted' }
    if (data?.code === 'AI_RATE_LIMITED') {
      const delay = Number(data.retryAfterSeconds)
      return { kind: 'rate_limited', ...(Number.isFinite(delay) && delay >= 0 ? { retryAfterSeconds: Math.ceil(delay) } : {}) }
    }
    const status = Number(current.statusCode ?? current.status)
    // An upstream provider's quota is not the Vercel team's credit balance.
    // Gateway dependency errors can contain provider failures in their causes.
    if (status === 424 || current.type === 'failed_dependency') return unavailableFailure
    if (status === 429) {
      const delay = retryAfterSeconds(current.responseHeaders, now)
        ?? retryAfterSeconds(record(current.cause)?.responseHeaders, now)
      return { kind: 'rate_limited', ...(delay === undefined ? {} : { retryAfterSeconds: delay }) }
    }
    if (status === 402) {
      if (typeof current.url === 'string') {
        try {
          if (new URL(current.url).hostname !== 'ai-gateway.vercel.sh') return unavailableFailure
        } catch { return unavailableFailure }
      }
      return { kind: 'credits_exhausted' }
    }
    // RetryError exposes the final exception; earlier attempts must not override it.
    if (current.lastError !== undefined) return inspect(current.lastError, depth + 1)
    const caused = inspect(current.cause, depth + 1)
    if (caused) return caused
    if (Array.isArray(current.errors)) return inspect(current.errors.at(-1), depth + 1)
    return undefined
  }
  return inspect(error, 0) ?? unavailableFailure
}

export function createOferteoAiFailureError(failure: OferteoAiFailure, fallbackMessage = 'Asystent AI jest chwilowo niedostępny. Spróbuj ponownie. Twoja rozmowa i szkic są zachowane.') {
  const credits = failure.kind === 'credits_exhausted'
  const rate = failure.kind === 'rate_limited'
  const message = credits ? OFERTEO_AI_CREDITS_MESSAGE : rate
    ? 'Usługa AI obsługuje teraz zbyt wiele zapytań. Odczekaj chwilę i spróbuj ponownie. Twoja rozmowa i szkic są zachowane.'
    : fallbackMessage
  return createError({
    statusCode: credits ? 402 : rate ? 429 : 502,
    statusMessage: credits ? 'AI credits exhausted' : rate ? 'AI rate limited' : 'AI unavailable',
    message,
    data: {
      code: credits ? 'AI_CREDITS_EXHAUSTED' : rate ? 'AI_RATE_LIMITED' : 'AI_UNAVAILABLE',
      retryable: !credits,
      ...(rate && failure.retryAfterSeconds !== undefined ? { retryAfterSeconds: failure.retryAfterSeconds } : {}),
    },
  })
}

export function setOferteoAiRetryAfter(event: H3Event, error: unknown) {
  const data = record(record(error)?.data)
  if (data?.code === 'AI_RATE_LIMITED' && typeof data.retryAfterSeconds === 'number') {
    setHeader(event, 'Retry-After', data.retryAfterSeconds)
  }
}

export async function withOferteoAiRetryAfter<T>(event: H3Event, operation: () => Promise<T>): Promise<T> {
  try { return await operation() } catch (error) {
    setOferteoAiRetryAfter(event, error)
    throw error
  }
}

/** Accept the SDK's balance and newer availableBalance shape; never return amounts. */
export function creditsAvailability(credits: unknown): 'ready' | 'unavailable' | 'credits_exhausted' {
  const response = record(credits)
  const balance = response?.availableBalance ?? response?.balance
  if (typeof balance !== 'string' || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/iu.test(balance.trim())) return 'unavailable'
  const available = Number(balance)
  if (!Number.isFinite(available)) return 'unavailable'
  return available <= 0 ? 'credits_exhausted' : 'ready'
}

type Health = { availability: OferteoAiAvailability, failure?: OferteoAiFailure }
type CachedHealth = Health & { until: number }
const READY_TTL = 60_000
const EXHAUSTED_TTL = 60_000
const UNAVAILABLE_TTL = 15_000

/** Per-process cache shares concurrent preflight probes and remembers rejected spend. */
export function createOferteoAiHealth(now = Date.now) {
  const cached = new Map<string, CachedHealth>()
  const pending = new Map<string, Promise<Health>>()
  const remaining = (health: CachedHealth): Health => ({
    availability: health.availability,
    ...(health.failure ? { failure: {
      ...health.failure,
      ...(health.failure.kind === 'rate_limited' && health.failure.retryAfterSeconds !== undefined
        ? { retryAfterSeconds: Math.max(0, Math.ceil((health.until - now()) / 1_000)) } : {}),
    } } : {}),
  })
  const save = (key: string, health: Health, minimumUntil = 0) => {
    const ttl = health.availability === 'ready' ? READY_TTL
      : health.availability === 'credits_exhausted' ? EXHAUSTED_TTL
        : health.failure?.kind === 'rate_limited' && health.failure.retryAfterSeconds !== undefined
          ? Math.max(1_000, health.failure.retryAfterSeconds * 1_000) : UNAVAILABLE_TTL
    cached.set(key, { ...health, until: Math.max(minimumUntil, now() + ttl) })
    // This demo uses one credential; keep the cache bounded if credentials rotate.
    if (cached.size > 32) {
      const oldest = cached.keys().next().value
      if (oldest !== undefined && oldest !== key) cached.delete(oldest)
    }
    return health
  }
  const check = async (key: string, configured: boolean, readCredits: () => Promise<unknown>): Promise<Health> => {
    if (!configured) return { availability: 'unconfigured' }
    const previous = cached.get(key)
    if (previous && previous.until > now()) return remaining(previous)
    const flight = pending.get(key)
    if (flight) return flight
    const probe = (async () => {
      let health: Health
      try {
        const availability = creditsAvailability(await readCredits())
        health = { availability, ...(availability === 'credits_exhausted' ? { failure: { kind: 'credits_exhausted' as const } } : {}) }
      } catch (error) {
        const failure = classifyOferteoAiFailure(error, now())
        health = { availability: failure.kind === 'credits_exhausted' ? 'credits_exhausted' : 'unavailable', failure }
      }
      // A request can exhaust credits while this read-only probe is in flight.
      // Do not let an earlier positive probe replace that newer rejection.
      const newer = cached.get(key)
      if (newer !== previous && newer && newer.until > now()) return remaining(newer)
      return save(key, health)
    })()
    pending.set(key, probe)
    try { return await probe } finally { if (pending.get(key) === probe) pending.delete(key) }
  }
  return {
    check,
    async assertReady(key: string, configured: boolean, readCredits: () => Promise<unknown>) {
      const health = await check(key, configured, readCredits)
      if (health.availability !== 'ready') throw createOferteoAiFailureError(health.failure ?? unavailableFailure)
    },
    recordFailure(key: string, error: unknown) {
      const failure = classifyOferteoAiFailure(error, now())
      const existing = cached.get(key)
      // Concurrent requests may fail for different reasons. A later 429 must
      // preserve financial exhaustion and any longer rate-limit cooldown.
      if (failure.kind !== 'credits_exhausted' && existing?.availability === 'credits_exhausted' && existing.until > now()) {
        if (failure.kind === 'rate_limited') cached.set(key, {
          ...existing,
          until: Math.max(existing.until, now() + (failure.retryAfterSeconds === undefined ? UNAVAILABLE_TTL : Math.max(1_000, failure.retryAfterSeconds * 1_000))),
        })
        return failure
      }
      // Provider/schema errors should not turn a healthy credential off globally.
      if (failure.kind !== 'unavailable') save(key, {
        availability: failure.kind === 'credits_exhausted' ? 'credits_exhausted' : 'unavailable', failure,
      }, existing?.failure?.kind === 'rate_limited' && existing.until > now() ? existing.until : 0)
      return failure
    },
  }
}
