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

/** 首页轮播：宽 964，高 978（1278−300）。只按宽度出图，左右不裁，上下由容器裁 */
const CAROUSEL_IMAGE_WIDTH = 1928
const CAROUSEL_IMAGE_QUALITY = 80

function carouselPreviewUrl(image: SanityImageSource | null | undefined) {
  return sanityImageUrl(image, {
    width: CAROUSEL_IMAGE_WIDTH,
    quality: CAROUSEL_IMAGE_QUALITY,
    fit: "max",
  })
}

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
      previewImageUrl: carouselPreviewUrl(p.mainImage) ?? carouselPreviewUrl(p.bodyFirstImage),
      imageAlt: mainAlt || p.title || "",
    }
  })
}
