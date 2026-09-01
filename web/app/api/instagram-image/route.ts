import {fetchInstagramFirstImage, InstagramImageError} from "@/lib/instagram-first-image"
import {NextResponse} from "next/server"

export const dynamic = "force-dynamic"

function isAllowedOrigin(origin: string) {
  try {
    const url = new URL(origin)
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      return url.port === "3333" || url.port === "3000" || url.port === "3001"
    }
    return url.hostname === "sanity.studio" || url.hostname.endsWith(".sanity.studio")
  } catch {
    return false
  }
}

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin")
  const headers = new Headers()
  headers.set("Vary", "Origin")
  headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")
  headers.set("Access-Control-Allow-Headers", "Content-Type")
  if (origin && isAllowedOrigin(origin)) {
    headers.set("Access-Control-Allow-Origin", origin)
  }
  return headers
}

function jsonError(request: Request, message: string, status: number) {
  const headers = corsHeaders(request)
  headers.set("Content-Type", "application/json; charset=utf-8")
  return new NextResponse(JSON.stringify({error: message}), {status, headers})
}

export function OPTIONS(request: Request) {
  return new NextResponse(null, {status: 204, headers: corsHeaders(request)})
}

export async function GET(request: Request) {
  const rawUrl = new URL(request.url).searchParams.get("url")?.trim() || ""
  if (!rawUrl) {
    return jsonError(request, "缺少 Instagram 帖子链接。", 400)
  }

  try {
    const image = await fetchInstagramFirstImage(rawUrl)
    const headers = corsHeaders(request)
    headers.set("Content-Type", image.contentType)
    headers.set("Cache-Control", "private, max-age=60")
    headers.set("Content-Disposition", `inline; filename="${image.filename}"`)
    return new NextResponse(Buffer.from(image.bytes), {status: 200, headers})
  } catch (error) {
    const message =
      error instanceof InstagramImageError
        ? error.message
        : "抓取 Instagram 图片失败，请稍后再试或改用 Upload。"
    return jsonError(request, message, error instanceof InstagramImageError ? 422 : 502)
  }
}
