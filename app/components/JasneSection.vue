<template>
  <section id="jasne" class="jasne">
    <TwoCol label="§ 03 · jasne.ai" sub="Case study · 2024 →">
      <div class="jasne__title-row">
        <SerifHeading :size="104">jasne.ai</SerifHeading>
        <a class="jasne__external" href="https://jasne.ai" target="_blank" rel="noreferrer">
          &nearr; jasne.ai
        </a>
      </div>

      <p class="jasne__intro">
        A vertical AI product I'm building end-to-end - design, code, infra,
        distribution. The thesis I sell at Lendi, proven on my own time.
      </p>

      <figure class="jasne__shot">
        <figcaption class="jasne__shot-label">FIG. 03.01 - JASNE.AI · PRODUCT SURFACE</figcaption>
        <div class="jasne__shot-center">
          <div class="jasne__shot-title">jasne.ai</div>
          <div class="jasne__shot-placeholder">[ DROP PRODUCT SHOT HERE ]</div>
        </div>
        <div class="jasne__shot-footer">
          <span>VERTICAL AI · SOLO BUILD</span>
          <span>2024 → NOW</span>
        </div>
      </figure>

      <div class="jasne__facts">
        <div v-for="fact in facts" :key="fact.label" class="jasne__fact">
          <div class="jasne__fact-label">{{ fact.label }}</div>
          <div class="jasne__fact-value">{{ fact.value }}</div>
        </div>
      </div>

      <div class="jasne__beats-wrap">
        <Eyebrow>Why I built it</Eyebrow>
        <div class="jasne__beats">
          <article v-for="beat in beats" :key="beat.number" class="jasne__beat">
            <div class="jasne__beat-number">{{ beat.number }}</div>
            <SerifHeading :size="28" tag="h3" class="jasne__beat-heading">
              {{ beat.heading }}
            </SerifHeading>
            <p>{{ beat.description }}</p>
          </article>
        </div>
      </div>
    </TwoCol>
  </section>
</template>

<script setup>
const facts = [
  { label: 'Role', value: 'Founder · solo build' },
  { label: 'Stack', value: 'Next, Vercel AI SDK' },
  { label: 'Models', value: 'Multi-vendor' },
  { label: 'DB', value: 'Vendor-agnostic' },
  { label: 'Status', value: 'Live · iterating' },
  { label: 'Started', value: '2024' }
]

const beats = [
  {
    number: '01',
    heading: 'The product is the wrapper',
    description:
      "The model changes every quarter. The product surface - the workflow, the trust, the speed - is what compounds. I optimised for the parts that don't move."
  },
  {
    number: '02',
    heading: 'Solo end-to-end',
    description:
      'Design, code, infra, distribution. Not because I had to - because the loop is the leverage. Anything I delegate slows the loop.'
  },
  {
    number: '03',
    heading: 'Proof of thesis',
    description:
      "I sell 'engineers as product builders' to Lendi. jasne.ai is me being the product builder. If it didn't work, I'd know."
  }
]
</script>

<style scoped>
.jasne {
  border-top: 1px solid var(--rule);
}

.jasne__title-row {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 8px;
}

.jasne__external {
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  text-decoration: none;
}

.jasne__intro {
  max-width: 820px;
  margin: 32px 0 60px;
  color: var(--ink);
  font-size: 1.5rem;
  line-height: 1.35;
}

.jasne__shot {
  position: relative;
  display: flex;
  height: 480px;
  flex-direction: column;
  justify-content: space-between;
  margin: 0;
  padding: 28px;
  border: 1px solid var(--rule);
  background: repeating-linear-gradient(135deg, var(--warm-panel) 0 14px, var(--bg) 14px 28px);
}

.jasne__shot-label,
.jasne__shot-footer,
.jasne__shot-placeholder {
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
}

.jasne__shot-center {
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
}

.jasne__shot-title {
  color: var(--ink);
  font-family: var(--font-headline);
  font-size: 5.5rem;
  letter-spacing: 0;
  line-height: 1;
}

.jasne__shot-placeholder {
  margin-top: 12px;
  letter-spacing: 0.1em;
}

.jasne__shot-footer {
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.jasne__facts {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  margin-top: 32px;
  border: 1px solid var(--rule);
}

.jasne__fact {
  padding: 20px 18px;
  border-right: 1px solid var(--rule);
}

.jasne__fact:last-child {
  border-right: 0;
}

.jasne__fact-label {
  margin-bottom: 8px;
  color: var(--dim);
  font-size: 0.625rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.jasne__fact-value {
  font-size: 0.875rem;
  font-weight: 500;
}

.jasne__beats-wrap {
  margin-top: 100px;
}

.jasne__beats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 48px;
  margin-top: 32px;
}

.jasne__beat-number {
  margin-bottom: 16px;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.1em;
}

.jasne__beat-heading {
  margin-bottom: 14px;
}

.jasne__beat p {
  margin: 0;
  color: var(--dim);
  font-size: 0.9375rem;
  line-height: 1.55;
}

@media (max-width: 1060px) {
  .jasne__facts {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .jasne__fact:nth-child(3) {
    border-right: 0;
  }

  .jasne__fact:nth-child(-n + 3) {
    border-bottom: 1px solid var(--rule);
  }
}

@media (max-width: 820px) {
  .jasne__beats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .jasne__intro {
    font-size: 1.1875rem;
  }

  .jasne__shot {
    height: 360px;
    padding: 20px;
  }

  .jasne__shot-title {
    font-size: 3.25rem;
  }

  .jasne__shot-footer {
    flex-direction: column;
    gap: 8px;
  }

  .jasne__facts {
    grid-template-columns: 1fr;
  }

  .jasne__fact,
  .jasne__fact:nth-child(3) {
    border-right: 0;
    border-bottom: 1px solid var(--rule);
  }

  .jasne__fact:last-child {
    border-bottom: 0;
  }
}
</style>
