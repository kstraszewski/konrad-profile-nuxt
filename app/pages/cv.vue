<template>
  <main class="cv-page" @keydown.escape="downloadOpen = false">
    <header class="cv-nav">
      <NuxtLink class="cv-nav__brand" to="/">
        <span class="cv-nav__dot" aria-hidden="true" />
        <span>{{ profile.person.name }}</span>
      </NuxtLink>

      <div class="cv-nav__right">
        <a href="#experience">Experience</a>
        <a href="#stack">Stack</a>
        <a href="#contact">Contact</a>

        <div class="cv-download">
          <button
            class="cv-download__trigger"
            type="button"
            aria-haspopup="menu"
            :aria-expanded="downloadOpen"
            @click="downloadOpen = !downloadOpen"
          >
            Download
          </button>

          <div v-if="downloadOpen" class="cv-download__menu" role="menu">
            <a
              v-for="option in profile.cv.downloads"
              :key="option.href"
              :href="option.href"
              :download="downloadName(option.label)"
              role="menuitem"
              @click="downloadOpen = false"
            >
              <span>{{ option.label }}</span>
              <small>{{ option.description }}</small>
            </a>
          </div>
        </div>
      </div>
    </header>

    <section class="cv-hero">
      <div class="cv-hero__copy">
        <p class="cv-eyebrow">{{ profile.cv.title }} · {{ profile.person.role }}</p>
        <h1>{{ profile.cv.headline }}</h1>
        <p class="cv-hero__lead">{{ profile.cv.subhead }}</p>
      </div>

      <aside class="cv-snapshot" aria-label="CV snapshot">
        <dl>
          <div v-for="fact in profile.hero.facts" :key="fact.label">
            <dt>{{ fact.label }}</dt>
            <dd>{{ fact.value }}</dd>
          </div>
        </dl>
      </aside>
    </section>

    <section class="cv-section cv-section--summary">
      <div class="cv-section__label">Profile</div>
      <div>
        <p class="cv-summary">{{ profile.cv.summary }}</p>
        <ul class="cv-highlights">
          <li v-for="highlight in profile.cv.highlights" :key="highlight">{{ highlight }}</li>
        </ul>
      </div>
    </section>

    <section id="experience" class="cv-section">
      <div class="cv-section__label">Experience</div>
      <div class="cv-timeline">
        <article v-for="item in profile.track.experience" :key="`${item.year}-${item.role}`" class="cv-role">
          <div class="cv-role__year">{{ item.year }}</div>
          <div>
            <h2>{{ item.role }}</h2>
            <p class="cv-role__org">{{ item.org }}</p>
          </div>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </section>

    <section class="cv-band">
      <div>
        <p class="cv-eyebrow">{{ profile.lendi.label }}</p>
        <h2>{{ profile.lendi.pride }}</h2>
      </div>
      <div>
        <p class="cv-eyebrow">{{ profile.jasne.label }}</p>
        <h2>{{ profile.jasne.intro }}</h2>
      </div>
    </section>

    <section id="stack" class="cv-section">
      <div class="cv-section__label">Stack & principles</div>
      <div class="cv-stack-grid">
        <article v-for="group in profile.stack.groups" :key="group.label" class="cv-stack">
          <h2>{{ group.label }}</h2>
          <div>
            <span v-for="item in group.items" :key="item">{{ item }}</span>
          </div>
        </article>
      </div>
    </section>

    <section class="cv-section">
      <div class="cv-section__label">Operating model</div>
      <div class="cv-principles">
        <article v-for="principle in profile.principles.items" :key="principle.number">
          <span>{{ principle.number }}</span>
          <h2>{{ principle.heading }}</h2>
          <p>{{ principle.description }}</p>
        </article>
      </div>
    </section>

    <footer id="contact" class="cv-contact">
      <div>
        <p class="cv-eyebrow">Contact</p>
        <h2>{{ profile.contact.heading.first }} {{ profile.contact.heading.accent }} {{ profile.contact.heading.last }}</h2>
      </div>

      <div class="cv-contact__links">
        <a
          v-for="item in contactLinks"
          :key="item.label"
          :href="item.href"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noreferrer' : undefined"
        >
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </a>
      </div>
    </footer>
  </main>
