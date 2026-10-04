<script setup lang="ts">
/**
 * Decorative CSS 3D "build stack" for the homepage hero poster.
 *
 * Three axonometric slabs (Think / Build / Ship) with a small orbiting cube (Repeat).
 * - The markup is fully static, so SSR and client output are identical.
 * - Pointer tilt runs only on fine/hover pointers without reduced motion. It writes
 *   CSS custom properties straight to the root element inside a rAF loop, so Vue
 *   never re-renders on mousemove.
 * - Ambient CSS motion is paused while the element is offscreen or the tab is hidden.
 */
const root = ref<HTMLElement | null>(null)

const layers = [
  { key: 'think', index: '01', label: 'Think' },
  { key: 'build', index: '02', label: 'Build' },
  { key: 'ship', index: '03', label: 'Ship' }
] as const

let teardown: (() => void) | null = null

onMounted(() => {
  const el = root.value
  if (!el) return

  const zone = el.closest<HTMLElement>('[data-stack-zone]') ?? el
  const focus = el.closest<HTMLElement>('[data-stack-focus]') ?? el
  const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  const current = { x: 0, y: 0, spread: 0 }
  const target = { x: 0, y: 0, spread: 0 }
  let frame = 0
  let lastTime = 0
  let rect: DOMRect | null = null
  let zoneRect: DOMRect | null = null
  let listening = false
  let inView = true

  const write = () => {
    const style = el.style
    style.setProperty('--stack-x', current.x.toFixed(4))
    style.setProperty('--stack-y', current.y.toFixed(4))
    style.setProperty('--stack-spread', current.spread.toFixed(4))
    style.setProperty('--stack-rz', String(Math.round(45 - current.x * 16)))
    style.setProperty('--stack-rx', String(Math.round(58 + current.y * 8)))
  }

  const clearStyles = () => {
    for (const name of ['--stack-x', '--stack-y', '--stack-spread', '--stack-rz', '--stack-rx']) {
      el.style.removeProperty(name)
    }
  }

  const tick = (now: number) => {
    const dt = lastTime ? Math.min(now - lastTime, 64) : 16
    lastTime = now
    // Frame-rate independent exponential smoothing (~150ms time constant).
    const k = 1 - Math.exp(-dt / 150)
    current.x += (target.x - current.x) * k
    current.y += (target.y - current.y) * k
    current.spread += (target.spread - current.spread) * (1 - Math.exp(-dt / 220))

    const settled =
      Math.abs(target.x - current.x) < 0.001 &&
      Math.abs(target.y - current.y) < 0.001 &&
      Math.abs(target.spread - current.spread) < 0.001

    if (settled) {
      current.x = target.x
      current.y = target.y
      current.spread = target.spread
      write()
      frame = 0
      lastTime = 0
      return
    }

    write()
    frame = requestAnimationFrame(tick)
  }

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(tick)
  }

  const invalidate = () => {
    rect = null
    zoneRect = null
  }

  const clamp = (value: number) => Math.max(-1, Math.min(1, value))

  const onMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || !inView) return
    rect ??= el.getBoundingClientRect()
    zoneRect ??= zone.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    target.x = clamp((event.clientX - cx) / Math.max(zoneRect.width / 2, 1))
    target.y = clamp((event.clientY - cy) / Math.max(zoneRect.height / 2, 1))
    target.spread = event.target instanceof Node && focus.contains(event.target) ? 1 : 0
    schedule()
  }

  const onLeave = () => {
    target.x = 0
    target.y = 0
    target.spread = 0
    schedule()
  }

  const attach = () => {
    if (listening) return
    listening = true
    zone.addEventListener('pointermove', onMove, { passive: true })
    zone.addEventListener('pointerleave', onLeave, { passive: true })
    window.addEventListener('scroll', invalidate, { passive: true })
    window.addEventListener('resize', invalidate, { passive: true })
  }

  const detach = () => {
    if (!listening) return
    listening = false
    zone.removeEventListener('pointermove', onMove)
    zone.removeEventListener('pointerleave', onLeave)
    window.removeEventListener('scroll', invalidate)
    window.removeEventListener('resize', invalidate)
  }

  const stopFrame = () => {
    if (frame) cancelAnimationFrame(frame)
    frame = 0
    lastTime = 0
  }

  const syncInteractivity = () => {
    if (pointerQuery.matches && !motionQuery.matches) {
      attach()
      return
    }
    detach()
    stopFrame()
    current.x = target.x = 0
    current.y = target.y = 0
    current.spread = target.spread = 0
    clearStyles()
  }

  const syncPaused = () => {
    el.dataset.paused = String(!inView || document.hidden)
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      inView = entry?.isIntersecting ?? true
      if (!inView) onLeave()
      syncPaused()
    },
    { threshold: 0 }
  )
  observer.observe(el)

  document.addEventListener('visibilitychange', syncPaused)
  pointerQuery.addEventListener('change', syncInteractivity)
  motionQuery.addEventListener('change', syncInteractivity)
  syncInteractivity()
  syncPaused()

  teardown = () => {
    detach()
    stopFrame()
    observer.disconnect()
    document.removeEventListener('visibilitychange', syncPaused)
    pointerQuery.removeEventListener('change', syncInteractivity)
    motionQuery.removeEventListener('change', syncInteractivity)
  }
})

