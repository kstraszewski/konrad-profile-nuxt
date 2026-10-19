# Working in this repository

This is a Nuxt 4 / Vue 3 / TypeScript app using npm, Vercel, AI SDK,
AI Gateway, BotID, Neon Postgres, PostHog, and `@nuxtjs/mcp-toolkit`.
Check `package.json`, `package-lock.json`, and installed documentation for exact
versions before using framework or SDK APIs. AI SDK is on v7.

## Project layout

- `app/`: Vue pages, components, composables, client plugins, and styles.
- `app/assets/css/main.css`: shared design tokens and styles.
- `server/`: Nitro routes, API handlers, database utilities, and MCP tools.
- `shared/`: types, data, and logic shared by client and server.
- `scripts/`: tests, SEO checks, and database setup utilities.
- `docs/`: feature behavior and setup documentation.

## Local skills

Read the relevant `.agents/skills/<name>/SKILL.md` before starting matching work.
Codex reads this directory directly; `.claude/skills/` links to the same files.
Use only the skills relevant to the requested change.

| Skill | Use for |
| --- | --- |
| `nuxt` | Nuxt/Vue pages, composables, SSR, hydration, SEO, runtime config, and Nitro routes. |
| `ai-sdk` | AI SDK v7, Vercel AI Gateway, structured output, tools, and streaming. Prefer documentation shipped in `node_modules/ai/docs`. |
| `neon` | Neon platform guidance and choosing the appropriate database skill. |
| `neon-postgres` | Existing Neon connections, `@neondatabase/serverless`, SQL, schema, and database performance. |
| `frontend-design` | Requested UI work; preserve the existing visual direction and reuse project styles. |
| `web-design-guidelines` | UI reviews, accessibility, responsive behavior, and interaction quality. |
| `mcp-builder` | MCP tool/resource contracts, schemas, and protocol verification. Keep the existing Nuxt MCP toolkit integration. |
| `deploy-to-vercel` | Requested Vercel deployments; use the existing project and deployment configuration. |

Preserve the project's existing stack when applying general skill examples.
Installing or updating skills only requires agent files; framework modules and
application dependencies are separate changes.
Keep secrets and privileged I/O in server code and private runtime config.

## Verification

Choose checks appropriate to the changed behavior:

- Application TypeScript: `npm run typecheck`.
- Motion/drag behavior: `npm run test:motion`.
- Oferteo server behavior: `npm run test:oferteo`.
- MCP, with a local dev server: `npm run test:mcp -- http://127.0.0.1:3000/mcp/server --local-downloads`.
- Build or deployment changes: `npm run build`.

Skill maintenance instructions and sources are in `docs/agent-skills.md`.
