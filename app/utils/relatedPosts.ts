export interface RelatedPostInput {
  path: string
  title: string
  description: string
  publishedAt: Date | string
  image?: string
  category: string
  /**
   * Nuxt Content's generated type marks tags optional (schema default []).
   */
  tags?: string[]
  body?: unknown
  resources?: { title: string, file: string, bytes: number }[]
}

/**
 * Score candidate posts by how close they are to the current one: shared
 * tags weigh double a shared category, because tags are free-form and a
 * shared tag is a stronger topical signal than the single curated category
 * every post must have. Zero-score candidates (no overlap) are dropped.
 */
export function relatedPosts(
  current: RelatedPostInput,
  candidates: RelatedPostInput[],
  limit = 3,
): RelatedPostInput[] {
  const currentTags = new Set(current.tags ?? [])

  return candidates
    .filter(candidate => candidate.path !== current.path)
    .map((candidate) => {
      const sharedTags = (candidate.tags ?? []).filter(tag => currentTags.has(tag)).length
      const sameCategory = candidate.category === current.category ? 1 : 0
      return { candidate, score: sharedTags * 2 + sameCategory }
    })
    .filter(entry => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score)
        return b.score - a.score
      // Newest first among equal scores.
      return new Date(b.candidate.publishedAt).getTime() - new Date(a.candidate.publishedAt).getTime()
    })
    .slice(0, limit)
    .map(entry => entry.candidate)
}
