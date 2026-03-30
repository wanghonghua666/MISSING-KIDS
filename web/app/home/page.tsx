import { HomeClient } from "./home-client"
import { getBlogPostsForCarousel } from "@/lib/blog-posts-carousel"

export default async function HomePage() {
  const carouselPosts = await getBlogPostsForCarousel()
  return <HomeClient carouselPosts={carouselPosts} />
}