onBeforeUnmount(() => {
  teardown?.()
  teardown = null
})
</script>

<template>
  <div ref="root" class="stack" aria-hidden="true">
    <div class="stack__scene">
      <div class="stack__rig">
        <span class="stack__ground" />
        <span class="stack__shadow" />

        <div
          v-for="(layer, i) in layers"
          :key="layer.key"
          class="stack__layer"
          :class="`stack__layer--${layer.key}`"
          :style="{ '--i': i }"
        >
          <div class="stack__drop">
            <div class="stack__bob">
              <div class="stack__box">
                <span class="stack__face stack__face--top">
                  <svg v-if="layer.key === 'ship'" class="stack__check" viewBox="0 0 100 100" fill="none">
                    <path d="M28 52 44 67 74 34" stroke="currentColor" stroke-width="9" stroke-linecap="square" />
                  </svg>
                </span>
                <span class="stack__face stack__face--n" />
                <span class="stack__face stack__face--e" />
                <span class="stack__face stack__face--s"><em>{{ layer.index }}</em>{{ layer.label }}</span>
                <span class="stack__face stack__face--w" />
              </div>
            </div>
          </div>
        </div>

        <div class="stack__orbit">
          <span class="stack__ring" />
          <div class="stack__spin">
            <div class="stack__sat">
              <div class="stack__box stack__box--sat">
                <span class="stack__face stack__face--top" />
                <span class="stack__face stack__face--n" />
                <span class="stack__face stack__face--e" />
                <span class="stack__face stack__face--s" />
                <span class="stack__face stack__face--w" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span class="stack__readout" />
  </div>
</template>

<style scoped>
.stack {
  --stack-x: 0;
  --stack-y: 0;
  --stack-spread: 0;
  --stack-rz: 45;
  --stack-rx: 58;
  --paper: #f4f5f6;
  --blue: #2949ed;
  --lime: #deef78;
  --ease-out: cubic-bezier(.22, 1, .36, 1);
  position: relative;
  container-type: inline-size;
  width: 100%;
  pointer-events: none;
  user-select: none;
}

.stack__scene {
  /* Footprint of one slab: scales with the poster, capped for desktop. */
  --s: clamp(92px, 44cqi, 206px);
  --t: calc(var(--s) * .165);
  --g: calc(var(--s) * (.085 + .17 * var(--stack-spread)));
  position: relative;
  display: grid;
  place-items: center;
  height: calc(var(--s) * 1.62);
  perspective: calc(var(--s) * 6.5);
  perspective-origin: 50% 40%;
}

.stack__rig,
.stack__layer,
.stack__drop,
.stack__bob,
.stack__box,
.stack__orbit,
.stack__spin,
.stack__sat {
  transform-style: preserve-3d;
}

