<template>
  <section class="ot-result" aria-label="Dopasowani wykonawcy">
    <header class="ot-heading">
      <div class="ot-heading-text">
        <h2>{{ offers.length ? 'Dopasowani wykonawcy' : 'Szukamy dopasowania' }}</h2>
        <p>{{ brief.service || 'Twoje zlecenie' }}<span v-if="brief.city"> · {{ brief.city }}</span></p>
      </div>
      <span class="ot-count" :aria-label="offers.length + ' ' + profileLabel(offers.length)">{{ offers.length }}</span>
    </header>

    <div v-if="!offers.length" class="ot-empty">
      <span class="ot-empty-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6" /><path d="m15 15 4.5 4.5" /></svg></span>
      <h3>Jeszcze bez dopasowań</h3>
      <p>Doprecyzuj usługę, miasto lub zakres w rozmowie. Katalog demo obejmuje remonty łazienek w Warszawie.</p>
    </div>

    <div v-else class="ot-offers">
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

        <ul class="ot-services" aria-label="Deklarowane usługi">
          <li v-for="service in offer.services.slice(0, 3)" :key="service">{{ service }}</li>
        </ul>

        <p class="ot-reason">{{ offer.reason }}</p>

        <details class="ot-why">
          <summary>Dlaczego pasuje?<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m6 8 4 4 4-4" /></svg></summary>
          <div class="ot-explanation">
            <p>{{ offer.reason }}</p>
            <p v-if="offer.description" class="ot-description">{{ offer.description }}</p>
          </div>
        </details>

        <a class="ot-profile" :href="offer.sourceUrl" :aria-label="'Zobacz profil ' + offer.name + ' w Oferteo — otwiera nową kartę'" target="_blank" rel="noopener noreferrer">
          Zobacz profil<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6 14 14 6M6 6h8v8" /></svg>
        </a>
      </article>
    </div>

    <footer v-if="offers.length" class="ot-source">
      <p>Źródło: publiczne profile Oferteo · {{ sourceDate }}</p>
      <p>Cenę i dostępność potwierdź z wykonawcą. Opinie mogą obejmować niepotwierdzone transakcje.</p>
    </footer>
  </section>
</template>

<script setup lang="ts">
import type { OferteoOffer, OferteoBrief } from '~~/shared/types/oferteo'

const props = defineProps<{ offers: OferteoOffer[]; brief: OferteoBrief }>()
const sourceDate = computed(() => {
  const dates = [...new Set(props.offers.map(offer => offer.retrievedAt).filter(Boolean))].sort()
  const formatDate = (value: string) => new Date(value).toLocaleDateString('pl-PL', { timeZone: 'Europe/Warsaw' })
  if (!dates[0]) return 'brak daty'
  const firstDate = formatDate(dates[0])
  const lastDate = formatDate(dates[dates.length - 1]!)
  return firstDate === lastDate ? firstDate : `${firstDate}–${lastDate}`
})
function initials(name: string) { return name.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('').toUpperCase() }
function formatRating(rating: number) { return rating.toLocaleString('pl-PL', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) }
function reviewLabel(count: number) { return count === 1 ? 'opinia' : count % 10 >= 2 && count % 10 <= 4 && !(count % 100 >= 12 && count % 100 <= 14) ? 'opinie' : 'opinii' }
function profileLabel(count: number) { return count === 1 ? 'profil' : count % 10 >= 2 && count % 10 <= 4 && !(count % 100 >= 12 && count % 100 <= 14) ? 'profile' : 'profili' }
</script>

