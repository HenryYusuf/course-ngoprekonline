import type { SitemapInputCtx } from '@nuxtjs/sitemap'
import { queryCollection } from '@nuxt/content/nitro'
import { defineNitroPlugin } from 'nitropack/runtime'

import { ARCHIVE_PER_PAGE } from '#shared/utils/pagination'
import { isPublished } from '#shared/utils/publishing'

export async function appendPaginationUrls(ctx: SitemapInputCtx): Promise<void> {
  const posts = await queryCollection(ctx.event, 'blog')
    .order('publishedAt', 'DESC')
    .all()

  const publishedCount = posts.filter(post => isPublished(post)).length
  const totalPages = Math.ceil(publishedCount / ARCHIVE_PER_PAGE)

  for (let page = 2; page <= totalPages; page++) {
    ctx.urls.push({ loc: `/?page=${page}` })
  }
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('sitemap:input', appendPaginationUrls)
})
