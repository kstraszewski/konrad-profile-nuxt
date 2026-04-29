<template>
  <footer id="contact" class="contact">
    <div class="contact__inner">
      <div class="contact__label">
        <span class="contact__dot" aria-hidden="true" />
        <span>{{ profile.contact.label }}</span>
      </div>

      <h2 class="contact__heading">
        {{ profile.contact.heading.first }}
        <span>{{ profile.contact.heading.accent }}</span>
        {{ profile.contact.heading.last }}
      </h2>

      <p class="contact__copy">
        {{ profile.contact.copy }}
      </p>

      <div class="contact__links">
        <a
          v-for="item in contactLinks"
          :key="item.label"
          :href="item.href"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noreferrer' : undefined"
          class="contact__link"
        >
          <span class="contact__link-label">{{ item.label }}</span>
          <span class="contact__link-value">{{ item.value }} <span aria-hidden="true">&nearr;</span></span>
        </a>
      </div>

      <div class="contact__footer">
        <span v-for="item in profile.contact.footer" :key="item">{{ item }}</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { profile } from '~/data/profile'

const contactLinks = [profile.links.email, profile.links.phone, profile.links.github, profile.links.linkedin]
</script>

<style scoped>
.contact {
  padding: 160px 8vw 100px;
  border-top: 1px solid var(--rule);
  background: var(--dark-panel);
  color: var(--bg);
}

.contact__inner {
  max-width: 1280px;
  margin: 0 auto;
}

.contact__label {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 60px;
  color: #999999;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.contact__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f5f5f5;
}

.contact__heading {
  max-width: 1100px;
  margin: 0;
  color: var(--bg);
  font-family: var(--font-headline);
  font-size: 7rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 0.98;
  text-wrap: balance;
}

.contact__heading span {
  color: #d8d8d8;
  font-style: italic;
}

.contact__copy {
  max-width: 640px;
  margin: 40px 0 0;
  color: #aaaaaa;
  font-size: 1.1875rem;
  line-height: 1.5;
}

.contact__links {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  margin-top: 100px;
}

.contact__link {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  padding-top: 18px;
  padding-bottom: 18px;
  border-top: 1px solid var(--dark-rule);
  color: var(--bg);
  text-decoration: none;
  transition: color 0.15s ease;
}

.contact__link:hover {
  color: #d8d8d8;
}

.contact__link-label {
  color: #888888;
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.contact__link-value {
  font-size: 1.25rem;
  letter-spacing: 0;
  overflow-wrap: normal;
  white-space: nowrap;
}

.contact__link-value span {
  opacity: 0.5;
}

.contact__footer {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-top: 140px;
  padding-top: 24px;
  border-top: 1px solid var(--dark-rule);
  color: #666666;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
}

@media (max-width: 1340px) {
  .contact__links {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1060px) {
  .contact {
    padding: 120px 6vw 84px;
  }

  .contact__heading {
    font-size: 5.25rem;
  }

  .contact__footer {
    flex-direction: column;
    margin-top: 96px;
  }
}

@media (max-width: 720px) {
  .contact__links {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 560px) {
  .contact {
    padding: 84px 5vw 64px;
  }

  .contact__heading {
    font-size: 3.5rem;
  }

  .contact__link-value {
    font-size: 1.125rem;
    overflow-wrap: anywhere;
    white-space: normal;
  }
}
</style>
