import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MainContent } from "@/components/layout/main-content"

interface Props {
  params: {
    slug: string
  }
}

function formatSlug(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase())
}

export default function BlogPostPage({ params }: Props) {
  const title = formatSlug(params.slug || "untitled")

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <div className="mk-header-spacer" aria-hidden />
      <MainContent className="flex-1 w-full flex items-center justify-center pb-[42px]">
        <article className="w-full max-w-[840px] px-[24px] md:px-[40px] py-[32px] md:py-[40px] mk-glass-blur-18 mk-mono space-y-[24px]">
          <header className="space-y-[8px]">
            <div className="text-[11px] tracking-[0.3em] text-[#ef4444]">BLOG</div>
            <h1 className="text-[24px] md:text-[30px] font-bold leading-tight">{title}</h1>
            <div className="text-[11px] text-gray-300/80">
              <span>发布日期：待生成</span>
              <span className="mx-[8px] opacity-50">/</span>
              <span>分类：待生成</span>
            </div>
          </header>

          <section className="space-y-[16px] text-[13px] leading-relaxed text-gray-100/90">
            <p>这是一个博客文章模板页面，主要用于未来由自动化系统填充真实的内容与元数据。</p>
            <p>当前仅保证版式、排版和过渡行为与站点其他页面保持一致。</p>
          </section>

          <section className="border-t border-white/10 pt-[16px] space-y-[8px] text-[12px] text-gray-300/85">
            <p>后续自动化可以在这里插入：</p>
            <ul className="list-disc list-inside space-y-[4px]">
              <li>多段正文内容（markdown 转 HTML）</li>
              <li>图片区域（居中或全宽）</li>
              <li>引用、代码块或注释信息</li>
            </ul>
          </section>
        </article>
      </MainContent>
      <Footer />
    </div>
  )
}

