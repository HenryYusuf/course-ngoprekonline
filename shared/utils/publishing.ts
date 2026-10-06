export interface PublishablePost {
  /** Content v3 types schema fields with defaults as optional in generated items. */
  draft?: boolean | undefined
  publishedAt: Date | string
}

/**
 * A post is visible on the public site when it is not a draft and its
 * publish date has passed. Used by every content surface so the gate
 * cannot drift between pages.
 */
export function isPublished(post: PublishablePost, now: Date = new Date()): boolean {
  if (post.draft) {
    return false
  }
  return new Date(post.publishedAt).getTime() <= now.getTime()
}
