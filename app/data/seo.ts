import { profile } from './profile'

export type SeoPage = {
  path: string
  title: string
  description: string
  lastmod: string
  image?: string
  index?: boolean
  sitemap?: boolean
  type?: 'profile' | 'website'
}

export const seoSite = {
  name: profile.person.name,
  defaultUrl: 'https://konradstraszewski.com',
  defaultImage: '/uploads/pasted-1777461139852-0.png',
  locale: 'en_US',
  twitterCard: 'summary_large_image'
} as const

export const seoPages: SeoPage[] = [
  {
    path: '/',
    title: 'Konrad Straszewski | AI Manager, Product Builder & Nuxt/Vue Engineer',
    description:
      'AI Manager at Lendi and founder of jasne.ai. Konrad Straszewski leads AI adoption, Nuxt/Vue product engineering, and AI-native workflows.',
    lastmod: '2026-04-30',
    type: 'profile'
  },
  {
    path: '/jasne.ai',
    title: 'jasne.ai Case Study | Vertical AI Product by Konrad Straszewski',
    description:
      'Case study of jasne.ai, a vertical AI product built end-to-end by Konrad Straszewski across product, UX, Nuxt, Expo, Supabase, and AI SDK.',
    lastmod: '2026-04-30'
  },
  {
    path: '/cv',
    title: 'CV | Konrad Straszewski - AI Manager & Product Engineer',
    description:
      'Download CV files for Konrad Straszewski: AI Manager, product engineer, Nuxt/Vue frontend lead, jasne.ai founder, and AI adoption lead.',
    lastmod: '2026-04-30'
  },
  {
    path: '/mcp',
    title: 'MCP Server | Talk to Konrad Straszewski CV',
    description:
      'Connect a public read-only MCP server for Konrad Straszewski and ask AI clients about his CV, AI leadership, product engineering, jasne.ai, Lendi, and fit for roles.',
    lastmod: '2026-05-04'
  },
  {
    path: '/posthog',
    title: profile.posthog.title,
    description: profile.posthog.description,
    lastmod: '2026-04-30',
    index: false,
    sitemap: false
  },
  {
    path: '/linear',
    title: profile.linear.title,
    description: profile.linear.description,
    lastmod: '2026-05-04',
    index: false,
    sitemap: false
  },
  {
    path: '/medusa',
    title: profile.medusa.title,
    description: profile.medusa.description,
    lastmod: '2026-05-04',
    index: false,
    sitemap: false
  },
  {
    path: '/n8n',
    title: profile.n8n.title,
    description: profile.n8n.description,
    lastmod: '2026-05-04',
    index: false,
    sitemap: false
  }
]

export const normalizePath = (path: string) => {
  const cleanPath = path.split(/[?#]/)[0] || '/'

  if (cleanPath !== '/' && cleanPath.endsWith('/')) {
    return cleanPath.slice(0, -1)
  }

  return cleanPath
}

export const normalizeSiteUrl = (siteUrl?: string) => {
  const url = siteUrl || seoSite.defaultUrl
  return url.replace(/\/+$/, '')
}

export const getAbsoluteUrl = (siteUrl: string | undefined, path: string) => {
  const normalizedPath = normalizePath(path)
  return `${normalizeSiteUrl(siteUrl)}${normalizedPath === '/' ? '/' : normalizedPath}`
}

export const getPageSeo = (path: string) => {
  const normalizedPath = normalizePath(path)
  return seoPages.find((page) => page.path === normalizedPath) ?? seoPages[0]
}

export const getSitemapPages = () => seoPages.filter((page) => page.index !== false && page.sitemap !== false)

const getPersonSchema = (siteUrl: string) => ({
  '@type': 'Person',
  '@id': `${siteUrl}/#person`,
  name: profile.person.name,
  url: `${siteUrl}/`,
  image: getAbsoluteUrl(siteUrl, seoSite.defaultImage),
  jobTitle: profile.person.role,
  email: profile.person.email,
  telephone: profile.person.phone,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Szczecin',
    addressCountry: 'PL'
  },
  worksFor: {
    '@type': 'Organization',
    name: 'Lendi',
    url: profile.links.lendi.href
  },
  sameAs: [profile.links.linkedin.href, profile.links.github.href, profile.links.lendi.href, 'https://jasne.ai'],
  knowsAbout: [
    'AI adoption',
    'Product engineering',
    'Nuxt',
    'Vue',
    'Generative UI',
    'AI-native workflows',
    'Supabase',
    'PostHog'
  ]
})

export const buildJsonLd = (page: SeoPage, siteUrl?: string) => {
  const url = normalizeSiteUrl(siteUrl)
  const canonicalUrl = getAbsoluteUrl(url, page.path)
  const person = getPersonSchema(url)
  const webSite = {
    '@type': 'WebSite',
    '@id': `${url}/#website`,
    name: seoSite.name,
    url: `${url}/`,
    publisher: {
      '@id': `${url}/#person`
    }
  }

  const webPage = {
    '@type': page.type === 'profile' ? 'ProfilePage' : 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: page.title,
    description: page.description,
    isPartOf: {
      '@id': `${url}/#website`
    },
    about: {
      '@id': `${url}/#person`
    },
    mainEntity: page.type === 'profile' ? { '@id': `${url}/#person` } : undefined
  }

  const graph: Record<string, unknown>[] = [webSite, person, webPage]

  if (page.path === '/jasne.ai') {
    graph.push({
      '@type': 'SoftwareApplication',
      '@id': `${canonicalUrl}#software`,
      name: 'jasne.ai',
      url: 'https://jasne.ai',
      applicationCategory: 'BusinessApplication',
      creator: {
        '@id': `${url}/#person`
      }
    })
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  }
}
