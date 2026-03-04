"use client"

import * as React from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MainContent } from "@/components/layout/main-content"

type Mode = "pending" | "fromStart" | "normal"

export default function HomePage() {
  const [mode, setMode] = React.useState<Mode>("pending")

  React.useEffect(() => {
    if (sessionStorage.getItem("fromStart") === "1") {
      sessionStorage.removeItem("fromStart")
      setMode("fromStart")
    } else {
      setMode("normal")
    }
  }, [])

  const carousel = (
    <div className="mk-home-carousel w-full h-full min-h-[1200px] min-w-[1573px] max-w-[1447px] my-[118px] rounded-[6px] bg-black/30 flex flex-col items-center justify-center text-left" />
  )

  // pending: 只隐藏 main 内容，header/footer 正常显示，避免 header 闪烁
  if (mode === "pending") {
    return (
      <div className="w-full min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 w-full flex flex-col items-center justify-center gap-[48px] py-[48px]"
          style={{ opacity: 0, pointerEvents: "none" }}>
          {carousel}
        </main>
        <Footer />
      </div>
    )
  }

  // start→home: header+footer+main 依次淡入
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

  // normal: home↔work 只有 main 内容过渡
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
