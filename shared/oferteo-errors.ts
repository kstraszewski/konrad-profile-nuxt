export const OFERTEO_CREDITS_MESSAGE = 'Asystent jest niedostępny, ponieważ wyczerpały się środki na usługę AI. Wróć po ich uzupełnieniu. Twoja rozmowa i szkic są zachowane w tej sesji.'

export interface OferteoUiFailure {
  message: string
  retryable: boolean
  creditsExhausted: boolean
  retryAt: number
}

type ErrorRecord = Record<string, unknown>
const record = (value: unknown): ErrorRecord => value && typeof value === 'object' ? value as ErrorRecord : {}

// Read only the documented error envelope. Never render a provider body, stack,
// credentials or an arbitrary exception message in the conversation.
export function oferteoUiFailure(cause: unknown, now = Date.now()): OferteoUiFailure {
  const error = record(cause)
  const payload = record(error.data)
  const details = record(payload.data)
  const response = record(error.response)
  const sdkStatus = typeof error.message === 'string' ? error.message.match(/realtime setup: (\d{3})/)?.[1] : undefined
  const status = Number(error.statusCode || error.status || response.status || payload.statusCode || sdkStatus)
  const code = details.code || payload.code
  const creditsExhausted = status === 402 || code === 'AI_CREDITS_EXHAUSTED'
  if (creditsExhausted) return { message: OFERTEO_CREDITS_MESSAGE, retryable: false, creditsExhausted: true, retryAt: 0 }
  let retryAt = 0
  if (status === 429) {
    const headers = response.headers as { get?: (name: string) => string | null } | undefined
    const retryAfter = details.retryAfterSeconds ?? details.retryAfter ?? payload.retryAfterSeconds ?? payload.retryAfter ?? headers?.get?.('retry-after')
    const seconds = Number(retryAfter)
    retryAt = retryAfter != null && retryAfter !== '' && Number.isFinite(seconds) ? now + Math.max(1, Math.min(86400, seconds)) * 1000
      : typeof retryAfter === 'string' && Number.isFinite(Date.parse(retryAfter)) ? Math.max(now + 1000, Date.parse(retryAfter))
        : now + 60_000
  }
  const messages: Record<number, string> = {
    400: 'Sprawdź treść i długość wiadomości. Dotychczasowa rozmowa i szkic są zachowane.',
    401: 'Asystent jest chwilowo niedostępny. Dotychczasowa rozmowa i szkic są zachowane.',
    403: 'Nie udało się zweryfikować przeglądarki. Odśwież stronę i spróbuj ponownie. Najpierw skopiuj wiadomość lub szkic, które chcesz zachować.',
    413: 'Wiadomość lub rozmowa jest zbyt długa. Skróć opis albo rozpocznij nową rozmowę.',
    429: 'Osiągnięto limit rozmów. Poczekaj przed kolejną próbą. Twoja wiadomość i szkic są zachowane.',
    502: 'Asystent AI jest chwilowo niedostępny. Twoja wiadomość i szkic są zachowane — spróbuj ponownie za chwilę.',
    503: 'Usługa jest chwilowo niedostępna. Twoja wiadomość i szkic są zachowane — spróbuj ponownie za chwilę.',
  }
  const message = code === 'CATALOG_UNAVAILABLE' ? 'Katalog wykonawców jest chwilowo niedostępny. Twoja wiadomość jest zachowana — spróbuj ponownie za chwilę.'
    : code === 'BOTID_UNAVAILABLE' ? 'Weryfikacja przeglądarki jest chwilowo niedostępna. Twoja wiadomość i szkic są zachowane — spróbuj ponownie za chwilę.'
      : messages[status] || 'Nie udało się uzyskać odpowiedzi. Twoja wiadomość i szkic są zachowane — spróbuj ponownie za chwilę.'
  return { message, retryable: ![400, 401, 403, 413, 415].includes(status) && details.retryable !== false, creditsExhausted: false, retryAt }
}
