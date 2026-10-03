<template>
  <div class="site-shell">
    <AppNav />

    <main class="mcp-page">
      <section class="mcp-hero">
        <NuxtLink class="mcp-page__back" to="/#interests">&larr; profile</NuxtLink>
        <p class="mcp-page__kicker">Public read-only MCP server</p>
        <h1>Connect your AI to my CV.</h1>
        <p class="mcp-hero__intro">
          Connect this endpoint to Cursor, Codex, Claude Code, ChatGPT, or any streamable HTTP MCP client.
          Recruiters can ask an AI client about my experience, AI work, projects, stack, contact details, and CV files.
        </p>

        <div class="mcp-endpoint" aria-label="MCP server endpoint">
          <span>{{ mcpEndpoint }}</span>
          <button type="button" @click="copyText('endpoint', mcpEndpoint)">
            {{ copied === 'endpoint' ? 'Copied' : 'Copy' }}
          </button>
        </div>
        <p v-if="copyError === 'endpoint'" class="mcp-copy-error" role="alert">{{ copyErrorMessage }}</p>
        <p class="mcp-connection-note">Public, read-only access. No account, API key, or sign-in required. Choose “No authentication” if your client asks.</p>
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
          <p class="mcp-connection-note">Open the link on a computer with the selected app installed, then confirm the connection in that app. Or run this command to choose a client:</p>

          <div class="mcp-code-row">
            <pre><code>{{ addMcpCommand }}</code></pre>
            <button type="button" @click="copyText('add-mcp', addMcpCommand)">
              {{ copied === 'add-mcp' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p v-if="copyError === 'add-mcp'" class="mcp-copy-error" role="alert">{{ copyErrorMessage }}</p>
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
              <p v-if="copyError === client.id" class="mcp-copy-error" role="alert">{{ copyErrorMessage }}</p>
              <p>{{ client.note }}</p>
              <a v-if="client.guide" :href="client.guide" target="_blank" rel="noopener noreferrer" class="mcp-client__guide">Current setup guide ↗</a>
            </article>
          </div>
          <div class="mcp-test-prompt">
            <h3>Check the connection.</h3>
            <p>Start a new chat with this connection enabled, then send:</p>
            <div class="mcp-code-row">
              <pre><code>{{ testPrompt }}</code></pre>
              <button type="button" @click="copyText('test-prompt', testPrompt)">
                {{ copied === 'test-prompt' ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <p v-if="copyError === 'test-prompt'" class="mcp-copy-error" role="alert">{{ copyErrorMessage }}</p>
            <p>Your AI should call <code>get_profile_context</code> and return my experience plus CV download links. If the tools are missing, refresh the connection in your client and start a new chat.</p>
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
            <a v-for="download in cvDownloads" :key="download.href" :href="download.href" class="mcp-cv__link" download>
              <span>{{ download.label }}</span>
              <small>{{ download.description }}</small>
            </a>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { cvDownloads, mcpServer } from '~/data/mcpProfile'
import { normalizeSiteUrl } from '~/data/seo'

const runtimeConfig = useRuntimeConfig()
const copied = ref('')
const copyError = ref('')
const copyErrorMessage = 'Copy was blocked by your browser. Select the text above and copy it manually.'
let copyTimeout: ReturnType<typeof setTimeout> | undefined

const siteUrl = computed(() => normalizeSiteUrl(runtimeConfig.public.siteUrl))
const mcpEndpoint = computed(() => `${siteUrl.value}/mcp/server`)
const addMcpCommand = computed(() => `npx add-mcp ${mcpEndpoint.value}`)
const testPrompt = 'Use the Konrad Profile MCP connection to summarize Konrad’s experience and give me the links to his CV files.'

const clients = computed(() => [
  {
    id: 'codex',
    name: 'Codex',
    command: `codex mcp add konrad-profile --url ${mcpEndpoint.value}`,
    note: 'Run in your terminal with Codex CLI installed. Adds the connection to your Codex config; start a new Codex chat afterward.'
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    command: `claude mcp add --transport http --scope user konrad-profile ${mcpEndpoint.value}`,
    note: 'Run in your terminal with Claude Code installed. Adds the connection for your user across projects. Use /mcp in Claude Code to check its status.'
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
    note: 'Merge this into ~/.cursor/mcp.json when the one-click button is not available, keeping any existing servers.'
  },
  {
    id: 'vscode-json',
    name: 'VS Code JSON',
    command: JSON.stringify(
      {
        servers: {
          'konrad-profile': {
            type: 'http',
            url: mcpEndpoint.value
          }
        }
      },
      null,
      2
    ),
    note: 'Merge this into .vscode/mcp.json, keeping existing servers. Start the server from VS Code’s MCP controls and enable its tools in chat.'
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    command: mcpEndpoint.value,
    note: 'Enable Developer mode, add a custom MCP connection, and paste this URL with no authentication. Select the connection in a new chat. Availability depends on your account and workspace settings.',
    guide: 'https://developers.openai.com/plugins/deploy/connect-chatgpt'
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

const copyText = async (key: string, text: string) => {
  if (!import.meta.client) return

  copied.value = ''
  copyError.value = ''
  clearTimeout(copyTimeout)

  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
    await navigator.clipboard.writeText(text)
    copied.value = key
    copyTimeout = setTimeout(() => {
      copied.value = ''
    }, 1600)
  } catch {
    copyError.value = key
  }
}

onBeforeUnmount(() => clearTimeout(copyTimeout))

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
  font-size: clamp(3.2rem, 7vw, 6rem);
  font-weight: 600;
  letter-spacing: 0;
  line-height: 0.95;
  overflow-wrap: anywhere;
}

.mcp-hero__intro {
  max-width: 880px;
  margin: 36px 0 32px;
  color: var(--ink);
  font-size: 1.45rem;
  line-height: 1.35;
}

.mcp-connection-note,
.mcp-test-prompt > p {
  color: var(--dim);
  font-size: 0.9375rem;
  line-height: 1.55;
}

.mcp-copy-error,
.mcp-client .mcp-copy-error {
  color: var(--ink);
  font-size: 0.875rem;
  line-height: 1.5;
}

.mcp-client__guide {
  display: inline-block;
  margin-top: 12px;
  color: var(--ink);
  font-size: 0.875rem;
}

.mcp-test-prompt {
  margin-top: 36px;
}

.mcp-test-prompt h3 {
  margin: 0;
  font-family: var(--font-headline);
  font-size: 1.8rem;
  font-weight: 400;
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

  .mcp-hero__intro {
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
