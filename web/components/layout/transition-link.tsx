"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useRouteTransition } from "@/components/layout/transition-provider"

type Props = React.ComponentProps<typeof Link> & { transitionMs?: number; hoverGlow?: boolean }

export function TransitionLink({ transitionMs = 240, hoverGlow = true, onClick, className, ...props }: Props) {
  const router = useRouter()
  const { start } = useRouteTransition()

  return (
    <Link
      {...props}
      className={cn(hoverGlow && "mk-hover-bright", className)}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        const href = String(props.href)
        e.preventDefault()
        start()
        window.setTimeout(() => router.push(href), transitionMs)
      }}
    />
  )
}
