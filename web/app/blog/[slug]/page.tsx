import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MainContent } from "@/components/layout/main-content"
import { sanityClient } from "@/lib/sanity.client"
import { blogBySlugQuery } from "@/lib/sanity.queries"
import { PortableText, PortableTextComponents } from "@portabletext/react"

interface Props {
  params: {
    slug: string
  }
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?.url) return null
      return (
        <figure className="my-[16px] flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value.asset.url} alt={value.alt || ""} className="max-h-[480px] rounded-[8px]" />
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
  },
}

export default async function BlogPostPage({ params }: Props) {
  const slug = params.slug
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
        <article className="w-full max-w-[840px] px-[24px] md:px-[40px] py-[32px] md:py-[40px] mk-glass-blur-18 mk-mono space-y-[24px]">
          <header className="space-y-[8px]">
            <div className="text-[11px] tracking-[0.3em] text-[#ef4444]">BLOG</div>
            <h1 className="text-[24px] md:text-[30px] font-bold leading-tight">{title}</h1>
            <div className="text-[11px] text-gray-300/80">
              <span>发布日期：{publishedAt ? new Date(publishedAt).toLocaleDateString() : "未设置"}</span>
            </div>
          </header>

          <section className="space-y-[16px] text-[13px] leading-relaxed text-gray-100/90">
            {data.body ? <PortableText value={data.body} components={components} /> : <p>正文暂未填写。</p>}
          </section>
        </article>
      </MainContent>
      <Footer />
    </div>
  )
}

