import { getAbsoluteUrl, normalizeSiteUrl } from '../../app/data/seo'

export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const siteUrl = normalizeSiteUrl(runtimeConfig.public.siteUrl as string | undefined)

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')

  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /mcp/server',
    '',
    `Sitemap: ${getAbsoluteUrl(siteUrl, '/sitemap.xml')}`,
    ''
  ].join('\n')
})
