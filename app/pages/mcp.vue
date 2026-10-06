<template>
  <div id="top" class="mcp-site">
    <a class="mcp-skip" href="#main">Skip to content</a>

    <header class="mcp-nav mcp-wrap">
      <NuxtLink class="mcp-brand" to="/" aria-label="koonrad.dev — home">
        <svg viewBox="0 0 28 28" width="25" height="25" fill="none" aria-hidden="true">
          <path d="M2 2h8v10L20 2h8L16 14l12 12h-9L10 17v9H2V2Z" fill="currentColor" />
        </svg>
        koonrad<span>.dev</span>
      </NuxtLink>
      <button ref="menuButton" class="mcp-menu" type="button" :aria-expanded="menuOpen" aria-controls="mcp-navigation" @click="menuOpen = !menuOpen">
        {{ menuOpen ? 'Close' : 'Menu' }} <HomeIcon :name="menuOpen ? 'x' : 'plus'" />
      </button>
      <nav id="mcp-navigation" class="mcp-nav__links" :class="{ 'is-open': menuOpen }" aria-label="Main navigation">
        <NuxtLink to="/#work" @click="menuOpen = false">Selected work</NuxtLink>
        <NuxtLink to="/#track" @click="menuOpen = false">About</NuxtLink>
        <NuxtLink to="/#contact" @click="menuOpen = false">Get in touch <HomeIcon name="arrow-up-right" :size="18" /></NuxtLink>
        <NuxtLink class="mcp-nav__cv" to="/cv">CV <HomeIcon name="arrow-up-right" :size="18" /></NuxtLink>
      </nav>
    </header>

    <main id="main" class="mcp-wrap">
      <section class="mcp-hero" aria-labelledby="mcp-title">
        <div class="mcp-hero__body">
          <p class="mcp-kicker">Konrad Straszewski <span>—</span> Public MCP</p>
          <h1 id="mcp-title">Connect<br>your AI.<br><span>Meet my CV.</span></h1>
          <p class="mcp-hero__intro">
            Give your AI the context to get to know me. Experience, projects, stack, and CV files — ready for a conversation in your favourite MCP client.
          </p>
          <div class="mcp-hero__actions">
            <a class="mcp-button" href="#connect">Connect your client <HomeIcon name="arrow-down-right" :size="22" /></a>
            <a class="mcp-text-link" href="#downloads">Download CV <HomeIcon name="download" /></a>
          </div>
        </div>

        <aside class="mcp-poster" aria-label="Public MCP connection and server endpoint">
          <div class="mcp-poster__top"><span>A LITTLE CONTEXT GOES A LONG WAY</span><HomeIcon name="arrow-up-right" :size="23" /></div>
          <div class="mcp-diagram" aria-hidden="true">
            <div class="mcp-diagram__client"><span>YOUR AI CLIENT</span><span class="mcp-diagram__spark">✳</span></div>
            <div class="mcp-diagram__bridge"><span /> MCP <span /></div>
            <div class="mcp-diagram__profile">
              <span class="mcp-diagram__initials">KS<span>↗</span></span>
              <div><strong>Konrad Straszewski</strong><span>Experience. Projects. Perspective.</span></div>
              <div class="mcp-diagram__tags"><span>PROFILE</span><span>TOOLS</span><span>CV</span></div>
            </div>
          </div>
          <p class="mcp-poster__headline">Real context.<br>Better questions.</p>
          <div class="mcp-poster__endpoint">
            <span class="mcp-kicker">Streamable HTTP endpoint</span>
            <div class="mcp-endpoint">
              <code>{{ mcpEndpoint }}</code>
              <button type="button" :aria-label="copied === 'endpoint' ? 'Endpoint copied' : 'Copy MCP endpoint'" @click="copyText('endpoint', mcpEndpoint)">{{ copied === 'endpoint' ? 'Copied' : 'Copy' }} <HomeIcon name="arrow-up-right" :size="16" /></button>
            </div>
            <p v-if="copyError === 'endpoint'" class="mcp-copy-error" role="alert">{{ copyErrorMessage }}</p>
          </div>
          <div class="mcp-poster__foot"><span><i aria-hidden="true" /> PUBLIC · READ-ONLY</span><span>NO API KEY NEEDED</span></div>
        </aside>

        <div class="mcp-hero__foot">
          <span>Cursor · Codex · Claude Code · VS Code · ChatGPT</span>
          <NuxtLink class="mcp-text-link" to="/#interests">Back to my profile <HomeIcon name="arrow-up-right" :size="16" /></NuxtLink>
        </div>
      </section>

      <section id="connect" class="mcp-section mcp-install" aria-labelledby="install-title">
        <div class="mcp-section__intro">
          <p class="mcp-kicker">01 / Get connected</p>
          <h2 id="install-title">One click.<br><mark>All the context.</mark></h2>
          <p>Public, read-only access. No account, API key, or sign-in required. Choose “No authentication” if your client asks.</p>
        </div>
        <div class="mcp-section__content">
          <h3>Install in your client.</h3>
          <p class="mcp-note">Open a link on a computer with the selected app installed, then confirm the connection in that app.</p>
          <div class="mcp-install__buttons">
            <InstallButton :url="mcpEndpoint" label="Add to Cursor" />
            <InstallButton :url="mcpEndpoint" ide="vscode" label="Add to VS Code" />
          </div>
          <p class="mcp-note">Or run this command to choose a client:</p>
          <div class="mcp-code-row">
            <pre><code>{{ addMcpCommand }}</code></pre>
            <button class="mcp-copy" type="button" :aria-label="copied === 'add-mcp' ? 'Install command copied' : 'Copy install command'" @click="copyText('add-mcp', addMcpCommand)">{{ copied === 'add-mcp' ? 'Copied' : 'Copy' }}</button>
          </div>
          <p v-if="copyError === 'add-mcp'" class="mcp-copy-error" role="alert">{{ copyErrorMessage }}</p>
        </div>
      </section>

      <section class="mcp-section mcp-manual" aria-labelledby="manual-title">
        <div class="mcp-section__intro">
          <p class="mcp-kicker">02 / Manual setup</p>
          <h2 id="manual-title">Your client.<br>Your way.</h2>
          <p>Prefer the terminal or a config file? Pick your client and copy the setup below.</p>
        </div>
        <div class="mcp-section__content">
          <div class="mcp-client-list">
            <details v-for="(client, index) in clients" :key="client.id" class="mcp-client" :open="client.id === 'codex'">
              <summary>
                <span class="mcp-client__index">0{{ index + 1 }}</span>
                <h3>{{ client.name }}</h3>
                <span class="mcp-client__format">{{ client.id.includes('json') ? 'JSON' : client.id === 'chatgpt' ? 'URL' : 'CLI' }}</span>
                <span class="mcp-expand" aria-hidden="true" />
              </summary>
              <div class="mcp-client__body">
                <div class="mcp-code-row">
                  <pre><code>{{ client.command }}</code></pre>
                  <button class="mcp-copy" type="button" :aria-label="copied === client.id ? `${client.name} config copied` : `Copy ${client.name} config`" @click="copyText(client.id, client.command)">{{ copied === client.id ? 'Copied' : 'Copy' }}</button>
                </div>
                <p v-if="copyError === client.id" class="mcp-copy-error" role="alert">{{ copyErrorMessage }}</p>
                <p class="mcp-note">{{ client.note }}</p>
                <a v-if="client.guide" :href="client.guide" target="_blank" rel="noopener noreferrer" class="mcp-text-link">Current setup guide <HomeIcon name="arrow-up-right" :size="16" /></a>
              </div>
            </details>
          </div>
          <div class="mcp-test-prompt">
            <p class="mcp-kicker">Connected? Try this.</p>
            <h3>Start a conversation.</h3>
            <p class="mcp-note">Start a new chat with this connection enabled, then send:</p>
            <div class="mcp-code-row">
              <pre><code>{{ testPrompt }}</code></pre>
              <button class="mcp-copy" type="button" :aria-label="copied === 'test-prompt' ? 'Test prompt copied' : 'Copy test prompt'" @click="copyText('test-prompt', testPrompt)">{{ copied === 'test-prompt' ? 'Copied' : 'Copy' }}</button>
            </div>
            <p v-if="copyError === 'test-prompt'" class="mcp-copy-error" role="alert">{{ copyErrorMessage }}</p>
            <p class="mcp-note">Your AI should call <code>get_profile_context</code> and return my experience plus CV download links. If the tools are missing, refresh the connection in your client and start a new chat.</p>
          </div>
        </div>
      </section>

      <section class="mcp-section mcp-tools" aria-labelledby="tools-title">
        <div class="mcp-section__intro">
          <p class="mcp-kicker">03 / Under the hood</p>
          <h2 id="tools-title">More than<br>a PDF.</h2>
          <p>Structured profile context, searchable documents, and an interactive CV for hosts that support MCP Apps.</p>
        </div>
        <div class="mcp-tool-list">
          <article v-for="tool in tools" :key="tool.name" class="mcp-tool">
            <span class="mcp-kicker">{{ tool.kind }}</span>
            <h3>{{ tool.name }} <HomeIcon name="arrow-up-right" :size="18" /></h3>
            <p class="mcp-note">{{ tool.description }}</p>
          </article>
        </div>
      </section>

      <section id="downloads" class="mcp-section mcp-cv" aria-labelledby="cv-title">
        <div class="mcp-section__intro">
          <p class="mcp-kicker">04 / Take it with you</p>
          <h2 id="cv-title">Still like<br><mark>a good PDF?</mark></h2>
          <p>The CV files are here too. Pick the version that fits.</p>
        </div>
        <div class="mcp-cv__grid">
          <a v-for="download in cvDownloads" :key="download.href" :href="download.href" class="mcp-cv__link" download>
            <span class="mcp-cv__body"><strong>{{ download.label }}</strong><small>{{ download.description }}</small></span>
            <HomeIcon name="download" :size="22" />
          </a>
        </div>
      </section>
    </main>

    <footer class="mcp-footer mcp-wrap">
      <span>© Konrad Straszewski · 2026</span>
      <NuxtLink class="mcp-text-link" to="/#contact">Let’s talk <HomeIcon name="arrow-up-right" :size="18" /></NuxtLink>
      <a class="mcp-text-link" href="#top">Back to top <HomeIcon name="arrow-up" :size="18" /></a>
    </footer>
    <span class="mcp-sr-only" role="status" aria-live="polite">{{ copied ? 'Copied to clipboard.' : '' }}</span>
  </div>
