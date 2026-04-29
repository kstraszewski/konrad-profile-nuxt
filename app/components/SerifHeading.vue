<template>
  <component :is="tag" class="serif-heading" :style="{ '--serif-size': normalizedSize }">
    <slot />
  </component>
</template>

<script setup>
const props = defineProps({
  size: {
    type: [Number, String],
    default: 56
  },
  tag: {
    type: String,
    default: 'h2'
  }
})

const normalizedSize = computed(() => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size
})
</script>
