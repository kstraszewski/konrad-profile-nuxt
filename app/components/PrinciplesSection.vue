<template>
  <section id="principles" class="principles">
    <div class="principles__outer">
      <div class="principles__inner">
        <SectionLabel label="§ 04 · Principles" sub="Four beliefs, hard-earned" dark />

        <div>
          <h2 class="principles__heading">
            The opinions I'd defend in a room full of people who disagree.
          </h2>

          <div class="principles__list">
            <article v-for="(principle, index) in principles" :key="principle.number" class="principles__item">
              <div class="principles__number">P · {{ principle.number }}</div>
              <h3>{{ principle.heading }}</h3>
              <p>{{ principle.description }}</p>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const principles = [
  {
    number: '01',
    heading: 'Programmers become product builders',
    description:
      "AI collapses the distance between idea and shipped feature. The job stops being 'write code' and becomes 'own outcomes'. That's my main KPI at Lendi."
  },
  {
    number: '02',
    heading: 'Vendor-agnostic by default',
    description:
      'Models, vector stores, infra - all swappable. Bet on interfaces, not providers. The wrapper is the product; the model is a commodity.'
  },
  {
    number: '03',
    heading: "Replace, don't augment",
    description:
      "When AI eats 30% of a workflow, the move is to redesign the workflow - not wedge AI into the gaps. I redefine departments, not toolchains."
  },
  {
    number: '04',
    heading: 'Ship beats slides',
    description:
      "An adoption strategy that doesn't end in a deployed tool is a strategy that didn't happen. The deck is a side-effect, not the artefact."
  }
]
</script>

<style scoped>
.principles {
  border-top: 1px solid var(--rule);
  background: var(--dark-panel);
  color: var(--bg);
}

.principles__outer {
  padding: 120px 8vw;
}

.principles__inner {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 80px;
  max-width: 1280px;
  margin: 0 auto;
}

.principles__heading {
  margin: 0 0 80px;
  color: var(--bg);
  font-family: var(--font-headline);
  font-size: 4.5rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.02;
  text-wrap: balance;
}

.principles__list {
  display: flex;
  flex-direction: column;
}

.principles__item {
  display: grid;
  grid-template-columns: 80px 1fr 1fr;
  gap: 32px;
  padding: 40px 0;
  border-top: 1px solid var(--dark-rule);
}

.principles__item:last-child {
  border-bottom: 1px solid var(--dark-rule);
}

.principles__number {
  padding-top: 8px;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.12em;
}

.principles__item h3 {
  margin: 0;
  color: var(--bg);
  font-family: var(--font-headline);
  font-size: 2.25rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.1;
}

.principles__item p {
  margin: 0;
  color: #bbbbbb;
  font-size: 1rem;
  line-height: 1.55;
}

@media (max-width: 1020px) {
  .principles__outer {
    padding: 96px 6vw;
  }

  .principles__inner {
    grid-template-columns: 160px minmax(0, 1fr);
    gap: 48px;
  }

  .principles__item {
    grid-template-columns: 70px 1fr;
  }

  .principles__item p {
    grid-column: 2;
  }
}

@media (max-width: 760px) {
  .principles__outer {
    padding: 72px 6vw;
  }

  .principles__inner,
  .principles__item {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .principles__heading {
    margin-bottom: 56px;
    font-size: 3rem;
  }

  .principles__item p {
    grid-column: auto;
  }
}
</style>
