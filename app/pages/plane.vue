<template>
  <JobPitchPage
    :pitch="profile.plane"
    :nav-items="navItems"
    route-path="/plane"
    analytics-prefix="plane"
    cv-href="/api/cv/plane.pdf"
    cv-label="Plane CV"
    cv-download="Konrad Straszewski CV.pdf"
    mcp-label="Connect your AI to my CV"
    relationship-id="why-plane"
    theme="plane"
  />
</template>

<script setup>
import { profile } from '~/data/profile'

const navItems = [
  { label: 'Why Plane', href: '#why-plane' },
  { label: 'Fit', href: '#fit' },
  { label: 'Work', href: '#proof' },
  { label: 'Ideas', href: '#ideas' },
  { label: 'Contact', href: '#contact' }
]
</script>
