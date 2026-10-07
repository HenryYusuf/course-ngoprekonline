import type { PostRef } from './latestPerCategory'

import { describe, expect, it } from 'vitest'
import { latestPerCategory } from './latestPerCategory'

const categories = [
  { slug: 'umum', label: 'Umum', description: 'd' },
  { slug: 'opini', label: 'Opini', description: 'd' },
  { slug: 'tutorial', label: 'Tutorial', description: 'd' },
]

function post(slug: string, category: string, publishedAt: string): PostRef {
  return {
    path: `/blog/${slug}`,
    title: slug,
    description: 'deskripsi',
    publishedAt,
    category,
  }
}

describe('latestPerCategory', () => {
  it('returns the newest n posts per category in curated category order', () => {
    const result = latestPerCategory(
      [
        post('a', 'opini', '2026-01-01'),
        post('b', 'tutorial', '2026-03-01'),
        post('c', 'opini', '2026-02-01'),
        post('d', 'umum', '2026-01-15'),
        post('e', 'opini', '2026-03-05'),
      ],
      categories,
      2,
    )

    expect(result.map(group => group.category.slug)).toEqual(['umum', 'opini', 'tutorial'])
    const opini = result.find(group => group.category.slug === 'opini')
    expect(opini?.posts.map(p => p.path)).toEqual(['/blog/e', '/blog/c'])
  })

  it('hides categories without any post', () => {
    const result = latestPerCategory(
      [post('a', 'tutorial', '2026-01-01')],
      categories,
      2,
    )
    expect(result.map(group => group.category.slug)).toEqual(['tutorial'])
  })

  it('drops posts whose category is not curated instead of leaking them', () => {
    const result = latestPerCategory(
      [post('a', 'random', '2026-01-01')],
      categories,
      2,
    )
    expect(result).toEqual([])
  })

  it('slices to n posts per category', () => {
    const result = latestPerCategory(
      [
        post('a', 'umum', '2026-01-01'),
        post('b', 'umum', '2026-02-01'),
        post('c', 'umum', '2026-03-01'),
      ],
      categories,
      2,
    )
    expect(result[0]?.posts.map(p => p.path)).toEqual(['/blog/c', '/blog/b'])
  })

  it('defaults to two posts per category', () => {
    const result = latestPerCategory(
      [
        post('a', 'umum', '2026-01-01'),
        post('b', 'umum', '2026-02-01'),
        post('c', 'umum', '2026-03-01'),
      ],
      categories,
    )
    expect(result[0]?.posts).toHaveLength(2)
  })

  it('never leaks drafts or future-dated posts', () => {
    const result = latestPerCategory(
      [
        { ...post('draft', 'umum', '2020-01-01'), draft: true },
        post('future', 'opini', '2099-01-01'),
        post('past', 'tutorial', '2020-01-01'),
      ],
      categories,
    )
    expect(result.map(group => group.category.slug)).toEqual(['tutorial'])
  })
})
