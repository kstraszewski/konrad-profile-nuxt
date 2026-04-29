<template>
  <section id="now">
    <TwoCol label="§ 01 · Now" sub="2026 - present">
      <SerifHeading :size="48" class="now__heading">
        Three things, one thesis: the engineer's job has changed and the orgs that
        catch up will eat the ones that don't.
      </SerifHeading>

      <div class="now__grid">
        <article v-for="item in items" :key="item.heading" class="now__item">
          <div class="now__tag">{{ item.tag }}</div>
          <h3 class="now__item-heading">{{ item.heading }}</h3>
          <p class="now__description">{{ item.description }}</p>
        </article>
      </div>
    </TwoCol>
  </section>
</template>

<script setup>
const items = [
  {
    heading: 'Leading AI adoption at Lendi',
    description:
      "Company-wide rollout. Strategy, tooling, training, KPIs. The unglamorous work of moving an org from 'we should do something with AI' to 'this is how we ship now'.",
    tag: 'Day job'
  },
  {
    heading: 'Building jasne.ai',
    description:
      'A vertical AI product. Solo, end-to-end. Vendor-agnostic stack. The proof that the model I sell at Lendi works in the wild.',
    tag: 'Side build'
  },
  {
    heading: 'Writing the product-builder playbook',
    description:
      'Notes, essays, internal memos. What the engineering role becomes when AI is the default collaborator - and what hiring, performance, and team shape look like next.',
    tag: 'Public'
  }
]
</script>

<style scoped>
.now__heading {
  max-width: 800px;
  margin-bottom: 56px;
}

.now__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 32px;
}

.now__item {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 18px;
  border-top: 1px solid var(--ink);
}

.now__tag {
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.now__item-heading {
  margin: 0;
  font-family: var(--font-headline);
  font-size: 1.375rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.2;
}

.now__description {
  margin: 0;
  color: var(--dim);
  font-size: 0.875rem;
  line-height: 1.55;
}

@media (max-width: 920px) {
  .now__grid {
    grid-template-columns: 1fr;
  }
}
</style>
