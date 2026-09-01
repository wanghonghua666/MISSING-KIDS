import {createImageUrlBuilder} from "@sanity/image-url"
import type {SanityImageSource} from "@sanity/image-url"

const builder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "wjldnct8",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
})

type ImageUrlOptions = {
  width?: number
  height?: number
  quality?: number
  /** 默认 max（不裁切）。轮播等需要统一画幅时用 crop，会尊重 Studio 的 hotspot / crop */
  fit?: "max" | "crop" | "min" | "clip"
}

/** Sanity 裁剪 / hotspot 只体现在 image-url 上，`asset->url` 始终是未裁切原图 */
export function sanityImageUrl(
  image: SanityImageSource | null | undefined,
  options?: ImageUrlOptions,
): string | null {
  if (!image) return null
  try {
    const fit = options?.fit ?? "max"
    let chain = builder.image(image).auto("format").fit(fit)
    if (options?.width) chain = chain.width(options.width)
    if (options?.height) chain = chain.height(options.height)
    if (options?.quality != null) chain = chain.quality(options.quality)
    return chain.url()
  } catch {
    return null
  }
}
