import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MainContent } from "@/components/layout/main-content"
import { TransitionLink } from "@/components/layout/transition-link"
import { sanityClient } from "@/lib/sanity.client"
import Image from "next/image"

interface Props {
  params: Promise<{ id: string }>
}

const productBySlugQuery = `
*[_type == "product" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  "image": mainImage{
    asset->{
      _id,
      url
    },
    alt
  },
  price,
  description
}
`

export default async function WorkDetailPage({ params }: Props) {
  const { id } = await params
  const slug = id
  const product = await sanityClient.fetch(productBySlugQuery, { slug })

  if (!product) {
    return (
      <div className="w-full min-h-screen flex flex-col">
        <Header />
        <div className="mk-header-spacer" aria-hidden />
        <MainContent className="flex-1 w-full flex items-start justify-center gap-0 pt-[180px] pb-[90px] pl-[40px] pr-[40px] mt-[90px] mb-[90px]">
          <div className="mk-mono text-sm text-gray-300/80">这个商品还没有在 Sanity 中配置。</div>
        </MainContent>
        <Footer />
      </div>
    )
  }

  const title: string = product.title
  const price: string = product.price ?? "¥0"

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <div className="mk-header-spacer" aria-hidden />
      <MainContent className="flex-1 w-full flex items-start justify-center gap-0 pt-[180px] pb-[90px] pl-[40px] pr-[40px] mt-[90px] mb-[90px]">
        <div className="w-full max-w-[960px] md:max-w-[1280px] flex flex-col md:flex-row gap-[40px] p-[32px] md:p-[48px] mk-glass-blur-18 mk-work-layout">
          <div className="w-full md:w-[1000px] h-fit rounded-xl overflow-y-auto overflow-x-hidden flex flex-col items-center mk-product-hero mk-product-hero-scroll">
            <div className="flex flex-col items-center gap-[24px] py-[24px] shrink-0">
              <div className="relative w-[500px] md:w-[700px] shrink-0 mk-product-hero-img-wrap">
                <Image src={product.image?.asset?.url || "/logo.png"} alt={title} fill sizes="(min-width: 769px) 1000px, 500px" className="object-contain" />
              </div>
              {/* 可在此追加更多图片，会在此框内垂直滚动 */}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-start gap-[24px] mk-mono mk-product-detail-content">
            <div className="flex flex-col gap-[8px]">
              <span className="text-[12px] tracking-[0.3em] text-[#ef4444]">PRODUCT DETAIL</span>
              <h1 className="text-[24px] md:text-[28px] font-bold leading-tight">{title}</h1>
            </div>

            <div className="text-[18px] font-bold text-[#ef4444]">{price}</div>

            <div className="text-[13px] leading-relaxed text-[rgba(99,99,99,0.9)] space-y-[8px]">
              {product.description ? (
                <p>{product.description}</p>
              ) : (
                <>
                  <p>这是一个占位商品介绍页面，用于未来自动生成真实的商品文案与图片。</p>
                  <p>当前版本只展示基本信息和版式，保持与现有站点视觉语言一致。</p>
                </>
              )}
            </div>

            <div className="mt-[16px] flex flex-wrap gap-[12px] text-[12px] text-[rgba(41,41,41,0.9)]">
              <span className="px-[10px] py-[4px] rounded-full">Size: ONE SIZE</span>
              <span className="px-[10px] py-[4px] rounded-full">Color: DEFAULT</span>
            </div>

            <div className="mt-auto flex gap-[16px] text-[12px]">
              <button className="px-[16px] py-[8px] text-[#ef4444] mk-hover-bright">
                以后在这里下单
              </button>
              <TransitionLink
                href="/work"
                transitionMs={360}
                className="px-[16px] py-[8px] text-white/80 rounded-full mk-hover-bright"
              >
                返回商品列表
              </TransitionLink>
            </div>
          </div>
        </div>
      </MainContent>
      <Footer />
    </div>
  )
}

