<template>
  <section class="stack">
    <TwoCol :label="profile.stack.label" :sub="profile.stack.sub">
      <SerifHeading :size="48" class="stack__heading">
        {{ profile.stack.heading }}
      </SerifHeading>

      <div class="stack__groups">
        <section v-for="group in profile.stack.groups" :key="group.label" class="stack__group">
          <h3 class="stack__group-label">{{ group.label }}</h3>
          <div class="stack__items">
            <div v-for="item in group.items" :key="item" class="stack__item">{{ item }}</div>
          </div>
        </section>
      </div>
    </TwoCol>
  </section>
</template>

<script setup>
import { profile } from '~/data/profile'
</script>

<style scoped>
.stack__heading {
  max-width: 800px;
  margin-bottom: 60px;
}

.stack__groups {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 48px;
}

.stack__group-label {
  margin: 0 0 16px;
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 400;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.stack__items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stack__item {
  padding-bottom: 10px;
  border-bottom: 1px solid var(--rule);
  font-family: var(--font-headline);
  font-size: 1.75rem;
  letter-spacing: 0;
  line-height: 1.2;
}

@media (max-width: 820px) {
  .stack__groups {
    grid-template-columns: 1fr;
  }
}
</style>
