<script setup lang="ts">
import { codexUsage, formatCodexTokens } from '#shared/data/activity'

const { data: contributions } = await useFetch('/api/github/contributions', {
  lazy: true,
  retry: 0,
  timeout: 5000,
})

const formattedTotal = computed(() => contributions.value
  ? new Intl.NumberFormat('en-US').format(contributions.value.total)
  : null)

const codexTotal = formatCodexTokens()
const codexDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
}).format(new Date(`${codexUsage.recordedAt}T00:00:00Z`))
</script>

<template>
  <dl class="profile-activity" aria-label="GitHub and Codex activity">
    <div v-if="contributions && formattedTotal" class="profile-activity__item">
      <dt>
        <a :href="contributions.profileUrl" target="_blank" rel="noreferrer">
          GitHub contributions <HomeIcon name="arrow-up-right" :size="14" />
        </a>
      </dt>
      <dd>{{ formattedTotal }}</dd>
      <dd class="profile-activity__note">in the last 12 months</dd>
    </div>
    <div class="profile-activity__item" :title="`Approximate total from ${codexUsage.source.toLowerCase()}`">
      <dt>Codex tokens used</dt>
      <dd>{{ codexTotal }}</dd>
      <dd class="profile-activity__note">Approx. total · <time :datetime="codexUsage.recordedAt">{{ codexDate }}</time></dd>
    </div>
  </dl>
</template>

<style scoped>
.profile-activity { display: flex; flex-wrap: wrap; gap: 20px 24px; margin: 25px 0 0; color: var(--home-ink, var(--ink)); font-family: var(--font-body); }
.profile-activity__item { display: flex; flex-direction: column; align-items: flex-start; gap: 5px; min-width: 0; }
.profile-activity__item + .profile-activity__item { padding-left: 24px; border-left: 1px solid var(--home-line, var(--rule)); }
.profile-activity dt { order: 1; font-size: 13px; line-height: 1.4; }
.profile-activity dt a { display: inline-flex; align-items: center; gap: 5px; color: inherit; text-decoration: none; }
.profile-activity dt a:hover { text-decoration: underline; text-underline-offset: 4px; }
.profile-activity dt a:focus-visible { outline: 2px solid var(--home-blue, var(--accent)); outline-offset: 4px; }
.profile-activity dd { margin: 0; color: var(--home-blue, var(--accent)); font-size: 32px; font-weight: 600; line-height: 1; letter-spacing: -1.2px; font-variant-numeric: tabular-nums; }
.profile-activity .profile-activity__note { order: 2; color: var(--home-muted, var(--dim)); font-size: 11px; font-weight: 400; line-height: 1.5; letter-spacing: 0; }
@media (max-width: 420px) {
  .profile-activity { gap: 16px; }
  .profile-activity__item + .profile-activity__item { padding-left: 16px; }
  .profile-activity dt { font-size: 12px; }
  .profile-activity dd { font-size: 29px; }
  .profile-activity .profile-activity__note { max-width: 130px; }
}
</style>
