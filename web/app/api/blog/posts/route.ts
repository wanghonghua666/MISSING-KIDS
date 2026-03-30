import { getBlogPostsForCarousel } from "@/lib/blog-posts-carousel"
import { NextResponse } from "next/server"

export async function GET() {
  const rows = await getBlogPostsForCarousel()
  const posts = rows.map((p) => ({
    _id: p._id,
    title: p.title,
    slug: p.slug,
    publishedAt: p.publishedAt,
    previewImageUrl: p.previewImageUrl,
    mainImage: p.previewImageUrl ? { alt: p.imageAlt } : null,
  }))
  return NextResponse.json({ posts })
}

