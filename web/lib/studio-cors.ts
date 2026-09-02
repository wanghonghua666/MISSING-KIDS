export function isAllowedStudioOrigin(origin: string) {
  try {
    const url = new URL(origin)
    const host = url.hostname
    if (host === "localhost" || host === "127.0.0.1") {
      return url.port === "3333" || url.port === "3000" || url.port === "3001" || url.port === ""
    }
    if (host === "sanity.studio" || host.endsWith(".sanity.studio")) return true
    if (host === "missingkidsadmin.vercel.app") return true
    if (/^missingkidsadmin[-.].+\.vercel\.app$/.test(host)) return true
    if (host === "missingkids.club" || host === "www.missingkids.club") return true
    return false
  } catch {
    return false
  }
}
