<template>
  <div class="home-details">
    <div class="details-wrap">
      <section id="track" class="details-section context-section" aria-labelledby="context-heading">
        <div class="section-intro">
          <span class="section-kicker">The long version, briefly</span>
          <h2 id="context-heading">A little <br />context.</h2>
          <p>
            I joined Lendi as a frontend developer in 2017. Since then, I’ve led an
            8-person team, moved into R&amp;D, and taken on company-wide AI adoption.
          </p>
          <NuxtLink to="/cv" class="text-link">Read my CV <span aria-hidden="true">↗</span></NuxtLink>
        </div>

        <div class="history-list">
          <details v-for="item in profile.track.experience" :key="`${item.org}-${item.role}`" class="history-item">
            <summary>
              <span class="history-year">{{ item.year }}</span>
              <span class="history-position">
                <strong>{{ item.role }}</strong>
                <span>{{ item.org }}</span>
              </span>
              <span class="expand-mark" aria-hidden="true" />
            </summary>
            <p>{{ item.description }}</p>
          </details>
        </div>
      </section>

      <section id="principles" class="details-section principles-section" aria-labelledby="principles-heading">
        <div class="section-intro">
          <span class="section-kicker">How I approach the work</span>
          <h2 id="principles-heading">A few things <br />I believe.</h2>
        </div>

        <div class="principle-list">
          <details v-for="item in profile.principles.items" :key="item.number" class="principle-item">
            <summary>
              <span class="principle-number">{{ item.number }}</span>
              <strong>{{ item.heading }}</strong>
              <span class="expand-mark" aria-hidden="true" />
            </summary>
            <p>{{ item.description }}</p>
          </details>
        </div>
      </section>

      <div class="working-notes">
        <section id="technologies" class="tools-section" aria-labelledby="tools-heading">
          <span class="section-kicker">Tools I work with</span>
          <h2 id="tools-heading">The working set.</h2>
          <ul class="technology-list" aria-label="Technologies">
            <li v-for="technology in profile.stack.technologies" :key="technology">{{ technology }}</li>
          </ul>
        </section>

        <section id="interests" class="exploration-section" aria-labelledby="exploration-heading">
          <span class="section-kicker">Currently exploring</span>
          <h2 id="exploration-heading">What comes next.</h2>
          <ul class="exploration-list">
            <li v-for="item in explorations" :key="item.number">
              <span>{{ item.title }}</span>
              <span class="exploration-tag">{{ item.tag }}</span>
            </li>
          </ul>
          <NuxtLink :to="profile.links.mcp.href" class="text-link">
            Try my profile as an MCP app <span aria-hidden="true">↗</span>
          </NuxtLink>
        </section>
      </div>

      <section id="about" class="personal-note" aria-labelledby="personal-heading">
        <span id="personal-heading" class="section-kicker">Away from the keyboard</span>
        <p>
          Boxing, cars, and a curiosity about how things work.
          <span>I try to be direct, fair, and useful to the people around me.</span>
        </p>
      </section>
    </div>

    <footer id="contact" class="contact-section" aria-labelledby="contact-heading">
      <div class="details-wrap">
        <span class="contact-kicker">Let’s make something useful</span>
        <div class="contact-main">
          <h2 id="contact-heading">Have a<br />good problem?</h2>
          <div class="contact-invitation">
            <p>Products, teams, or a new way of doing things.<br />I’d like to hear what you’re working on.</p>
            <a class="email-link" :href="profile.links.email.href" @click="onContactLinkClick(profile.links.email)">
              <span>{{ profile.links.email.value }}</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.7" />
              </svg>
            </a>
          </div>
        </div>

        <div class="contact-links">
          <a
            v-for="item in contactLinks"
            :key="item.label"
            :href="item.href"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noopener noreferrer' : undefined"
            @click="onContactLinkClick(item)"
          >
            {{ item.label === 'Phone' ? item.value : item.label }} <span aria-hidden="true">↗</span>
          </a>
          <NuxtLink to="/cv">CV <span aria-hidden="true">↗</span></NuxtLink>
        </div>

        <div class="site-signoff">
          <span>© {{ profile.person.name }} · 2026</span>
          <span>{{ profile.person.location }}</span>
          <a href="#top">Back to top <span aria-hidden="true">↑</span></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { profile } from '~/data/profile'

const posthog = usePostHog()
const explorations = profile.interests.items.slice(0, 3)
const contactLinks = [profile.links.github, profile.links.linkedin, profile.links.phone]

const onContactLinkClick = (item) => {
  posthog?.capture('contact_link_clicked', {
    label: item.label,
    href: item.href,
  })
}
</script>

