<script setup lang="ts">
const root = ref<HTMLElement | null>(null)
const rig = ref<HTMLElement | null>(null)
let cleanup: (() => void) | undefined

onMounted(() => {
  const element = root.value
  const sculpture = rig.value
  if (!element || !sculpture) return

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const pointer = window.matchMedia('(hover: hover) and (pointer: fine)')
  const hero = element.closest<HTMLElement>('.hero') ?? element
  const axes = ['x', 'y', 'scroll'] as const
  const position = { x: 0, y: 0, scroll: 0 }
  const target = { x: 0, y: 0, scroll: 0 }
  const velocity = { x: 0, y: 0, scroll: 0 }
  let frame = 0
  let previous = 0
  let visible = true
  let listening = false

  const stop = () => {
    cancelAnimationFrame(frame)
    frame = previous = 0
    for (const axis of axes) position[axis] = target[axis] = velocity[axis] = 0
    sculpture.style.removeProperty('transform')
  }
  const tick = (time: number) => {
    const dt = Math.min((time - (previous || time - 16)) / 1000, 0.032)
    previous = time
    // Spring: mass 1, stiffness 100, damping 10. Pointer and scroll share one rAF.
    for (const axis of axes) {
      velocity[axis] += (100 * (target[axis] - position[axis]) - 10 * velocity[axis]) * dt
      position[axis] += velocity[axis] * dt
    }
    sculpture.style.transform = 'translate3d(0, ' + (-position.scroll * 12).toFixed(3)
      + 'px, 0) rotateX(' + (12 - position.y * 5 + position.scroll * 8).toFixed(3)
      + 'deg) rotateY(' + (-17 + position.x * 7 + position.scroll * 4).toFixed(3)
      + 'deg) rotateZ(' + (-5 + position.scroll * 2).toFixed(3) + 'deg)'
    if (axes.reduce((distance, axis) => distance + Math.abs(target[axis] - position[axis])
      + Math.abs(velocity[axis]), 0) < 0.004) {
      frame = previous = 0
      return
    }
    frame = requestAnimationFrame(tick)
  }
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(tick)
  }
  const move = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return
    const rect = element.getBoundingClientRect()
    target.x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1))
    target.y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1))
    schedule()
  }
  const leave = () => {
    target.x = target.y = 0
    schedule()
  }
  const updateScroll = () => {
    if (!visible || document.hidden || motion.matches) return
    const rect = hero.getBoundingClientRect()
    target.scroll = Math.max(0, Math.min(1, -rect.top / Math.max(rect.height, 1)))
    schedule()
  }
  const sync = () => {
    const active = visible && !document.hidden && !motion.matches
    const canPoint = active && pointer.matches
    if (canPoint && !listening) {
      element.addEventListener('pointermove', move, { passive: true })
      element.addEventListener('pointerleave', leave)
      listening = true
    } else if (!canPoint) {
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', leave)
      listening = false
      target.x = target.y = 0
    }
    if (!active) {
      stop()
    } else {
      updateScroll()
    }
    element.dataset.paused = String(!visible || document.hidden || motion.matches)
  }
  const observer = new IntersectionObserver(([entry]) => {
    visible = Boolean(entry?.isIntersecting)
    sync()
  })
  observer.observe(element)
  motion.addEventListener('change', sync)
  pointer.addEventListener('change', sync)
  document.addEventListener('visibilitychange', sync)
  window.addEventListener('scroll', updateScroll, { passive: true })
  window.addEventListener('resize', updateScroll, { passive: true })
  sync()
  cleanup = () => {
    observer.disconnect()
    stop()
    element.removeEventListener('pointermove', move)
    element.removeEventListener('pointerleave', leave)
    motion.removeEventListener('change', sync)
    pointer.removeEventListener('change', sync)
    document.removeEventListener('visibilitychange', sync)
    window.removeEventListener('scroll', updateScroll)
    window.removeEventListener('resize', updateScroll)
  }
})
onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <figure ref="root" class="flow-scene">
    <div class="flow-scene__eyebrow"><span class="flow-scene__dot" /> DWA DEMKA. JEDEN PROCES.</div>
    <div class="flow-scene__viewport" aria-hidden="true">
      <div class="flow-scene__halo" />
      <div class="flow-scene__scale">
      <div ref="rig" class="flow-scene__rig">
        <div class="flow-scene__blueprint">
          <span class="flow-scene__registration flow-scene__registration--a" />
          <span class="flow-scene__registration flow-scene__registration--b" />
          <svg viewBox="0 0 300 340" fill="none"><path d="M90 40h90v72H90v84h132v96H130" stroke="currentColor" stroke-width="2" stroke-dasharray="4 6" /></svg>
        </div>

        <div class="flow-scene__slot flow-scene__slot--conversation">
          <div class="flow-card flow-card--conversation">
            <div class="flow-card__bar"><span>01 / ROZMOWA</span><svg viewBox="0 0 20 20"><path d="M4 4h12v9H9l-5 3V4Z" /></svg></div>
            <div class="flow-card__bubble">„Chcę odnowić łazienkę.”</div>
            <div class="flow-card__reply"><span class="flow-card__spark">✳</span><span>Opowiedz, co chcesz zmienić.</span></div>
          </div>
        </div>

        <div class="flow-scene__slot flow-scene__slot--brief">
          <div class="flow-card flow-card--brief">
            <div class="flow-card__bar"><span>02 / KONKRETY</span><span class="flow-card__check">✓</span></div>
            <p>Dobre pytania.<br><strong>Czytelne zlecenie.</strong></p>
            <div class="flow-card__tags"><span>Zakres</span><span>Budżet</span><span>Termin</span></div>
          </div>
        </div>

        <div class="flow-scene__slot flow-scene__slot--result">
          <div class="flow-card flow-card--result">
            <div class="flow-card__bar"><span>03 / DOBRE DOPASOWANIE</span><span class="flow-card__check">↗</span></div>
            <div class="flow-card__result"><span class="flow-card__avatar"><svg viewBox="0 0 32 32"><path d="m7 15 9-8 9 8M10 13v12h12V13m-9 12v-7h6v7" /></svg></span><div><strong>Od potrzeby do oferty.</strong><span>Dwie strony jednego zlecenia.</span></div></div>
            <div class="flow-card__progress"><span /><span /><span /></div>
          </div>
        </div>
        <div class="flow-scene__cube"><span /><span /><span /></div>
      </div>
      </div>
    </div>
    <figcaption class="flow-scene__caption"><span>Rozmowa <i>→</i> Konkret <i>→</i> Działanie</span><span class="flow-scene__asterisk" aria-hidden="true">✳</span></figcaption>
  </figure>
