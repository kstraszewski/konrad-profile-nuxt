import type { Ref } from 'vue'

/** A single entrance for marketing content; SSR and reduced-motion stay readable. */
export function useLandingReveal(root: Ref<HTMLElement | null>, options: {
  selector?: string
  easing?: string
} = {}) {
  let cleanup: (() => void) | undefined

  onMounted(() => {
    const host = root.value
    if (!host || !('IntersectionObserver' in window)) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const elements = [...host.querySelectorAll<HTMLElement>(options.selector || '[data-reveal]')]
    const animations = new Map<HTMLElement, Animation>()
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const element = entry.target as HTMLElement
        observer.unobserve(element)
        if (motion.matches || element.contains(document.activeElement)) continue
        const delay = Math.min(120, Math.max(0, Number(element.dataset.revealDelay) || 0))
        const animation = element.animate([
          { opacity: 0, transform: 'translateY(18px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 620, delay, easing: options.easing || 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'backwards' })
        animations.set(element, animation)
        animation.onfinish = () => animations.delete(element)
      }
    }, { threshold: 0.08 })
    elements.forEach(element => observer.observe(element))

    const cancel = () => {
      if (!motion.matches) return
      animations.forEach(animation => animation.cancel())
      animations.clear()
    }
    motion.addEventListener('change', cancel)
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Node)) return
      for (const [element, animation] of animations) {
        if (!element.contains(event.target)) continue
        animation.cancel()
        animations.delete(element)
      }
    }
    host.addEventListener('focusin', onFocus)
    cleanup = () => {
      observer.disconnect()
      animations.forEach(animation => animation.cancel())
      motion.removeEventListener('change', cancel)
      host.removeEventListener('focusin', onFocus)
    }
  })

  onBeforeUnmount(() => cleanup?.())
}
