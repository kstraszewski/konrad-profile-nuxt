<script setup>
import { profile } from '~/data/profile'

useRouteSeo('/')
useHead({ meta: [{ name: 'theme-color', content: '#f4f5f6' }] })

const posthog = usePostHog()
const homeRoot = ref(null)
const menuOpen = ref(false)
const menuButton = ref(null)
const closeMenu = (event) => {
  if (event.key === 'Escape' && menuOpen.value) {
    menuOpen.value = false
    menuButton.value?.focus()
  }
}
const trackJasne = () => posthog?.capture('hero_jasne_link_clicked')
const trackCvDownload = () => posthog?.capture('cv_downloaded', {
  variant: 'general',
  label: 'Ogólne CV',
  source: 'hero',
})

useLandingReveal(homeRoot, {
  selector: '[data-reveal]',
  easing: 'cubic-bezier(.22, 1, .36, 1)',
})

onMounted(() => window.addEventListener('keydown', closeMenu))
onBeforeUnmount(() => window.removeEventListener('keydown', closeMenu))
</script>

<template>
  <div id="top" ref="homeRoot" class="home">
    <a class="home-skip" href="#main">Skip to content</a>

    <header class="home-nav home-wrap">
      <a class="home-brand" href="#top" aria-label="koonrad.dev — back to top">
        <svg viewBox="0 0 28 28" width="25" height="25" fill="none" aria-hidden="true">
          <path d="M2 2h8v10L20 2h8L16 14l12 12h-9L10 17v9H2V2Z" fill="currentColor" />
        </svg>
        koonrad<span>.dev</span>
      </a>
      <button ref="menuButton" class="home-menu" type="button" :aria-expanded="menuOpen" aria-controls="home-navigation" @click="menuOpen = !menuOpen">
        {{ menuOpen ? 'Close' : 'Menu' }} <HomeIcon :name="menuOpen ? 'x' : 'plus'" />
      </button>
      <nav id="home-navigation" class="home-nav__links" :class="{ 'is-open': menuOpen }" aria-label="Main navigation">
        <a href="#work" @click="menuOpen = false">Selected work</a>
        <a href="#track" @click="menuOpen = false">About</a>
        <a href="#contact" @click="menuOpen = false">Get in touch <HomeIcon name="arrow-up-right" :size="18" /></a>
        <NuxtLink class="home-nav__cv" to="/cv">CV <HomeIcon name="arrow-up-right" :size="18" /></NuxtLink>
      </nav>
    </header>

    <main id="main">
      <section class="home-hero home-wrap" aria-labelledby="home-title" data-stack-zone>
        <div class="home-hero__intro">
          <p class="home-kicker home-reveal" style="--d: 0">Konrad Straszewski <span>—</span> TypeScript · full-stack · AI</p>
          <h1 id="home-title">
            <span class="home-line" style="--d: 1"><span>Engineer.</span></span><br>
            <span class="home-line" style="--d: 2"><span>Builder.</span></span><br>
            <span class="home-line home-line--accent" style="--d: 3"><span>Still curious.</span></span>
          </h1>
          <p class="home-hero__copy home-reveal" style="--d: 5">
            I build full-stack products in TypeScript, put AI to work, and help teams ship.
            Currently at <a :href="profile.links.lendi.href" target="_blank" rel="noreferrer">Lendi</a>.
            Independently building <NuxtLink to="/jasne.ai" @click="trackJasne">jasne.ai</NuxtLink>.
          </p>
          <div class="home-hero__actions">
            <a class="home-button" href="#work">Explore my work <HomeIcon name="arrow-down-right" :size="22" /></a>
            <a class="home-text-link" href="#contact">Let’s talk <HomeIcon name="arrow-up-right" /></a>
            <a class="home-text-link home-hero__cv" href="/api/cv/general.pdf" download="Konrad Straszewski CV.pdf" aria-label="Download CV as PDF" @click="trackCvDownload">
              Download CV
              <HomeIcon name="download" />
            </a>
          </div>
        </div>

        <aside class="home-poster" aria-label="My approach: think, build, ship, learn, repeat." data-stack-focus>
          <div class="home-poster__top"><span>ALWAYS IN THE MAKING</span><HomeIcon name="arrow-up-right" :size="23" /></div>
          <HomeBuildStack class="home-poster__art" />
          <div class="home-poster__bottom"><p>Think. Build.<br>Ship. Repeat.</p><HomeIcon class="home-poster__loop" name="rotate-cw" :size="48" /></div>
          <div class="home-poster__caption"><span>IDEAS ARE ONLY THE START.</span><span>01—∞</span></div>
          <p class="home-poster__gesture">Drag sideways to explore <span aria-hidden="true">↔</span></p>
        </aside>

        <div class="home-hero__foot">
          <span class="home-availability"><i aria-hidden="true" /> Open to senior AI roles · remote</span>
          <span>Szczecin, Poland <HomeIcon class="home-hero__location" name="arrow-up-right" :size="15" /></span>
        </div>
      </section>

      <section id="work" class="home-work home-wrap" aria-labelledby="work-title">
        <div id="now" class="home-work__heading" data-reveal>
          <div><p class="home-kicker">A selection of what I do</p><h2 id="work-title">Less theory. <mark>More doing.</mark></h2></div>
          <span class="home-work__count">01 — 03</span>
        </div>

        <article id="lendi" class="home-project home-project--lendi" data-reveal data-reveal-delay="60">
          <div class="home-project__visual home-lendi">
            <HomeLendiPreview />
          </div>
          <div class="home-project__body">
            <p class="home-kicker">01 / Lendi <span>·</span> AI Manager</p>
            <h3>Building the product.<br>Then the way we build.</h3>
            <p>I led a six-person frontend team from 2020 to 2023. Since returning as AI Manager in 2024, I lead AI adoption across the company: tools, workflows, and the shift from shipping tickets to owning products.</p>
            <div class="home-project__tags"><span>AI adoption</span><span>Engineering leadership</span></div>
            <a class="home-text-link" href="#track">The full journey <HomeIcon name="arrow-up-right" /></a>
          </div>
        </article>

        <article id="jasne" class="home-project home-project--jasne" data-reveal>
          <NuxtLink class="home-project__visual home-jasne" to="/jasne.ai" aria-label="Read the jasne.ai case study">
            <HomeJasnePreview />
          </NuxtLink>
          <div class="home-project__body">
            <p class="home-kicker">02 / jasne.ai <span>·</span> Founder & builder</p>
            <h3>Clear knowledge.<br>Confident teams.</h3>
            <p>I’m building jasne.ai to help sales teams find product answers, learn faster, and put knowledge to work. An AI assistant, knowledge base, and tailored training — owned end to end, from product and design to code and rollout.</p>
            <div class="home-project__tags"><span>AI assistant</span><span>Knowledge & learning</span><span>0 to 1 product</span></div>
            <NuxtLink class="home-text-link" to="/jasne.ai">Explore jasne.ai <HomeIcon name="arrow-up-right" /></NuxtLink>
          </div>
        </article>

        <article class="home-neoiq" data-reveal>
          <span class="home-neoiq__index">03</span>
          <div><p class="home-kicker">NeoIQ · AI Builder · 2023–2024</p><h3>Making large knowledge bases useful.</h3></div>
          <p>As an AI Builder, I worked on vector search and retrieval at NeoIQ. Real data, operational context, practical AI.</p>
          <a :href="profile.links.neoiq.href" target="_blank" rel="noreferrer" aria-label="Visit NeoIQ" class="home-neoiq__link"><HomeIcon name="arrow-up-right" :size="22" /></a>
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
  --home-lime: #deef78;
  --home-paper: #f4f5f6;
  --home-font: 'Inter Tight', 'Arial', sans-serif;
  --home-ease: cubic-bezier(.22, 1, .36, 1);
  color: var(--home-ink); background: var(--home-paper); font-family: var(--home-font);
}
.home :deep(::selection) { background: var(--home-lime); color: #17191b; }
.home :deep(a:focus-visible), .home :deep(button:focus-visible), .home :deep(summary:focus-visible) { outline: 2px solid var(--home-focus, var(--home-blue)); outline-offset: 5px; }
.home :deep([id]) { scroll-margin-top: 32px; }
.home-wrap { width: calc(100% - 96px); max-width: 1200px; margin-inline: auto; }
.home-skip { position: fixed; z-index: 100; top: 12px; left: 12px; padding: 16px; background: var(--home-ink); color: white; transform: translateY(-150%); }
.home-skip:focus { transform: translateY(0); }

/* ——— Navigation ——— */
.home-nav { display: flex; justify-content: space-between; align-items: center; min-height: 100px; border-bottom: 1px solid var(--home-line); }
.home-brand { display: inline-flex; align-items: center; gap: 9px; font-size: 23px; font-weight: 600; letter-spacing: -1px; text-decoration: none; }
.home-brand svg { margin-right: 4px; color: var(--home-blue); transition: transform 200ms var(--home-ease); }
.home-brand span { margin-left: -8px; color: var(--home-muted); font-weight: 400; }
.home-nav__links { display: flex; align-items: center; gap: 34px; font-size: 14px; }
.home-nav__links a { position: relative; display: inline-flex; align-items: center; gap: 12px; min-height: 44px; text-decoration: none; }
.home-nav__links a::after { position: absolute; left: 0; right: 0; bottom: 10px; height: 1px; background: currentColor; content: ''; transform: scaleX(0); transform-origin: right; transition: transform 200ms var(--home-ease); }
.home-nav__links a:hover { color: var(--home-blue); }
.home-nav__cv { border-left: 1px solid var(--home-line); padding-left: 28px; }
.home-nav__links .home-nav__cv::after { left: 28px; }
.home-menu { display: none; }
.home-kicker { margin: 0; font-size: 11px; font-weight: 500; line-height: 1.7; letter-spacing: 1.1px; text-transform: uppercase; }
.home-kicker > span { margin-inline: 6px; color: var(--home-muted); }

/* ——— Hero ——— */
.home-hero { display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr); align-items: center; column-gap: 64px; padding-top: 58px; }
.home-hero h1 { margin: 24px 0 25px -5px; font-size: clamp(68px, 7.25vw, 102px); line-height: .96; letter-spacing: -.065em; font-weight: 600; }
/* Each headline line is a clipping mask; the inner span rises into place once on load. */
.home-line { display: inline-block; overflow: hidden; vertical-align: top; padding: 0 .08em .12em 0; margin-bottom: -.12em; }
.home-line > span { display: inline-block; animation: home-rise 800ms var(--home-ease) both; animation-delay: calc(40ms + var(--d, 0) * 60ms); }
.home-line--accent { color: var(--home-blue); }
.home-reveal { animation: home-fade 800ms var(--home-ease) both; animation-delay: calc(40ms + var(--d, 0) * 60ms); }
.home-hero__copy:focus-within { animation: none; }
.home-hero__copy { max-width: 420px; margin: 0; font-size: 18px; line-height: 1.6; color: var(--home-muted); text-wrap: pretty; }
.home-hero__copy a { color: var(--home-ink); text-decoration-color: #b3b6be; text-underline-offset: 4px; }
.home-hero__copy a:hover { color: var(--home-blue); text-decoration-color: currentColor; }
.home-hero__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 30px; margin-top: 30px; }
.home-text-link.home-hero__cv { gap: 10px; white-space: nowrap; }
.home-hero__cv svg { flex: 0 0 auto; }
.home-button { position: relative; display: inline-flex; align-items: center; gap: 42px; min-height: 48px; padding: 0 20px; overflow: hidden; isolation: isolate; background: var(--home-ink); color: white; font-size: 14px; text-decoration: none; transition: transform 160ms var(--home-ease); }
.home-button::before { position: absolute; inset: 0; z-index: -1; background: var(--home-blue); content: ''; transform: translateY(101%); transition: transform 200ms var(--home-ease); }
.home-button:active:not(:focus-visible) { transform: scale(.98); }
.home-button > svg { transition: transform 160ms var(--home-ease); }
.home-text-link { display: inline-flex; align-items: center; gap: 24px; width: fit-content; min-height: 44px; font-size: 14px; font-weight: 500; text-decoration: none; transition: transform 160ms var(--home-ease); }
.home-text-link > svg { transition: transform 160ms var(--home-ease); }
.home-text-link:hover { color: var(--home-blue); }

