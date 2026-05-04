import { profile } from '../../../app/data/profile'
import { buildCvPdf } from '../../utils/cvPdf'

export default defineEventHandler((event) => {
  const requestPath = event.node.req.url ?? ''
  const rawVariant = `${event.context.params?.variant ?? ''} ${requestPath}`.toLowerCase()
  const variant = rawVariant.includes('n8n')
    ? rawVariant.includes('ai') || rawVariant.includes('sr')
      ? 'n8n-ai-engineer'
      : 'n8n-product-engineer'
    : rawVariant.includes('posthog')
    ? rawVariant.includes('ai-research') || rawVariant.includes('research')
      ? 'posthog-ai-research'
      : rawVariant.includes('pm')
        ? 'posthog-pm'
        : 'posthog-pe'
    : 'general'
  const filename =
    variant === 'n8n-ai-engineer'
      ? 'Konrad-Straszewski-CV-n8n-Sr-AI-Engineer.pdf'
      : variant === 'n8n-product-engineer'
        ? 'Konrad-Straszewski-CV-n8n-Product-Engineer.pdf'
        : variant === 'posthog-ai-research'
      ? 'Konrad-Straszewski-CV-PostHog-AI-Research-Engineer.pdf'
      : variant === 'posthog-pm'
        ? 'Konrad-Straszewski-CV-PostHog-PM.pdf'
        : variant === 'posthog-pe'
          ? 'Konrad-Straszewski-CV-PostHog-PE.pdf'
          : 'Konrad-Straszewski-CV.pdf'
  const disposition = requestPath.includes('preview=1') || requestPath.includes('inline=1') ? 'inline' : 'attachment'

  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', `${disposition}; filename="${filename}"`)
  setHeader(event, 'Cache-Control', 'no-store')

  return buildCvPdf(profile, variant)
})
