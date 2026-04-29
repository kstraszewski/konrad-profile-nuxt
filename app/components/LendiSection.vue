<template>
  <section id="lendi" class="lendi">
    <TwoCol :label="profile.lendi.label" :sub="profile.lendi.sub">
      <SerifHeading :size="86" class="lendi__heading">
        <a
          :href="profile.links.lendi.href"
          class="lendi__accent"
          target="_blank"
          rel="noreferrer"
        >
          {{ profile.lendi.heading.accent }}
        </a>
        {{ profile.lendi.heading.rest }}
      </SerifHeading>

      <p class="lendi__intro">
        {{ profile.lendi.intro }}
      </p>

      <p class="lendi__pride">
        {{ profile.lendi.pride }}
      </p>

      <div class="lendi__phases">
        <article
          v-for="(phase, index) in profile.lendi.phases"
          :key="phase.year"
          class="lendi__phase"
          :class="{ 'lendi__phase--current': index === profile.lendi.phases.length - 1 }"
        >
          <div class="lendi__phase-kicker">YEAR {{ phase.ordinal }}</div>
          <h3 class="lendi__phase-year">{{ phase.year }}</h3>
          <div class="lendi__phase-label">{{ phase.label }}</div>
          <p class="lendi__phase-description">{{ phase.description }}</p>
        </article>
      </div>

      <div class="lendi__pillars-wrap">
        <Eyebrow>The mandate &middot; three pillars</Eyebrow>
        <div class="lendi__pillars">
          <article v-for="pillar in profile.lendi.pillars" :key="pillar.number" class="lendi__pillar">
            <div class="lendi__pillar-kicker">PILLAR {{ pillar.number }}</div>
            <h3 class="lendi__pillar-heading">{{ pillar.heading }}</h3>
            <p class="lendi__pillar-line">{{ pillar.line }}</p>
            <ul class="lendi__pillar-list">
              <li v-for="item in pillar.bullets" :key="item">{{ item }}</li>
            </ul>
          </article>
        </div>
      </div>

      <figure class="lendi__quote">
        <blockquote>
          "{{ profile.lendi.quote }}"
        </blockquote>
        <figcaption>{{ profile.lendi.quoteMeta }}</figcaption>
      </figure>
    </TwoCol>
  </section>
</template>

<script setup>
import { profile } from '~/data/profile'
</script>

<style scoped>
.lendi {
  border-top: 1px solid var(--rule);
  background: var(--warm-panel);
}

.lendi__heading {
  max-width: 940px;
}

.lendi__accent {
  color: var(--ink);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.18s ease, text-shadow 0.18s ease;
}

.lendi__accent:hover,
.lendi__accent:focus-visible {
  color: var(--brand-lendi);
  text-shadow: 0 0 24px rgba(34, 199, 250, 0.22);
}

.lendi__intro {
  max-width: 780px;
  margin: 24px 0 0;
  color: var(--dim);
  font-size: 1.1875rem;
  line-height: 1.55;
}

.lendi__pride {
  max-width: 820px;
  margin: 28px 0 0;
  padding-left: 22px;
  border-left: 3px solid var(--accent);
  color: var(--ink);
  font-size: 1.375rem;
  line-height: 1.4;
}

.lendi__phases {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 80px;
  border: 1px solid var(--rule);
  background: var(--bg);
}

.lendi__phase {
  position: relative;
  padding: 28px 24px;
  border-right: 1px solid var(--rule);
}

.lendi__phase:last-child {
  border-right: 0;
}

.lendi__phase--current {
  background: rgba(17, 17, 17, 0.06);
}

.lendi__phase-kicker {
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
}

.lendi__phase-year {
  margin: 8px 0 4px;
  color: var(--ink);
  font-family: var(--font-headline);
  font-size: 2rem;
  font-weight: 400;
  letter-spacing: 0;
}

.lendi__phase--current .lendi__phase-year {
  color: var(--accent);
}

.lendi__phase-label {
  margin-bottom: 6px;
  font-size: 0.9375rem;
  font-weight: 500;
}

.lendi__phase-description {
  margin: 0;
  color: var(--dim);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.lendi__pillars-wrap {
  margin-top: 100px;
}

.lendi__pillars {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 32px;
  margin-top: 32px;
}

.lendi__pillar {
  display: flex;
  min-height: 320px;
  flex-direction: column;
  gap: 16px;
  padding: 28px;
  border: 1px solid var(--rule);
  background: var(--bg);
}

.lendi__pillar-kicker {
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
}

.lendi__pillar-heading {
  margin: 0;
  font-family: var(--font-headline);
  font-size: 2.25rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.05;
}

.lendi__pillar-line {
  margin: 0;
  color: var(--ink);
  font-size: 0.9375rem;
  font-style: italic;
  line-height: 1.4;
}

.lendi__pillar-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.lendi__pillar-list li {
  position: relative;
  padding-left: 16px;
  color: var(--dim);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.lendi__pillar-list li::before {
  position: absolute;
  left: 0;
  color: var(--accent);
  content: "-";
}

.lendi__quote {
  margin: 120px 0 0;
  padding: 60px 0;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
}

.lendi__quote blockquote {
  max-width: 900px;
  margin: 0;
  color: var(--ink);
  font-family: var(--font-headline);
  font-size: 2.75rem;
  font-style: italic;
  letter-spacing: 0;
  line-height: 1.15;
}

.lendi__quote span {
  color: var(--accent);
  font-style: normal;
}

.lendi__quote figcaption {
  margin-top: 24px;
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
}

@media (max-width: 1020px) {
  .lendi__phases,
  .lendi__pillars {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lendi__phase:nth-child(2) {
    border-right: 0;
  }

  .lendi__phase:nth-child(-n + 2) {
    border-bottom: 1px solid var(--rule);
  }
}

@media (max-width: 680px) {
  .lendi__phases,
  .lendi__pillars {
    grid-template-columns: 1fr;
  }

  .lendi__phase,
  .lendi__phase:nth-child(2) {
    border-right: 0;
    border-bottom: 1px solid var(--rule);
  }

  .lendi__phase:last-child {
    border-bottom: 0;
  }

  .lendi__quote {
    margin-top: 72px;
    padding: 42px 0;
  }

  .lendi__quote blockquote {
    font-size: 2rem;
  }
}
</style>
