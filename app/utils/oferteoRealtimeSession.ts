import { Experimental_AbstractRealtimeSession, type Experimental_RealtimeSessionOptions, type Experimental_RealtimeState } from 'ai'

// AI SDK 7 currently exports useRealtime for React only. This small Vue adapter
// uses the very same SDK session, audio capture, playback and tool-call runtime.
export class OferteoRealtimeSession extends Experimental_AbstractRealtimeSession {
  private publish: (key: keyof Experimental_RealtimeState, value: Experimental_RealtimeState[keyof Experimental_RealtimeState]) => void
  constructor(options: Experimental_RealtimeSessionOptions, publish: OferteoRealtimeSession['publish']) {
    super(options)
    this.publish = publish
  }
  protected setState<K extends keyof Experimental_RealtimeState>(key: K, value: Experimental_RealtimeState[K]) {
    this.publish(key, value)
  }
}
