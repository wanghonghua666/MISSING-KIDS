export type EmbedKind =
  | "instagram"
  | "youtube"
  | "twitter"
  | "soundcloud"
  | "tiktok"
  | "vimeo"
  | "generic"

export type ResolvedEmbed = {
  src: string
  kind: EmbedKind
  label: string
  defaultHeight: number
  permalink?: string
}

function hostname(rawUrl: string): string | null {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, "").toLowerCase()
  } catch {
    return null
  }
}

export function toYoutubeEmbedUrl(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl)
    const host = url.hostname.replace(/^www\./, "").toLowerCase()

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0]
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      const parts = url.pathname.split("/").filter(Boolean)
      const fromPath =
        parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live" ? parts[1] : parts.at(-1)
      const id = url.searchParams.get("v") || fromPath
      if (id && id !== "watch" && id !== "embed") {
        return `https://www.youtube-nocookie.com/embed/${id}`
      }
    }

    return null
  } catch {
    return null
  }
}

export function toTweetEmbedUrl(rawUrl: string): string | null {
  const match = rawUrl.match(/status\/(\d+)/)
  return match ? `https://platform.twitter.com/embed/Tweet.html?id=${match[1]}` : null
}

export function toSoundCloudEmbedUrl(rawUrl: string): string {
  if (rawUrl.includes("w.soundcloud.com/player")) return rawUrl
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(rawUrl)}&color=%23ef4444&inverse=true&auto_play=false&show_user=true`
}

function instagramPostParts(rawUrl: string): {kind: string; shortcode: string} | null {
  try {
    const url = new URL(rawUrl)
    const host = url.hostname.replace(/^www\./, "").toLowerCase()
    if (host !== "instagram.com" && host !== "instagr.am") return null
    const parts = url.pathname.split("/").filter(Boolean)
    const kindIndex = parts[0] === "p" || parts[0] === "reel" || parts[0] === "tv" ? 0 : parts[1] === "p" || parts[1] === "reel" || parts[1] === "tv" ? 1 : -1
    if (kindIndex < 0) return null
    const kind = parts[kindIndex]
    const shortcode = parts[kindIndex + 1]
    if (!kind || !shortcode || shortcode === "embed") return null
    return {kind, shortcode}
  } catch {
    return null
  }
}

export function toInstagramPermalink(rawUrl: string): string | null {
  const post = instagramPostParts(rawUrl)
  return post ? `https://www.instagram.com/${post.kind}/${post.shortcode}/` : null
}

export function toInstagramEmbedUrl(rawUrl: string): string {
  const post = instagramPostParts(rawUrl)
  if (!post) return rawUrl
  return `https://www.instagram.com/${post.kind}/${post.shortcode}/embed/captioned/?cr=1&v=14`
}

function toTikTokEmbedUrl(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl)
    const host = url.hostname.replace(/^www\./, "").toLowerCase()
    if (host !== "tiktok.com" && host !== "vm.tiktok.com") return null
    const parts = url.pathname.split("/").filter(Boolean)
    const videoIdx = parts.indexOf("video")
    const id = videoIdx >= 0 ? parts[videoIdx + 1] : parts[0] === "embed" || parts[0] === "embed-v2" ? parts[1] : null
    return id ? `https://www.tiktok.com/embed/v2/${id}` : null
  } catch {
    return null
  }
}

function toVimeoEmbedUrl(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl)
    const host = url.hostname.replace(/^www\./, "").toLowerCase()
    if (host === "player.vimeo.com") {
      const id = url.pathname.split("/").filter(Boolean).at(-1)
      return id ? `https://player.vimeo.com/video/${id}` : null
    }
    if (host !== "vimeo.com") return null
    const id = url.pathname.split("/").filter(Boolean).find((part) => /^\d+$/.test(part))
    return id ? `https://player.vimeo.com/video/${id}` : null
  } catch {
    return null
  }
}

function isSoundCloudUrl(rawUrl: string) {
  const host = hostname(rawUrl)
  return host === "soundcloud.com" || host === "w.soundcloud.com" || host === "on.soundcloud.com"
}

function isTwitterUrl(rawUrl: string) {
  const host = hostname(rawUrl)
  return host === "twitter.com" || host === "x.com" || host === "mobile.twitter.com"
}

export function resolveEmbed(rawUrl: string): ResolvedEmbed {
  const youtube = toYoutubeEmbedUrl(rawUrl)
  if (youtube) {
    return {src: youtube, kind: "youtube", label: "YouTube", defaultHeight: 405}
  }

  const instagramPermalink = toInstagramPermalink(rawUrl)
  if (instagramPermalink) {
    return {
      src: toInstagramEmbedUrl(rawUrl),
      permalink: instagramPermalink,
      kind: "instagram",
      label: "Instagram",
      defaultHeight: 680,
    }
  }

  if (isTwitterUrl(rawUrl)) {
    const tweet = toTweetEmbedUrl(rawUrl)
    if (tweet) {
      return {src: tweet, kind: "twitter", label: "X / Twitter", defaultHeight: 480}
    }
  }

  if (isSoundCloudUrl(rawUrl)) {
    return {src: toSoundCloudEmbedUrl(rawUrl), kind: "soundcloud", label: "SoundCloud", defaultHeight: 166}
  }

  const tiktok = toTikTokEmbedUrl(rawUrl)
  if (tiktok) {
    return {src: tiktok, kind: "tiktok", label: "TikTok", defaultHeight: 740}
  }

  const vimeo = toVimeoEmbedUrl(rawUrl)
  if (vimeo) {
    return {src: vimeo, kind: "vimeo", label: "Vimeo", defaultHeight: 405}
  }

  return {src: rawUrl, kind: "generic", label: "Embedded", defaultHeight: 520}
}
