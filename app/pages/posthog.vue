<template>
  <main class="posthog-page">
    <header class="posthog-nav">
      <a class="posthog-nav__brand" href="/" aria-label="Back to Konrad Straszewski homepage">
        <span class="posthog-nav__mark" aria-hidden="true">{{ profile.person.initials }}</span>
        <span>{{ profile.person.name }}</span>
      </a>

      <nav class="posthog-nav__links" aria-label="PostHog pitch sections">
        <a v-for="item in profile.nav.posthog" :key="item.href" :href="item.href">{{ item.label }}</a>
      </nav>
    </header>

    <section class="posthog-hero">
      <div class="posthog-hero__copy">
        <p class="posthog-kicker">{{ profile.posthog.hero.kicker }}</p>
        <h1>{{ profile.posthog.hero.headline }}</h1>
        <p class="posthog-hero__lead">
          {{ profile.posthog.hero.lead }}
        </p>
        <div class="posthog-hero__actions">
          <a class="posthog-button posthog-button--primary" :href="profile.links.email.href">
            Email me
          </a>
          <a class="posthog-button" :href="profile.links.github.href" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>

      <aside class="posthog-panel posthog-panel--hero" aria-label="Product engineer snapshot">
        <div class="posthog-panel__bar">
          <span />
          <span />
          <span />
          <strong>{{ profile.posthog.panel.file }}</strong>
        </div>
        <div class="posthog-score">
          <span class="posthog-score__label">{{ profile.posthog.panel.scoreLabel }}</span>
          <span class="posthog-score__value">{{ profile.posthog.panel.scoreValue }}</span>
        </div>
        <dl class="posthog-facts">
          <div v-for="fact in profile.posthog.panel.facts" :key="fact.label">
            <dt>{{ fact.label }}</dt>
            <dd>{{ fact.value }}</dd>
          </div>
        </dl>
      </aside>
    </section>

    <section id="fit" class="posthog-section posthog-section--grid">
      <div class="posthog-section__intro">
        <p class="posthog-kicker">{{ profile.posthog.fit.kicker }}</p>
        <h2>{{ profile.posthog.fit.heading }}</h2>
      </div>

      <div class="posthog-card-grid">
        <article v-for="card in profile.posthog.fit.cards" :key="card.index" class="posthog-card">
          <span class="posthog-card__index">{{ card.index }}</span>
          <h3>{{ card.heading }}</h3>
          <p>{{ card.description }}</p>
        </article>
      </div>
    </section>

    <section id="proof" class="posthog-section">
      <div class="posthog-section__intro posthog-section__intro--wide">
        <p class="posthog-kicker">{{ profile.posthog.proof.kicker }}</p>
        <h2>{{ profile.posthog.proof.heading }}</h2>
      </div>

      <div class="posthog-table" role="list">
        <article v-for="row in profile.posthog.proof.rows" :key="row.label" class="posthog-table__row" role="listitem">
          <span>{{ row.label }}</span>
          <strong>{{ row.heading }}</strong>
          <p>{{ row.description }}</p>
        </article>
      </div>
    </section>

    <section class="posthog-section posthog-loop">
      <div class="posthog-section__intro">
        <p class="posthog-kicker">{{ profile.posthog.loop.kicker }}</p>
        <h2>{{ profile.posthog.loop.heading }}</h2>
      </div>

      <ol class="posthog-loop__steps">
        <li v-for="step in profile.posthog.loop.steps" :key="step.label">
          <span>{{ step.label }}</span>
          <p>{{ step.description }}</p>
        </li>
      </ol>
    </section>

    <section id="ideas" class="posthog-section posthog-ideas">
      <div class="posthog-section__intro">
        <p class="posthog-kicker">{{ profile.posthog.ideas.kicker }}</p>
        <h2>{{ profile.posthog.ideas.heading }}</h2>
      </div>

      <div class="posthog-terminal">
        <div class="posthog-panel__bar">
          <span />
          <span />
          <span />
          <strong>{{ profile.posthog.ideas.file }}</strong>
        </div>
        <ul>
          <li v-for="item in profile.posthog.ideas.items" :key="item.label">
            <strong>{{ item.label }}:</strong>
            {{ item.description }}
          </li>
        </ul>
      </div>
    </section>

    <section id="contact" class="posthog-section posthog-contact">
      <div>
        <p class="posthog-kicker">Contact</p>
        <h2>{{ profile.posthog.contactHeading }}</h2>
      </div>

      <div class="posthog-contact__links">
        <a
          v-for="item in posthogContactLinks"
          :key="item.label"
          :href="item.href"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noreferrer' : undefined"
        >
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </a>
      </div>
    </section>
  </main>
</template>

<script setup>
import { profile } from '~/data/profile'

const posthogContactLinks = [profile.links.email, profile.links.github, profile.links.linkedin]

useHead({
  title: profile.posthog.title,
  meta: [
    {
      name: 'description',
      content: profile.posthog.description
    }
  ]
})
</script>

