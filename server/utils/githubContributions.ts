const GITHUB_PROFILE_URL = 'https://github.com/kstraszewski'
const GITHUB_CONTRIBUTIONS_URL = 'https://github.com/users/kstraszewski/contributions'

export interface GitHubContributions {
  total: number
  profileUrl: string
  fetchedAt: string
}

export function parseGitHubContributions(html: string): number {
  // Read GitHub's displayed rolling-year total, rather than summing calendar cells.
  const headings = [...html.matchAll(/<h2\b[^>]*\sid\s*=\s*(["'])js-contribution-activity-description\1[^>]*>([\s\S]*?)<\/h2\s*>/gi)]
  const heading = headings.length === 1 ? headings[0]?.[2] : undefined
  const text = heading?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const match = text?.match(/^(\d{1,3}(?:,\d{3})+|\d+) contributions? in the last year$/)
  const total = match ? Number(match[1]?.replaceAll(',', '')) : NaN

  if (!Number.isSafeInteger(total) || total < 0) {
    throw new Error('GitHub rolling-year contributions total is missing or invalid')
  }

  return total
}

export async function fetchGitHubContributions(): Promise<GitHubContributions> {
  const response = await fetch(GITHUB_CONTRIBUTIONS_URL, {
    headers: {
      Accept: 'text/html',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    signal: AbortSignal.timeout(3_500),
  })

  if (!response.ok) throw new Error('GitHub contributions request failed')

  return {
    total: parseGitHubContributions(await response.text()),
    profileUrl: GITHUB_PROFILE_URL,
    fetchedAt: new Date().toISOString(),
  }
}
