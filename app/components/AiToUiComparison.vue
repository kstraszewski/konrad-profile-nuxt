<script setup lang="ts">
import type { AiToUiComparisonReply, AiToUiContractor } from '~~/shared/types/ai-to-ui'

const props = defineProps<{ reply: Pick<AiToUiComparisonReply, 'answer' | 'contractors'> }>()

type ColumnKey = 'name' | 'priceZl' | 'startInDays' | 'workDays' | 'warrantyMonths' | 'rating'
type Direction = 'ascending' | 'descending'
type Column = {
  key: ColumnKey
  label: string
  /** Direction that puts the best value first. Also the first click. */
  best: Direction
  /** How to read the order aloud: [ascending, descending]. */
  order: [string, string]
  format: (contractor: AiToUiContractor) => string
}

const quantity = (count: number, unit: string) => `${count} ${unit}${count === 1 ? '' : 's'}`
const amount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PLN', currencyDisplay: 'code', maximumFractionDigits: 0 })
const decimal = new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

const columns: Column[] = [
  { key: 'name', label: 'Contractor', best: 'ascending', order: ['A to Z', 'Z to A'], format: contractor => contractor.name },
  { key: 'priceZl', label: 'Price', best: 'ascending', order: ['lowest first', 'highest first'], format: contractor => amount.format(contractor.priceZl) },
  { key: 'startInDays', label: 'Start', best: 'ascending', order: ['earliest first', 'latest first'], format: contractor => `in ${quantity(contractor.startInDays, 'day')}` },
  { key: 'workDays', label: 'Duration', best: 'ascending', order: ['shortest first', 'longest first'], format: contractor => quantity(contractor.workDays, 'day') },
  { key: 'warrantyMonths', label: 'Warranty', best: 'descending', order: ['shortest first', 'longest first'], format: contractor => quantity(contractor.warrantyMonths, 'month') },
  { key: 'rating', label: 'Rating', best: 'descending', order: ['lowest first', 'highest first'], format: contractor => decimal.format(contractor.rating) },
]
const valueColumns = columns.slice(1)

const uid = useId()
const sort = ref<{ key: ColumnKey, direction: Direction }>({ key: 'priceZl', direction: 'ascending' })
const activeColumn = computed(() => columns.find(column => column.key === sort.value.key)!)

function sortBy(column: Column) {
  sort.value = sort.value.key === column.key
    ? { key: column.key, direction: sort.value.direction === 'ascending' ? 'descending' : 'ascending' }
    : { key: column.key, direction: column.best }
}

const byName = (left: AiToUiContractor, right: AiToUiContractor) => left.name.localeCompare(right.name, 'en-US')

const rows = computed(() => {
  const { key, direction } = sort.value
  const sign = direction === 'ascending' ? 1 : -1
  return [...props.reply.contractors].sort((left, right) =>
    (key === 'name' ? byName(left, right) : left[key] - right[key]) * sign || byName(left, right))
})

/** Rows holding the best value of the sorted column. Names have no winner. */
const bestIds = computed(() => {
  const { key, best } = activeColumn.value
  if (key === 'name') return new Set<string>()
  const values = props.reply.contractors.map(contractor => contractor[key])
  const target = best === 'ascending' ? Math.min(...values) : Math.max(...values)
  return new Set(props.reply.contractors.filter(contractor => contractor[key] === target).map(contractor => contractor.id))
})

const summary = computed(() => {
  const column = activeColumn.value
  const order = column.order[sort.value.direction === 'ascending' ? 0 : 1]
  return `Sorted by ${column.label.toLowerCase()}, ${order}. ${rows.value[0]?.name ?? ''} is first.`
})
</script>

