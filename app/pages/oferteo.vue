<template>
  <div ref="pageRoot" class="oferteo-page">
    <a class="skip-link" href="#main-content">Przejdź do treści</a>

    <header class="site-header">
      <div class="wrap header-inner">
        <a class="brand" href="/" aria-label="Konrad Straszewski — strona główna">
          <span class="brand-mark" aria-hidden="true">ks<span>.</span></span>
          <span class="brand-name">Konrad Straszewski</span>
        </a>
        <nav class="header-nav" aria-label="Sekcje strony">
          <a href="#demos">Demka</a>
          <a href="#proof">Doświadczenie</a>
          <a href="#plan">Pierwszy krok</a>
        </nav>
        <a class="header-cta" :href="profile.links.email.href" @click="track('email')">Napisz do mnie</a>
      </div>
    </header>

    <main id="main-content" tabindex="-1">
      <!-- Hero -->
      <section class="hero" aria-labelledby="hero-title">
        <figure class="hero-figure">
          <img
            src="https://static.oferteo.pl/images/oferteo/o-hero.l.webp"
            alt="Jasna kuchnia z drewnianymi szafkami — zdjęcie ze strony Oferteo"
            width="1440"
            height="640"
            fetchpriority="high"
          >
          <figcaption>Fot. Oferteo</figcaption>
        </figure>
        <div class="wrap hero-inner">
          <div class="hero-copy">
            <p class="hero-kicker">
              Propozycja współpracy dla <strong>Oferteo</strong>
              <span class="hero-role">Forward Deployed Engineer / AI Manager</span>
            </p>
            <h1 id="hero-title">Od pierwszego pytania<br> do <span class="hero-title-accent">dobrego zlecenia.</span></h1>
            <p class="hero-lead">
              Przygotowałem dwa demka AI: klient znajduje wykonawcę, a&nbsp;wykonawca przygotowuje ofertę.
              Zobacz, jak rozmowa może prowadzić do dobrego zlecenia.
            </p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="#demos" @click="track('demos')">Wypróbuj dwa demka <span aria-hidden="true">↓</span></a>
              <a class="link-quiet" :href="cvHref" :download="cvFilename" @click="track('download_cv')">Pobierz CV <span class="link-meta">PDF</span></a>
            </div>
            <p class="hero-sign">
              <strong>Konrad Straszewski</strong>
              <span>AI Manager w Lendi · founder jasne.ai</span>
            </p>
          </div>
          <OferteoFlowScene />
        </div>
      </section>

      <!-- Demos: primary product proof -->
      <section id="demos" class="demos" aria-labelledby="demos-title">
        <span id="ideas" class="legacy-anchor" aria-hidden="true" />
        <div class="wrap">
          <div class="demos-head">
            <div data-reveal>
              <p class="eyebrow only-wide">Dwa działające demka</p>
              <h2 id="demos-title">
                <span class="only-wide">Dwie strony jednego zlecenia.</span>
                <span class="only-narrow">Wypróbuj dwa demka.</span>
              </h2>
            </div>
            <p class="demos-note" data-reveal data-reveal-delay="60">
              <strong>Niezależne demonstracje.</strong>
              Nic nie jest wysyłane do firm ani publikowane — możesz testować na własnym przykładzie.
              <span class="demos-note-guard only-narrow">Asystent nie wymyśla cen ani terminów — podaje je i potwierdza wykonawca.</span>
            </p>
          </div>

          <div class="demo-grid">
            <article class="demo" aria-labelledby="demo-1-title" data-reveal>
              <p class="demo-audience">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20h14V9.5" /><path d="M10 20v-6h4v6" /></svg>
                <span>Dla klienta</span>
                <span class="demo-index">Demo 1</span>
              </p>
              <h3 id="demo-1-title">Znajdź wykonawcę<span class="only-wide"> przez rozmowę</span></h3>
              <p class="demo-desc only-wide">Opisz potrzebę własnymi słowami. Asystent dopyta o szczegóły i pokaże dopasowane profile Oferteo bezpośrednio w czacie.</p>
              <p class="demo-desc only-narrow">Opisz potrzebę — asystent dopyta i pokaże pasujące profile Oferteo.</p>
              <NuxtLink class="launch" to="/oferto/demo" aria-label="Uruchom demo klienta" @click="track('demo_1')">
                <span class="only-wide">Uruchom demo klienta</span>
                <span class="only-narrow">Demo klienta</span>
                <span class="launch-arrow" aria-hidden="true">→</span>
              </NuxtLink>
              <div class="demo-example">
                <p class="example-label">Możesz zacząć tak</p>
                <p class="example-quote">„Szukam ekipy do remontu łazienki w Warszawie.”</p>
                <p class="example-guard">Cenę i dostępność zawsze potwierdza wykonawca.</p>
              </div>
            </article>

            <article class="demo" aria-labelledby="demo-2-title" data-reveal data-reveal-delay="60">
              <p class="demo-audience">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 9h18v10H3z" /><path d="M8 9V6.5A1.5 1.5 0 0 1 9.5 5h5A1.5 1.5 0 0 1 16 6.5V9" /><path d="M3 13.5h18" /><path d="M10 13.5v2h4v-2" /></svg>
                <span>Dla wykonawcy</span>
                <span class="demo-index">Demo 2</span>
              </p>
              <h3 id="demo-2-title">Przygotuj ofertę<span class="only-wide"> przez rozmowę</span></h3>
              <p class="demo-desc only-wide">Podaj zakres, cenę i termin. Asystent ułoży szkic oferty, zaktualizuje podgląd i wprowadzi poprawki z kolejnych wiadomości.</p>
              <p class="demo-desc only-narrow">Podaj zakres, cenę i termin — asystent ułoży szkic i naniesie poprawki.</p>
              <NuxtLink class="launch" to="/oferto/demo-2" aria-label="Uruchom demo wykonawcy" @click="track('demo_2')">
                <span class="only-wide">Uruchom demo wykonawcy</span>
                <span class="only-narrow">Demo wykonawcy</span>
                <span class="launch-arrow" aria-hidden="true">→</span>
              </NuxtLink>
              <div class="demo-example">
                <p class="example-label">Możesz zacząć tak</p>
                <p class="example-quote">„Kompleksowy remont łazienki, materiały po stronie klienta.”</p>
                <p class="example-guard">Asystent nie wymyśla cen ani terminów — podajesz je Ty.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Experience -->
      <section id="proof" class="proof wrap" aria-labelledby="proof-title">
        <div class="proof-intro" data-reveal>
          <p class="eyebrow">Dlaczego ja</p>
          <h2 id="proof-title">Buduję rozwiązania i&nbsp;pomagam zespołom z&nbsp;nich korzystać.</h2>
          <p>
            Wchodzę w proces, rozmawiam z ludźmi, którzy go znają, buduję prototyp i sprawdzam, czy pomaga.
            Wdrożenie kończy się dopiero wtedy, gdy zespół z niego korzysta i wie, kto za nie odpowiada.
          </p>
          <a class="link-arrow" href="/" @click="track('profile')">Więcej o mnie <span aria-hidden="true">→</span></a>
        </div>

        <ul class="proof-list">
          <li data-reveal>
            <p class="proof-meta"><strong>Lendi</strong><span>Frontend Lead 2020–2023</span><span>AI Manager od 2024</span></p>
            <div>
              <h3>Od prowadzenia zespołu do adopcji AI w firmie.</h3>
              <p>Prowadziłem 6-osobowy zespół frontendowy. Dziś odpowiadam za adopcję AI: strategię, narzędzia, szkolenia, KPI, wewnętrznych asystentów i automatyzację procesów.</p>
            </div>
          </li>
          <li data-reveal data-reveal-delay="60">
            <p class="proof-meta"><strong>jasne.ai</strong><span>Founder</span></p>
            <div>
              <h3>Własny produkt AI od 0 do 1.</h3>
              <p>Strategia produktu, UX, kod, infrastruktura, integracja AI i dystrybucja — w jednych rękach.</p>
              <NuxtLink class="link-arrow" to="/jasne.ai">Zobacz case study <span aria-hidden="true">→</span></NuxtLink>
            </div>
          </li>
          <li data-reveal>
            <p class="proof-meta"><strong>PostHog</strong><span>Analityka produktowa</span></p>
            <div>
              <h3>Dane zamiast domysłów.</h3>
              <p>Wdrożyłem PostHog w dwóch organizacjach: lejki, kohorty, nagrania sesji, flagi funkcji i MCP.</p>
            </div>
          </li>
          <li data-reveal data-reveal-delay="60">
            <p class="proof-meta">
              <strong><a :href="profile.links.neoiq.href" target="_blank" rel="noopener noreferrer">NeoIQ <span aria-hidden="true">↗</span></a></strong>
              <span>AI Builder 2023–2024</span>
            </p>
            <div>
              <h3>AI oparte na dużych bazach wiedzy.</h3>
              <p>Wyszukiwanie wektorowe i retrieval — doświadczenie przydatne przy pracy z wiedzą i dopasowywaniu opisów.</p>
            </div>
          </li>
        </ul>
      </section>

      <!-- Plan -->
      <section id="plan" class="plan" aria-labelledby="plan-title">
        <div class="wrap">
          <div class="plan-head" data-reveal>
            <div>
              <p class="eyebrow">Pierwszy krok</p>
              <h2 id="plan-title">Jedna kategoria. Jeden mierzalny pilot.</h2>
            </div>
            <p>Zacząłbym od jakości zapytania. Mały zakres pozwala szybko sprawdzić, co realnie pomaga klientowi i wykonawcy.</p>
          </div>
          <ol class="plan-steps">
            <li v-for="(step, index) in steps" :key="step.title" data-reveal :data-reveal-delay="index % 2 * 60">
              <span class="step-num" aria-hidden="true">0{{ index + 1 }}</span>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </li>
          </ol>
        </div>
      </section>

      <!-- Contact -->
      <section id="contact" class="contact" aria-labelledby="contact-title">
        <div class="wrap contact-inner">
          <div class="contact-copy" data-reveal>
            <p class="eyebrow">Kontakt</p>
            <h2 id="contact-title">Porozmawiajmy o pierwszym procesie do usprawnienia.</h2>
            <p>Chętnie przejdę przez demka na rozmowie i posłucham, gdzie AI może dziś najbardziej pomóc Oferteo.</p>
          </div>
          <div class="contact-actions">
            <a class="btn btn-primary" :href="profile.links.email.href" @click="track('email')">Napisz do mnie <span aria-hidden="true">→</span></a>
            <a class="contact-email" :href="profile.links.email.href">{{ profile.person.email }}</a>
            <ul class="contact-links" aria-label="Inne sposoby kontaktu">
              <li><a :href="profile.links.linkedin.href" target="_blank" rel="noreferrer" @click="track('linkedin')">LinkedIn <span aria-hidden="true">↗</span></a></li>
              <li><a :href="profile.links.github.href" target="_blank" rel="noreferrer" @click="track('github')">GitHub <span aria-hidden="true">↗</span></a></li>
              <li><a :href="cvHref" :download="cvFilename" @click="track('download_cv')">CV (EN, PDF) <span aria-hidden="true">↓</span></a></li>
              <li><NuxtLink to="/mcp">Porozmawiaj z moim CV (MCP) <span aria-hidden="true">→</span></NuxtLink></li>
            </ul>
          </div>
        </div>
      </section>
    </main>

    <footer id="sources" class="site-footer">
      <div class="wrap footer-inner">
        <p class="footer-title">Konrad Straszewski <span aria-hidden="true">×</span> Oferteo</p>
        <p class="footer-disclaimer">Autorska, niezależna propozycja współpracy. To nie jest oficjalna strona Oferteo.</p>
        <p class="footer-sources">
          <span>Kontekst:</span>
          <a v-for="source in pitch.ideas.sources" :key="source.href" :href="source.href" target="_blank" rel="noreferrer">{{ source.label }}</a>
          <a href="https://www.oferteo.pl/" target="_blank" rel="noreferrer">Zdjęcie: Oferteo</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { profile } from '~/data/profile'