</template>

<script setup>
import { profile } from '~/data/profile'

const downloadOpen = ref(false)
const contactLinks = [profile.links.email, profile.links.phone, profile.links.github, profile.links.linkedin]

const downloadName = (label) =>
  label === 'PostHog style' ? 'Konrad-Straszewski-CV-PostHog.pdf' : 'Konrad-Straszewski-CV.pdf'

useHead({
  title: 'CV - Konrad Straszewski',
  meta: [
    {
      name: 'description',
      content: 'Current CV for Konrad Straszewski, generated from the shared profile data source.'
    }
  ]
})
</script>

<style scoped>
.cv-page {
  min-height: 100vh;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
}

.cv-nav {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: 20px 8vw;
  border-bottom: 1px solid var(--rule);
  background: rgba(250, 250, 247, 0.9);
  backdrop-filter: blur(12px);
}

.cv-nav__brand,
.cv-nav__right,
.cv-download__trigger {
  display: inline-flex;
  align-items: center;
}

.cv-nav__brand {
  gap: 12px;
  color: var(--ink);
  font-weight: 500;
  text-decoration: none;
}

.cv-nav__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
}

.cv-nav__right {
  gap: 24px;
}

.cv-nav__right a {
  color: var(--dim);
  font-size: 0.8125rem;
  text-decoration: none;
  white-space: nowrap;
}

.cv-nav__right a:hover {
  color: var(--ink);
}

.cv-download {
  position: relative;
}

.cv-download__trigger {
  justify-content: center;
  min-height: 36px;
  padding: 0 16px;
  border: 1px solid var(--ink);
  border-radius: 4px;
  background: var(--ink);
  color: var(--bg);
  cursor: pointer;
  font-weight: 500;
}

.cv-download__menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  display: grid;
  width: 260px;
  border: 1px solid var(--ink);
  background: var(--bg);
  box-shadow: 6px 6px 0 var(--ink);
}

.cv-download__menu a {
  display: grid;
  gap: 5px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--rule);
  color: var(--ink);
  text-decoration: none;
}

.cv-download__menu a:last-child {
  border-bottom: 0;
}

.cv-download__menu a:hover {
  background: var(--warm-panel);
}

.cv-download__menu span {
  font-weight: 600;
}

.cv-download__menu small {
  color: var(--dim);
  font-size: 0.75rem;
}

.cv-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
  gap: 72px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 96px 8vw 86px;
}

.cv-eyebrow,
.cv-section__label,
.cv-role__year,
.cv-snapshot dt,
.cv-stack h2,
.cv-principles span,
.cv-contact__links span {
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.cv-eyebrow {
  margin: 0 0 18px;
  color: var(--accent);
}

.cv-hero h1 {
  max-width: 920px;
  margin: 0;
  font-family: var(--font-headline);
  font-size: 6.8rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 0.98;
  text-wrap: balance;
}

.cv-hero__lead {
  max-width: 740px;
  margin: 34px 0 0;
  color: var(--dim);
  font-size: 1.25rem;
  line-height: 1.5;
}

.cv-snapshot {
  align-self: end;
  border-top: 1px solid var(--ink);
}

.cv-snapshot dl {
  margin: 0;
}

.cv-snapshot div {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 16px 0;
  border-bottom: 1px solid var(--rule);
}

.cv-snapshot dd {
  margin: 0;
  color: var(--ink);
  font-weight: 500;
  text-align: right;
}

.cv-section {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 80px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 86px 8vw;
  border-top: 1px solid var(--rule);
}

.cv-section--summary {
  background: var(--warm-panel);
  max-width: none;
  padding-right: calc((100vw - min(1280px, 100vw)) / 2 + 8vw);
  padding-left: calc((100vw - min(1280px, 100vw)) / 2 + 8vw);
}

.cv-summary {
  max-width: 900px;
  margin: 0;
  font-family: var(--font-headline);
  font-size: 2.6rem;
  letter-spacing: 0;
  line-height: 1.08;
  text-wrap: balance;
}

.cv-highlights {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 40px;
  max-width: 920px;
  margin: 54px 0 0;
  padding: 0;
  list-style: none;
}

.cv-highlights li {
  padding-top: 16px;
  border-top: 1px solid var(--ink);
  color: var(--ink);
  line-height: 1.5;
}

.cv-timeline {
  border-top: 1px solid var(--rule);
}

.cv-role {
  display: grid;
  grid-template-columns: 150px minmax(180px, 0.8fr) minmax(0, 1.2fr);
  gap: 36px;
  padding: 28px 0;
  border-bottom: 1px solid var(--rule);
}

.cv-role h2,
.cv-band h2,
.cv-principles h2,
.cv-contact h2 {
  margin: 0;
  font-family: var(--font-headline);
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.1;
}

.cv-role h2 {
  font-size: 1.65rem;
}

.cv-role__org {
  margin: 7px 0 0;
  color: var(--dim);
}

.cv-role > p {
  margin: 0;
  color: var(--ink);
  line-height: 1.55;
}

.cv-band {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 48px;
  padding: 90px 8vw;
  border-top: 1px solid var(--rule);
  background: var(--dark-panel);
  color: var(--bg);
}

.cv-band > div {
  max-width: 560px;
}

.cv-band h2 {
  color: var(--bg);
  font-size: 2.4rem;
}

.cv-stack-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 40px;
}

