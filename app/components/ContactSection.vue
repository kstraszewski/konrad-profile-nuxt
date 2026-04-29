<template>
  <footer id="contact" class="contact">
    <div class="contact__inner">
      <div class="contact__label">
        <span class="contact__dot" aria-hidden="true" />
        <span>§ 08 · Let's talk</span>
      </div>

      <h2 class="contact__heading">
        If you're building something
        <span>serious</span>
        with AI, I want to hear about it.
      </h2>

      <p class="contact__copy">
        Best for: Head of AI / AI Lead roles, founding AI engineer at a serious
        team, or a clear mandate to redefine an engineering function. Worst for:
        "we want a chatbot."
      </p>

      <div class="contact__links">
        <a
          v-for="item in links"
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
        <span>&copy; KONRAD STRASZEWSKI · 2026</span>
        <span>VENDOR-AGNOSTIC BY DESIGN</span>
        <span>END OF FILE · 08 / 08</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
const links = [
  {
    label: 'Email',
    value: 'koonradstraszewski@gmail.com',
    href: 'mailto:koonradstraszewski@gmail.com'
  },
  {
    label: 'Phone',
    value: '+48 794 175 956',
    href: 'tel:+48794175956'
  },
  {
    label: 'GitHub',
    value: 'github.com/kstraszewski',
    href: 'https://github.com/kstraszewski',
    external: true
  },
  {
    label: 'LinkedIn',
    value: 'in/konrad-straszewski',
    href: 'https://www.linkedin.com/in/konrad-straszewski-b4a939165/',
    external: true
  }
]
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
  background: var(--accent);
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
  color: var(--accent);
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
  gap: 32px;
  margin-top: 100px;
}

.contact__link {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 18px;
  padding-bottom: 18px;
  border-top: 1px solid var(--dark-rule);
  color: var(--bg);
  text-decoration: none;
  transition: color 0.15s ease;
}

.contact__link:hover {
  color: var(--accent);
}

.contact__link-label {
  color: #888888;
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.contact__link-value {
  overflow-wrap: anywhere;
  font-size: 1.375rem;
  letter-spacing: 0;
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

@media (max-width: 1060px) {
  .contact {
    padding: 120px 6vw 84px;
  }

  .contact__heading {
    font-size: 5.25rem;
  }

  .contact__links {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .contact__footer {
    flex-direction: column;
    margin-top: 96px;
  }
}

@media (max-width: 560px) {
  .contact {
    padding: 84px 5vw 64px;
  }

  .contact__heading {
    font-size: 3.5rem;
  }
}
</style>
