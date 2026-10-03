<template>
  <main class="oferteo-page">
    <a class="skip-link" href="#main-content">Przejdź do treści</a>
    <header class="site-header">
      <div class="page-width header-inner">
        <a class="personal-brand" href="/" aria-label="Konrad Straszewski — strona główna"><span class="personal-mark">ks<span>.</span></span><span>Konrad Straszewski</span></a>
        <nav class="desktop-nav" aria-label="Sekcje strony"><a href="#demos">Dwa demka AI</a><a href="#proof">Doświadczenie</a><a href="#plan">Pierwszy krok</a></nav>
        <a class="header-contact" :href="profile.links.email.href" @click="track('email')">Porozmawiajmy <span aria-hidden="true">↗</span></a>
      </div>
    </header>

    <section id="main-content" class="hero page-width">
      <div class="hero-copy">
        <div class="collaboration-line"><span>Propozycja współpracy dla</span><span class="oferteo-wordmark" aria-label="Oferteo"><span>o</span>ferte<span>o</span></span></div>
        <h1>Od pierwszego pytania do <span>dobrego zlecenia.</span></h1>
        <p class="hero-lead">Chcę rozwijać AI, które pomaga klientom opisać potrzebę, a wykonawcom szybciej przejść do konkretów.</p>
        <div class="hero-actions"><a class="button button-orange" href="#demos" @click="track('demos')">Wypróbuj dwa demka <span aria-hidden="true">↓</span></a><a class="text-link" :href="cvHref" :download="cvFilename" @click="track('download_cv')">Pobierz moje CV <span aria-hidden="true">↗</span></a></div>
        <div class="candidate-line"><span class="candidate-icon" aria-hidden="true">K</span><div><strong>Konrad Straszewski</strong><span>Forward Deployed Engineer / AI Manager</span></div></div>
      </div>
      <div class="hero-scene">
        <img class="hero-photo" src="https://static.oferteo.pl/images/oferteo/o-hero.l.webp" alt="Jasna kuchnia z drewnianymi szafkami — zdjęcie ze strony Oferteo" width="720" height="820" fetchpriority="high">
        <div class="scene-label"><span aria-hidden="true">✳</span> Mała zmiana w rozmowie. Duża różnica w procesie.</div>
        <div class="scene-story">
          <div class="scene-message"><span class="message-avatar" aria-hidden="true">K</span><p>„Chcę wyremontować łazienkę.<br>Od czego zacząć?”</p></div>
          <div class="scene-brief">
            <div class="scene-brief-top"><span class="ai-mark" aria-hidden="true">✳</span><span>Od potrzeby do konkretu</span><span class="concept-chip">Koncept AI</span></div>
            <h2>Zapytanie, na które<br>łatwiej odpowiedzieć.</h2>
            <div class="brief-checks"><span><i aria-hidden="true">✓</i> Zakres prac</span><span><i aria-hidden="true">✓</i> Lokalizacja</span><span><i aria-hidden="true">✓</i> Termin</span></div>
            <div class="scene-brief-bottom"><span>AI dopytuje. Klient zatwierdza.</span><a href="#demos" aria-label="Zobacz dwa demka AI"><span aria-hidden="true">↗</span></a></div>
          </div>
          <p class="scene-caption">Przykładowy scenariusz · propozycja dla Oferteo</p>
        </div>
      </div>
    </section>

    <section class="experience-strip page-width" aria-label="Moje doświadczenie w skrócie"><p>Doświadczenie,<br>które wnoszę.</p><div v-for="item in credentials" :key="item.name" class="credential"><strong><a v-if="item.name === 'NeoIQ'" :href="profile.links.neoiq.href" target="_blank" rel="noopener noreferrer">{{ item.name }} ↗</a><template v-else>{{ item.name }}</template></strong><span>{{ item.detail }}</span></div></section>

    <section id="demos" class="demos-section">
      <span id="ideas" aria-hidden="true" />
      <div class="page-width">
        <div class="section-heading"><div><p class="eyebrow"><span /> Dwa działające demka</p><h2>Wybierz demo</h2></div><p>Szukasz wykonawcy czy przygotowujesz ofertę? Wybierz jedną z rozmów poniżej.</p></div>
        <div class="demo-grid">
          <article class="demo-card demo-card-search">
            <div class="demo-card-heading"><span class="demo-number">DEMO 01</span><span class="demo-audience">Dla szukającego wykonawcy</span></div>
            <div class="demo-card-copy">
              <h3>Znajdź wykonawcę</h3>
              <p>Opisz, czego potrzebujesz. Asystent dopyta o szczegóły i pokaże dopasowane profile w czacie.</p>
              <NuxtLink class="demo-open" to="/oferto/demo" aria-label="Uruchom demo 1: szukanie wykonawcy" @click="track('demo_1')"><span>Uruchom demo 1</span><span aria-hidden="true">↗</span></NuxtLink>
            </div>
            <div class="demo-visual demo-search-visual" aria-hidden="true">
              <div class="mini-message"><span>Ty</span><p>Szukam ekipy do remontu<br>łazienki w Warszawie.</p></div>
              <div class="mini-search-result"><div class="mini-result-title"><span>✳</span><strong>Oto dopasowane profile</strong><span>3</span></div><div class="mini-contractor"><span class="mini-contractor-mark">MŁ</span><div><strong>Remonty łazienek</strong><span>Warszawa · kompleksowy zakres</span></div><span>↗</span></div><div class="mini-match-note"><span>✓</span> Wiesz, dlaczego pasują</div></div>
              <span class="demo-preview-note">Podgląd przykładowej rozmowy</span>
            </div>
          </article>
          <article class="demo-card demo-card-create">
            <div class="demo-card-heading"><span class="demo-number">DEMO 02</span><span class="demo-audience">Dla wykonawcy</span></div>
            <div class="demo-card-copy">
              <h3>Przygotuj ofertę</h3>
              <p>Podaj zakres, cenę i termin. Asystent ułoży szkic oferty, który dopracujesz w rozmowie.</p>
              <NuxtLink class="demo-open" to="/oferto/demo-2" aria-label="Uruchom demo 2: kreator oferty" @click="track('demo_2')"><span>Uruchom demo 2</span><span aria-hidden="true">↗</span></NuxtLink>
            </div>
            <div class="demo-visual demo-create-visual" aria-hidden="true">
              <div class="mini-offer"><div class="mini-offer-top"><span>OFERTA DLA KLIENTA</span><span>Wersja 2</span></div><strong>Remont łazienki<br>od A do Z.</strong><div class="mini-offer-lines"><span/><span/></div><div class="mini-offer-facts"><div>Zakres<strong>Ustalony w rozmowie</strong></div><div>Wycena<strong>Twoje warunki</strong></div></div></div>
              <div class="mini-edit"><span>✳</span><p>„Skróć opis i zaznacz,<br>że materiały są po stronie klienta.”</p><span>✓</span></div>
              <span class="demo-preview-note">Podgląd przykładowej oferty</span>
            </div>
          </article>
        </div>
        <div class="demos-note"><span class="demos-note-mark" aria-hidden="true">✳</span><p>Wypróbuj własny scenariusz lub zacznij od przykładu. To niezależne demonstracje — niczego nie publikują i nie wysyłają do firm.</p></div>
      </div>
    </section>

    <section id="proof" class="proof-section page-width">
      <div class="proof-intro"><p class="eyebrow"><span /> Dlaczego ja</p><h2>Łączę perspektywę<br>buildera i AI Managera.</h2><p>Potrafię wejść w proces, zbudować rozwiązanie i pomóc zespołowi wprowadzić je do codziennej pracy.</p><a class="text-link" href="/" @click="track('profile')">Poznaj mnie bliżej <span aria-hidden="true">↗</span></a></div>
      <div class="proof-grid">
        <article class="proof-card proof-card-main"><span class="proof-card-label">Lendi · AI Manager</span><strong>Od kodu<br>do zmiany w zespole.</strong><p>Frontend Lead w latach 2020–2023: 8-osobowy zespół. Od 2024 roku AI Manager i wdrażanie AI. Znam produkt od środka.</p><span class="proof-card-tag">Strategia → wdrożenie → adopcja</span></article>
        <article class="proof-card"><span class="proof-card-label">jasne.ai · Founder</span><strong>Od 0 do 1.</strong><p>Własny produkt AI: UX, kod, infrastruktura, integracje i dystrybucja.</p><NuxtLink to="/jasne.ai">Zobacz case study <span aria-hidden="true">↗</span></NuxtLink></article>
        <article class="proof-card"><span class="proof-card-label">PostHog + <a :href="profile.links.neoiq.href" target="_blank" rel="noopener noreferrer">NeoIQ ↗</a></span><strong>Dane zamiast domysłów.</strong><p>Analityka w dwóch organizacjach i doświadczenie z AI opartym na dużych bazach wiedzy.</p><span class="proof-card-tag">Analityka · MCP · retrieval</span></article>
      </div>
    </section>
    <section id="plan" class="plan-section page-width">
      <div class="section-heading"><div><p class="eyebrow"><span /> Pierwszy krok</p><h2>Jedna kategoria.<br>Jeden sensowny pilot.</h2></div><p>Zacząłbym od jakości zapytania. Niewielki zakres pozwoli szybko sprawdzić, co pomaga klientowi i wykonawcy.</p></div>
      <ol class="plan-steps"><li v-for="(step, index) in steps" :key="step.title"><div class="step-top"><span>0{{ index + 1 }}</span><i aria-hidden="true">→</i></div><h3>{{ step.title }}</h3><p>{{ step.description }}</p></li></ol>
    </section>
    <section id="contact" class="contact-section page-width">
      <div class="contact-card"><div><p class="eyebrow">Zbudujmy coś przydatnego</p><h2>Od rozmowy<br>do pierwszego wdrożenia.</h2><p>Chętnie porozmawiam o tym, gdzie AI może dziś<br class="desktop-break"> najbardziej pomóc Oferteo.</p></div><div class="contact-actions"><a class="button button-orange" :href="profile.links.email.href" @click="track('email')">Porozmawiajmy <span aria-hidden="true">↗</span></a><a class="contact-email" :href="profile.links.email.href">{{ profile.person.email }}</a><div class="social-links"><a :href="profile.links.linkedin.href" target="_blank" rel="noreferrer" @click="track('linkedin')">LinkedIn ↗</a><a :href="profile.links.github.href" target="_blank" rel="noreferrer" @click="track('github')">GitHub ↗</a><a :href="cvHref" :download="cvFilename" @click="track('download_cv')">CV · EN ↓</a><NuxtLink to="/mcp">MCP CV ↗</NuxtLink></div></div></div>
    </section>
    <footer id="sources" class="site-footer page-width"><div class="footer-top"><span>Konrad Straszewski <span class="footer-cross">×</span> Oferteo</span><p>Autorska propozycja współpracy</p></div><div class="footer-sources"><span>Kontekst:</span><a v-for="source in pitch.ideas.sources" :key="source.href" :href="source.href" target="_blank" rel="noreferrer">{{ source.label }} ↗</a><a href="https://www.oferteo.pl/" target="_blank" rel="noreferrer">Zdjęcie: Oferteo ↗</a></div></footer>
  </main>
