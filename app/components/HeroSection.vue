<template>
  <section id="top" class="hero">
    <div class="hero__meta-row">
      <Eyebrow accent>{{ profile.hero.eyebrow }}</Eyebrow>
      <span class="hero__est">{{ profile.hero.meta }}</span>
    </div>

    <h1 class="hero__title">
      {{ profile.hero.title.first }}<br>
      <span class="hero__around">{{ profile.hero.title.around }}</span>
      {{ ' ' }}
      <span class="hero__ai-wrap">
        <span class="hero__ai">
          {{ profile.hero.title.highlight }}
          <span class="hero__underline" :class="{ 'hero__underline--short': tick % 2 !== 0 }" />
        </span>,
      </span><br>
      {{ profile.hero.title.last }}
    </h1>

    <div class="hero__intro-grid">
      <p class="hero__intro">
        {{ profile.hero.intro.years }}
        <a
          :href="profile.links.lendi.href"
          class="hero__brand hero__brand--lendi"
          target="_blank"
          rel="noreferrer"
        >
          {{ profile.hero.intro.company }}
        </a> -
        {{ profile.hero.intro.path }}
        <strong>{{ profile.hero.intro.role }}</strong>. {{ profile.hero.intro.mandate }}
        {{ profile.hero.intro.side }}
        <NuxtLink to="/jasne.ai" class="link-underline hero__brand hero__brand--jasne" @click="onJasneLinkClick">
          {{ profile.hero.intro.sideBuild }}
        </NuxtLink>.
        {{ profile.hero.intro.mafLead }}
        <a
          :href="profile.links.maf.href"
          class="hero__brand hero__brand--maf"
          target="_blank"
          rel="noreferrer"
        >
          {{ profile.hero.intro.mafCompany }}</a>{{ profile.hero.intro.mafRest }}
      </p>

      <div class="hero__facts" aria-label="Profile facts">
        <KeyValue
          v-for="fact in profile.hero.facts"
          :key="fact.label"
          :label="fact.label"
          :value="fact.value"
          :href="fact.link ? profile.links[fact.link].href : ''"
          :external="fact.link ? profile.links[fact.link].external : false"
          :brand="fact.brand"
        />
        <div class="hero__fact-end" />
      </div>
    </div>

    <div class="hero__marquee" aria-hidden="true">
      <div class="hero__marquee-track">
        <span v-for="index in 3" :key="index">
          <template v-for="item in profile.hero.marquee" :key="`${index}-${item.text}`">
            <span :class="{ 'hero__marquee-strong': item.strong }">
              <template v-if="item.italicWord">
                {{ item.text.replace(item.italicWord, '') }}<span class="hero__marquee-italic">{{ item.italicWord }}</span>
              </template>
              <template v-else>{{ item.text }}</template>
            </span>
            <span class="hero__marquee-accent">✦</span>
          </template>
        </span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { profile } from '~/data/profile'

const posthog = usePostHog()

const onJasneLinkClick = () => {
  posthog?.capture('hero_jasne_link_clicked')
}

const tick = ref(0)
let intervalId = null

onMounted(() => {
  intervalId = window.setInterval(() => {
    tick.value += 1
  }, 700)
})

onBeforeUnmount(() => {
  if (intervalId) {
    window.clearInterval(intervalId)
  }
})
</script>

<style scoped>
.hero {
  max-width: 1280px;
  margin: 0 auto;
  padding: 8vh 8vw 14vh;
}

.hero__meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-width: 0;
  margin-bottom: 80px;
}

.hero__est {
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.hero__title {
  max-width: 100%;
  margin: 0;
  font-family: var(--font-headline);
  font-size: 8.25rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 0.96;
  text-wrap: balance;
}

.hero__around {
  color: var(--dim);
  font-style: italic;
}

.hero__ai {
  position: relative;
  display: inline-block;
}

.hero__ai-wrap {
  white-space: nowrap;
}

.hero__underline {
  position: absolute;
  right: 0;
  bottom: 0.05em;
  left: 0;
  height: 6px;
  background: var(--accent);
  transform-origin: left;
  transition: transform 0.6s ease;
}

.hero__underline--short {
  transform: scaleX(0.6);
}

.hero__intro-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 96px;
  align-items: start;
  min-width: 0;
  margin-top: 80px;
}

