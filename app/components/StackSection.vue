<template>
  <section id="technologies" class="stack">
    <TwoCol :label="profile.stack.label" :sub="profile.stack.sub">
      <SerifHeading :size="48" class="stack__heading">
        {{ profile.stack.heading }}
      </SerifHeading>

      <div class="stack__tech-list" aria-label="Technologies">
        <div
          v-for="item in profile.stack.technologies"
          :key="item"
          class="stack__tech"
        >
          {{ item }}
        </div>
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

.stack__tech-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  min-width: 0;
  border-top: 1px solid var(--rule);
  border-left: 1px solid var(--rule);
}

.stack__tech {
  min-height: 112px;
  display: flex;
  align-items: flex-end;
  padding: 22px;
  border-right: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  font-family: var(--font-headline);
  font-size: 2.1rem;
  letter-spacing: 0;
  line-height: 1.05;
  overflow-wrap: anywhere;
  transition: background 0.18s ease, color 0.18s ease;
}

.stack__tech:hover {
  background: var(--ink);
  color: var(--bg);
}

@media (max-width: 820px) {
  .stack__tech-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stack__tech {
    min-height: 96px;
    padding: 18px;
    font-size: 1.85rem;
  }
}

@media (max-width: 560px) {
  .stack__tech-list {
    grid-template-columns: 1fr;
  }

  .stack__tech {
    min-height: 74px;
    font-size: 1.55rem;
  }
}

@media (max-width: 420px) {
  .stack__heading {
    margin-bottom: 36px;
  }

  .stack__tech {
    min-height: 64px;
    padding: 16px;
  }
}
</style>
