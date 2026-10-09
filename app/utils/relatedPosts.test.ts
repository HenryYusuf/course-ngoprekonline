import type { RelatedPostInput } from './relatedPosts'

import { describe, expect, it } from 'vitest'
import { relatedPosts } from './relatedPosts'

function post(overrides: Partial<RelatedPostInput> & Pick<RelatedPostInput, 'path' | 'title'>): RelatedPostInput {
  return {
    description: 'desc',
    publishedAt: '2026-01-01',
    category: 'umum',
    tags: [],
    ...overrides,
  }
}

describe('relatedPosts', () => {
  const current = post({ path: '/blog/a', title: 'A', category: 'tutorial', tags: ['python', 'excel'] })

  it('excludes the current post itself', () => {
    const result = relatedPosts(current, [current])
    expect(result).toHaveLength(0)
  })

  it('drops candidates with no category or tag overlap', () => {
    const other = post({ path: '/blog/b', title: 'B', category: 'opini', tags: ['rust'] })
    expect(relatedPosts(current, [other])).toHaveLength(0)
  })

  it('ranks shared tags above a shared category alone', () => {
    const tagOnly = post({ path: '/blog/tag-only', title: 'Tag only', category: 'opini', tags: ['python'] })
    const categoryOnly = post({ path: '/blog/cat-only', title: 'Cat only', category: 'tutorial', tags: [] })
    const result = relatedPosts(current, [categoryOnly, tagOnly])
    expect(result.map(p => p.path)).toEqual(['/blog/tag-only', '/blog/cat-only'])
  })

  it('prefers the newest post when scores tie', () => {
    const older = post({ path: '/blog/older', title: 'Older', category: 'tutorial', publishedAt: '2025-01-01' })
    const newer = post({ path: '/blog/newer', title: 'Newer', category: 'tutorial', publishedAt: '2026-06-01' })
    const result = relatedPosts(current, [older, newer])
    expect(result.map(p => p.path)).toEqual(['/blog/newer', '/blog/older'])
  })

  it('respects the limit', () => {
    const many = Array.from({ length: 5 }, (_, i) =>
      post({ path: `/blog/p${i}`, title: `P${i}`, category: 'tutorial' }))
    expect(relatedPosts(current, many, 3)).toHaveLength(3)
  })
})
