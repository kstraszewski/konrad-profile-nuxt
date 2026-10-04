import { profile } from '../../../app/data/profile'
import { buildCvPdf } from '../../utils/cvPdf'

export default defineEventHandler((event) => {
  const requestPath = event.node.req.url ?? ''
  const rawVariant = `${event.context.params?.variant ?? ''} ${requestPath}`.toLowerCase()
  let variant: Parameters<typeof buildCvPdf>[1] = 'general'

  if (rawVariant.includes('plane')) {
    variant = 'plane'
  } else if (rawVariant.includes('neoiq')) {
    variant = 'neoiq-fde-ai-manager'
  } else if (rawVariant.includes('oferteo')) {
    variant = 'oferteo-fde-ai-manager'
  } else if (rawVariant.includes('plain')) {
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

  const filename = 'Konrad Straszewski CV.pdf'
  const disposition = requestPath.includes('preview=1') || requestPath.includes('inline=1') ? 'inline' : 'attachment'

  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', `${disposition}; filename="${filename}"`)
  setHeader(event, 'Cache-Control', 'no-store')

  return buildCvPdf(profile, variant)
})
