import {Header} from "@/components/layout/header"
import {getSiteSettings} from "@/lib/site-settings"

export async function SiteHeader() {
  const settings = await getSiteSettings()
  return <Header items={settings.headerNav} />
}
