import type posthog from 'posthog-js'

export const usePostHog = () => {
  if (import.meta.server) {
    return null
  }

  return useNuxtApp().$posthog as typeof posthog | null
}
