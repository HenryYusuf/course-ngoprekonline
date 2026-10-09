import { mountSuspended } from '@nuxt/test-utils/runtime'
import axe from 'axe-core'
import { describe, expect, it, vi } from 'vitest'

import PostPage from './[slug].vue'

vi.mock('~/composables/useCategories', () => ({
  useCategories: vi.fn(async () => [
    { slug: 'umum', label: 'Umum', description: 'Catatan ringan seputar situs.' },
  ]),
}))

vi.mock('~/composables/usePublishedPosts', () => ({
  usePublishedPost: vi.fn(async () => ({
    path: '/blog/halo-dunia',
    title: 'Halo Dunia',
    description: 'Post pertama.',
    publishedAt: new Date('2026-09-20'),
    category: 'umum',
    tags: ['umum'],
  })),
  usePublishedPosts: vi.fn(async () => [
    {
      path: '/blog/halo-dunia',
      title: 'Halo Dunia',
      description: 'Post pertama.',
      publishedAt: new Date('2026-09-20'),
      category: 'umum',
      tags: ['umum'],
    },
  ]),
}))

/**
 * Standard set by PRODUCT.md: keyboard navigation and text contrast are the
 * two declared accessibility floors. This locks the structural half of that
 * contract (roles, labels, landmarks, heading order, link names) into CI.
 * Color-contrast is excluded: happy-dom computes no real layout or painted
 * colors, so the rule would always pass and prove nothing. The visual half
 * is checked by the build-and-serve smoke job, not here.
 */
const A11Y_OPTIONS: axe.RunOptions = {
  rules: {
    'color-contrast': { enabled: false },
  },
}

async function violations(html: string) {
  const container = document.createElement('div')
  container.innerHTML = html
  document.body.appendChild(container)
  try {
    const results = await axe.run(container, A11Y_OPTIONS)
    return results.violations
  }
  finally {
    container.remove()
  }
}

describe('accessibility (axe-core)', () => {
  it('detects a known violation (guards against a silently broken setup)', async () => {
    const found = await violations('<img src="x.png">')
    expect(found.length).toBeGreaterThan(0)
  })

  it('blog post page has no structural a11y violations', async () => {
    const wrapper = await mountSuspended(PostPage, { route: '/blog/halo-dunia' })
    const found = await violations(wrapper.html())

    expect(found.map(v => `${v.id}: ${v.help}`)).toEqual([])
  })
})
