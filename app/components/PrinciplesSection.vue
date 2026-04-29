<template>
  <section id="principles" class="principles">
    <div class="principles__outer">
      <div class="principles__inner">
        <SectionLabel :label="profile.principles.label" :sub="profile.principles.sub" dark />

        <div>
          <h2 class="principles__heading">
            {{ profile.principles.heading }}
          </h2>

          <div class="principles__list">
            <article
              v-for="principle in profile.principles.items"
              :key="principle.number"
              class="principles__item"
            >
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
import { profile } from '~/data/profile'
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
  color: #f5f5f5;
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
