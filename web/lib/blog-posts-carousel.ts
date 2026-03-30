import { sanityImageUrl } from "@/lib/sanity.image"
import { sanityClient } from "@/lib/sanity.client"
import type { BlogCarouselPost } from "@/lib/types/blog-carousel-post"
import type { SanityImageSource } from "@sanity/image-url"

const query = `
*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  "mainImage": mainImage{
    crop,
    hotspot,
    alt,
    asset
  },
  "bodyFirstImage": body[_type == "image"][0]{
    crop,
    hotspot,
    alt,
    asset
  }
}
`

type Row = {
  _id: string
  title?: string
  slug: string
  publishedAt?: string | null
  mainImage?: SanityImageSource | null
  bodyFirstImage?: SanityImageSource | null
}

/** 首页轮播可视宽度约 1573px，1600@q80 足够清晰且明显小于原 2000@85 */
const CAROUSEL_IMAGE_WIDTH = 1600
const CAROUSEL_IMAGE_QUALITY = 80

export async function getBlogPostsForCarousel(): Promise<BlogCarouselPost[]> {
  const raw = (await sanityClient.fetch(query)) as Row[]
  return raw.map((p) => {
    const mainAlt =
      p.mainImage && typeof p.mainImage === "object" && "alt" in p.mainImage
        ? String((p.mainImage as { alt?: string | null }).alt || "")
        : ""
    return {
      _id: p._id,
      title: p.title,
      slug: p.slug,
      publishedAt: p.publishedAt,
      previewImageUrl:
        sanityImageUrl(p.mainImage, { width: CAROUSEL_IMAGE_WIDTH, quality: CAROUSEL_IMAGE_QUALITY }) ??
        sanityImageUrl(p.bodyFirstImage, {
          width: CAROUSEL_IMAGE_WIDTH,
          quality: CAROUSEL_IMAGE_QUALITY,
        }) ??
        null,
      imageAlt: mainAlt || p.title || "",
    }
  })
}
