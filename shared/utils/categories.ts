export interface CategoryEntry {
  slug: string
  label: string
  description: string
}

/**
 * A category slug is its permanent URL identity (ADR 0003): lowercase
 * words joined by hyphens, no leading or trailing hyphen.
 */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function isValidCategorySlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug)
}

/**
 * Finds a curated Category by its slug, the reference a Blog Post carries.
 * Returns undefined so callers can decide between a 404 and a fallback.
 */
export function findCategory(
  categories: readonly CategoryEntry[],
  slug: string,
): CategoryEntry | undefined {
  return categories.find(category => category.slug === slug)
}
