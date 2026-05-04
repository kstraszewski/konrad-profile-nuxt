<template>
  <main class="cv-page">
    <header class="cv-top">
      <NuxtLink class="cv-top__brand" to="/">
        <span class="cv-top__dot" aria-hidden="true" />
        <span>{{ profile.person.name }}</span>
      </NuxtLink>

      <span class="cv-top__meta">{{ profile.cv.downloads.length }} PDF files</span>
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
              <p class="cv-preview__label">PDF</p>
              <h2>{{ option.label }}</h2>
              <p>{{ option.description }}</p>
            </div>

            <a :href="option.href" :download="downloadName(option.label)" @click="onDownload(option.label)">Download</a>
          </div>

          <div
            class="cv-preview__paper"
            :class="previewClass(option.label)"
            aria-hidden="true"
          >
            <template v-if="isTargetedDownload(option.label)">
              <div class="cv-mini-ph__mast">
                <span>KS</span>
                <strong>Konrad Straszewski</strong>
              </div>
              <div class="cv-mini-ph__panel">
                <small>{{ posthogPreview(option.label).small }}</small>
                <strong>{{ posthogPreview(option.label).headline }}</strong>
              </div>
              <div class="cv-mini-ph__rows">
                <span>Proof points</span>
                <span>How I work</span>
                <span>Track record</span>
                <span>Outside work</span>
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
                <p>{{ generalPreviewSummary }}</p>
              </div>
              <div class="cv-mini-general__rows">
                <span v-for="item in profile.track.experience.slice(0, 2)" :key="`${item.year}-${item.role}`">
                  {{ item.year }} · {{ item.role }}
                </span>
                <span>Outside work · boxing, cars, technology, science</span>
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

const posthog = usePostHog()

const generalPreviewSummary =
  'Product Engineer and AI-native builder with 11 years across product engineering, frontend leadership, and AI adoption.'

const downloadName = (label) => {
  if (label.includes('Linear')) {
    return 'Konrad-Straszewski-CV-Linear-Fullstack-Engineer.pdf'
  }

  if (label.includes('Medusa')) {
    return 'Konrad-Straszewski-CV-Medusa-Product-Engineer.pdf'
  }

  if (label.includes('n8n') && label.includes('AI Engineer')) {
    return 'Konrad-Straszewski-CV-n8n-Sr-AI-Engineer.pdf'
  }

  if (label.includes('n8n') && label.includes('Product Engineer')) {
    return 'Konrad-Straszewski-CV-n8n-Product-Engineer.pdf'
  }

  if (label.includes('AI Research')) {
    return 'Konrad-Straszewski-CV-PostHog-AI-Research-Engineer.pdf'
  }

  if (label.includes('Product Manager')) {
    return 'Konrad-Straszewski-CV-PostHog-PM.pdf'
  }

  if (label.includes('Product Engineer')) {
    return 'Konrad-Straszewski-CV-PostHog-PE.pdf'
  }

  return 'Konrad-Straszewski-CV.pdf'
}
const isPosthogDownload = (label) => label.includes('PostHog')
const isN8nDownload = (label) => label.includes('n8n')
const isLinearDownload = (label) => label.includes('Linear')
const isMedusaDownload = (label) => label.includes('Medusa')
const isTargetedDownload = (label) =>
  isPosthogDownload(label) || isN8nDownload(label) || isLinearDownload(label) || isMedusaDownload(label)
const isPosthogAiResearchDownload = (label) => label.includes('AI Research')
const isPosthogPmDownload = (label) => label.includes('Product Manager')
const previewClass = (label) => ({
  'cv-preview__paper--posthog': isPosthogDownload(label),
  'cv-preview__paper--linear': isLinearDownload(label),
  'cv-preview__paper--medusa': isMedusaDownload(label),
  'cv-preview__paper--n8n': isN8nDownload(label)
})
const posthogPreview = (label) => {
  if (label.includes('Linear')) {
    return {
      small: 'Application page / Senior Fullstack Engineer',
      headline: 'I build product systems with ownership, speed, and taste.'
    }
  }

  if (label.includes('Medusa')) {
    return {
      small: 'Application page / Product Engineer',
      headline: 'I build developer products where code and product strategy stay together.'
    }
  }

  if (label.includes('n8n') && label.includes('AI Engineer')) {
    return {
      small: 'Application page / Sr AI Engineer',
      headline: 'I turn AI tools, agents, and workflows into production habits.'
    }
  }

  if (label.includes('n8n') && label.includes('Product Engineer')) {
    return {
      small: 'Application page / Senior Product Engineer',
      headline: 'I build product surfaces for technical users and keep the workflow honest.'
    }
  }

  if (isPosthogAiResearchDownload(label)) {
    return {
      small: 'Application page / AI Research Engineer',
      headline: 'I build the product-data loops that make AI systems useful.'
    }
  }

  if (isPosthogPmDownload(label)) {
    return {
      small: 'Application page / Product Manager',
      headline: 'I turn users, data, and commercial context into better product bets.'
    }
  }

  return {
    small: 'Application page / Product Engineer',
    headline: 'I build the product, instrument the truth, then keep shipping.'
  }
}

const onDownload = (label) => {
  const variant = label.includes('Linear')
    ? 'linear-fullstack-engineer'
    : label.includes('Medusa')
      ? 'medusa-product-engineer'
      : label.includes('n8n') && label.includes('AI Engineer')
    ? 'n8n-ai-engineer'
    : label.includes('n8n') && label.includes('Product Engineer')
      ? 'n8n-product-engineer'
      : isPosthogAiResearchDownload(label)
    ? 'posthog-ai-research'
    : isPosthogPmDownload(label)
      ? 'posthog-pm'
      : label.includes('Product Engineer')
        ? 'posthog-pe'
        : 'general'

  posthog?.capture('cv_downloaded', {
    variant,
    label,
  })
}