.stack__rig {
  position: relative;
  width: var(--s);
  height: var(--s);
  transform:
    translateY(calc(var(--s) * .2))
    rotateX(calc(58deg + var(--stack-y) * 8deg))
    rotateZ(calc(-45deg + var(--stack-x) * 16deg));
}

.stack__ground,
.stack__shadow,
.stack__layer,
.stack__drop,
.stack__bob,
.stack__box,
.stack__orbit,
.stack__ring {
  position: absolute;
  inset: 0;
}

/* Registration footprint on the ground plane. */
.stack__ground {
  inset: calc(var(--s) * -.2);
  border: 1px dashed rgb(255 255 255 / .32);
  transform: translateZ(-2px);
}

.stack__ground::before,
.stack__ground::after {
  position: absolute;
  width: calc(var(--s) * .12);
  height: calc(var(--s) * .12);
  border: 0 solid rgb(255 255 255 / .7);
  content: '';
}

.stack__ground::before { top: -7px; left: -7px; border-width: 1.5px 0 0 1.5px; }
.stack__ground::after { right: -7px; bottom: -7px; border-width: 0 1.5px 1.5px 0; }

.stack__shadow {
  inset: calc(var(--s) * -.12);
  background: radial-gradient(closest-side, rgb(9 20 104 / .55), rgb(9 20 104 / 0));
  transform: translateZ(-1px) scale(calc(1 + var(--stack-spread) * .12));
}

.stack__layer {
  transform: translateZ(calc(var(--i) * (var(--t) + var(--g))));
}

.stack__drop {
  animation: stack-drop 1100ms var(--ease-out) both;
  animation-delay: calc(180ms + var(--i) * 140ms);
}

.stack__bob {
  animation: stack-bob 7s ease-in-out infinite;
  animation-delay: calc(var(--i) * -1.1s);
}

/* ——— Generic box: square footprint --w, height --h ——— */
.stack__box {
  --w: var(--s);
  --h: var(--t);
}

.stack__face {
  position: absolute;
  overflow: hidden;
  backface-visibility: hidden;
}

.stack__face--top {
  inset: 0;
  transform: translateZ(var(--h));
}

.stack__face--n,
.stack__face--e,
.stack__face--s,
.stack__face--w {
  top: calc(50% - var(--h) / 2);
  left: 0;
  width: 100%;
  height: var(--h);
  transform:
    rotateZ(var(--a))
    translateY(calc(var(--w) / 2))
    translateZ(calc(var(--h) / 2))
    rotateX(-90deg);
}

.stack__face--s { --a: 0deg; }
.stack__face--w { --a: 90deg; }
.stack__face--n { --a: 180deg; }
.stack__face--e { --a: -90deg; }

/* Light shifts subtly as the stack turns. */
.stack__face--s::after,
.stack__face--w::after {
  position: absolute;
  inset: 0;
  background: #fff;
  content: '';
  pointer-events: none;
}

.stack__face--s::after { opacity: calc(.06 + var(--stack-x) * .06); }
.stack__face--w::after { opacity: calc(.06 - var(--stack-x) * .06); }

.stack__face--s {
  display: flex;
  align-items: center;
  gap: .9em;
  padding-inline: .9em;
  font-size: max(6px, calc(var(--s) * .046));
  font-weight: 600;
  letter-spacing: .14em;
  line-height: 1;
  text-transform: uppercase;
}

.stack__face--s em {
  font-style: normal;
  font-weight: 500;
  opacity: .7;
}

