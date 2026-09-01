"use client"

import * as React from "react"
import Image from "next/image"
import {useRouter} from "next/navigation"

export default function StartPage() {
  const router = useRouter()
  const [leaving, setLeaving] = React.useState(false)
  const [hovered, setHovered] = React.useState(false)

  function enterSite() {
    setHovered(false)
    sessionStorage.setItem("fromStart", "1")
    window.setTimeout(() => setLeaving(true), 80)
    window.setTimeout(() => router.push("/home"), 400)
  }

  return (
    <>
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

      <div
        className="relative w-full min-h-screen flex items-center justify-center"
        style={{
          opacity: leaving ? 0 : 1,
          transition: leaving ? "opacity 300ms ease" : undefined,
          zIndex: 1,
        }}
      >
        <button
          type="button"
          className="relative cursor-pointer bg-transparent border-0 p-0"
          onClick={enterSite}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label="进入 MissingKids Lab"
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
        </button>
      </div>
    </>
  )
}
