export type OferteoViewportStyle = {
  height: string
  top: string
}

type ViewportSize = { height: number; offsetTop: number; scale: number }
type ViewportWindow = EventTarget & { innerHeight: number; visualViewport?: (EventTarget & ViewportSize) | null }

export function oferteoViewportStyle(viewport: ViewportSize | null | undefined, windowHeight: number): OferteoViewportStyle | undefined {
  // Pinch zoom should use the CSS layout viewport, with no stale pixel override.
  if (viewport && viewport.scale !== 1) return undefined
  const measuredHeight = viewport && Number.isFinite(viewport.height) && viewport.height > 0 ? viewport.height : windowHeight
  // Desktop browsers can publish window and visual-viewport resize metrics apart.
  const height = Number.isFinite(windowHeight) && windowHeight > 0 ? Math.min(measuredHeight, windowHeight) : measuredHeight
  if (!Number.isFinite(height) || height <= 0) return undefined
  const top = viewport && Number.isFinite(viewport.offsetTop) ? Math.max(0, viewport.offsetTop) : 0
  return { height: `${height}px`, top: `${top}px` }
}

export function observeOferteoViewport(host: ViewportWindow, update: (style: OferteoViewportStyle | undefined) => void) {
  const viewport = host.visualViewport
  const sync = () => update(oferteoViewportStyle(host.visualViewport, host.innerHeight))
  host.addEventListener('resize', sync)
  viewport?.addEventListener('resize', sync)
  viewport?.addEventListener('scroll', sync)
  sync()
  return () => {
    host.removeEventListener('resize', sync)
    viewport?.removeEventListener('resize', sync)
    viewport?.removeEventListener('scroll', sync)
  }
}
