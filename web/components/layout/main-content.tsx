"use client"

import * as React from "react"
import { useRouteTransition } from "@/components/layout/transition-provider"

interface Props {
  children: React.ReactNode
  className?: string
}

export function MainContent({ children, className }: Props) {
  const { exiting } = useRouteTransition()

  // 避免「新页面首帧」也拿到 exiting=true 导致先闪一下再淡入：
  // 只有挂载后的后续渲染才应用退出动画，刚挂载的一帧强制视为进入动画
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isExiting = exiting && mounted

  return (
    <main className={`${className ?? ""} ${isExiting ? "mk-content-exit" : "mk-content-enter"}`}>
      {children}
    </main>
  )
}
