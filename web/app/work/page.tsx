import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SidebarFilter } from "@/components/work/sidebar-filter"
import { MainContent } from "@/components/layout/main-content"
import Image from "next/image"

export default function WorkPage() {
  const items = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    image: "/logo.png",
    title: "Product",
    price: "¥199",
  }))

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <div className="mk-header-spacer" aria-hidden />
      <MainContent className="flex-1 w-full flex items-stretch justify-center pb-[42px]">
        <div className="w-full max-w-[1438px] flex justify-around gap-[48px] p-[48px] mk-work-layout">
          <SidebarFilter />
          {/* mobile only: "ALL ITEMS" label replaces sidebar */}
          <span className="mk-mobile-all-items mk-mono text-[16px] font-bold text-white">ALL ITEMS</span>
          <div className="flex-1 flex flex-col gap-[16px]">
            <div className="mk-product-grid grid grid-cols-[repeat(6,180px)] gap-[16px]">
              {items.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="group relative w-[180px] h-[180px] bg-white/5 overflow-hidden mk-product-card"
                >
                  <Image src={item.image} alt="Product" fill sizes="180px" className="object-cover" priority={item.id < 2} />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="mk-mono mk-product-overlay-box">
                      <span className="text-[12px] font-bold text-[#ef4444]">{item.title}</span>
                      <span className="text-[12px] font-bold text-[#ef4444]">{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mk-product-grid grid grid-cols-[repeat(6,180px)] gap-[16px]">
              {items.slice(6, 12).map((item) => (
                <div
                  key={item.id}
                  className="group relative w-[180px] h-[180px] bg-white/5 overflow-hidden mk-product-card"
                >
                  <Image src={item.image} alt="Product" fill sizes="180px" className="object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="mk-mono mk-product-overlay-box">
                      <span className="text-[12px] font-bold text-[#ef4444]">{item.title}</span>
                      <span className="text-[12px] font-bold text-[#ef4444]">{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MainContent>
      <Footer />
    </div>
  )
}
