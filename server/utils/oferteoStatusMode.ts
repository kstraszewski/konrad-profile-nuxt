import type { OferteoStatus } from '../../shared/types/oferteo.ts'

export function resolveOferteoStatusMode(options: {
  databaseAvailable: boolean
  limitStorageAvailable: boolean
  aiAvailability: OferteoStatus['aiAvailability']
  databaseUrlConfigured: boolean
  production: boolean
}): OferteoStatus['mode'] {
  if (!options.databaseAvailable || !options.limitStorageAvailable
    || (options.aiAvailability === 'ready' && options.production && !options.databaseUrlConfigured)) {
    return 'unavailable'
  }
  return options.aiAvailability === 'ready' ? 'live' : options.aiAvailability === 'unconfigured' ? 'demo' : 'unavailable'
}