<style scoped>
.posthog-page {
  --ph-bg: #f7f0df;
  --ph-paper: #fff8e8;
  --ph-ink: #15130f;
  --ph-muted: #6e675a;
  --ph-line: #15130f;
  --ph-orange: #e05f2f;
  --ph-yellow: #f4c84b;
  --ph-green: #4d8d5a;
  min-height: 100vh;
  background:
    linear-gradient(rgba(21, 19, 15, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(21, 19, 15, 0.035) 1px, transparent 1px),
    var(--ph-bg);
  background-size: 36px 36px;
  color: var(--ph-ink);
  font-family: var(--font-body);
}

.posthog-nav {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px 5vw;
  border-bottom: 2px solid var(--ph-line);
  background: rgba(247, 240, 223, 0.92);
  backdrop-filter: blur(12px);
}

.posthog-nav__brand,
.posthog-nav__links,
.posthog-nav__links a {
  display: flex;
  align-items: center;
}

.posthog-nav__brand {
  gap: 12px;
  color: var(--ph-ink);
  font-weight: 700;
  text-decoration: none;
}

.posthog-nav__mark {
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

.posthog-nav__links {
  gap: 8px;
}

.posthog-nav__links a {
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

.posthog-nav__links a:hover {
  border-color: var(--ph-line);
  background: var(--ph-paper);
  color: var(--ph-ink);
}

.posthog-hero,
.posthog-section {
  max-width: 1240px;
  margin: 0 auto;
  padding-inline: 5vw;
}

.posthog-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(340px, 0.75fr);
  gap: 44px;
  align-items: end;
  padding-top: 86px;
  padding-bottom: 76px;
}

.posthog-kicker {
  display: inline-flex;
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
  text-transform: uppercase;
}

.posthog-hero h1,
.posthog-section h2 {
  max-width: 930px;
  margin: 0;
  font-family: var(--font-headline);
  font-weight: 600;
  letter-spacing: 0;
  line-height: 0.98;
  text-wrap: balance;
}

.posthog-hero h1 {
  font-size: clamp(4.2rem, 8vw, 8.8rem);
}

.posthog-section h2 {
  font-size: clamp(2.6rem, 5vw, 5.5rem);
}

.posthog-hero__lead {
  max-width: 760px;
  margin: 30px 0 0;
  color: var(--ph-muted);
  font-size: 1.22rem;
  line-height: 1.55;
}

.posthog-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 34px;
}

.posthog-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 20px;
  border: 2px solid var(--ph-line);
  background: var(--ph-paper);
  box-shadow: 4px 4px 0 var(--ph-line);
  color: var(--ph-ink);
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.posthog-button:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--ph-line);
}

.posthog-button--primary {
  background: var(--ph-orange);
  color: var(--ph-paper);
}

.posthog-panel,
.posthog-card,
.posthog-table,
.posthog-terminal,
.posthog-loop__steps li,
.posthog-contact__links a {
  border: 2px solid var(--ph-line);
  background: var(--ph-paper);
  box-shadow: 6px 6px 0 var(--ph-line);
}

.posthog-panel--hero {
  align-self: stretch;
  min-height: 420px;
}

.posthog-panel__bar {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 14px;
  border-bottom: 2px solid var(--ph-line);
  background: #efe2c6;
  font-family: var(--font-mono);
  font-size: 0.78rem;
}

.posthog-panel__bar span {
  width: 11px;
  height: 11px;
  border: 2px solid var(--ph-line);
  border-radius: 999px;
  background: var(--ph-orange);
}

.posthog-panel__bar span:nth-child(2) {
  background: var(--ph-yellow);
}

.posthog-panel__bar span:nth-child(3) {
  background: var(--ph-green);
}

