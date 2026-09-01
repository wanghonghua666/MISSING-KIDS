import type {SanityImageSource} from "@sanity/image-url"

export type ProductListItem = {
  _id: string
  slug: string
  title: string
  priceLabel: string
  imageUrl: string
  imageAlt: string
  categoryTitle: string | null
}

export type ProductImage = {
  url: string
  alt: string
}

export type RawProductImage = SanityImageSource & {alt?: string | null}
