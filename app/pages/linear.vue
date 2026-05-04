<template>
  <JobPitchPage
    :pitch="profile.linear"
    :nav-items="profile.nav.rolePitch"
    route-path="/linear"
    analytics-prefix="linear"
    cv-href="/api/cv/linear-fullstack-engineer.pdf"
    cv-label="Linear CV"
    cv-download="Konrad-Straszewski-CV-Linear-Fullstack-Engineer.pdf"
    :job-href="profile.linear.role.href"
    job-label="Linear role"
    theme="linear"
  />
</template>

<script setup>
import { profile } from '~/data/profile'
</script>
