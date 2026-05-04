<template>
  <div class="site-shell">
    <AppNav />

    <main class="mcp-page">
      <section class="mcp-hero">
        <NuxtLink class="mcp-page__back" to="/#interests">&larr; profile</NuxtLink>
        <p class="mcp-page__kicker">Public read-only MCP server</p>
        <h1>Talk to my CV.</h1>
        <p>
          Connect this endpoint to Cursor, Codex, Claude Code, ChatGPT, or any streamable HTTP MCP client.
          Recruiters can ask an AI client about my experience, AI work, projects, stack, contact details, and CV files.
        </p>

        <div class="mcp-endpoint" aria-label="MCP server endpoint">
          <span>{{ mcpEndpoint }}</span>
          <button type="button" @click="copyText('endpoint', mcpEndpoint)">
            {{ copied === 'endpoint' ? 'Copied' : 'Copy' }}
          </button>
        </div>
      </section>

      <section class="mcp-install" aria-labelledby="install-title">
        <div class="mcp-section-label">
          <span>01</span>
          <span>One-click</span>
        </div>

        <div>
          <h2 id="install-title">Install in an MCP client.</h2>
          <div class="mcp-install__buttons">
            <InstallButton :url="mcpEndpoint" label="Add to Cursor" />
            <InstallButton :url="mcpEndpoint" ide="vscode" label="Add to VS Code" />
          </div>

          <div class="mcp-code-row">
            <pre><code>{{ addMcpCommand }}</code></pre>
            <button type="button" @click="copyText('add-mcp', addMcpCommand)">
              {{ copied === 'add-mcp' ? 'Copied' : 'Copy' }}
            </button>
          </div>
        </div>
      </section>

      <section class="mcp-manual" aria-labelledby="manual-title">
        <div class="mcp-section-label">
          <span>02</span>
          <span>Manual setup</span>
        </div>

        <div>
          <h2 id="manual-title">Client configs.</h2>
          <div class="mcp-client-grid">
            <article v-for="client in clients" :key="client.name" class="mcp-client">
              <div class="mcp-client__header">
                <h3>{{ client.name }}</h3>
                <button type="button" @click="copyText(client.id, client.command)">
                  {{ copied === client.id ? 'Copied' : 'Copy' }}
                </button>
              </div>
              <pre><code>{{ client.command }}</code></pre>
              <p>{{ client.note }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="mcp-tools" aria-labelledby="tools-title">
        <div class="mcp-section-label">
          <span>03</span>
          <span>Tools + UI</span>
        </div>

        <div>
          <h2 id="tools-title">What the MCP exposes.</h2>
          <div class="mcp-tool-list">
            <article v-for="tool in tools" :key="tool.name" class="mcp-tool">
              <span>{{ tool.kind }}</span>
              <h3>{{ tool.name }}</h3>
              <p>{{ tool.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="mcp-cv" aria-labelledby="cv-title">
        <div class="mcp-section-label">
          <span>04</span>
          <span>CV files</span>
        </div>

        <div>
          <h2 id="cv-title">Download directly.</h2>
          <div class="mcp-cv__grid">
            <a v-for="download in cvDownloads" :key="download.url" :href="download.url" class="mcp-cv__link" download>
              <span>{{ download.label }}</span>
              <small>{{ download.description }}</small>
            </a>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { cvDownloads, mcpServer } from '~/data/mcpProfile'
import { normalizeSiteUrl } from '~/data/seo'

const runtimeConfig = useRuntimeConfig()
const copied = ref('')

const siteUrl = computed(() => normalizeSiteUrl(runtimeConfig.public.siteUrl))
const mcpEndpoint = computed(() => `${siteUrl.value}/mcp/server`)
const addMcpCommand = computed(() => `npx add-mcp ${mcpEndpoint.value}`)

const clients = computed(() => [
  {
    id: 'codex',
    name: 'Codex',
    command: `codex mcp add konrad-profile --url ${mcpEndpoint.value}`,
    note: 'Adds a streamable HTTP MCP server to the shared Codex CLI/app config.'
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    command: `claude mcp add --transport http konrad-profile ${mcpEndpoint.value}`,
    note: 'Adds this public read-only MCP server to Claude Code.'
  },
  {
    id: 'cursor-json',
    name: 'Cursor JSON',
    command: JSON.stringify(
      {
        mcpServers: {
          'konrad-profile': {
            url: mcpEndpoint.value
          }
        }
      },
      null,
      2
    ),
    note: 'Use this in ~/.cursor/mcp.json when the one-click button is not available.'
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    command: mcpEndpoint.value,
    note: 'Enable Developer mode, create a custom MCP app/connector, and paste this remote server URL.'
  }
])

const tools = [
  {
    kind: 'Tool',
    name: 'get_profile_context',
    description: "Structured context about my CV, experience, AI work, projects, stack, availability, and contact."
  },
  {
    kind: 'Tool',
    name: 'search',
    description: 'ChatGPT-compatible search endpoint returning citation-shaped profile results.'
  },
  {
    kind: 'Tool',
    name: 'fetch',
    description: 'ChatGPT-compatible document fetch endpoint for IDs returned by search.'
  },
  {
    kind: 'MCP App',
    name: mcpServer.appTool,
    description: 'Interactive CV UI with direct CV download buttons for MCP Apps-compatible hosts.'
  }
]

const copyText = async (key, text) => {
  if (!import.meta.client || !navigator?.clipboard) return

  await navigator.clipboard.writeText(text)
  copied.value = key
  window.setTimeout(() => {
    if (copied.value === key) copied.value = ''
  }, 1600)
}

useRouteSeo('/mcp')
</script>

<style scoped>
.mcp-page {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 72px 8vw 120px;
}

.mcp-hero {
  max-width: 1040px;
}

.mcp-page__back,
.mcp-page__kicker,
.mcp-section-label,
.mcp-tool span {
  color: var(--dim);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.mcp-page__back {
  display: inline-block;
  margin-bottom: 52px;
  text-decoration: none;
}

.mcp-page__kicker {
  margin: 0 0 18px;
}

.mcp-page h1 {
  margin: 0;
  color: var(--ink);
  font-family: var(--font-headline);
  font-size: 8rem;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 0.95;
  overflow-wrap: anywhere;
}

.mcp-hero > p:last-of-type {
  max-width: 880px;
  margin: 36px 0 32px;
  color: var(--ink);
  font-size: 1.45rem;
  line-height: 1.35;
}

.mcp-endpoint,
.mcp-code-row,
.mcp-client__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
}

.mcp-endpoint {
  max-width: 920px;
  border: 1px solid var(--ink);
  padding: 12px;
}

.mcp-endpoint span {
  overflow: hidden;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mcp-endpoint button,
.mcp-code-row button,
.mcp-client button {
  flex: 0 0 auto;
  border: 1px solid var(--ink);
  border-radius: 4px;
  background: var(--ink);
  color: var(--bg);
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 8px 14px;
}

.mcp-install,
.mcp-manual,
.mcp-tools,
.mcp-cv {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 64px;
  min-width: 0;
  padding-top: 88px;
}

.mcp-section-label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 8px;
}

.mcp-page h2 {
  max-width: 740px;
  margin: 0 0 28px;
  font-family: var(--font-headline);
  font-size: 3.25rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.05;
}

.mcp-install__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
}

.mcp-code-row {
  border: 1px solid var(--rule);
  padding: 12px;
}

.mcp-code-row pre,
.mcp-client pre {
  min-width: 0;
  margin: 0;
  overflow: auto;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.5;
  white-space: pre-wrap;
}

.mcp-client-grid,
.mcp-tool-list,
.mcp-cv__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  min-width: 0;
}

.mcp-client,
.mcp-tool,
.mcp-cv__link {
  min-width: 0;
  border-top: 1px solid var(--ink);
  padding-top: 18px;
}

.mcp-client h3,
.mcp-tool h3 {
  margin: 0;
  font-family: var(--font-headline);
  font-size: 1.8rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.1;
}

.mcp-client pre {
  margin-top: 16px;
  padding: 14px;
  background: var(--warm-panel);
}

.mcp-client p,
.mcp-tool p {
  margin: 14px 0 0;
  color: var(--dim);
  font-size: 0.9375rem;
  line-height: 1.55;
}

.mcp-tool span {
  display: block;
  margin-bottom: 14px;
  color: var(--accent);
}

.mcp-cv__link {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--ink);
  text-decoration: none;
}

