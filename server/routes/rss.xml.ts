import { queryCollection } from '@nuxt/content/nitro'
import { defineEventHandler, setResponseHeader } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'

import { isPublished } from '#shared/utils/publishing'

const escapes: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '\'': '&apos;',
  '"': '&quot;',
}

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, c => escapes[c] ?? c)
}

/** Server-side queries require explicit imports because nitro auto-imports are disabled. */
export default defineEventHandler(async (event) => {
  const { siteUrl, siteName } = useRuntimeConfig(event).public

  const [posts, categories] = await Promise.all([
    queryCollection(event, 'blog').order('publishedAt', 'DESC').all(),
    queryCollection(event, 'categories').all(),
  ])
  const labelBySlug = new Map(categories.map(category => [category.slug, category.label]))

  const feedPosts = posts
    .filter(post => isPublished(post))
    .slice(0, 20)

  setResponseHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${siteUrl}</link>
    <description>Artikel terbaru dari ${escapeXml(siteName)}</description>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />${feedPosts.map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}${post.path}</link>
      <guid isPermaLink="true">${siteUrl}${post.path}</guid>
      <description>${escapeXml(post.description)}</description>
      <category>${escapeXml(labelBySlug.get(post.category) ?? post.category)}</category>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    </item>`).join('\n')}
  </channel>
</rss>`
})
