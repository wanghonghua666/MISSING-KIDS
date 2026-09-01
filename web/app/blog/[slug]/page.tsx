import type {Metadata} from "next"
import {notFound} from "next/navigation"
import {Header} from "@/components/layout/header"
import {Footer} from "@/components/layout/footer"
import {MainContent} from "@/components/layout/main-content"
import {PortableBody} from "@/components/blog/portable-body"
import {sanityImageUrl} from "@/lib/sanity.image"
import {sanityClient} from "@/lib/sanity.client"
import {blogBySlugQuery} from "@/lib/sanity.queries"
import {getSiteSettings} from "@/lib/site-settings"

export const revalidate = 60

interface Props {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const data = await sanityClient.fetch(blogBySlugQuery, {slug})
  if (!data) return {title: "Not found"}
  const og = sanityImageUrl(data.mainImage, {width: 1200, quality: 80})
  return {
    title: data.title,
    openGraph: og ? {images: [{url: og}]} : undefined,
  }
}

export default async function BlogPostPage({params}: Props) {
  const {slug} = await params
  const [data, settings] = await Promise.all([
    sanityClient.fetch(blogBySlugQuery, {slug}),
    getSiteSettings(),
  ])

  if (!data) notFound()

  const title: string = data.title || slug
  const publishedAt: string | null = data.publishedAt || null

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <MainContent className="flex-1 w-full flex items-center justify-center pb-[42px]">
        <article className="w-full max-w-[1110px] px-[24px] md:px-[40px] pt-[99px] pb-[99px] mk-glass-blur-18 mk-blog space-y-[24px]">
          <header className="space-y-[8px]">
            <div className="text-[11px] tracking-[0.16em] text-[#ef4444]">博客</div>
            <h1 className="text-[24px] md:text-[30px] font-normal leading-tight">{title}</h1>
            {publishedAt ? (
              <div className="text-[11px] text-gray-300/80">
                <span>发布日期：{new Date(publishedAt).toLocaleDateString("zh-CN")}</span>
              </div>
            ) : null}
          </header>

          <section className="flex flex-col items-center justify-center w-full space-y-[16px] text-[13px] leading-relaxed text-gray-100/90">
            {data.body ? <PortableBody value={data.body} /> : <p>正文暂未填写。</p>}
          </section>
        </article>
      </MainContent>
      <Footer nav={settings.footerNav} copyright={settings.copyright} />
    </div>
  )
}