.mcp-cv__link span {
  font-family: var(--font-headline);
  font-size: 1.8rem;
  line-height: 1.1;
}

.mcp-cv__link small {
  color: var(--dim);
  font-size: 0.9375rem;
  line-height: 1.45;
}

@media (max-width: 1060px) {
  .mcp-page h1 {
    font-size: 6.5rem;
  }

  .mcp-install,
  .mcp-manual,
  .mcp-tools,
  .mcp-cv {
    grid-template-columns: 140px minmax(0, 1fr);
    gap: 44px;
  }
}

@media (max-width: 820px) {
  .mcp-page {
    padding: 56px 6vw 96px;
  }

  .mcp-page h1 {
    font-size: 4.6rem;
  }

  .mcp-hero > p:last-of-type {
    font-size: 1.1875rem;
  }

  .mcp-install,
  .mcp-manual,
  .mcp-tools,
  .mcp-cv,
  .mcp-client-grid,
  .mcp-tool-list,
  .mcp-cv__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .mcp-page {
    padding: 44px 18px 72px;
  }

  .mcp-page h1 {
    font-size: 3.55rem;
  }

  .mcp-page h2 {
    font-size: 2.35rem;
  }

  .mcp-endpoint,
  .mcp-code-row,
  .mcp-client__header {
    align-items: stretch;
    flex-direction: column;
  }

  .mcp-endpoint span {
    width: 100%;
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .mcp-endpoint button,
  .mcp-code-row button,
  .mcp-client button {
    width: 100%;
  }
}
</style>
