export interface OferteoContractor {
  id: string
  name: string
  city: string
  district: string | null
  category: string
  services: string[]
  description: string
  rating: number | null
  reviewCount: number | null
  sourceUrl: string
  sourceLabel: string
  retrievedAt: string
  imageUrl: string | null
}

export interface OferteoBrief {
  service: string | null
  city: string | null
  scope: string | null
  area: string | null
  budget: string | null
  timing: string | null
}

export interface OferteoMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface OferteoOffer extends OferteoContractor {
  reason: string
}

export interface OferteoChatResponse {
  message: string
  suggestions: string[]
  brief: OferteoBrief
  offers: OferteoOffer[]
  mode: 'live' | 'demo'
  model: string
  source: 'neon' | 'snapshot'
}

export interface OferteoStatus {
  mode: 'live' | 'demo' | 'unavailable'
  aiAvailability?: 'ready' | 'unconfigured' | 'unavailable' | 'credits_exhausted'
  aiConfigured: boolean
  databaseConfigured: boolean
  model: string
  catalogCount: number
  source: 'neon' | 'snapshot'
}
