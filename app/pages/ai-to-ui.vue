<script setup lang="ts">
useSeoMeta({
  title: 'AI to UI | Generative chat demo by Konrad Straszewski',
  description: 'An interactive chat demo that turns questions about a bathroom renovation into a sortable table, a checklist, or a text reply.',
  robots: 'noindex, nofollow',
})
useHead({
  htmlAttrs: { lang: 'en' },
  meta: [{ name: 'theme-color', content: '#f4f5f6' }],
})

// A real sequence: each step feeds the next one.
const steps = [
  { title: 'Question', text: 'The model receives your question and recent messages.' },
  { title: 'Generation', text: 'The model chooses a view and streams the data and text for that reply.' },
  { title: 'First render', text: 'Vue shows the view as soon as the first usable data arrives. The timer measures from sending your question to that render.' },
]
</script>

<template>
  <div id="top" class="atu">
    <a class="atu-skip" href="#rozmowa">Skip to chat</a>

    <header class="atu-nav atu-wrap">
      <NuxtLink class="atu-brand" to="/" aria-label="koonrad.dev home page">
        <svg viewBox="0 0 28 28" width="25" height="25" fill="none" aria-hidden="true">
          <path d="M2 2h8v10L20 2h8L16 14l12 12h-9L10 17v9H2V2Z" fill="currentColor" />
        </svg>
        koonrad<span>.dev</span>
      </NuxtLink>
      <NuxtLink class="atu-text-link" to="/">Profile <HomeIcon name="arrow-up-right" :size="18" /></NuxtLink>
    </header>

    <main class="atu-main atu-wrap">
      <div class="atu-side">
        <section class="atu-intro" aria-labelledby="atu-title">
          <p class="atu-kicker">Konrad Straszewski <span>/</span> AI to UI</p>
          <h1 id="atu-title">
            <span>Question <br>in.</span>
            <span class="atu-accent">Interface <br>out.</span>
          </h1>
          <p class="atu-intro__copy">
            Ask a question and watch the model turn its answer into a table, a checklist, or a text reply.
          </p>
        </section>

        <section class="atu-how" aria-labelledby="atu-how-title">
          <h2 id="atu-how-title" class="atu-kicker">How it works</h2>
          <ol class="atu-steps">
            <li v-for="(step, index) in steps" :key="step.title">
              <span class="atu-steps__index" aria-hidden="true">0{{ index + 1 }}</span>
              <div>
                <h3>{{ step.title }}</h3>
                <p>{{ step.text }}</p>
              </div>
            </li>
          </ol>
        </section>
      </div>

      <AiToUiChat id="rozmowa" class="atu-main__chat" />
    </main>

    <footer class="atu-footer atu-wrap">
      <span>© Konrad Straszewski · 2026</span>
      <span>The contractors, prices, and timelines in this demo are fictional.</span>
      <a class="atu-text-link" href="#top">Back to top <HomeIcon name="arrow-up" :size="18" /></a>
    </footer>
  </div>
</template>

