"use client"

import * as React from "react"
import { SidebarFilter } from "@/components/work/sidebar-filter"
import { TransitionLink } from "@/components/layout/transition-link"
import Image from "next/image"

type ProductItem = {
  _id?: string
  slug?: string
  title?: string
  price?: string
  image?: { asset?: { url?: string }; alt?: string }
  category?: { title?: string }
}

interface Props {
  products: ProductItem[]
  categories: string[]
}

export function WorkPageContent({ products, categories }: Props) {
  const [selectedCategory, setSelectedCategory] = React.useState("ALL")

  const filteredProducts =
    selectedCategory === "ALL"
      ? products
      : products.filter((p) => p.category?.title === selectedCategory)

  const row1 = filteredProducts.slice(0, 6)
  const row2 = filteredProducts.slice(6, 12)

  return (
    <div className="w-full max-w-[1438px] h-[594px] flex justify-start gap-[48px] p-[48px] mk-work-layout">
      <SidebarFilter
        categories={categories}
        currentCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      <span className="mk-mobile-all-items mk-mono text-[16px] font-bold text-white">
        ALL ITEMS
      </span>
      <div className="flex-1 flex flex-col items-center justify-start gap-[16px] h-[600px]">
        <div className="mk-product-grid grid grid-cols-[repeat(6,180px)] gap-[16px]">
          {row1.map((item) => (
            <TransitionLink
              href={`/work/${item.slug}`}
              transitionMs={360}
              hoverGlow={false}
              key={item._id ?? item.slug}
              className="group relative w-[180px] h-[180px] overflow-hidden mk-product-card"
            >
              <Image
                src={item.image?.asset?.url || "/logo.png"}
                alt={item.title ?? ""}
                fill
                sizes="180px"
                className="object-contain"
                priority={false}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="mk-mono mk-product-overlay-box">
                  <span className="text-[12px] font-bold text-[#ef4444]">
                    {item.title}
                  </span>
                  <span className="text-[12px] font-bold text-[#ef4444]">
                    {item.price}
                  </span>
                </div>
              </div>
            </TransitionLink>
          ))}
        </div>
        <div className="mk-product-grid grid grid-cols-[repeat(6,180px)] gap-[16px]">
          {row2.map((item) => (
            <TransitionLink
              href={`/work/${item.slug}`}
              transitionMs={360}
              hoverGlow={false}
              key={item._id ?? item.slug}
              className="group relative w-[180px] h-[180px] overflow-hidden mk-product-card"
            >
              <Image
                src={item.image?.asset?.url || "/logo.png"}
                alt={item.title ?? ""}
                fill
                sizes="180px"
                className="object-contain"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="mk-mono mk-product-overlay-box">
                  <span className="text-[12px] font-bold text-[#ef4444]">
                    {item.title}
                  </span>
                  <span className="text-[12px] font-bold text-[#ef4444]">
                    {item.price}
                  </span>
                </div>
              </div>
            </TransitionLink>
          ))}
        </div>
      </div>
    </div>
  )
}
