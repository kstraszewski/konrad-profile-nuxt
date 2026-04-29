<template>
  <section id="track" class="track">
    <TwoCol label="§ 06 · Track record" sub="11 years · two companies">
      <SerifHeading :size="48" class="track__heading">
        Long arcs over loud titles. I stayed where the work compounded.
      </SerifHeading>

      <div class="track__list">
        <article
          v-for="(item, index) in experience"
          :key="`${item.year}-${item.role}`"
          class="track__item"
          :class="{ 'track__item--dim': hovered !== null && hovered !== index }"
          @mouseenter="hovered = index"
          @mouseleave="hovered = null"
        >
          <div class="track__year">{{ item.year }}</div>
          <div>
            <h3 class="track__role">{{ item.role }}</h3>
            <div class="track__org">{{ item.org }}</div>
          </div>
          <p class="track__description">{{ item.description }}</p>
        </article>
      </div>

      <div class="track__education">
        <div class="track__education-label">Education</div>
        <div>
          Automation &amp; Robotics
          <span>· West Pomeranian University of Technology</span>
        </div>
      </div>
    </TwoCol>
  </section>
</template>

<script setup>
const hovered = ref(null)

const experience = [
  {
    year: '2024 → now',
    role: 'AI Manager & Builder',
    org: 'Lendi',
    description:
      'Lead AI adoption company-wide. Redefine engineering function around the product-builder model. Ship internal tooling, agentic workflows, and the cultural shift that makes them stick.'
  },
  {
    year: '2024 → now',
    role: 'Founder',
    org: 'jasne.ai',
    description:
      'Vertical AI product. Solo end-to-end: design, code, infra, distribution. Vendor-agnostic stack on Vercel AI SDK.'
  },
  {
    year: '2023 - 2024',
    role: 'R&D',
    org: 'Lendi',
    description:
      'One year exploring AI as the next platform. Prototypes, internal tools, the case for company-wide adoption. The bridge between frontend lead and AI manager.'
  },
  {
    year: '2017 - 2023',
    role: 'Frontend Developer -> Lead',
    org: 'Lendi',
    description:
      "Seven years on Lendi's product. Started as Vue/Nuxt developer, grew into front-end lead. Shipped Nuxt 2/3 from alpha, mentored juniors, owned the front-end stack across B2B and B2C surfaces."
  },
  {
    year: '2015 - 2017',
    role: 'Frontend Developer',
    org: 'Finpack',
    description:
      'B2B financial calculators on Vue and Angular. Where I learned how much UI sits between a financial product and a customer.'
  }
]
</script>

<style scoped>
.track {
  border-top: 1px solid var(--rule);
}

.track__heading {
  max-width: 800px;
  margin-bottom: 60px;
}

.track__item {
  display: grid;
  grid-template-columns: 160px 1fr 1.2fr;
  gap: 40px;
  padding: 36px 0;
  border-top: 1px solid var(--rule);
  cursor: default;
  transition: opacity 0.2s ease;
}

.track__item:last-child {
  border-bottom: 1px solid var(--rule);
}

.track__item--dim {
  opacity: 0.3;
}

.track__year {
  padding-top: 6px;
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.track__role {
  margin: 0 0 6px;
  font-family: var(--font-headline);
  font-size: 1.625rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.15;
}

.track__org {
  color: var(--dim);
  font-size: 0.875rem;
}

.track__description {
  margin: 0;
  color: var(--ink);
  font-size: 0.9375rem;
  line-height: 1.55;
}

.track__education {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 40px;
  margin-top: 60px;
  font-size: 0.9375rem;
}

.track__education-label {
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.track__education span {
  color: var(--dim);
}

@media (max-width: 900px) {
  .track__item {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .track__education {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
