export interface SceneDragPosition {
  x: number
  y: number
}

/** Horizontal scene gestures coexist with native vertical pan and pinch zoom. */
export function bindSceneDrag(element: HTMLElement, options: {
  isEnabled: () => boolean
  onMove: (position: SceneDragPosition) => void
  onEnd: () => void
}) {
  let gesture: {
    id: number
    x: number
    y: number
    width: number
    height: number
    dragging: boolean
    vertical: boolean
  } | null = null

  const cancel = () => {
    const previous = gesture
    gesture = null
    delete element.dataset.dragging
    if (!previous) return
    // Clear state before releasing: lostpointercapture can fire synchronously.
    if (element.hasPointerCapture(previous.id)) element.releasePointerCapture(previous.id)
    if (previous.dragging) options.onEnd()
  }

  const down = (event: PointerEvent) => {
    if (gesture) {
      // A second finger starts a native pinch, never a new scene rotation.
      if (event.pointerId !== gesture.id && event.pointerType !== 'mouse') cancel()
      return
    }
    if (!options.isEnabled() || !event.isPrimary || event.button !== 0) return
    const rect = element.getBoundingClientRect()
    gesture = {
      id: event.pointerId, x: event.clientX, y: event.clientY,
      width: rect.width, height: rect.height, dragging: false, vertical: false,
    }
  }

  const move = (event: PointerEvent) => {
    if (!gesture || event.pointerId !== gesture.id) return
    if (!options.isEnabled()) { cancel(); return }
    if (gesture.vertical) return
    const dx = event.clientX - gesture.x
    const dy = event.clientY - gesture.y
    if (!gesture.dragging) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return
      if (Math.abs(dy) >= Math.abs(dx)) { gesture.vertical = true; return }
      gesture.dragging = true
      element.dataset.dragging = 'true'
      try {
        element.setPointerCapture(event.pointerId)
      } catch {
        cancel()
        return
      }
      if (!gesture) return
    }
    // Soft bounds avoid a hard stop at the edges, even on a long swipe.
    options.onMove({
      x: Math.tanh(dx / Math.max(gesture.width / 2, 1)),
      y: Math.tanh(dy / Math.max(gesture.height / 2, 1)),
    })
  }

  const end = (event: PointerEvent) => {
    if (event.pointerId === gesture?.id) cancel()
  }
  const lost = (event: PointerEvent) => {
    // Moving implicit capture from a child to this wrapper bubbles a child loss.
    if (event.target === element && event.pointerId === gesture?.id) cancel()
  }
  const leave = () => {
    // Before capture, a mouse can be released outside the surface.
    if (!gesture?.dragging) cancel()
  }

  element.addEventListener('pointerdown', down, { passive: true })
  element.addEventListener('pointermove', move, { passive: true })
  element.addEventListener('pointerup', end, { passive: true })
  element.addEventListener('pointercancel', end, { passive: true })
  element.addEventListener('lostpointercapture', lost, { passive: true })
  element.addEventListener('pointerleave', leave, { passive: true })

  return {
    isDragging: () => Boolean(gesture?.dragging),
    cancel,
    destroy: () => {
      cancel()
      element.removeEventListener('pointerdown', down)
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerup', end)
      element.removeEventListener('pointercancel', end)
      element.removeEventListener('lostpointercapture', lost)
      element.removeEventListener('pointerleave', leave)
    },
  }
}
