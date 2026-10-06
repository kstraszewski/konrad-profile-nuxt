import { z } from 'zod'
import type { OferteoBrief, OferteoChatResponse, OferteoContractor, OferteoMessage, OferteoOffer } from '../../shared/types/oferteo.ts'

export const OFERTEO_MODEL = 'deepseek/deepseek-v4.1-flash'
export const MAX_BODY_BYTES = 24_000
export const MAX_CONVERSATION_CHARACTERS = 9_000

export const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().trim().min(1).max(1_500),
  }).strict()).min(1).max(16),
}).strict().superRefine(({ messages }, context) => {
  if (messages[0]?.role !== 'user' || messages.at(-1)?.role !== 'user') {
    context.addIssue({ code: 'custom', message: 'Rozmowa musi zaczynać i kończyć się wiadomością użytkownika.' })
  }
  if (messages.some((message, index) => index > 0 && message.role === messages[index - 1]?.role)) {
    context.addIssue({ code: 'custom', message: 'Wiadomości użytkownika i asystenta muszą występować naprzemiennie.' })
  }
  if (messages.reduce((total, message) => total + message.content.length, 0) > MAX_CONVERSATION_CHARACTERS) {
    context.addIssue({ code: 'custom', message: 'Ta rozmowa jest zbyt długa. Rozpocznij nowe zapytanie.' })
  }
})

const briefField = z.string().max(180).nullable()
export const analysisSchema = z.object({
  message: z.string().min(1).max(1_000),
  brief: z.object({ service: briefField, city: briefField, scope: briefField, area: briefField, budget: briefField, timing: briefField }),
  intent: z.enum(['search', 'price', 'quote_checklist', 'availability', 'compare', 'off_topic']),
  contractorIds: z.array(z.string().max(100)).max(3),
})
export type OferteoAnalysis = Omit<z.infer<typeof analysisSchema>, 'message'> & { message?: string }

export function normalizePolish(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll('ł', 'l')
}

export function emptyBrief(): OferteoBrief {
  return { service: null, city: null, scope: null, area: null, budget: null, timing: null }
}

// This deliberately limited parser is used only in the visibly labelled sample mode.
// It never runs as a fallback after a failed live AI request.
export function analyzeDemoConversation(messages: OferteoMessage[]): OferteoAnalysis {
  const brief = emptyBrief()
  const userText = messages.filter(message => message.role === 'user').map(message => message.content).join('\n')
  const text = normalizePolish(userText)
  const latest = normalizePolish(messages.at(-1)?.content ?? '')
  if (/lazien|prysznic|wanna|wanny|glazur|plytk/.test(text)) brief.service = 'Remont łazienki'
  if (/warszaw|mokotow|wilanow|ursynow|bemowo|bielan|zoliborz|ochot|bialolek|wawer|wlochy|rembertow|wesola|targowek|srodmiesc/.test(text)) brief.city = 'Warszawa'
  // Respect later city corrections instead of retaining the first supported city.
  for (const message of messages.filter(message => message.role === 'user')) {
    const normalized = normalizePolish(message.content)
    const cities = [...normalized.matchAll(/warszaw\w*|krakow\w*|wroclaw\w*|poznan\w*|gdansk\w*|lodz\w*|katowic\w*|lublin\w*|szczecin\w*|gdyni\w*/g)]
    const city = cities.at(-1)?.[0]
    if (city) brief.city = city.startsWith('warszaw') ? 'Warszawa' : city.charAt(0).toUpperCase() + city.slice(1)
  }
  if (/kompleks|generaln|calosci|od zera|wszystk/.test(text)) brief.scope = 'Kompleksowy remont łazienki'
  else if (/wanna|wanny/.test(text) && /prysznic/.test(text)) brief.scope = 'Wymiana wanny na prysznic'
  else if (/plytk|glazur/.test(text)) brief.scope = 'Układanie płytek'
  else if (/hydraul|instalacj/.test(text)) brief.scope = 'Prace instalacyjne'
  const area = userText.match(/\b(\d{1,3}(?:[,.]\d)?)\s*(?:m2|m²|metr\w*)/i)
  if (area) brief.area = `${area[1]} m²`
  const budget = userText.match(/\b(?:do\s+)?\d[\d\s]*(?:[–-]\s*\d[\d\s]*)?\s*(?:tys\.?\s*(?:zł)?|zł|PLN)/i)
  if (budget) brief.budget = budget[0].trim()
  const timing = userText.match(/(?:w ciągu|za)\s+\d+\s+(?:tygodni\w*|miesi[\w\p{L}]*|dni)|jak najszybciej|w przyszłym miesiącu|w październiku|w listopadzie|w grudniu|nie spieszy mi się/iu)
  if (timing) brief.timing = timing[0]
  const intent = /co.*(?:wycen|ofert)|wycen.*zawier|rozpis.*wycen/.test(latest) ? 'quote_checklist'
    : /tani|tansz|cen|koszt|wycen/.test(latest) ? 'price' : /dostepn|woln.*termin|kiedy.*zacz/.test(latest) ? 'availability' : /porown/.test(latest) ? 'compare' : 'search'
  return { brief, intent, contractorIds: [] }
}