</template>

<script setup>
import { profile } from '~/data/profile'
const pitch = profile.oferteo
const posthog = usePostHog()
const cvHref = '/api/cv/oferteo-fde-ai-manager.pdf'
const cvFilename = 'Konrad-Straszewski-CV-Oferteo-FDE-AI-Manager.pdf'
const credentials = [{ name: 'Lendi', detail: 'AI Manager' }, { name: 'jasne.ai', detail: 'Founder & builder' }, { name: 'PostHog', detail: '2 wdrożenia' }, { name: 'NeoIQ', detail: 'AI & retrieval' }]
const steps = [
  { title: 'Zrozumieć', description: 'Rozmowy z zespołem i wykonawcami. Przegląd zapytań i wspólna definicja dobrego kontaktu.' },
  { title: 'Zbudować', description: 'Prototyp dla jednej kategorii. Kilka trafnych pytań i brief zatwierdzany przez klienta.' },
  { title: 'Sprawdzić', description: 'Mały eksperyment. Pomiar jakości zapytań, ukończeń formularza i kosztu działania.' },
  { title: 'Rozwinąć', description: 'Decyzja na podstawie danych. Właściciel procesu, dokumentacja i wdrożenie zespołu.' }
]
const track = (action) => posthog?.capture('oferteo_hero_cta_clicked', { action })
definePageMeta({ alias: ['/offerteo', '/oferto'] })
useRouteSeo('/oferteo')
useHead({ link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600;700;800;900&display=swap' }] })
onMounted(() => posthog?.capture('oferteo_page_viewed'))
</script>

<style scoped src="~/assets/css/oferteo-page.css"></style>
