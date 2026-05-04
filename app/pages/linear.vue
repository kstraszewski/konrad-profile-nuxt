<template>
  <JobPitchPage
    :pitch="profile.linear"
    :nav-items="profile.nav.rolePitch"
    route-path="/linear"
    analytics-prefix="linear"
    cv-href="/api/cv/general.pdf"
    cv-label="CV"
    cv-download="Konrad-Straszewski-CV.pdf"
    :job-href="profile.linear.role.href"
    job-label="Linear role"
    theme="linear"
  />
</template>

<script setup>
import { profile } from '~/data/profile'
</script>