.hero__intro {
  max-width: 560px;
  margin: 0;
  color: var(--ink);
  font-size: 1.3125rem;
  line-height: 1.5;
}

.hero__intro strong {
  font-weight: 500;
}

.hero__brand {
  font-weight: 600;
  text-decoration: none;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
  transition: color 0.18s ease, text-shadow 0.18s ease;
}

.hero__brand--lendi {
  color: var(--ink);
}

.hero__brand--lendi:hover,
.hero__brand--lendi:focus-visible {
  color: var(--brand-lendi);
  text-shadow: 0 0 18px rgba(34, 199, 250, 0.22);
}

.hero__brand--jasne {
  color: var(--ink);
}

.hero__brand--jasne:hover,
.hero__brand--jasne:focus-visible {
  color: var(--brand-jasne);
  text-shadow: 0 0 18px rgba(255, 214, 110, 0.24);
}

.hero__brand--maf {
  color: var(--ink);
}

.hero__brand--maf:hover,
.hero__brand--maf:focus-visible {
  color: var(--brand-maf);
  text-shadow: 0 0 18px rgba(49, 38, 29, 0.22);
}

.hero__facts {
  min-width: 0;
  color: var(--dim);
  font-family: var(--font-body);
  font-size: 0.875rem;
  line-height: 1.6;
}

.hero__fact-end {
  border-top: 1px solid var(--rule);
}

.hero__marquee {
  margin-top: 120px;
  padding: 20px 0;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  overflow: hidden;
  white-space: nowrap;
}

.hero__marquee-track {
  display: inline-block;
  animation: marquee 40s linear infinite;
  color: var(--dim);
  font-family: var(--font-headline);
  font-size: 1.75rem;
  letter-spacing: 0;
}

.hero__marquee-strong {
  color: var(--ink);
}

.hero__marquee-accent {
  margin: 0 24px;
  color: var(--accent);
}

.hero__marquee-italic {
  color: var(--ink);
  font-style: italic;
  font-weight: 600;
  transition: color 0.18s ease, text-shadow 0.18s ease;
}

.hero__marquee-italic:hover {
  color: var(--brand-jasne);
  text-shadow: 0 0 18px rgba(255, 214, 110, 0.24);
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-33.33%);
  }
}

@media (max-width: 1180px) {
  .hero__title {
    font-size: 6.75rem;
  }

  .hero__intro-grid {
    gap: 56px;
  }
}

@media (max-width: 900px) {
  .hero {
    padding: 7vh 6vw 10vh;
  }

  .hero__meta-row {
    align-items: flex-start;
    flex-direction: column;
    margin-bottom: 56px;
  }

  .hero__title {
    font-size: 4.7rem;
  }

  .hero__intro-grid {
    grid-template-columns: 1fr;
    gap: 42px;
    margin-top: 56px;
  }

  .hero__marquee {
    margin-top: 72px;
  }
}

@media (max-width: 560px) {
  .hero {
    padding: 6vh 5vw 8vh;
  }

  .hero__meta-row {
    gap: 16px;
    margin-bottom: 44px;
  }

  .hero__title {
    font-size: 3.05rem;
    line-height: 1.02;
  }

  .hero__intro-grid {
    gap: 32px;
    margin-top: 44px;
  }

  .hero__intro {
    font-size: 1.125rem;
  }

  .hero__est {
    white-space: normal;
  }

  .hero__marquee-track {
    font-size: 1.375rem;
  }
}

@media (max-width: 420px) {
  .hero {
    padding: 42px 18px 56px;
  }

  .hero__title {
    font-size: 2.68rem;
  }

  .hero__intro {
    font-size: 1.0625rem;
  }

  .hero__marquee {
    margin-top: 54px;
    padding: 16px 0;
  }
}

@media (max-width: 360px) {
  .hero__title {
    font-size: 2.35rem;
  }
}
</style>
