<template>
  <main class="cv-app">
    <section class="cv-app__hero">
      <p class="cv-app__eyebrow">Konrad Profile MCP</p>
      <h1>{{ context.person.name }}</h1>
      <p class="cv-app__lead">{{ context.positioning.summary }}</p>
    </section>

    <section class="cv-app__downloads" aria-labelledby="downloads-title">
      <div>
        <p class="cv-app__eyebrow">Recruiter action</p>
        <h2 id="downloads-title">Download CV</h2>
      </div>

      <div class="cv-app__download-list">
        <button
          v-for="download in downloads"
          :key="download.url"
          class="cv-app__download"
          type="button"
          @click="openDownload(download.url)"
        >
          <span>{{ download.label }}</span>
          <small>{{ download.description }}</small>
        </button>
      </div>
    </section>

    <section class="cv-app__facts" aria-label="Profile facts">
      <div v-for="fact in facts" :key="fact.label" class="cv-app__fact">
        <span>{{ fact.label }}</span>
        <strong>{{ fact.value }}</strong>
      </div>
    </section>

    <section class="cv-app__section">
      <p class="cv-app__eyebrow">Track record</p>
      <div class="cv-app__timeline">
        <article v-for="item in experience" :key="`${item.year}-${item.role}`" class="cv-app__role">
          <span>{{ item.year }}</span>
          <h3>{{ item.role }} · {{ item.org }}</h3>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </section>

    <section class="cv-app__section">
      <p class="cv-app__eyebrow">Ask next</p>
      <div class="cv-app__prompts">
        <button
          v-for="prompt in context.suggestedRecruiterQuestions"
          :key="prompt"
          type="button"
          @click="sendPrompt(prompt)"
        >
          {{ prompt }}
        </button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { buildProfileContext } from '../data/mcpProfile'

defineMcpApp({
  name: 'konrad-cv',
  title: "Konrad's CV",
  description:
    "Interactive read-only CV panel for recruiters. Shows Konrad Straszewski's profile context and provides direct CV download actions.",
  annotations: {
    readOnlyHint: true,
    openWorldHint: false
  },
  handler: async () => {
    const context = buildProfileContext({ focus: 'full' })

    return {
      structuredContent: context,
      content: [
        {
          type: 'text',
          text: "Opened Konrad's CV app. The UI includes direct CV download buttons and recruiter prompts."
        }
      ]
    }
  }
})

const { data, openLink, sendPrompt } = useMcpApp<ReturnType<typeof buildProfileContext>>()

const context = computed(() => data.value ?? buildProfileContext({ focus: 'full' }))
const downloads = computed(() => context.value.sections.cv.downloads)
const experience = computed(() => context.value.sections.experience.roles.slice(0, 5))
const facts = computed(() => [
  { label: 'Current', value: context.value.person.currentRole },
  { label: 'Location', value: context.value.person.location },
  { label: 'Open to', value: context.value.person.openTo },
  { label: 'Stack', value: context.value.person.stackPosture }
])

const openDownload = (url: string) => {
  openLink(url)
}
</script>

<style scoped>
:global(body) {
  margin: 0;
}

.cv-app {
  min-height: 100vh;
  padding: 28px;
  background: #ffffff;
  color: #111111;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}

.cv-app__hero {
  padding-bottom: 24px;
  border-bottom: 1px solid #dedede;
}

.cv-app__eyebrow {
  margin: 0 0 10px;
  color: #666666;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.cv-app h1,
.cv-app h2,
.cv-app h3,
.cv-app p {
  letter-spacing: 0;
}

.cv-app h1 {
  margin: 0;
  font-family: Georgia, serif;
  font-size: clamp(2.4rem, 8vw, 4.8rem);
  font-weight: 500;
  line-height: 0.96;
}

.cv-app__lead {
  max-width: 820px;
  margin: 20px 0 0;
  color: #333333;
  font-size: 1.05rem;
  line-height: 1.5;
}

.cv-app__downloads {
  display: grid;
  grid-template-columns: minmax(0, 0.55fr) minmax(0, 1fr);
  gap: 20px;
  padding: 24px 0;
  border-bottom: 1px solid #dedede;
}

.cv-app__downloads h2 {
  margin: 0;
  font-family: Georgia, serif;
  font-size: 2rem;
  font-weight: 500;
}

.cv-app__download-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.cv-app__download,
.cv-app__prompts button {
  border: 1px solid #111111;
  border-radius: 6px;
  background: #111111;
  color: #ffffff;
  cursor: pointer;
  text-align: left;
}

.cv-app__download {
  min-height: 88px;
  padding: 14px;
}

.cv-app__download span,
.cv-app__download small {
  display: block;
}

.cv-app__download span {
  font-weight: 650;
}

.cv-app__download small {
  margin-top: 8px;
  color: #d8d8d8;
  font-size: 0.82rem;
  line-height: 1.35;
}

.cv-app__facts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-bottom: 1px solid #dedede;
  border-left: 1px solid #dedede;
}

.cv-app__fact {
  min-height: 96px;
  padding: 14px;
  border-right: 1px solid #dedede;
}

.cv-app__fact span {
  display: block;
  margin-bottom: 10px;
  color: #666666;
  font-size: 0.76rem;
  text-transform: uppercase;
}

.cv-app__fact strong {
  display: block;
  font-size: 0.96rem;
  line-height: 1.3;
}

.cv-app__section {
  padding: 24px 0;
  border-bottom: 1px solid #dedede;
}

.cv-app__timeline {
  display: grid;
  gap: 14px;
}

.cv-app__role {
  display: grid;
  grid-template-columns: 108px minmax(0, 1fr);
  gap: 16px;
}

.cv-app__role span {
  color: #666666;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.76rem;
}

.cv-app__role h3 {
  margin: 0 0 6px;
  font-size: 1rem;
  line-height: 1.25;
}

.cv-app__role p {
  margin: 0;
  color: #555555;
  font-size: 0.9rem;
  line-height: 1.45;
}

.cv-app__prompts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.cv-app__prompts button {
  min-height: 58px;
  padding: 12px 14px;
  background: #ffffff;
  color: #111111;
  line-height: 1.3;
}

.cv-app__download:hover,
.cv-app__download:focus-visible {
  background: #333333;
}

.cv-app__prompts button:hover,
.cv-app__prompts button:focus-visible {
  background: #f4f4f4;
}

@media (max-width: 760px) {
  .cv-app {
    padding: 20px;
  }

  .cv-app__downloads,
  .cv-app__role {
    grid-template-columns: 1fr;
  }

  .cv-app__download-list,
  .cv-app__facts,
  .cv-app__prompts {
    grid-template-columns: 1fr;
  }
}
</style>
