import assert from 'node:assert/strict'

// Check the HTML a link-preview crawler receives, without executing JavaScript.
// Usage: node scripts/check-seo.mjs http://127.0.0.1:3000
//        node scripts/check-seo.mjs https://www.koonrad.dev
const base = new URL(process.argv[2] || 'http://127.0.0.1:3000')
const canonicalOrigin = 'https://www.koonrad.dev'
const headers = { 'user-agent': 'facebookexternalhit/1.1 (+https://www.facebook.com/externalhit_uatext.php)' }
const decode = (value) => value
  .replace(/&#x([\da-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
  .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number(decimal)))
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
const attributes = (tag) => Object.fromEntries(
  [...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map(([, name, value]) => [name, decode(value)])
)
const fetchPath = async (path) => {
  const response = await fetch(new URL(path, base), { headers, signal: AbortSignal.timeout(15000) })
  assert.equal(response.status, 200, `${path} should return 200, got ${response.status}`)
  return response
}

const seenImages = new Set()
for (const path of ['/', '/?ref=share', '/jasne.ai', '/cv', '/mcp', '/oferteo', '/posthog']) {
  const response = await fetchPath(path)
  const html = await response.text()
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1]
  assert.ok(head, `${path}: server-rendered head`)
  const tags = [...head.matchAll(/<meta\s[^>]*>/gi)].map(([tag]) => attributes(tag))
  const meta = (name) => {
    const matches = tags.filter((tag) => tag.property === name || tag.name === name)
    assert.equal(matches.length, 1, `${path}: exactly one ${name}`)
    return matches[0].content
  }
  const links = [...head.matchAll(/<link\s[^>]*>/gi)].map(([tag]) => attributes(tag))
  const canonical = links.filter((link) => link.rel === 'canonical')
  assert.equal(canonical.length, 1, `${path}: one canonical`)
  const expectedCanonical = new URL(new URL(path, base).pathname, canonicalOrigin).href
  assert.equal(canonical[0].href, expectedCanonical)
  assert.equal(meta('og:url'), expectedCanonical)
  const title = decode(head.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '')
  assert.ok(title.length > 10, `${path}: useful title`)
  assert.equal(meta('og:title'), title)
  assert.equal(meta('twitter:title'), title)
  assert.equal(meta('og:description'), meta('description'))
  assert.equal(meta('twitter:description'), meta('description'))
  assert.equal(meta('twitter:card'), 'summary_large_image')
  const image = meta('og:image')
  assert.ok(image.startsWith(`${canonicalOrigin}/social/`), `${path}: deployed public image`)
  assert.equal(meta('og:image:secure_url'), image)
  assert.equal(meta('twitter:image'), image)
  assert.equal(meta('og:image:type'), 'image/png')
  assert.equal(meta('og:image:width'), '1200')
  assert.equal(meta('og:image:height'), '630')
  assert.ok(meta('og:image:alt').includes('Konrad'))
  assert.equal(meta('twitter:image:alt'), meta('og:image:alt'))
  seenImages.add(image)
  const privatePage = ['/oferteo', '/posthog'].includes(path)
  assert.ok(meta('robots').includes(privatePage ? 'noindex' : 'index, follow'))
  if (!privatePage) assert.ok(meta('robots').includes('max-image-preview:large'))
  if (path === '/') {
    assert.ok(links.some((link) => link.rel === 'apple-touch-icon' && link.href === '/apple-touch-icon.png'))
    assert.ok(links.some((link) => link.rel === 'icon' && link.sizes === '32x32'))
    assert.ok(links.some((link) => link.rel === 'manifest' && link.href === '/site.webmanifest'))
    assert.ok(title.includes('Full-Stack TypeScript'))
    assert.ok(!title.includes('Nuxt/Vue'))
    const jsonLd = head.match(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i)?.[1]
    assert.ok(jsonLd, 'SSR JSON-LD')
    const graph = JSON.parse(jsonLd)['@graph']
    const person = graph.find((entry) => entry['@type'] === 'Person')
    assert.ok(person && !person.image, 'do not label a brand card as a portrait')
    assert.ok(person.sameAs.every((url) => /github\.com\/kstraszewski|linkedin\.com\/in\//.test(url)))
    assert.ok(graph.find((entry) => entry['@type'] === 'ProfilePage').primaryImageOfPage)
  }
  console.log(`PASS ${path}: SSR metadata, canonical, preview and indexing`)
}

for (const image of seenImages) {
  const response = await fetchPath(new URL(image).pathname)
  assert.match(response.headers.get('content-type') || '', /^image\/png/)
  const bytes = Buffer.from(await response.arrayBuffer())
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a')
  assert.equal(bytes.readUInt32BE(16), 1200)
  assert.equal(bytes.readUInt32BE(20), 630)
  assert.ok(bytes.length < 300_000, 'social card should remain lightweight')
  console.log(`PASS image: 1200×630 PNG, ${Math.round(bytes.length / 1024)} KB`)
}

const robots = await (await fetchPath('/robots.txt')).text()
assert.ok(robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`))
const sitemap = await (await fetchPath('/sitemap.xml')).text()
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => decode(url))
assert.deepEqual(locations.sort(), ['/', '/cv', '/jasne.ai', '/mcp'].map((path) => new URL(path, canonicalOrigin).href).sort())
for (const [path, mime] of [
  ['/favicon.svg', 'image/svg+xml'], ['/favicon.ico', 'image/'],
  ['/favicon-32.png', 'image/png'], ['/apple-touch-icon.png', 'image/png'],
  ['/icon-192.png', 'image/png'], ['/icon-512.png', 'image/png']
]) {
  const response = await fetchPath(path)
  assert.ok(response.headers.get('content-type')?.startsWith(mime), `${path}: image MIME`)
}
const manifest = await (await fetchPath('/site.webmanifest')).json()
assert.equal(manifest.short_name, 'koonrad.dev')
const missing = await fetch(new URL('/_seo-check-not-a-page', base), { headers })
assert.equal(missing.status, 404)
console.log('PASS sitemap, robots, favicons, manifest and real 404')