<template>
  <div class="atu-cmp">
    <p v-if="reply.answer" class="atu-answer">{{ reply.answer }}</p>

    <div class="atu-cmp__frame">
      <p class="atu-cmp__sortlabel" aria-hidden="true">Sort by</p>
      <!-- Explicit roles keep table semantics when rows turn into cards on narrow widths. -->
      <table class="atu-cmp__table" role="table" :aria-describedby="`${uid}-summary`">
        <caption class="atu-cmp__caption">Fictional contractor comparison. Select a column heading to sort the table.</caption>
        <thead role="rowgroup">
          <tr role="row">
            <th
              v-for="column in columns"
              :key="column.key"
              role="columnheader"
              scope="col"
              :aria-sort="sort.key === column.key ? sort.direction : undefined"
            >
              <button type="button" class="atu-cmp__sort" @click="sortBy(column)">
                {{ column.label }}
                <svg class="atu-cmp__arrows" viewBox="0 0 10 14" width="10" height="14" aria-hidden="true" focusable="false">
                  <path class="atu-cmp__up" d="M5 1 9 6H1z" />
                  <path class="atu-cmp__down" d="M5 13 1 8h8z" />
                </svg>
              </button>
            </th>
          </tr>
        </thead>
        <TransitionGroup tag="tbody" name="atu-cmp-row" role="rowgroup">
          <tr v-for="contractor in rows" :key="contractor.id" role="row">
            <th role="rowheader" scope="row" class="atu-cmp__name">
              <span>{{ contractor.name }}</span>
              <small>{{ contractor.note }}</small>
            </th>
            <td
              v-for="column in valueColumns"
              :key="column.key"
              role="cell"
              :data-label="column.label"
              :class="{ 'is-sorted': sort.key === column.key }"
            >
              <span class="atu-cmp__cell">
                <span :class="{ 'atu-cmp__best': sort.key === column.key && bestIds.has(contractor.id) }">{{ column.format(contractor) }}</span>
                <small v-if="column.key === 'rating'">{{ quantity(contractor.reviews, 'review') }}</small>
              </span>
            </td>
          </tr>
        </TransitionGroup>
      </table>
    </div>

    <div class="atu-cmp__foot">
      <p :id="`${uid}-summary`" class="atu-cmp__summary" role="status">{{ summary }}</p>
      <p class="atu-cmp__fine">Contractors, prices, and timelines are fictional.</p>
    </div>
  </div>
</template>

