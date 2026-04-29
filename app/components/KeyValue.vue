<template>
  <a
    v-if="href"
    class="kv kv--link"
    :class="[{ 'kv--dark': dark }, brand ? `kv--${brand}` : null]"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noreferrer' : undefined"
  >
    <span>{{ label }}</span>
    <span class="kv__value">{{ value }}</span>
  </a>

  <div v-else class="kv" :class="{ 'kv--dark': dark }">
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
  },
  href: {
    type: String,
    default: ''
  },
  external: {
    type: Boolean,
    default: false
  },
  brand: {
    type: String,
    default: ''
  }
})
</script>