</template>

<style scoped>
.flow-scene {
  --flow-ease: var(--motion-ease, cubic-bezier(0.23, 1, 0.32, 1));
  position: relative; min-width: 0; width: 100%; padding: 24px 24px 16px;
  color: #082754; border: 1px solid rgb(255 255 255 / .72); border-radius: 24px;
  background: linear-gradient(135deg, rgb(255 255 255 / .96), rgb(241 247 255 / .94));
  box-shadow: 0 20px 70px rgb(8 39 84 / .1); overflow: clip;
}
.flow-scene__eyebrow { display: flex; align-items: center; gap: 9px; font-size: 10px; letter-spacing: .11em; font-weight: 800; }
.flow-scene__dot { width: 6px; height: 6px; border-radius: 50%; background: #e7760d; }
.flow-scene__viewport { position: relative; height: 414px; perspective: 1200px; }
.flow-scene__halo { position: absolute; inset: 10% 0; border-radius: 50%; background: radial-gradient(ellipse, #e2edff, transparent 70%); }
.flow-scene__scale { position: absolute; inset: 0; transform-style: preserve-3d; }
.flow-scene__rig { position: absolute; inset: 0; transform-style: preserve-3d; transform: rotateX(12deg) rotateY(-17deg) rotateZ(-5deg); }
.flow-scene__blueprint { position: absolute; top: 50%; left: 50%; width: 300px; height: 340px; border: 1px solid #cddbf0; background: linear-gradient(#ccd9ed55 1px, transparent 1px), linear-gradient(90deg, #ccd9ed55 1px, transparent 1px); background-size: 24px 24px; transform: translate3d(-50%, -50%, -35px); color: #e7760d; }
.flow-scene__blueprint svg { width: 100%; height: 100%; }
.flow-scene__registration { position: absolute; width: 14px; height: 14px; border: 2px solid #1462d3; }
.flow-scene__registration--a { top: -6px; left: -6px; border-right: 0; border-bottom: 0; }
.flow-scene__registration--b { bottom: -6px; right: -6px; border-top: 0; border-left: 0; }
.flow-scene__slot { position: absolute; top: 50%; left: 50%; width: 276px; transform-style: preserve-3d; }
.flow-scene__slot--conversation { transform: translate3d(calc(-50% - 35px), calc(-50% - 117px), 0) rotateZ(-5deg); }
.flow-scene__slot--brief { transform: translate3d(calc(-50% + 39px), calc(-50% - 2px), 38px) rotateZ(5deg); }
.flow-scene__slot--result { transform: translate3d(calc(-50% - 17px), calc(-50% + 112px), 78px) rotateZ(-2deg); }
.flow-card { position: relative; min-height: 130px; padding: 16px 18px; border: 1px solid #e4e9f1; border-radius: 14px; background: #fff; box-shadow: 3px 5px 0 #d5e0ef, 0 14px 24px rgb(8 39 84 / .12); animation: flow-assemble 780ms var(--flow-ease) backwards; transform: translateZ(0); }
.flow-card--conversation { animation-delay: 60ms; }
.flow-card--brief { color: #fff; border-color: #1462d3; background: #1462d3; box-shadow: 3px 5px 0 #104ea9, 0 14px 24px rgb(8 39 84 / .12); animation-delay: 120ms; }
.flow-card--result { animation-delay: 180ms; }
.flow-card__bar { display: flex; justify-content: space-between; align-items: center; gap: 8px; font-size: 9px; letter-spacing: .07em; font-weight: 800; }
.flow-card__bar > svg { width: 17px; height: 17px; fill: none; stroke: #e7760d; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
.flow-card__bubble { margin-top: 13px; padding: 9px 10px; color: #082754; border-radius: 8px 8px 8px 2px; background: #f3f6fb; font-size: 13px; font-weight: 700; }
.flow-card__reply { display: flex; align-items: center; gap: 7px; margin-top: 9px; font-size: 10px; color: #575756; }
.flow-card__spark { color: #e7760d; font-size: 17px; }
.flow-card--brief p { margin: 12px 0 11px; font-size: 20px; font-weight: 400; line-height: 1.25; }
.flow-card--brief p strong { font-weight: 700; }
.flow-card__check { display: grid; place-items: center; width: 21px; height: 21px; border-radius: 50%; background: #e7760d; color: #fff; font-size: 13px; }
.flow-card__tags { display: flex; gap: 6px; }
.flow-card__tags span { padding: 3px 7px; border: 1px solid #ffffff55; border-radius: 5px; font-size: 9px; }
.flow-card__result { display: flex; align-items: center; gap: 10px; margin-top: 15px; }
.flow-card__avatar { display: grid; place-items: center; flex-shrink: 0; width: 40px; height: 40px; border-radius: 11px; background: #fef2e7; color: #e7760d; }
.flow-card__avatar svg { width: 28px; height: 28px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linejoin: round; }
.flow-card__result strong { display: block; font-size: 13px; }
.flow-card__result div > span { display: block; margin-top: 3px; color: #575756; font-size: 9px; }
.flow-card__progress { display: flex; gap: 5px; margin-top: 13px; }
.flow-card__progress span { width: 33px; height: 3px; border-radius: 2px; background: #e7760d; }
.flow-card__progress span:nth-child(2) { background: #1462d3; }
.flow-card__progress span:nth-child(3) { background: #082754; }
.flow-scene__cube { position: absolute; top: 54%; right: 10%; width: 25px; height: 25px; transform: translateZ(95px) rotateZ(12deg); transform-style: preserve-3d; }
.flow-scene__cube span { position: absolute; inset: 0; background: #e7760d; }
.flow-scene__cube span:first-child { transform: translateZ(12.5px); }
.flow-scene__cube span:nth-child(2) { background: #c0640f; transform: rotateY(90deg) translateZ(12.5px); }
.flow-scene__cube span:nth-child(3) { background: #fa9d41; transform: rotateX(90deg) translateZ(12.5px); }
.flow-scene__caption { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding-top: 13px; border-top: 1px solid #d9e4f2; font-size: 11px; font-weight: 700; }
.flow-scene__caption i { margin-inline: 5px; color: #e7760d; font-style: normal; }
.flow-scene__asterisk { color: #e7760d; font-size: 25px; }
.flow-scene[data-paused='true'] .flow-card { animation-play-state: paused; }
@keyframes flow-assemble { from { opacity: 0; transform: translate3d(0, 18px, 70px) scale(.96); } to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); } }
@media (max-width: 1040px) { .flow-scene { padding-inline: 16px; } .flow-scene__viewport { height: 394px; } .flow-scene__slot { width: 252px; } }
@media (max-width: 860px) and (min-width: 641px) { .flow-scene { max-width: 480px; margin-inline: auto !important; } }
@media (max-width: 640px) {
  .flow-scene { padding: 18px 14px 12px; border-radius: 18px; }
  .flow-scene__viewport { height: 342px; perspective: 1000px; }
  .flow-scene__scale { transform: scale(.82); }
  .flow-scene__slot { width: 276px; }
  .flow-scene__cube { display: none; }
  .flow-scene__caption { font-size: 10px; }
}
@media (prefers-reduced-motion: reduce) { .flow-card { animation: none; } }
</style>
