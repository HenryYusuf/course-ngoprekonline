import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import HomePage from './index.vue'

vi.mock('~/composables/usePublishedPosts', () => ({
  usePublishedPosts: vi.fn(async () => [
    {
      path: '/blog/terbaru',
      title: 'Post Terbaru',
      description: 'Paling baru.',
      publishedAt: new Date('2026-10-05'),
      tags: ['umum'],
    },
    {
      path: '/blog/kedua',
      title: 'Post Kedua',
      description: 'Baru kedua.',
      publishedAt: new Date('2026-10-01'),
      tags: ['umum'],
    },
    {
      path: '/blog/ketiga',
      title: 'Post Ketiga',
      description: 'Baru ketiga.',
      publishedAt: new Date('2026-09-25'),
      tags: [],
    },
    {
      path: '/blog/keempat',
      title: 'Post Keempat',
      description: 'Tidak boleh tampil di beranda.',
      publishedAt: new Date('2026-09-20'),
      tags: [],
    },
  ]),
}))

describe('homepage', () => {
  it('shows the 3 most recent published posts and links to the blog', async () => {
    const wrapper = await mountSuspended(HomePage)
    const html = wrapper.html()

    expect(html).toContain('Post Terbaru')
    expect(html).toContain('Post Kedua')
    expect(html).toContain('Post Ketiga')
    // Only the 3 newest posts belong on the homepage
    expect(html).not.toContain('Post Keempat')
    expect(wrapper.find('a[href="/blog"]').exists()).toBe(true)
  })
})
