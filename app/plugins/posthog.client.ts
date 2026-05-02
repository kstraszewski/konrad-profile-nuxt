import posthog from 'posthog-js'
import type { ConfigDefaults } from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const posthogPublicKey = runtimeConfig.public.posthogPublicKey
  const posthogHost = runtimeConfig.public.posthogHost
  const posthogDefaults = runtimeConfig.public.posthogDefaults as ConfigDefaults

  if (!posthogPublicKey) {
    return {
      provide: {
        posthog: null
      }
    }
  }

  posthog.init(posthogPublicKey, {
    api_host: posthogHost,
    capture_exceptions: true,
    capture_pageleave: true,
    capture_pageview: false,
    defaults: posthogDefaults,
    person_profiles: 'identified_only'
  })

  const router = useRouter()
  const capturePageview = () => {
    posthog.capture('$pageview', {
      $current_url: window.location.href
    })
  }

  nuxtApp.hook('app:mounted', capturePageview)
  router.afterEach(() => {
    window.setTimeout(capturePageview, 0)
  })

  return {
    provide: {
      posthog
    }
  }
})