/* ——— Poster with the 3D build stack ——— */
.home-poster { align-self: stretch; display: flex; flex-direction: column; justify-content: space-between; position: relative; min-width: 0; padding: 25px 28px 20px; overflow: hidden; isolation: isolate; color: white; background: var(--home-blue); }
/* Blueprint grid, faded towards the edges. */
.home-poster::before {
  position: absolute; inset: 0; z-index: -1; content: '';
  background-image:
    linear-gradient(rgb(255 255 255 / .09) 1px, transparent 1px),
    linear-gradient(90deg, rgb(255 255 255 / .09) 1px, transparent 1px);
  background-size: 28px 28px;
  background-position: -1px -1px;
  -webkit-mask-image: radial-gradient(ellipse 75% 60% at 50% 46%, #000 25%, transparent 78%);
  mask-image: radial-gradient(ellipse 75% 60% at 50% 46%, #000 25%, transparent 78%);
}
/* A soft light pool under the sculpture. */
.home-poster::after { position: absolute; left: 50%; top: 46%; z-index: -1; width: 120%; aspect-ratio: 1; content: ''; background: radial-gradient(closest-side, rgb(116 140 255 / .55), rgb(41 73 237 / 0)); transform: translate(-50%, -50%); }
.home-poster__top, .home-poster__caption { display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 9px; font-weight: 500; letter-spacing: 1.2px; }
.home-poster__art { margin: 12px 0 2px; }
.home-poster__bottom { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 6px; }
.home-poster__bottom p { margin: 0; font-size: clamp(28px, 3.1vw, 42px); font-weight: 500; line-height: 1.05; letter-spacing: -1.5px; }
.home-poster__loop { color: var(--home-lime); transition: transform 200ms var(--home-ease); }
.home-poster__caption { border-top: 1px solid #ffffff55; padding-top: 16px; margin-top: 24px; font-size: 8px; letter-spacing: 1px; }
.home-poster__gesture { display: none; margin: 12px 0 0; font-size: 11px; text-align: center; }
@media (max-width: 640px), (hover: none), (pointer: coarse) { .home-poster__gesture { display: block; } }

.home-hero__foot { grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 35px 0 27px; margin-top: 12px; border-bottom: 1px solid var(--home-line); color: var(--home-muted); font-size: 12px; }
.home-availability { display: flex; align-items: center; gap: 9px; }
.home-availability i { position: relative; width: 7px; height: 7px; border-radius: 50%; background: #42832a; }
/* Finite pulse: draws the eye once, then settles. */
.home-availability i::after { position: absolute; inset: 0; border-radius: 50%; background: #42832a; content: ''; opacity: 0; animation: home-pulse 1800ms ease-out 1200ms 3; }
.home-hero__location { margin-left: 10px; vertical-align: middle; }

/* ——— Work ——— */
.home-work { padding-top: 79px; padding-bottom: 72px; }
.home-work__heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; padding-bottom: 35px; }
.home-work__heading .home-kicker { color: var(--home-muted); }
.home-work h2 { font-size: clamp(32px, 3.5vw, 45px); line-height: 1.12; letter-spacing: -1.9px; margin: 10px 0 0; font-weight: 500; }
.home-work h2 mark { padding: 0 .06em; margin: 0 -.06em; color: inherit; background: linear-gradient(transparent 60%, var(--home-lime) 60%, var(--home-lime) 92%, transparent 92%); -webkit-box-decoration-break: clone; box-decoration-break: clone; }
.home-work__count { color: var(--home-muted); font-size: 11px; letter-spacing: 1px; padding-bottom: 4px; font-variant-numeric: tabular-nums; }
.home-project { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; padding-block: 28px; border-top: 1px solid var(--home-line); }
.home-project__visual { display: block; min-width: 0; position: relative; overflow: hidden; isolation: isolate; padding: 0; text-decoration: none; }

.home-lendi { background: #fffdfb; }

.home-project__body { padding: 14px 0; }
.home-project__body .home-kicker { color: var(--home-muted); font-size: 10px; letter-spacing: .8px; }
.home-project h3 { font-size: clamp(27px, 2.7vw, 36px); line-height: 1.13; letter-spacing: -1.15px; font-weight: 500; margin: 17px 0; text-wrap: balance; }
.home-project__body > p:not(.home-kicker) { margin: 0; max-width: 425px; color: var(--home-muted); font-size: 15px; line-height: 1.65; }
.home-project__tags { display: flex; flex-wrap: wrap; gap: 8px 18px; margin: 20px 0 8px; color: var(--home-muted); font-size: 11px; }
.home-project__tags span { padding-bottom: 5px; border-bottom: 1px solid var(--home-line); }

.home-jasne { --home-focus: #312319; background: #ffd66e; color: #312319; }

/* NeoIQ */
.home-neoiq { display: grid; grid-template-columns: 36px 1fr .9fr 48px; gap: 20px; align-items: center; padding: 35px 0; border-block: 1px solid var(--home-line); }
.home-neoiq__index { align-self: start; padding-top: 3px; color: var(--home-muted); font-size: 12px; font-variant-numeric: tabular-nums; }
.home-neoiq .home-kicker { color: var(--home-muted); font-size: 10px; }
.home-neoiq h3 { margin: 9px 0 0; font-size: 24px; line-height: 1.2; letter-spacing: -.6px; font-weight: 500; }
.home-neoiq > p { color: var(--home-muted); font-size: 14px; line-height: 1.6; margin: 0; }
.home-neoiq__link { position: relative; display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; overflow: hidden; isolation: isolate; border: 1px solid var(--home-line); border-radius: 50%; text-decoration: none; font-size: 24px; transition: color 200ms ease, border-color 200ms ease; }
.home-neoiq__link::before { position: absolute; inset: 0; z-index: -1; border-radius: inherit; background: var(--home-blue); content: ''; opacity: 0; transform: scale(.94); transition: transform 200ms var(--home-ease), opacity 200ms var(--home-ease); }
.home-neoiq__link:focus-visible { color: white; border-color: var(--home-blue); }
.home-neoiq__link:focus-visible::before { opacity: 1; transform: scale(1); transition: none; }
.home-button:focus-visible, .home-button:focus-visible::before, .home-button:focus-visible > svg, .home-text-link:focus-visible, .home-text-link:focus-visible > svg, .home-brand:focus-visible svg { transform: none; transition: none; }
.home-nav__links a:focus-visible::after { transform: scaleX(1); transition: none; }
.home-text-link:active:not(:focus-visible) { transform: translateY(1px); }

@media (hover: hover) and (pointer: fine) {
  .home-brand:hover:not(:focus-visible) svg { transform: rotate(-8deg); }
  .home-nav__links a:hover:not(:focus-visible)::after { transform: scaleX(1); transform-origin: left; }
  .home-button:hover:not(:focus-visible)::before { transform: translateY(0); }
  .home-button:hover:not(:focus-visible) > svg { transform: translate(2px, 2px); }
  .home-text-link:hover:not(:focus-visible) > svg { transform: translate(2px, -2px); }
  .home-hero__cv:hover:not(:focus-visible) > svg { transform: translateY(2px); }
  .home-poster:hover .home-poster__loop { transform: rotate(90deg); }
  .home-neoiq__link:hover:not(:focus-visible) { color: white; border-color: var(--home-blue); }
  .home-neoiq__link:hover:not(:focus-visible)::before { opacity: 1; transform: scale(1); }
}

@keyframes home-rise { from { transform: translateY(108%); } to { transform: translateY(0); } }
@keyframes home-fade { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes home-pulse { 0% { opacity: .55; transform: scale(1); } 100% { opacity: 0; transform: scale(3.2); } }

@media (min-width: 1450px) { .home-hero { padding-top: 70px; } }
@media (max-width: 1000px) {
  .home-wrap { width: calc(100% - 64px); }
  .home-hero { gap: 32px; }
  .home-hero h1 { font-size: clamp(60px, 7.6vw, 78px); }
  .home-hero .home-kicker { font-size: 9px; letter-spacing: .7px; }
  .home-poster { padding: 22px; }
  .home-project { gap: 32px; }
}
@media (max-width: 760px) {
  .home-wrap { width: calc(100% - 40px); }
  .home-nav { min-height: 80px; flex-wrap: wrap; }
  .home-menu { display: flex; align-items: center; gap: 18px; padding: 0 4px 0 12px; border: 0; min-height: 44px; background: none; color: var(--home-ink); font-size: 14px; cursor: pointer; }
  .home-nav__links { display: none; width: 100%; padding: 6px 0 20px; gap: 0; }
  .home-nav__links.is-open { display: grid; grid-template-columns: 1fr 1fr; }
  .home-nav__links a { min-height: 48px; }
  .home-nav__links a::after { display: none; }
  .home-nav__cv { border: 0; padding: 0; }
  .home-hero { grid-template-columns: 1fr; padding-top: 39px; gap: 0; }
  .home-hero .home-kicker { font-size: 9px; }
  .home-hero h1 { font-size: clamp(63px, 12vw, 90px); margin-top: 24px; margin-left: -3px; }
  .home-hero__copy { max-width: 440px; font-size: 17px; }
  .home-hero__actions { gap: 12px 25px; margin-top: 25px; }
  .home-poster { margin-top: 35px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); grid-template-rows: auto 1fr auto; gap: 12px 16px; padding: 24px; }
  .home-poster__top { grid-column: 1 / -1; }
  .home-poster__art { grid-column: 2; grid-row: 2; align-self: center; margin: 0; }
  .home-poster__bottom { grid-column: 1; grid-row: 2; align-self: end; margin: 0 0 6px; }
  .home-poster__bottom p { font-size: clamp(27px, 5.6vw, 36px); }
  .home-poster__loop { display: none; }
  .home-poster__caption { grid-column: 1 / -1; margin-top: 5px; padding-top: 13px; font-size: 7px; }
  .home-poster::after { left: 70%; width: 90%; }
  .home-hero__foot { gap: 10px; margin: 0; padding-block: 24px; flex-wrap: wrap; font-size: 11px; }
  .home-work { padding-top: 54px; padding-bottom: 36px; }
  .home-work__heading { padding-bottom: 25px; }
  .home-work h2 { font-size: 32px; letter-spacing: -1.3px; }
  .home-work__count { display: none; }
  .home-project { grid-template-columns: 1fr; gap: 12px; padding-block: 20px 28px; }
  .home-project__body { padding: 10px 0; }
  .home-project h3 { font-size: 32px; }
  .home-project__body > p:not(.home-kicker) { max-width: 520px; }
  .home-neoiq { grid-template-columns: 1fr 48px; gap: 15px; padding-block: 27px; }
  .home-neoiq__index { display: none; }
  .home-neoiq > p { grid-column: 1; }
  .home-neoiq__link { grid-column: 2; grid-row: 1 / 3; }
  .home-neoiq h3 { font-size: 25px; }
}
@media (max-width: 560px) {
  .home-hero__actions .home-button { flex-basis: 100%; justify-content: space-between; }
  .home-poster { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto; gap: 0; }
  .home-poster__art { grid-column: 1; grid-row: auto; margin: 14px 0 8px; }
  .home-poster__bottom { grid-column: 1; grid-row: auto; margin: 4px 0 0; }
  .home-poster::after { left: 50%; top: 42%; width: 130%; }
}
@media (max-width: 370px) {
  .home-hero h1 { font-size: 57px; }
  .home-hero__actions { gap: 12px 18px; }
  .home-button { gap: 19px; padding-inline: 15px; }
  .home-poster { padding-inline: 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .home-poster__gesture { display: none; }
  .home :deep(*), .home :deep(*::before), .home :deep(*::after) { animation: none !important; transition: none !important; }
  .home-text-link, .home-button, .home-text-link > svg, .home-button > svg, .home-poster__loop, .home-brand svg { transform: none !important; }
  .home-neoiq__link::before { transform: none !important; }
}
</style>

<style>
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
</style>
