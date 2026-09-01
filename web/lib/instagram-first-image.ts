const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
const BOT_UA = "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"

const MAX_BYTES = 12 * 1024 * 1024
const MIN_BYTES = 2 * 1024

export type InstagramPostRef = {
  kind: "p" | "reel" | "tv"
  shortcode: string
  canonical: string
}

export type InstagramImageResult = {
  bytes: Uint8Array
  contentType: string
  filename: string
}

export class InstagramImageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "InstagramImageError"
  }
}

export function parseInstagramPostUrl(raw: string): InstagramPostRef | null {
  let url: URL
  try {
    url = new URL(raw.trim())
  } catch {
    return null
  }

  const host = url.hostname.replace(/^www\./i, "").toLowerCase()
  if (host !== "instagram.com" && host !== "instagr.am") return null

  const parts = url.pathname.split("/").filter(Boolean)
  let kind: InstagramPostRef["kind"] | null = null
  let shortcode: string | null = null

  if (parts.length >= 2 && isPostKind(parts[0])) {
    kind = parts[0]
    shortcode = parts[1]
  } else if (parts.length >= 3 && isPostKind(parts[1])) {
    kind = parts[1]
    shortcode = parts[2]
  }

  if (!kind || !shortcode || !/^[A-Za-z0-9_-]+$/.test(shortcode)) return null

  return {
    kind,
    shortcode,
    canonical: `https://www.instagram.com/${kind}/${shortcode}/`,
  }
}

export async function fetchInstagramFirstImage(rawUrl: string): Promise<InstagramImageResult> {
  const post = parseInstagramPostUrl(rawUrl)
  if (!post) {
    throw new InstagramImageError("请粘贴完整的 Instagram 帖子链接（/p/ 或 /reel/）。")
  }

  const media = await tryMediaEndpoint(post)
  if (media) return media

  const fromHtml = await tryHtmlMetadata(post)
  if (fromHtml) return fromHtml

  const fromOembed = await tryOembedThumbnail(post)
  if (fromOembed) return fromOembed

  throw new InstagramImageError(
    "Instagram 没有返回这张帖子的公开图片。常见原因：私密账号、禁止嵌入，或该帖已失效。请改用 Upload 上传。",
  )
}

function isPostKind(value: string): value is InstagramPostRef["kind"] {
  return value === "p" || value === "reel" || value === "tv"
}

function isAllowedImageHost(hostname: string) {
  const host = hostname.toLowerCase()
  return (
    host === "instagram.com" ||
    host.endsWith(".instagram.com") ||
    host.endsWith(".cdninstagram.com") ||
    host.endsWith(".fbcdn.net")
  )
}

function sniffImageType(bytes: Uint8Array, fallback: string) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg"
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png"
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp"
  }
  if (fallback.startsWith("image/") && fallback !== "image/svg+xml") return fallback.split(";")[0]
  return null
}

function extensionFor(contentType: string) {
  if (contentType.includes("png")) return "png"
  if (contentType.includes("webp")) return "webp"
  if (contentType.includes("gif")) return "gif"
  return "jpg"
}

async function downloadImage(imageUrl: string): Promise<InstagramImageResult | null> {
  let parsed: URL
  try {
    parsed = new URL(imageUrl)
  } catch {
    return null
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null
  if (!isAllowedImageHost(parsed.hostname)) return null

  const res = await fetch(parsed, {
    headers: {Accept: "image/*,*/*;q=0.8", "User-Agent": BROWSER_UA},
    redirect: "follow",
  })
  if (!res.ok) return null

  const buf = new Uint8Array(await res.arrayBuffer())
  if (buf.byteLength > MAX_BYTES || buf.byteLength < MIN_BYTES) return null

  const finalHost = new URL(res.url).hostname
  if (!isAllowedImageHost(finalHost)) return null

  const contentType = sniffImageType(buf, res.headers.get("content-type") || "")
  if (!contentType) return null

  const post = parseInstagramPostUrl(imageUrl)
  const name = post?.shortcode || "instagram"
  return {
    bytes: buf,
    contentType,
    filename: `instagram-${name}.${extensionFor(contentType)}`,
  }
}

async function tryMediaEndpoint(post: InstagramPostRef) {
  const kinds: InstagramPostRef["kind"][] =
    post.kind === "p" ? ["p", "reel"] : post.kind === "reel" ? ["reel", "p"] : [post.kind, "p"]

  for (const kind of kinds) {
    for (const size of ["l", "m"] as const) {
      const image = await downloadImage(
        `https://www.instagram.com/${kind}/${post.shortcode}/media/?size=${size}`,
      )
      if (image) {
        return {
          ...image,
          filename: `instagram-${post.shortcode}.${extensionFor(image.contentType)}`,
        }
      }
    }
  }
  return null
}

function decodeEscapedUrl(raw: string) {
  return raw
    .replace(/\\u0026/gi, "&")
    .replace(/\\\//g, "/")
    .replace(/&amp;/g, "&")
}

function extractImageUrlsFromHtml(html: string) {
  const found: string[] = []
  const patterns = [
    /property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
    /name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
    /content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i,
    /"display_url"\s*:\s*"([^"]+)"/i,
    /"thumbnail_src"\s*:\s*"([^"]+)"/i,
    /"thumbnail_url"\s*:\s*"([^"]+)"/i,
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) found.push(decodeEscapedUrl(match[1]))
  }

  for (const match of html.matchAll(/https:\\\/\\\/scontent[^"'\\\s]+/gi)) {
    found.push(decodeEscapedUrl(match[0]))
  }

  return [...new Set(found)].filter((href) => {
    try {
      const host = new URL(href).hostname.toLowerCase()
      return isAllowedImageHost(host) && !host.includes("static.cdninstagram.com")
    } catch {
      return false
    }
  })
}

async function tryHtmlMetadata(post: InstagramPostRef) {
  const pages = [post.canonical, `${post.canonical}embed/`]
  for (const page of pages) {
    const res = await fetch(page, {
      headers: {Accept: "text/html", "User-Agent": BOT_UA},
      redirect: "follow",
    })
    if (!res.ok) continue
    const html = await res.text()
    for (const imageUrl of extractImageUrlsFromHtml(html)) {
      const image = await downloadImage(imageUrl)
      if (image) {
        return {
          ...image,
          filename: `instagram-${post.shortcode}.${extensionFor(image.contentType)}`,
        }
      }
    }
  }
  return null
}

async function tryOembedThumbnail(post: InstagramPostRef) {
  const endpoint = `https://graph.facebook.com/v22.0/instagram_oembed?url=${encodeURIComponent(post.canonical)}`
  const res = await fetch(endpoint, {headers: {Accept: "application/json"}})
  if (!res.ok) return null

  let data: {thumbnail_url?: string; html?: string}
  try {
    data = (await res.json()) as {thumbnail_url?: string; html?: string}
  } catch {
    return null
  }

  const candidates = [
    ...(typeof data.thumbnail_url === "string" ? [data.thumbnail_url] : []),
    ...extractImageUrlsFromHtml(typeof data.html === "string" ? data.html : ""),
  ]

  for (const imageUrl of candidates) {
    const image = await downloadImage(imageUrl)
    if (image) {
      return {
        ...image,
        filename: `instagram-${post.shortcode}.${extensionFor(image.contentType)}`,
      }
    }
  }
  return null
}
