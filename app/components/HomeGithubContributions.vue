<script setup lang="ts">
const { data: contributions } = await useFetch('/api/github/contributions', {
  lazy: true,
  retry: 0,
  timeout: 5000,
})

const formattedTotal = computed(() => contributions.value
  ? new Intl.NumberFormat('en-US').format(contributions.value.total)
  : null)
</script>

<template>
  <a
    v-if="contributions && formattedTotal"
    class="home-github"
    :href="contributions.profileUrl"
    target="_blank"
    rel="noreferrer"
  >
    <strong class="home-github__total">{{ formattedTotal }}</strong>
    <span class="home-github__copy">
      GitHub contributions
      <small>in the last 12 months</small>
    </span>
    <HomeIcon name="arrow-up-right" :size="18" />
  </a>
</template>

<style scoped>
.home-github { display: flex; align-items: center; gap: 13px; width: fit-content; min-height: 48px; margin-top: 25px; color: var(--home-ink); text-decoration: none; }
.home-github__total { color: var(--home-blue); font-size: 32px; font-weight: 600; line-height: 1; letter-spacing: -1.2px; font-variant-numeric: tabular-nums; }
.home-github__copy { font-size: 13px; line-height: 1.4; }
.home-github__copy small { display: block; margin-top: 2px; color: var(--home-muted); font-size: 11px; }
.home-github > svg { margin-left: 6px; color: var(--home-muted); }
.home-github:hover .home-github__copy { text-decoration: underline; text-underline-offset: 4px; }
@media (max-width: 370px) {
  .home-github { gap: 10px; }
  .home-github__total { font-size: 29px; }
  .home-github > svg { margin-left: 0; }
}
</style>
