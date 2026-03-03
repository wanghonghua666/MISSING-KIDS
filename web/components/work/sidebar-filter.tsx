"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { TransitionLink } from "@/components/layout/transition-link"

interface Props {
  categories: string[]
  currentCategory?: string
  /** 传入时用按钮切换分类，不触发路由；不传则用链接跳转 */
  onCategorySelect?: (category: string) => void
}

export function SidebarFilter({ categories, currentCategory = "ALL", onCategorySelect }: Props) {
  return (
    <div className="mk-sidebar mk-mono w-[112px] h-[368px] flex flex-col gap-[8px] text-[14px] font-bold text-white">
      <div className="sr-only">Categories</div>
      <div className="flex flex-col gap-[8px]">
        {categories.map((category) => {
          const isActive = category === "ALL" ? currentCategory === "ALL" : currentCategory === category
          const baseClass = cn(
            "w-full text-left mk-hover-bright transition-[filter]",
            isActive ? "text-[#ab2f33ff]" : "text-white"
          )
          if (onCategorySelect) {
            return (
              <button
                key={category}
                type="button"
                className={baseClass}
                onClick={() => onCategorySelect(category)}
              >
                {category}
              </button>
            )
          }
          const href = category === "ALL" ? "/work" : `/work?category=${encodeURIComponent(category)}`
          return (
            <TransitionLink key={category} href={href} transitionMs={360} className={baseClass}>
              {category}
            </TransitionLink>
          )
        })}
      </div>
    </div>
  )
}
