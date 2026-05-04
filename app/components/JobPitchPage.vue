<template>
  <main class="job-pitch-page" :class="`job-pitch-page--${theme}`">
    <header class="job-pitch-nav">
      <a class="job-pitch-nav__brand" href="/" aria-label="Back to Konrad Straszewski homepage">
        <span class="job-pitch-nav__mark" aria-hidden="true">{{ profile.person.initials }}</span>
        <span>{{ profile.person.name }}</span>
      </a>

      <nav class="job-pitch-nav__links" :aria-label="`${pitch.company} pitch sections`">
        <a v-for="item in navItems" :key="item.href" :href="item.href">{{ item.label }}</a>
      </nav>
    </header>

    <section class="job-pitch-hero">
      <div class="job-pitch-hero__copy">
        <p class="job-pitch-kicker">{{ pitch.hero.kicker }}</p>
        <h1>{{ pitch.hero.headline }}</h1>
        <p class="job-pitch-hero__lead">
          {{ pitch.hero.lead }}
        </p>
        <div class="job-pitch-hero__actions">
          <a class="job-pitch-button job-pitch-button--primary" :href="profile.links.email.href" @click="onHeroCta('email')">
            Email me
          </a>
          <a
            v-for="(option, index) in resolvedCvOptions"
            :key="option.href"
            class="job-pitch-button"
            :href="option.href"
            :download="option.download"
            @click="onHeroCta(option.action || `download_cv_${index + 1}`)"
          >
            {{ option.label }}
          </a>
          <NuxtLink class="job-pitch-button" to="/mcp" @click="onHeroCta('mcp')">
            MCP CV
          </NuxtLink>
          <a
            v-for="(option, index) in resolvedJobLinks"
            :key="option.href"
            class="job-pitch-button"
            :href="option.href"
            target="_blank"
            rel="noreferrer"
            @click="onHeroCta(option.action || `job_link_${index + 1}`)"
          >
            {{ option.label }}
          </a>
          <a class="job-pitch-button" :href="profile.links.github.href" target="_blank" rel="noreferrer" @click="onHeroCta('github')">
            GitHub
          </a>
        </div>
      </div>

      <aside class="job-pitch-panel job-pitch-panel--hero" :aria-label="`${pitch.company} role snapshot`">
        <div class="job-pitch-panel__bar">
          <span />
          <span />
          <span />
          <strong>{{ pitch.panel.file }}</strong>
        </div>
        <div class="job-pitch-score">
          <span class="job-pitch-score__label">{{ pitch.panel.scoreLabel }}</span>
          <span class="job-pitch-score__value">{{ pitch.panel.scoreValue }}</span>
        </div>

        <div v-if="pitch.panel.pizzaBadge" class="job-pitch-pizza-badge" aria-label="Pineapple pizza poll">
          <p>{{ pitch.panel.pizzaBadge.question }}</p>
          <div class="job-pitch-pizza-badge__row">
            <svg class="job-pitch-pizza-badge__icon" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M14 12c1-5 4-8 9-10 1 4 1 7-1 10 3-4 7-6 12-6-1 5-4 8-8 10 4-2 8-2 12 0-3 4-7 6-12 6" fill="#93c764" stroke="#40396e" stroke-linejoin="round" stroke-width="2" />
              <path d="M9 24c2-8 9-13 17-11 8 2 12 9 10 17-2 9-10 15-18 13S7 32 9 24Z" fill="#f3a23c" stroke="#40396e" stroke-width="2.4" />
              <path d="m13 20 19 15M20 15l17 13M10 28l15 13M33 19 15 38M25 14 10 30" fill="none" stroke="#d47f56" stroke-linecap="round" stroke-width="1.7" />
              <circle cx="35" cy="35" r="10" fill="#fff8e8" stroke="#40396e" stroke-width="2.2" />
              <path d="M30 43h8c1 0 2-.7 2.2-1.7l1.4-5.8c.4-1.5-.8-3-2.4-3h-4.1l.5-3c.2-1.3-.8-2.4-2.1-2.4H33l-4 6v10Z" fill="#31a85f" />
              <path d="M26 34h4v9h-4c-1 0-2-.9-2-2v-5c0-1.1.9-2 2-2Z" fill="#31a85f" />
              <path d="M30 35v7" fill="none" stroke="#fff8e8" stroke-linecap="round" stroke-width="1.4" />
            </svg>
            <span>
              <strong>{{ pitch.panel.pizzaBadge.percent }}</strong>
              <strong class="job-pitch-pizza-badge__answer">{{ pitch.panel.pizzaBadge.answer }}</strong>
            </span>
          </div>
        </div>

        <div v-if="pitch.panel.badge" class="job-pitch-role-badge">
          <p>{{ pitch.panel.badge.label }}</p>
          <strong>{{ pitch.panel.badge.value }}</strong>
          <span>{{ pitch.panel.badge.description }}</span>
        </div>

        <dl class="job-pitch-facts">
          <div v-for="fact in pitch.panel.facts" :key="fact.label">
            <dt>{{ fact.label }}</dt>
            <dd>{{ fact.value }}</dd>
          </div>
        </dl>
      </aside>
    </section>

    <section :id="relationshipId" class="job-pitch-section job-pitch-relationship">
      <div class="job-pitch-section__intro">
        <p class="job-pitch-kicker">{{ pitch.relationship.kicker }}</p>
        <h2>{{ pitch.relationship.heading }}</h2>
        <p class="job-pitch-relationship__copy">
          {{ pitch.relationship.copy }}
        </p>
      </div>

      <div class="job-pitch-relationship__grid">
        <article v-for="card in pitch.relationship.cards" :key="card.label" class="job-pitch-card">
          <span class="job-pitch-card__index">{{ card.label }}</span>
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
        </article>
      </div>
    </section>

    <section id="fit" class="job-pitch-section job-pitch-section--grid">
      <div class="job-pitch-section__intro">
        <p class="job-pitch-kicker">{{ pitch.fit.kicker }}</p>
        <h2>{{ pitch.fit.heading }}</h2>
      </div>

      <div class="job-pitch-card-grid">
        <article v-for="card in pitch.fit.cards" :key="card.index" class="job-pitch-card">
          <span class="job-pitch-card__index">{{ card.index }}</span>
          <h3>{{ card.heading }}</h3>
          <p>{{ card.description }}</p>
        </article>
      </div>
    </section>

    <section id="proof" class="job-pitch-section">
      <div class="job-pitch-section__intro job-pitch-section__intro--wide">
        <p class="job-pitch-kicker">{{ pitch.proof.kicker }}</p>
        <h2>{{ pitch.proof.heading }}</h2>
      </div>

      <div class="job-pitch-table" role="list">
        <article v-for="row in pitch.proof.rows" :key="row.label" class="job-pitch-table__row" role="listitem">
          <span>{{ row.label }}</span>
          <strong>{{ row.heading }}</strong>
          <p>{{ row.description }}</p>
        </article>
      </div>
    </section>

    <section class="job-pitch-section job-pitch-loop">
      <div class="job-pitch-section__intro">
        <p class="job-pitch-kicker">{{ pitch.loop.kicker }}</p>
        <h2>{{ pitch.loop.heading }}</h2>
      </div>

      <ol class="job-pitch-loop__steps">
        <li v-for="step in pitch.loop.steps" :key="step.label">
          <span>{{ step.label }}</span>
          <p>{{ step.description }}</p>
        </li>
      </ol>
    </section>

    <section id="ideas" class="job-pitch-section job-pitch-ideas">
      <div class="job-pitch-section__intro">
        <p class="job-pitch-kicker">{{ pitch.ideas.kicker }}</p>
        <h2>{{ pitch.ideas.heading }}</h2>
      </div>

      <div class="job-pitch-terminal">
        <div class="job-pitch-panel__bar">
          <span />
          <span />
          <span />
          <strong>{{ pitch.ideas.file }}</strong>
        </div>
        <ul>
          <li v-for="item in pitch.ideas.items" :key="item.label">
            <strong>{{ item.label }}:</strong>
            {{ item.description }}
          </li>
        </ul>
      </div>
    </section>

    <section id="contact" class="job-pitch-section job-pitch-contact">
      <div>
        <p class="job-pitch-kicker">Contact</p>
        <h2>{{ pitch.contactHeading }}</h2>
      </div>

      <div class="job-pitch-contact__links">
        <a
          v-for="item in contactLinks"
          :key="item.label"
          :href="item.href"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noreferrer' : undefined"
          @click="onContactLinkClick(item)"
        >
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </a>
      </div>
    </section>

    <footer class="job-pitch-footer">
      <span v-for="item in profile.contact.footer" :key="item">{{ item }}</span>
    </footer>
  </main>
