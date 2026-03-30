import * as React from "react"
import {PatchEvent, set} from "sanity"

function toInspostEmbedUrl(rawUrl: string) {
  try {
    const u = new URL(rawUrl)
    const host = u.hostname.toLowerCase()
    if (host === "www.instagram.com" || host === "instagram.com") {
      const parts = u.pathname.split("/").filter(Boolean)
      if (parts.length >= 2 && parts[0] === "p") {
        return `https://www.instagram.com/p/${parts[1]}/embed/`
      }
      if (parts.length >= 2 && parts[0] === "reel") {
        return `https://www.instagram.com/reel/${parts[1]}/embed/`
      }
    }
    return rawUrl
  } catch {
    return rawUrl
  }
}

export default function InspostInput(props: any) {
  const {renderDefault, value, onChange} = props

  const url: string = typeof value?.url === "string" ? value.url : ""
  const height: number = typeof value?.height === "number" ? value.height : 520
  const embedUrl = url ? toInspostEmbedUrl(url) : ""

  const setHeight = React.useCallback(
    (h: number) => {
      onChange?.(PatchEvent.from(set(h, ["height"])))
    },
    [onChange],
  )

  return (
    <div>
      {renderDefault?.(props)}

      {embedUrl ? (
        <div style={{marginTop: 12}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12}}>
            <div style={{fontSize: 12, opacity: 0.7}}>可视化预览（拖动/滑杆调高度）</div>
            <div style={{display: "flex", alignItems: "center", gap: 10}}>
              <span style={{fontSize: 12, opacity: 0.7}}>{height}px</span>
              <input
                type="range"
                min={200}
                max={2000}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
              />
            </div>
          </div>

          <div style={{marginTop: 10, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)"}}>
            <iframe
              src={embedUrl}
              title={value?.title || "Inspost preview"}
              style={{width: "100%", height, border: 0}}
              loading="lazy"
              referrerPolicy="no-referrer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

