import type { H3Event } from 'h3'
import { defineCachedFunction } from 'nitropack/runtime'
import { fetchGitHubContributions } from './githubContributions'

// The profile, CV page and downloaded PDFs share the same rolling-year total.
export const getGitHubContributions = defineCachedFunction((_event: H3Event) => fetchGitHubContributions(), {
  name: 'github-contributions',
  getKey: () => 'kstraszewski',
  maxAge: 60 * 60 * 6,
  swr: true,
})
