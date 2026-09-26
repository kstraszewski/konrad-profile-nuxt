<template>
  <main class="oferteo-page">
    <a class="skip-link" href="#main-content">Przejdź do treści</a>
    <header class="site-header">
      <div class="page-width header-inner">
        <a class="personal-brand" href="/" aria-label="Konrad Straszewski — strona główna"><span class="personal-mark">ks<span>.</span></span><span>Konrad Straszewski</span></a>
        <nav class="desktop-nav" aria-label="Sekcje strony"><a href="#ideas">Pomysły dla Oferteo</a><a href="#proof">Doświadczenie</a><a href="#plan">Pierwszy krok</a></nav>
        <a class="header-contact" :href="profile.links.email.href" @click="track('email')">Porozmawiajmy <span aria-hidden="true">↗</span></a>
      </div>
    </header>

    <section id="main-content" class="hero page-width">
      <div class="hero-copy">
        <div class="collaboration-line"><span>Propozycja współpracy dla</span><span class="oferteo-wordmark" aria-label="Oferteo"><span>o</span>ferte<span>o</span></span></div>
        <h1>Od pierwszego pytania do <span>dobrego zlecenia.</span></h1>
        <p class="hero-lead">Chcę rozwijać AI, które pomaga klientom opisać potrzebę, a wykonawcom szybciej przejść do konkretów.</p>
        <div class="hero-actions"><a class="button button-orange" href="#ideas" @click="track('ideas')">Poznaj 4 pomysły <span aria-hidden="true">↓</span></a><a class="text-link" :href="cvHref" :download="cvFilename" @click="track('download_cv')">Pobierz moje CV <span aria-hidden="true">↗</span></a></div>
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
            <div class="scene-brief-bottom"><span>AI dopytuje. Klient zatwierdza.</span><a href="#ideas" aria-label="Zobacz koncepcję asystenta zapytania"><span aria-hidden="true">↗</span></a></div>
          </div>
          <p class="scene-caption">Przykładowy scenariusz · propozycja dla Oferteo</p>
        </div>
      </div>
    </section>

    <section class="experience-strip page-width" aria-label="Moje doświadczenie w skrócie"><p>Doświadczenie,<br>które wnoszę.</p><div v-for="item in credentials" :key="item.name" class="credential"><strong>{{ item.name }}</strong><span>{{ item.detail }}</span></div></section>

    <section id="ideas" class="ideas-section">
      <div class="page-width">
        <div class="section-heading"><div><p class="eyebrow"><span /> Cztery możliwości</p><h2>Mniej tarcia.<br>Więcej dobrych rozmów.</h2></div><p>Od pierwszego zapytania po wsparcie klienta. Cztery pomysły, które chciałbym sprawdzić z zespołem Oferteo.</p></div>
        <div class="idea-tabs" role="tablist" aria-label="Wybierz pomysł" @keydown="onTabKeydown">
          <button v-for="(idea, index) in ideas" :id="`idea-tab-${index}`" :key="idea.title" type="button" role="tab" :aria-selected="selectedIdea === index" :aria-controls="`idea-panel-${index}`" :tabindex="selectedIdea === index ? 0 : -1" :class="{ 'is-selected': selectedIdea === index }" @click="selectIdea(index)"><span class="tab-number">0{{ index + 1 }}</span><span>{{ idea.shortTitle }}</span><span class="tab-arrow" aria-hidden="true">↗</span></button>
        </div>
        <div v-for="(idea, index) in ideas" v-show="selectedIdea === index" :id="`idea-panel-${index}`" :key="idea.title" class="idea-panel" role="tabpanel" :aria-labelledby="`idea-tab-${index}`" tabindex="0">
          <div class="idea-copy"><p class="idea-audience"><span /> {{ idea.audience }}</p><h3>{{ idea.title }}</h3><p class="idea-description">{{ idea.description }}</p><div class="pilot-note"><span class="pilot-icon" aria-hidden="true">↗</span><div><strong>{{ index === 0 ? 'Mój wybór na pierwszy pilot' : 'Od czego zacząć' }}</strong><p>{{ idea.pilot }}</p></div></div><details class="idea-details"><summary>Co sprawdzimy w pilocie <span aria-hidden="true">+</span></summary><p>{{ idea.metric }}</p><p><strong>Zasada:</strong> {{ idea.guardrail }}</p></details></div>
          <div class="idea-preview"><OferteoConcept :idea-index="index" /><p class="preview-caption"><span aria-hidden="true">◌</span> Interaktywny koncept · przykładowe dane</p></div>
        </div>
        <div class="ideas-footnote"><span>Hipotezy do wspólnej weryfikacji, z uwzględnieniem obecnych rozwiązań Oferteo.</span><a href="#sources">Na czym je opieram <span aria-hidden="true">↗</span></a></div>
      </div>
    </section>

    <section id="proof" class="proof-section page-width">
      <div class="proof-intro"><p class="eyebrow"><span /> Dlaczego ja</p><h2>Łączę perspektywę<br>buildera i AI Managera.</h2><p>Potrafię wejść w proces, zbudować rozwiązanie i pomóc zespołowi wprowadzić je do codziennej pracy.</p><a class="text-link" href="/" @click="track('profile')">Poznaj mnie bliżej <span aria-hidden="true">↗</span></a></div>
      <div class="proof-grid">
        <article class="proof-card proof-card-main"><span class="proof-card-label">Lendi · AI Manager</span><strong>Od kodu<br>do zmiany w zespole.</strong><p>Frontend, prowadzenie 8-osobowego zespołu, R&D i wdrażanie AI. Znam produkt od środka.</p><span class="proof-card-tag">Strategia → wdrożenie → adopcja</span></article>
        <article class="proof-card"><span class="proof-card-label">jasne.ai · Founder</span><strong>Od 0 do 1.</strong><p>Własny produkt AI: UX, kod, infrastruktura, integracje i dystrybucja.</p><NuxtLink to="/jasne.ai">Zobacz case study <span aria-hidden="true">↗</span></NuxtLink></article>
        <article class="proof-card"><span class="proof-card-label">PostHog + MAF</span><strong>Dane zamiast domysłów.</strong><p>Analityka w dwóch organizacjach i doświadczenie z AI opartym na dużych bazach wiedzy.</p><span class="proof-card-tag">Analityka · MCP · retrieval</span></article>
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
const selectedIdea = ref(0)
const credentials = [{ name: 'Lendi', detail: 'AI Manager' }, { name: 'jasne.ai', detail: 'Founder & builder' }, { name: 'PostHog', detail: '2 wdrożenia' }, { name: 'MAF', detail: 'AI & retrieval' }]
const ideaCopy = [
  { shortTitle: 'Lepsze zapytanie', audience: 'Dla zlecającego', title: 'Od „chcę remont” do konkretnego zapytania.', description: 'Klient nie musi znać języka branży. AI zadaje kilka trafnych pytań i zamienia opis potrzeby w uporządkowany brief. Wykonawca od razu wie, o czym rozmawiać.', pilot: 'Jedna kategoria, np. remont łazienki. Pytania dobrane wspólnie z wykonawcami.' },
  { shortTitle: 'Trafne dopasowanie', audience: 'Dla wykonawcy', title: 'Zlecenie pasuje. I wiadomo dlaczego.', description: 'Specjalizacja, zakres usługi i obszar działania. Każda rekomendacja ma konkretne uzasadnienie, a brakujące informacje są widoczne od razu.', pilot: 'Porównać rekomendacje z obecnym systemem na przykładach z jednej kategorii.' },
  { shortTitle: 'Szybsza odpowiedź', audience: 'Dla wykonawcy', title: 'Mniej pisania. Bliżej pierwszej rozmowy.', description: 'Podsumowanie zlecenia i szkic odpowiedzi oparty na profilu firmy. Wykonawca dopowiada szczegóły, sprawdza treść i sam decyduje o wysłaniu.', pilot: 'Jeden typ zlecenia i niewielka grupa wykonawców korzystających z telefonu.' },
  { shortTitle: 'Wsparcie zespołu', audience: 'Dla opiekuna klienta', title: 'Cały kontekst sprawy w jednym miejscu.', description: 'Historia kontaktu, wiedza produktowa i proponowany następny krok. Opiekun szybciej orientuje się w sprawie i ma źródła potrzebne do odpowiedzi.', pilot: 'Jeden powtarzalny proces, np. wyjaśnianie jakości kontaktu, z grupą opiekunów.' }
]
const ideas = pitch.ideas.items.map((item, index) => ({ ...item, ...ideaCopy[index] }))
const steps = [
  { title: 'Zrozumieć', description: 'Rozmowy z zespołem i wykonawcami. Przegląd zapytań i wspólna definicja dobrego kontaktu.' },
  { title: 'Zbudować', description: 'Prototyp dla jednej kategorii. Kilka trafnych pytań i brief zatwierdzany przez klienta.' },
  { title: 'Sprawdzić', description: 'Mały eksperyment. Pomiar jakości zapytań, ukończeń formularza i kosztu działania.' },
  { title: 'Rozwinąć', description: 'Decyzja na podstawie danych. Właściciel procesu, dokumentacja i wdrożenie zespołu.' }
]
const track = (action) => posthog?.capture('oferteo_hero_cta_clicked', { action })
const selectIdea = (index) => { selectedIdea.value = index; posthog?.capture('oferteo_idea_selected', { idea: index + 1, title: ideas[index].shortTitle }) }
const onTabKeydown = async (event) => {
  let index = selectedIdea.value
  if (event.key === 'ArrowRight') index = (index + 1) % ideas.length
  else if (event.key === 'ArrowLeft') index = (index - 1 + ideas.length) % ideas.length
  else if (event.key === 'Home') index = 0
  else if (event.key === 'End') index = ideas.length - 1
  else return
  event.preventDefault()
  selectIdea(index)
  await nextTick()
  document.getElementById(`idea-tab-${index}`)?.focus()
}
useRouteSeo('/oferteo')
useHead({ link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600;700;800;900&display=swap' }] })
onMounted(() => posthog?.capture('oferteo_page_viewed'))
</script>

<style scoped src="~/assets/css/oferteo-page.css"></style>
