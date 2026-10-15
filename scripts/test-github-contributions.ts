import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fetchGitHubContributions, parseGitHubContributions } from '../server/utils/githubContributions.ts'

// Heading captured from the public GitHub contributions endpoint on 2026-10-15.
const githubHeading = `<h2 tabindex="-1" id="js-contribution-activity-description" class="f4 text-normal mb-2">
  5,918
  contributions
    in the last year
</h2>`

test('reads GitHub rolling-year total without counting unrelated activity', () => {
  assert.equal(parseGitHubContributions(`<p>900,000 contributions</p>${githubHeading}`), 5_918)
  assert.equal(parseGitHubContributions(githubHeading.replace('5,918', '0')), 0)
  assert.equal(parseGitHubContributions(githubHeading.replace('5,918', '1').replace('contributions', 'contribution')), 1)
})

test('rejects missing, malformed, ambiguous or different-period totals', () => {
  for (const html of [
    '<h2>5,918 contributions in the last year</h2>',
    githubHeading.replace('id=', 'data-id='),
    githubHeading.replace('5,918', '5,91'),
    githubHeading.replace('5,918', '-1'),
    githubHeading.replace('5,918', '9007199254740992'),
    githubHeading.replace('in the last year', 'in 2026'),
    `${githubHeading}${githubHeading}`,
    '<html>GitHub is temporarily unavailable</html>',
  ]) {
    assert.throws(() => parseGitHubContributions(html), /missing or invalid/)
  }
})

test('fetches the fixed public profile in English with a bounded request', async t => {
  t.mock.method(globalThis, 'fetch', async (url: string | URL | Request, options?: RequestInit) => {
    assert.equal(url, 'https://github.com/users/kstraszewski/contributions')
    assert.equal(new Headers(options?.headers).get('Accept-Language'), 'en-US,en;q=0.9')
    assert.ok(options?.signal instanceof AbortSignal)
    assert.equal(options.signal.aborted, false)
    return new Response(githubHeading)
  })
  const result = await fetchGitHubContributions()
  assert.equal(result.total, 5_918)
  assert.equal(result.profileUrl, 'https://github.com/kstraszewski')
  assert.ok(Number.isFinite(Date.parse(result.fetchedAt)))
})

test('an upstream failure rejects without a fabricated zero or retries', async t => {
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => new Response(githubHeading, { status: 503 }))
  await assert.rejects(fetchGitHubContributions(), /request failed/)
  assert.equal(fetchMock.mock.callCount(), 1)
})

test('unexpected upstream markup never becomes a successful count', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response('<html>Sign in</html>'))
  await assert.rejects(fetchGitHubContributions(), /missing or invalid/)
})
