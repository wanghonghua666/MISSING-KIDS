import {NextResponse} from "next/server"
import {isAllowedKnockoutSource, knockoutBackground} from "@/lib/knockout-background"

export const runtime = "nodejs"

const FETCH_TIMEOUT_MS = 12000

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
      return NextResponse.json({error: "原图读取失败。"}, {status: 502})
    }
    const input = Buffer.from(await upstream.arrayBuffer())
    const result = await knockoutBackground(input)
    const contentType = result.knocked
      ? "image/png"
      : upstream.headers.get("content-type") || result.contentType

    return new NextResponse(new Uint8Array(result.body), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
        "X-Knockout": result.knocked ? "1" : "0",
      },
    })
  } catch {
    return NextResponse.json({error: "去背失败。"}, {status: 502})
  }
}
