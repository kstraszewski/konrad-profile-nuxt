<template>
  <JobPitchPage
    :pitch="profile.posthog"
    :nav-items="profile.nav.posthog"
    route-path="/posthog"
    analytics-prefix="posthog"
    cv-href="/api/cv/posthog-pe.pdf"
    cv-label="PE CV"
    cv-download="Konrad-Straszewski-CV-PostHog-PE.pdf"
    theme="posthog"
    relationship-id="posthog-use"
  />
</template>

<script setup>
import { profile } from '~/data/profile'
</script>
