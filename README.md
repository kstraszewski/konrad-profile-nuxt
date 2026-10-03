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

## MCP CV connection

`/mcp` contains connection instructions for the public read-only server at
`https://www.koonrad.dev/mcp/server`. No authentication is required.

With the dev server running, verify the MCP handshake, tools, profile retrieval,
MCP App resources, install links, and CV downloads:

```bash
npm run test:mcp -- http://127.0.0.1:3000/mcp/server --local-downloads
```

After deployment, check the public server and the exact download URLs it advertises:

```bash
npm run test:mcp -- https://www.koonrad.dev/mcp/server
```

The checks include the Plane context. An older deployment will fail those checks
until it includes the new content. The smoke test uses the MCP SDK installed by
`@nuxtjs/mcp-toolkit`; it does not modify any AI client's configuration.

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
