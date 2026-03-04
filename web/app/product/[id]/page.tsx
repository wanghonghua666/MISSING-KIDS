import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function ProductPage({ params }: { params: { id: string } }) {
  void params

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full flex items-stretch justify-center">
        <div className="w-full max-w-[1440px] flex justify-between gap-[64px] p-[64px]">
          <div className="w-[713px] h-[696px] rounded-[16px] bg-black/20 flex items-center justify-center">
            <div className="mk-mono text-[14px] font-normal text-white/30">Product Image</div>
          </div>

          <div className="w-[516px] flex flex-col gap-[24px] pt-[6px]">
            <div className="mk-mono text-[32px] font-normal text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
              Missing Kids T-Shirt 01
            </div>
            <div className="mk-mono text-[24px] font-semibold text-[#ef4444]">
              ¥ 199.00
            </div>
            <div className="mk-mono w-[512px] text-[16px] font-normal text-[#6b6b6b]">
              High quality cotton t-shirt with Missing Kids logo. All proceeds go to supporting the search for missing children.
            </div>

            <div className="w-[123px] h-[32px] rounded-[8px] bg-[#ef4444] px-[48px] flex items-center justify-center mk-hover-bright transition-[filter] cursor-pointer">
              <div className="mk-mono text-[16px] font-bold text-white">DM On Ins</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
