export default defineNuxtConfig({
  compatibilityDate: '2026-04-29',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://konradstraszewski.com',
      posthogPublicKey: 'phc_B4WbaRJdBKtTZgC6QQhPJN2uN8HzCfxDXE8HkjqjVuWW',
      posthogHost: 'https://eu.i.posthog.com',
      posthogDefaults: '2026-01-30'
    }
  },
  routeRules: {
    '/posthog': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow'
      }
    }
  },
  nitro: {
    prerender: {
      routes: [
        '/api/cv/general.pdf',
        '/api/cv/posthog.pdf',
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
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
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