<style scoped>
.home-details {
  color: var(--home-ink, #17191b);
  background: var(--home-paper, #f4f5f6);
  font-family: var(--home-font, 'Inter Tight', Arial, sans-serif);
}

.details-wrap {
  width: calc(100% - 96px);
  max-width: 1200px;
  margin-inline: auto;
}

.details-section {
  display: grid;
  grid-template-columns: 1fr 1.7fr;
  gap: 84px;
  padding-block: 76px;
  border-top: 1px solid var(--home-line, #d8dbdf);
}

section,
footer {
  scroll-margin-top: 90px;
}

.section-kicker,
.contact-kicker {
  display: block;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
}

.section-kicker {
  color: var(--home-muted, #666b75);
}

h2 {
  margin: 22px 0 0;
  font-size: 42px;
  font-weight: 500;
  letter-spacing: -0.045em;
  line-height: 1.05;
}

.section-intro > p {
  max-width: 310px;
  margin: 26px 0 22px;
  color: var(--home-muted, #666b75);
  font-size: 15px;
  line-height: 1.65;
}

.text-link {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 44px;
  color: var(--home-ink, #17191b);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
}

.text-link > span {
  color: var(--home-blue, #2949ed);
  font-size: 19px;
}

.history-list,
.principle-list {
  border-top: 1px solid var(--home-ink, #17191b);
}

details {
  border-bottom: 1px solid var(--home-line, #d8dbdf);
}

summary {
  display: grid;
  align-items: center;
  cursor: pointer;
  list-style: none;
  -webkit-tap-highlight-color: transparent;
}

summary::-webkit-details-marker {
  display: none;
}

summary::marker {
  content: '';
}

.history-item summary {
  grid-template-columns: 110px 1fr 16px;
  gap: 22px;
  min-height: 79px;
  padding-block: 17px;
}

.history-year {
  align-self: start;
  padding-top: 2px;
  color: var(--home-muted, #666b75);
  font-size: 13px;
  line-height: 1.5;
  font-variant-numeric: tabular-nums;
}

.history-position {
  display: grid;
  gap: 5px;
}

.history-position strong {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.3;
}

.history-position > span {
  color: var(--home-muted, #666b75);
  font-size: 13px;
  line-height: 1.4;
}

.expand-mark {
  position: relative;
  width: 12px;
  height: 12px;
  justify-self: end;
  color: var(--home-muted, #666b75);
}

.expand-mark::before,
.expand-mark::after {
  position: absolute;
  top: 5px;
  left: 0;
  width: 12px;
  height: 1px;
  background: currentColor;
  content: '';
}

.expand-mark::after {
  transform: rotate(90deg);
}

details[open] .expand-mark::after {
  display: none;
}

details[open] summary {
  color: var(--home-blue, #2949ed);
}

details > p {
  margin: 0;
  padding: 0 38px 23px 132px;
  color: var(--home-muted, #666b75);
  font-size: 14px;
  line-height: 1.65;
}

.principles-section {
  padding-block: 68px;
}

.principle-item summary {
  grid-template-columns: 30px 1fr 16px;
  gap: 18px;
  min-height: 74px;
  padding-block: 18px;
}

.principle-number {
  color: var(--home-muted, #666b75);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.principle-item strong {
  font-size: 18px;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.principle-item > p {
  padding-left: 48px;
}

.working-notes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 84px;
  padding-block: 60px;
  border-top: 1px solid var(--home-line, #d8dbdf);
}

.working-notes h2 {
  margin-top: 18px;
  font-size: 30px;
  letter-spacing: -0.035em;
}

.technology-list,
.exploration-list {
  padding: 0;
  list-style: none;
}

.technology-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 0;
  margin: 30px 0 0;
  max-width: 475px;
}

.technology-list li {
  color: var(--home-muted, #666b75);
  font-size: 17px;
  line-height: 1.5;
}

.technology-list li:not(:last-child)::after {
  margin-inline: 11px;
  color: #a5a9b0;
  content: '/';
}

.exploration-list {
  margin: 24px 0 12px;
}

.exploration-list li {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding-block: 11px;
  border-bottom: 1px solid var(--home-line, #d8dbdf);
  font-size: 15px;
}

.exploration-tag {
  color: var(--home-muted, #666b75);
  font-size: 12px;
}

.personal-note {
  display: grid;
  grid-template-columns: 1fr 1.7fr;
  gap: 84px;
  padding-block: 35px 58px;
  border-top: 1px solid var(--home-line, #d8dbdf);
}

.personal-note .section-kicker {
  padding-top: 5px;
}

.personal-note p {
  margin: 0;
  font-size: 17px;
  line-height: 1.6;
}

.personal-note p > span {
  display: block;
  color: var(--home-muted, #666b75);
}

.contact-section {
  --home-focus: #fff;
  padding-top: 55px;
  background: var(--home-blue, #2949ed);
  color: #fff;
}

.contact-kicker {
  color: #d8dfff;
}

.contact-main {
  display: grid;
  grid-template-columns: 1.08fr 1fr;
  align-items: end;
  gap: 50px;
  margin-top: 28px;
}

.contact-main h2 {
  margin: 0;
  font-size: clamp(52px, 5.3vw, 76px);
  font-weight: 500;
  line-height: 0.98;
  letter-spacing: -0.055em;
}

.contact-invitation p {
  margin: 0 0 26px;
  color: #e1e6ff;
  font-size: 15px;
  line-height: 1.65;
}

.email-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 50px;
  padding-block: 10px;
  border-bottom: 1px solid #a7b5ff;
  color: #fff;
  font-size: clamp(16px, 1.8vw, 23px);
  font-weight: 500;
  letter-spacing: -0.02em;
  text-decoration: none;
}

.email-link > span {
  overflow-wrap: anywhere;
}

.email-link svg {
  flex: 0 0 22px;
  width: 22px;
  height: 22px;
}

.contact-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 33px;
  margin-top: 40px;
}

.contact-links a {
  display: inline-flex;
  align-items: center;
  gap: 13px;
  min-height: 44px;
  color: #fff;
  font-size: 14px;
  text-decoration: none;
}

.contact-links a > span {
  color: #c5d0ff;
}

.site-signoff {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-top: 40px;
  padding-block: 19px;
  border-top: 1px solid #5e78f3;
  color: #d8dfff;
  font-size: 12px;
  line-height: 1.5;
}

.site-signoff a {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  color: #fff;
  text-decoration: none;
}

summary:focus-visible,
a:focus-visible {
  outline: 2px solid var(--home-blue, #2949ed);
  outline-offset: 5px;
}

.contact-section a:focus-visible {
  outline-color: #fff;
}

@media (hover: hover) and (pointer: fine) {
  summary:hover,
  .text-link:hover {
    color: var(--home-blue, #2949ed);
  }

  .contact-section a:hover {
    text-decoration: underline;
    text-underline-offset: 5px;
  }
}

@media (max-width: 1040px) {
  .details-section,
  .personal-note {
    grid-template-columns: 1fr 1.7fr;
    gap: 45px;
  }

  .working-notes {
    gap: 48px;
  }

  .history-item summary {
    grid-template-columns: 90px 1fr 12px;
    gap: 15px;
  }

  .history-item > p {
    padding-left: 105px;
  }

  .contact-main {
    gap: 40px;
  }
}

@media (max-width: 1000px) {
  .details-wrap {
    width: calc(100% - 64px);
  }
}

@media (max-width: 760px) {
  .details-wrap {
    width: calc(100% - 40px);
  }

  .details-section {
    grid-template-columns: 1fr;
    gap: 34px;
    padding-block: 48px;
  }

  h2 {
    margin-top: 16px;
    font-size: 36px;
  }

  .section-intro h2 br {
    display: none;
  }

  .section-intro > p {
    max-width: 480px;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  .history-item summary {
    grid-template-columns: 95px 1fr 12px;
    gap: 14px;
    min-height: 80px;
  }

  .history-item > p {
    padding-left: 109px;
    padding-right: 26px;
  }

  .principle-item summary {
    min-height: 70px;
  }

  .working-notes {
    grid-template-columns: 1fr;
    gap: 45px;
    padding-block: 45px;
  }

  .technology-list {
    max-width: 580px;
    margin-top: 24px;
  }

  .personal-note {
    grid-template-columns: 1fr;
    gap: 18px;
    padding-block: 32px 44px;
  }

  .personal-note p {
    font-size: 16px;
  }

  .contact-section {
    padding-top: 40px;
  }

  .contact-main {
    grid-template-columns: 1fr;
    gap: 30px;
    margin-top: 24px;
  }

  .contact-main h2 {
    font-size: clamp(48px, 10vw, 70px);
  }

  .contact-invitation p {
    margin-bottom: 15px;
  }

  .email-link {
    font-size: clamp(16px, 4.1vw, 24px);
  }

  .contact-links {
    gap: 2px 25px;
    margin-top: 25px;
  }

  .site-signoff {
    flex-wrap: wrap;
    gap: 4px 16px;
    margin-top: 28px;
    padding-block: 18px;
  }

  .site-signoff > span:first-child {
    flex-basis: 100%;
  }
}

@media (max-width: 400px) {
  .history-item summary {
    grid-template-columns: 76px 1fr 12px;
    gap: 10px;
  }

  .history-year {
    font-size: 11px;
  }

  .history-position strong {
    font-size: 15px;
  }

  .history-item > p {
    padding-left: 0;
  }

  .principle-item summary {
    grid-template-columns: 22px 1fr 12px;
    gap: 12px;
  }

  .principle-item strong {
    font-size: 17px;
  }

  .principle-item > p {
    padding-left: 34px;
  }
}
</style>
