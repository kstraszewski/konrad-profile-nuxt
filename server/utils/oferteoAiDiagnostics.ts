import { OFERTEO_REALTIME_MODEL } from '../../shared/oferteo-realtime.ts'

export type OferteoAiDiagnosticOperation = 'credits' | 'realtime-token'
export type OferteoAiAuthMethod = 'api-key' | 'oidc'

const errorNames = new Set([
  'Error', 'TypeError', 'AbortError', 'TimeoutError',
  'AI_APICallError', 'AI_RetryError',
  'GatewayAuthenticationError', 'GatewayFailedDependencyError',
  'GatewayForbiddenError', 'GatewayInternalServerError',
  'GatewayInvalidRequestError', 'GatewayModelNotFoundError',
  'GatewayNotFoundError', 'GatewayRateLimitError', 'GatewayResponseError',
  'GatewayTimeoutError',
])
const gatewayTypes = new Set([
  'authentication_error', 'failed_dependency', 'forbidden',
  'internal_server_error', 'invalid_request_error', 'model_not_found',
  'not_found', 'rate_limit_exceeded', 'response_error', 'timeout_error',
])

type SafeErrorDetails = {
  errorName?: string
  upstreamStatusCode?: number
  gatewayType?: string
}
export type OferteoAiDiagnostic = SafeErrorDetails & {
  operation: OferteoAiDiagnosticOperation
  authMethod?: OferteoAiAuthMethod
  model?: typeof OFERTEO_REALTIME_MODEL
}

// Exception properties may be getters. A diagnostic must not mask the failure
// being handled, and must never serialize any part of the original exception.
function read(value: unknown, key: string): unknown {
  if (!value || typeof value !== 'object') return undefined
  try { return Reflect.get(value, key) } catch { return undefined }
}
function status(value: unknown): number | undefined {
  const numeric = typeof value === 'number' ? value
    : typeof value === 'string' && /^[1-5]\d{2}$/.test(value) ? Number(value) : NaN
  return Number.isInteger(numeric) && numeric >= 100 && numeric <= 599 ? numeric : undefined
}

/** Follow only the final retry and cause chain, with a fixed depth bound. */
export function oferteoAiDiagnostic(operation: OferteoAiDiagnosticOperation, error: unknown, model?: typeof OFERTEO_REALTIME_MODEL, authMethod?: OferteoAiAuthMethod): OferteoAiDiagnostic | undefined {
  if (operation !== 'credits' && operation !== 'realtime-token') return undefined
  const visited = new Set<object>()
  const inspect = (value: unknown, depth: number): SafeErrorDetails => {
    if (!value || typeof value !== 'object' || depth > 12 || visited.has(value)) return {}
    visited.add(value)
    const lastError = read(value, 'lastError')
    if (lastError !== undefined) return inspect(lastError, depth + 1)
    const errors = read(value, 'errors')
    let count: unknown
    try { if (Array.isArray(errors)) count = read(errors, 'length') } catch { /* A revoked proxy is not an inspectable retry envelope. */ }
    if (typeof count === 'number' && count > 0) return inspect(read(errors, String(count - 1)), depth + 1)
    const name = read(value, 'name')
    const type = read(value, 'type')
    const own: SafeErrorDetails = {
      ...(typeof name === 'string' && errorNames.has(name) ? { errorName: name } : {}),
      ...(typeof type === 'string' && gatewayTypes.has(type) ? { gatewayType: type } : {}),
    }
    const upstreamStatusCode = status(read(value, 'statusCode')) ?? status(read(value, 'status'))
    if (upstreamStatusCode !== undefined) own.upstreamStatusCode = upstreamStatusCode
    return { ...own, ...inspect(read(value, 'cause'), depth + 1) }
  }
  return {
    operation,
    ...(authMethod === 'api-key' || authMethod === 'oidc' ? { authMethod } : {}),
    ...(operation === 'realtime-token' && model === OFERTEO_REALTIME_MODEL ? { model: OFERTEO_REALTIME_MODEL } : {}),
    ...inspect(error, 0),
  }
}

/** Fixed tag and allowlisted scalar fields only; no message, stack or payload. */
export function logOferteoAiFailure(operation: OferteoAiDiagnosticOperation, error: unknown, model?: typeof OFERTEO_REALTIME_MODEL, authMethod?: OferteoAiAuthMethod): void {
  try {
    const diagnostic = oferteoAiDiagnostic(operation, error, model, authMethod)
    if (diagnostic) console.error('[oferto-ai]', diagnostic)
  } catch { /* Diagnostics must not replace the original request failure. */ }
}