.posthog-panel__bar strong {
  margin-left: auto;
  overflow: hidden;
  color: var(--ph-muted);
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.posthog-score {
  margin: 22px;
  padding: 22px;
  border: 2px solid var(--ph-line);
  background: var(--ph-orange);
  color: var(--ph-paper);
}

.posthog-score__label,
.posthog-score__value {
  display: block;
}

.posthog-score__label,
.posthog-facts dt,
.posthog-table__row span,
.posthog-contact__links span {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.posthog-score__value {
  margin-top: 10px;
  font-family: var(--font-headline);
  font-size: 2.4rem;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1;
}

.posthog-facts {
  display: grid;
  gap: 0;
  margin: 22px;
  border: 2px solid var(--ph-line);
  border-bottom: 0;
}

.posthog-facts div {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 16px;
  padding: 14px;
  border-bottom: 2px solid var(--ph-line);
}

.posthog-facts dt {
  color: var(--ph-muted);
}

.posthog-facts dd {
  margin: 0;
  font-weight: 700;
  line-height: 1.35;
}

.posthog-section {
  padding-top: 68px;
  padding-bottom: 68px;
}

.posthog-section--grid {
  display: grid;
  grid-template-columns: minmax(260px, 0.85fr) minmax(0, 1.15fr);
  gap: 40px;
  align-items: start;
}

.posthog-section__intro {
  position: sticky;
  top: 104px;
}

.posthog-section__intro--wide {
  position: static;
  margin-bottom: 30px;
}

.posthog-card-grid {
  display: grid;
  gap: 18px;
}

.posthog-card {
  position: relative;
  min-height: 190px;
  padding: 26px;
}

.posthog-card__index {
  display: inline-flex;
  margin-bottom: 34px;
  color: var(--ph-orange);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 700;
}

.posthog-card h3,
.posthog-table__row strong,
.posthog-loop__steps span,
.posthog-contact h2 {
  margin: 0;
  font-family: var(--font-headline);
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1.06;
}

.posthog-card h3 {
  font-size: 2rem;
}

.posthog-card p,
.posthog-table__row p,
.posthog-loop__steps p,
.posthog-terminal li {
  color: var(--ph-muted);
  line-height: 1.52;
}

.posthog-card p {
  max-width: 680px;
  margin: 14px 0 0;
  font-size: 1rem;
}

.posthog-table {
  overflow: hidden;
}

.posthog-table__row {
  display: grid;
  grid-template-columns: 150px minmax(260px, 0.9fr) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
  padding: 22px;
  border-bottom: 2px solid var(--ph-line);
}

.posthog-table__row:last-child {
  border-bottom: 0;
}

.posthog-table__row span {
  color: var(--ph-orange);
}

.posthog-table__row strong {
  font-size: 1.45rem;
}

.posthog-table__row p {
  margin: 0;
}

.posthog-loop {
  display: grid;
  grid-template-columns: minmax(260px, 0.75fr) minmax(0, 1.25fr);
  gap: 40px;
}

.posthog-loop__steps {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.posthog-loop__steps li {
  min-height: 210px;
  padding: 24px;
}

.posthog-loop__steps span {
  display: block;
  font-size: 2.6rem;
}

.posthog-loop__steps p {
  margin: 48px 0 0;
}

.posthog-ideas {
  display: grid;
  grid-template-columns: minmax(260px, 0.72fr) minmax(0, 1.28fr);
  gap: 40px;
}

.posthog-terminal {
  overflow: hidden;
  background: #16120f;
  color: var(--ph-paper);
}

.posthog-terminal .posthog-panel__bar {
  background: #2a211a;
  color: var(--ph-paper);
}

.posthog-terminal ul {
  display: grid;
  gap: 18px;
  margin: 0;
  padding: 28px;
  list-style: none;
}

.posthog-terminal li {
  position: relative;
  padding-left: 24px;
  color: #d4c8b4;
}

.posthog-terminal li::before {
  position: absolute;
  left: 0;
  color: var(--ph-orange);
  content: ">";
  font-family: var(--font-mono);
}

.posthog-terminal strong {
  color: var(--ph-paper);
}

.posthog-contact {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.85fr);
  gap: 40px;
  padding-bottom: 110px;
}

.posthog-contact h2 {
  max-width: 760px;
  font-size: clamp(2.7rem, 5.6vw, 6rem);
}

.posthog-contact__links {
  display: grid;
  gap: 16px;
}

.posthog-contact__links a {
  display: grid;
  gap: 10px;
  padding: 20px;
  color: var(--ph-ink);
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.posthog-contact__links a:hover {
  transform: translate(2px, 2px);
  box-shadow: 3px 3px 0 var(--ph-line);
}

.posthog-contact__links span {
  color: var(--ph-orange);
}

.posthog-contact__links strong {
  overflow-wrap: anywhere;
  font-size: 1.05rem;
}

@media (max-width: 980px) {
  .posthog-hero,
  .posthog-section--grid,
  .posthog-loop,
  .posthog-ideas,
  .posthog-contact {
    grid-template-columns: 1fr;
  }

  .posthog-section__intro {
    position: static;
  }

  .posthog-panel--hero {
    min-height: auto;
  }

  .posthog-table__row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

@media (max-width: 720px) {
  .posthog-nav {
    align-items: flex-start;
    flex-direction: column;
    padding: 14px 5vw;
  }

  .posthog-nav__links {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .posthog-hero {
    padding-top: 58px;
    padding-bottom: 44px;
  }

  .posthog-section {
    padding-top: 48px;
    padding-bottom: 48px;
  }

  .posthog-hero h1 {
    font-size: clamp(3.2rem, 17vw, 4.8rem);
  }

  .posthog-hero__lead {
    font-size: 1.06rem;
  }

  .posthog-facts div,
  .posthog-loop__steps {
    grid-template-columns: 1fr;
  }

  .posthog-card,
  .posthog-loop__steps li {
    min-height: auto;
  }

  .posthog-loop__steps p {
    margin-top: 28px;
  }
}

@media (max-width: 480px) {
  .posthog-nav__brand {
    font-size: 0.92rem;
  }

  .posthog-score,
  .posthog-facts {
    margin: 14px;
  }

  .posthog-score {
    padding: 18px;
  }

  .posthog-score__value {
    font-size: 2rem;
  }

  .posthog-panel,
  .posthog-card,
  .posthog-table,
  .posthog-terminal,
  .posthog-loop__steps li,
  .posthog-contact__links a,
  .posthog-button,
  .posthog-kicker,
  .posthog-nav__mark {
    box-shadow: 3px 3px 0 var(--ph-line);
  }
}
</style>
