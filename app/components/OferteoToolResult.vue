<template>
  <details class="ot-result" open>
    <summary class="ot-summary">
      <span class="ot-search" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6" /><path d="m15 15 4.5 4.5" /></svg></span>
      <span class="ot-summary-text">
        <strong>Dopasowani wykonawcy</strong>
        <span>{{ brief.service }}<span v-if="brief.city"> · {{ brief.city }}</span></span>
      </span>
      <span class="ot-count" :aria-label="offers.length + ' ' + profileLabel(offers.length)">{{ offers.length }}</span>
      <svg class="ot-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8 10 4 4 4-4" /></svg>
    </summary>

    <div class="ot-output">
      <div class="ot-offers">
        <article v-for="(offer, index) in offers" :key="offer.id" class="ot-offer" :aria-label="offer.name">
          <div class="ot-offer-heading">
            <span class="ot-avatar" :class="'ot-avatar-' + index % 3" aria-hidden="true">{{ initials(offer.name) }}</span>
            <div class="ot-company">
              <h3>{{ offer.name }}</h3>
              <div class="ot-meta">
                <span class="ot-city"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M15.5 8c0 4-5.5 8.5-5.5 8.5S4.5 12 4.5 8a5.5 5.5 0 0 1 11 0Z" /><circle cx="10" cy="8" r="1.75" /></svg>{{ offer.city }}</span>
                <span v-if="offer.rating !== null" class="ot-rating">
                  <span class="ot-star" aria-hidden="true">★</span>
                  <span class="ot-sr-only">Ocena </span><strong>{{ formatRating(offer.rating) }}</strong><span class="ot-sr-only"> na 5</span>
                  <span v-if="offer.reviewCount !== null" class="ot-reviews">({{ offer.reviewCount }} {{ reviewLabel(offer.reviewCount) }})</span>
                </span>
              </div>
            </div>
          </div>

          <a class="ot-profile" :href="offer.sourceUrl" :aria-label="'Zobacz profil ' + offer.name + ' w Oferteo — otwiera nową kartę'" target="_blank" rel="noopener noreferrer">
            Zobacz profil<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6 14 14 6M6 6h8v8" /></svg>
          </a>

          <ul class="ot-services" aria-label="Deklarowane usługi">
            <li v-for="service in offer.services.slice(0, 3)" :key="service">{{ service }}</li>
          </ul>

          <details class="ot-why">
            <summary>Dlaczego pasuje?<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m6 8 4 4 4-4" /></svg></summary>
            <div class="ot-explanation">
              <p>{{ offer.reason }}</p>
              <p class="ot-description">{{ offer.description }}</p>
            </div>
          </details>
        </article>
      </div>

      <div class="ot-source">
        <span class="ot-source-mark" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><path d="M5 3h7l3 3v11H5V3Zm7 0v4h3M8 10h4m-4 3h4" /></svg></span>
        <div><p class="ot-source-title">Publiczne profile Oferteo <span>· dane z {{ sourceDate }}</span></p><p class="ot-note">Cenę i dostępność potwierdź z wykonawcą. Opinie mogą obejmować niepotwierdzone transakcje.</p></div>
      </div>
    </div>
  </details>
</template>

<script setup lang="ts">
import type { OferteoOffer, OferteoBrief } from '~~/shared/types/oferteo'

const props = defineProps<{ offers: OferteoOffer[]; brief: OferteoBrief }>()
const sourceDate = computed(() => {
  const dates = props.offers.map(offer => offer.retrievedAt).filter(Boolean).sort()
  return dates[0] ? new Date(dates[0]).toLocaleDateString('pl-PL', { timeZone: 'Europe/Warsaw' }) : 'brak daty'
})
function initials(name: string) { return name.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('').toUpperCase() }
function formatRating(rating: number) { return rating.toLocaleString('pl-PL', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) }
function reviewLabel(count: number) { return count === 1 ? 'opinia' : count % 10 >= 2 && count % 10 <= 4 && !(count % 100 >= 12 && count % 100 <= 14) ? 'opinie' : 'opinii' }
function profileLabel(count: number) { return count === 1 ? 'profil' : count % 10 >= 2 && count % 10 <= 4 && !(count % 100 >= 12 && count % 100 <= 14) ? 'profile' : 'profili' }
</script>

