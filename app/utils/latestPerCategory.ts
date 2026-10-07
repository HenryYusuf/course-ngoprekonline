import type { CategoryEntry } from '#shared/utils/categories'
import { isPublished } from '#shared/utils/publishing'

/** The slice of a blog collection item the category panels need. */
export interface PostRef {
  path: string
  title: string
  description: string
  publishedAt: Date | string
  draft?: boolean | undefined
  category: string
}

export interface CategoryGroup {
  category: CategoryEntry
  posts: PostRef[]
}

/**
 * The newest `n` published posts per curated Category, groups ordered by
 * the curated list (never by post frequency) and posts by publish date
 * descending. Categories without a published post are omitted, matching
 * the archive pages that 404 when a category is empty. The publish gate
 * is applied here so drafts and future-dated posts cannot leak into any
 * panel, however the caller built its list.
 */
export function latestPerCategory(
  posts: readonly PostRef[],
  categories: readonly CategoryEntry[],
  n = 2,
): CategoryGroup[] {
  return categories
    .map(category => ({
      category,
      posts: posts
        .filter(post => post.category === category.slug && isPublished(post))
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, n),
    }))
    .filter(group => group.posts.length > 0)
}
