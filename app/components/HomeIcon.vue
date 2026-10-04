<script setup lang="ts">
type IconName =
  | 'arrow-up-right'
  | 'arrow-down-right'
  | 'arrow-right'
  | 'arrow-up'
  | 'download'
  | 'rotate-cw'
  | 'plus'
  | 'x'

const props = withDefaults(defineProps<{
  name: IconName
  size?: number | string
}>(), {
  size: 20
})

const paths: Record<IconName, readonly string[]> = {
  'arrow-up-right': ['M7 17 17 7', 'M7 7h10v10'],
  'arrow-down-right': ['m7 7 10 10', 'M7 17h10V7'],
  'arrow-right': ['M5 12h14', 'm13 6 6 6-6 6'],
  'arrow-up': ['M12 19V5', 'm6 11 6-6 6 6'],
  download: ['M12 3v12', 'm7 10 5 5 5-5', 'M5 15v5h14v-5'],
  'rotate-cw': ['M20 11a8 8 0 1 0-2.3 6.7', 'M20 4v7h-7'],
  plus: ['M12 5v14', 'M5 12h14'],
  x: ['m6 6 12 12', 'M18 6 6 18']
}
</script>

<template>
  <svg
    class="home-icon"
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="(path, index) in paths[props.name]" :key="index" :d="path" />
  </svg>
</template>

<style scoped>
.home-icon {
  display: inline-block;
  flex-shrink: 0;
  vertical-align: middle;
}
</style>