</template>

<script setup lang="ts">
import { cvDownloads, mcpServer } from '~/data/mcpProfile'
import { normalizeSiteUrl } from '~/data/seo'

const runtimeConfig = useRuntimeConfig()
const menuOpen = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)
const closeMenu = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && menuOpen.value) {
    menuOpen.value = false
    menuButton.value?.focus()
  }
}

onMounted(() => window.addEventListener('keydown', closeMenu))
onBeforeUnmount(() => window.removeEventListener('keydown', closeMenu))
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
useHead({ meta: [{ name: 'theme-color', content: '#f4f5f6' }] })
</script>

<style scoped>
.mcp-site {
  --mcp-ink: #17191b;
  --mcp-muted: #666b75;
  --mcp-line: #d8dbdf;
  --mcp-blue: #2949ed;
  --mcp-lime: #deef78;
  --mcp-paper: #f4f5f6;
  --mcp-ease: cubic-bezier(.22, 1, .36, 1);
  min-height: 100vh;
  background: var(--mcp-paper);
  color: var(--mcp-ink);
  font-family: 'Inter Tight', Arial, sans-serif;
}
.mcp-site :deep(::selection) { background: var(--mcp-lime); color: var(--mcp-ink); }
.mcp-site :deep(a:focus-visible), .mcp-site :deep(button:focus-visible), .mcp-site :deep(summary:focus-visible) { outline: 2px solid var(--mcp-blue); outline-offset: 5px; }
.mcp-site [id] { scroll-margin-top: 32px; }
.mcp-wrap { width: calc(100% - 96px); max-width: 1200px; margin-inline: auto; }
.mcp-skip { position: fixed; z-index: 100; top: 12px; left: 12px; padding: 16px; background: var(--mcp-ink); color: white; transform: translateY(-150%); }
.mcp-skip:focus { transform: translateY(0); }
.mcp-sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

