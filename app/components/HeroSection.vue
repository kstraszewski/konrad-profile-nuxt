<template>
  <section id="top" class="hero">
    <div class="hero__meta-row">
      <Eyebrow accent>Available &middot; senior AI roles &middot; Warsaw / remote</Eyebrow>
      <span class="hero__est">EST. 2017 - LENDI &middot; 2024 &rarr; AI</span>
    </div>

    <h1 class="hero__title">
      I rewire teams<br>
      <span class="hero__around">around</span>
      {{ ' ' }}
      <span class="hero__ai-wrap">
        <span class="hero__ai">
          AI
          <span class="hero__underline" :class="{ 'hero__underline--short': tick % 2 !== 0 }" />
        </span>,
      </span><br>
      then ship the products.
    </h1>

    <div class="hero__intro-grid">
      <p class="hero__intro">
        8.5 years at <strong>Lendi</strong> - frontend developer, then lead, then R&amp;D,
        now <strong>AI Manager &amp; Builder</strong>. My mandate: redefine the role of
        the engineer - from feature-shipper to product builder - and prove it ships.
        On the side I'm building
        <a href="#jasne" class="link-underline">jasne.ai</a>.
      </p>

      <div class="hero__facts" aria-label="Profile facts">
        <KeyValue label="Currently" value="AI Manager · Lendi" />
        <KeyValue label="Side build" value="jasne.ai" />
        <KeyValue label="Based" value="Szczecin, Poland" />
        <KeyValue label="Open to" value="Head of AI · AI Lead" />
        <KeyValue label="Stack" value="vendor-agnostic" />
        <div class="hero__fact-end" />
      </div>
    </div>

    <div class="hero__marquee" aria-hidden="true">
      <div class="hero__marquee-track">
        <span v-for="index in 3" :key="index">
          <span class="hero__marquee-strong">AI Manager</span>
          <span class="hero__marquee-accent">✦</span>
          Builder of <span class="hero__marquee-italic">jasne.ai</span>
          <span class="hero__marquee-accent">✦</span>
          <span class="hero__marquee-strong">8.5 yrs at Lendi</span>
          <span class="hero__marquee-accent">✦</span>
          Vendor-agnostic by design
          <span class="hero__marquee-accent">✦</span>
          <span class="hero__marquee-strong">Programmers &rarr; product builders</span>
          <span class="hero__marquee-accent">✦</span>
        </span>
      </div>
    </div>
  </section>
</template>

<script setup>
const tick = ref(0)
let intervalId = null

onMounted(() => {
  intervalId = window.setInterval(() => {
    tick.value += 1
  }, 700)
})

onBeforeUnmount(() => {
  if (intervalId) {
    window.clearInterval(intervalId)
  }
})
</script>

<style scoped>
.hero {
  max-width: 1280px;
  margin: 0 auto;
  padding: 8vh 8vw 14vh;
}

.hero__meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 80px;
}

.hero__est {
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.hero__title {
  margin: 0;
  font-family: var(--font-headline);
  font-size: 8.25rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 0.96;
  text-wrap: balance;
}

.hero__around {
  color: var(--dim);
  font-style: italic;
}

.hero__ai {
  position: relative;
  display: inline-block;
}

.hero__ai-wrap {
  white-space: nowrap;
}

.hero__underline {
  position: absolute;
  right: 0;
  bottom: 0.05em;
  left: 0;
  height: 6px;
  background: var(--accent);
  transform-origin: left;
  transition: transform 0.6s ease;
}

.hero__underline--short {
  transform: scaleX(0.6);
}

.hero__intro-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 96px;
  align-items: start;
  margin-top: 80px;
}

.hero__intro {
  max-width: 560px;
  margin: 0;
  color: var(--ink);
  font-size: 1.3125rem;
  line-height: 1.5;
}

.hero__intro strong {
  font-weight: 500;
}

.hero__facts {
  color: var(--dim);
  font-family: var(--font-body);
  font-size: 0.875rem;
  line-height: 1.6;
}

.hero__fact-end {
  border-top: 1px solid var(--rule);
}

.hero__marquee {
  margin-top: 120px;
  padding: 20px 0;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  overflow: hidden;
  white-space: nowrap;
}

.hero__marquee-track {
  display: inline-block;
  animation: marquee 40s linear infinite;
  color: var(--dim);
  font-family: var(--font-headline);
  font-size: 1.75rem;
  letter-spacing: 0;
}

.hero__marquee-strong {
  color: var(--ink);
}

.hero__marquee-accent {
  margin: 0 24px;
  color: var(--accent);
}

.hero__marquee-italic {
  font-style: italic;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-33.33%);
  }
}

@media (max-width: 1180px) {
  .hero__title {
    font-size: 6.75rem;
  }

  .hero__intro-grid {
    gap: 56px;
  }
}

@media (max-width: 900px) {
  .hero {
    padding: 7vh 6vw 10vh;
  }

  .hero__meta-row {
    align-items: flex-start;
    flex-direction: column;
    margin-bottom: 56px;
  }

  .hero__title {
    font-size: 4.7rem;
  }

  .hero__intro-grid {
    grid-template-columns: 1fr;
    gap: 42px;
    margin-top: 56px;
  }

  .hero__marquee {
    margin-top: 72px;
  }
}

@media (max-width: 560px) {
  .hero {
    padding: 6vh 5vw 8vh;
  }

  .hero__title {
    font-size: 3.45rem;
  }

  .hero__intro {
    font-size: 1.125rem;
  }

  .hero__est {
    white-space: normal;
  }

  .hero__marquee-track {
    font-size: 1.375rem;
  }
}
</style>
