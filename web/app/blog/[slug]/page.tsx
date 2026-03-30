import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MainContent } from "@/components/layout/main-content"
import { sanityImageUrl } from "@/lib/sanity.image"
import { sanityClient } from "@/lib/sanity.client"
import { blogBySlugQuery } from "@/lib/sanity.queries"
import { PortableText, PortableTextComponents } from "@portabletext/react"

interface Props {
  params: Promise<{
    slug: string
  }>
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const src = sanityImageUrl(value, { width: 1600, quality: 88 })
      if (!src) return null
      return (
        <figure className="my-[16px] flex justify-center w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={value.alt || ""} className="max-w-full max-h-[min(90vh,1200px)] w-auto rounded-[8px]" />
        </figure>
      )
    },
    youtube: ({ value }) => {
      if (!value?.url) return null
      return (
        <div className="my-[16px] aspect-video w-full max-w-[720px] mx-auto">
          <iframe
            src={value.url}
            className="w-full h-full rounded-[8px]"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )
    },
    soundCloud: ({ value }) => {
      if (!value?.url) return null
      return (
        <div className="my-[16px] w-full max-w-[720px] mx-auto">
          <iframe
            width="100%"
            height="166"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={value.url}
          />
        </div>
      )
    },
    tweet: ({ value }) => {
      if (!value?.url) return null
      return (
        <div className="my-[16px] w-full max-w-[520px] mx-auto">
          <blockquote className="twitter-tweet">
            <a href={value.url} />
          </blockquote>
        </div>
      )
    },
    inspost: ({ value }) => {
      if (!value?.url) return null

      const embedUrl = (() => {
        try {
          const u = new URL(value.url)
          const host = u.hostname.toLowerCase()
          const parts = u.pathname.split("/").filter(Boolean)

          // Instagram: iframe 推荐用 `/embed/` 版本
          if (host === "www.instagram.com" || host === "instagram.com") {
            if (parts.length >= 2 && parts[0] === "p") {
              const shortcode = parts[1]
              return `https://www.instagram.com/p/${shortcode}/embed/`
            }
            if (parts.length >= 2 && parts[0] === "reel") {
              const shortcode = parts[1]
              return `https://www.instagram.com/reel/${shortcode}/embed/`
            }
          }

          return value.url
        } catch {
          return value.url
        }
      })()

      const height = typeof value?.height === "number" ? value.height : 520

      return (
        <div className="my-[16px] w-full max-w-[min(1110px,100%)] mx-auto min-h-[240px]">
          <iframe
            src={embedUrl}
            title={value?.title || "Inspost embed"}
            className="w-full rounded-[8px] border-0 bg-black/20"
            style={{ height: `${height}px` }}
            loading="eager"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          <div className="mt-[8px] text-[12px] text-gray-300/70">
            如果嵌入不可用，你可以手动打开：
            <a
              href={embedUrl}
              target="_blank"
              rel="noreferrer"
              className="ml-[6px] text-[#ef4444] underline underline-offset-2"
            >
              {embedUrl}
            </a>
          </div>
        </div>
      )
    },
  },
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const data = await sanityClient.fetch(blogBySlugQuery, { slug })

  if (!data) {
    return (
      <div className="w-full min-h-screen flex flex-col">
        <Header />
        <MainContent className="flex-1 w-full flex items-center justify-center pb-[42px]">
          <div className="mk-mono text-sm text-gray-300/80">这篇博客暂时还没有内容。</div>
        </MainContent>
        <Footer />
      </div>
    )
  }

  const title: string = data.title || slug
  const publishedAt: string | null = data.publishedAt || null

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <MainContent className="flex-1 w-full flex items-center justify-center pb-[42px]">
        <article className="w-full max-w-[1110px] px-[24px] md:px-[40px] pt-[99px] pb-[99px] mk-glass-blur-18 mk-mono space-y-[24px]">
          <header className="space-y-[8px]">
            <div className="text-[11px] tracking-[0.3em] text-[#ef4444]">BLOG</div>
            <h1 className="text-[24px] md:text-[30px] font-bold leading-tight">{title}</h1>
            <div className="text-[11px] text-gray-300/80">
              <span>发布日期：{publishedAt ? new Date(publishedAt).toLocaleDateString() : "未设置"}</span>
            </div>
          </header>

          <section className="flex flex-col items-center justify-center w-full space-y-[16px] text-[13px] leading-relaxed text-gray-100/90">
            {data.body ? <PortableText value={data.body} components={components} /> : <p>正文暂未填写。</p>}
          </section>
        </article>
      </MainContent>
      <Footer />
    </div>
  )
}

