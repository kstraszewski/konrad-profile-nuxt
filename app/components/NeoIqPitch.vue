<template>
  <main class="neoiq-page" :class="{ 'is-arabic': isArabic }" :dir="isArabic ? 'rtl' : 'ltr'">
    <a class="neo-skip" href="#neo-main">{{ copy.skip }}</a>
    <header class="neo-header">
      <div class="neo-width neo-header-inner">
        <NuxtLink class="neo-person" to="/" :aria-label="copy.home"><span class="neo-monogram" dir="ltr">ks.</span><span>{{ copy.author }}</span></NuxtLink>
        <nav class="neo-nav" :aria-label="copy.navigation"><a href="#note">{{ copy.nav[0] }}</a><a href="#experience">{{ copy.nav[1] }}</a><a href="#contact">{{ copy.nav[2] }}</a></nav>
        <nav class="neo-language" :aria-label="copy.language" dir="ltr">
          <NuxtLink to="/neoiq" lang="en" :aria-current="!isArabic ? 'page' : undefined">EN</NuxtLink><span aria-hidden="true">/</span><NuxtLink to="/neoiq/ar" lang="ar" :aria-current="isArabic ? 'page' : undefined">العربية</NuxtLink>
        </nav>
      </div>
    </header>

    <section id="neo-main" class="neo-hero neo-width">
      <div class="neo-collaboration"><span>{{ copy.kicker }}</span><span class="neo-wordmark" dir="ltr">Neo<span>I</span><b>Q</b></span></div>
      <h1>{{ copy.hero[0] }}<br><em>{{ copy.hero[1] }}</em></h1>
      <p class="neo-hero-intro">{{ copy.intro }}</p>
      <div class="neo-hero-actions"><a class="neo-button neo-button-primary" href="#note" @click="track('read_note')">{{ copy.explore }}<span aria-hidden="true">↓</span></a><a class="neo-text-link" :href="cvHref" :download="cvFilename" @click="track('download_cv')">{{ copy.cv }}<span aria-hidden="true">↗</span></a></div>
      <p class="neo-byline"><strong>{{ copy.author }}</strong><span aria-hidden="true">·</span><span>{{ copy.role }}</span></p>
      <div class="neo-familiar"><span class="neo-familiar-mark" aria-hidden="true">↳</span><strong>{{ copy.familiarLabel }}</strong><span>{{ copy.familiarDetail }}</span></div>
    </section>

    <section id="note" class="neo-note neo-width">
      <div class="neo-note-intro"><p class="neo-eyebrow">{{ copy.noteEyebrow }}</p><h2>{{ copy.noteHeading[0] }}<br><em>{{ copy.noteHeading[1] }}</em></h2><p>{{ copy.noteIntro }}</p></div>
      <article class="neo-letter" :aria-label="copy.noteGreeting">
        <span class="neo-letter-mark" aria-hidden="true"><bdi dir="ltr">K.</bdi></span>
        <h3>{{ copy.noteGreeting }}</h3>
        <p v-for="paragraph in copy.noteParagraphs" :key="paragraph">{{ paragraph }}</p>
        <div class="neo-signoff"><span>{{ copy.noteSignoff }}</span><strong>{{ copy.noteSignature }}</strong></div>
        <p class="neo-postscript">{{ copy.notePostscript }}</p>
      </article>
    </section>

    <section id="experience" class="neo-experience">
      <div class="neo-width"><div class="neo-section-heading"><div><p class="neo-eyebrow">{{ copy.proofEyebrow }}</p><h2>{{ copy.proofHeading[0] }}<br><em>{{ copy.proofHeading[1] }}</em></h2></div><p>{{ copy.proofIntro }}</p></div>
        <div class="neo-proof-grid"><article v-for="(item, index) in copy.proof" :key="item.label"><span class="neo-proof-index" dir="ltr">0{{ index + 1 }}</span><p class="neo-proof-label">{{ item.label }}</p><h3>{{ item.title }}</h3><p class="neo-proof-text">{{ item.text }}</p><NuxtLink v-if="index === 1" class="neo-text-link" to="/jasne.ai">{{ copy.caseStudy }} <span aria-hidden="true">↗</span></NuxtLink></article></div>
        <div class="neo-toolkit"><div><span>{{ copy.toolsLabel }}</span><p dir="ltr">TypeScript <i>·</i> Vue / Nuxt <i>·</i> AI SDK <i>·</i> PostgreSQL <i>·</i> MCP <i>·</i> PostHog</p></div><NuxtLink class="neo-text-link" to="/">{{ copy.fullProfile }}<span aria-hidden="true">↗</span></NuxtLink></div>
      </div>
    </section>

    <section id="contact" class="neo-contact neo-width">
      <div class="neo-contact-card"><div class="neo-contact-orbit" aria-hidden="true"><span /><span /><span /></div><p class="neo-eyebrow">{{ copy.contactEyebrow }}</p><h2>{{ copy.contactHeading[0] }}<br><em>{{ copy.contactHeading[1] }}</em></h2><p class="neo-contact-text">{{ copy.contactText }}</p><a class="neo-button neo-button-light" :href="profile.links.email.href" @click="track('email')">{{ copy.contact }}<span aria-hidden="true">↗</span></a><a class="neo-email" :href="profile.links.email.href" dir="ltr">{{ profile.person.email }}</a><div class="neo-contact-links"><a :href="profile.links.linkedin.href" target="_blank" rel="noreferrer" @click="track('linkedin')">LinkedIn ↗</a><a :href="profile.links.github.href" target="_blank" rel="noreferrer" @click="track('github')">GitHub ↗</a><a :href="cvHref" :download="cvFilename" @click="track('download_cv')">{{ copy.cv }} ↓</a></div></div>
    </section>
    <footer class="neo-footer neo-width"><div class="neo-footer-main"><NuxtLink class="neo-monogram" to="/" :aria-label="copy.home" dir="ltr">ks.</NuxtLink><p>{{ copy.footer }}</p><span>{{ copy.location }}</span></div><p class="neo-translation-note">{{ copy.translatedNote }}</p></footer>
  </main>
</template>

<script setup lang="ts">
import { neoiqEn } from '~/data/neoiq'
import { neoiqAr } from '~/data/neoiq-ar'
import { profile } from '~/data/profile'
import { normalizeSiteUrl } from '~/data/seo'
const props = defineProps<{ locale: 'en' | 'ar' }>()
const isArabic = computed(() => props.locale === 'ar')
const copy = computed(() => isArabic.value ? neoiqAr : neoiqEn)
const cvHref = '/api/cv/neoiq-fde-ai-manager.pdf'
const cvFilename = 'Konrad-Straszewski-CV-NeoIQ-FDE-AI-Manager.pdf'
const posthog = usePostHog()
const track = (action: string) => posthog?.capture('neoiq_cta_clicked', { action, locale: props.locale })
useRouteSeo()
const config = useRuntimeConfig()
const siteUrl = normalizeSiteUrl(config.public.siteUrl as string | undefined)
useHead({
  link: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600&family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap' },
    { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/neoiq` },
    { rel: 'alternate', hreflang: 'ar', href: `${siteUrl}/neoiq/ar` },
    { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}/neoiq` }
  ]
})
onMounted(() => posthog?.capture('neoiq_page_viewed', { locale: props.locale }))
</script>

<style scoped src="~/assets/css/neoiq-page.css"></style>
