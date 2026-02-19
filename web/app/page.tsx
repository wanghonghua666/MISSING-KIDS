"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function StartPage() {
  const router = useRouter()
  const [leaving, setLeaving] = React.useState(false)
  const [hovered, setHovered] = React.useState(false)

  function handleClick() {
    // 1. 先关 hover — 让 blur 开始渐出（不受 opacity 父级 stacking context 影响）
    setHovered(false)
    sessionStorage.setItem("fromStart", "1")
    // 2. 稍后再触发整页淡出
    window.setTimeout(() => setLeaving(true), 80)
    // 3. 淡出结束后导航
    window.setTimeout(() => router.push("/home"), 400)
  }

  return (
    <>
      {/* 背景 blur 层：position:fixed，独立于页面 opacity，避免 stacking context 吞掉 backdrop-filter */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          opacity: hovered && !leaving ? 1 : 0,
          transition: "opacity 0.4s ease",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* 页面内容 */}
      <div
        className="relative w-full min-h-screen flex items-center justify-center"
        style={{
          opacity: leaving ? 0 : 1,
          transition: leaving ? "opacity 300ms ease" : undefined,
          zIndex: 1,
        }}
      >
        <div
          className="relative cursor-pointer"
          onClick={handleClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Image
            src="/logo.png"
            alt="MissingKids Lab"
            width={229}
            height={211}
            priority
            className="select-none"
            style={{
              transition: "filter 0.35s ease",
              filter: hovered
                ? "brightness(8) saturate(0) drop-shadow(0 0 18px rgba(255,255,255,0.95)) drop-shadow(0 0 40px rgba(255,255,255,0.6))"
                : "none",
            }}
          />
        </div>
      </div>
    </>
  )
}
