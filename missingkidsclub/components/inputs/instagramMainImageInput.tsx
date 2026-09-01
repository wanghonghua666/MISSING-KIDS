import * as React from "react"
import {ImageInputProps, set, useClient, useFormValue} from "sanity"

const SITE_URL = process.env.SANITY_STUDIO_SITE_URL || "http://localhost:3001"

type BodyBlock = {
  _type?: string
  url?: string
}

function isInstagramUrl(rawUrl: string) {
  try {
    const host = new URL(rawUrl).hostname.replace(/^www\./, "").toLowerCase()
    return host === "instagram.com"
  } catch {
    return false
  }
}

function firstInspostUrl(body: unknown) {
  if (!Array.isArray(body)) return ""
  for (const block of body as BodyBlock[]) {
    if (block?._type === "inspost" && typeof block.url === "string" && isInstagramUrl(block.url)) {
      return block.url.trim()
    }
  }
  return ""
}

export default function InstagramMainImageInput(props: ImageInputProps) {
  const {renderDefault, value, onChange} = props
  const client = useClient({apiVersion: "2025-01-01"})
  const body = useFormValue(["body"])
  const inspostUrl = firstInspostUrl(body)

  const [url, setUrl] = React.useState(inspostUrl)
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    if (!url && inspostUrl) setUrl(inspostUrl)
  }, [inspostUrl, url])

  const grab = React.useCallback(async () => {
    const postUrl = url.trim() || inspostUrl
    if (!postUrl) {
      setError("请先粘贴 Instagram 帖子链接，或在正文里加上 Instagram 嵌入。")
      return
    }

    setBusy(true)
    setError("")
    try {
      const endpoint = `${SITE_URL.replace(/\/$/, "")}/api/instagram-image?url=${encodeURIComponent(postUrl)}`
      const res = await fetch(endpoint)
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as {error?: string} | null
        throw new Error(payload?.error || `抓取失败（${res.status}）`)
      }

      const blob = await res.blob()
      if (!blob.type.startsWith("image/")) {
        throw new Error("返回的不是图片，请改用 Upload。")
      }

      const ext = blob.type.includes("png") ? "png" : blob.type.includes("webp") ? "webp" : "jpg"
      const asset = await client.assets.upload("image", blob, {
        filename: `instagram-main.${ext}`,
        source: {name: "instagram", id: postUrl, url: postUrl},
      })

      onChange(
        set({
          ...(value || {}),
          _type: "image",
          asset: {_type: "reference", _ref: asset._id},
        }),
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : "抓取失败"
      if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
        setError(`无法连接 ${SITE_URL}。请先启动网站（web）开发服务后再试。`)
      } else {
        setError(message)
      }
    } finally {
      setBusy(false)
    }
  }, [client, inspostUrl, onChange, url, value])

  return (
    <div>
      <div
        style={{
          marginBottom: 12,
          padding: 12,
          border: "1px solid var(--card-border-color, rgba(0,0,0,0.12))",
          borderRadius: 6,
        }}
      >
        <div style={{fontSize: 13, fontWeight: 600, marginBottom: 8}}>从 Instagram 抓取第一张图</div>
        <div style={{fontSize: 12, opacity: 0.72, marginBottom: 10, lineHeight: 1.45}}>
          粘贴公开帖子的 /p/ 或 /reel/ 链接。若正文已有 Instagram 嵌入，会自动填入。私密或禁止嵌入的帖子无法抓取。
        </div>
        <div style={{display: "flex", gap: 8, alignItems: "center"}}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.instagram.com/p/..."
            disabled={busy}
            style={{
              flex: 1,
              minWidth: 0,
              height: 33,
              padding: "0 10px",
              borderRadius: 4,
              border: "1px solid var(--card-border-color, rgba(0,0,0,0.18))",
              background: "var(--card-bg-color, transparent)",
              color: "inherit",
            }}
          />
          <button
            type="button"
            onClick={grab}
            disabled={busy}
            style={{
              height: 33,
              padding: "0 12px",
              borderRadius: 4,
              border: 0,
              cursor: busy ? "wait" : "pointer",
              background: "#111",
              color: "#fff",
              whiteSpace: "nowrap",
            }}
          >
            {busy ? "抓取中…" : "抓取第一张图"}
          </button>
        </div>
        {error ? (
          <div style={{marginTop: 8, fontSize: 12, color: "#c43b3b", lineHeight: 1.45}}>{error}</div>
        ) : null}
      </div>
      {renderDefault(props)}
    </div>
  )
}
