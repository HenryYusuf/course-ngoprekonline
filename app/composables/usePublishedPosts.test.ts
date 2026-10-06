import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePublishedPost, usePublishedPosts } from './usePublishedPosts'

const queryCollectionMock = vi.hoisted(() => vi.fn())
mockNuxtImport('queryCollection', () => queryCollectionMock)

const posts = [
  {
    path: '/blog/terbaru',
    title: 'Post Terbaru',
    description: 'Publik paling baru.',
    publishedAt: new Date('2026-10-05'),
    tags: ['umum'],
  },
  {
    path: '/blog/lama',
    title: 'Post Lama',
    description: 'Publik lama.',
    publishedAt: new Date('2026-09-20'),
    tags: ['umum'],
  },
  {
    path: '/blog/draf',
    title: 'Post Draf',
    description: 'Belum dipublikasikan.',
    publishedAt: new Date('2026-10-01'),
    draft: true,
    tags: [],
  },
]

function mockQuery(result: unknown[]) {
  const query = {
    order: vi.fn().mockReturnThis(),
    all: vi.fn().mockResolvedValue(result),
    path: vi.fn().mockReturnThis(),
    first: vi.fn().mockResolvedValue(result[0] ?? null),
  }
  queryCollectionMock.mockReturnValue(query)
  return query
}

beforeEach(() => {
  queryCollectionMock.mockReset()
})

describe('usePublishedPosts', () => {
  it('queries newest-first and returns only published posts', async () => {
    const query = mockQuery(posts)

    const published = await usePublishedPosts()

    expect(query.order).toHaveBeenCalledWith('publishedAt', 'DESC')
    expect(published.map(post => post.title)).toEqual(['Post Terbaru', 'Post Lama'])
  })

  it('returns an empty list when the collection is empty', async () => {
    mockQuery([])

    expect(await usePublishedPosts()).toEqual([])
  })
})

describe('usePublishedPost', () => {
  it('returns the published post queried by path', async () => {
    const query = mockQuery([posts[0]])

    const post = await usePublishedPost('/blog/terbaru')

    expect(query.path).toHaveBeenCalledWith('/blog/terbaru')
    expect(post?.title).toBe('Post Terbaru')
  })

  it('previews a draft post in dev (per the Draft contract in CONTEXT.md)', async () => {
    mockQuery([posts[2]])

    const post = await usePublishedPost('/blog/draf', { dev: true })

    expect(post?.title).toBe('Post Draf')
  })

  it('returns null when no post matches the path', async () => {
    mockQuery([])

    expect(await usePublishedPost('/blog/tidak-ada')).toBeNull()
  })

  it('hides a draft post outside dev (production gate)', async () => {
    mockQuery([posts[2]])

    expect(await usePublishedPost('/blog/draf')).toBeNull()
  })
})
