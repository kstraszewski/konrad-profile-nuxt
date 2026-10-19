# Repository agent skills

The project keeps eight skills in `.agents/skills/`, with relative symlinks in
`.claude/skills/`. Codex discovers `.agents/skills/` directly. `AGENTS.md` explains
which skills apply to each part of the app.

Installed from current upstream sources on 2026-10-06 using Skills CLI 1.7.0.
The project manifest `skills-lock.json` records sources and content hashes.
Skills are project-local; they are not npm application dependencies.

## Sources

| Skill | Source |
| --- | --- |
| `nuxt` | [Nuxt Skill Hub](https://nuxt-skill.onmax.me/) |
| `ai-sdk` | [Vercel AI SDK](https://github.com/vercel/ai/tree/main/skills/use-ai-sdk) |
| `neon` | [Neon](https://github.com/neondatabase/agent-skills/tree/main/skills/neon) |
| `neon-postgres` | [Neon Postgres](https://github.com/neondatabase/agent-skills/tree/main/skills/neon-postgres) |
| `frontend-design` | [Anthropic frontend design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) |
| `web-design-guidelines` | [Vercel Web Interface Guidelines](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines) |
| `mcp-builder` | [Anthropic MCP Builder](https://github.com/anthropics/skills/tree/main/skills/mcp-builder) |
| `deploy-to-vercel` | [Vercel deployment](https://github.com/vercel-labs/agent-skills/tree/main/skills/deploy-to-vercel) |

## Maintenance

Run these commands from the repository root. Installation and updates require
network access.

List the project's skills:

```bash
npm run skills:list
```

Update all project skills from their sources:

```bash
npm run skills:update
```

Update one skill:

```bash
npm run skills:update -- ai-sdk
```

The update script reads `skills-lock.json` and reinstalls explicit selections
from each recorded source for Codex and Claude Code. This also restores missing
local copies and Claude links. It avoids a Skills CLI 1.7.0 update issue where
upstream symlinks produce ambiguous matches for AI SDK and Neon.

Review and commit the changed skill files and `skills-lock.json` together.
Newly installed or updated skills are available to Codex on the next turn.

The equivalent source installation commands are:

```bash
npx --yes skills@1.7.0 add https://nuxt-skill.onmax.me/ --skill nuxt --agent codex claude-code --yes
npx --yes skills@1.7.0 add neondatabase/agent-skills --skill neon neon-postgres --agent codex claude-code --yes
npx --yes skills@1.7.0 add anthropics/skills --skill frontend-design mcp-builder --agent codex claude-code --yes
npx --yes skills@1.7.0 add vercel/ai --skill ai-sdk --agent codex claude-code --yes
npx --yes skills@1.7.0 add vercel-labs/agent-skills --skill web-design-guidelines deploy-to-vercel --agent codex claude-code --yes
```

These commands fetch current upstream content. Keep the installed copies in
version control so an ordinary clone has the reviewed versions immediately.