export function eligibleContractors(catalog: OferteoContractor[], brief: OferteoBrief) {
  if (!brief.service || !brief.city || !brief.scope) return []
  if (!/lazien|bathroom|glazur|plytk|prysznic|wanna/.test(normalizePolish(brief.service))) return []
  const city = normalizePolish(brief.city)
  if (!/^warszawa(?:\s|,|$)/.test(city)) return []
  return catalog.filter(contractor => normalizePolish(contractor.city) === 'warszawa' && contractor.category === 'bathroom-renovation')
}

function scopeScore(contractor: OferteoContractor, brief: OferteoBrief) {
  const requested = normalizePolish(`${brief.scope ?? ''} ${brief.service ?? ''}`)
  const declared = normalizePolish(contractor.services.join(' '))
  return ['lazien', 'plytk', 'glazur', 'hydraul', 'instalac', 'kompleks', 'malow', 'prysznic']
    .reduce((score, keyword) => score + Number(requested.includes(keyword) && declared.includes(keyword)), 0)
}

export function groundOffers(catalog: OferteoContractor[], analysis: OferteoAnalysis): OferteoOffer[] {
  const eligible = eligibleContractors(catalog, analysis.brief)
  const validIds = [...new Set(analysis.contractorIds)].filter(id => eligible.some(contractor => contractor.id === id))
  const ranked = [...eligible].sort((left, right) => scopeScore(right, analysis.brief) - scopeScore(left, analysis.brief)
    || (right.reviewCount ?? 0) - (left.reviewCount ?? 0) || left.id.localeCompare(right.id))
  const selected = [...validIds.map(id => eligible.find(contractor => contractor.id === id)!), ...ranked.filter(contractor => !validIds.includes(contractor.id))].slice(0, 3)
  return selected.map(contractor => {
    const requested = normalizePolish(`${analysis.brief.scope ?? ''} ${analysis.brief.service ?? ''}`)
    const keywords = ['lazien', 'plytk', 'glazur', 'hydraul', 'instalac', 'kompleks', 'malow', 'prysznic']
    const relevantServices = [...contractor.services].sort((left, right) => {
      const score = (service: string) => keywords.reduce((sum, keyword) => sum + Number(requested.includes(keyword) && normalizePolish(service).includes(keyword)), 0)
      return score(right) - score(left)
    }).slice(0, 3)
    const specialNeeds = /senior|niepelnospraw|bezprog|bez barier|uchwyt|walk.in/.test(requested)
    return {
      ...contractor,
      reason: `Profil z lokalizacją ${contractor.city}. Deklarowane usługi: ${relevantServices.join(', ')}. ${specialNeeds ? 'Profil nie potwierdza adaptacji dla osób z ograniczoną mobilnością — zapytaj o doświadczenie i rozwiązania bez barier.' : 'Zakres, wycenę i termin potwierdzisz bezpośrednio z wykonawcą.'}`,
    }
  })
}

// Source facts stay in server-rendered cards. Model prose is only guidance about
// the user's project; discard obvious source claims, links and invented amounts.
export function safeProjectGuidance(message: string | undefined, catalog: OferteoContractor[], brief: OferteoBrief) {
  if (!message?.trim()) return null
  const normalized = normalizePolish(message)
  if (catalog.some(contractor => normalized.includes(normalizePolish(contractor.name)))) return null
  if (/https?:|www\.|\b[\w.-]+@[\w.-]+\.[a-z]{2,}|\b\d[.,]\d\s*(?:\/\s*5|gwiaz)|\b\d+\s+opini|gwarant|najlepsz|najtansz|\bfirm\w*\s+(?:ma|sa|jest|oferuj|posiada|specjaliz|zapewni)|\bwykonawc\w*\s+(?:ma|sa|jest|oferuj|posiada|specjaliz|zapewni|zacznie)/.test(normalized)) return null
  const userNumbers = new Set(Object.values(brief).join(' ').match(/\d+(?:[.,]\d+)?/g) ?? [])
  const responseNumbers = message.match(/\d+(?:[.,]\d+)?/g) ?? []
  if (responseNumbers.some(value => !userNumbers.has(value))) return null
  return message.trim()
}