/* ——— 01 Think: paper slab with a sketch grid ——— */
.stack__layer--think .stack__face--top {
  background:
    radial-gradient(circle, rgb(41 73 237 / .38) 1px, transparent 1.4px) 0 0 / calc(var(--s) / 9) calc(var(--s) / 9),
    var(--paper);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / .9);
}
.stack__layer--think .stack__face--s { background: #cdd5ff; color: var(--blue); }
.stack__layer--think .stack__face--w { background: #a9b6ff; }
.stack__layer--think .stack__face--n,
.stack__layer--think .stack__face--e { background: #b9c4ff; }

/* ——— 02 Build: blue slab with modules ——— */
.stack__layer--build .stack__face {
  background: var(--blue);
  box-shadow: inset 0 0 0 1.5px var(--paper);
}
.stack__layer--build .stack__face--top {
  background:
    linear-gradient(rgb(255 255 255 / .16) 1px, transparent 1px) 0 0 / 100% calc(var(--s) / 6),
    linear-gradient(90deg, rgb(255 255 255 / .16) 1px, transparent 1px) 0 0 / calc(var(--s) / 6) 100%,
    var(--blue);
}
.stack__layer--build .stack__face--top::before {
  position: absolute;
  inset: 19%;
  border: 1.5px solid var(--paper);
  content: '';
}
.stack__layer--build .stack__face--s { background: #3a5cff; color: var(--paper); }
.stack__layer--build .stack__face--w { background: #1f3bd2; }

/* ——— 03 Ship: lime slab with a check ——— */
.stack__layer--ship .stack__face--top {
  display: grid;
  place-items: center;
  background: var(--lime);
  color: var(--blue);
  box-shadow: inset 0 0 0 1px #f1f8c4;
}
.stack__layer--ship .stack__face--s { background: #c9dc56; color: #24310a; }
.stack__layer--ship .stack__face--w { background: #a9bd35; }
.stack__layer--ship .stack__face--n,
.stack__layer--ship .stack__face--e { background: #b9cc45; }

.stack__check {
  width: 46%;
  height: 46%;
  transform: rotate(45deg);
}

/* ——— Repeat: a small cube orbiting the middle layer ——— */
.stack__orbit {
  transform: translateZ(calc(var(--t) * 1.5 + var(--g)));
}

.stack__ring {
  inset: calc(var(--s) * -.36);
  border: 1px dashed rgb(255 255 255 / .38);
  border-radius: 50%;
}

.stack__spin {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  animation: stack-orbit 26s linear infinite;
}

.stack__sat {
  position: absolute;
  top: calc(var(--s) * -.065);
  left: calc(var(--s) * .795);
  width: calc(var(--s) * .13);
  height: calc(var(--s) * .13);
}

.stack__box--sat {
  --w: calc(var(--s) * .13);
  --h: calc(var(--s) * .13);
  transform: translateZ(calc(var(--s) * -.065));
}

.stack__box--sat .stack__face--top { background: var(--lime); }
.stack__box--sat .stack__face--s { background: #c9dc56; padding: 0; }
.stack__box--sat .stack__face--w { background: #a9bd35; }
.stack__box--sat .stack__face--n,
.stack__box--sat .stack__face--e { background: #b9cc45; }

/* Live axonometric readout — a quiet engineering detail. */
.stack__readout {
  position: absolute;
  right: 0;
  bottom: 0;
  counter-reset: rz var(--stack-rz) rx var(--stack-rx);
  color: rgb(255 255 255 / .62);
  font-size: 9px;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  letter-spacing: .12em;
}

.stack__readout::after {
  content: 'AXO  Z ' counter(rz) '°  X ' counter(rx) '°';
  white-space: pre;
}

.stack[data-paused='true'] .stack__bob,
.stack[data-paused='true'] .stack__spin,
.stack[data-paused='true'] .stack__drop {
  animation-play-state: paused;
}

@keyframes stack-drop {
  from { transform: translateZ(calc(var(--s) * (.5 + var(--i) * .25))); }
  to { transform: translateZ(0); }
}

@keyframes stack-bob {
  0%, 100% { transform: translateZ(0); }
  50% { transform: translateZ(calc(var(--s) * .028)); }
}

@keyframes stack-orbit {
  to { transform: rotateZ(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .stack__drop,
  .stack__bob,
  .stack__spin {
    animation: none;
  }

  .stack__spin { transform: rotateZ(-30deg); }
}
</style>
