import assert from 'node:assert/strict'
import test from 'node:test'
import { bindSceneDrag, type SceneDragPosition } from '../app/utils/sceneDrag.ts'

class SceneSurface {
  dataset: Record<string, string> = {}
  listeners = new Map<string, Set<(event: PointerEvent) => void>>()
  captured = new Set<number>()
  onCapture?: (id: number) => void
  width = 300
  height = 400

  addEventListener(type: string, listener: (event: PointerEvent) => void) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set())
    this.listeners.get(type)!.add(listener)
  }
  removeEventListener(type: string, listener: (event: PointerEvent) => void) {
    this.listeners.get(type)?.delete(listener)
  }
  getBoundingClientRect() { return { width: this.width, height: this.height } }
  setPointerCapture(id: number) { this.captured.add(id); this.onCapture?.(id) }
  hasPointerCapture(id: number) { return this.captured.has(id) }
  releasePointerCapture(id: number) {
    this.captured.delete(id)
    this.send('lostpointercapture', { pointerId: id })
  }
  send(type: string, fields: Partial<PointerEvent> = {}) {
    const event = {
      pointerId: 1, pointerType: 'touch', isPrimary: true, button: 0,
      clientX: 100, clientY: 100, target: this,
      preventDefault: () => assert.fail('Native page pan and pinch must remain available'),
      ...fields,
    } as unknown as PointerEvent
    for (const listener of this.listeners.get(type) ?? []) listener(event)
  }
}

function scene() {
  const surface = new SceneSurface()
  const moves: SceneDragPosition[] = []
  let ends = 0
  let enabled = true
  const drag = bindSceneDrag(surface as unknown as HTMLElement, {
    isEnabled: () => enabled,
    onMove: position => moves.push(position),
    onEnd: () => { ends++ },
  })
  return { surface, moves, drag, ends: () => ends, disable: () => { enabled = false } }
}

test('a primary finger swipe rotates even without a hover or fine pointer', () => {
  const s = scene()
  s.surface.send('pointerdown')
  s.surface.send('pointermove', { clientX: 160, clientY: 105 })
  assert.equal(s.drag.isDragging(), true)
  assert.equal(s.surface.dataset.dragging, 'true')
  assert.equal(s.surface.hasPointerCapture(1), true)
  assert.ok(s.moves[0]!.x > 0)
  assert.ok(s.moves[0]!.y > 0)
  s.surface.send('pointerup')
  assert.equal(s.drag.isDragging(), false)
  assert.equal(s.surface.dataset.dragging, undefined)
  assert.equal(s.surface.hasPointerCapture(1), false)
  assert.equal(s.ends(), 1, 'release and synchronous capture loss must end only once')
})

test('a tap or vertical swipe leaves page scrolling to the browser', () => {
  const s = scene()
  s.surface.send('pointerdown')
  s.surface.send('pointermove', { clientX: 104, clientY: 103 })
  s.surface.send('pointerup')
  s.surface.send('pointerdown')
  s.surface.send('pointermove', { clientX: 101, clientY: 130 })
  s.surface.send('pointermove', { clientX: 220, clientY: 150 })
  s.surface.send('pointercancel')
  assert.equal(s.moves.length, 0)
  assert.equal(s.ends(), 0)
  assert.equal(s.surface.captured.size, 0)
})

test('a second, non-primary finger cancels rotation for native pinch zoom', () => {
  const s = scene()
  s.surface.send('pointerdown')
  s.surface.send('pointermove', { clientX: 180 })
  s.surface.send('pointerdown', { pointerId: 2, isPrimary: false })
  s.surface.send('pointermove', { clientX: 230 })
  s.surface.send('pointermove', { pointerId: 2, clientX: 230 })
  assert.equal(s.drag.isDragging(), false)
  assert.equal(s.moves.length, 1)
  assert.equal(s.ends(), 1)
})

test('capture loss bubbling from a child does not cancel the wrapper gesture', () => {
  const s = scene()
  s.surface.onCapture = id => s.surface.send('lostpointercapture', {
    pointerId: id, target: {} as EventTarget,
  })
  s.surface.send('pointerdown')
  s.surface.send('pointermove', { clientX: 170 })
  assert.equal(s.drag.isDragging(), true)
  assert.equal(s.moves.length, 1)
  assert.equal(s.ends(), 0)
  s.surface.send('lostpointercapture')
  assert.equal(s.drag.isDragging(), false)
  assert.equal(s.ends(), 1)
})

