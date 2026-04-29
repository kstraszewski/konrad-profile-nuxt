<template>
  <section class="two-col">
    <div class="two-col__inner">
      <SectionLabel :label="label" :sub="sub" :dark="dark" />
      <div>
        <slot />
      </div>
    </div>
  </section>
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