/* The same wordmark, spacing, and navigation as the homepage. */
.mcp-nav { display: flex; justify-content: space-between; align-items: center; min-height: 100px; border-bottom: 1px solid var(--mcp-line); }
.mcp-brand { display: inline-flex; align-items: center; gap: 9px; font-size: 23px; font-weight: 600; letter-spacing: -1px; text-decoration: none; }
.mcp-brand svg { margin-right: 4px; color: var(--mcp-blue); transition: transform 200ms var(--mcp-ease); }
.mcp-brand > span { margin-left: -8px; color: var(--mcp-muted); font-weight: 400; }
.mcp-nav__links { display: flex; align-items: center; gap: 34px; font-size: 14px; }
.mcp-nav__links a { position: relative; display: inline-flex; align-items: center; gap: 12px; min-height: 44px; text-decoration: none; }
.mcp-nav__links a::after { position: absolute; left: 0; right: 0; bottom: 10px; height: 1px; background: currentColor; content: ''; transform: scaleX(0); transform-origin: right; transition: transform 200ms var(--mcp-ease); }
.mcp-nav__links a:hover { color: var(--mcp-blue); }
.mcp-nav__cv { border-left: 1px solid var(--mcp-line); padding-left: 28px; }
.mcp-nav__links .mcp-nav__cv::after { left: 28px; }
.mcp-menu { display: none; }
.mcp-kicker { margin: 0; font-size: 11px; font-weight: 500; line-height: 1.7; letter-spacing: 1.1px; text-transform: uppercase; }
.mcp-kicker > span { margin-inline: 6px; color: var(--mcp-muted); }

