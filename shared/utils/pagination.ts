export interface Paginated<T> {
  items: T[]
  page: number
  perPage: number
  total: number
  totalPages: number
}

/** Cards per archive page on the homepage and /blog. */
export const ARCHIVE_PER_PAGE = 24

/**
 * Slice `items` into the requested `page` (1-based), clamping out-of-range
 * pages instead of throwing: garbage query params must degrade to a valid
 * page. A `perPage` below 1 is treated as 1 so the math never divides by 0.
 */
export function paginate<T>(items: readonly T[], page: number, perPage: number): Paginated<T> {
  const safePerPage = perPage >= 1 ? Math.floor(perPage) : 1
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / safePerPage))

  let current = Math.floor(page)
  if (Number.isNaN(current) || current < 1)
    current = 1
  else if (current > totalPages)
    current = totalPages

  const start = (current - 1) * safePerPage
  return {
    items: items.slice(start, start + safePerPage),
    page: current,
    perPage: safePerPage,
    total,
    totalPages,
  }
}

/**
 * Compact pagination window ala ddpanda: first page, a page around the
 * current one, and the last page. Runs of omitted pages are marked with a
 * `0` separator so the UI can render an ellipsis.
 */
export function pageWindow(current: number, total: number): number[] {
  let page = Math.floor(current)
  if (Number.isNaN(page) || page < 1)
    page = 1
  else if (page > total)
    page = Math.max(1, total)

  if (total <= 1)
    return [1]

  const all = Array.from({ length: total }, (_, i) => i + 1)
  if (total <= 5)
    return all

  const keep = new Set<number>([1, total, page - 1, page, page + 1])
  const window = all.filter(n => keep.has(n))

  const withSeparators: number[] = []
  let previous = 0
  for (const n of window) {
    if (previous > 0 && n - previous > 1)
      withSeparators.push(0)
    withSeparators.push(n)
    previous = n
  }
  return withSeparators
}
