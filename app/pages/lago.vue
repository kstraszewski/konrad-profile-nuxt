<template>
  <JobPitchPage
    :pitch="profile.lago"
    :nav-items="profile.nav.rolePitch"
    route-path="/lago"
    analytics-prefix="lago"
    cv-href="/api/cv/lago-product-engineer-growth.pdf"
    cv-label="Lago CV"
    cv-download="Konrad-Straszewski-CV-Lago-Product-Engineer-Growth.pdf"
    :job-href="profile.lago.role.href"
    job-label="Lago role"
    theme="lago"
  />
</template>

<script setup>
import { profile } from '~/data/profile'
</script>