<style scoped>
.atu-cmp { container-type: inline-size; }
.atu-cmp__frame { margin-top: 16px; border: 1px solid var(--atu-line); background: var(--atu-surface); }
.atu-cmp__sortlabel { display: none; }
.atu-cmp__table { width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.4; font-variant-numeric: tabular-nums; }
.atu-cmp__caption { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

.atu-cmp__table th,
.atu-cmp__table td { padding: 14px 12px; border-top: 1px solid var(--atu-line); text-align: right; vertical-align: top; font-weight: 400; }
.atu-cmp__table thead th { padding: 0; border-top: 0; background: var(--atu-paper); }
.atu-cmp__table thead th:first-child,
.atu-cmp__table .atu-cmp__name { text-align: left; }

.atu-cmp__sort { display: inline-flex; align-items: center; justify-content: flex-end; gap: 7px; width: 100%; min-height: 44px; padding: 0 12px; border: 0; border-radius: 0; background: none; color: var(--atu-muted); font-size: 11px; font-weight: 500; letter-spacing: .7px; line-height: 1.2; text-transform: uppercase; white-space: nowrap; cursor: pointer; transition: color 160ms var(--atu-ease); }
.atu-cmp__table thead th:first-child .atu-cmp__sort { justify-content: flex-start; }
.atu-cmp__sort:hover { color: var(--atu-ink); }
.atu-cmp__sort:focus-visible { outline: 2px solid var(--atu-blue); outline-offset: -2px; }
.atu-cmp__arrows { flex: 0 0 auto; fill: currentColor; }
.atu-cmp__arrows path { opacity: .28; transition: opacity 160ms var(--atu-ease); }
th[aria-sort] .atu-cmp__sort { color: var(--atu-blue); }
th[aria-sort='ascending'] .atu-cmp__up,
th[aria-sort='descending'] .atu-cmp__down { opacity: 1; }
th[aria-sort='ascending'] .atu-cmp__down,
th[aria-sort='descending'] .atu-cmp__up { opacity: .18; }

.atu-cmp__name { overflow-wrap: anywhere; }
.atu-cmp__name span { display: block; font-size: 15px; font-weight: 600; letter-spacing: -.2px; }
.atu-cmp__name small { display: block; max-width: 24ch; margin-top: 4px; color: var(--atu-muted); font-size: 12px; line-height: 1.45; }
.atu-cmp__cell { display: block; white-space: nowrap; }
.atu-cmp__cell small { display: block; margin-top: 4px; color: var(--atu-muted); font-size: 12px; }
.atu-cmp__table td.is-sorted { font-weight: 600; }
.atu-cmp__table td.is-sorted small { font-weight: 400; }
/* The same highlighter as the headings on the homepage. */
.atu-cmp__best { padding: 0 .22em; margin: 0 -.22em; background: linear-gradient(transparent 52%, var(--atu-lime) 52%, var(--atu-lime) 96%, transparent 96%); }

/* Rows cross while they reorder. An opaque background keeps their text from blending. */
.atu-cmp__table tbody th,
.atu-cmp__table tbody td { background: var(--atu-surface); }
.atu-cmp-row-move { transition: transform 420ms var(--atu-ease); }

.atu-cmp__foot { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 4px 20px; margin-top: 10px; color: var(--atu-muted); font-size: 12px; line-height: 1.5; }
.atu-cmp__foot p { margin: 0; }
.atu-cmp__summary { color: var(--atu-ink); }

/* Narrow chat column: rows become cards, column headers become sort buttons. */
@container (max-width: 600px) {
  .atu-cmp__sortlabel { display: block; margin: 0; padding: 12px 14px 8px; color: var(--atu-muted); font-size: 11px; font-weight: 500; letter-spacing: .7px; text-transform: uppercase; }
  .atu-cmp__table,
  .atu-cmp__table thead,
  .atu-cmp__table tbody,
  .atu-cmp__table th,
  .atu-cmp__table td { display: block; }
  .atu-cmp__table thead tr { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 14px 14px; }
  .atu-cmp__table thead th { background: none; }
  .atu-cmp__sort { width: auto; min-height: 44px; padding: 0 12px; border: 1px solid var(--atu-line); letter-spacing: .5px; }
  .atu-cmp__sort:focus-visible { outline-offset: 2px; }
  th[aria-sort] .atu-cmp__sort { border-color: var(--atu-blue); background: var(--atu-blue); color: #fff; }

  .atu-cmp__table tbody tr { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); column-gap: 20px; padding: 14px; border-top: 1px solid var(--atu-line); background: var(--atu-surface); }
  .atu-cmp__table tbody th,
  .atu-cmp__table tbody td { padding: 0; border-top: 0; }
  .atu-cmp__table .atu-cmp__name { grid-column: 1 / -1; padding-bottom: 6px; }
  .atu-cmp__name small { max-width: none; }
  .atu-cmp__table tbody td { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; padding: 8px 0; border-top: 1px solid var(--atu-line); }
  .atu-cmp__table tbody td::before { content: attr(data-label); color: var(--atu-muted); font-size: 12px; font-weight: 400; }
  .atu-cmp__cell { text-align: right; }
}

@container (max-width: 300px) {
  .atu-cmp__table tbody td { display: grid; align-content: start; gap: 4px; text-align: left; }
  .atu-cmp__cell { text-align: left; }
}

@media (prefers-reduced-motion: reduce) {
  .atu-cmp-row-move,
  .atu-cmp__sort,
  .atu-cmp__arrows path { transition: none; }
}
</style>
