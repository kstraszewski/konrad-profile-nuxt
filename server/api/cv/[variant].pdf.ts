import { profile } from '../../../app/data/profile'
import { buildCvPdf } from '../../utils/cvPdf'

export default defineEventHandler((event) => {
  const requestPath = event.node.req.url ?? ''
  const rawVariant = `${event.context.params?.variant ?? ''} ${requestPath}`.toLowerCase()
  let variant: Parameters<typeof buildCvPdf>[1] = 'general'

  if (rawVariant.includes('plain')) {
    variant = 'plain-ai-product-engineer'
  } else if (rawVariant.includes('polar')) {
    variant = 'polar-senior-product-engineer'
  } else if (rawVariant.includes('lago')) {
    variant = 'lago-product-engineer-growth'
  } else if (rawVariant.includes('linear')) {
    variant = 'linear-fullstack-engineer'
  } else if (rawVariant.includes('medusa')) {
    variant = 'medusa-product-engineer'
  } else if (rawVariant.includes('n8n')) {
    variant = rawVariant.includes('ai') || rawVariant.includes('sr') ? 'n8n-ai-engineer' : 'n8n-product-engineer'
  } else if (rawVariant.includes('posthog')) {
    variant = rawVariant.includes('ai-research') || rawVariant.includes('research')
      ? 'posthog-ai-research'
      : rawVariant.includes('pm')
        ? 'posthog-pm'
        : 'posthog-pe'
  }

  const filenames: Record<Parameters<typeof buildCvPdf>[1], string> = {
    general: 'Konrad-Straszewski-CV.pdf',
    'posthog-pe': 'Konrad-Straszewski-CV-PostHog-PE.pdf',
    'posthog-pm': 'Konrad-Straszewski-CV-PostHog-PM.pdf',
    'posthog-ai-research': 'Konrad-Straszewski-CV-PostHog-AI-Research-Engineer.pdf',
    'linear-fullstack-engineer': 'Konrad-Straszewski-CV-Linear-Fullstack-Engineer.pdf',
    'medusa-product-engineer': 'Konrad-Straszewski-CV-Medusa-Product-Engineer.pdf',
    'n8n-ai-engineer': 'Konrad-Straszewski-CV-n8n-Sr-AI-Engineer.pdf',
    'n8n-product-engineer': 'Konrad-Straszewski-CV-n8n-Product-Engineer.pdf',
    'plain-ai-product-engineer': 'Konrad-Straszewski-CV-Plain-AI-Product-Engineer.pdf',
    'polar-senior-product-engineer': 'Konrad-Straszewski-CV-Polar-Senior-Product-Engineer.pdf',
    'lago-product-engineer-growth': 'Konrad-Straszewski-CV-Lago-Product-Engineer-Growth.pdf'
  }
  const filename = filenames[variant]
  const disposition = requestPath.includes('preview=1') || requestPath.includes('inline=1') ? 'inline' : 'attachment'

  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', `${disposition}; filename="${filename}"`)
  setHeader(event, 'Cache-Control', 'no-store')

  return buildCvPdf(profile, variant)
})
