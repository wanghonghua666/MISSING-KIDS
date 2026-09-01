"use client"

import {cn} from "@/lib/utils"
import Link from "next/link"
import {usePathname, useRouter} from "next/navigation"
import * as React from "react"
import {useRouteTransition} from "@/components/layout/transition-provider"

type Props = React.ComponentProps<typeof Link> & {transitionMs?: number; hoverGlow?: boolean}

function isInternalHref(href: string) {
  return href.startsWith("/") && !href.startsWith("//")
}

export function TransitionLink({transitionMs = 240, hoverGlow = true, onClick, className, ...props}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const {start} = useRouteTransition()

  return (
    <Link
      {...props}
      className={cn(hoverGlow && "mk-hover-bright", className)}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return

        const href = String(props.href)
        if (!isInternalHref(href)) return
        if (props.target === "_blank") return
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        if (href === pathname) return

        e.preventDefault()
        start()
        window.setTimeout(() => router.push(href), transitionMs)
      }}
    />
  )
}
