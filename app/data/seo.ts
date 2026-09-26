import { profile } from './profile'

export type SeoPage = {
  path: string
  title: string
  description: string
  lastmod?: string
  image?: string
  imageWidth?: number
  imageHeight?: number
  imageType?: string
  imageAlt?: string
  index?: boolean
  sitemap?: boolean
  type?: 'profile' | 'website'
  locale?: string
}

export const seoSite = {
  name: profile.person.name,
  defaultUrl: 'https://www.koonrad.dev',
  defaultImage: '/social/koonrad-typescript-v1.png',
  imageWidth: 1200,
  imageHeight: 630,
  imageType: 'image/png',
  imageAlt: 'Konrad Straszewski — AI Manager & Full-Stack TypeScript Engineer',
  locale: 'en_US',
  twitterCard: 'summary_large_image'
} as const

export const seoPages: SeoPage[] = [
  {
    path: '/',
    title: 'Konrad Straszewski | AI Manager & Full-Stack TypeScript Engineer',
    description:
      'AI Manager at Lendi and founder of jasne.ai. Full-stack TypeScript engineering, AI adoption, and products built end-to-end by Konrad Straszewski.',
    lastmod: '2026-09-26',
    type: 'profile'
  },
  {
    path: '/neoiq',
    title: 'Konrad × NeoIQ | Forward Deployed Engineer / AI Manager',
    description: 'A collaboration proposal for NeoIQ: four customer pilots across brand onboarding, bilingual evaluation, team learning and AI adoption.',
    lastmod: '2026-09-26',
    locale: 'en_US',
    index: false,
    sitemap: false
  },
  {
    path: '/neoiq/ar',
    title: 'كونراد × NeoIQ | مهندس حلول ميداني ومدير الذكاء الاصطناعي',
    description: 'مقترح تعاون مع NeoIQ: أربع تجارب عملية لتهيئة العلامات التجارية، وتقييم الجودة بالعربية والإنجليزية، وتعلّم الفريق، وتبنّي الذكاء الاصطناعي.',
    lastmod: '2026-09-26',
    locale: 'ar_AE',
    index: false,
    sitemap: false
  },
  {
    path: '/oferteo',
    title: profile.oferteo.title,
    description: profile.oferteo.description,
    lastmod: '2026-09-26',
    locale: 'pl_PL',
    index: false,
    sitemap: false
  },
  {
    path: '/jasne.ai',
    title: 'jasne.ai Case Study | Vertical AI Product by Konrad Straszewski',
    description:
      'Case study of jasne.ai, a vertical AI product built end-to-end by Konrad Straszewski across product, UX, Nuxt, Expo, Supabase/PostgreSQL, and AI SDK.',
    lastmod: '2026-04-30'
  },
  {
    path: '/cv',
    title: 'CV | Konrad Straszewski - Full-Stack TypeScript & AI Engineer',
    description:
      'Download Konrad Straszewski’s CV: full-stack TypeScript engineering, AI leadership at Lendi, PostgreSQL and Redis, and end-to-end product building at jasne.ai.',
    lastmod: '2026-09-26'
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
  },
  {
    path: '/plain',
    title: profile.plain.title,
    description: profile.plain.description,
    lastmod: '2026-05-16',
    index: false,
    sitemap: false
  },
  {
    path: '/polar',
    title: profile.polar.title,
    description: profile.polar.description,
    lastmod: '2026-05-16',
    index: false,
    sitemap: false
  },
  {
    path: '/lago',
    title: profile.lago.title,
    description: profile.lago.description,
    lastmod: '2026-05-16',
    index: false,
    sitemap: false
  }
]

export const normalizePath = (path: string) => {
  const cleanPath = path.split(/[?#]/)[0] || '/'
  return `/${cleanPath.replace(/^\/+|\/+$/g, '')}`
}

export const normalizeSiteUrl = (siteUrl?: string) => {
  try {
    const url = new URL(siteUrl?.trim() || seoSite.defaultUrl)

    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return seoSite.defaultUrl
    }

    // The apex domain redirects to www in production, including older env values.
    if (url.hostname === 'koonrad.dev' || url.hostname === 'www.koonrad.dev') {
      return seoSite.defaultUrl
    }

    return url.origin
  } catch {
    return seoSite.defaultUrl
  }
}

export const getAbsoluteUrl = (siteUrl: string | undefined, path: string) => {
  // Asset URLs may be external or include a version query, so don't normalize as routes.
  return new URL(path, `${normalizeSiteUrl(siteUrl)}/`).href
}

export const getPageSeo = (path: string): SeoPage => {
  const normalizedPath = normalizePath(path)
  return seoPages.find((page) => page.path === normalizedPath) ?? {
    path: normalizedPath,
    title: `${seoSite.name} | koonrad.dev`,
    description: 'Konrad Straszewski — full-stack TypeScript engineer, AI manager, and product builder.',
    index: false,
    sitemap: false
  }
}

export const getSitemapPages = () => seoPages.filter((page) => page.index !== false && page.sitemap !== false)

const getPersonSchema = (siteUrl: string) => ({
  '@type': 'Person',
  '@id': `${siteUrl}/#person`,
  name: profile.person.name,
  url: `${siteUrl}/`,
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
  sameAs: [profile.links.linkedin.href, profile.links.github.href],
  knowsAbout: [
    'TypeScript',
    'Full-stack engineering',
    'AI adoption',
    'Product engineering',
    'Nuxt',
    'Vue',
    'Generative UI',
    'AI-native workflows',
    'Supabase',
    'PostgreSQL',
    'Redis',
    'PostHog'
  ]
})

export const buildJsonLd = (page: SeoPage, siteUrl?: string) => {
  const url = normalizeSiteUrl(siteUrl)
  const canonicalUrl = getAbsoluteUrl(url, normalizePath(page.path))
  const imageUrl = getAbsoluteUrl(url, page.image ?? seoSite.defaultImage)
  const person = getPersonSchema(url)
  const webSite = {
    '@type': 'WebSite',
    '@id': `${url}/#website`,
    name: seoSite.name,
    alternateName: 'koonrad.dev',
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
    inLanguage: (page.locale ?? seoSite.locale).replace('_', '-'),
    primaryImageOfPage: {
      '@type': 'ImageObject',
      '@id': `${canonicalUrl}#primaryimage`,
      url: imageUrl,
      contentUrl: imageUrl,
      width: page.imageWidth ?? seoSite.imageWidth,
      height: page.imageHeight ?? seoSite.imageHeight,
      encodingFormat: page.imageType ?? seoSite.imageType,
      caption: page.imageAlt ?? seoSite.imageAlt
    },
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
