<template>
  <main class="cv-page">
    <header class="cv-top">
      <NuxtLink class="cv-top__brand" to="/">
        <span class="cv-top__dot" aria-hidden="true" />
        <span>{{ profile.person.name }}</span>
      </NuxtLink>

      <span class="cv-top__meta">2 PDF variants</span>
    </header>

    <section class="cv-previews" aria-labelledby="cv-previews-title">
      <div class="cv-previews__intro">
        <p class="cv-eyebrow">Download CV</p>
        <h1 id="cv-previews-title">Pick the version you want to download.</h1>
      </div>

      <div class="cv-preview-grid">
        <article v-for="option in profile.cv.downloads" :key="option.href" class="cv-preview">
          <div class="cv-preview__header">
            <div>
              <p class="cv-preview__label">PDF variant</p>
              <h2>{{ option.label }}</h2>
              <p>{{ option.description }}</p>
            </div>

            <a :href="option.href" :download="downloadName(option.label)">Download</a>
          </div>

          <div
            class="cv-preview__paper"
            :class="{ 'cv-preview__paper--posthog': isPosthogDownload(option.label) }"
            aria-hidden="true"
          >
            <template v-if="isPosthogDownload(option.label)">
              <div class="cv-mini-ph__mast">
                <span>KS</span>
                <strong>Konrad Straszewski</strong>
              </div>
              <div class="cv-mini-ph__panel">
                <small>Application page / Product Engineer</small>
                <strong>I build product surfaces where AI turns intent into shipped UI.</strong>
              </div>
              <div class="cv-mini-ph__rows">
                <span>Proof points</span>
                <span>How I work</span>
                <span>Track record</span>
              </div>
            </template>

            <template v-else>
              <div class="cv-mini-general__head">
                <span>CV</span>
                <strong>{{ profile.person.name }}</strong>
                <small>{{ profile.person.role }}</small>
              </div>
              <div class="cv-mini-general__section">
                <span>Profile</span>
                <p>{{ profile.cv.summary }}</p>
              </div>
              <div class="cv-mini-general__rows">
                <span v-for="item in profile.track.experience.slice(0, 3)" :key="`${item.year}-${item.role}`">
                  {{ item.year }} · {{ item.role }}
                </span>
              </div>
            </template>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { profile } from '~/data/profile'

const downloadName = (label) =>
  label.includes('PostHog') ? 'Konrad-Straszewski-CV-PostHog.pdf' : 'Konrad-Straszewski-CV.pdf'
const isPosthogDownload = (label) => label.includes('PostHog')

useRouteSeo('/cv')
</script>

<style scoped>
.cv-page {
  min-height: 100vh;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
}

.cv-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  min-width: 0;
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 8vw;
}

.cv-top__brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  color: var(--ink);
  font-weight: 500;
  text-decoration: none;
}

.cv-top__brand span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cv-top__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
}

.cv-top__meta,
.cv-eyebrow,
.cv-preview__label {
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.cv-previews {
  max-width: 1280px;
  margin: 0 auto;
  padding: 46px 8vw 96px;
}

.cv-previews__intro {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 80px;
  align-items: end;
  min-width: 0;
  margin-bottom: 38px;
}

.cv-eyebrow {
  margin: 0;
  color: var(--accent);
}

.cv-previews__intro h1 {
  max-width: 860px;
  margin: 0;
  font-family: var(--font-headline);
  font-size: 4.2rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.02;
  text-wrap: balance;
}

.cv-preview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px;
  min-width: 0;
}

.cv-preview {
  display: grid;
  min-width: 0;
  border: 1px solid var(--rule);
  background: var(--bg);
}

.cv-preview__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  min-width: 0;
  padding: 22px;
  border-bottom: 1px solid var(--rule);
}

.cv-preview__header > div {
  min-width: 0;
}

.cv-preview__header h2 {
  margin: 6px 0;
  font-family: var(--font-headline);
  font-size: 1.7rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.05;
}

.cv-preview__header p {
  margin: 0;
  color: var(--dim);
  font-size: 0.875rem;
  line-height: 1.45;
}

.cv-preview__header a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 13px;
  border: 1px solid var(--ink);
  border-radius: 4px;
  background: var(--ink);
  color: var(--bg);
  flex: 0 0 auto;
  font-size: 0.8125rem;
  font-weight: 500;
  text-decoration: none;
}

.cv-preview__paper {
  position: relative;
  min-width: 0;
  min-height: 600px;
  padding: 38px;
  border-top: 1px solid var(--rule);
  background: #fbfbfa;
  overflow: hidden;
}

