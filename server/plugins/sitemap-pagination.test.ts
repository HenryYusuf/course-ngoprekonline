import type { SitemapInputCtx } from '@nuxtjs/sitemap'
import { queryCollection } from '@nuxt/content/nitro'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ARCHIVE_PER_PAGE } from '#shared/utils/pagination'
import sitemapPaginationPlugin, { appendPaginationUrls } from './sitemap-pagination'

vi.mock('@nuxt/content/nitro', () => ({
  queryCollection: vi.fn(),
}))
vi.mock('nitropack/runtime', () => ({
  defineNitroPlugin: (plugin: unknown) => plugin,
}))

const pastDate = new Date('2026-09-01T00:00:00.000Z')

function publishedPosts(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    path: `/blog/post-${i + 1}`,
    publishedAt: pastDate,
  }))
}

function mockBlogQuery(posts: unknown[]) {
  const blogQuery = {
    order: vi.fn().mockReturnThis(),
    all: vi.fn().mockResolvedValue(posts),
  }
  vi.mocked(queryCollection).mockReturnValue(blogQuery as never)
}

function makeCtx(urls: SitemapInputCtx['urls'] = []): SitemapInputCtx {
  return { event: {} as never, sitemapName: 'sitemap.xml', urls }
}

beforeEach(() => {
  vi.mocked(queryCollection).mockReset()
})

describe('sitemap pagination (sitemap:input hook)', () => {
  it('adds /?page=2 once the archive spans more than one page', async () => {
    mockBlogQuery(publishedPosts(ARCHIVE_PER_PAGE + 1))
    const ctx = makeCtx()

    await appendPaginationUrls(ctx)

    expect(ctx.urls).toEqual([{ loc: '/?page=2' }])
    expect(queryCollection).toHaveBeenCalledWith(expect.anything(), 'blog')
  })

  it('adds every page beyond the first', async () => {
    mockBlogQuery(publishedPosts(ARCHIVE_PER_PAGE * 2 + 1))
    const ctx = makeCtx()

    await appendPaginationUrls(ctx)

    expect(ctx.urls).toEqual([
      { loc: '/?page=2' },
      { loc: '/?page=3' },
    ])
  })

  it('adds nothing while every post fits on one page', async () => {
    mockBlogQuery(publishedPosts(ARCHIVE_PER_PAGE))
    const ctx = makeCtx()

    await appendPaginationUrls(ctx)

    expect(ctx.urls).toEqual([])
  })

  it('counts only published posts: drafts and future-dated posts do not add pages', async () => {
    mockBlogQuery([
      ...publishedPosts(ARCHIVE_PER_PAGE),
      { path: '/blog/draft', publishedAt: pastDate, draft: true },
      { path: '/blog/future', publishedAt: new Date('2099-01-01T00:00:00.000Z') },
    ])
    const ctx = makeCtx()

    await appendPaginationUrls(ctx)

    expect(ctx.urls).toEqual([])
  })

  it('never links page 1 or the /blog archive, only homepage ?page=N URLs', async () => {
    mockBlogQuery(publishedPosts(ARCHIVE_PER_PAGE * 3 + 1))
    const ctx = makeCtx()

    await appendPaginationUrls(ctx)

    const locs = ctx.urls.map(entry => (typeof entry === 'string' ? entry : entry.loc))
    expect(locs).toEqual(['/?page=2', '/?page=3', '/?page=4'])
    expect(locs).not.toContain('/blog?page=2')
  })

  it('keeps existing sitemap entries and appends after them', async () => {
    mockBlogQuery(publishedPosts(ARCHIVE_PER_PAGE + 1))
    const ctx = makeCtx([{ loc: '/' }])

    await appendPaginationUrls(ctx)

    expect(ctx.urls).toEqual([{ loc: '/' }, { loc: '/?page=2' }])
  })

  it('registers appendPaginationUrls on the sitemap:input hook', () => {
    const hooks = { hook: vi.fn() }

    sitemapPaginationPlugin({ hooks } as never)

    expect(hooks.hook).toHaveBeenCalledWith('sitemap:input', appendPaginationUrls)
  })
})
