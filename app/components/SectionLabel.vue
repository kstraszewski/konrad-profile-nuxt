<template>
  <div class="section-label" :class="{ 'section-label--dark': dark }">
    {{ label }}
    <template v-if="sub">
      <br>
      <span class="section-label__sub">{{ sub }}</span>
    </template>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  sub: {
    type: String,
    default: ''
  },
  dark: {
    type: Boolean,
    default: false
  }
})
</script>
