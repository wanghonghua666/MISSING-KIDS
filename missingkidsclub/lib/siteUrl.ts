export function studioSiteUrl() {
  return (
    process.env.SANITY_STUDIO_SITE_URL ||
    (process.env.NODE_ENV === 'production' ? 'https://missingkids.club' : 'http://localhost:3001')
  )
}
