import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MainContent } from "@/components/layout/main-content"
import { WorkPageContent } from "@/components/work/work-page-content"
import { sanityClient } from "@/lib/sanity.client"
import { allCategoriesQuery, allProductsWithCategoryQuery } from "@/lib/sanity.queries"

export default async function WorkPage() {
  const products: any[] = await sanityClient.fetch(allProductsWithCategoryQuery)
  const categoriesData: any[] = await sanityClient.fetch(allCategoriesQuery)
  const categories: string[] = ["ALL", ...categoriesData.map((c) => c.title)]

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <div className="mk-header-spacer" aria-hidden />
      <MainContent className="flex-1 w-full flex items-center justify-center pb-[42px]">
        <WorkPageContent products={products} categories={categories} />
      </MainContent>
      <Footer />
    </div>
  )
}