</template>

<script setup>
import { profile } from '~/data/profile'

const props = defineProps({
  pitch: {
    type: Object,
    required: true
  },
  navItems: {
    type: Array,
    required: true
  },
  routePath: {
    type: String,
    required: true
  },
  analyticsPrefix: {
    type: String,
    required: true
  },
  cvHref: {
    type: String,
    default: '/api/cv/general.pdf'
  },
  cvOptions: {
    type: Array,
    default: () => []
  },
  cvLabel: {
    type: String,
    default: 'CV'
  },
  cvDownload: {
    type: String,
    default: 'Konrad-Straszewski-CV.pdf'
  },
  jobHref: {
    type: String,
    default: ''
  },
  jobLinks: {
    type: Array,
    default: () => []
  },
  jobLabel: {
    type: String,
    default: 'Role link'
  },
  theme: {
    type: String,
    default: 'posthog'
  },
  relationshipId: {
    type: String,
    default: 'role-use'
  }
})

const posthog = usePostHog()

const contactLinks = [profile.links.email, profile.links.github, profile.links.linkedin, profile.links.jasne]
const resolvedCvOptions = computed(() => {
  if (props.cvOptions.length) {
    return props.cvOptions
  }

  return [
    {
      href: props.cvHref,
      label: props.cvLabel,
      download: props.cvDownload,
      action: 'download_cv'
    }
  ]
})
const resolvedJobLinks = computed(() => {
  if (props.jobLinks.length) {
    return props.jobLinks
  }

  return props.jobHref
    ? [
        {
          href: props.jobHref,
          label: props.jobLabel,
          action: 'job_link'
        }
      ]
    : []
})

