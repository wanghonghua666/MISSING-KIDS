import {Header} from "@/components/layout/header"
import {Footer} from "@/components/layout/footer"
import {MainContent} from "@/components/layout/main-content"
import {WorkPageContent} from "@/components/work/work-page-content"
import {sanityClient} from "@/lib/sanity.client"
import {allCategoriesQuery, allProductsWithCategoryQuery} from "@/lib/sanity.queries"
import {sanityImageUrl} from "@/lib/sanity.image"
import {formatPrice} from "@/lib/price"
import {getSiteSettings} from "@/lib/site-settings"
import type {ProductListItem} from "@/lib/types/product"

export const revalidate = 60

type Props = {
  searchParams: Promise<{category?: string}>
}

export default async function WorkPage({searchParams}: Props) {
  const [{category: categoryParam}, settings, productsRaw, categoriesData] = await Promise.all([
    searchParams,
    getSiteSettings(),
    sanityClient.fetch(allProductsWithCategoryQuery),
    sanityClient.fetch(allCategoriesQuery),
  ])

  const products: ProductListItem[] = (productsRaw ?? []).map(
    (item: {
      _id: string
      slug: string
      title: string
      price?: string | null
      mainImage?: {alt?: string | null} | null
      category?: {title?: string | null} | null
    }) => ({
      _id: item._id,
      slug: item.slug,
      title: item.title,
      priceLabel: formatPrice(item.price),
      imageUrl: sanityImageUrl(item.mainImage, {width: 360, quality: 80}) || "/logo.png",
      imageAlt: item.mainImage?.alt || item.title || "",
      categoryTitle: item.category?.title ?? null,
    }),
  )

  const categories: string[] = ["ALL", ...(categoriesData ?? []).map((c: {title: string}) => c.title)]

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <MainContent className="flex-1 w-full flex items-center justify-center pb-[42px]">
        <WorkPageContent
          products={products}
          categories={categories}
          initialCategory={categoryParam}
        />
      </MainContent>
      <Footer nav={settings.footerNav} copyright={settings.copyright} />
    </div>
  )
}
