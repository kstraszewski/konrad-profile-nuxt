<template>
  <div class="eyebrow" :class="{ 'eyebrow--accent': accent }">
    <span class="eyebrow__dot" aria-hidden="true" />
    <slot />
  </div>
</template>

<script setup>
defineProps({
  accent: {
    type: Boolean,
    default: false
  }
})
</script>