import '~/assets/css/oferteo-fonts.css'
const pitch = profile.oferteo
const posthog = usePostHog()
const pageRoot = ref(null)
useLandingReveal(pageRoot)
const cvHref = '/api/cv/oferteo-fde-ai-manager.pdf'
const cvFilename = 'Konrad Straszewski CV.pdf'
const steps = [
  { title: 'Zrozumieć', description: 'Rozmowy z zespołem i wykonawcami. Przegląd zapytań i wspólna definicja dobrego kontaktu.' },
  { title: 'Zbudować', description: 'Prototyp dla jednej kategorii. Kilka trafnych pytań i brief zatwierdzany przez klienta.' },
  { title: 'Sprawdzić', description: 'Mały eksperyment. Pomiar jakości zapytań, ukończeń formularza i kosztu działania.' },
  { title: 'Rozwinąć', description: 'Decyzja na podstawie danych. Właściciel procesu, dokumentacja i wdrożenie zespołu.' }
]
const track = (action) => posthog?.capture('oferteo_hero_cta_clicked', { action })
definePageMeta({ alias: ['/offerteo', '/oferto'] })
useRouteSeo('/oferteo')
useHead({
  htmlAttrs: { lang: 'pl' },
  link: [
    { rel: 'preload', href: '/fonts/oferteo/Mulish-400-latin.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
    { rel: 'preload', href: '/fonts/oferteo/Mulish-500-latin.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }
  ]
})
onMounted(() => posthog?.capture('oferteo_page_viewed'))
</script>

<style scoped src="~/assets/css/oferteo-page.css"></style>