const onHeroCta = (action) => {
  posthog?.capture(`${props.analyticsPrefix}_hero_cta_clicked`, { action })
}

const onContactLinkClick = (item) => {
  posthog?.capture(`${props.analyticsPrefix}_contact_link_clicked`, {
    label: item.label,
    href: item.href,
  })
}

onMounted(() => {
  posthog?.capture(`${props.analyticsPrefix}_page_viewed`)
})

useRouteSeo(props.routePath)
</script>

<style scoped>
.job-pitch-page {
  --ph-bg: #f7f0df;
  --ph-paper: #fff8e8;
  --ph-ink: #15130f;
  --ph-muted: #6e675a;
  --ph-line: #15130f;
  --ph-orange: #e05f2f;
  --ph-yellow: #f4c84b;
  --ph-green: #4d8d5a;
  min-height: 100vh;
  overflow-x: clip;
  background:
    linear-gradient(rgba(21, 19, 15, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(21, 19, 15, 0.035) 1px, transparent 1px),
    var(--ph-bg);
  background-size: 36px 36px;
  color: var(--ph-ink);
  font-family: var(--font-body);
}

.job-pitch-page--linear {
  --ph-bg: #08090a;
  --ph-paper: #121317;
  --ph-ink: #f4f5f8;
  --ph-muted: #8a8f98;
  --ph-line: rgba(244, 245, 248, 0.14);
  --ph-orange: #5e6ad2;
  --ph-yellow: #4ea7fc;
  --ph-green: #4cb782;
}

.job-pitch-page--medusa {
  --ph-bg: #f7f7f3;
  --ph-paper: #ffffff;
  --ph-ink: #111111;
  --ph-muted: #666761;
  --ph-line: #d9d9d2;
  --ph-orange: #111111;
  --ph-yellow: #e9f861;
  --ph-green: #21a567;
}

.job-pitch-page--n8n {
  --ph-bg: #fff7fa;
  --ph-paper: #ffffff;
  --ph-ink: #040506;
  --ph-muted: #725c65;
  --ph-line: #efb8c7;
  --ph-orange: #ea4b71;
  --ph-yellow: #ffe4ec;
  --ph-green: #27c281;
}

.job-pitch-nav {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-width: 0;
  padding: 18px 5vw;
  border-bottom: 2px solid var(--ph-line);
  background: color-mix(in srgb, var(--ph-bg) 92%, transparent);
  backdrop-filter: blur(12px);
}

.job-pitch-nav__brand,
.job-pitch-nav__links,
.job-pitch-nav__links a {
  display: flex;
  align-items: center;
}

.job-pitch-nav__brand {
  gap: 12px;
  min-width: 0;
  color: var(--ph-ink);
  font-weight: 700;
  text-decoration: none;
}

.job-pitch-nav__brand span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.job-pitch-nav__mark {
  display: inline-grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 2px solid var(--ph-line);
  background: var(--ph-orange);
  box-shadow: 3px 3px 0 var(--ph-line);
  color: var(--ph-paper);
  font-family: var(--font-headline);
  font-style: italic;
}

.job-pitch-nav__links {
  gap: 8px;
  min-width: 0;
}

.job-pitch-nav__links a {
  flex: 0 0 auto;
  min-height: 34px;
  padding: 0 12px;
  border: 2px solid transparent;
  color: var(--ph-muted);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0;
  text-decoration: none;
  text-transform: uppercase;
}

.job-pitch-nav__links a:hover {
  border-color: var(--ph-line);
  background: var(--ph-paper);
  color: var(--ph-ink);
}

.job-pitch-hero,
.job-pitch-section {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding-inline: 5vw;
}

.job-pitch-hero {
  display: grid;
  grid-template-columns: minmax(0, 0.98fr) minmax(360px, 0.72fr);
  gap: 70px;
  align-items: center;
  min-width: 0;
  min-height: calc(100svh - 74px);
  padding-top: 54px;
  padding-bottom: 58px;
}

.job-pitch-kicker {
  display: inline-flex;
  max-width: 100%;
  margin: 0 0 16px;
  padding: 6px 10px;
  border: 2px solid var(--ph-line);
  background: var(--ph-yellow);
  box-shadow: 3px 3px 0 var(--ph-line);
  color: var(--ph-ink);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.25;
  overflow-wrap: anywhere;
  text-transform: uppercase;
}

.job-pitch-hero h1,
.job-pitch-section h2 {
  max-width: 930px;
  margin: 0;
  font-family: var(--font-headline);
  font-weight: 600;
  letter-spacing: 0;
  line-height: 0.98;
  text-wrap: balance;
}

.job-pitch-hero h1 {
  max-width: 720px;
  font-size: 6.3rem;
  line-height: 0.94;
}

.job-pitch-section h2 {
  font-size: 4.8rem;
}

.job-pitch-hero__lead {
  max-width: 620px;
  margin: 26px 0 0;
  color: var(--ph-muted);
  font-size: 1.08rem;
  line-height: 1.48;
}

.job-pitch-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.job-pitch-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  min-width: 0;
  padding: 0 20px;
  border: 2px solid var(--ph-line);
  background: var(--ph-paper);
  box-shadow: 4px 4px 0 var(--ph-line);
  color: var(--ph-ink);
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.job-pitch-button:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--ph-line);
}

