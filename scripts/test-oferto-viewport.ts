import assert from 'node:assert/strict'
import { test } from 'node:test'
import { observeOferteoViewport, oferteoViewportStyle, type OferteoViewportStyle } from '../app/utils/oferteoViewport.ts'

class VisualViewportFixture extends EventTarget {
  height = 800
  offsetTop = 0
  scale = 1
}
class WindowFixture extends EventTarget {
  innerHeight = 800
  visualViewport: VisualViewportFixture | null
  constructor(viewport: VisualViewportFixture | null) { super(); this.visualViewport = viewport }
}

test('desktop window resize updates the demo height even without VisualViewport', () => {
  const host = new WindowFixture(null)
  const styles: (OferteoViewportStyle | undefined)[] = []
  const dispose = observeOferteoViewport(host, style => styles.push(style))
  assert.deepEqual(styles.at(-1), { height: '800px', top: '0px' })
  host.innerHeight = 520
  host.dispatchEvent(new Event('resize'))
  assert.deepEqual(styles.at(-1), { height: '520px', top: '0px' })
  dispose()
  host.innerHeight = 900
  host.dispatchEvent(new Event('resize'))
  assert.equal(styles.length, 2, 'an unmounted demo cannot keep changing viewport state')
})

test('stale desktop VisualViewport metrics cannot extend the demo below the resized window', () => {
  const viewport = new VisualViewportFixture()
  const host = new WindowFixture(viewport)
  const styles: (OferteoViewportStyle | undefined)[] = []
  const dispose = observeOferteoViewport(host, style => styles.push(style))
  host.innerHeight = 520
  host.dispatchEvent(new Event('resize'))
  assert.equal(viewport.height, 800)
  assert.deepEqual(styles.at(-1), { height: '520px', top: '0px' })
  viewport.height = 480
  viewport.dispatchEvent(new Event('resize'))
  assert.deepEqual(styles.at(-1), { height: '480px', top: '0px' }, 'a smaller keyboard viewport still takes precedence')
  dispose()
})

test('keyboard resize and viewport panning follow the visible height and offset', () => {
  const viewport = new VisualViewportFixture()
  const host = new WindowFixture(viewport)
  const styles: (OferteoViewportStyle | undefined)[] = []
  const dispose = observeOferteoViewport(host, style => styles.push(style))
  viewport.height = 310.5
  viewport.offsetTop = 42.25
  viewport.dispatchEvent(new Event('resize'))
  assert.deepEqual(styles.at(-1), { height: '310.5px', top: '42.25px' })
  viewport.offsetTop = 68
  viewport.dispatchEvent(new Event('scroll'))
  assert.deepEqual(styles.at(-1), { height: '310.5px', top: '68px' })
  viewport.height = 640
  host.innerHeight = 640
  host.dispatchEvent(new Event('resize'))
  assert.deepEqual(styles.at(-1), { height: '640px', top: '68px' }, 'window resize must also refresh an existing VisualViewport')
  dispose()
  viewport.dispatchEvent(new Event('resize'))
  viewport.dispatchEvent(new Event('scroll'))
  assert.equal(styles.length, 4)
})

test('pinch zoom clears a stale pixel height and restores keyboard sizing at normal scale', () => {
  const viewport = new VisualViewportFixture()
  const host = new WindowFixture(viewport)
  const styles: (OferteoViewportStyle | undefined)[] = []
  const dispose = observeOferteoViewport(host, style => styles.push(style))
  viewport.height = 300
  viewport.dispatchEvent(new Event('resize'))
  assert.deepEqual(styles.at(-1), { height: '300px', top: '0px' })
  viewport.scale = 2
  viewport.height = 400
  viewport.offsetTop = 120
  viewport.dispatchEvent(new Event('resize'))
  assert.equal(styles.at(-1), undefined, 'CSS viewport sizing replaces the old keyboard height during pinch zoom')
  viewport.scale = 1
  viewport.height = 720
  viewport.offsetTop = 0
  viewport.dispatchEvent(new Event('resize'))
  assert.deepEqual(styles.at(-1), { height: '720px', top: '0px' })
  dispose()
})

test('invalid measurements cannot produce a zero or NaN-sized app', () => {
  assert.deepEqual(oferteoViewportStyle({ height: 0, offsetTop: Number.NaN, scale: 1 }, 600), { height: '600px', top: '0px' })
  assert.deepEqual(oferteoViewportStyle({ height: 500, offsetTop: -15, scale: 1 }, 600), { height: '500px', top: '0px' })
  assert.equal(oferteoViewportStyle(undefined, 0), undefined)
  assert.equal(oferteoViewportStyle(undefined, Number.NaN), undefined)
})
