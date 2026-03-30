"use client"

import * as React from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MainContent } from "@/components/layout/main-content"
import { BlogCarousel } from "@/components/blog/blog-carousel"
import type { BlogCarouselPost } from "@/lib/types/blog-carousel-post"

type Mode = "fromStart" | "normal"

type Props = {
  carouselPosts: BlogCarouselPost[]
}

export function HomeClient({ carouselPosts }: Props) {
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
    <div className="mk-home-carousel relative w-[1573px] max-w-none my-[118px] rounded-none bg-black/30 flex flex-col items-center justify-center text-left">
      <div className="w-full">
        <BlogCarousel posts={carouselPosts} />
      </div>
    </div>
  )

  if (mode === "fromStart") {
    return (
      <div className="mk-from-start w-full min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 w-full flex flex-col items-center justify-center gap-[48px] py-[48px] mk-from-start-main">
          {carousel}
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <MainContent className="flex-1 h-fit w-full flex flex-col items-center justify-center gap-0 mx-0 px-0 pt-0 pb-0 my-[23px]">
        {carousel}
      </MainContent>
      <Footer />
    </div>
  )
}
