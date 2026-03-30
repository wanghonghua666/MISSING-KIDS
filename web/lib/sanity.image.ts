import imageUrlBuilder from "@sanity/image-url"
import type { SanityImageSource } from "@sanity/image-url"

const builder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "wjldnct8",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
})

/** Sanity 裁剪 / hotspot 只体现在 image-url 上，`asset->url` 始终是未裁切原图 */
export function sanityImageUrl(
  image: SanityImageSource | null | undefined,
  options?: { width?: number; quality?: number },
): string | null {
  if (!image) return null
  try {
    let chain = builder.image(image).auto("format").fit("max")
    if (options?.width) chain = chain.width(options.width)
    if (options?.quality != null) chain = chain.quality(options.quality)
    return chain.url()
  } catch {
    return null
  }
}
