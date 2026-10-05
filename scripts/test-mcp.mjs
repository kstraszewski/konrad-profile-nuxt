// Usage: node scripts/test-mcp.mjs [endpoint] [--local-downloads]
// By default PDF checks use the exact URLs returned by the server. The explicit
// --local-downloads flag checks those paths on the endpoint's origin instead.
import assert from 'node:assert/strict'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'

const endpoint = new URL(process.argv[2] || 'http://127.0.0.1:3000/mcp/server')
const localDownloads = process.argv.includes('--local-downloads')
const client = new Client({ name: 'konrad-profile-smoke-test', version: '1.0.0' })
const transport = new StreamableHTTPClientTransport(endpoint)
const failures = []
let passed = 0

async function check(name, run) {
  try {
    const detail = await run()
    passed++
    console.log(`PASS ${name}${detail ? ` — ${detail}` : ''}`)
  } catch (error) {
    failures.push(name)
    console.error(`FAIL ${name} — ${error.message}`)
  }
}

function textJson(result) {
  const text = result.content?.find(item => item.type === 'text')?.text
  assert.ok(text, 'Expected a JSON text content block')
  return JSON.parse(text)
}

async function call(name, args = {}) {
  return client.callTool({ name, arguments: args }, undefined, { timeout: 20_000 })
}

console.log(`MCP endpoint: ${endpoint}`)
console.log(`PDF URLs: ${localDownloads ? `same paths on ${endpoint.origin} (local override)` : 'exact advertised URLs'}`)

for (const ide of ['cursor', 'vscode']) {
  await check(`${ide} install link embeds the correct HTTP endpoint`, async () => {
    const response = await fetch(`${endpoint}/deeplink?ide=${ide}`, {
      redirect: 'manual',
      signal: AbortSignal.timeout(20_000)
    })
    assert.equal(response.status, 200)
    const html = await response.text()
    const href = html.match(/<a href="([^"]+)"/)?.[1]?.replaceAll('&amp;', '&')
    assert.ok(href, 'Missing install link')
    const link = new URL(href)
    assert.equal(link.protocol, `${ide}:`)
    const config = ide === 'cursor'
      ? JSON.parse(Buffer.from(link.searchParams.get('config'), 'base64').toString())
      : JSON.parse(decodeURIComponent(link.search.slice(1)))
    assert.equal(config.type, 'http')
    assert.equal(config.url, endpoint.href)
    return config.url
  })
}

