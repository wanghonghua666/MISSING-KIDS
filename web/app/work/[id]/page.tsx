import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MainContent } from "@/components/layout/main-content"
import { TransitionLink } from "@/components/layout/transition-link"
import Image from "next/image"

interface Props {
  params: {
    id: string
  }
}

export default function WorkDetailPage({ params }: Props) {
  const id = params.id

  const title = `Product #${id}`
  const price = "¥199"

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <div className="mk-header-spacer" aria-hidden />
      <MainContent className="flex-1 w-full flex items-center justify-center pb-[42px]">
        <div className="w-full max-w-[960px] flex flex-col md:flex-row gap-[40px] p-[32px] md:p-[48px] mk-glass-blur-18 mk-work-layout">
          <div className="w-full md:w-[486px] h-[600px] bg-white/5 rounded-xl overflow-hidden flex items-start justify-center mk-product-hero">
            <div className="relative w-[240px] h-[240px]">
              <Image src="/logo.png" alt={title} fill sizes="240px" className="object-contain" />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-[24px] mk-mono">
            <div className="flex flex-col gap-[8px]">
              <span className="text-[12px] tracking-[0.3em] text-[#ef4444]">PRODUCT DETAIL</span>
              <h1 className="text-[24px] md:text-[28px] font-bold leading-tight">{title}</h1>
            </div>

            <div className="text-[18px] font-bold text-[#ef4444]">{price}</div>

            <div className="text-[13px] leading-relaxed text-gray-200/90 space-y-[8px]">
              <p>这是一个占位商品介绍页面，用于未来自动生成真实的商品文案与图片。</p>
              <p>当前版本只展示基本信息和版式，保持与现有站点视觉语言一致。</p>
            </div>

            <div className="mt-[16px] flex flex-wrap gap-[12px] text-[12px] text-gray-300/90">
              <span className="px-[10px] py-[4px] border border-white/20 rounded-full">Size: ONE SIZE</span>
              <span className="px-[10px] py-[4px] border border-white/20 rounded-full">Color: DEFAULT</span>
            </div>

            <div className="mt-auto flex gap-[16px] text-[12px]">
              <button className="px-[16px] py-[8px] text-[#ef4444] mk-hover-bright">
                以后在这里下单
              </button>
              <TransitionLink
                href="/work"
                transitionMs={360}
                className="px-[16px] py-[8px] border border-white/20 text-white/80 rounded-full mk-hover-bright"
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

