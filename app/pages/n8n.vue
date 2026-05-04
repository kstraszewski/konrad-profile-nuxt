<template>
  <JobPitchPage
    :pitch="profile.n8n"
    :nav-items="profile.nav.rolePitch"
    route-path="/n8n"
    analytics-prefix="n8n"
    :cv-options="cvOptions"
    :job-links="jobLinks"
    theme="n8n"
  />
</template>

<script setup>
import { profile } from '~/data/profile'

const cvOptions = [
  {
    href: '/api/cv/n8n-ai-engineer.pdf',
    label: 'AI Engineer CV',
    download: 'Konrad-Straszewski-CV-n8n-Sr-AI-Engineer.pdf',
    action: 'download_cv_ai_engineer'
  },
  {
    href: '/api/cv/n8n-product-engineer.pdf',
    label: 'Product Engineer CV',
    download: 'Konrad-Straszewski-CV-n8n-Product-Engineer.pdf',
    action: 'download_cv_product_engineer'
  }
]

const jobLinks = [
  {
    href: profile.n8n.roles.aiEngineer.href,
    label: 'AI role',
    action: 'job_ai_engineer'
  },
  {
    href: profile.n8n.roles.productEngineer.href,
    label: 'Product role',
    action: 'job_product_engineer'
  }
]
</script>
