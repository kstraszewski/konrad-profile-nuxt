<template>
  <div class="concept" :aria-label="`Przykładowa koncepcja: ${conceptNames[ideaIndex] || conceptNames[0]}`">
    <div class="concept__topbar">
      <span class="concept__brand">oferteo<span class="concept__brand-divider">/</span><span class="concept__ai">AI</span></span>
      <span class="concept__badge"><span />Koncepcja</span>
    </div>

    <template v-if="ideaIndex === 0">
      <div v-if="!showBrief" class="concept__body concept__conversation">
        <p class="concept__eyebrow">Przykładowa rozmowa</p>
        <div class="concept__message concept__message--customer">Chcę wyremontować łazienkę,<br class="concept__desktop-break" /> około 6 m².</div>
        <div class="concept__assistant">
          <span class="concept__avatar concept__avatar--ai" aria-hidden="true">✦</span>
          <div>
            <p>Jaki zakres prac planujesz?</p>
            <div class="concept__choices" aria-label="Zakres remontu">
              <button type="button" :aria-pressed="scope === 'Cała łazienka'" @click="selectScope('Cała łazienka')">Cała łazienka</button>
              <button type="button" :aria-pressed="scope === 'Tylko płytki'" @click="selectScope('Tylko płytki')">Tylko płytki</button>
            </div>
          </div>
        </div>
        <div class="concept__summary">
          <span class="concept__check" aria-hidden="true">✓</span>
          <div><strong>{{ scope }} · ok. 6 m²</strong><span>Termin: do ustalenia</span></div>
        </div>
        <button ref="previewButton" class="concept__button" type="button" @click="openBrief">
          Podgląd briefu
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" /></svg>
        </button>
      </div>
      <div v-else class="concept__body concept__brief">
        <div class="concept__document-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"><path d="M7 3h7l5 5v13H5V3h2Zm7 0v6h5M9 13h6m-6 4h6" /></svg>
        </div>
        <p class="concept__eyebrow">Podgląd przykładowego briefu</p>
        <h3>Remont łazienki</h3>
        <dl class="concept__brief-fields">
          <div><dt>Powierzchnia</dt><dd>Około 6 m² <span class="concept__field-check" aria-label="potwierdzone">✓</span></dd></div>
          <div><dt>Zakres</dt><dd>{{ scope }} <span class="concept__field-check" aria-label="potwierdzone">✓</span></dd></div>
          <div><dt>Termin</dt><dd class="concept__unknown">Do ustalenia</dd></div>
        </dl>
        <p class="concept__document-note">Dane z rozmowy. Ten przykład nie jest wysyłany.</p>
        <button ref="backButton" class="concept__back" type="button" @click="closeBrief">← Wróć do rozmowy</button>
      </div>
    </template>

    <div v-else-if="ideaIndex === 1" class="concept__body concept__matching">
      <p class="concept__eyebrow">Przykładowe dopasowanie</p>
      <div class="concept__request-snippet">
        <span class="concept__service-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"><path d="M4 12h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-3Zm2 0V5a2 2 0 0 1 4 0M6 20v1m12-1v1M3 12h18" /></svg>
        </span>
        <div><strong>Remont łazienki · 6 m²</strong><span>Szczecin · termin do ustalenia</span></div>
      </div>
      <div class="concept__recommendation">
        <div class="concept__contractor">
          <span class="concept__avatar concept__avatar--contractor" aria-hidden="true">PW</span>
          <div><strong>Przykładowy wykonawca</strong><span>Usługi remontowe</span></div>
        </div>
        <p class="concept__match-title">Dlaczego to może być dobry kontakt?</p>
        <ul class="concept__match-reasons">
          <li><span class="concept__reason-mark" aria-hidden="true">✓</span><span>Remont łazienki<strong>Zgodny zakres usług</strong></span></li>
          <li><span class="concept__reason-mark" aria-hidden="true">✓</span><span>Szczecin<strong>W obszarze działania</strong></span></li>
          <li class="concept__reason--unknown"><span class="concept__reason-mark" aria-hidden="true">?</span><span>Dostępność<strong>Do potwierdzenia z wykonawcą</strong></span></li>
        </ul>
      </div>
    </div>

    <div v-else-if="ideaIndex === 2" class="concept__body concept__response">
      <p class="concept__eyebrow">Przykładowa odpowiedź</p>
      <div class="concept__composer">
        <div class="concept__composer-header"><span>Do: klient z przykładowego briefu</span><span class="concept__draft-badge">Szkic</span></div>
        <label :for="draftId" class="concept__visually-hidden">Edytuj przykładowy szkic odpowiedzi</label>
        <textarea :id="draftId" v-model="draft" spellcheck="false" />
        <div class="concept__composer-tools"><span aria-hidden="true">✦</span> Przygotowane na podstawie briefu</div>
      </div>
      <div class="concept__confirmation"><span aria-hidden="true">!</span><p><strong>Do potwierdzenia</strong>Termin i wycena</p></div>
      <p class="concept__human-review">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m10 2 6 2v5c0 4-6 8-6 8s-6-4-6-8V4l6-2Zm-3 7 2 2 4-4" /></svg>
        Wykonawca sprawdza i wysyła
      </p>
    </div>

    <div v-else class="concept__body concept__support">
      <p class="concept__eyebrow">Przykładowa sprawa</p>
      <div class="concept__case-heading"><span class="concept__case-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 16v-5a7 7 0 0 1 14 0v5M5 11H3v6h4v-6H5Zm14 0h2v6h-4v-6h2Zm0 6a4 4 0 0 1-4 4h-3" /></svg></span><div><h3>Klient nie odpowiada</h3><span>Widok dla opiekuna</span></div></div>
      <div class="concept__case-context">
        <p class="concept__small-label">Kontekst sprawy</p>
        <ul><li><span />Usługa: remont łazienki</li><li><span />Wykonawca zgłasza brak kontaktu</li><li><span />Historia prób kontaktu: do sprawdzenia</li></ul>
      </div>
      <div class="concept__next-step"><span class="concept__next-star" aria-hidden="true">✦</span><div><p class="concept__small-label">Proponowany następny krok</p><p>Sprawdź próby kontaktu i warunki zwrotu przed odpowiedzią wykonawcy.</p></div></div>
      <a class="concept__source" href="https://www.oferteo.pl/zwroty-kontaktow" target="_blank" rel="noopener noreferrer"><span>Źródło: Oferteo · zwroty kontaktów</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6 14 14 6M6 6h8v8" /></svg></a>
    </div>

    <p class="concept__visually-hidden" aria-live="polite" aria-atomic="true">{{ announcement }}</p>
  </div>
