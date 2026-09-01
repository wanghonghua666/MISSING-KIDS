"use client"

import * as React from "react"
import Image from "next/image"
import {SidebarFilter} from "@/components/work/sidebar-filter"
import {TransitionLink} from "@/components/layout/transition-link"
import type {ProductListItem} from "@/lib/types/product"

interface Props {
  products: ProductListItem[]
  categories: string[]
  initialCategory?: string
}

export function WorkPageContent({products, categories, initialCategory = "ALL"}: Props) {
  const [selectedCategory, setSelectedCategory] = React.useState(
    categories.includes(initialCategory) ? initialCategory : "ALL",
  )

  function handleSelect(category: string) {
    setSelectedCategory(category)
    const url = category === "ALL" ? "/work" : `/work?category=${encodeURIComponent(category)}`
    window.history.replaceState(null, "", url)
  }

  const visible =
    selectedCategory === "ALL"
      ? products
      : products.filter((item) => item.categoryTitle === selectedCategory)

  return (
    <div className="w-full max-w-[1438px] min-h-[594px] h-auto flex justify-start gap-[48px] p-[48px] mk-work-layout">
      <SidebarFilter
        categories={categories}
        currentCategory={selectedCategory}
        onCategorySelect={handleSelect}
      />
      <div className="flex-1 flex flex-col items-center justify-start gap-[16px] min-h-[200px]">
        {visible.length === 0 ? (
          <div className="mk-mono text-sm text-white/60 py-[80px]">这个分类暂时没有商品。</div>
        ) : (
          <div className="mk-product-grid grid grid-cols-[repeat(6,180px)] gap-[16px]">
            {visible.map((item) => (
              <TransitionLink
                href={`/work/${item.slug}`}
                transitionMs={360}
                hoverGlow={false}
                key={item._id}
                className="group relative w-[180px] h-[180px] overflow-hidden mk-product-card"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.imageAlt}
                  fill
                  sizes="180px"
                  className="object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="mk-mono mk-product-overlay-box">
                    <span className="text-[12px] font-bold text-[#ef4444]">{item.title}</span>
                    {item.priceLabel ? (
                      <span className="text-[12px] font-bold text-[#ef4444]">{item.priceLabel}</span>
                    ) : null}
                  </div>
                </div>
              </TransitionLink>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