.mcp-hero { display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr); align-items: center; column-gap: 64px; padding-top: 58px; }
.mcp-hero h1 { margin: 24px 0 25px -5px; font-size: clamp(68px, 7.25vw, 102px); line-height: .96; letter-spacing: -.065em; font-weight: 600; }
.mcp-hero h1 > span { color: var(--mcp-blue); }
.mcp-hero__intro { max-width: 440px; margin: 0; font-size: 18px; line-height: 1.6; color: var(--mcp-muted); text-wrap: pretty; }
.mcp-hero__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 30px; margin-top: 30px; }
.mcp-button { display: inline-flex; align-items: center; justify-content: space-between; gap: 42px; min-height: 48px; padding: 0 20px; background: var(--mcp-ink); color: white; font-size: 14px; text-decoration: none; transition: background 180ms var(--mcp-ease); }
.mcp-text-link { display: inline-flex; align-items: center; gap: 16px; width: fit-content; min-height: 44px; font-size: 14px; font-weight: 500; text-decoration: none; }
.mcp-text-link:hover { color: var(--mcp-blue); }
.mcp-text-link svg, .mcp-button svg { transition: transform 180ms var(--mcp-ease); }

.mcp-poster { position: relative; isolation: isolate; display: flex; flex-direction: column; align-self: stretch; justify-content: space-between; min-width: 0; padding: 25px 28px 20px; overflow: hidden; background: var(--mcp-blue); color: white; }
.mcp-poster::before { position: absolute; inset: 0; z-index: -1; content: ''; background-image: linear-gradient(rgb(255 255 255 / .09) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / .09) 1px, transparent 1px); background-size: 28px 28px; mask-image: radial-gradient(ellipse at 50% 38%, #000 10%, transparent 80%); }
.mcp-poster__top, .mcp-poster__foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 9px; font-weight: 500; letter-spacing: 1.1px; }
.mcp-diagram { width: 86%; margin: 28px auto 25px; }
.mcp-diagram__client { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px; border: 1px solid rgb(255 255 255 / .6); background: rgb(255 255 255 / .06); font-size: 11px; letter-spacing: 1px; }
.mcp-diagram__spark { color: var(--mcp-lime); font-size: 24px; line-height: 1; }
.mcp-diagram__bridge { display: flex; flex-direction: column; align-items: center; gap: 5px; padding-block: 5px; font-size: 9px; letter-spacing: 1.4px; }
.mcp-diagram__bridge > span { width: 1px; height: 17px; background: rgb(255 255 255 / .65); }
.mcp-diagram__profile { display: grid; grid-template-columns: 38px minmax(0, 1fr); gap: 13px; padding: 18px; color: var(--mcp-ink); background: var(--mcp-lime); box-shadow: 8px 8px 0 rgb(14 28 122 / .25); }
.mcp-diagram__initials { display: flex; align-items: center; justify-content: center; position: relative; width: 38px; height: 42px; border: 1px solid currentColor; font-size: 17px; font-weight: 600; letter-spacing: -1px; }
.mcp-diagram__initials > span { position: absolute; top: -6px; right: -4px; padding-left: 2px; background: var(--mcp-lime); font-size: 15px; }
.mcp-diagram__profile strong { display: block; margin-top: 3px; font-size: 15px; font-weight: 600; letter-spacing: -.3px; }
.mcp-diagram__profile div > span { display: block; margin-top: 5px; font-size: 10px; line-height: 1.4; }
.mcp-diagram__profile .mcp-diagram__tags { grid-column: 1 / -1; display: flex; gap: 8px; padding-top: 10px; border-top: 1px solid rgb(23 25 27 / .25); }
.mcp-diagram__tags > span { padding: 4px 7px; border: 1px solid rgb(23 25 27 / .25); font-size: 8px !important; letter-spacing: 1px; }
.mcp-poster__headline { margin: 0 0 23px; font-size: clamp(28px, 3.1vw, 42px); font-weight: 500; line-height: 1.05; letter-spacing: -1.5px; }
.mcp-poster__endpoint { padding-top: 16px; border-top: 1px solid #ffffff55; }
.mcp-poster__endpoint > .mcp-kicker { font-size: 8px; letter-spacing: 1px; }
.mcp-endpoint { display: flex; align-items: center; gap: 10px; margin-top: 9px; }
.mcp-endpoint code { flex: 1; min-width: 0; font-family: var(--font-mono); font-size: 10px; line-height: 1.65; overflow-wrap: anywhere; }
.mcp-endpoint button { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-width: 69px; min-height: 44px; padding: 8px 10px; border: 0; background: var(--mcp-lime); color: var(--mcp-ink); font-size: 12px; font-weight: 500; cursor: pointer; }
.mcp-poster__foot { margin-top: 20px; font-size: 8px; letter-spacing: .7px; }
.mcp-poster__foot > span:first-child { display: flex; align-items: center; gap: 7px; }
.mcp-poster__foot i { width: 5px; height: 5px; border-radius: 50%; background: var(--mcp-lime); }
.mcp-poster :deep(button:focus-visible) { outline-color: var(--mcp-lime); }
.mcp-hero__foot { grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 24px 0; margin-top: 16px; border-bottom: 1px solid var(--mcp-line); color: var(--mcp-muted); font-size: 12px; }
.mcp-hero__foot .mcp-text-link { font-size: 12px; }

.mcp-section { display: grid; grid-template-columns: minmax(0, .75fr) minmax(0, 1.5fr); gap: 80px; padding-block: 64px; border-bottom: 1px solid var(--mcp-line); }
.mcp-section__intro .mcp-kicker { color: var(--mcp-muted); }
.mcp-section h2 { margin: 15px 0 20px; font-size: clamp(32px, 3.5vw, 45px); line-height: 1.12; letter-spacing: -1.9px; font-weight: 500; }
.mcp-section h2 mark { padding: 0 .06em; margin: 0 -.06em; color: inherit; background: linear-gradient(transparent 60%, var(--mcp-lime) 60%, var(--mcp-lime) 92%, transparent 92%); box-decoration-break: clone; -webkit-box-decoration-break: clone; }
.mcp-section__intro > p:last-child, .mcp-note { margin: 14px 0 0; color: var(--mcp-muted); font-size: 15px; line-height: 1.65; text-wrap: pretty; }
.mcp-section__intro > p:last-child { max-width: 295px; }
.mcp-section h3 { margin: 0; font-size: 24px; line-height: 1.2; letter-spacing: -.6px; font-weight: 500; }
.mcp-section__content { min-width: 0; }
.mcp-install .mcp-section__content { padding-top: 5px; }
.mcp-install__buttons { display: flex; flex-wrap: wrap; gap: 12px; margin: 24px 0; }
.mcp-install__buttons :deep(.mcp-install-button) { justify-content: center; gap: 12px; min-height: 48px; padding: 12px 20px; border: 1px solid var(--mcp-ink); background: var(--mcp-ink); color: white; font-family: inherit; font-size: 14px; transition: background 180ms var(--mcp-ease), border-color 180ms var(--mcp-ease); }
.mcp-install__buttons :deep(.mcp-install-button:hover) { background: var(--mcp-blue); border-color: var(--mcp-blue); }
.mcp-code-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; min-width: 0; padding: 16px; margin-top: 14px; border: 1px solid var(--mcp-line); background: #e9ebee; }
.mcp-code-row pre { align-self: center; flex: 1; min-width: 0; margin: 0; overflow-x: auto; font-family: var(--font-mono); font-size: 12px; line-height: 1.7; white-space: pre-wrap; overflow-wrap: anywhere; }
.mcp-copy { flex: 0 0 auto; min-width: 63px; min-height: 44px; padding: 8px 12px; border: 1px solid var(--mcp-line); border-radius: 0; background: var(--mcp-paper); color: var(--mcp-ink); font-size: 12px; font-weight: 500; cursor: pointer; transition: background 180ms var(--mcp-ease), color 180ms var(--mcp-ease); }
.mcp-copy:hover { background: var(--mcp-ink); border-color: var(--mcp-ink); color: white; }
.mcp-copy-error { margin: 12px 0 0; font-size: 13px; line-height: 1.5; }
.mcp-note code { font-family: var(--font-mono); font-size: .8em; overflow-wrap: anywhere; }

.mcp-client-list { border-top: 1px solid var(--mcp-ink); }
.mcp-client { border-bottom: 1px solid var(--mcp-line); }
.mcp-client summary { display: grid; grid-template-columns: 28px minmax(0, 1fr) 40px 12px; align-items: center; gap: 18px; min-height: 76px; padding-block: 17px; list-style: none; cursor: pointer; }
.mcp-client summary::-webkit-details-marker { display: none; }
.mcp-client summary::marker { content: ''; }
.mcp-client__index, .mcp-client__format { color: var(--mcp-muted); font-size: 11px; font-variant-numeric: tabular-nums; }
.mcp-client__format { text-align: right; letter-spacing: .6px; }
.mcp-client summary h3 { font-size: 20px; letter-spacing: -.4px; }
.mcp-expand { position: relative; width: 12px; height: 12px; }
.mcp-expand::before, .mcp-expand::after { position: absolute; top: 5px; width: 12px; height: 1px; background: currentColor; content: ''; }
.mcp-expand::after { transform: rotate(90deg); transition: transform 180ms var(--mcp-ease); }
.mcp-client[open] .mcp-expand::after { transform: rotate(0); }
.mcp-client[open] summary { color: var(--mcp-blue); }
.mcp-client__body { padding: 0 0 24px 46px; }
.mcp-client__body .mcp-code-row { margin-top: 0; }
.mcp-client__body .mcp-note { font-size: 14px; }
.mcp-client__body .mcp-text-link { margin-top: 10px; font-size: 13px; }
.mcp-test-prompt { margin-top: 36px; padding: 26px; background: #e8ebfa; }
.mcp-test-prompt > .mcp-kicker { margin-bottom: 12px; color: var(--mcp-blue); }
.mcp-test-prompt .mcp-code-row { background: var(--mcp-paper); border-color: #cdd3e9; }
.mcp-test-prompt .mcp-note { font-size: 14px; }

.mcp-tool-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; }
.mcp-tool { min-width: 0; padding-top: 18px; border-top: 1px solid var(--mcp-ink); }
.mcp-tool > .mcp-kicker { color: var(--mcp-blue); font-size: 10px; }
.mcp-tool h3 { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-top: 12px; font-family: var(--font-mono); font-size: clamp(13px, 1.3vw, 17px); letter-spacing: -.5px; overflow-wrap: anywhere; }
.mcp-tool h3 svg { color: var(--mcp-blue); }
.mcp-tool .mcp-note { font-size: 14px; }
.mcp-cv__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-content: start; gap: 0 28px; }
.mcp-cv__link { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-width: 0; padding-block: 21px; border-top: 1px solid var(--mcp-line); text-decoration: none; }
.mcp-cv__link strong { display: block; font-size: 17px; font-weight: 500; line-height: 1.35; letter-spacing: -.3px; }
.mcp-cv__link small { display: block; margin-top: 7px; color: var(--mcp-muted); font-size: 13px; line-height: 1.5; }
.mcp-cv__link svg { color: var(--mcp-blue); transition: transform 180ms var(--mcp-ease); }
.mcp-cv__link:hover strong { color: var(--mcp-blue); }
.mcp-footer { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding-block: 22px; color: var(--mcp-muted); font-size: 12px; }
.mcp-footer .mcp-text-link { font-size: 12px; }

@media (hover: hover) and (pointer: fine) {
  .mcp-brand:hover svg { transform: rotate(-8deg); }
  .mcp-nav__links a:hover::after { transform: scaleX(1); transform-origin: left; }
  .mcp-button:hover { background: var(--mcp-blue); }
  .mcp-button:hover svg { transform: translate(2px, 2px); }
  .mcp-text-link:hover svg { transform: translate(2px, -2px); }
  .mcp-cv__link:hover svg { transform: translateY(2px); }
}
@media (max-width: 1000px) {
  .mcp-wrap { width: calc(100% - 64px); }
  .mcp-hero { column-gap: 32px; }
  .mcp-hero h1 { font-size: clamp(60px, 7.6vw, 78px); }
  .mcp-hero .mcp-kicker { font-size: 9px; letter-spacing: .7px; }
  .mcp-poster { padding: 22px; }
  .mcp-diagram { width: 100%; }
  .mcp-section { gap: 40px; }
}
@media (max-width: 760px) {
  .mcp-wrap { width: calc(100% - 40px); }
  .mcp-nav { min-height: 80px; flex-wrap: wrap; }
  .mcp-menu { display: flex; align-items: center; gap: 18px; min-height: 44px; padding: 0 4px 0 12px; border: 0; background: none; color: var(--mcp-ink); font-size: 14px; cursor: pointer; }
  .mcp-nav__links { display: none; width: 100%; padding: 6px 0 20px; gap: 0; }
  .mcp-nav__links.is-open { display: grid; grid-template-columns: 1fr 1fr; }
  .mcp-nav__links a { min-height: 48px; }
  .mcp-nav__links a::after { display: none; }
  .mcp-nav__cv { border: 0; padding: 0; }
  .mcp-hero { grid-template-columns: 1fr; padding-top: 39px; gap: 0; }
  .mcp-hero h1 { font-size: clamp(63px, 12vw, 90px); margin-left: -3px; }
  .mcp-hero__intro { font-size: 17px; }
  .mcp-hero__actions { margin-top: 25px; gap: 12px 25px; }
  .mcp-poster { margin-top: 35px; padding: 24px; }
  .mcp-diagram { width: 80%; max-width: 350px; margin-block: 30px; }
  .mcp-poster__headline { font-size: 36px; }
  .mcp-poster__endpoint > .mcp-kicker { font-size: 8px; }
  .mcp-endpoint code { font-size: 12px; }
  .mcp-hero__foot { flex-wrap: wrap; gap: 6px; margin-top: 0; padding-block: 16px; font-size: 11px; }
  .mcp-section { grid-template-columns: 1fr; gap: 28px; padding-block: 44px; }
  .mcp-section h2 { font-size: 36px; letter-spacing: -1.4px; }
  .mcp-section__intro > p:last-child { max-width: 440px; }
  .mcp-client__body { padding-left: 0; }
  .mcp-footer { flex-wrap: wrap; gap: 0 18px; }
  .mcp-footer > span { flex-basis: 100%; padding-bottom: 6px; }
  .mcp-footer > a:last-child { margin-left: auto; }
}
@media (max-width: 560px) {
  .mcp-hero__actions .mcp-button { flex-basis: 100%; }
  .mcp-code-row { flex-direction: column; gap: 12px; }
  .mcp-code-row pre { align-self: stretch; }
  .mcp-copy { align-self: flex-end; }
  .mcp-tool-list, .mcp-cv__grid { grid-template-columns: 1fr; }
  .mcp-tool-list { gap: 24px; }
  .mcp-tool h3 { font-size: 17px; }
  .mcp-test-prompt { padding: 20px; }
}
@media (max-width: 370px) {
  .mcp-hero h1 { font-size: 57px; }
  .mcp-poster { padding-inline: 20px; }
  .mcp-diagram { width: 100%; }
  .mcp-endpoint { flex-wrap: wrap; }
  .mcp-endpoint code { flex-basis: 100%; }
  .mcp-endpoint button { margin-left: auto; }
  .mcp-client summary { gap: 12px; }
}
@media (prefers-reduced-motion: reduce) {
  .mcp-site :deep(*), .mcp-site :deep(*::before), .mcp-site :deep(*::after) { transition: none !important; }
}
</style>
