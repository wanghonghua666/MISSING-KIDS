"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import * as React from "react"
import { useRouteTransition } from "@/components/layout/transition-provider"

type Props = React.ComponentProps<typeof Link> & { transitionMs?: number; hoverGlow?: boolean }

export function TransitionLink({ transitionMs = 240, hoverGlow = true, onClick, className, ...props }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const { start } = useRouteTransition()

  return (
    <Link
      {...props}
      className={cn(hoverGlow && "mk-hover-bright", className)}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        const href = String(props.href)

        // 如果点击的是当前路由，不触发退出动画（否则 exiting 会卡住导致 main 永久淡出）
        if (href === pathname) return

        e.preventDefault()
        start()
        window.setTimeout(() => router.push(href), transitionMs)
      }}
    />
  )
}
