import { queryCollection } from '#imports'

/**
 * The curated Category list, read from content. Single data seam for every
 * surface that needs categories, mirroring `usePublishedPosts`.
 */
export async function useCategories() {
  return await queryCollection('categories').all()
}
