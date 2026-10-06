export type OferteoVoiceStartupPhase = 'microphone' | 'loading' | 'connecting'

// Querying permission does not prompt, and is optional (not supported by every
// browser). Never let this diagnostic delay the click's getUserMedia request.
export async function microphonePermissionState(): Promise<PermissionState | 'unknown'> {
  try {
    if (!navigator.permissions?.query) return 'unknown'
    const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName })
    return permission.state
  } catch { return 'unknown' }
}

export class OferteoVoiceStartupError extends Error {
  readonly phase: OferteoVoiceStartupPhase
  constructor(phase: OferteoVoiceStartupPhase) {
    super(`Voice startup timed out: ${phase}`)
    this.name = 'OferteoVoiceStartupError'
    this.phase = phase
  }
}

// Microphone permission cannot be aborted by browsers. Settle the UI on time,
// and release any stream that arrives after cancellation or timeout.
export function waitForOferteoVoiceStep<T>(operation: Promise<T>, options: {
  phase: OferteoVoiceStartupPhase
  signal: AbortSignal
  timeoutMs: number
  onLateValue?: (value: T) => void
}): Promise<T> {
  return new Promise((resolve, reject) => {
    let settled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const cleanup = () => {
      if (timer) clearTimeout(timer)
      options.signal.removeEventListener('abort', abort)
    }
    const fail = (cause: unknown) => {
      if (settled) return
      settled = true
      cleanup()
      reject(cause)
    }
    const abort = () => fail(new DOMException('Voice startup cancelled', 'AbortError'))
    operation.then(value => {
      if (settled) { options.onLateValue?.(value); return }
      settled = true
      cleanup()
      resolve(value)
    }, fail)
    options.signal.addEventListener('abort', abort, { once: true })
    if (options.signal.aborted) abort()
    else timer = setTimeout(() => fail(new OferteoVoiceStartupError(options.phase)), options.timeoutMs)
  })
}
