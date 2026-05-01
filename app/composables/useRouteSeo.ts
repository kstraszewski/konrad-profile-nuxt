import {
  buildJsonLd,
  getAbsoluteUrl,
  getPageSeo,
  normalizeSiteUrl,
  seoSite
} from '~/data/seo'

export const useRouteSeo = (path?: string) => {
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()
  const siteUrl = computed(() => normalizeSiteUrl(runtimeConfig.public.siteUrl as string | undefined))
  const page = computed(() => getPageSeo(path ?? route.path))
  const canonicalUrl = computed(() => getAbsoluteUrl(siteUrl.value, page.value.path))
  const imageUrl = computed(() => getAbsoluteUrl(siteUrl.value, page.value.image ?? seoSite.defaultImage))

  useSeoMeta({
    title: () => page.value.title,
    description: () => page.value.description,
    robots: () => (page.value.index === false ? 'noindex, nofollow' : 'index, follow'),
    ogType: () => (page.value.type === 'profile' ? 'profile' : 'website'),
    ogLocale: seoSite.locale,
    ogSiteName: seoSite.name,
    ogTitle: () => page.value.title,
    ogDescription: () => page.value.description,
    ogUrl: () => canonicalUrl.value,
    ogImage: () => imageUrl.value,
    ogImageWidth: '1882',
    ogImageHeight: '1260',
    ogImageAlt: 'Konrad Straszewski profile and CV preview',
    twitterCard: seoSite.twitterCard,
    twitterTitle: () => page.value.title,
    twitterDescription: () => page.value.description,
    twitterImage: () => imageUrl.value
  })

  useHead(() => ({
    link: [{ rel: 'canonical', href: canonicalUrl.value }],
    script:
      page.value.index === false
        ? []
        : [
            {
              key: 'schema-org',
              type: 'application/ld+json',
              innerHTML: JSON.stringify(buildJsonLd(page.value, siteUrl.value))
            }
          ]
  }))
}
