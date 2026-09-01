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

  const goPrev = React.useCallback(() => {
    if (count < 2) return
    setActive((i) => (i - 1 + count) % count)
  }, [count])

  const goNext = React.useCallback(() => {
    if (count < 2) return
    setActive((i) => (i + 1) % count)
  }, [count])

  return (
    <section className="w-full mk-blog">
      <div className="relative w-full overflow-hidden rounded-none bg-black">
        {count === 0 ? (
          <div className="flex h-[978px] w-full items-center justify-center text-[12px] text-white/60">
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
            {posts.map((p, slideIndex) => (
              <CarouselSlide
                key={p._id}
                post={p}
                isActive={slideIndex === active}
                canCycle={count > 1}
                onPrev={goPrev}
                onNext={goNext}
              />
            ))}
          </div>
        )}

        {count > 1 ? (
          <div className="pointer-events-auto absolute bottom-[12px] left-0 right-0 z-[3] flex items-center justify-center gap-[10px]">
            {posts.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`第 ${i + 1} 篇`}
                aria-current={i === active}
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
      </div>
    </section>
  )
}

type LightZone = "left" | "center" | "right"

function zoneFromPointer(event: React.MouseEvent<HTMLElement>): LightZone {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = (event.clientX - rect.left) / Math.max(rect.width, 1)
  if (x < 0.22) return "left"
  if (x > 0.78) return "right"
  return "center"
}

function CarouselSlide({
  post,
  isActive,
  canCycle,
  onPrev,
  onNext,
}: {
  post: BlogCarouselPost
  isActive: boolean
  canCycle: boolean
  onPrev: () => void
  onNext: () => void
}) {
  const src = post.previewImageUrl
  const [zone, setZone] = React.useState<LightZone | null>(null)

  return (
    <div className="w-full shrink-0 bg-black">
      {src ? (
        <div
          className="mk-carousel-slide relative flex aspect-[964/978] h-[978px] w-full items-center overflow-hidden bg-black max-md:h-auto"
          data-lit={zone ? "true" : "false"}
          data-zone={zone || "none"}
          onMouseMove={(event) => setZone(zoneFromPointer(event))}
          onMouseLeave={() => setZone(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={post.imageAlt || post.title || ""}
            className="relative z-0 w-full max-w-none h-auto"
            width={964}
            height={978}
            decoding="async"
            loading={isActive ? "eager" : "lazy"}
            fetchPriority={isActive ? "high" : "low"}
            sizes="964px"
          />

          <div className="mk-carousel-light mk-carousel-light-center" data-on={zone === "center" ? "true" : "false"} />
          <div className="mk-carousel-light mk-carousel-light-left" data-on={zone === "left" ? "true" : "false"} />
          <div className="mk-carousel-light mk-carousel-light-right" data-on={zone === "right" ? "true" : "false"} />

          <TransitionLink
            href={`/blog/${post.slug}`}
            transitionMs={360}
            hoverGlow={false}
            aria-label={post.title || "打开文章"}
            className="absolute inset-0 z-[1] outline-none"
          />

          {canCycle ? (
            <>
              <button
                type="button"
                aria-label="上一篇"
                onClick={onPrev}
                className="absolute inset-y-0 left-0 z-[2] w-[22%] cursor-w-resize bg-transparent"
              />
              <button
                type="button"
                aria-label="下一篇"
                onClick={onNext}
                className="absolute inset-y-0 right-0 z-[2] w-[22%] cursor-e-resize bg-transparent"
              />
            </>
          ) : null}
        </div>
      ) : (
        <div className="aspect-[964/978] h-[978px] w-full bg-black/30 max-md:h-auto" />
      )}
    </div>
  )
}
