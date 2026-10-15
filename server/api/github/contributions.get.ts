import { createError } from 'h3'
import { defineCachedEventHandler } from 'nitropack/runtime'
import { fetchGitHubContributions } from '../../utils/githubContributions'

export default defineCachedEventHandler(async () => {
  try {
    return await fetchGitHubContributions()
  } catch {
    throw createError({ statusCode: 503, statusMessage: 'GitHub contributions unavailable' })
  }
}, {
  name: 'github-contributions',
  getKey: () => 'kstraszewski',
  maxAge: 60 * 60 * 6,
  swr: true,
})
