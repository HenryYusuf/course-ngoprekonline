/**
 * Honest package size for spec plates: bytes come from the real file
 * (frontmatter `resources.bytes`), rendered in Indonesian decimal notation.
 */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0)
    return '0 B'
  if (bytes < 1024)
    return `${Math.round(bytes)} B`

  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex++
  }

  const rounded = Math.round(value * 10) / 10
  const display = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  return `${display} ${units[unitIndex]}`
}
