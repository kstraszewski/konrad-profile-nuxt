<template>
  <JobPitchPage
    :pitch="profile.medusa"
    :nav-items="profile.nav.rolePitch"
    route-path="/medusa"
    analytics-prefix="medusa"
    cv-href="/api/cv/medusa-product-engineer.pdf"
    cv-label="Medusa CV"
    cv-download="Konrad-Straszewski-CV-Medusa-Product-Engineer.pdf"
    :job-href="profile.medusa.role.href"
    job-label="Medusa role"
    theme="medusa"
  />
</template>

<script setup>
import { profile } from '~/data/profile'
</script>
