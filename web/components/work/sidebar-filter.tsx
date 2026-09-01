"use client"

import * as React from "react"
import {cn} from "@/lib/utils"

interface Props {
  categories: string[]
  currentCategory?: string
  onCategorySelect: (category: string) => void
}

export function SidebarFilter({categories, currentCategory = "ALL", onCategorySelect}: Props) {
  return (
    <div className="mk-sidebar mk-mono w-[112px] h-[368px] flex flex-col gap-[8px] text-[14px] font-bold text-white">
      <div className="sr-only">Categories</div>
      <div className="mk-sidebar-list flex flex-col gap-[8px]">
        {categories.map((category) => {
          const isActive = currentCategory === category
          return (
            <button
              key={category}
              type="button"
              className={cn(
                "w-full text-left mk-hover-bright transition-[filter]",
                isActive ? "text-[#ab2f33ff]" : "text-white",
              )}
              onClick={() => onCategorySelect(category)}
            >
              {category}
            </button>
          )
        })}
      </div>
    </div>
  )
}
