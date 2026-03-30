"use client"

import * as React from "react"
import { TransitionLink } from "@/components/layout/transition-link"
import type { BlogCarouselPost } from "@/lib/types/blog-carousel-post"

type Props = {
  posts: BlogCarouselPost[]
}

export function BlogCarousel({ posts }: Props) {
  const [active, setActive] = React.useState(0)

  const count = posts.length

  return (
    <section className="w-full mk-mono">
      {/* full-fill preview area */}
      <div className="w-full rounded-none bg-black">
        {count === 0 ? (
          <div className="w-full min-h-[420px] flex items-center justify-center text-[12px] text-white/60">
            暂无博客内容
          </div>
        ) : (
          <div
            className="flex w-full bg-black"
            style={{
              transform: `translateX(-${active * 100}%)`,
              transition: "transform 420ms cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            {posts.map((p, slideIndex) => {
              const img = p.previewImageUrl
              const isFirstLcp = slideIndex === 0
              return (
                <div key={p._id} className="w-full shrink-0 bg-black">
                  {img ? (
                    <TransitionLink
                      href={`/blog/${p.slug}`}
                      transitionMs={360}
                      className="relative block w-full mk-hover-bright outline-none"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={p.imageAlt || p.title || ""}
                        className="block h-auto max-w-none"
                        width={1600}
                        decoding="async"
                        loading={isFirstLcp ? "eager" : "lazy"}
                        fetchPriority={isFirstLcp ? "high" : "low"}
                        sizes="(max-width: 1600px) 100vw, 1600px"
                        style={{
                          width: "calc(100% + 2px)",
                          marginLeft: "-1px",
                          filter: "brightness(0.95) contrast(1.03)",
                        }}
                      />
                    </TransitionLink>
                  ) : (
                    <div className="w-full h-full bg-black/30" />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* dots */}
      {count > 1 ? (
        <div className="mt-[14px] mb-[10px] flex items-center justify-center gap-[10px] pointer-events-auto">
          {posts.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setActive(i)}
              className="h-[10px] w-[10px] rounded-full border border-white/40 bg-transparent"
              style={{
                background: i === active ? "#ef4444" : "transparent",
                boxShadow: i === active ? "0 0 10px rgba(239,68,68,0.35)" : "none",
              }}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}

