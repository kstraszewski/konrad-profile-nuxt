import { z } from 'zod'
import { buildProfileContext, profileFocusOptions } from '../../../app/data/mcpProfile'

export default defineMcpTool({
  name: 'get_profile_context',
  title: 'Get Profile Context',
  description:
    "Return structured read-only context about Konrad Straszewski's CV, AI leadership, product engineering track record, projects, stack, availability, and contact links.",
  inputSchema: {
    question: z.string().optional().describe('Optional recruiter question to preserve in the returned context.'),
    focus: z.enum(profileFocusOptions).optional().describe('Optional focus area for a smaller context payload.')
  },
  annotations: {
    readOnlyHint: true,
    openWorldHint: false
  },
  handler: async ({ question, focus }) => {
    const context = buildProfileContext({ question, focus })

    return {
      structuredContent: context,
      content: [
        {
          type: 'text',
          text: JSON.stringify(context, null, 2)
        }
      ]
    }
  }
})