.cv-preview__paper::after {
  position: absolute;
  inset: 24px;
  border: 1px solid rgba(17, 17, 17, 0.12);
  content: "";
  pointer-events: none;
}

.cv-mini-general__head,
.cv-mini-general__section,
.cv-mini-general__rows {
  position: relative;
  z-index: 1;
}

.cv-mini-general__head {
  display: grid;
  gap: 7px;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--rule);
}

.cv-mini-general__head span,
.cv-mini-general__section span {
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.cv-mini-general__head strong {
  max-width: 280px;
  font-family: var(--font-headline);
  font-size: 2.05rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1;
  overflow-wrap: anywhere;
}

.cv-mini-general__head small {
  color: var(--dim);
  font-size: 0.8rem;
}

.cv-mini-general__section {
  padding: 30px 0;
  border-bottom: 1px solid var(--rule);
}

.cv-mini-general__section p {
  display: -webkit-box;
  margin: 12px 0 0;
  color: var(--ink);
  font-size: 0.875rem;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 7;
  overflow: hidden;
}

.cv-mini-general__rows {
  display: grid;
  gap: 14px;
  padding-top: 28px;
}

.cv-mini-general__rows span {
  padding-top: 10px;
  border-top: 1px solid var(--rule);
  color: var(--dim);
  font-size: 0.8125rem;
}

.cv-preview__paper--posthog {
  background:
    linear-gradient(rgba(21, 19, 15, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(21, 19, 15, 0.055) 1px, transparent 1px),
    #f7f0df;
  background-size: 34px 34px;
}

.cv-mini-ph__mast,
.cv-mini-ph__panel,
.cv-mini-ph__rows {
  position: relative;
  z-index: 1;
}

.cv-mini-ph__mast {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 16px;
  align-items: center;
}

.cv-mini-ph__mast span {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 2px solid var(--ink);
  background: #e05f2f;
  box-shadow: 5px 5px 0 var(--ink);
  color: #fff8e8;
  font-weight: 700;
}

.cv-mini-ph__mast strong {
  font-size: 1.05rem;
  line-height: 1;
}

.cv-mini-ph__panel {
  margin-top: 28px;
  border: 2px solid var(--ink);
  background: #fff8e8;
  box-shadow: 6px 6px 0 var(--ink);
}

.cv-mini-ph__panel small {
  display: block;
  padding: 12px 14px;
  border-bottom: 2px solid var(--ink);
  background: #efe2c6;
  font-size: 0.625rem;
  font-weight: 800;
}

.cv-mini-ph__panel strong {
  display: block;
  max-width: 320px;
  padding: 22px 14px 28px;
  font-family: var(--font-headline);
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.02;
  overflow-wrap: anywhere;
}

.cv-mini-ph__rows {
  display: grid;
  gap: 14px;
  margin-top: 34px;
}

.cv-mini-ph__rows span {
  padding: 12px 14px;
  border: 1px solid var(--ink);
  background: #fff8e8;
  color: #e05f2f;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
}

@media (max-width: 1060px) {
  .cv-top,
  .cv-previews {
    padding-right: 6vw;
    padding-left: 6vw;
  }

  .cv-previews__intro,
  .cv-preview-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .cv-previews__intro h1 {
    font-size: 3rem;
  }
}

@media (max-width: 620px) {
  .cv-top {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .cv-previews {
    padding-top: 28px;
    padding-bottom: 64px;
  }

  .cv-previews__intro h1 {
    font-size: 2.35rem;
  }

  .cv-preview__header {
    flex-direction: column;
    gap: 18px;
  }

  .cv-preview__header a {
    width: 100%;
  }

  .cv-preview__paper {
    min-height: 460px;
    padding: 28px;
  }
}

@media (max-width: 420px) {
  .cv-top {
    padding: 20px 18px;
  }

  .cv-previews {
    padding: 24px 18px 56px;
  }

  .cv-previews__intro h1 {
    font-size: 2rem;
    line-height: 1.08;
  }

  .cv-preview__header,
  .cv-preview__paper {
    padding: 20px;
  }

  .cv-preview__paper {
    min-height: 390px;
  }

  .cv-preview__paper::after {
    inset: 14px;
  }

  .cv-mini-general__head strong {
    font-size: 1.65rem;
  }

  .cv-mini-ph__panel strong {
    font-size: 1.6rem;
  }
}
</style>
