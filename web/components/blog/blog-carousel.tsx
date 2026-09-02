"use client"

import * as React from "react"
import {TransitionLink} from "@/components/layout/transition-link"
import type {BlogCarouselPost} from "@/lib/types/blog-carousel-post"

type Props = {
  posts: BlogCarouselPost[]
}

const PAIR_EASE = "margin-left 480ms cubic-bezier(0.2, 0.8, 0.2, 1)"

/** 两张 964 预览 + 32 间距；1920 起略缩也能并排 */
const PAIR_MIN_WIDTH = 1920

function usePrefersPair() {
  return React.useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia(`(min-width: ${PAIR_MIN_WIDTH}px)`)
      mq.addEventListener("change", onStoreChange)
      return () => mq.removeEventListener("change", onStoreChange)
    },
    () => window.matchMedia(`(min-width: ${PAIR_MIN_WIDTH}px)`).matches,
    () => false,
  )
}

export function BlogCarousel({posts}: Props) {
  const [active, setActive] = React.useState(0)
  const [pairShift, setPairShift] = React.useState(0)
  const [pairStep, setPairStep] = React.useState(0)
  const [pairSnap, setPairSnap] = React.useState(false)
  const pairShiftRef = React.useRef(0)
  const pairTrackRef = React.useRef<HTMLDivElement>(null)
  const count = posts.length
  const pair = usePrefersPair() && count >= 2
  pairShiftRef.current = pairShift

  React.useLayoutEffect(() => {
    if (!pair) return
    const track = pairTrackRef.current
    const viewport = track?.parentElement
    if (!track || !viewport) return
    const measure = () => {
      if (pairShiftRef.current !== 0) return
      const gap = Number.parseFloat(getComputedStyle(track).gap) || 32
      const next = (viewport.clientWidth + gap) / 2
      if (next > 100) setPairStep((s) => (Math.abs(s - next) < 0.5 ? s : next))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(viewport)
    return () => ro.disconnect()
  }, [pair])

  const finishPairAnim = React.useCallback(() => {
    const dir = pairShiftRef.current
    if (dir === 0) return
    setPairSnap(true)
    setActive((i) => (dir === 1 ? (i + 1) % count : (i - 1 + count) % count))
    setPairShift(0)
  }, [count])

  React.useLayoutEffect(() => {
    if (!pairSnap) return
    setPairSnap(false)
  }, [pairSnap])

  React.useEffect(() => {
    if (pairShift === 0) return
    const timer = window.setTimeout(finishPairAnim, 700)
    return () => window.clearTimeout(timer)
  }, [pairShift, finishPairAnim])

  const runPairAnim = React.useCallback(
    (dir: 1 | -1) => {
      if (!pair || pairShiftRef.current !== 0 || pairStep <= 0) return
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setActive((i) => (dir === 1 ? (i + 1) % count : (i - 1 + count) % count))
        return
      }
      const track = pairTrackRef.current
      if (track) {
        const from = -pairStep
        const to = -(1 + dir) * pairStep
        track.style.transition = "none"
        track.style.marginLeft = `${from}px`
        void track.offsetWidth
        track.style.transition = PAIR_EASE
        track.style.marginLeft = `${to}px`
      }
      setPairShift(dir)
    },
    [count, pair, pairStep],
  )

  const onPairTransitionEnd = React.useCallback(
    (event: React.TransitionEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) return
      if (event.propertyName !== "margin-left") return
      finishPairAnim()
    },
    [finishPairAnim],
  )

  const goPrev = React.useCallback(() => {
    if (count < 2) return
    if (pair) {
      runPairAnim(-1)
      return
    }
    setActive((i) => (i - 1 + count) % count)
  }, [count, pair, runPairAnim])

  const goNext = React.useCallback(() => {
    if (count < 2) return
    if (pair) {
      runPairAnim(1)
      return
    }
    setActive((i) => (i + 1) % count)
  }, [count, pair, runPairAnim])

  const goTo = React.useCallback(
    (index: number) => {
      if (count < 2 || index === active) return
      if (pair) {
        const next = (active + 1) % count
        const prev = (active - 1 + count) % count
        if (index === next) {
          runPairAnim(1)
          return
        }
        if (index === prev) {
          runPairAnim(-1)
          return
        }
      }
      setActive(index)
    },
    [active, count, pair, runPairAnim],
  )

  const at = (offset: number) => posts[(active + offset + count) % count]
  const left = posts[active]
  const right = posts[(active + 1) % count]

  return (
    <section className={`w-full mk-blog ${pair ? "mk-blog-pair" : ""}`}>
      <div className={`relative w-full ${pair ? "" : "overflow-hidden rounded-none bg-transparent"}`}>
        {count === 0 ? (
          <div className="flex aspect-[964/978] w-full items-center justify-center text-[12px] text-white/60">
            暂无博客内容
          </div>
        ) : pair && left && right ? (
          <div className="mk-carousel-pair-viewport">
            <div
              ref={pairTrackRef}
              className="mk-carousel-pair-track"
              data-anim={pairShift === 1 ? "next" : pairShift === -1 ? "prev" : undefined}
              style={
                pairStep
                  ? {
                      marginLeft: `${-(1 + pairShift) * pairStep}px`,
                      transition: pairSnap || pairShift === 0 ? "none" : PAIR_EASE,
                    }
                  : undefined
              }
              onTransitionEnd={onPairTransitionEnd}
            >
              {[at(-1), at(0), at(1), at(2)].map((post, slot) => (
                <div key={`${slot}-${post._id}`} className="mk-carousel-frame">
                  <CarouselSlide
                    post={post}
                    isActive={slot === 1 || slot === 2}
                    navMode={slot === 1 ? "prev" : slot === 2 ? "next" : "none"}
                    onPrev={goPrev}
                    onNext={goNext}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="flex w-full bg-transparent"
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
                navMode={count > 1 ? "both" : "none"}
                onPrev={goPrev}
                onNext={goNext}
              />
            ))}
          </div>
        )}

        {count > 1 ? (
          <div
            className={
              pair
                ? "mt-[16px] flex items-center justify-center gap-[10px]"
                : "pointer-events-auto absolute bottom-[12px] left-0 right-0 z-[3] flex items-center justify-center gap-[10px]"
            }
          >
            {posts.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`第 ${i + 1} 篇`}
                aria-current={i === active}
                disabled={pairShift !== 0}
                onClick={() => goTo(i)}
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
type NavMode = "both" | "prev" | "next" | "none"

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
  navMode,
  onPrev,
  onNext,
}: {
  post: BlogCarouselPost
  isActive: boolean
  navMode: NavMode
  onPrev: () => void
  onNext: () => void
}) {
  const src = post.previewImageUrl
  const [zone, setZone] = React.useState<LightZone | null>(null)
  const showPrev = navMode === "both" || navMode === "prev"
  const showNext = navMode === "both" || navMode === "next"
  const lightMaskStyle = src
    ? ({
        WebkitMaskImage: `url(${JSON.stringify(src)})`,
        maskImage: `url(${JSON.stringify(src)})`,
        WebkitMaskSize: "100% auto",
        maskSize: "100% auto",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      } satisfies React.CSSProperties)
    : undefined

  return (
    <div className="w-full shrink-0 bg-transparent">
      {src ? (
        <div
          className="mk-carousel-slide relative flex aspect-[964/978] w-full min-w-0 items-center justify-center overflow-hidden bg-transparent"
          data-lit={zone ? "true" : "false"}
          data-zone={zone || "none"}
          onMouseMove={(event) => setZone(zoneFromPointer(event))}
          onMouseLeave={() => setZone(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={post.imageAlt || post.title || ""}
            className="relative z-0 mx-auto block h-auto w-full min-w-0 max-w-full object-center"
            width={964}
            height={978}
            decoding="async"
            loading={isActive ? "eager" : "lazy"}
            fetchPriority={isActive ? "high" : "low"}
            sizes="(min-width: 1920px) 50vw, 964px"
          />

          <div
            className="mk-carousel-light mk-carousel-light-center"
            data-on={zone === "center" ? "true" : "false"}
            style={lightMaskStyle}
          />
          <div
            className="mk-carousel-light mk-carousel-light-left"
            data-on={zone === "left" ? "true" : "false"}
            style={lightMaskStyle}
          />
          <div
            className="mk-carousel-light mk-carousel-light-right"
            data-on={zone === "right" ? "true" : "false"}
            style={lightMaskStyle}
          />

          <TransitionLink
            href={`/blog/${post.slug}`}
            transitionMs={360}
            hoverGlow={false}
            aria-label={post.title || "打开文章"}
            className="absolute inset-0 z-[1] outline-none"
          />

          {showPrev ? (
            <button
              type="button"
              aria-label="上一篇"
              onClick={onPrev}
              className="absolute inset-y-0 left-0 z-[2] w-[22%] cursor-w-resize bg-transparent"
            />
          ) : null}
          {showNext ? (
            <button
              type="button"
              aria-label="下一篇"
              onClick={onNext}
              className="absolute inset-y-0 right-0 z-[2] w-[22%] cursor-e-resize bg-transparent"
            />
          ) : null}
        </div>
      ) : (
        <div className="aspect-[964/978] w-full bg-transparent" />
      )}
    </div>
  )
}
