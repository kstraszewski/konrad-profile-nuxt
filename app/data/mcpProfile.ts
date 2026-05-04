import { profile } from './profile'

export const mcpServer = {
  name: 'Konrad Profile MCP',
  endpoint: 'https://konradstraszewski.com/mcp/server',
  appTool: 'konrad-cv',
  updated: '2026-05-04'
} as const

export const profileFocusOptions = [
  'full',
  'overview',
  'cv',
  'experience',
  'ai',
  'projects',
  'posthog',
  'contact'
] as const

export type ProfileFocus = (typeof profileFocusOptions)[number]

type ProfileDocument = {
  id: string
  title: string
  url: string
  text: string
  metadata?: Record<string, string>
}

const siteUrl = 'https://konradstraszewski.com'
const absoluteUrl = (path: string) => `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`

const compactList = (items: readonly string[]) => items.join('; ')
const lines = (items: readonly string[]) => items.filter(Boolean).join('\n')

export const cvDownloads = profile.cv.downloads.map((download) => ({
  ...download,
  url: absoluteUrl(download.href)
}))

const contactLinks = [profile.links.email, profile.links.phone, profile.links.github, profile.links.linkedin].map((link) => ({
  label: link.label,
  value: link.value,
  href: link.href
}))

const posthogRoleContexts = [
  {
    id: 'posthog-product-engineer',
    title: profile.posthog.title,
    summary: profile.posthog.description,
    proof: profile.posthog.proof.rows,
    ideas: profile.posthog.ideas.items
  },
  {
    id: 'posthog-product-manager',
    title: profile.posthogPm.title,
    summary: profile.posthogPm.description,
    proof: profile.posthogPm.proof.rows,
    ideas: profile.posthogPm.ideas.items
  },
  {
    id: 'posthog-ai-research',
    title: profile.posthogAiResearch.title,
    summary: profile.posthogAiResearch.description,
    proof: profile.posthogAiResearch.proof.rows,
    ideas: profile.posthogAiResearch.ideas.items
  }
]

const allSections = {
  overview: {
    title: 'Overview',
    text: lines([
      `${profile.person.name} is an ${profile.person.role}.`,
      `${profile.person.currentRole}; based in ${profile.person.location}.`,
      profile.cv.summary,
      profile.hero.intro.mandate,
      profile.contact.copy
    ])
  },
  cv: {
    title: 'CV',
    summary: profile.cv.summary,
    highlights: profile.cv.highlights,
    downloads: cvDownloads
  },
  experience: {
    title: 'Experience',
    heading: profile.track.heading,
    roles: profile.track.experience,
    education: profile.track.education
  },
  ai: {
    title: 'AI work',
    now: profile.now.items,
    lendiPillars: profile.lendi.pillars,
    currentInterests: profile.interests.items,
    aiResearchFit: profile.posthogAiResearch.proof.rows
  },
  projects: {
    title: 'Projects',
    lendi: {
      intro: profile.lendi.intro,
      pride: profile.lendi.pride,
      phases: profile.lendi.phases
    },
    jasne: {
      intro: profile.jasne.intro,
      facts: profile.jasne.facts,
      beats: profile.jasne.beats
    },
    maf: profile.track.experience.find((item) => item.org.includes('MAF'))
  },
  stack: {
    title: 'Technology stack',
    heading: profile.stack.heading,
    technologies: profile.stack.technologies
  },
  posthog: {
    title: 'PostHog-tailored contexts',
    roles: posthogRoleContexts
  },
  contact: {
    title: 'Contact',
    availability: profile.person.availability,
    email: profile.person.email,
    phone: profile.person.phone,
    links: contactLinks
  }
} as const

const sectionIdsByFocus: Record<ProfileFocus, (keyof typeof allSections)[]> = {
  full: ['overview', 'cv', 'experience', 'projects', 'ai', 'stack', 'posthog', 'contact'],
  overview: ['overview', 'experience', 'projects', 'stack', 'contact'],
  cv: ['cv', 'experience', 'stack', 'contact'],
  experience: ['experience', 'projects', 'ai'],
  ai: ['ai', 'projects', 'stack', 'posthog'],
  projects: ['projects', 'experience', 'stack'],
  posthog: ['posthog', 'experience', 'ai', 'cv', 'contact'],
  contact: ['contact', 'cv']
}

export const normalizeProfileFocus = (focus?: string): ProfileFocus => {
  if (!focus) return 'full'
  return profileFocusOptions.includes(focus as ProfileFocus) ? (focus as ProfileFocus) : 'full'
}