<style scoped>
.ot-result {
  --ot-ink: #16345a;
  --ot-muted: #586879;
  --ot-orange: #ef7600;
  container: oferteo-results / inline-size;
  margin-top: 18px;
  border: 1px solid #e4e6e6;
  border-radius: 16px;
  background: #fff;
  color: var(--ot-ink);
  font-size: 13px;
  line-height: 1.5;
  letter-spacing: -.1px;
  overflow: hidden;
}
.ot-result *, .ot-result *::before, .ot-result *::after { box-sizing: border-box; }
.ot-result p, .ot-result h3, .ot-result ul { margin: 0; }
.ot-result svg { width: 20px; height: 20px; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }
.ot-result summary { list-style: none; cursor: pointer; }
.ot-result summary::-webkit-details-marker { display: none; }
.ot-result summary:focus-visible, .ot-result a:focus-visible { outline: 3px solid #1d65ad; outline-offset: -3px; border-radius: 7px; }

.ot-summary { display: flex; align-items: center; gap: 12px; min-height: 78px; padding: 16px 18px; background: #fffbf5; }
.ot-search { display: grid; place-items: center; width: 38px; height: 38px; flex-shrink: 0; border-radius: 12px; background: #fcebd6; color: #a14b00; }
.ot-summary-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.ot-summary-text strong { font-size: 15px; line-height: 1.35; font-weight: 650; letter-spacing: -.3px; }
.ot-summary-text > span { color: var(--ot-muted); font-size: 12px; line-height: 1.45; }
.ot-count { display: grid; place-items: center; min-width: 27px; height: 27px; margin-left: auto; padding: 0 7px; border: 1px solid #e5d9cb; border-radius: 8px; color: #77532c; font-size: 12px; font-weight: 600; font-variant-numeric: tabular-nums; }
.ot-chevron { color: #677587; transition: transform .18s ease; }
.ot-result[open] > .ot-summary > .ot-chevron { transform: rotate(180deg); }
.ot-output { border-top: 1px solid #ece7df; }

.ot-offer { display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: 'heading profile' 'services services' 'why why'; column-gap: 14px; padding: 16px 18px 7px; background: #fff; }
.ot-offer + .ot-offer { border-top: 1px solid #eceff1; }
.ot-offer-heading { grid-area: heading; display: flex; align-items: center; gap: 12px; min-width: 0; min-height: 44px; }
.ot-avatar { display: grid; place-items: center; flex-shrink: 0; width: 42px; height: 42px; border: 1px solid #d9e6ef; border-radius: 13px; background: #e9f1f7; color: #375e82; font-size: 14px; font-weight: 600; letter-spacing: .2px; }
.ot-avatar-1 { border-color: #eadfcd; background: #f5eee3; color: #82622d; }
.ot-avatar-2 { border-color: #d6e5dd; background: #eaf3ed; color: #426b55; }
.ot-company { min-width: 0; }
.ot-company h3 { color: var(--ot-ink); font-size: 15px; line-height: 1.35; font-weight: 650; letter-spacing: -.25px; overflow-wrap: anywhere; }
.ot-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 3px 12px; margin-top: 4px; color: var(--ot-muted); font-size: 12px; line-height: 1.5; }
.ot-city, .ot-rating { display: inline-flex; align-items: center; gap: 4px; }
.ot-city svg { width: 13px; height: 13px; color: #6b7b8b; }
.ot-star { color: #a95600; font-size: 13px; line-height: 1; }
.ot-rating strong { color: #334e6a; font-weight: 650; }
.ot-reviews { color: var(--ot-muted); white-space: nowrap; }

.ot-profile { grid-area: profile; display: inline-flex; align-items: center; justify-content: center; align-self: start; gap: 7px; min-height: 44px; padding: 0 12px; border: 1px solid #efd6b9; border-radius: 9px; background: #fff6e9; color: #964700; font-size: 12px; font-weight: 600; line-height: 1.3; white-space: nowrap; text-decoration: none; transition: background .18s ease, border-color .18s ease; }
.ot-profile svg { width: 16px; height: 16px; color: #ac5600; }
.ot-services { grid-area: services; display: flex; align-items: flex-start; flex-wrap: wrap; gap: 5px; padding: 7px 0 0 54px; list-style: none; }
.ot-services li { max-width: 100%; padding: 3px 7px; border-radius: 5px; background: #f3f5f6; color: #506174; font-size: 12px; line-height: 1.4; overflow-wrap: anywhere; }
.ot-why { grid-area: why; min-width: 0; margin-left: 54px; }
.ot-why summary { display: flex; align-items: center; gap: 5px; width: fit-content; min-height: 44px; color: #52667e; font-size: 12px; font-weight: 500; }
.ot-why summary svg { width: 14px; height: 14px; transition: transform .18s ease; }
.ot-why[open] summary svg { transform: rotate(180deg); }
.ot-explanation { margin: 0 0 12px; padding: 1px 0 0 12px; border-left: 2px solid #efc99d; }
.ot-explanation p { color: #435b73; font-size: 13px; line-height: 1.7; white-space: normal; overflow-wrap: anywhere; }
.ot-explanation .ot-description { margin-top: 8px; color: #617184; }

.ot-source { display: flex; align-items: flex-start; gap: 9px; padding: 14px 18px; border-top: 1px solid #eceff1; background: #fafbf9; }
.ot-source-mark { display: flex; align-items: center; height: 19px; color: #617184; }
.ot-source-mark svg { width: 16px; height: 16px; }
.ot-source-title { color: #465b70; font-size: 11px; font-weight: 600; line-height: 1.6; white-space: normal; }
.ot-source-title > span { color: #596d7f; font-weight: 400; }
.ot-note { margin-top: 3px !important; color: #596d7f; font-size: 11px; line-height: 1.65; white-space: normal; }
.ot-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

@container oferteo-results (max-width: 430px) {
  .ot-summary { min-height: 72px; gap: 9px; padding: 14px; }
  .ot-search { width: 32px; height: 32px; border-radius: 10px; }
  .ot-summary-text strong { font-size: 14px; }
  .ot-summary-text > span { font-size: 12px; }
  .ot-count { min-width: 24px; height: 24px; padding: 0 5px; }
  .ot-chevron { width: 16px; height: 16px; }
  .ot-offer { grid-template-areas: 'heading heading' 'services services' 'why profile'; column-gap: 8px; row-gap: 0; padding: 15px 14px 10px; }
  .ot-offer-heading { gap: 10px; }
  .ot-company h3 { font-size: 15px; }
  .ot-meta { gap: 3px 10px; }
  .ot-avatar { width: 40px; height: 40px; border-radius: 12px; }
  .ot-services { padding: 9px 0 7px; }
  .ot-services li:nth-child(n + 3) { display: none; }
  .ot-why { margin-left: 0; }
  .ot-profile { align-self: center; padding: 0 10px; }
  .ot-offer:has(.ot-why[open]) { grid-template-areas: 'heading heading' 'services services' 'why why' '. profile'; }
  .ot-explanation { margin-bottom: 8px; }
  .ot-source { gap: 8px; padding: 13px 14px; }
  .ot-source-title > span { display: block; }
}
@container oferteo-results (max-width: 310px) {
  .ot-search { display: none; }
  .ot-summary { gap: 7px; }
  .ot-summary-text strong { font-size: 14px; }
  .ot-profile { padding: 0 8px; gap: 4px; }
  .ot-why summary { font-size: 11px; gap: 2px; }
}
@media (hover: hover) {
  .ot-summary:hover { background: #fff6e9; }
  .ot-profile:hover { background: #ffecd4; border-color: #dfa35f; }
  .ot-why summary:hover { color: #16345a; text-decoration: underline; text-underline-offset: 3px; }
}
@media (prefers-reduced-motion: reduce) {
  .ot-chevron, .ot-why summary svg, .ot-profile { transition: none; }
}
</style>
