import {
  buildJsonLd,
  getAbsoluteUrl,
  getPageSeo,
  normalizePath,
  normalizeSiteUrl,
  seoSite
} from '~/data/seo'

export const useRouteSeo = (path?: string) => {
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()
  const siteUrl = computed(() => normalizeSiteUrl(runtimeConfig.public.siteUrl as string | undefined))
  const page = computed(() => getPageSeo(path ?? route.path))
  const canonicalUrl = computed(() => getAbsoluteUrl(siteUrl.value, normalizePath(page.value.path)))
  const imageUrl = computed(() => getAbsoluteUrl(siteUrl.value, page.value.image ?? seoSite.defaultImage))

  useSeoMeta({
    title: () => page.value.title,
    description: () => page.value.description,
    author: seoSite.name,
    robots: () => (page.value.index === false ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'),
    ogType: () => (page.value.type === 'profile' ? 'profile' : 'website'),
    ogLocale: () => page.value.locale ?? seoSite.locale,
    ogSiteName: seoSite.name,
    ogTitle: () => page.value.title,
    ogDescription: () => page.value.description,
    ogUrl: () => canonicalUrl.value,
    ogImage: () => imageUrl.value,
    ogImageSecureUrl: () => imageUrl.value.startsWith('https://') ? imageUrl.value : undefined,
    ogImageType: () => page.value.imageType ?? seoSite.imageType,
    ogImageWidth: () => page.value.imageWidth ?? seoSite.imageWidth,
    ogImageHeight: () => page.value.imageHeight ?? seoSite.imageHeight,
    ogImageAlt: () => page.value.imageAlt ?? seoSite.imageAlt,
    twitterCard: seoSite.twitterCard,
    twitterTitle: () => page.value.title,
    twitterDescription: () => page.value.description,
    twitterImage: () => imageUrl.value,
    twitterImageAlt: () => page.value.imageAlt ?? seoSite.imageAlt
  })

  useHead(() => ({
    htmlAttrs: {
      lang: (page.value.locale ?? seoSite.locale).split('_')[0],
      dir: (page.value.locale ?? seoSite.locale).startsWith('ar') ? 'rtl' : 'ltr'
    },
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
