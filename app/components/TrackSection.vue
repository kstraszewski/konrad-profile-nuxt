<template>
  <section id="track" class="track">
    <TwoCol :label="profile.track.label" :sub="profile.track.sub">
      <SerifHeading :size="48" class="track__heading">
        {{ profile.track.heading }}
      </SerifHeading>

      <div class="track__list">
        <article
          v-for="(item, index) in profile.track.experience"
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
          {{ profile.track.education.field }}
          <span>· {{ profile.track.education.school }}</span>
        </div>
      </div>
    </TwoCol>
  </section>
</template>

<script setup>
import { profile } from '~/data/profile'

const hovered = ref(null)
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
