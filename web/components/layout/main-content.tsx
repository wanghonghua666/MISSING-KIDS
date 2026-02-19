"use client"

import * as React from "react"
import { useRouteTransition } from "@/components/layout/transition-provider"

interface Props {
  children: React.ReactNode
  className?: string
}

// 只包 <main>，不包 header/footer，避免 opacity 动画影响 fixed 元素的 backdrop-filter
export function MainContent({ children, className }: Props) {
  const { exiting } = useRouteTransition()

  return (
    <main className={`${className ?? ""} ${exiting ? "mk-content-exit" : "mk-content-enter"}`}>
      {children}
    </main>
  )
}