</template>

<script setup>
import { nextTick, ref, useId, watch } from 'vue'

const props = defineProps({ ideaIndex: { type: Number, default: 0 } })
const draftId = useId()
const conceptNames = ['Brief gotowy do wyceny', 'Dopasowanie z uzasadnieniem', 'Asystent pierwszej odpowiedzi', 'Copilot opiekuna klienta']
const scope = ref('Cała łazienka')
const showBrief = ref(false)
const previewButton = ref(null)
const backButton = ref(null)
const announcement = ref('')
const draft = ref('Dzień dobry! Dziękuję za zapytanie o remont łazienki o powierzchni ok. 6 m².\n\nCzy mogę prosić o zdjęcia i preferowany termin? Na tej podstawie ustalimy kolejne kroki oraz zakres wyceny.')

function selectScope(value) {
  scope.value = value
  announcement.value = `Wybrany zakres: ${value}. Powierzchnia około 6 metrów kwadratowych. Termin do ustalenia.`
}

async function openBrief() {
  showBrief.value = true
  announcement.value = `Podgląd briefu. Remont łazienki, około 6 metrów kwadratowych. Zakres: ${scope.value}. Termin do ustalenia. Dane nie zostały wysłane.`
  await nextTick()
  backButton.value?.focus({ preventScroll: true })
}

