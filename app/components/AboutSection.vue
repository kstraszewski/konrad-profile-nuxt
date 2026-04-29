<template>
  <section id="about" class="about">
    <TwoCol :label="profile.about.label" :sub="profile.about.sub">
      <div class="about__grid">
        <div class="about__lead">
          <SerifHeading :size="56" class="about__heading">
            {{ profile.about.heading }}
          </SerifHeading>
          <p>{{ profile.about.copy }}</p>
        </div>

        <div class="about__items" role="list">
          <div v-for="item in profile.about.items" :key="item.label" class="about__item" role="listitem">
            <span>{{ item.label }}</span>
            <p>{{ item.value }}</p>
          </div>
        </div>
      </div>
    </TwoCol>
  </section>
</template>

<script setup>
import { profile } from '~/data/profile'
</script>

<style scoped>
.about {
  border-top: 1px solid var(--rule);
}

.about__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr);
  gap: 72px;
  align-items: start;
}

.about__heading {
  max-width: 680px;
}

.about__lead p {
  max-width: 620px;
  margin: 28px 0 0;
  color: var(--dim);
  font-size: 1.25rem;
  line-height: 1.5;
}

.about__items {
  border-top: 1px solid var(--rule);
}

.about__item {
  display: grid;
  grid-template-columns: 140px minmax(0, 1fr);
  gap: 32px;
  padding: 24px 0;
  border-bottom: 1px solid var(--rule);
}

.about__item span {
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  line-height: 1.5;
  text-transform: uppercase;
}

.about__item p {
  margin: 0;
  color: var(--ink);
  font-size: 1rem;
  line-height: 1.55;
}

@media (max-width: 900px) {
  .about__grid,
  .about__item {
    grid-template-columns: 1fr;
  }

  .about__grid {
    gap: 44px;
  }

  .about__item {
    gap: 10px;
  }
}
</style>
