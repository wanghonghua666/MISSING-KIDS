"use client"

import * as React from "react"
import {Header} from "@/components/layout/header"
import {Footer} from "@/components/layout/footer"
import {MainContent} from "@/components/layout/main-content"
import {BlogCarousel} from "@/components/blog/blog-carousel"
import type {BlogCarouselPost} from "@/lib/types/blog-carousel-post"
import type {FooterNavItem} from "@/lib/site-settings"

type Mode = "fromStart" | "normal"

type Props = {
  carouselPosts: BlogCarouselPost[]
  footerNav?: FooterNavItem[]
  copyright?: string | null
}

export function HomeClient({carouselPosts, footerNav, copyright}: Props) {
  const [mode, setMode] = React.useState<Mode>(() => {
    if (typeof window === "undefined") return "normal"
    return sessionStorage.getItem("fromStart") === "1" ? "fromStart" : "normal"
  })

  React.useEffect(() => {
    if (sessionStorage.getItem("fromStart") === "1") {
      sessionStorage.removeItem("fromStart")
      setMode("fromStart")
    } else {
      setMode("normal")
    }
  }, [])

  const carousel = (
    <div className="mk-home-carousel relative mx-auto w-full max-w-[1960px] overflow-hidden rounded-none bg-transparent flex flex-col items-center justify-center text-center">
      <div className="h-full w-full">
        <BlogCarousel posts={carouselPosts} />
      </div>
    </div>
  )

  if (mode === "fromStart") {
    return (
      <div className="mk-from-start w-full min-h-screen flex flex-col">
        <Header />
        <main className="mk-home-stage mk-from-start-main flex-1 w-full flex flex-col items-center justify-center px-6 max-md:px-0">
          {carousel}
        </main>
        <Footer nav={footerNav} copyright={copyright} />
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <MainContent className="mk-home-stage flex-1 w-full flex flex-col items-center justify-center gap-0 mx-0 px-6 max-md:px-0">
        {carousel}
      </MainContent>
      <Footer nav={footerNav} copyright={copyright} />
    </div>
  )
}
