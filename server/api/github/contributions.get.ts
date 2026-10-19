import { createError, defineEventHandler } from 'h3'
import { getGitHubContributions } from '../../utils/cachedGithubContributions'

export default defineEventHandler(async (event) => {
  try {
    return await getGitHubContributions(event)
  } catch {
    throw createError({ statusCode: 503, statusMessage: 'GitHub contributions unavailable' })
  }
})
