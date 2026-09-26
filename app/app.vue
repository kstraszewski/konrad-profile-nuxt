<script setup>
useHead({
  meta: [{ name: 'application-name', content: 'koonrad.dev' }],
  link: [
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' }
  ]
})
</script>

<template>
  <NuxtPage />
</template>
