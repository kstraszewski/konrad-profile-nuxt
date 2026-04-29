<template>
  <div class="kv" :class="{ 'kv--dark': dark }">
    <span>{{ label }}</span>
    <span class="kv__value">{{ value }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  dark: {
    type: Boolean,
    default: false
  }
})
</script>
