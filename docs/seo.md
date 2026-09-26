# SEO and link previews

Public metadata lives in `app/data/seo.ts` and is rendered on the server by
`app/composables/useRouteSeo.ts`. The canonical production origin is
`https://www.koonrad.dev`, matching the domain that the apex redirects to.

The share image is `public/social/koonrad-typescript-v1.png`: a 1200×630 PNG.
Its editable vector source is `assets/brand/social-card.svg`. Raster exports are
committed, so deployment does not need fonts, image rendering, or a runtime API.
When changing the image, export a new PNG and version its filename in `seoSite`
to avoid reusing cached image bytes.

Do not put public metadata assets in `public/uploads/`: that directory is
excluded by both `.gitignore` and `.vercelignore` and does not get deployed.

The icon family lives directly in `public/`: SVG and ICO favicons, a 32px PNG,
180px Apple touch icon, and 192/512px manifest icons. Keep them consistent with
the homepage's cobalt K mark.

Run the crawler-facing checks with Node 22 or later:

```sh
node scripts/check-seo.mjs http://127.0.0.1:3000
node scripts/check-seo.mjs https://www.koonrad.dev
```

The check requests server HTML as a link-preview crawler, checks public and
noindex pages, fetches the actual PNG and verifies its dimensions, then checks
canonical URLs, sitemap, robots, icon files, the manifest, and a real 404.

Messaging apps may retain metadata from an earlier share. A deploy fixes what
new crawls receive; it cannot replace an already-sent message's cached card.
Use Facebook's Sharing Debugger or LinkedIn's Post Inspector to request a new
crawl on those services. Keep search indexing disabled for application pages.
