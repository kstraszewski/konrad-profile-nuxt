<template>
  <JobPitchPage
    :pitch="profile.plain"
    :nav-items="profile.nav.rolePitch"
    route-path="/plain"
    analytics-prefix="plain"
    cv-href="/api/cv/plain-ai-product-engineer.pdf"
    cv-label="Plain CV"
    cv-download="Konrad-Straszewski-CV-Plain-AI-Product-Engineer.pdf"
    :job-href="profile.plain.role.href"
    job-label="Plain role"
    theme="plain"
  />
</template>

<script setup>
import { profile } from '~/data/profile'
</script>
