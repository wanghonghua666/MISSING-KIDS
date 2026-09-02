import {defineQuery} from "next-sanity"

export const sanityImageProjection = `{
  crop,
  hotspot,
  alt,
  asset
}`

export const siteSettingsQuery = defineQuery(`
*[_id == "siteSettings"][0]{
  siteTitle,
  siteDescription,
  instagramUrl,
  productCtaLabel,
  copyright,
  headerNav[]{
    _key,
    label,
    linkType,
    url,
    "pageSlug": page->slug.current
  },
  footerNav[]{
    _key,
    label,
    url
  }
}
`)

export const blogBySlugQuery = defineQuery(`
*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  body,
  mainImage${sanityImageProjection}
}
`)

export const allProductsWithCategoryQuery = defineQuery(`
*[_type == "product" && defined(slug.current)] | order(orderRank asc){
  _id,
  title,
  "slug": slug.current,
  price,
  mainImage${sanityImageProjection},
  "category": category->{
    _id,
    title,
    "slug": slug.current
  }
}
`)

export const allCategoriesQuery = defineQuery(`
*[_type == "category"] | order(orderRank asc){
  _id,
  title,
  "slug": slug.current
}
`)

export const productBySlugQuery = defineQuery(`
*[_type == "product" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  price,
  description,
  size,
  color,
  ctaLabel,
  ctaUrl,
  mainImage${sanityImageProjection},
  "gallery": gallery[]{
    _key,
    crop,
    hotspot,
    alt,
    asset
  }
}
`)

export const sitemapEntriesQuery = defineQuery(`
{
  "posts": *[_type == "post" && defined(slug.current)]{"slug": slug.current, publishedAt, _updatedAt},
  "products": *[_type == "product" && defined(slug.current)]{"slug": slug.current, _updatedAt},
  "pages": *[_type == "page" && defined(slug.current)]{"slug": slug.current, _updatedAt}
}
`)

export const pageBySlugQuery = defineQuery(`
*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  body
}
`)

export const allPageSlugsQuery = defineQuery(`
*[_type == "page" && defined(slug.current)]{"slug": slug.current}
`)
