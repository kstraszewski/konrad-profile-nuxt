<script setup>
import { profile } from '~/data/profile'

useRouteSeo('/')
useHead({ meta: [{ name: 'theme-color', content: '#f4f5f6' }] })

const posthog = usePostHog()
const menuOpen = ref(false)
const menuButton = ref(null)
const closeMenu = (event) => {
  if (event.key === 'Escape' && menuOpen.value) {
    menuOpen.value = false
    menuButton.value?.focus()
  }
}
const trackJasne = () => posthog?.capture('hero_jasne_link_clicked')

onMounted(() => window.addEventListener('keydown', closeMenu))
onBeforeUnmount(() => window.removeEventListener('keydown', closeMenu))
</script>

<template>
  <div id="top" class="home">
    <a class="home-skip" href="#main">Skip to content</a>

    <header class="home-nav home-wrap">
      <a class="home-brand" href="#top" aria-label="koonrad.dev — back to top">
        <svg viewBox="0 0 28 28" width="25" height="25" fill="none" aria-hidden="true">
          <path d="M2 2h8v10L20 2h8L16 14l12 12h-9L10 17v9H2V2Z" fill="currentColor" />
        </svg>
        koonrad<span>.dev</span>
      </a>
      <button ref="menuButton" class="home-menu" type="button" :aria-expanded="menuOpen" aria-controls="home-navigation" @click="menuOpen = !menuOpen">
        {{ menuOpen ? 'Close' : 'Menu' }} <span aria-hidden="true">{{ menuOpen ? '−' : '+' }}</span>
      </button>
      <nav id="home-navigation" class="home-nav__links" :class="{ 'is-open': menuOpen }" aria-label="Main navigation">
        <a href="#work" @click="menuOpen = false">Selected work</a>
        <a href="#track" @click="menuOpen = false">About</a>
        <a href="#contact" @click="menuOpen = false">Get in touch <span aria-hidden="true">↗</span></a>
        <NuxtLink class="home-nav__cv" to="/cv">CV <span aria-hidden="true">↗</span></NuxtLink>
      </nav>
    </header>

    <main id="main">
      <section class="home-hero home-wrap" aria-labelledby="home-title">
        <div class="home-hero__intro">
          <p class="home-kicker">Konrad Straszewski <span>—</span> AI & product engineering</p>
          <h1 id="home-title">Engineer.<br>Builder.<br><span>Still curious.</span></h1>
          <p class="home-hero__copy">
            I turn AI into useful products and help teams do the same.
            Currently at <a :href="profile.links.lendi.href" target="_blank" rel="noreferrer">Lendi</a>.
            Independently building <NuxtLink to="/jasne.ai" @click="trackJasne">jasne.ai</NuxtLink>.
          </p>
          <div class="home-hero__actions">
            <a class="home-button" href="#work">Explore my work <span aria-hidden="true">↘</span></a>
            <a class="home-text-link" href="#contact">Let’s talk <span aria-hidden="true">↗</span></a>
          </div>
        </div>

        <aside class="home-poster" aria-label="My approach: think, build, ship, learn, repeat.">
          <div class="home-poster__top"><span>ALWAYS IN THE MAKING</span><span aria-hidden="true">↗</span></div>
          <svg class="home-poster__art" viewBox="0 0 400 360" fill="none" aria-hidden="true">
            <path d="M40 193 200 101 359 193 200 286 40 193Z" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="3 6" />
            <g class="poster-layer poster-layer--bottom">
              <path d="m78 219 122-70 122 70v29l-122 70-122-70v-29Z" fill="#aab7ff" stroke="#f4f5f6" stroke-width="1.5" />
              <path d="m78 219 122 71 122-71-122-70-122 70Z" fill="#f4f5f6" stroke="#f4f5f6" stroke-width="1.5" />
              <path d="M200 290v28" stroke="#2949ed" stroke-width="1.5" />
            </g>
            <g class="poster-layer poster-layer--middle">
              <path d="m78 148 122-70 122 70v29l-122 71-122-71v-29Z" fill="#3454f5" stroke="#f4f5f6" stroke-width="1.5" />
              <path d="m78 148 122 71 122-71-122-70-122 70Z" fill="#2949ed" stroke="#f4f5f6" stroke-width="1.5" />
              <path d="m108 148 92-53 92 53-92 54-92-54ZM200 219v29" stroke="#f4f5f6" stroke-width="1.5" />
            </g>
            <g class="poster-layer poster-layer--top">
              <path d="m78 77 122-70 122 70v29l-122 71-122-71V77Z" fill="#b3c940" stroke="#deef78" stroke-width="1.5" />
              <path d="m78 77 122 71 122-71L200 7 78 77Z" fill="#deef78" stroke="#deef78" stroke-width="1.5" />
              <path d="M200 148v29" stroke="#2949ed" stroke-width="1.5" />
              <path d="m165 77 25 14 47-27" stroke="#2949ed" stroke-width="5" />
            </g>
            <path d="M38 294v14h14M348 40h14v14" stroke="#f4f5f6" stroke-opacity=".5" stroke-width="1.5" />
          </svg>
          <div class="home-poster__bottom"><p>Think. Build.<br>Ship. Repeat.</p><span class="home-poster__loop" aria-hidden="true">↻</span></div>
          <div class="home-poster__caption"><span>IDEAS ARE ONLY THE START.</span><span>01—∞</span></div>
        </aside>

        <div class="home-hero__foot">
          <span class="home-availability"><i aria-hidden="true" /> Open to senior AI roles · remote</span>
          <span>Szczecin, Poland <span class="home-hero__location" aria-hidden="true">↗</span></span>
        </div>
      </section>

      <section id="work" class="home-work home-wrap" aria-labelledby="work-title">
        <div id="now" class="home-work__heading">
          <div><p class="home-kicker">A selection of what I do</p><h2 id="work-title">Less theory. More doing.</h2></div>
          <span class="home-work__count">01 — 03</span>
        </div>

        <article id="lendi" class="home-project home-project--lendi">
          <div class="home-project__visual home-lendi" aria-label="Lendi: from frontend development to AI leadership">
            <span class="home-visual__label">A LONG-TERM BUILD</span>
            <span class="home-lendi__wordmark">lendi<span>_</span></span>
            <div class="home-lendi__path"><span>Frontend</span><span aria-hidden="true">→</span><span>Lead</span><span aria-hidden="true">→</span><span>R&D</span><span aria-hidden="true">→</span><strong>AI</strong></div>
            <span class="home-visual__footer">2017 → NOW</span>
          </div>
          <div class="home-project__body">
            <p class="home-kicker">01 / Lendi <span>·</span> AI Manager & Builder</p>
            <h3>Building the product.<br>Then the way we build.</h3>
            <p>From writing the frontend to leading an eight-person team. Now I lead AI adoption across the company: tools, workflows, and the shift from shipping tickets to owning products.</p>
            <div class="home-project__tags"><span>AI adoption</span><span>Engineering leadership</span></div>
            <a class="home-text-link" href="#track">The full journey <span aria-hidden="true">↗</span></a>
          </div>
        </article>

        <article id="jasne" class="home-project home-project--jasne">
          <NuxtLink class="home-project__visual home-jasne" to="/jasne.ai" aria-label="Read the jasne.ai case study">
            <span class="home-visual__label">INDEPENDENTLY BUILT</span>
            <span class="home-jasne__sun" aria-hidden="true"><span v-for="ray in 12" :key="ray" :style="{ '--ray': ray }" /></span>
            <span class="home-jasne__wordmark">jasne.ai<span aria-hidden="true">↗</span></span>
            <span class="home-visual__footer">FROM PRODUCT TO DISTRIBUTION</span>
          </NuxtLink>
          <div class="home-project__body">
            <p class="home-kicker">02 / jasne.ai <span>·</span> Founder & builder</p>
            <h3>My own ideas.<br>Out in the real world.</h3>
            <p>A vertical AI product connecting product truth with better distribution. I own the whole thing: product, design, code, infrastructure, and getting it into people’s hands.</p>
            <div class="home-project__tags"><span>0 → 1 product</span><span>AI</span><span>Distribution</span></div>
            <NuxtLink class="home-text-link" to="/jasne.ai">Explore jasne.ai <span aria-hidden="true">↗</span></NuxtLink>
          </div>
        </article>

        <article class="home-maf">
          <span class="home-maf__index">03</span>
          <div><p class="home-kicker">MAF · Dubai · 2024</p><h3>Making large knowledge bases useful.</h3></div>
          <p>A collaboration on vector search and retrieval for a Dubai mall network. Real data, operational context, practical AI.</p>
          <a :href="profile.links.maf.href" target="_blank" rel="noreferrer" aria-label="Visit Majid Al Futtaim" class="home-maf__link">↗</a>
        </article>
      </section>

      <HomeDetails />
    </main>
  </div>