export const buildProfileContext = (options: { question?: string; focus?: string } = {}) => {
  const focus = normalizeProfileFocus(options.focus)
  const sections = sectionIdsByFocus[focus].reduce<Record<string, unknown>>((acc, id) => {
    acc[id] = allSections[id]
    return acc
  }, {})

  return {
    server: mcpServer,
    query: {
      question: options.question ?? null,
      focus
    },
    person: {
      name: profile.person.name,
      role: profile.person.role,
      currentRole: profile.person.currentRole,
      location: profile.person.location,
      availability: profile.person.availability,
      openTo: profile.person.openTo,
      stackPosture: profile.person.stackPosture
    },
    positioning: {
      headline: profile.cv.headline,
      summary: profile.cv.summary,
      thesis: profile.now.heading,
      principles: profile.principles.items.map((item) => `${item.heading}: ${item.description}`)
    },
    sections,
    suggestedRecruiterQuestions: [
      "Summarize Konrad's AI leadership experience.",
      'Is Konrad a fit for an AI product or product engineering role?',
      'What has Konrad built end to end?',
      'What CV file should I download?',
      'How can I contact Konrad?'
    ]
  }
}

export const profileDocuments: ProfileDocument[] = [
  {
    id: 'overview',
    title: 'Konrad Straszewski overview',
    url: absoluteUrl('/'),
    text: allSections.overview.text,
    metadata: { section: 'overview' }
  },
  {
    id: 'cv',
    title: 'CV summary and downloads',
    url: absoluteUrl('/cv'),
    text: lines([
      profile.cv.summary,
      compactList(profile.cv.highlights),
      `Downloads: ${cvDownloads.map((download) => `${download.label} - ${download.url}`).join('; ')}`
    ]),
    metadata: { section: 'cv' }
  },
  {
    id: 'experience',
    title: 'Experience and track record',
    url: absoluteUrl('/#track'),
    text: lines([
      profile.track.heading,
      ...profile.track.experience.map((item) => `${item.year} - ${item.role}, ${item.org}: ${item.description}`)
    ]),
    metadata: { section: 'experience' }
  },
  {
    id: 'ai-leadership',
    title: 'AI leadership at Lendi',
    url: absoluteUrl('/#lendi'),
    text: lines([
      profile.lendi.intro,
      profile.lendi.pride,
      ...profile.lendi.pillars.map((pillar) => `${pillar.heading}: ${pillar.line} ${compactList(pillar.bullets)}`)
    ]),
    metadata: { section: 'ai' }
  },
  {
    id: 'jasne-ai',
    title: 'jasne.ai product build',
    url: absoluteUrl('/jasne.ai'),
    text: lines([
      profile.jasne.intro,
      ...profile.jasne.facts.map((fact) => `${fact.label}: ${fact.value}`),
      ...profile.jasne.beats.map((beat) => `${beat.heading}: ${beat.description}`)
    ]),
    metadata: { section: 'projects' }
  },
  {
    id: 'maf-retrieval',
    title: 'MAF retrieval collaboration',
    url: absoluteUrl('/#track'),
    text:
      profile.track.experience.find((item) => item.org.includes('MAF'))?.description ??
      'Collaborated on retrieval-heavy AI and vector search for operational knowledge bases.',
    metadata: { section: 'projects' }
  },
  {
    id: 'technology-stack',
    title: 'Technology stack',
    url: absoluteUrl('/#technologies'),
    text: lines([profile.stack.heading, compactList(profile.stack.technologies)]),
    metadata: { section: 'stack' }
  },
  {
    id: 'posthog-context',
    title: 'PostHog-tailored role contexts',
    url: absoluteUrl('/posthog'),
    text: lines(
      posthogRoleContexts.map((role) =>
        lines([
          role.title,
          role.summary,
          ...role.proof.map((row) => `${row.label}: ${row.heading} ${row.description}`),
          ...role.ideas.map((idea) => `${idea.label}: ${idea.description}`)
        ])
      )
    ),
    metadata: { section: 'posthog' }
  },
  {
    id: 'contact',
    title: 'Contact and links',
    url: absoluteUrl('/#contact'),
    text: lines([
      `Availability: ${profile.person.availability}`,
      `Email: ${profile.person.email}`,
      `Phone: ${profile.person.phone}`,
      ...contactLinks.map((link) => `${link.label}: ${link.href}`)
    ]),
    metadata: { section: 'contact' }
  }
]

const tokenize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter((term) => term.length > 1)

export const searchProfileDocuments = (query: string, limit = 6) => {
  const terms = tokenize(query)

  if (terms.length === 0) {
    return profileDocuments.slice(0, limit)
  }

  return profileDocuments
    .map((document) => {
      const haystack = `${document.title} ${document.text}`.toLowerCase()
      const score = terms.reduce((total, term) => {
        if (document.title.toLowerCase().includes(term)) return total + 3
        if (haystack.includes(term)) return total + 1
        return total
      }, 0)

      return { document, score }
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.document)
}

export const fetchProfileDocument = (id: string) => profileDocuments.find((document) => document.id === id)
