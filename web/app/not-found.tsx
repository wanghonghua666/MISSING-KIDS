import {SiteHeader} from "@/components/layout/site-header"
import {Footer} from "@/components/layout/footer"
import {MainContent} from "@/components/layout/main-content"
import {getSiteSettings} from "@/lib/site-settings"

export default async function NotFound() {
  const settings = await getSiteSettings()
  return (
    <div className="w-full min-h-screen flex flex-col">
      <SiteHeader />
      <MainContent className="flex-1 w-full flex items-center justify-center pb-[42px]">
        <div className="mk-mono text-sm text-gray-300/80">页面不存在。</div>
      </MainContent>
      <Footer nav={settings.footerNav} copyright={settings.copyright} />
    </div>
  )
}
