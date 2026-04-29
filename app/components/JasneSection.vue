<template>
  <section id="jasne" class="jasne">
    <TwoCol :label="profile.jasne.label" :sub="profile.jasne.sub">
      <div class="jasne__title-row">
        <NuxtLink class="jasne__name" :to="profile.links.jasne.href">
          <SerifHeading :size="104">{{ profile.jasne.name }}</SerifHeading>
        </NuxtLink>
        <NuxtLink class="jasne__external" :to="profile.links.jasne.href">
          &nearr; {{ profile.links.jasne.value }}
        </NuxtLink>
      </div>

      <p class="jasne__intro">
        {{ profile.jasne.intro }}
      </p>

      <div class="jasne__facts">
        <div v-for="fact in profile.jasne.facts" :key="fact.label" class="jasne__fact">
          <div class="jasne__fact-label">{{ fact.label }}</div>
          <div class="jasne__fact-value">{{ fact.value }}</div>
        </div>
      </div>

      <div class="jasne__beats-wrap">
        <Eyebrow>Why I built it</Eyebrow>
        <div class="jasne__beats">
          <article v-for="beat in profile.jasne.beats" :key="beat.number" class="jasne__beat">
            <div class="jasne__beat-number">{{ beat.number }}</div>
            <SerifHeading :size="28" tag="h3" class="jasne__beat-heading">
              {{ beat.heading }}
            </SerifHeading>
            <p>{{ beat.description }}</p>
          </article>
        </div>
      </div>
    </TwoCol>
  </section>
</template>

<script setup>
import { profile } from '~/data/profile'
</script>

<style scoped>
.jasne {
  border-top: 1px solid var(--rule);
}

.jasne__title-row {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 8px;
}

.jasne__name {
  color: var(--ink);
  text-decoration: none;
  transition: color 0.18s ease, text-shadow 0.18s ease;
}

.jasne__name:hover,
.jasne__name:focus-visible {
  color: var(--brand-jasne);
  text-shadow: 0 0 24px rgba(255, 214, 110, 0.24);
}

.jasne__external {
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  text-decoration: none;
  transition: color 0.18s ease, text-shadow 0.18s ease;
}

.jasne__external:hover,
.jasne__external:focus-visible {
  color: var(--brand-jasne);
  text-shadow: 0 0 14px rgba(255, 214, 110, 0.2);
}

.jasne__intro {
  max-width: 820px;
  margin: 32px 0 60px;
  color: var(--ink);
  font-size: 1.5rem;
  line-height: 1.35;
}

.jasne__facts {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  margin-top: 0;
  border: 1px solid var(--rule);
}

.jasne__fact {
  padding: 20px 18px;
  border-right: 1px solid var(--rule);
}

.jasne__fact:last-child {
  border-right: 0;
}

.jasne__fact-label {
  margin-bottom: 8px;
  color: var(--dim);
  font-size: 0.625rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.jasne__fact-value {
  font-size: 0.875rem;
  font-weight: 500;
}

.jasne__beats-wrap {
  margin-top: 100px;
}

.jasne__beats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 48px;
  margin-top: 32px;
}

.jasne__beat-number {
  margin-bottom: 16px;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.1em;
}

.jasne__beat-heading {
  margin-bottom: 14px;
}

.jasne__beat p {
  margin: 0;
  color: var(--dim);
  font-size: 0.9375rem;
  line-height: 1.55;
}

@media (max-width: 1060px) {
  .jasne__facts {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .jasne__fact:nth-child(3) {
    border-right: 0;
  }

  .jasne__fact:nth-child(-n + 3) {
    border-bottom: 1px solid var(--rule);
  }
}

@media (max-width: 820px) {
  .jasne__beats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .jasne__intro {
    font-size: 1.1875rem;
  }

  .jasne__facts {
    grid-template-columns: 1fr;
  }

  .jasne__fact,
  .jasne__fact:nth-child(3) {
    border-right: 0;
    border-bottom: 1px solid var(--rule);
  }

  .jasne__fact:last-child {
    border-bottom: 0;
  }
}
</style>
