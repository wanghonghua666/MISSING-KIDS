import * as React from "react"

function toInspostEmbedUrl(rawUrl: string) {
  try {
    const u = new URL(rawUrl)
    const host = u.hostname.toLowerCase()

    // Instagram: 推荐的 iframe 地址是 `/embed/`，直接用 `/p/...` 往往会被 X-Frame-Options 拦掉
    if (host === "www.instagram.com" || host === "instagram.com") {
      const parts = u.pathname.split("/").filter(Boolean)
      if (parts.length >= 2 && parts[0] === "p") {
        const shortcode = parts[1]
        return `https://www.instagram.com/p/${shortcode}/embed/`
      }
      if (parts.length >= 2 && parts[0] === "reel") {
        const shortcode = parts[1]
        return `https://www.instagram.com/reel/${shortcode}/embed/`
      }
    }

    return rawUrl
  } catch {
    return rawUrl
  }
}

export default function InspostUrlInput(props: any) {
  const { renderDefault, value } = props

  const rawUrl: string =
    typeof value === "string" ? value : typeof value?.url === "string" ? value.url : ""

  const embedUrl = rawUrl ? toInspostEmbedUrl(rawUrl) : ""

  return (
    <div>
      {renderDefault?.(props)}

      {embedUrl ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>预览（iframe）</div>
          <iframe
            src={embedUrl}
            title="Inspost preview"
            style={{ width: "100%", height: 520, border: 0, borderRadius: 8 }}
            loading="lazy"
            referrerPolicy="no-referrer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          <div style={{ marginTop: 8, fontSize: 12 }}>
            <a href={embedUrl} target="_blank" rel="noreferrer" style={{ color: "#ef4444" }}>
              打开原始 embed 链接
            </a>
          </div>
        </div>
      ) : null}
    </div>
  )
}

