<template>
  <div class="site-shell">
    <AppNav />

    <main class="jasne-page">
      <section class="jasne-page__hero">
        <NuxtLink class="jasne-page__back" to="/#jasne">&larr; profile</NuxtLink>
        <div class="jasne-page__kicker">Case study &middot; 2024 &rarr; now</div>
        <h1>{{ profile.jasne.name }}</h1>
        <p>{{ profile.jasne.intro }}</p>
        <a class="jasne-page__live" href="https://jasne.ai" target="_blank" rel="noreferrer" @click="onLiveProductClick">
          Live product &nearr;
        </a>
      </section>

      <section id="migration" class="jasne-page__migration" aria-labelledby="migration-title">
        <p class="jasne-page__kicker"><time datetime="2026-11">November 2026</time></p>
        <h2 id="migration-title">Changing who owns a course</h2>
        <div class="jasne-page__grid">
          <article v-for="beat in profile.jasne.beats" :key="beat.number" class="jasne-page__card">
            <h3>{{ beat.heading }}</h3>
            <p>{{ beat.description }}</p>
          </article>
        </div>
      </section>

      <section class="jasne-page__facts" aria-label="jasne.ai facts">
        <div v-for="fact in profile.jasne.facts" :key="fact.label" class="jasne-page__fact">
          <div class="jasne-page__fact-label">{{ fact.label }}</div>
          <div class="jasne-page__fact-value">{{ fact.value }}</div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { profile } from '~/data/profile'

const posthog = usePostHog()

const onLiveProductClick = () => {
  posthog?.capture('jasne_live_product_clicked')
}

onMounted(() => {
  posthog?.capture('jasne_case_study_viewed')
})

useRouteSeo('/jasne.ai')
</script>

<style scoped>
.jasne-page {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 72px 8vw 120px;
}

.jasne-page__hero {
  max-width: 940px;
}

.jasne-page__back,
.jasne-page__kicker,
.jasne-page__fact-label {
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.jasne-page__back {
  display: inline-block;
  margin-bottom: 52px;
  text-decoration: none;
}

.jasne-page__kicker {
  margin-bottom: 18px;
}

.jasne-page h1 {
  margin: 0;
  color: var(--ink);
  font-family: var(--font-headline);
  font-size: 9rem;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 0.95;
  overflow-wrap: anywhere;
}

.jasne-page__hero p {
  max-width: 820px;
  margin: 36px 0 32px;
  color: var(--ink);
  font-size: 1.5rem;
  line-height: 1.35;
}

.jasne-page__live {
  display: inline-flex;
  border-bottom: 2px solid var(--accent);
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  padding-bottom: 4px;
  text-decoration: none;
  transition: color 0.18s ease, border-color 0.18s ease, text-shadow 0.18s ease;
}

.jasne-page__live:hover,
.jasne-page__live:focus-visible {
  border-color: var(--brand-jasne);
  color: var(--brand-jasne);
  text-shadow: 0 0 14px rgba(255, 214, 110, 0.2);
}

.jasne-page__facts {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  min-width: 0;
  margin-top: 72px;
  border: 1px solid var(--rule);
}

.jasne-page__fact {
  min-width: 0;
  padding: 20px 18px;
  border-right: 1px solid var(--rule);
}

.jasne-page__fact:last-child {
  border-right: 0;
}

.jasne-page__fact-label {
  margin-bottom: 8px;
}

.jasne-page__fact-value {
  font-size: 0.875rem;
  font-weight: 500;
}

.jasne-page__migration {
  margin-top: 64px;
  scroll-margin-top: 88px;
}

.jasne-page__migration > h2 {
  margin: 0 0 28px;
  font: 500 clamp(2rem, 4vw, 3.25rem)/1.1 var(--font-headline);
}

.jasne-page__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 32px;
  min-width: 0;
}

.jasne-page__card {
  padding-top: 24px;
  border-top: 1px solid var(--ink);
}

.jasne-page__card h3 {
  margin: 0 0 14px;
  font-family: var(--font-headline);
  font-size: 2rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.1;
}

.jasne-page__card p {
  margin: 0;
  color: var(--dim);
  font-size: 0.9375rem;
  line-height: 1.55;
}

@media (max-width: 1060px) {
  .jasne-page h1 {
    font-size: 7rem;
  }

  .jasne-page__facts {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .jasne-page__fact:nth-child(3) {
    border-right: 0;
  }

  .jasne-page__fact:nth-child(-n + 3) {
    border-bottom: 1px solid var(--rule);
  }
}

@media (max-width: 820px) {
  .jasne-page {
    padding: 56px 6vw 96px;
  }

  .jasne-page h1 {
    font-size: 5rem;
  }

  .jasne-page__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .jasne-page h1 {
    font-size: 4rem;
  }

  .jasne-page__hero p {
    font-size: 1.1875rem;
  }

  .jasne-page__facts {
    grid-template-columns: 1fr;
  }

  .jasne-page__fact,
  .jasne-page__fact:nth-child(3) {
    border-right: 0;
    border-bottom: 1px solid var(--rule);
  }

  .jasne-page__fact:last-child {
    border-bottom: 0;
  }
}

@media (max-width: 420px) {
  .jasne-page {
    padding: 44px 18px 72px;
  }

  .jasne-page__back {
    margin-bottom: 40px;
  }

  .jasne-page h1 {
    font-size: 3.25rem;
  }

  .jasne-page__hero p {
    margin-top: 28px;
    font-size: 1.0625rem;
  }

  .jasne-page__facts {
    margin-top: 52px;
  }

  .jasne-page__grid {
    gap: 28px;
  }

  .jasne-page__card h3 {
    font-size: 1.65rem;
  }
}

@media (max-width: 360px) {
  .jasne-page h1 {
    font-size: 2.9rem;
  }
}
</style>
