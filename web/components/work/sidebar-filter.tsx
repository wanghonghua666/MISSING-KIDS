import * as React from "react"
import { cn } from "@/lib/utils"

export function SidebarFilter() {
  const categories = [
    "ALL",
    "NEW",
    "JACKETS",
    "SHIRTING",
    "TOPS",
    "BOTTOMS",
    "SHORTS",
    "TRACKSUITS",
    "HOODS",
    "SWEATSHIRTS",
    "T-SHIRTS",
    "HATS",
    "ACCESSORIES",
  ]

  return (
    <div className="mk-sidebar mk-mono w-[112px] h-[368px] flex flex-col gap-[8px] text-[14px] font-bold text-white">
      <div className="sr-only">Categories</div>
      <div className="flex flex-col gap-[8px]">
        {categories.map((category) => (
          <button
            key={category}
            className={cn(
              "w-full text-left mk-hover-bright transition-[filter] cursor-pointer",
              category === "ALL" ? "text-[#ab2f33ff]" : "text-white"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
