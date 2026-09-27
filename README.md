# Konrad Profile - Nuxt

Nuxt version of the original static React/Babel profile page.

## Run

Use Node.js 22.19+ (22.x), 24.11+ (24.x), or 26+ to match Nuxt's runtime requirements.

```bash
npm install
npm run dev
```

The current implementation keeps the page as a single Nuxt app entry in `app/app.vue`.
Section components live in `app/components`, shared styles and design tokens live in
`app/assets/css/main.css`, and static uploads are available from `public/uploads`.

The previous HTML/JSX export files are left in place as source references.

## Oferteo demos

`/oferteo` links to two full-screen experiences: `/oferto/demo` finds contractor
profiles through chat, and `/oferto/demo-2` creates and revises a service-offer
draft with a live preview, copy and text download. `/offerteo` redirects to the
landing page. Both use DeepSeek V4.1 Flash through AI Gateway and share BotID
protection and request limits. Nothing is published or sent to contractors.

See [setup, behavior and limits](docs/oferteo-demo.md).

```bash
NODE_ENV=development node --experimental-strip-types --test scripts/test-oferto.ts scripts/test-oferto-botid.ts scripts/test-oferto-creator.ts
```