.job-pitch-button--primary {
  background: var(--ph-orange);
  color: var(--ph-paper);
}

.job-pitch-panel,
.job-pitch-card,
.job-pitch-table,
.job-pitch-terminal,
.job-pitch-loop__steps li,
.job-pitch-contact__links a {
  border: 2px solid var(--ph-line);
  background: var(--ph-paper);
  box-shadow: 6px 6px 0 var(--ph-line);
  min-width: 0;
}

.job-pitch-panel--hero {
  align-self: center;
  width: min(100%, 430px);
  justify-self: end;
}

.job-pitch-panel__bar {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 14px;
  border-bottom: 2px solid var(--ph-line);
  background: color-mix(in srgb, var(--ph-paper) 72%, var(--ph-yellow));
  font-family: var(--font-mono);
  font-size: 0.78rem;
}

.job-pitch-panel__bar span {
  width: 11px;
  height: 11px;
  border: 2px solid var(--ph-line);
  border-radius: 999px;
  background: var(--ph-orange);
}

.job-pitch-panel__bar span:nth-child(2) {
  background: var(--ph-yellow);
}

.job-pitch-panel__bar span:nth-child(3) {
  background: var(--ph-green);
}

.job-pitch-panel__bar strong {
  margin-left: auto;
  overflow: hidden;
  color: var(--ph-muted);
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.job-pitch-score {
  margin: 22px 22px 18px;
  padding: 20px;
  border: 2px solid var(--ph-line);
  background: var(--ph-orange);
  color: var(--ph-paper);
}

.job-pitch-score__label,
.job-pitch-score__value {
  display: block;
}

.job-pitch-score__label,
.job-pitch-facts dt,
.job-pitch-table__row span,
.job-pitch-contact__links span {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.job-pitch-score__value {
  margin-top: 10px;
  font-family: var(--font-headline);
  font-size: 2.15rem;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1;
  overflow-wrap: anywhere;
}

.job-pitch-pizza-badge,
.job-pitch-role-badge {
  margin: 0 22px 18px;
  padding: 14px 16px 16px;
  border: 2px solid #373a46;
  background: #202129;
  box-shadow: 4px 4px 0 rgba(21, 19, 15, 0.9);
  color: #f4f0ea;
}

.job-pitch-pizza-badge p,
.job-pitch-role-badge p {
  margin: 0 0 8px;
  font-size: 0.98rem;
  font-weight: 800;
  line-height: 1.18;
}

.job-pitch-pizza-badge__row {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #f4f0ea;
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.1;
}

.job-pitch-pizza-badge__icon {
  flex: 0 0 auto;
  width: 42px;
  height: 42px;
}

.job-pitch-pizza-badge__answer,
.job-pitch-role-badge strong {
  color: #4dc878;
}

.job-pitch-role-badge strong,
.job-pitch-role-badge span {
  display: block;
}

.job-pitch-role-badge strong {
  font-size: 1.32rem;
  line-height: 1.12;
}

.job-pitch-role-badge span {
  margin-top: 8px;
  color: #d8d1c6;
  font-size: 0.92rem;
  line-height: 1.38;
}

.job-pitch-facts {
  display: grid;
  gap: 0;
  margin: 18px 22px 22px;
  border: 2px solid var(--ph-line);
  border-bottom: 0;
}

.job-pitch-facts div {
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr);
  gap: 14px;
  padding: 13px 14px;
  border-bottom: 2px solid var(--ph-line);
}

.job-pitch-facts dt {
  color: var(--ph-muted);
}

.job-pitch-facts dd {
  margin: 0;
  font-weight: 700;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.job-pitch-section {
  padding-top: 68px;
  padding-bottom: 68px;
}

.job-pitch-section--grid {
  display: grid;
  grid-template-columns: minmax(260px, 0.85fr) minmax(0, 1.15fr);
  gap: 40px;
  align-items: start;
  min-width: 0;
}

.job-pitch-relationship {
  display: grid;
  grid-template-columns: minmax(300px, 0.9fr) minmax(0, 1.1fr);
  gap: 40px;
  align-items: start;
  min-width: 0;
  padding-top: 34px;
}

.job-pitch-relationship__copy {
  max-width: 560px;
  margin: 24px 0 0;
  color: var(--ph-muted);
  font-size: 1.04rem;
  line-height: 1.55;
}

.job-pitch-relationship__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  min-width: 0;
}

.job-pitch-relationship__grid .job-pitch-card {
  min-height: 230px;
}

.job-pitch-section__intro {
  position: sticky;
  top: 104px;
}

.job-pitch-section__intro--wide {
  position: static;
  margin-bottom: 30px;
}

.job-pitch-card-grid {
  display: grid;
  gap: 18px;
}

.job-pitch-card {
  position: relative;
  min-height: 190px;
  padding: 26px;
}

.job-pitch-card__index {
  display: inline-flex;
  margin-bottom: 34px;
  color: var(--ph-orange);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 700;
}

.job-pitch-card h3,
.job-pitch-table__row strong,
.job-pitch-loop__steps span,
.job-pitch-contact h2 {
  margin: 0;
  font-family: var(--font-headline);
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1.06;
}

.job-pitch-card h3 {
  font-size: 2rem;
}

.job-pitch-card p,
.job-pitch-table__row p,
.job-pitch-loop__steps p,
.job-pitch-terminal li {
  color: var(--ph-muted);
  line-height: 1.52;
}

.job-pitch-card p {
  max-width: 680px;
  margin: 14px 0 0;
  font-size: 1rem;
}

.job-pitch-table {
  overflow: hidden;
}

.job-pitch-table__row {
  display: grid;
  grid-template-columns: 150px minmax(260px, 0.9fr) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
  min-width: 0;
  padding: 22px;
  border-bottom: 2px solid var(--ph-line);
}

.job-pitch-table__row:last-child {
  border-bottom: 0;
}

.job-pitch-table__row span {
  color: var(--ph-orange);
}

.job-pitch-table__row strong {
  font-size: 1.45rem;
}

.job-pitch-table__row p {
  margin: 0;
}

.job-pitch-loop {
  display: grid;
  grid-template-columns: minmax(260px, 0.75fr) minmax(0, 1.25fr);
  gap: 40px;
  min-width: 0;
}

.job-pitch-loop__steps {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.job-pitch-loop__steps li {
  min-height: 210px;
  padding: 24px;
}

.job-pitch-loop__steps span {
  display: block;
  font-size: 2.6rem;
}

.job-pitch-loop__steps p {
  margin: 48px 0 0;
}

.job-pitch-ideas {
  display: grid;
  grid-template-columns: minmax(260px, 0.72fr) minmax(0, 1.28fr);
  gap: 40px;
  min-width: 0;
}

.job-pitch-terminal {
  overflow: hidden;
  background: #16120f;
  color: var(--ph-paper);
}

.job-pitch-terminal .job-pitch-panel__bar {
  background: #2a211a;
  color: var(--ph-paper);
}

.job-pitch-terminal ul {
  display: grid;
  gap: 18px;
  margin: 0;
  padding: 28px;
  list-style: none;
  min-width: 0;
}

.job-pitch-terminal li {
  position: relative;
  padding-left: 24px;
  color: #d4c8b4;
}

.job-pitch-terminal li::before {
  position: absolute;
  left: 0;
  color: var(--ph-orange);
  content: ">";
  font-family: var(--font-mono);
}

.job-pitch-terminal strong {
  color: var(--ph-paper);
}

.job-pitch-contact {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.85fr);
  gap: 40px;
  min-width: 0;
  padding-bottom: 110px;
}

.job-pitch-contact h2 {
  max-width: 760px;
  font-size: 5.4rem;
}

.job-pitch-contact__links {
  display: grid;
  gap: 16px;
}

.job-pitch-contact__links a {
  display: grid;
  gap: 10px;
  padding: 20px;
  color: var(--ph-ink);
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.job-pitch-contact__links a:hover {
  transform: translate(2px, 2px);
  box-shadow: 3px 3px 0 var(--ph-line);
}

.job-pitch-contact__links span {
  color: var(--ph-orange);
}

.job-pitch-contact__links strong {
  font-size: 1.05rem;
  overflow-wrap: anywhere;
  white-space: nowrap;
}

.job-pitch-footer {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  max-width: 1240px;
  margin: 0 auto;
  padding: 28px 5vw 44px;
  border-top: 2px solid var(--ph-line);
  color: var(--ph-muted);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.job-pitch-page--linear {
  background:
    radial-gradient(circle at 78% 8%, rgba(94, 106, 210, 0.26), transparent 30%),
    radial-gradient(circle at 15% 88%, rgba(78, 167, 252, 0.16), transparent 28%),
    linear-gradient(180deg, #08090a 0%, #101116 48%, #08090a 100%);
}

.job-pitch-page--linear .job-pitch-nav {
  border-bottom: 1px solid rgba(244, 245, 248, 0.1);
  background: rgba(8, 9, 10, 0.76);
}

.job-pitch-page--linear .job-pitch-nav__mark {
  border: 1px solid rgba(244, 245, 248, 0.16);
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(94, 106, 210, 0.95), rgba(78, 167, 252, 0.72));
  box-shadow: 0 14px 34px rgba(94, 106, 210, 0.26);
  color: #ffffff;
}

.job-pitch-page--linear .job-pitch-nav__links a:hover {
  border-color: rgba(244, 245, 248, 0.16);
  background: rgba(244, 245, 248, 0.07);
}

.job-pitch-page--linear .job-pitch-kicker {
  border: 1px solid rgba(94, 106, 210, 0.35);
  border-radius: 999px;
  background: rgba(94, 106, 210, 0.12);
  box-shadow: none;
  color: #cfd3ff;
}

.job-pitch-page--linear .job-pitch-hero h1,
.job-pitch-page--linear .job-pitch-section h2,
.job-pitch-page--linear .job-pitch-card h3,
.job-pitch-page--linear .job-pitch-table__row strong,
.job-pitch-page--linear .job-pitch-loop__steps span,
.job-pitch-page--linear .job-pitch-contact h2 {
  font-family: var(--font-body);
  font-weight: 600;
}

.job-pitch-page--linear .job-pitch-hero h1 {
  line-height: 1.02;
}

.job-pitch-page--linear .job-pitch-button {
  border: 1px solid rgba(244, 245, 248, 0.14);
  border-radius: 8px;
  background: rgba(244, 245, 248, 0.06);
  box-shadow: none;
  color: #f4f5f8;
}

.job-pitch-page--linear .job-pitch-button:hover {
  transform: translateY(-1px);
  border-color: rgba(244, 245, 248, 0.24);
  background: rgba(244, 245, 248, 0.1);
  box-shadow: none;
}

.job-pitch-page--linear .job-pitch-button--primary {
  border-color: rgba(94, 106, 210, 0.72);
  background: linear-gradient(135deg, #5e6ad2, #4ea7fc);
}

.job-pitch-page--linear .job-pitch-panel,
.job-pitch-page--linear .job-pitch-card,
.job-pitch-page--linear .job-pitch-table,
.job-pitch-page--linear .job-pitch-terminal,
.job-pitch-page--linear .job-pitch-loop__steps li,
.job-pitch-page--linear .job-pitch-contact__links a {
  border: 1px solid rgba(244, 245, 248, 0.12);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(26, 28, 31, 0.86), rgba(13, 14, 18, 0.94));
  box-shadow: 0 18px 70px rgba(0, 0, 0, 0.32);
}

.job-pitch-page--linear .job-pitch-panel__bar {
  border-bottom: 1px solid rgba(244, 245, 248, 0.1);
  background: rgba(244, 245, 248, 0.04);
}

.job-pitch-page--linear .job-pitch-panel__bar span {
  border: 0;
  box-shadow: 0 0 24px currentColor;
}

.job-pitch-page--linear .job-pitch-score,
.job-pitch-page--linear .job-pitch-role-badge {
  border: 1px solid rgba(244, 245, 248, 0.1);
  border-radius: 8px;
  background: rgba(94, 106, 210, 0.12);
  box-shadow: none;
}

.job-pitch-page--linear .job-pitch-facts {
  border: 1px solid rgba(244, 245, 248, 0.1);
  border-bottom: 0;
}

.job-pitch-page--linear .job-pitch-facts div,
.job-pitch-page--linear .job-pitch-table__row {
  border-bottom-color: rgba(244, 245, 248, 0.1);
}

.job-pitch-page--linear .job-pitch-terminal {
  background: #08090a;
}

.job-pitch-page--linear .job-pitch-terminal .job-pitch-panel__bar {
  background: #121317;
}

.job-pitch-page--linear .job-pitch-terminal li {
  color: #b4bcd0;
}

.job-pitch-page--linear .job-pitch-footer {
  border-top-color: rgba(244, 245, 248, 0.1);
}

.job-pitch-page--medusa {
  background:
    linear-gradient(rgba(17, 17, 17, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17, 17, 17, 0.035) 1px, transparent 1px),
    linear-gradient(180deg, #fbfbf8 0%, #f3f4ee 100%);
  background-size: 72px 72px, 72px 72px, auto;
}

.job-pitch-page--medusa .job-pitch-nav {
  border-bottom: 1px solid #d9d9d2;
  background: rgba(247, 247, 243, 0.88);
}

.job-pitch-page--medusa .job-pitch-nav__mark,
.job-pitch-page--medusa .job-pitch-button,
.job-pitch-page--medusa .job-pitch-kicker,
.job-pitch-page--medusa .job-pitch-panel,
.job-pitch-page--medusa .job-pitch-card,
.job-pitch-page--medusa .job-pitch-table,
.job-pitch-page--medusa .job-pitch-terminal,
.job-pitch-page--medusa .job-pitch-loop__steps li,
.job-pitch-page--medusa .job-pitch-contact__links a {
  border-width: 1px;
  border-radius: 8px;
  box-shadow: none;
}

.job-pitch-page--medusa .job-pitch-nav__mark {
  background: #111111;
  color: #ffffff;
}

.job-pitch-page--medusa .job-pitch-kicker {
  background: #e9f861;
  color: #111111;
}

.job-pitch-page--medusa .job-pitch-button {
  background: #ffffff;
}

.job-pitch-page--medusa .job-pitch-button--primary,
.job-pitch-page--medusa .job-pitch-score {
  background: #111111;
  color: #ffffff;
}

.job-pitch-page--medusa .job-pitch-panel__bar {
  border-bottom-width: 1px;
  background: #f2f2ee;
}

.job-pitch-page--medusa .job-pitch-panel__bar span {
  border-width: 1px;
}

.job-pitch-page--medusa .job-pitch-role-badge {
  border: 1px solid #d9d9d2;
  border-radius: 8px;
  background: #111111;
  box-shadow: none;
}

.job-pitch-page--medusa .job-pitch-role-badge strong {
  color: #e9f861;
}

.job-pitch-page--medusa .job-pitch-facts {
  border-width: 1px;
}

.job-pitch-page--medusa .job-pitch-facts div,
.job-pitch-page--medusa .job-pitch-table__row {
  border-bottom-width: 1px;
}

.job-pitch-page--medusa .job-pitch-card::before {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: #21a567;
  content: "";
}

.job-pitch-page--n8n {
  background:
    radial-gradient(circle at 24px 24px, rgba(234, 75, 113, 0.22) 2px, transparent 2px),
    linear-gradient(rgba(234, 75, 113, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(234, 75, 113, 0.08) 1px, transparent 1px),
    #fff7fa;
  background-size: 64px 64px, 32px 32px, 32px 32px, auto;
}

.job-pitch-page--n8n .job-pitch-nav {
  border-bottom: 1px solid #efb8c7;
  background: rgba(255, 247, 250, 0.9);
}

.job-pitch-page--n8n .job-pitch-nav__mark {
  border: 0;
  border-radius: 8px;
  background: #ea4b71;
  box-shadow: 0 10px 28px rgba(234, 75, 113, 0.28);
  color: #ffffff;
}

.job-pitch-page--n8n .job-pitch-kicker {
  border: 1px solid #f1aac0;
  border-radius: 8px;
  background: #ffe4ec;
  box-shadow: none;
  color: #9f2447;
}

.job-pitch-page--n8n .job-pitch-panel,
.job-pitch-page--n8n .job-pitch-card,
.job-pitch-page--n8n .job-pitch-table,
.job-pitch-page--n8n .job-pitch-terminal,
.job-pitch-page--n8n .job-pitch-loop__steps li,
.job-pitch-page--n8n .job-pitch-contact__links a {
  border: 1px solid #efb8c7;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 42px rgba(73, 30, 43, 0.08);
}

.job-pitch-page--n8n .job-pitch-card,
.job-pitch-page--n8n .job-pitch-loop__steps li {
  overflow: visible;
}

.job-pitch-page--n8n .job-pitch-card::before,
.job-pitch-page--n8n .job-pitch-loop__steps li::before {
  position: absolute;
  top: 22px;
  left: -7px;
  width: 12px;
  height: 12px;
  border: 2px solid #ffffff;
  border-radius: 999px;
  background: #ea4b71;
  box-shadow: 0 0 0 1px #efb8c7;
  content: "";
}

.job-pitch-page--n8n .job-pitch-loop__steps li {
  position: relative;
}

.job-pitch-page--n8n .job-pitch-panel__bar {
  border-bottom: 1px solid #efb8c7;
  background: #fff1f5;
}

.job-pitch-page--n8n .job-pitch-panel__bar span {
  border: 1px solid #efb8c7;
}

.job-pitch-page--n8n .job-pitch-score,
.job-pitch-page--n8n .job-pitch-role-badge {
  border: 1px solid #040506;
  border-radius: 8px;
  background: #040506;
  box-shadow: none;
}

.job-pitch-page--n8n .job-pitch-role-badge strong {
  color: #ff7898;
}

.job-pitch-page--n8n .job-pitch-facts {
  border: 1px solid #efb8c7;
  border-bottom: 0;
}

.job-pitch-page--n8n .job-pitch-facts div,
.job-pitch-page--n8n .job-pitch-table__row {
  border-bottom-color: #efb8c7;
  border-bottom-width: 1px;
}

.job-pitch-page--n8n .job-pitch-button {
  border: 1px solid #efb8c7;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: none;
}

.job-pitch-page--n8n .job-pitch-button--primary {
  border-color: #ea4b71;
  background: #ea4b71;
  color: #ffffff;
}

.job-pitch-page--n8n .job-pitch-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 30px rgba(234, 75, 113, 0.14);
}

.job-pitch-page--n8n .job-pitch-terminal {
  background: #040506;
}

.job-pitch-page--n8n .job-pitch-terminal .job-pitch-panel__bar {
  background: #161416;
  color: #ffffff;
}

.job-pitch-page--n8n .job-pitch-terminal li {
  color: #f5dce5;
}

@media (max-width: 980px) {
  .job-pitch-hero,
  .job-pitch-relationship,
  .job-pitch-section--grid,
  .job-pitch-loop,
  .job-pitch-ideas,
  .job-pitch-contact {
    grid-template-columns: 1fr;
  }

  .job-pitch-section__intro {
    position: static;
  }

  .job-pitch-panel--hero {
    width: 100%;
    justify-self: stretch;
    min-height: auto;
  }

  .job-pitch-table__row {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .job-pitch-contact__links strong {
    white-space: normal;
  }

  .job-pitch-hero h1 {
    font-size: 4.8rem;
  }

  .job-pitch-section h2,
  .job-pitch-contact h2 {
    font-size: 3.8rem;
  }
}

@media (max-width: 720px) {
  .job-pitch-nav {
    align-items: flex-start;
    flex-direction: column;
    padding: 14px 5vw;
  }

  .job-pitch-nav__links {
    width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: 4px;
    -webkit-overflow-scrolling: touch;
  }

  .job-pitch-nav__links::-webkit-scrollbar {
    display: none;
  }

  .job-pitch-hero {
    min-height: auto;
    padding-top: 58px;
    padding-bottom: 44px;
  }

  .job-pitch-section {
    padding-top: 48px;
    padding-bottom: 48px;
  }

  .job-pitch-hero h1 {
    font-size: 3.7rem;
    line-height: 0.98;
  }

  .job-pitch-hero__lead {
    font-size: 1.06rem;
  }

  .job-pitch-facts div,
  .job-pitch-relationship__grid,
  .job-pitch-loop__steps {
    grid-template-columns: 1fr;
  }

  .job-pitch-card,
  .job-pitch-relationship__grid .job-pitch-card,
  .job-pitch-loop__steps li {
    min-height: auto;
  }

  .job-pitch-loop__steps p {
    margin-top: 28px;
  }

  .job-pitch-footer {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .job-pitch-nav__brand {
    font-size: 0.92rem;
  }

  .job-pitch-score,
  .job-pitch-pizza-badge,
  .job-pitch-role-badge,
  .job-pitch-facts {
    margin: 14px;
  }

  .job-pitch-score {
    padding: 18px;
  }

  .job-pitch-score__value {
    font-size: 2rem;
  }

  .job-pitch-hero,
  .job-pitch-section {
    padding-right: 18px;
    padding-left: 18px;
  }

  .job-pitch-hero {
    gap: 34px;
    padding-top: 44px;
  }

  .job-pitch-hero h1,
  .job-pitch-section h2,
  .job-pitch-contact h2 {
    font-size: 2.55rem;
    line-height: 1.04;
  }

  .job-pitch-hero__actions {
    display: grid;
  }

  .job-pitch-button {
    width: 100%;
  }

  .job-pitch-card {
    padding: 20px;
  }

  .job-pitch-card h3 {
    font-size: 1.65rem;
  }

  .job-pitch-table__row,
  .job-pitch-terminal ul,
  .job-pitch-loop__steps li,
  .job-pitch-contact__links a {
    padding: 20px;
  }
}
</style>
