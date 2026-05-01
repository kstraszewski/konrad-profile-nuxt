import { getAbsoluteUrl, getSitemapPages, normalizeSiteUrl } from '../../app/data/seo'

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (character) => {
    switch (character) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case "'":
        return '&apos;'
      case '"':
        return '&quot;'
      default:
        return character
    }
  })

export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const siteUrl = normalizeSiteUrl(runtimeConfig.public.siteUrl as string | undefined)
  const urls = getSitemapPages()
    .map(
      (page) => `  <url>
    <loc>${escapeXml(getAbsoluteUrl(siteUrl, page.path))}</loc>
    <lastmod>${page.lastmod}</lastmod>
  </url>`
    )
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
})
