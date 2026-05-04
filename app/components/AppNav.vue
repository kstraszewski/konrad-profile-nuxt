<template>
  <header class="nav" :class="{ 'nav--scrolled': scrolled }">
    <div class="nav__inner">
      <div class="nav__top">
        <a class="nav__brand" :href="homeHref" aria-label="Back to top" @click="mobileMenuOpen = false">
          <span class="nav__brand-dot" aria-hidden="true" />
          <span class="nav__name">{{ profile.person.name }}</span>
          <span class="nav__role">&middot; {{ profile.person.role }}</span>
        </a>

        <button
          class="nav__menu-button"
          :class="{ 'nav__menu-button--open': mobileMenuOpen }"
          type="button"
          aria-controls="site-nav"
          :aria-expanded="mobileMenuOpen"
          :aria-label="mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      <nav
        id="site-nav"
        class="nav__links"
        :class="{ 'nav__links--open': mobileMenuOpen }"
        aria-label="Page sections"
      >
        <a v-for="item in items" :key="item.href" :href="navHref(item.href)" class="nav__link" @click="mobileMenuOpen = false">
          {{ item.label }}
        </a>
      </nav>
    </div>

    <div class="nav__progress" :style="{ width: `${progress * 100}%` }" />
  </header>
</template>

<script setup>
import { profile } from '~/data/profile'

const route = useRoute()
const scrolled = ref(false)
const progress = ref(0)
const mobileMenuOpen = ref(false)

const items = profile.nav.main

const homeHref = computed(() => (route.path === '/' ? '#top' : '/'))
const sectionHref = (hash) => (route.path === '/' ? hash : `/${hash}`)
const navHref = (href) => (href.startsWith('#') ? sectionHref(href) : href)

let removeScrollListener = null
let removeKeydownListener = null

onMounted(() => {
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop
    const h = document.documentElement.scrollHeight - window.innerHeight

    scrolled.value = y > 24
    progress.value = h > 0 ? Math.min(1, y / h) : 0
  }
  const onKeydown = (event) => {
    if (event.key === 'Escape') {
      mobileMenuOpen.value = false
    }
  }

  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
  removeScrollListener = () => window.removeEventListener('scroll', onScroll)
  removeKeydownListener = () => window.removeEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  removeScrollListener?.()
  removeKeydownListener?.()
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
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(12px);
}

.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  min-width: 0;
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px 8vw;
}

.nav__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
}

.nav__brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  max-width: 100%;
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
  overflow: hidden;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav__role {
  color: var(--dim);
  font-weight: 400;
}

.nav__menu-button {
  display: none;
}

.nav__links {
  display: flex;
  align-items: center;
  gap: 24px;
  min-width: 0;
}

.nav__link {
  flex: 0 0 auto;
  color: var(--dim);
  font-size: 0.8125rem;
  text-decoration: none;
  transition: color 0.15s ease;
  white-space: nowrap;
}

.nav__link:hover {
  color: var(--ink);
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

  .nav__top {
    width: 100%;
  }

  .nav__links {
    width: 100%;
    gap: 18px;
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: 2px;
    -webkit-overflow-scrolling: touch;
  }

  .nav__links::-webkit-scrollbar {
    display: none;
  }
}

@media (max-width: 560px) {
  .nav__inner {
    gap: 0;
    padding: 16px 5vw;
  }

  .nav__role {
    display: none;
  }

  .nav__menu-button {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    width: 38px;
    height: 34px;
    padding: 0;
    border: 1px solid var(--rule);
    border-radius: 4px;
    background: var(--bg);
    color: var(--ink);
    cursor: pointer;
  }

  .nav__menu-button:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .nav__menu-button span {
    display: block;
    width: 16px;
    height: 1px;
    margin: 0 auto;
    background: currentColor;
    transform-origin: center;
    transition: opacity 0.16s ease, transform 0.16s ease;
  }

  .nav__menu-button--open span:first-child {
    transform: translateY(5px) rotate(45deg);
  }

  .nav__menu-button--open span:nth-child(2) {
    opacity: 0;
  }

  .nav__menu-button--open span:last-child {
    transform: translateY(-5px) rotate(-45deg);
  }

  .nav__links {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0;
    width: 100%;
    max-height: 0;
    margin-top: 0;
    border-top: 0 solid transparent;
    overflow: hidden;
    padding-bottom: 0;
    visibility: hidden;
    transition: max-height 0.22s ease, margin-top 0.22s ease, border-color 0.22s ease, visibility 0s linear 0.22s;
  }

  .nav__links--open {
    max-height: 420px;
    margin-top: 14px;
    border-top-width: 1px;
    border-top-color: var(--rule);
    visibility: visible;
    transition-delay: 0s;
  }

  .nav__link {
    padding: 12px 0;
    border-bottom: 1px solid var(--rule);
    font-size: 0.9375rem;
    line-height: 1;
    white-space: normal;
  }

}

@media (max-width: 380px) {
  .nav__inner {
    padding-right: 18px;
    padding-left: 18px;
  }

  .nav__brand {
    font-size: 0.8125rem;
  }

  .nav__links {
    gap: 0;
  }
}
</style>
