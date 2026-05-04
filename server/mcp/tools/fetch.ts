import { z } from 'zod'
import { fetchProfileDocument } from '../../../app/data/mcpProfile'

export default defineMcpTool({
  name: 'fetch',
  title: 'Fetch Profile Document',
  description:
    "Fetch a full profile/CV document by ID returned from the search tool. Use this for ChatGPT connectors and research flows.",
  inputSchema: {
    id: z.string().describe('Document ID returned from search.')
  },
  annotations: {
    readOnlyHint: true,
    openWorldHint: false
  },
  handler: async ({ id }) => {
    const document = fetchProfileDocument(id)

    if (!document) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              id,
              error: 'Document not found. Call search first and use one of the returned IDs.'
            })
          }
        ]
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(document)
        }
      ]
    }
  }
})