test('pointer cancellation resets the scene and permits a new gesture', () => {
  const s = scene()
  s.surface.send('pointerdown')
  s.surface.send('pointermove', { clientX: 160 })
  s.surface.send('pointerup', { pointerId: 9 })
  assert.equal(s.drag.isDragging(), true, 'an unrelated pointer cannot end the drag')
  s.surface.send('pointercancel')
  assert.equal(s.ends(), 1)
  s.surface.send('pointerdown', { pointerId: 3 })
  s.surface.send('pointermove', { pointerId: 3, clientX: 30 })
  assert.equal(s.drag.isDragging(), true)
  assert.ok(s.moves[1]!.x < 0)
})

test('disabled motion cancels an active gesture and prevents new rotation', () => {
  const s = scene()
  s.surface.send('pointerdown')
  s.surface.send('pointermove', { clientX: 160 })
  s.disable()
  s.surface.send('pointermove', { clientX: 220 })
  s.surface.send('pointerdown')
  s.surface.send('pointermove', { clientX: 260 })
  assert.equal(s.moves.length, 1)
  assert.equal(s.ends(), 1)
  assert.equal(s.drag.isDragging(), false)
})

test('long swipes and zero-size surfaces keep rotation finite and bounded', () => {
  const s = scene()
  s.surface.width = s.surface.height = 0
  s.surface.send('pointerdown')
  s.surface.send('pointermove', { clientX: 10000, clientY: 4000 })
  s.surface.send('pointermove', { clientX: -10000, clientY: -4000 })
  for (const position of s.moves) {
    assert.ok(Number.isFinite(position.x) && Number.isFinite(position.y))
    assert.ok(Math.abs(position.x) <= 1 && Math.abs(position.y) <= 1)
  }
})

test('failed or synchronously lost pointer capture ends without stale movement', () => {
  for (const fail of [true, false]) {
    const s = scene()
    s.surface.onCapture = () => {
      if (fail) throw new Error('Pointer is no longer active')
      s.surface.send('lostpointercapture')
    }
    s.surface.send('pointerdown')
    s.surface.send('pointermove', { clientX: 180 })
    assert.equal(s.drag.isDragging(), false)
    assert.equal(s.moves.length, 0)
    assert.equal(s.ends(), 1)
  }
})

test('mouse and pen drag work, while non-primary and secondary-button starts do not', () => {
  for (const pointerType of ['mouse', 'pen']) {
    const s = scene()
    s.surface.send('pointerdown', { pointerType, button: 2 })
    s.surface.send('pointermove', { pointerType, clientX: 180 })
    s.surface.send('pointerdown', { pointerType, isPrimary: false })
    s.surface.send('pointermove', { pointerType, clientX: 180 })
    assert.equal(s.moves.length, 0)
    s.surface.send('pointerdown', { pointerType })
    s.surface.send('pointermove', { pointerType, clientX: 180 })
    assert.equal(s.moves.length, 1)
  }
})

test('unmount cleanup releases capture and removes all gesture listeners', () => {
  const s = scene()
  s.surface.send('pointerdown')
  s.surface.send('pointermove', { clientX: 180 })
  s.drag.destroy()
  s.drag.destroy()
  s.surface.send('pointerdown')
  s.surface.send('pointermove', { clientX: 240 })
  assert.equal(s.ends(), 1)
  assert.equal(s.moves.length, 1)
  assert.equal(s.surface.captured.size, 0)
  assert.ok([...s.surface.listeners.values()].every(listeners => listeners.size === 0))
})

test('leaving before capture permits another mouse drag; captured drags survive leaving', () => {
  const s = scene()
  s.surface.send('pointerdown', { pointerType: 'mouse' })
  s.surface.send('pointermove', { pointerType: 'mouse', clientY: 150 })
  s.surface.send('pointerleave', { pointerType: 'mouse' })
  // The mouse button is released outside, so this surface never receives pointerup.
  s.surface.send('pointerdown', { pointerType: 'mouse' })
  s.surface.send('pointermove', { pointerType: 'mouse', clientX: 180 })
  s.surface.send('pointerleave', { pointerType: 'mouse' })
  assert.equal(s.drag.isDragging(), true)
  assert.equal(s.moves.length, 1)
  s.surface.send('pointerup', { pointerType: 'mouse' })
  assert.equal(s.ends(), 1)
})
