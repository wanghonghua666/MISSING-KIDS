import sharp from "sharp"

const MAX_EDGE = 2000
const BLACK_LUMA = 12
const WHITE_LUMA = 236
const MAX_CHROMA = 24
const VAR_LIMIT = 18
const NEAR_BLACK = 22
const NEAR_WHITE = 220

type Mode = "black" | "white"

function luma(r: number, g: number, b: number) {
  return 0.299 * r + 0.587 * g + 0.114 * b
}

function chroma(r: number, g: number, b: number) {
  return Math.max(r, g, b) - Math.min(r, g, b)
}

function idx(x: number, y: number, w: number) {
  return (y * w + x) * 4
}

function sampleLumaVariance(data: Buffer, x: number, y: number, w: number, h: number) {
  let n = 0
  let sum = 0
  let sumSq = 0
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const xx = x + dx
      const yy = y + dy
      if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue
      const i = idx(xx, yy, w)
      const yv = luma(data[i], data[i + 1], data[i + 2])
      n++
      sum += yv
      sumSq += yv * yv
    }
  }
  if (n < 4) return 0
  const mean = sum / n
  return Math.sqrt(Math.max(0, sumSq / n - mean * mean))
}

function isSolidBg(r: number, g: number, b: number, a: number, mode: Mode) {
  if (a < 24) return true
  if (chroma(r, g, b) > MAX_CHROMA) return false
  const y = luma(r, g, b)
  return mode === "black" ? y <= BLACK_LUMA : y >= WHITE_LUMA
}

function isNearBg(r: number, g: number, b: number, a: number, mode: Mode) {
  if (a < 24) return true
  if (chroma(r, g, b) > MAX_CHROMA + 10) return false
  const y = luma(r, g, b)
  return mode === "black" ? y <= NEAR_BLACK : y >= NEAR_WHITE
}

function hasRealAlpha(data: Buffer, w: number, h: number) {
  const stepX = Math.max(1, Math.floor(w / 24))
  const stepY = Math.max(1, Math.floor(h / 24))
  let n = 0
  let transparent = 0
  for (let y = 0; y < h; y += stepY) {
    for (let x = 0; x < w; x += stepX) {
      n++
      if (data[idx(x, y, w) + 3] < 40) transparent++
    }
  }
  return n > 0 && transparent / n > 0.02
}

function centerHasSubject(data: Buffer, w: number, h: number, mode: Mode) {
  const x0 = Math.floor(w * 0.28)
  const x1 = Math.floor(w * 0.72)
  const y0 = Math.floor(h * 0.28)
  const y1 = Math.floor(h * 0.72)
  let n = 0
  let subject = 0
  for (let y = y0; y < y1; y += 8) {
    for (let x = x0; x < x1; x += 8) {
      n++
      const i = idx(x, y, w)
      if (!isSolidBg(data[i], data[i + 1], data[i + 2], data[i + 3], mode)) subject++
    }
  }
  return n > 0 && subject / n > 0.08
}

function detectMode(data: Buffer, w: number, h: number): Mode | null {
  if (hasRealAlpha(data, w, h)) return null

  const points = [
    [0, 0],
    [w - 1, 0],
    [0, h - 1],
    [w - 1, h - 1],
    [Math.floor(w / 2), 0],
    [Math.floor(w / 2), h - 1],
    [0, Math.floor(h / 2)],
    [w - 1, Math.floor(h / 2)],
  ]
  let black = 0
  let white = 0
  for (const [x, y] of points) {
    const i = idx(x, y, w)
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const a = data[i + 3]
    if (a < 40) continue
    const yv = luma(r, g, b)
    const c = chroma(r, g, b)
    if (c <= MAX_CHROMA && yv <= BLACK_LUMA + 8) black++
    if (c <= MAX_CHROMA && yv >= WHITE_LUMA - 8) white++
  }
  const mode: Mode | null =
    black >= 6 && black > white ? "black" : white >= 6 && white > black ? "white" : null
  if (!mode) return null
  if (!centerHasSubject(data, w, h, mode)) return null
  return mode
}

