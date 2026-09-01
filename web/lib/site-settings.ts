import {cache} from "react"
import {sanityClient} from "@/lib/sanity.client"
import {siteSettingsQuery} from "@/lib/sanity.queries"

export type FooterNavItem = {
  _key: string
  label: string
  url: string | null
}

export type SiteSettings = {
  siteTitle: string
  siteDescription: string
  instagramUrl: string | null
  productCtaLabel: string
  copyright: string
  footerNav: FooterNavItem[]
}

const FALLBACK: SiteSettings = {
  siteTitle: "MissingKids Lab",
  siteDescription: "MissingKids Lab",
  instagramUrl: null,
  productCtaLabel: "DM On Ins",
  copyright: "© 2026 MissingKids Lab. All rights reserved.",
  footerNav: [{_key: "instagram", label: "instagram", url: null}],
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const data = await sanityClient.fetch(siteSettingsQuery)
  const footerNav: FooterNavItem[] = (data?.footerNav ?? [])
    .filter((item: {label?: string | null}) => Boolean(item?.label))
    .map((item: {_key?: string; label?: string; url?: string | null}) => ({
      _key: item._key || item.label || "item",
      label: item.label || "",
      url: item.url?.trim() || null,
    }))

  return {
    siteTitle: data?.siteTitle || FALLBACK.siteTitle,
    siteDescription: data?.siteDescription || FALLBACK.siteDescription,
    instagramUrl: data?.instagramUrl || null,
    productCtaLabel: data?.productCtaLabel || FALLBACK.productCtaLabel,
    copyright: data?.copyright || FALLBACK.copyright,
    footerNav: footerNav.length > 0 ? footerNav : FALLBACK.footerNav,
  }
})