export function buildChatResponse(catalog: OferteoContractor[], analysis: OferteoAnalysis, mode: 'live' | 'demo', source: 'neon' | 'snapshot', model = OFERTEO_MODEL): OferteoChatResponse {
  const { brief, intent } = analysis
  let message: string
  let suggestions: string[]
  let offers = groundOffers(catalog, analysis)
  if (intent === 'off_topic') {
    message = 'Pomogę Ci znaleźć wykonawcę remontu łazienki. Opisz, co chcesz zmienić i w jakiej miejscowości.'
    suggestions = ['Chcę wyremontować łazienkę w Warszawie', 'Wymiana wanny na prysznic w Warszawie']
    offers = []
  } else if (!brief.service) {
    message = 'Opowiedz, co chcesz zrobić. W tym demo mogę dopasować wykonawców remontu łazienki w Warszawie.'
    suggestions = ['Chcę wyremontować łazienkę', 'Chcę wymienić wannę na prysznic']
    offers = []
  } else if (!/lazien|bathroom|glazur|plytk|prysznic|wanna/.test(normalizePolish(brief.service))) {
    message = 'Ten katalog obejmuje remonty łazienek w Warszawie. Nie mam w nim danych do Twojego zlecenia. Możesz przetestować dopasowanie dla łazienki.'
    suggestions = ['Kompleksowy remont łazienki w Warszawie']
    offers = []
  } else if (!brief.city) {
    message = 'Jasne, pomogę Ci znaleźć wykonawcę. W jakiej miejscowości planujesz prace? Katalog demonstracyjny obejmuje Warszawę.'
    suggestions = ['Warszawa, Mokotów', 'Warszawa, Wola', 'Warszawa, Ursynów']
  } else if (!/^warszawa(?:\s|,|$)/.test(normalizePolish(brief.city))) {
    message = 'W demonstracyjnym katalogu mam profile wykonawców z Warszawy. Nie mogę potwierdzić, że obsługują Twoją miejscowość, więc nie pokażę ich jako dopasowania.'
    suggestions = ['Jednak szukam w Warszawie']
    offers = []
  } else if (!brief.scope) {
    message = 'Warszawa — zapisane. Jaki zakres prac planujesz: pełny remont, wymianę wanny na prysznic czy same płytki?'
    suggestions = ['Kompleksowy remont łazienki', 'Wymiana wanny na prysznic', 'Tylko układanie płytek']
  } else if (intent === 'quote_checklist') {
    message = 'Poproś o osobne pozycje dla demontażu i wywozu, przygotowania podłoża i hydroizolacji, instalacji, układania płytek oraz montażu wyposażenia. Niech wycena rozdziela robociznę i materiały oraz określa, co jest poza zakresem. Uzgodnij też harmonogram, zasady płatności i odbioru prac.'
    suggestions = ['Porównaj wykonawców', 'Jak sprawdzić dostępność?']
  } else if (intent === 'price') {
    message = 'W publicznych profilach nie mam wiarygodnych wycen Twojego remontu. Poproś wykonawców z kart o wycenę tego samego zakresu, z osobno rozpisaną robocizną i materiałami.'
    suggestions = ['Co powinno znaleźć się w wycenie?', 'Mam budżet do 30 tys. zł', 'Porównaj wykonawców']
  } else if (intent === 'availability') {
    message = 'Publiczne profile nie zawierają aktualnego kalendarza. Otwórz profil z wybranej karty i zapytaj o termin dla Twojego zakresu prac.'
    suggestions = ['Chcę zacząć w ciągu 2 miesięcy', 'Porównaj wykonawców']
  } else if (!offers.length) {
    message = 'Nie znalazłem potwierdzonych profili pasujących do tego zakresu w katalogu demo. Doprecyzuj usługę lub rozpocznij nowe zapytanie.'
    suggestions = ['Kompleksowy remont łazienki w Warszawie']
  } else {
    message = intent === 'compare'
      ? 'Na kartach porównasz deklarowane usługi i liczbę opinii. Zapytaj wybrane firmy o realizacje podobne do Twojego remontu oraz szczegółowy zakres wyceny.'
      : `Wybrałem ${offers.length} profile z Warszawy pasujące zakresem usług do remontu łazienki. Zerknij na dopasowanych wykonawców.`
    suggestions = !brief.area ? ['Łazienka ma 6 m²', 'Porównaj wykonawców', 'Jak sprawdzić dostępność?']
      : !brief.budget ? ['Mam budżet do 30 tys. zł', 'Porównaj wykonawców', 'Jak sprawdzić dostępność?']
        : ['Porównaj wykonawców', 'Jak sprawdzić dostępność?', 'Co powinno znaleźć się w wycenie?']
  }
  const guidance = mode === 'live' && (intent === 'search' || intent === 'compare' || intent === 'quote_checklist')
    ? safeProjectGuidance(analysis.message, catalog, brief) : null
  const supported = brief.service && /lazien|bathroom|glazur|plytk|prysznic|wanna/.test(normalizePolish(brief.service))
    && (!brief.city || /^warszawa(?:\s|,|$)/.test(normalizePolish(brief.city)))
  if (guidance && supported) {
    // Cards and their source caveats are rendered in the contractor panel.
    // Keep the conversational reply intact instead of appending the same notice.
    message = guidance
  }
  return { message, suggestions, brief, offers, mode, model, source }
}
