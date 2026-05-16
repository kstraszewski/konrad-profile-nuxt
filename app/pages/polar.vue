<template>
  <JobPitchPage
    :pitch="profile.polar"
    :nav-items="profile.nav.rolePitch"
    route-path="/polar"
    analytics-prefix="polar"
    cv-href="/api/cv/polar-senior-product-engineer.pdf"
    cv-label="Polar CV"
    cv-download="Konrad-Straszewski-CV-Polar-Senior-Product-Engineer.pdf"
    :job-href="profile.polar.role.href"
    job-label="Polar role"
    theme="linear"
  />
</template>

<script setup>
import { profile } from '~/data/profile'
</script>
