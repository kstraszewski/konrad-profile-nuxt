export interface OfferDraft {
  title: string
  company: string | null
  service: string | null
  location: string | null
  scope: string[]
  description: string
  price: string | null
  timing: string | null
  conditions: string[]
  nextStep: string | null
}

export interface OfferCreatorResponse {
  message: string
  draft: OfferDraft
  suggestions: string[]
  mode: 'live' | 'demo'
  model: string
  ready: boolean
  changes: string[]
}

export function emptyOfferDraft(): OfferDraft {
  return { title: '', company: null, service: null, location: null, scope: [], description: '', price: null, timing: null, conditions: [], nextStep: null }
}
