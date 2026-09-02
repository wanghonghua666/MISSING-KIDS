import {NextResponse} from "next/server"
import {isAllowedKnockoutSource, knockoutBackground} from "@/lib/knockout-background"

export const runtime = "nodejs"
export const maxDuration = 30

const FETCH_TIMEOUT_MS = 12000

function passthrough(body: Buffer, contentType: string) {
  return new NextResponse(new Uint8Array(body), {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      "X-Knockout": "0",
    },
  })
}

export async function GET(request: Request) {
  const rawUrl = new URL(request.url).searchParams.get("url")?.trim() || ""
  if (!rawUrl || !isAllowedKnockoutSource(rawUrl)) {
    return NextResponse.json({error: "不支持的图片地址。"}, {status: 400})
  }

  try {
    const upstream = await fetch(rawUrl, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {Accept: "image/png,image/jpeg,image/webp,image/*,*/*"},
    })
    if (!upstream.ok) {
      return NextResponse.redirect(rawUrl, 302)
    }
    const input = Buffer.from(await upstream.arrayBuffer())
    const upstreamType = upstream.headers.get("content-type") || "application/octet-stream"
    try {
      const result = await knockoutBackground(input)
      const contentType = result.knocked ? "image/png" : upstreamType || result.contentType
      return new NextResponse(new Uint8Array(result.body), {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
          "X-Knockout": result.knocked ? "1" : "0",
        },
      })
    } catch {
      return passthrough(input, upstreamType)
    }
  } catch {
    return NextResponse.redirect(rawUrl, 302)
  }
}
