export function formatPrice(price?: string | number | null): string {
  if (price == null || price === "") return ""
  const value = String(price).trim()
  if (!value) return ""
  if (/^[¥$€£]/.test(value)) return value
  if (/^\d/.test(value)) return `¥${value}`
  return value
}
