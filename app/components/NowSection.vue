<template>
  <section id="now">
    <TwoCol :label="profile.now.label" :sub="profile.now.sub">
      <SerifHeading :size="48" class="now__heading">
        {{ profile.now.heading }}
      </SerifHeading>

      <div class="now__grid">
        <article v-for="item in profile.now.items" :key="item.heading" class="now__item">
          <div class="now__tag">{{ item.tag }}</div>
          <h3 class="now__item-heading">{{ item.heading }}</h3>
          <p class="now__description">{{ item.description }}</p>
        </article>
      </div>
    </TwoCol>
  </section>
</template>

<script setup>
import { profile } from '~/data/profile'
</script>

<style scoped>
.now__heading {
  max-width: 800px;
  margin-bottom: 56px;
}

.now__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 32px;
  min-width: 0;
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

@media (max-width: 1180px) {
  .now__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .now__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 420px) {
  .now__heading {
    margin-bottom: 36px;
  }

  .now__grid {
    gap: 26px;
  }
}
</style>