.cv-stack {
  padding-top: 18px;
  border-top: 1px solid var(--ink);
}

.cv-stack h2 {
  margin: 0 0 18px;
}

.cv-stack div {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cv-stack span {
  padding: 7px 10px;
  border: 1px solid var(--rule);
  background: var(--warm-panel);
  font-size: 0.875rem;
}

.cv-principles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 34px 48px;
}

.cv-principles article {
  padding-top: 18px;
  border-top: 1px solid var(--rule);
}

.cv-principles h2 {
  margin-top: 18px;
  font-size: 2rem;
}

.cv-principles p {
  margin: 14px 0 0;
  color: var(--dim);
  line-height: 1.55;
}

.cv-contact {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.8fr);
  gap: 64px;
  padding: 110px 8vw 90px;
  background: var(--warm-panel);
  border-top: 1px solid var(--rule);
}

.cv-contact h2 {
  max-width: 760px;
  font-size: 4.3rem;
}

.cv-contact__links {
  display: grid;
  gap: 18px;
}

.cv-contact__links a {
  display: grid;
  gap: 8px;
  padding: 18px 0;
  border-top: 1px solid var(--rule);
  color: var(--ink);
  text-decoration: none;
}

.cv-contact__links a:last-child {
  border-bottom: 1px solid var(--rule);
}

.cv-contact__links strong {
  overflow-wrap: anywhere;
  font-size: 1.1rem;
}

@media (max-width: 1060px) {
  .cv-nav {
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
    padding: 18px 6vw;
  }

  .cv-nav__right {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 3px;
  }

  .cv-hero,
  .cv-section,
  .cv-contact {
    grid-template-columns: 1fr;
    gap: 42px;
    padding-right: 6vw;
    padding-left: 6vw;
  }

  .cv-hero h1 {
    font-size: 4.6rem;
  }

  .cv-section--summary {
    padding-right: 6vw;
    padding-left: 6vw;
  }

  .cv-role {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .cv-stack-grid,
  .cv-principles,
  .cv-band,
  .cv-highlights {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .cv-nav__right {
    gap: 16px;
  }

  .cv-download__menu {
    right: auto;
    left: 0;
    width: min(260px, 86vw);
  }

  .cv-hero {
    padding-top: 60px;
  }

  .cv-hero h1 {
    font-size: 3.35rem;
  }

  .cv-hero__lead {
    font-size: 1.1rem;
  }

  .cv-summary {
    font-size: 2rem;
  }

  .cv-band h2 {
    font-size: 1.85rem;
  }

  .cv-contact h2 {
    font-size: 3rem;
  }
}
</style>
