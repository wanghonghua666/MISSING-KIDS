"use client"

import {useState} from "react"

export function InstagramEmbed({permalink, title}: {permalink: string; title?: string}) {
  const [failed, setFailed] = useState(false)
  const imageSrc = `/api/instagram-image?url=${encodeURIComponent(permalink)}`

  if (failed) {
    return (
      <a
        href={permalink}
        target="_blank"
        rel="noreferrer"
        className="mx-auto flex w-full max-w-[702px] items-center justify-center rounded-[8px] border border-white/15 bg-black/25 px-[16px] py-[28px] text-[13px] text-[#ef4444] underline underline-offset-2"
      >
        在 Instagram 打开
      </a>
    )
  }

  return (
    <a
      href={permalink}
      target="_blank"
      rel="noreferrer"
      className="mk-instagram-embed mx-auto block w-full max-w-[702px] overflow-hidden rounded-[8px] bg-black/30"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={title || "Instagram post"}
        className="block w-full h-auto"
        onError={() => setFailed(true)}
      />
      <div className="flex items-center justify-between gap-[12px] px-[14px] py-[12px] text-[13px] text-gray-200/80">
        <span>Instagram</span>
        <span className="text-[#ef4444]">打开原帖</span>
      </div>
    </a>
  )
}