try {
  await client.connect(transport, { timeout: 20_000 })
  console.log(`PASS initialize — ${client.getServerVersion()?.name}`)
  passed++

  await check('tools/list advertises all read-only tools', async () => {
    const { tools } = await client.listTools()
    for (const name of ['get_profile_context', 'search', 'fetch', 'konrad-cv']) {
      const tool = tools.find(item => item.name === name)
      assert.ok(tool, `Missing tool: ${name}`)
      assert.equal(tool.annotations?.readOnlyHint, true, `${name} is not declared read-only`)
    }
    const focus = tools.find(item => item.name === 'get_profile_context').inputSchema.properties?.focus
    assert.ok(focus?.enum?.includes('plane'), 'Plane focus is absent from the input schema')
    return tools.map(item => item.name).join(', ')
  })

  let full
  await check('get_profile_context full returns profile and CV downloads', async () => {
    const result = await call('get_profile_context', { focus: 'full' })
    assert.ok(!result.isError, JSON.stringify(result.content))
    full = result.structuredContent
    assert.equal(full?.query?.focus, 'full')
    assert.equal(full?.person?.name, 'Konrad Straszewski')
    assert.ok(full.sections.experience.roles.length > 0)
    assert.ok(full.sections.cv.downloads.length > 0)
    assert.deepEqual(textJson(result), full, 'Text and structured context must agree')
  })

  await check('get_profile_context plane preserves question and company context', async () => {
    const question = 'How does Konrad fit Plane?'
    const result = await call('get_profile_context', { focus: 'plane', question })
    assert.ok(!result.isError, JSON.stringify(result.content))
    const context = result.structuredContent
    assert.equal(context?.query?.question, question)
    assert.equal(context?.query?.focus, 'plane')
    assert.equal(context?.sections?.plane?.company?.id, 'plane')
    assert.ok(context.sections.cv.downloads.some(item => new URL(item.url).pathname === '/api/cv/plane.pdf'))
  })

  await check('search and fetch return the full Plane document', async () => {
    const search = await call('search', { query: 'Plane' })
    assert.ok(!search.isError)
    const plane = textJson(search).results.find(item => item.id === 'plane')
    assert.ok(plane, 'Plane search result is missing')
    const result = await call('fetch', { id: plane.id })
    assert.ok(!result.isError)
    const document = textJson(result)
    assert.equal(document.id, plane.id)
    assert.equal(document.url, plane.url)
    assert.ok(document.text.length >= plane.text.length)
    assert.equal(new URL(document.url).pathname, '/plane')
  })

  await check('search results are fetchable and cite absolute URLs', async () => {
    const search = textJson(await call('search', { query: 'AI product engineering CV' }))
    assert.ok(search.results.length > 0)
    for (const item of search.results) {
      assert.match(new URL(item.url).protocol, /^https?:$/)
      const result = await call('fetch', { id: item.id })
      assert.ok(!result.isError)
      const document = textJson(result)
      assert.equal(document.id, item.id)
      assert.equal(document.url, item.url)
      assert.ok(document.text)
    }
    return `${search.results.length} results`
  })

  await check('search with no matches returns an empty list', async () => {
    const result = await call('search', { query: 'zzzzunmatchableprofiletermzzzz' })
    assert.ok(!result.isError)
    assert.deepEqual(textJson(result).results, [])
  })

  await check('fetch invalid ID returns a useful tool error', async () => {
    const result = await call('fetch', { id: 'smoke-test-nonexistent-document' })
    assert.equal(result.isError, true)
    assert.match(textJson(result).error, /not found.*search/i)
  })

  await check('konrad-cv returns a usable MCP App and matching structured data', async () => {
    const result = await call('konrad-cv')
    assert.ok(!result.isError, JSON.stringify(result.content))
    assert.equal(result.structuredContent?.person?.name, 'Konrad Straszewski')
    const resource = result.content.find(item => item.type === 'resource')?.resource
    assert.equal(resource?.mimeType, 'text/html;profile=mcp-app')
    assert.equal(resource?.uri, result._meta?.ui?.resourceUri)
    assert.match(resource?.text || '', /__mcp_app_data__/)
    assert.match(resource?.text || '', /Download CV/)
    assert.ok((resource?.text.length || 0) > 1_000)
  })

  await check('resources/list and resources/read expose the CV UI', async () => {
    const { resources } = await client.listResources()
    const app = resources.find(item => item.uri === 'ui://mcp-app/konrad-cv')
    assert.ok(app, 'CV UI resource is missing')
    const result = await client.readResource({ uri: app.uri })
    assert.equal(result.contents[0]?.mimeType, 'text/html;profile=mcp-app')
    assert.match(result.contents[0]?.text || '', /Download CV/)
  })

  for (const download of full?.sections?.cv?.downloads || []) {
    const advertised = new URL(download.url)
    const url = localDownloads ? new URL(advertised.pathname + advertised.search, endpoint.origin) : advertised
    await check(`PDF ${download.label}`, async () => {
      const response = await fetch(url, { signal: AbortSignal.timeout(20_000) })
      assert.equal(response.status, 200, `${url} returned HTTP ${response.status}`)
      assert.match(response.headers.get('content-type') || '', /application\/pdf/i)
      const disposition = response.headers.get('content-disposition') || ''
      assert.match(disposition, /^attachment; filename="Konrad Straszewski CV\.pdf"$/, 'CV download filename is incorrect')
      const bytes = Buffer.from(await response.arrayBuffer())
      assert.equal(bytes.subarray(0, 5).toString(), '%PDF-', 'Response is not a PDF file')
      assert.ok(bytes.length > 1_000, 'PDF is unexpectedly small')
      if (advertised.pathname === '/api/cv/plane.pdf') {
        // The project's PDF generator writes uncompressed text operations.
        assert.match(bytes.toString('latin1'), /\bPlane\b/i, 'Plane CV content is missing')
      }
      return `${bytes.length} bytes, ${url}`
    })
  }
} catch (error) {
  failures.push('connection')
  console.error(`FAIL connection — ${error.message}`)
} finally {
  await client.close()
}

console.log(`\n${passed} passed; ${failures.length} failed${failures.length ? `: ${failures.join(', ')}` : ''}.`)
process.exitCode = failures.length ? 1 : 0
