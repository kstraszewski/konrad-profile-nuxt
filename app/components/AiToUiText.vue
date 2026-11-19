<script setup lang="ts">
import type { AiToUiTextReply } from '~~/shared/types/ai-to-ui'

defineProps<{ reply: AiToUiTextReply }>()
</script>

<template>
  <!-- Plain text interpolation: model output is never rendered as HTML. -->
  <p class="atu-answer">{{ reply.answer }}</p>
</template>