<style scoped>
/* Tokens match the homepage and /mcp. Child components read them through inheritance. */
.atu {
  --atu-ink: #17191b;
  --atu-muted: #666b75;
  --atu-line: #d8dbdf;
  --atu-blue: #2949ed;
  --atu-lime: #deef78;
  --atu-paper: #f4f5f6;
  --atu-surface: #ffffff;
  --atu-alert: #b3261e;
  --atu-ease: cubic-bezier(.22, 1, .36, 1);
  min-height: 100vh;
  background: var(--atu-paper);
  color: var(--atu-ink);
  font-family: 'Inter Tight', Arial, sans-serif;
}
.atu :deep(::selection) { background: var(--atu-lime); color: var(--atu-ink); }
.atu :deep(a:focus-visible),
.atu :deep(button:focus-visible) { outline: 2px solid var(--atu-blue); outline-offset: 4px; }
.atu-wrap { width: calc(100% - 96px); max-width: 1200px; margin-inline: auto; }
.atu-skip { position: fixed; z-index: 100; top: 12px; left: 12px; padding: 16px; background: var(--atu-ink); color: #fff; transform: translateY(-150%); }
.atu-skip:focus { transform: translateY(0); }

/* The same wordmark and spacing as the homepage. */
.atu-nav { display: flex; align-items: center; justify-content: space-between; gap: 20px; min-height: 100px; border-bottom: 1px solid var(--atu-line); }
.atu-brand { display: inline-flex; align-items: center; gap: 9px; min-height: 44px; font-size: 23px; font-weight: 600; letter-spacing: -1px; text-decoration: none; }
.atu-brand svg { margin-right: 4px; color: var(--atu-blue); transition: transform 200ms var(--atu-ease); }
.atu-brand > span { margin-left: -8px; color: var(--atu-muted); font-weight: 400; }
.atu-text-link { display: inline-flex; align-items: center; gap: 14px; width: fit-content; min-height: 44px; font-size: 14px; font-weight: 500; text-decoration: none; }
.atu-text-link:hover { color: var(--atu-blue); }
.atu-text-link svg { transition: transform 180ms var(--atu-ease); }
.atu-kicker { margin: 0; font-size: 11px; font-weight: 500; letter-spacing: 1.1px; line-height: 1.7; text-transform: uppercase; }
.atu-kicker > span { margin-inline: 6px; color: var(--atu-muted); }

.atu-main { display: grid; grid-template-columns: minmax(0, .78fr) minmax(0, 1.22fr); align-items: start; column-gap: 64px; padding-block: 58px 72px; }
.atu-side { position: sticky; top: 32px; }
.atu-intro h1 { margin: 24px 0 26px -4px; font-size: clamp(52px, 5.5vw, 80px); font-weight: 600; letter-spacing: -.062em; line-height: .97; }
.atu-intro h1 > span { display: block; }
.atu-accent { color: var(--atu-blue); }
.atu-intro__copy { max-width: 40ch; margin: 0; color: var(--atu-muted); font-size: 18px; line-height: 1.6; text-wrap: pretty; }

.atu-how { margin-top: 44px; }
.atu-how .atu-kicker { color: var(--atu-muted); }
.atu-steps { margin: 14px 0 0; padding: 0; border-top: 1px solid var(--atu-ink); list-style: none; }
.atu-steps li { display: grid; grid-template-columns: 34px minmax(0, 1fr); gap: 12px; padding-block: 15px 16px; border-bottom: 1px solid var(--atu-line); }
.atu-steps__index { padding-top: 3px; color: var(--atu-muted); font-size: 11px; font-variant-numeric: tabular-nums; letter-spacing: .6px; }
.atu-steps h3 { margin: 0; font-size: 17px; font-weight: 500; letter-spacing: -.3px; line-height: 1.3; }
.atu-steps p { max-width: 44ch; margin: 5px 0 0; color: var(--atu-muted); font-size: 14px; line-height: 1.6; text-wrap: pretty; }

.atu-footer { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 4px 24px; padding-block: 22px; border-top: 1px solid var(--atu-line); color: var(--atu-muted); font-size: 12px; }
.atu-footer .atu-text-link { color: var(--atu-ink); font-size: 12px; }

@media (hover: hover) and (pointer: fine) {
  .atu-brand:hover svg { transform: rotate(-8deg); }
  .atu-text-link:hover svg { transform: translate(2px, -2px); }
  .atu-footer .atu-text-link:hover svg { transform: translateY(-2px); }
}
@media (max-width: 1000px) {
  .atu-wrap { width: calc(100% - 64px); }
  .atu-main { column-gap: 40px; }
}
/* One column: headline, then the conversation, then the explanation. */
@media (max-width: 900px) {
  .atu-main { display: flex; flex-direction: column; align-items: stretch; padding-block: 39px 48px; }
  .atu-side { display: contents; }
  .atu-intro { order: 1; }
  .atu-main__chat { order: 2; margin-top: 32px; }
  .atu-how { order: 3; margin-top: 40px; }
  .atu-intro h1 { margin: 20px 0 20px -2px; font-size: clamp(34px, 9.2vw, 64px); }
  .atu-intro h1 br { display: none; }
  .atu-intro__copy { max-width: 52ch; font-size: 17px; }
}
@media (max-width: 760px) {
  .atu-wrap { width: calc(100% - 40px); }
  .atu-nav { min-height: 72px; }
  .atu-main { padding-top: 28px; }
  .atu-main__chat { margin-top: 26px; }
  .atu-footer > span:first-child { flex-basis: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .atu :deep(*),
  .atu :deep(*::before),
  .atu :deep(*::after) { transition: none !important; }
}
</style>
