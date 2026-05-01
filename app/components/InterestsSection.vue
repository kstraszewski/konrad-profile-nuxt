<template>
  <section id="interests" class="interests">
    <TwoCol :label="profile.interests.label" :sub="profile.interests.sub">
      <div class="interests__head">
        <SerifHeading :size="48" class="interests__heading">
          {{ profile.interests.heading }}
        </SerifHeading>
        <p class="interests__note">{{ profile.interests.note }}</p>
      </div>

      <div class="interests__list" role="list">
        <article v-for="item in profile.interests.items" :key="item.title" class="interests__item" role="listitem">
          <span class="interests__number">{{ item.number }}</span>
          <div class="interests__copy">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
          <span class="interests__tag">{{ item.tag }}</span>
        </article>
      </div>
    </TwoCol>
  </section>
</template>

<script setup>
import { profile } from '~/data/profile'
</script>

<style scoped>
.interests {
  border-top: 1px solid var(--rule);
  background: var(--warm-panel);
}

.interests__head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 48px;
  align-items: end;
  min-width: 0;
  margin-bottom: 60px;
}

.interests__heading {
  max-width: 760px;
}

.interests__note {
  margin: 0;
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  line-height: 1.7;
  text-transform: uppercase;
}

.interests__list {
  border-top: 1px solid var(--rule);
}

.interests__item {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr) 170px;
  gap: 32px;
  align-items: start;
  min-width: 0;
  padding: 28px 0;
  border-bottom: 1px solid var(--rule);
  transition: padding-left 0.15s ease;
}

@media (hover: hover) {
  .interests__item:hover {
    padding-left: 12px;
  }
}

.interests__number,
.interests__tag {
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  line-height: 1.4;
  text-transform: uppercase;
}

.interests__copy h3 {
  margin: 0;
  font-family: var(--font-headline);
  font-size: 1.75rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.12;
}

.interests__copy p {
  max-width: 720px;
  margin: 12px 0 0;
  color: var(--ink);
  font-size: 0.975rem;
  line-height: 1.55;
}

.interests__tag {
  padding-top: 8px;
  text-align: right;
}

@media (max-width: 900px) {
  .interests__head,
  .interests__item {
    grid-template-columns: 1fr;
  }

  .interests__head {
    gap: 24px;
  }

  .interests__item {
    gap: 12px;
  }

  .interests__tag {
    padding-top: 0;
    text-align: left;
  }
}

@media (max-width: 420px) {
  .interests__head {
    margin-bottom: 36px;
  }

  .interests__copy h3 {
    font-size: 1.45rem;
  }

  .interests__item {
    padding: 24px 0;
  }
}
</style>
