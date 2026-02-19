import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

export type ProductCardProps = {
  title: string
  price: number
  image?: string
  className?: string
  layout?: "grid" | "list"
}

export function ProductCard({ title, price, image, className, layout = "grid" }: ProductCardProps) {
  return (
    <Link href={`/product/${title.toLowerCase().replace(/\s+/g, '-')}`} className={cn("group block", className)}>
      <div className={cn(
        "relative w-full aspect-square bg-white/5 rounded-xl border border-white/10 overflow-hidden transition-all duration-300 group-hover:bg-white/10 group-hover:scale-105",
        layout === "grid" ? "hover:rounded-b-none" : ""
      )}>
        {/* Hover Overlay */}
        <div className="absolute inset-0 z-10 hidden group-hover:flex items-center justify-center bg-black/50 transition-all duration-300">
          <div className="absolute bottom-0 left-0 right-0 h-10 w-full bg-black/90 px-3 py-2 text-xs font-bold text-red-500 backdrop-blur-md flex items-center justify-between">
            <span className="truncate">{title}</span>
            <span className="font-mono tabular-nums">¥{price}</span>
          </div>
        </div>

        {/* Product Image */}
        <div className="relative h-full w-full">
           <Image
            src={image || "/logo.png"}
            alt={title}
            fill
            className="object-cover"
            priority={layout === "list"}
          />
        </div>
      </div>

      {layout === "list" && (
        <div className="mt-3 flex flex-col gap-1 px-1">
           <h3 className="font-inter text-sm font-semibold text-white truncate">{title}</h3>
           <span className="font-mono text-xs font-medium text-red-500">¥{price}</span>
        </div>
      )}
    </Link>
  )
}
