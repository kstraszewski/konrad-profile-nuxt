import { z } from 'zod'
import { searchProfileDocuments } from '../../../app/data/mcpProfile'

export default defineMcpTool({
  name: 'search',
  title: 'Search Profile',
  description:
    "Search Konrad Straszewski's public CV/profile context. Use this for ChatGPT connectors, deep research, and citation-shaped retrieval.",
  inputSchema: {
    query: z.string().describe('Search query about Konrad, his CV, experience, projects, AI work, stack, or contact details.')
  },
  annotations: {
    readOnlyHint: true,
    openWorldHint: false
  },
  handler: async ({ query }) => {
    const results = searchProfileDocuments(query).map((document) => ({
      id: document.id,
      title: document.title,
      url: document.url,
      text: document.text.slice(0, 900)
    }))

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ results })
        }
      ]
    }
  }
})
