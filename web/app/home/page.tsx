import {HomeClient} from "./home-client"
import {getBlogPostsForCarousel} from "@/lib/blog-posts-carousel"
import {getSiteSettings} from "@/lib/site-settings"

export const revalidate = 60

export default async function HomePage() {
  const [carouselPosts, settings] = await Promise.all([getBlogPostsForCarousel(), getSiteSettings()])
  return (
    <HomeClient
      carouselPosts={carouselPosts}
      footerNav={settings.footerNav}
      copyright={settings.copyright}
    />
  )
}