onMounted(() => {
  posthog?.capture('cv_page_viewed')
})

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
  max-width: 1440px;
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
  max-width: 1440px;
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
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
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
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  min-width: 0;
  padding: 20px;
  border-bottom: 1px solid var(--rule);
}

.cv-preview__header > div {
  min-width: 0;
}

.cv-preview__header h2 {
  margin: 6px 0;
  font-family: var(--font-headline);
  font-size: 1.32rem;
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
  min-height: 520px;
  padding: 26px;
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
  font-size: 1.8rem;
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

.cv-preview__paper--linear {
  background:
    linear-gradient(rgba(247, 248, 251, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(247, 248, 251, 0.03) 1px, transparent 1px),
    linear-gradient(180deg, #050608 0%, #090a0d 54%, #050608 100%);
  background-size: 64px 64px, 64px 64px, auto;
  color: #f4f5f8;
}

.cv-preview__paper--linear::after {
  border-color: rgba(247, 248, 251, 0.1);
}

.cv-preview__paper--medusa {
  background:
    linear-gradient(rgba(17, 17, 17, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17, 17, 17, 0.035) 1px, transparent 1px),
    linear-gradient(180deg, #fbfbf8 0%, #f3f4ee 100%);
  background-size: 72px 72px, 72px 72px, auto;
}

.cv-preview__paper--n8n {
  background:
    linear-gradient(135deg, rgba(255, 90, 61, 0.18) 0%, rgba(255, 90, 61, 0) 42%),
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(180deg, #100819 0%, #0b0712 54%, #15101f 100%);
  background-size: auto, 56px 56px, 56px 56px, auto;
  color: #fbf8ff;
}

.cv-preview__paper--n8n::before {
  position: absolute;
  right: 18px;
  bottom: 22px;
  width: 124px;
  height: 178px;
  background:
    linear-gradient(135deg, rgba(255, 247, 229, 0.9), rgba(255, 90, 61, 0.82) 48%, rgba(104, 143, 255, 0.54) 100%);
  clip-path: polygon(45% 0, 95% 0, 68% 42%, 100% 42%, 39% 100%, 51% 57%, 12% 57%);
  content: "";
  filter:
    drop-shadow(0 0 24px rgba(255, 90, 61, 0.4))
    drop-shadow(0 0 42px rgba(104, 143, 255, 0.18));
  opacity: 0.74;
  pointer-events: none;
}

.cv-preview__paper--n8n::after {
  border-color: rgba(255, 255, 255, 0.12);
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

.cv-preview__paper--linear .cv-mini-ph__mast span {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(247, 248, 251, 0.2);
  border-radius: 999px;
  background: #f7f8fb;
  box-shadow: none;
  color: transparent;
}

.cv-preview__paper--linear .cv-mini-ph__mast span::before {
  position: absolute;
  inset: 7px;
  border-radius: inherit;
  background: repeating-linear-gradient(
    45deg,
    #050608 0 4px,
    #050608 4px 7px,
    transparent 7px 10px
  );
  content: "";
  transform: rotate(-12deg);
}

.cv-preview__paper--medusa .cv-mini-ph__mast span {
  border-width: 1px;
  border-radius: 8px;
  background: #111111;
  box-shadow: none;
}

.cv-preview__paper--n8n .cv-mini-ph__mast span {
  border: 0;
  border-radius: 12px;
  background: #ff5a3d;
  box-shadow: 0 12px 34px rgba(255, 90, 61, 0.34);
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

.cv-preview__paper--linear .cv-mini-ph__panel,
.cv-preview__paper--linear .cv-mini-ph__rows span {
  border: 1px solid rgba(247, 248, 251, 0.1);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(16, 18, 22, 0.82), rgba(8, 9, 12, 0.94));
  box-shadow: none;
  color: #f7f8fb;
}

.cv-preview__paper--medusa .cv-mini-ph__panel,
.cv-preview__paper--medusa .cv-mini-ph__rows span {
  border: 1px solid #d9d9d2;
  border-radius: 8px;
  box-shadow: none;
}

.cv-preview__paper--n8n .cv-mini-ph__panel,
.cv-preview__paper--n8n .cv-mini-ph__rows span {
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 16px;
  background: rgba(23, 18, 32, 0.88);
  box-shadow:
    0 22px 70px rgba(0, 0, 0, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.cv-mini-ph__panel small {
  display: block;
  padding: 12px 14px;
  border-bottom: 2px solid var(--ink);
  background: #efe2c6;
  font-size: 0.625rem;
  font-weight: 800;
}

.cv-preview__paper--linear .cv-mini-ph__panel small {
  border-bottom: 1px solid rgba(247, 248, 251, 0.08);
  background: rgba(247, 248, 251, 0.035);
  color: #c9cdd7;
}

.cv-preview__paper--medusa .cv-mini-ph__panel small {
  border-bottom: 1px solid #d9d9d2;
  background: #e9f861;
}

.cv-preview__paper--n8n .cv-mini-ph__panel small {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(12, 8, 18, 0.78);
  color: #ffb09f;
}

.cv-mini-ph__panel strong {
  display: block;
  max-width: 320px;
  padding: 22px 14px 28px;
  font-family: var(--font-headline);
  font-size: 1.46rem;
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

.cv-preview__paper--linear .cv-mini-ph__rows span {
  color: #9ba1ff;
}

.cv-preview__paper--medusa .cv-mini-ph__rows span {
  color: #111111;
}

.cv-preview__paper--n8n .cv-mini-ph__rows span {
  color: #ffb09f;
}

@media (max-width: 1280px) {
  .cv-preview-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
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
