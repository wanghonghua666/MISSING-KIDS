import type {MetadataRoute} from "next"
import {sanityClient} from "@/lib/sanity.client"
import {sitemapEntriesQuery} from "@/lib/sanity.queries"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://missingkids.club"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await sanityClient.fetch(sitemapEntriesQuery)
  const posts = data?.posts ?? []
  const products = data?.products ?? []

  return [
    {url: `${siteUrl}/`, lastModified: new Date()},
    {url: `${siteUrl}/home`, lastModified: new Date()},
    {url: `${siteUrl}/work`, lastModified: new Date()},
    ...posts.map((post: {slug: string; publishedAt?: string | null; _updatedAt?: string}) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt || post._updatedAt || new Date(),
    })),
    ...products.map((product: {slug: string; _updatedAt?: string}) => ({
      url: `${siteUrl}/work/${product.slug}`,
      lastModified: product._updatedAt || new Date(),
    })),
  ]
}
