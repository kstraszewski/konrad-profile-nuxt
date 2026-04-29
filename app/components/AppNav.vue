<template>
  <header class="nav" :class="{ 'nav--scrolled': scrolled }">
    <div class="nav__inner">
      <a class="nav__brand" href="#top" aria-label="Back to top">
        <span class="nav__brand-dot" aria-hidden="true" />
        <span class="nav__name">Konrad Straszewski</span>
        <span class="nav__role">&middot; AI Manager &amp; Builder</span>
      </a>

      <nav class="nav__links" aria-label="Page sections">
        <a v-for="item in items" :key="item.href" :href="item.href" class="nav__link">
          {{ item.label }}
        </a>
        <a class="nav__cta" href="#contact">Let's talk &rarr;</a>
      </nav>
    </div>

    <div class="nav__progress" :style="{ width: `${progress * 100}%` }" />
  </header>
</template>

<script setup>
const scrolled = ref(false)
const progress = ref(0)

const items = [
  { label: 'Now', href: '#now' },
  { label: 'Lendi', href: '#lendi' },
  { label: 'jasne.ai', href: '#jasne' },
  { label: 'Principles', href: '#principles' },
  { label: 'Track record', href: '#track' },
  { label: 'Writing', href: '#writing' },
  { label: 'Contact', href: '#contact' }
]

let removeScrollListener = null

onMounted(() => {
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop
    const h = document.documentElement.scrollHeight - window.innerHeight

    scrolled.value = y > 24
    progress.value = h > 0 ? Math.min(1, y / h) : 0
  }

  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  removeScrollListener = () => window.removeEventListener('scroll', onScroll)
})

onBeforeUnmount(() => {
  removeScrollListener?.()
})
</script>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 30;
  border-bottom: 1px solid transparent;
  background: transparent;
  transition: background 0.25s ease, border-color 0.25s ease, backdrop-filter 0.25s ease;
}

.nav--scrolled {
  border-bottom-color: var(--rule);
  background: rgba(250, 250, 247, 0.85);
  backdrop-filter: blur(12px);
}

.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px 8vw;
}

.nav__brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: max-content;
  color: var(--ink);
  font-size: 0.875rem;
  text-decoration: none;
}

.nav__brand-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
}

.nav__name {
  font-weight: 500;
}

.nav__role {
  color: var(--dim);
  font-weight: 400;
}

.nav__links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav__link {
  color: var(--dim);
  font-size: 0.8125rem;
  text-decoration: none;
  transition: color 0.15s ease;
  white-space: nowrap;
}

.nav__link:hover {
  color: var(--ink);
}

.nav__cta {
  border-radius: 4px;
  background: var(--ink);
  color: var(--bg);
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 8px 16px;
  text-decoration: none;
  white-space: nowrap;
}

.nav__progress {
  position: absolute;
  bottom: -1px;
  left: 0;
  height: 1px;
  background: var(--accent);
  transition: width 0.1s linear;
}

@media (max-width: 1060px) {
  .nav__inner {
    align-items: flex-start;
    flex-direction: column;
    gap: 14px;
    padding: 18px 6vw;
  }

  .nav__links {
    width: 100%;
    gap: 18px;
    overflow-x: auto;
    padding-bottom: 2px;
  }
}

@media (max-width: 560px) {
  .nav__role {
    display: none;
  }

  .nav__links {
    gap: 14px;
  }

  .nav__cta {
    padding: 7px 12px;
  }
}
</style>
