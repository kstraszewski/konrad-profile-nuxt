export default defineNuxtConfig({
  compatibilityDate: '2026-04-29',
  devtools: { enabled: false },
  modules: ['@nuxtjs/mcp-toolkit', 'botid/nuxt'],
  css: ['~/assets/css/main.css'],
  mcp: {
    name: 'Konrad Profile MCP',
    route: '/mcp/server',
    browserRedirect: '/mcp',
    defaultHandlerStrategy: 'all',
    description:
      "Public read-only MCP server for recruiters who want to talk to Konrad Straszewski's CV, profile, projects, and AI/product work.",
    instructions:
      'Use this server as a read-only profile and CV source. Prefer get_profile_context for direct recruiter questions. Use search and fetch when a ChatGPT connector or research flow needs citation-shaped context. Use the konrad-cv app when the host supports MCP Apps UI and the user wants an interactive CV panel.'
  },
  runtimeConfig: {
    oferteoDatabaseUrl: process.env.NUXT_OFERTEO_DATABASE_URL || '',
    aiGatewayApiKey: process.env.AI_GATEWAY_API_KEY || '',
    oferteoAiModel: 'deepseek/deepseek-v4.1-flash',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://koonrad.dev',
      posthogPublicKey: 'phc_B4WbaRJdBKtTZgC6QQhPJN2uN8HzCfxDXE8HkjqjVuWW',
      posthogHost: 'https://eu.i.posthog.com',
      posthogDefaults: '2026-01-30'
    }
  },
  routeRules: {
    '/plane': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/neoiq': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/neoiq/ar': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/offerteo': { redirect: '/oferteo' },
    '/oferto': { redirect: '/oferteo' },
    '/oferto/demo-1': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/oferto/demo-2': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/oferto/demo': {
      headers: { 'X-Robots-Tag': 'noindex, nofollow' }
    },
    '/oferteo/demo': {
      redirect: '/oferto/demo'
    },
    '/api/oferto/**': {
      headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' }
    },
    '/oferteo': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow'
      }
    },
    '/posthog': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow'
      }
    },
    '/linear': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow'
      }
    },
    '/medusa': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow'
      }
    },
    '/n8n': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow'
      }
    },
    '/mcp/server': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow'
      }
    },
    '/mcp/server/**': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow'
      }
    }
  },
  nitro: {
    prerender: {
      routes: [
        '/api/cv/plane.pdf',
        '/api/cv/neoiq-fde-ai-manager.pdf',
        '/api/cv/oferteo-fde-ai-manager.pdf',
        '/api/cv/general.pdf',
        '/api/cv/posthog.pdf',
        '/api/cv/posthog-pe.pdf',
        '/api/cv/posthog-pm.pdf',
        '/api/cv/posthog-ai-research.pdf',
        '/api/cv/linear-fullstack-engineer.pdf',
        '/api/cv/medusa-product-engineer.pdf',
        '/api/cv/n8n-ai-engineer.pdf',
        '/api/cv/n8n-product-engineer.pdf',
        '/robots.txt',
        '/sitemap.xml'
      ]
    }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#fafaf7' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', sizes: 'any', href: '/favicon.svg?v=2' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Inter+Tight:wght@300;400;500;600&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap'
        }
      ]
    }
  }
})
