import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import TagPage from './[tag].vue'

vi.mock('~/composables/usePublishedPosts', () => ({
  usePublishedPosts: vi.fn(async () => [
    {
      path: '/blog/a',
      title: 'Post A',
      description: 'Bertag nuxt.',
      publishedAt: new Date('2026-10-05'),
      tags: ['nuxt'],
    },
    {
      path: '/blog/b',
      title: 'Post B',
      description: 'Bertag umum.',
      publishedAt: new Date('2026-09-20'),
      tags: ['umum'],
    },
  ]),
}))

describe('tag archive page', () => {
  it('filters posts by the tag route param', async () => {
    const wrapper = await mountSuspended(TagPage, { route: '/blog/tag/nuxt' })
    const html = wrapper.html()

    expect(html).toContain('Post A')
    expect(html).not.toContain('Post B')
  })
})