function floodKnockout(data: Buffer, w: number, h: number, mode: Mode) {
  const seen = new Uint8Array(w * h)
  const qx = new Int32Array(w * h)
  const qy = new Int32Array(w * h)
  let qh = 0
  let qt = 0

  const enqueue = (x: number, y: number) => {
    const p = y * w + x
    if (seen[p]) return
    const i = idx(x, y, w)
    if (!isSolidBg(data[i], data[i + 1], data[i + 2], data[i + 3], mode)) return
    if (sampleLumaVariance(data, x, y, w, h) > VAR_LIMIT) return
    seen[p] = 1
    qx[qt] = x
    qy[qt] = y
    qt++
  }

  for (let x = 0; x < w; x++) {
    enqueue(x, 0)
    enqueue(x, h - 1)
  }
  for (let y = 0; y < h; y++) {
    enqueue(0, y)
    enqueue(w - 1, y)
  }

  while (qh < qt) {
    const x = qx[qh]
    const y = qy[qh]
    qh++
    data[idx(x, y, w) + 3] = 0
    if (x > 0) enqueue(x - 1, y)
    if (x + 1 < w) enqueue(x + 1, y)
    if (y > 0) enqueue(x, y - 1)
    if (y + 1 < h) enqueue(x, y + 1)
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = idx(x, y, w)
      if (data[i + 3] === 0) continue
      if (!isNearBg(data[i], data[i + 1], data[i + 2], data[i + 3], mode)) continue
      let nextToClear = false
      if (x > 0 && data[idx(x - 1, y, w) + 3] === 0) nextToClear = true
      if (x + 1 < w && data[idx(x + 1, y, w) + 3] === 0) nextToClear = true
      if (y > 0 && data[idx(x, y - 1, w) + 3] === 0) nextToClear = true
      if (y + 1 < h && data[idx(x, y + 1, w) + 3] === 0) nextToClear = true
      if (!nextToClear) continue
      const yv = luma(data[i], data[i + 1], data[i + 2])
      const t =
        mode === "black"
          ? Math.max(0, Math.min(1, (yv - BLACK_LUMA) / (NEAR_BLACK - BLACK_LUMA)))
          : Math.max(0, Math.min(1, (WHITE_LUMA - yv) / (WHITE_LUMA - NEAR_WHITE)))
      data[i + 3] = Math.round(data[i + 3] * t)
    }
  }
}

export function isAllowedKnockoutSource(raw: string) {
  try {
    const url = new URL(raw)
    return url.hostname === "cdn.sanity.io" && url.pathname.startsWith("/images/")
  } catch {
    return false
  }
}

export function knockoutImageSrc(src: string | null | undefined): string | null {
  if (!src) return null
  if (!isAllowedKnockoutSource(src)) return src
  return `/api/knockout-image?url=${encodeURIComponent(src)}`
}

function contentTypeOf(format: string | undefined) {
  if (format === "png") return "image/png"
  if (format === "webp") return "image/webp"
  if (format === "jpeg" || format === "jpg") return "image/jpeg"
  if (format === "gif") return "image/gif"
  if (format === "avif") return "image/avif"
  return "application/octet-stream"
}

export type KnockoutResult = {
  body: Buffer
  contentType: string
  knocked: boolean
}

export async function knockoutBackground(input: Buffer): Promise<KnockoutResult> {
  const meta = await sharp(input).metadata()
  const normalized = await sharp(input)
    .rotate()
    .resize({width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true})
    .ensureAlpha()
    .raw()
    .toBuffer({resolveWithObject: true})

  const {data, info} = normalized
  const pixels = Buffer.from(data)
  const mode = detectMode(pixels, info.width, info.height)
  if (!mode) {
    return {
      body: input,
      contentType: contentTypeOf(meta.format),
      knocked: false,
    }
  }

  floodKnockout(pixels, info.width, info.height, mode)

  const png = await sharp(pixels, {
    raw: {width: info.width, height: info.height, channels: 4},
  })
    .png({compressionLevel: 7})
    .toBuffer()

  return {body: png, contentType: "image/png", knocked: true}
}