async function closeBrief() {
  showBrief.value = false
  announcement.value = 'Powrót do przykładowej rozmowy.'
  await nextTick()
  previewButton.value?.focus({ preventScroll: true })
}

watch(() => props.ideaIndex, () => {
  showBrief.value = false
  announcement.value = ''
})
</script>

<style scoped>
.concept { position: relative; width: 100%; min-width: 0; min-height: 416px; padding: 22px; border: 1px solid #dfe7ee; border-radius: 18px; background: #fff; color: #082754; box-shadow: 0 16px 45px -24px #08275435, 0 2px 5px #08275404; font-family: inherit; font-size: 15px; font-weight: 400; line-height: 1.5; box-sizing: border-box; }
.concept *, .concept *::before, .concept *::after { box-sizing: border-box; }
.concept p, .concept h3, .concept ul, .concept dl { margin: 0; }
.concept button, .concept textarea { font-family: inherit; }
.concept button, .concept a { -webkit-tap-highlight-color: transparent; }
.concept button:focus-visible, .concept a:focus-visible, .concept textarea:focus-visible { outline: 3px solid #f58200; outline-offset: 4px; }
.concept svg { flex: 0 0 auto; width: 20px; height: 20px; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.concept__topbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 24px; }
.concept__brand { display: inline-flex; align-items: baseline; gap: 10px; font-size: 22px; font-weight: 900; line-height: 1; letter-spacing: -1.1px; }
.concept__brand-divider { color: #d9e1e9; font-size: 19px; font-weight: 500; }
.concept__ai { color: #f58200; font-size: 13px; font-weight: 800; letter-spacing: 0; }
.concept__badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 9px; border-radius: 20px; background: #f2f5f8; color: #596b80; font-size: 10px; font-weight: 700; }
.concept__badge > span { width: 5px; height: 5px; border-radius: 50%; background: #8190a1; }
.concept__body { display: flex; flex-direction: column; }
.concept__eyebrow { color: #66778d; font-size: 11px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; }
.concept__conversation { gap: 17px; }
.concept__message { max-width: 85%; padding: 13px 16px; font-size: 16px; line-height: 1.55; }
.concept__message--customer { align-self: flex-end; border-radius: 14px 14px 3px 14px; background: #edf3fa; }
.concept__assistant { display: flex; align-items: flex-start; gap: 11px; }
.concept__assistant > div { padding-top: 3px; }
.concept__assistant p { font-size: 16px; font-weight: 650; }
.concept__avatar { display: inline-flex; flex: 0 0 auto; align-items: center; justify-content: center; }
.concept__avatar--ai { width: 30px; height: 30px; border-radius: 9px; background: #fff2e2; color: #d96c00; font-size: 22px; }
.concept__choices { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 10px; }
.concept__choices button { min-height: 34px; padding: 6px 11px; border: 1px solid #dfe7ee; border-radius: 7px; background: #fff; color: #445a74; font-size: 12px; font-weight: 700; cursor: pointer; transition: background 140ms ease, border-color 140ms ease; }
.concept__choices button[aria-pressed="true"] { border-color: #f58200; background: #fff6eb; color: #9d5100; }
@media (hover: hover) and (pointer: fine) { .concept__choices button:hover { background: #fff6eb; border-color: #f58200; } }
.concept__summary { display: flex; align-items: center; gap: 10px; padding: 11px 13px; border-radius: 9px; background: #f4f8f7; }
.concept__check { display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; flex: 0 0 auto; border-radius: 50%; background: #e0efe9; color: #167258; font-size: 13px; font-weight: 800; }
.concept__summary strong, .concept__summary div > span { display: block; }
.concept__summary strong { color: #205c4d; font-size: 13px; font-weight: 750; }
.concept__summary div > span { color: #61746e; font-size: 11px; }
.concept__button { display: inline-flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; min-height: 40px; padding: 9px 14px; border: 0; border-radius: 8px; background: #082754; color: #fff; font-size: 12px; font-weight: 750; cursor: pointer; transition: background 140ms ease; }
@media (hover: hover) and (pointer: fine) { .concept__button:hover { background: #123b75; } }
.concept__button svg { width: 17px; height: 17px; }
.concept__brief { align-items: flex-start; }
.concept__document-icon { display: grid; place-items: center; width: 43px; height: 43px; margin-bottom: 15px; border-radius: 11px; background: #fff3e4; color: #d87500; }
.concept__document-icon svg { width: 24px; height: 24px; }
.concept__brief h3 { margin-top: 5px; font-size: 23px; line-height: 1.3; font-weight: 850; letter-spacing: -.65px; }
.concept__brief-fields { width: 100%; margin-top: 18px !important; }
.concept__brief-fields > div { display: flex; justify-content: space-between; gap: 8px; padding: 10px 0; border-bottom: 1px solid #edf1f5; font-size: 12px; }
.concept__brief-fields dt { color: #66798e; }
.concept__brief-fields dd { display: flex; align-items: center; gap: 8px; margin: 0; text-align: right; font-weight: 750; }
.concept__field-check { color: #167258; }
.concept__unknown { color: #7e6c4a; font-weight: 500 !important; }
.concept__document-note { margin-top: 13px !important; color: #748295; font-size: 10px; }
.concept__back { min-height: 36px; margin-top: 9px; padding: 6px 0; border: 0; background: transparent; color: #082754; font-size: 12px; font-weight: 750; cursor: pointer; }
@media (hover: hover) and (pointer: fine) { .concept__back:hover { text-decoration: underline; text-underline-offset: 3px; } }
.concept__matching { gap: 15px; }
.concept__request-snippet { display: flex; align-items: center; gap: 11px; padding: 12px; border-radius: 9px; background: #f3f6fa; }
.concept__service-icon { display: grid; place-items: center; flex: 0 0 auto; width: 34px; height: 34px; border: 1px solid #e3eaf1; border-radius: 8px; background: #fff; color: #6985a9; }
.concept__request-snippet strong, .concept__request-snippet div > span { display: block; }
.concept__request-snippet strong { font-size: 14px; font-weight: 800; }
.concept__request-snippet div > span { margin-top: 2px; color: #718196; font-size: 11px; }
.concept__recommendation { padding: 17px; border: 1px solid #dfe7ee; border-radius: 11px; }
.concept__contractor { display: flex; align-items: center; gap: 11px; }
.concept__avatar--contractor { width: 36px; height: 36px; border-radius: 50%; background: #eaf0f8; color: #486991; font-size: 11px; font-weight: 850; }
.concept__contractor strong, .concept__contractor div > span { display: block; }
.concept__contractor strong { font-size: 14px; font-weight: 800; }
.concept__contractor div > span { color: #728196; font-size: 11px; }
.concept__match-title { margin: 17px 0 11px !important; color: #66778d; font-size: 11px; }
.concept__match-reasons { display: grid; gap: 11px; padding: 0; list-style: none; }
.concept__match-reasons li { display: flex; gap: 9px; font-size: 14px; font-weight: 750; line-height: 1.35; }
.concept__reason-mark { display: grid; place-items: center; flex: 0 0 auto; width: 22px; height: 22px; margin-top: 1px; border-radius: 50%; background: #e8f4ed; color: #167258; font-size: 11px; font-weight: 800; }
.concept__match-reasons strong { display: block; margin-top: 2px; color: #66778d; font-size: 11px; font-weight: 500; }
.concept__reason--unknown .concept__reason-mark { background: #fff2df; color: #aa690e; }
.concept__response { gap: 17px; }
.concept__composer { overflow: hidden; border: 1px solid #dfe7ee; border-radius: 11px; }
.concept__composer-header { display: flex; align-items: center; justify-content: space-between; gap: 5px; padding: 11px 13px; border-bottom: 1px solid #edf1f5; color: #7a8a9b; font-size: 10px; }
.concept__draft-badge { padding: 2px 7px; border-radius: 5px; background: #f3f6fa; color: #617991; font-size: 9px; font-weight: 750; }
.concept__composer textarea { display: block; width: calc(100% - 26px); min-height: 162px; margin: 12px 13px; padding: 0; resize: vertical; border: 0; border-radius: 3px; background: transparent; color: #274160; font-size: 14px; line-height: 1.7; }
.concept__composer-tools { display: flex; align-items: center; gap: 6px; padding: 0 13px 11px; color: #8693a4; font-size: 9px; }
.concept__composer-tools > span { color: #d97608; font-size: 15px; }
.concept__confirmation { display: flex; align-items: center; gap: 10px; padding: 11px 13px; border-radius: 9px; background: #fff8ee; color: #967043; }
.concept__confirmation > span { display: grid; place-items: center; width: 22px; height: 22px; border: 1px solid #e8cda5; border-radius: 50%; font-size: 12px; font-weight: 850; }
.concept__confirmation p { font-size: 11px; }
.concept__confirmation strong { display: block; color: #855925; font-size: 11px; font-weight: 800; }
.concept__human-review { display: flex; align-items: center; justify-content: center; gap: 6px; color: #8491a2; font-size: 10px; }
.concept__human-review svg { width: 14px; height: 14px; }
.concept__support { gap: 16px; }
.concept__case-heading { display: flex; align-items: center; gap: 12px; }
.concept__case-icon { display: grid; place-items: center; flex: 0 0 auto; width: 40px; height: 40px; border-radius: 11px; background: #edf3fa; color: #4e739f; }
.concept__case-icon svg { width: 23px; height: 23px; }
.concept__case-heading h3 { font-size: 18px; line-height: 1.3; font-weight: 850; letter-spacing: -.5px; }
.concept__case-heading div > span { display: block; margin-top: 3px; color: #728196; font-size: 10px; }
.concept__case-context { padding: 14px; border: 1px solid #e5ebf1; border-radius: 10px; }
.concept__small-label { font-size: 11px; font-weight: 800; }
.concept__case-context ul { display: grid; gap: 7px; margin-top: 9px; padding: 0; list-style: none; }
.concept__case-context li { display: flex; align-items: center; gap: 7px; color: #63768f; font-size: 12px; }
.concept__case-context li > span { flex: 0 0 auto; width: 4px; height: 4px; border-radius: 50%; background: #a6b6c9; }
.concept__next-step { display: flex; gap: 9px; padding: 14px; border-radius: 10px; background: #eef5f1; color: #245e4e; }
.concept__next-star { flex: 0 0 auto; color: #167258; font-size: 19px; line-height: 1.1; }
.concept__next-step .concept__small-label { margin-bottom: 5px; }
.concept__next-step p:not(.concept__small-label) { font-size: 14px; line-height: 1.65; }
.concept__source { display: flex; align-items: center; justify-content: space-between; gap: 8px; color: #6d7f95; font-size: 10px; text-decoration: none; }
@media (hover: hover) and (pointer: fine) { .concept__source:hover { color: #082754; text-decoration: underline; text-underline-offset: 3px; } }
.concept__source svg { width: 16px; height: 16px; }
.concept__visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
@media (max-width: 480px) {
  .concept { min-height: 410px; padding: 18px; border-radius: 14px; }
  .concept__topbar { margin-bottom: 21px; }
  .concept__message { max-width: 92%; font-size: 14px; }
  .concept__assistant { gap: 8px; }
  .concept__assistant p { font-size: 13px; }
  .concept__choices { gap: 5px; }
  .concept__choices button { padding-right: 8px; padding-left: 8px; font-size: 11px; }
  .concept__recommendation { padding: 13px; }
  .concept__contractor strong { font-size: 13px; }
  .concept__case-heading h3 { font-size: 17px; }
  .concept__case-context li { font-size: 11px; }
  .concept__composer-header { padding-right: 10px; padding-left: 10px; font-size: 9px; }
  .concept__composer textarea { min-height: 205px; font-size: 13px; }
}
@media (prefers-reduced-motion: reduce) {
  .concept button { transition: none; }
}
</style>