<style scoped>
.ot-result {
  --ot-ink: #16345a;
  --ot-muted: #657487;
  container: oferteo-results / inline-size;
  min-width: 0;
  background: #f6f7f8;
  color: var(--ot-ink);
  font-size: 13px;
  line-height: 1.5;
  letter-spacing: -.1px;
}
.ot-result *, .ot-result *::before, .ot-result *::after { box-sizing: border-box; }
.ot-result p, .ot-result h2, .ot-result h3, .ot-result ul { margin: 0; }
.ot-result svg { width: 20px; height: 20px; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }
.ot-result summary { list-style: none; cursor: pointer; }
.ot-result summary::-webkit-details-marker { display: none; }
.ot-result summary:focus-visible, .ot-result a:focus-visible { outline: 3px solid #1d65ad; outline-offset: 3px; border-radius: 7px; }

.ot-heading { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 16px; }
.ot-heading-text { min-width: 0; }
.ot-heading h2 { font-size: 17px; line-height: 1.4; font-weight: 650; letter-spacing: -.4px; }
.ot-heading p { margin-top: 3px; color: var(--ot-muted); font-size: 12px; overflow-wrap: anywhere; }
.ot-count { display: grid; place-items: center; flex-shrink: 0; min-width: 28px; height: 28px; padding: 0 8px; border: 1px solid #e4e8ed; border-radius: 9px; background: #fff; color: #52677f; font-size: 12px; font-weight: 600; font-variant-numeric: tabular-nums; }
.ot-offers { display: grid; gap: 12px; }
.ot-offer { display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: 'heading heading' 'services services' 'reason reason' 'why profile'; align-items: start; gap: 9px 12px; padding: 16px; border: 1px solid #e2e6eb; border-radius: 16px; background: #fff; }
.ot-offer-heading { grid-area: heading; display: flex; align-items: center; gap: 11px; min-width: 0; min-height: 42px; }
.ot-avatar { display: grid; place-items: center; flex-shrink: 0; width: 42px; height: 42px; border-radius: 12px; background: #eaf1f8; color: #375e82; font-size: 14px; font-weight: 600; letter-spacing: .2px; }
.ot-avatar-1 { background: #f7efe4; color: #82622d; }
.ot-avatar-2 { background: #eaf3ed; color: #426b55; }
.ot-company { min-width: 0; }
.ot-company h3 { color: var(--ot-ink); font-size: 15px; line-height: 1.35; font-weight: 650; letter-spacing: -.25px; overflow-wrap: anywhere; }
.ot-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 2px 10px; margin-top: 4px; color: var(--ot-muted); font-size: 11px; line-height: 1.5; }
.ot-city, .ot-rating { display: inline-flex; align-items: center; gap: 4px; }
.ot-city { min-width: 0; overflow-wrap: anywhere; }
.ot-city svg { width: 12px; height: 12px; color: #8190a0; }
.ot-star { color: #b75a00; font-size: 12px; line-height: 1; }
.ot-rating strong { color: #334e6a; font-weight: 650; }
.ot-reviews { color: var(--ot-muted); white-space: nowrap; }

.ot-services { grid-area: services; display: flex; align-items: flex-start; flex-wrap: wrap; gap: 5px; padding: 0; list-style: none; }
.ot-services li { max-width: 100%; padding: 3px 7px; border-radius: 6px; background: #f4f6f8; color: #617084; font-size: 11px; line-height: 1.4; overflow-wrap: anywhere; }
.ot-reason { grid-area: reason; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; color: #657487; font-size: 12px; line-height: 1.5; overflow-wrap: anywhere; }
.ot-why { grid-area: why; min-width: 0; align-self: center; }
.ot-why summary { display: flex; align-items: center; gap: 5px; width: fit-content; min-height: 44px; color: #62758c; font-size: 11px; font-weight: 500; }
.ot-why summary svg { width: 13px; height: 13px; transition: transform .18s ease; }
.ot-why[open] summary svg { transform: rotate(180deg); }
.ot-explanation { padding: 4px 0 3px 12px; border-left: 2px solid #f2d2af; }
.ot-explanation p { color: #435b73; font-size: 12px; line-height: 1.7; white-space: normal; overflow-wrap: anywhere; }
.ot-explanation .ot-description { margin-top: 8px; color: #657487; }
.ot-offer:has(.ot-why[open]) { grid-template-areas: 'heading heading' 'services services' 'why why' '. profile'; }
.ot-offer:has(.ot-why[open]) .ot-reason { display: none; }
.ot-profile { grid-area: profile; display: inline-flex; align-items: center; justify-content: center; align-self: center; gap: 7px; min-height: 44px; padding: 0 13px; border: 1px solid #f4d8bb; border-radius: 9px; background: #fff6ec; color: #a64f00; font-size: 12px; font-weight: 600; line-height: 1.3; white-space: nowrap; text-decoration: none; transition: background .18s ease, border-color .18s ease, transform .18s ease; }
.ot-profile svg { width: 15px; height: 15px; color: #b35800; }
.ot-profile:active { transform: translateY(1px); background: #ffebd5; }

.ot-source { display: grid; gap: 4px; margin-top: 16px; color: #748092; font-size: 10px; line-height: 1.6; }
.ot-source p { overflow-wrap: anywhere; }
.ot-empty { padding: 24px 20px; border: 1px dashed #d7dee7; border-radius: 16px; background: #fff; text-align: center; }
.ot-empty-icon { display: grid; place-items: center; width: 40px; height: 40px; margin: 0 auto 12px; border-radius: 12px; background: #fff0de; color: #b35c00; }
.ot-empty h3 { color: var(--ot-ink); font-size: 14px; font-weight: 600; }
.ot-empty p { max-width: 320px; margin: 7px auto 0; color: var(--ot-muted); font-size: 12px; line-height: 1.7; }
.ot-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

@container oferteo-results (max-width: 340px) {
  .ot-heading { gap: 10px; }
  .ot-heading h2 { font-size: 15px; }
  .ot-offer { gap: 8px; padding: 14px; border-radius: 14px; }
  .ot-offer-heading { gap: 9px; }
  .ot-avatar { width: 38px; height: 38px; border-radius: 10px; }
  .ot-company h3 { font-size: 14px; }
  .ot-meta { gap: 2px 8px; }
  .ot-profile { gap: 5px; padding: 0 10px; }
  .ot-why summary { gap: 3px; }
}
@container oferteo-results (max-width: 280px) {
  .ot-offer { grid-template-areas: 'heading heading' 'services services' 'reason reason' 'why why' 'profile profile'; }
  .ot-offer:has(.ot-why[open]) { grid-template-areas: 'heading heading' 'services services' 'why why' 'profile profile'; }
}
@media (hover: hover) and (pointer: fine) {
  .ot-profile:hover { background: #ffedd9; border-color: #ebb67f; }
  .ot-why summary:hover { color: #16345a; text-decoration: underline; text-underline-offset: 3px; }
}
@media (prefers-reduced-motion: reduce) {
  .ot-why summary svg, .ot-profile { transition: none; }
}
</style>
