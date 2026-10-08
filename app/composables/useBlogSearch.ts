import { useSearchCollection } from '#imports'

import { usePublishedPosts } from '~/composables/usePublishedPosts'

function escapeSnippet(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&lt;mark&gt;/g, '<mark>')
    .replace(/&lt;\/mark&gt;/g, '</mark>')
}

export async function useBlogSearch() {
  const { status, search } = useSearchCollection('blog')
  const published = await usePublishedPosts()
  const publishedByPath = new Map(published.map(post => [post.path, post]))

  async function searchPublished(query: string) {
    if (!query.trim()) {
      return []
    }

    const sections = await search(query, { snippet: { columns: ['content'], around: 30 } })
    const seen = new Set<string>()
    const results: { path: string, title: string, snippet: string }[] = []

    for (const section of sections) {
      const path = section.id.split('#')[0] ?? ''
      const post = publishedByPath.get(path)
      if (!post || seen.has(path)) {
        continue
      }
      seen.add(path)
      results.push({
        path,
        title: post.title,
        snippet: escapeSnippet(section.snippets?.content ?? post.description),
      })
    }

    return results
  }

  return { status, search: searchPublished }
}
