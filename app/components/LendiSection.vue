<template>
  <section id="lendi" class="lendi">
    <TwoCol label="§ 02 · Lendi" sub="8.5 yrs · FE → Lead → R&D → AI">
      <SerifHeading :size="86" class="lendi__heading">
        <span class="lendi__accent">Lendi</span> is where I learned the building,
        the leading, and the unbuilding.
      </SerifHeading>

      <p class="lendi__intro">
        Most "AI managers" arrive at AI from outside the company. I arrived from
        inside - eight and a half years of shipping the product, leading the team,
        and watching what actually breaks. That history is the leverage.
      </p>

      <div class="lendi__phases">
        <article
          v-for="(phase, index) in phases"
          :key="phase.year"
          class="lendi__phase"
          :class="{ 'lendi__phase--current': index === phases.length - 1 }"
        >
          <div class="lendi__phase-kicker">YEAR {{ phase.ordinal }}</div>
          <h3 class="lendi__phase-year">{{ phase.year }}</h3>
          <div class="lendi__phase-label">{{ phase.label }}</div>
          <p class="lendi__phase-description">{{ phase.description }}</p>
        </article>
      </div>

      <div class="lendi__pillars-wrap">
        <Eyebrow>The mandate &middot; three pillars</Eyebrow>
        <div class="lendi__pillars">
          <article v-for="pillar in pillars" :key="pillar.number" class="lendi__pillar">
            <div class="lendi__pillar-kicker">PILLAR {{ pillar.number }}</div>
            <h3 class="lendi__pillar-heading">{{ pillar.heading }}</h3>
            <p class="lendi__pillar-line">{{ pillar.line }}</p>
            <ul class="lendi__pillar-list">
              <li v-for="item in pillar.bullets" :key="item">{{ item }}</li>
            </ul>
          </article>
        </div>
      </div>

      <figure class="lendi__quote">
        <blockquote>
          "If your AI strategy lives in one department, you're already behind. The
          work is to <span>redefine the unit</span> - not the tool."
        </blockquote>
        <figcaption>INTERNAL MEMO · LENDI · 2025</figcaption>
      </figure>
    </TwoCol>
  </section>
</template>

<script setup>
const phases = [
  {
    year: '2017',
    label: 'Joined Lendi',
    description: 'Vue/Nuxt developer. Frontend on B2B and B2C surfaces.',
    ordinal: '01'
  },
  {
    year: '2020',
    label: 'Frontend Lead',
    description: 'Owned the front-end stack. Mentored juniors. Nuxt 2 -> 3 from alpha.',
    ordinal: '04'
  },
  {
    year: '2023',
    label: 'R&D',
    description: 'One year off the product, on the future. AI prototypes, internal tools, the company-wide case.',
    ordinal: '07'
  },
  {
    year: '2024',
    label: 'AI Manager & Builder',
    description: 'Lead AI adoption company-wide. Redefine the engineering function.',
    ordinal: '08+'
  }
]

const pillars = [
  {
    number: '01',
    heading: 'Adoption',
    line: 'I roll AI into the seams of the company.',
    bullets: [
      'Internal copilots in product, eng, ops',
      'Agentic workflows that replace coordination meetings',
      'Tooling that ships, not slides that pitch'
    ]
  },
  {
    number: '02',
    heading: 'Redefinition',
    line: 'I move engineers from tickets to outcomes.',
    bullets: [
      'Product-builder competency model',
      'Smaller pods, larger surface, faster loops',
      'Performance shifted from velocity to ownership'
    ]
  },
  {
    number: '03',
    heading: 'Optimisation',
    line: "I find the 30% of work AI eats first - and don't pretend it's augmentation.",
    bullets: ['Replace rituals before tools', 'Audit work, not seats', 'Compounding wins beat hero deployments']
  }
]
</script>

<style scoped>
.lendi {
  border-top: 1px solid var(--rule);
  background: var(--warm-panel);
}

.lendi__heading {
  max-width: 940px;
}

.lendi__accent {
  color: var(--accent);
}

.lendi__intro {
  max-width: 780px;
  margin: 24px 0 0;
  color: var(--dim);
  font-size: 1.1875rem;
  line-height: 1.55;
}

.lendi__phases {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 80px;
  border: 1px solid var(--rule);
  background: var(--bg);
}

.lendi__phase {
  position: relative;
  padding: 28px 24px;
  border-right: 1px solid var(--rule);
}

.lendi__phase:last-child {
  border-right: 0;
}

.lendi__phase--current {
  background: rgba(196, 88, 42, 0.1);
}

.lendi__phase-kicker {
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
}

.lendi__phase-year {
  margin: 8px 0 4px;
  color: var(--ink);
  font-family: var(--font-headline);
  font-size: 2rem;
  font-weight: 400;
  letter-spacing: 0;
}

.lendi__phase--current .lendi__phase-year {
  color: var(--accent);
}

.lendi__phase-label {
  margin-bottom: 6px;
  font-size: 0.9375rem;
  font-weight: 500;
}

.lendi__phase-description {
  margin: 0;
  color: var(--dim);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.lendi__pillars-wrap {
  margin-top: 100px;
}

.lendi__pillars {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 32px;
  margin-top: 32px;
}

.lendi__pillar {
  display: flex;
  min-height: 320px;
  flex-direction: column;
  gap: 16px;
  padding: 28px;
  border: 1px solid var(--rule);
  background: var(--bg);
}

.lendi__pillar-kicker {
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
}

.lendi__pillar-heading {
  margin: 0;
  font-family: var(--font-headline);
  font-size: 2.25rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.05;
}

.lendi__pillar-line {
  margin: 0;
  color: var(--ink);
  font-size: 0.9375rem;
  font-style: italic;
  line-height: 1.4;
}

.lendi__pillar-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.lendi__pillar-list li {
  position: relative;
  padding-left: 16px;
  color: var(--dim);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.lendi__pillar-list li::before {
  position: absolute;
  left: 0;
  color: var(--accent);
  content: "-";
}

.lendi__quote {
  margin: 120px 0 0;
  padding: 60px 0;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
}

.lendi__quote blockquote {
  max-width: 900px;
  margin: 0;
  color: var(--ink);
  font-family: var(--font-headline);
  font-size: 2.75rem;
  font-style: italic;
  letter-spacing: 0;
  line-height: 1.15;
}

.lendi__quote span {
  color: var(--accent);
  font-style: normal;
}

.lendi__quote figcaption {
  margin-top: 24px;
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
}

@media (max-width: 1020px) {
  .lendi__phases,
  .lendi__pillars {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lendi__phase:nth-child(2) {
    border-right: 0;
  }

  .lendi__phase:nth-child(-n + 2) {
    border-bottom: 1px solid var(--rule);
  }
}

@media (max-width: 680px) {
  .lendi__phases,
  .lendi__pillars {
    grid-template-columns: 1fr;
  }

  .lendi__phase,
  .lendi__phase:nth-child(2) {
    border-right: 0;
    border-bottom: 1px solid var(--rule);
  }

  .lendi__phase:last-child {
    border-bottom: 0;
  }

  .lendi__quote {
    margin-top: 72px;
    padding: 42px 0;
  }

  .lendi__quote blockquote {
    font-size: 2rem;
  }
}
</style>
