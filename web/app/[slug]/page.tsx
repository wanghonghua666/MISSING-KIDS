import type {Metadata} from "next"
import {notFound} from "next/navigation"
import {SiteHeader} from "@/components/layout/site-header"
import {Footer} from "@/components/layout/footer"
import {MainContent} from "@/components/layout/main-content"
import {PortableBody} from "@/components/blog/portable-body"
import {sanityClient} from "@/lib/sanity.client"
import {allPageSlugsQuery, pageBySlugQuery} from "@/lib/sanity.queries"
import {getSiteSettings} from "@/lib/site-settings"

export const revalidate = 60

const RESERVED = new Set(["home", "work", "blog", "product", "api", "page"])

interface Props {
  params: Promise<{slug: string}>
}

export async function generateStaticParams() {
  const rows = (await sanityClient.fetch(allPageSlugsQuery)) as {slug: string}[]
  return (rows ?? [])
    .filter((row) => row.slug && !RESERVED.has(row.slug))
    .map((row) => ({slug: row.slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  if (RESERVED.has(slug)) return {title: "Not found"}
  const data = await sanityClient.fetch(pageBySlugQuery, {slug})
  if (!data) return {title: "Not found"}
  return {title: data.title}
}

export default async function CmsPage({params}: Props) {
  const {slug} = await params
  if (RESERVED.has(slug)) notFound()

  const [data, settings] = await Promise.all([
    sanityClient.fetch(pageBySlugQuery, {slug}),
    getSiteSettings(),
  ])

  if (!data) notFound()

  return (
    <div className="w-full min-h-screen flex flex-col">
      <SiteHeader />
      <MainContent className="flex-1 w-full flex items-center justify-center pb-[42px]">
        <article className="w-full max-w-[1110px] px-[24px] md:px-[40px] pt-[99px] pb-[99px] mk-glass-blur-18 mk-blog space-y-[24px]">
          <header className="space-y-[8px]">
            <h1 className="text-[24px] md:text-[30px] font-normal leading-tight">{data.title}</h1>
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
