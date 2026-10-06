import { queryCollection } from '#imports'

import { isPublished } from '#shared/utils/publishing'

export async function usePublishedPosts() {
  const posts = await queryCollection('blog')
    .order('publishedAt', 'DESC')
    .all()
  return posts.filter(post => isPublished(post))
}

export async function usePublishedPost(path: string, options: { dev?: boolean } = {}) {
  const dev = options.dev ?? import.meta.dev
  const post = await queryCollection('blog').path(path).first()
  if (!post) {
    return null
  }
  // Drafts stay reachable in dev for preview, never in production.
  if (!isPublished(post) && !dev) {
    return null
  }
  return post
}