</template>

<style scoped>
.home {
  --home-ink: #17191b;
  --home-muted: #666b75;
  --home-line: #d8dbdf;
  --home-blue: #2949ed;
  --home-paper: #f4f5f6;
  --home-font: 'Inter Tight', 'Arial', sans-serif;
  color: var(--home-ink); background: var(--home-paper); font-family: var(--home-font);
}
.home :deep(::selection) { background: #deef78; color: #17191b; }
.home :deep(a:focus-visible), .home :deep(button:focus-visible), .home :deep(summary:focus-visible) { outline: 2px solid var(--home-focus, var(--home-blue)); outline-offset: 5px; }
.home :deep([id]) { scroll-margin-top: 32px; }
.home-wrap { width: calc(100% - 96px); max-width: 1200px; margin-inline: auto; }
.home-skip { position: fixed; z-index: 100; top: 12px; left: 12px; padding: 16px; background: var(--home-ink); color: white; transform: translateY(-150%); }
.home-skip:focus { transform: translateY(0); }
.home-nav { display: flex; justify-content: space-between; align-items: center; min-height: 100px; border-bottom: 1px solid var(--home-line); }
.home-brand { display: inline-flex; align-items: center; gap: 9px; font-size: 23px; font-weight: 600; letter-spacing: -1px; text-decoration: none; }
.home-brand svg { margin-right: 4px; color: var(--home-blue); }
.home-brand span { margin-left: -8px; color: var(--home-muted); font-weight: 400; }
.home-nav__links { display: flex; align-items: center; gap: 34px; font-size: 14px; }
.home-nav__links a { display: inline-flex; align-items: center; gap: 12px; min-height: 44px; text-decoration: none; }
.home-nav__links a:hover { color: var(--home-blue); }
.home-nav__cv { border-left: 1px solid var(--home-line); padding-left: 28px; }
.home-menu { display: none; }
.home-kicker { margin: 0; font-size: 11px; font-weight: 500; line-height: 1.7; letter-spacing: 1.1px; text-transform: uppercase; }
.home-kicker > span { margin-inline: 6px; color: var(--home-muted); }
.home-hero { display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr); align-items: center; column-gap: 64px; padding-top: 58px; }
.home-hero h1 { margin: 24px 0 25px -5px; font-size: clamp(68px, 7.25vw, 102px); line-height: .96; letter-spacing: -.065em; font-weight: 600; }
.home-hero h1 > span { color: var(--home-blue); }
.home-hero__copy { max-width: 420px; margin: 0; font-size: 18px; line-height: 1.6; color: var(--home-muted); text-wrap: pretty; }
.home-hero__copy a { color: var(--home-ink); text-decoration-color: #b3b6be; text-underline-offset: 4px; }
.home-hero__copy a:hover { color: var(--home-blue); }
.home-hero__actions { display: flex; align-items: center; gap: 30px; margin-top: 30px; }
.home-button { display: inline-flex; align-items: center; gap: 42px; min-height: 48px; padding: 0 20px; background: var(--home-ink); color: white; font-size: 14px; text-decoration: none; transition: background 160ms ease, transform 160ms ease; }
.home-button:hover { background: var(--home-blue); }
.home-button:active { transform: scale(.98); }
.home-button > span { font-size: 22px; }
.home-text-link { display: inline-flex; align-items: center; gap: 24px; width: fit-content; min-height: 44px; font-size: 14px; font-weight: 500; text-decoration: none; }
.home-text-link > span { font-size: 20px; transition: transform 180ms ease-out; }
.home-text-link:hover { color: var(--home-blue); }
.home-poster { align-self: stretch; display: flex; flex-direction: column; justify-content: space-between; position: relative; min-width: 0; padding: 25px 28px 20px; overflow: hidden; color: white; background: var(--home-blue); }
.home-poster__top, .home-poster__caption { display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 9px; font-weight: 500; letter-spacing: 1.2px; }
.home-poster__top > span:last-child { font-size: 23px; line-height: 1; }
.home-poster__art { display: block; width: 100%; max-height: 290px; margin: 15px auto 5px; }
.home-poster__bottom { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 6px; }
.home-poster__bottom p { margin: 0; font-size: clamp(28px, 3.1vw, 42px); font-weight: 500; line-height: 1.05; letter-spacing: -1.5px; }
.home-poster__loop { color: #deef78; font-size: 61px; line-height: 1; font-weight: 400; }
.home-poster__caption { border-top: 1px solid #ffffff55; padding-top: 16px; margin-top: 24px; font-size: 8px; letter-spacing: 1px; }
.poster-layer { transition: transform 240ms cubic-bezier(.23,1,.32,1); }
.home-hero__foot { grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 35px 0 27px; margin-top: 12px; border-bottom: 1px solid var(--home-line); color: var(--home-muted); font-size: 12px; }
.home-availability { display: flex; align-items: center; gap: 9px; }
.home-availability i { width: 7px; height: 7px; border-radius: 50%; background: #42832a; }
.home-hero__location { margin-left: 15px; }
.home-work { padding-top: 79px; padding-bottom: 72px; }
.home-work__heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; padding-bottom: 35px; }
.home-work__heading .home-kicker { color: var(--home-muted); }
.home-work h2 { font-size: clamp(32px, 3.5vw, 45px); line-height: 1.12; letter-spacing: -1.9px; margin: 10px 0 0; font-weight: 500; }
.home-work__count { color: var(--home-muted); font-size: 11px; letter-spacing: 1px; padding-bottom: 4px; }
.home-project { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; padding-block: 28px; border-top: 1px solid var(--home-line); }
.home-project__visual { min-height: 315px; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; padding: 23px 28px; text-decoration: none; }
.home-visual__label, .home-visual__footer { font-size: 9px; letter-spacing: 1.4px; font-weight: 500; }
.home-lendi { background: #e2e7ec; }
.home-lendi__wordmark { margin: 14px 0 12px; font-size: 89px; letter-spacing: -6px; font-weight: 600; line-height: 1; }
.home-lendi__wordmark > span { color: var(--home-blue); }
.home-lendi__path { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; font-size: 13px; }
.home-lendi__path > span:nth-child(even) { color: #747b88; }
.home-lendi__path strong { background: var(--home-blue); color: white; padding: 8px 13px; font-weight: 500; }
.home-project__body { padding: 14px 0; }
.home-project__body .home-kicker { color: var(--home-muted); font-size: 10px; letter-spacing: .8px; }
.home-project h3 { font-size: clamp(27px, 2.7vw, 36px); line-height: 1.13; letter-spacing: -1.15px; font-weight: 500; margin: 17px 0; }
.home-project__body > p:not(.home-kicker) { margin: 0; max-width: 425px; color: var(--home-muted); font-size: 15px; line-height: 1.65; }
.home-project__tags { display: flex; flex-wrap: wrap; gap: 8px 18px; margin: 20px 0 8px; color: var(--home-muted); font-size: 11px; }
.home-project__tags span { padding-bottom: 5px; border-bottom: 1px solid var(--home-line); }
.home-jasne { background: #e2edb9; color: #28331a; }
.home-jasne__wordmark { position: relative; z-index: 1; font-size: 76px; font-weight: 500; letter-spacing: -4px; line-height: 1; margin: auto 0 20px; }
.home-jasne__wordmark > span { display: inline-block; margin-left: 16px; font-size: 38px; vertical-align: top; transition: transform 200ms ease-out; }
.home-jasne__sun { position: absolute; right: 68px; top: 90px; width: 1px; height: 1px; color: #77873b; }
.home-jasne__sun span { position: absolute; top: -61px; left: -1.5px; width: 3px; height: 36px; background: currentColor; transform-origin: 50% 62px; transform: rotate(calc(var(--ray) * 30deg)); }
.home-maf { display: grid; grid-template-columns: 36px 1fr .9fr 48px; gap: 20px; align-items: center; padding: 35px 0; border-block: 1px solid var(--home-line); }
.home-maf__index { align-self: start; padding-top: 3px; color: var(--home-muted); font-size: 12px; }
.home-maf .home-kicker { color: var(--home-muted); font-size: 10px; }
.home-maf h3 { margin: 9px 0 0; font-size: 24px; line-height: 1.2; letter-spacing: -.6px; font-weight: 500; }
.home-maf > p { color: var(--home-muted); font-size: 14px; line-height: 1.6; margin: 0; }
.home-maf__link { display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; border: 1px solid var(--home-line); border-radius: 50%; text-decoration: none; font-size: 24px; }
.home-maf__link:hover { background: var(--home-ink); color: white; }
@media (hover: hover) and (pointer: fine) {
  .home-poster:hover .poster-layer--top { transform: translateY(-7px); }
  .home-poster:hover .poster-layer--bottom { transform: translateY(7px); }
  .home-text-link:hover > span, .home-jasne:hover .home-jasne__wordmark > span { transform: translate(2px, -2px); }
}
@media (min-width: 1450px) { .home-hero { padding-top: 70px; } }
@media (max-width: 1000px) {
  .home-wrap { width: calc(100% - 64px); }
  .home-hero { gap: 32px; }
  .home-hero h1 { font-size: clamp(60px, 7.6vw, 78px); }
  .home-hero .home-kicker { font-size: 9px; letter-spacing: .7px; }
  .home-poster { padding: 22px; }
  .home-project { gap: 32px; }
  .home-lendi__path { gap: 9px; font-size: 11px; }
}
@media (max-width: 760px) {
  .home-wrap { width: calc(100% - 40px); }
  .home-nav { min-height: 80px; flex-wrap: wrap; }
  .home-menu { display: flex; align-items: center; gap: 18px; padding: 0 4px 0 12px; border: 0; min-height: 44px; background: none; color: var(--home-ink); font-size: 14px; cursor: pointer; }
  .home-menu span { font-size: 23px; }
  .home-nav__links { display: none; width: 100%; padding: 6px 0 20px; gap: 0; }
  .home-nav__links.is-open { display: grid; grid-template-columns: 1fr 1fr; }
  .home-nav__links a { min-height: 48px; }
  .home-nav__cv { border: 0; padding: 0; }
  .home-hero { grid-template-columns: 1fr; padding-top: 39px; gap: 0; }
  .home-hero .home-kicker { font-size: 9px; }
  .home-hero h1 { font-size: clamp(63px, 12vw, 90px); margin-top: 24px; margin-left: -3px; }
  .home-hero__copy { max-width: 440px; font-size: 17px; }
  .home-hero__actions { gap: 25px; margin-top: 25px; }
  .home-poster { margin-top: 35px; display: grid; grid-template-columns: 1fr 1.1fr; grid-template-rows: auto 1fr auto; gap: 12px 0; min-height: 250px; padding: 24px; }
  .home-poster__top { grid-column: 1 / -1; }
  .home-poster__art { position: absolute; right: 3px; top: 34px; height: 175px; width: 52%; margin: 0; }
  .home-poster__bottom { align-self: center; margin-top: 8px; }
  .home-poster__bottom p { font-size: clamp(27px, 5.6vw, 36px); }
  .home-poster__loop { display: none; }
  .home-poster__caption { grid-column: 1 / -1; margin-top: 5px; padding-top: 13px; font-size: 7px; }
  .home-hero__foot { gap: 10px; margin: 0; padding-block: 24px; flex-wrap: wrap; font-size: 11px; }
  .home-work { padding-top: 54px; padding-bottom: 36px; }
  .home-work__heading { padding-bottom: 25px; }
  .home-work h2 { font-size: 32px; letter-spacing: -1.3px; }
  .home-work__count { display: none; }
  .home-project { grid-template-columns: 1fr; gap: 12px; padding-block: 20px 28px; }
  .home-project__visual { min-height: 270px; }
  .home-jasne__wordmark { font-size: clamp(56px, 15vw, 76px); letter-spacing: -3px; }
  .home-jasne__wordmark > span { font-size: 28px; margin-left: 12px; }
  .home-project__body { padding: 10px 0; }
  .home-project h3 { font-size: 32px; }
  .home-project__body > p:not(.home-kicker) { max-width: 520px; }
  .home-lendi__path { font-size: 13px; gap: 15px; }
  .home-maf { grid-template-columns: 1fr 48px; gap: 15px; padding-block: 27px; }
  .home-maf__index { display: none; }
  .home-maf > p { grid-column: 1; }
  .home-maf__link { grid-column: 2; grid-row: 1 / 3; }
  .home-maf h3 { font-size: 25px; }
}
@media (max-width: 370px) {
  .home-hero h1 { font-size: 57px; }
  .home-hero__actions { gap: 18px; }
  .home-button { gap: 19px; padding-inline: 15px; }
  .home-lendi__path { gap: 10px; font-size: 11px; }
  .home-poster { padding-inline: 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .home :deep(*), .home :deep(*::before), .home :deep(*::after) { animation: none !important; transition: none !important; }
  .poster-layer, .home-text-link > span, .home-jasne__wordmark > span { transform: none !important; }
}
</style>

<style>
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
</style>
