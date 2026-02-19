"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

type Ctx = { start: () => void; exiting: boolean }

const RouteTransitionContext = React.createContext<Ctx | null>(null)

export function RouteTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [exiting, setExiting] = React.useState(false)

  const start = React.useCallback(() => setExiting(true), [])

  // 新路由加载后重置
  React.useEffect(() => {
    setExiting(false)
  }, [pathname])

  return (
    <RouteTransitionContext.Provider value={{ start, exiting }}>
      {children}
    </RouteTransitionContext.Provider>
  )
}

export function useRouteTransition() {
  const ctx = React.useContext(RouteTransitionContext)
  if (!ctx) throw new Error("useRouteTransition must be used within RouteTransitionProvider")
  return ctx
}
