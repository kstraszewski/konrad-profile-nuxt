import { profile } from '../../../app/data/profile'
import { buildCvPdf } from '../../utils/cvPdf'

export default defineEventHandler((event) => {
  const requestPath = event.node.req.url ?? ''
  const rawVariant = `${event.context.params?.variant ?? ''} ${requestPath}`.toLowerCase()
  const variant = rawVariant.includes('posthog') ? 'posthog' : 'general'
  const filename = variant === 'posthog' ? 'Konrad-Straszewski-CV-PostHog.pdf' : 'Konrad-Straszewski-CV.pdf'

  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`)
  setHeader(event, 'Cache-Control', 'no-store')

  return buildCvPdf(profile, variant)
})
