import {cache} from "react"
import {sanityClient} from "@/lib/sanity.client"
import {siteSettingsQuery} from "@/lib/sanity.queries"

export type FooterNavItem = {
  _key: string
  label: string
  url: string | null
}

export type HeaderNavItem = {
  _key: string
  label: string
  href: string
  external: boolean
}

export type SiteSettings = {
  siteTitle: string
  siteDescription: string
  instagramUrl: string | null
  productCtaLabel: string
  copyright: string
  headerNav: HeaderNavItem[]
  footerNav: FooterNavItem[]
}

const FALLBACK_HEADER: HeaderNavItem[] = [
  {_key: "home", label: "Home", href: "/home", external: false},
  {_key: "work", label: "Work", href: "/work", external: false},
]

const FALLBACK: SiteSettings = {
  siteTitle: "MissingKids Lab",
  siteDescription: "MissingKids Lab",
  instagramUrl: null,
  productCtaLabel: "DM On Ins",
  copyright: "© 2026 MissingKids Lab. All rights reserved.",
  headerNav: FALLBACK_HEADER,
  footerNav: [{_key: "instagram", label: "instagram", url: null}],
}

function hrefFromHeaderItem(item: {
  linkType?: string | null
  url?: string | null
  pageSlug?: string | null
}) {
  if (item.linkType === "home") return "/home"
  if (item.linkType === "work") return "/work"
  if (item.linkType === "page" && item.pageSlug) return `/${item.pageSlug}`
  if (item.linkType === "url" && item.url?.trim()) return item.url.trim()
  return null
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

  const headerNav: HeaderNavItem[] = (data?.headerNav ?? [])
    .map((item: {
      _key?: string
      label?: string
      linkType?: string | null
      url?: string | null
      pageSlug?: string | null
    }) => {
      const href = hrefFromHeaderItem(item)
      if (!href || !item.label) return null
      return {
        _key: item._key || item.label,
        label: item.label,
        href,
        external: href.startsWith("http"),
      }
    })
    .filter((item: HeaderNavItem | null): item is HeaderNavItem => Boolean(item))

  return {
    siteTitle: data?.siteTitle || FALLBACK.siteTitle,
    siteDescription: data?.siteDescription || FALLBACK.siteDescription,
    instagramUrl: data?.instagramUrl || null,
    productCtaLabel: data?.productCtaLabel || FALLBACK.productCtaLabel,
    copyright: data?.copyright || FALLBACK.copyright,
    headerNav: headerNav.length > 0 ? headerNav : FALLBACK_HEADER,
    footerNav: footerNav.length > 0 ? footerNav : FALLBACK.footerNav,
  }
})
