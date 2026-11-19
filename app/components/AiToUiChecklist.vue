<script setup lang="ts">
import type { AiToUiChecklistReply } from '~~/shared/types/ai-to-ui'

const props = defineProps<{ reply: AiToUiChecklistReply }>()

const uid = useId()
const checked = ref<string[]>([])
const total = computed(() => props.reply.items.length)
const done = computed(() => props.reply.items.filter(item => checked.value.includes(item.id)).length)
const complete = computed(() => total.value > 0 && done.value === total.value)
</script>

<template>
  <div class="atu-list" :class="{ 'is-complete': complete }">
    <p v-if="reply.answer" class="atu-answer">{{ reply.answer }}</p>

    <section class="atu-list__frame" role="group" :aria-labelledby="`${uid}-title`">
      <div class="atu-list__head">
        <h3 :id="`${uid}-title`">Questions about the quote</h3>
        <p class="atu-list__counter" role="status">
          <span class="atu-list__sr">Questions checked. </span>
          <strong>{{ done }}</strong> of {{ total }}
        </p>
      </div>
      <div class="atu-list__bar" aria-hidden="true"><span :style="{ transform: `scaleX(${total ? done / total : 0})` }" /></div>

      <ul class="atu-list__items">
        <li v-for="item in reply.items" :key="item.id">
          <input
            :id="`${uid}-${item.id}`"
            v-model="checked"
            type="checkbox"
            :value="item.id"
            :aria-describedby="`${uid}-${item.id}-hint`"
          >
          <!-- The label names the box and, through its overlay, makes the whole row a tap target. -->
          <div>
            <label :for="`${uid}-${item.id}`" class="atu-list__label">{{ item.label }}</label>
            <p :id="`${uid}-${item.id}-hint`" class="atu-list__hint">{{ item.hint }}</p>
          </div>
        </li>
      </ul>

      <div class="atu-list__foot">
        <p class="atu-list__state">
          <mark v-if="complete">All listed questions checked.</mark>
          <template v-else>Check off each question after you discuss it.</template>
        </p>
        <!-- Always present, so resetting never drops keyboard focus. -->
        <button type="button" class="atu-list__reset" :aria-disabled="!done" @click="checked = []">Uncheck all</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.atu-list__frame { margin-top: 16px; border: 1px solid var(--atu-line); background: var(--atu-surface); }
.atu-list__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

.atu-list__head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; padding: 16px 16px 12px; }
.atu-list__head h3 { margin: 0; font-size: 17px; font-weight: 500; letter-spacing: -.3px; line-height: 1.3; }
.atu-list__counter { flex: 0 0 auto; margin: 0; color: var(--atu-muted); font-size: 14px; font-variant-numeric: tabular-nums; line-height: 1; }
.atu-list__counter strong { padding: 0 .12em; color: var(--atu-ink); font-size: 26px; font-weight: 600; letter-spacing: -1px; transition: background-color 240ms var(--atu-ease); }
.is-complete .atu-list__counter strong { background: var(--atu-lime); }

.atu-list__bar { height: 4px; background: var(--atu-line); }
.atu-list__bar span { display: block; height: 100%; background: var(--atu-blue); transform-origin: left; transition: transform 320ms var(--atu-ease), background-color 240ms var(--atu-ease); }
.is-complete .atu-list__bar span { background: var(--atu-ink); }

.atu-list__items { margin: 0; padding: 0; list-style: none; }
.atu-list__items li { position: relative; display: grid; grid-template-columns: 22px minmax(0, 1fr); column-gap: 14px; align-items: start; padding: 13px 16px 14px; border-top: 1px solid var(--atu-line); overflow-wrap: anywhere; }
.atu-list__items li:first-child { border-top: 0; }
.atu-list__items input { appearance: none; -webkit-appearance: none; display: grid; place-content: center; width: 22px; height: 22px; margin: 1px 0 0; border: 1.5px solid var(--atu-ink); border-radius: 0; background: var(--atu-surface); cursor: pointer; transition: background-color 140ms var(--atu-ease), border-color 140ms var(--atu-ease); }
.atu-list__items input::after { width: 11px; height: 6px; margin-top: -3px; border-bottom: 2px solid #fff; border-left: 2px solid #fff; content: ''; transform: rotate(-45deg) scale(0); transition: transform 160ms var(--atu-ease); }
.atu-list__items input:checked { border-color: var(--atu-blue); background: var(--atu-blue); }
.atu-list__items input:checked::after { transform: rotate(-45deg) scale(1); }
.atu-list__items input:focus-visible { outline: 2px solid var(--atu-blue); outline-offset: 3px; }
.atu-list__label { display: block; font-size: 15px; font-weight: 500; line-height: 1.45; cursor: pointer; transition: color 160ms var(--atu-ease); }
.atu-list__label::after { position: absolute; inset: 0; content: ''; }
.atu-list__hint { margin: 3px 0 0; color: var(--atu-muted); font-size: 13px; line-height: 1.5; }
.atu-list__items input:checked + div .atu-list__label { color: var(--atu-muted); text-decoration: line-through; text-decoration-color: #a9adb6; }

.atu-list__foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 16px; min-height: 56px; padding: 6px 16px; border-top: 1px solid var(--atu-line); }
.atu-list__state { margin: 0; color: var(--atu-muted); font-size: 13px; line-height: 1.5; }
.atu-list__state mark { padding: 2px 6px; background: var(--atu-lime); color: var(--atu-ink); font-weight: 500; }
.atu-list__reset { min-height: 44px; padding: 0; border: 0; background: none; color: var(--atu-ink); font-size: 13px; font-weight: 500; text-decoration: underline; text-decoration-color: #b3b6be; text-underline-offset: 4px; cursor: pointer; }
.atu-list__reset:hover { color: var(--atu-blue); text-decoration-color: currentColor; }
.atu-list__reset[aria-disabled='true'] { color: var(--atu-muted); text-decoration: none; cursor: default; }
.atu-list__reset:focus-visible { outline: 2px solid var(--atu-blue); outline-offset: 3px; }

@media (prefers-reduced-motion: reduce) {
  .atu-list__bar span,
  .atu-list__counter strong,
  .atu-list__label,
  .atu-list__items input,
  .atu-list__items input::after { transition: none; }
}
</style>
