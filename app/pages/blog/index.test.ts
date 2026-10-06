import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import BlogIndex from './index.vue'

vi.mock('~/composables/usePublishedPosts', () => ({
  usePublishedPosts: vi.fn(async () => [
    {
      path: '/blog/halo-dunia',
      title: 'Halo Dunia',
      description: 'Post pertama.',
      publishedAt: new Date('2026-09-20'),
      tags: ['umum'],
    },
    {
      path: '/blog/menyematkan-video-dan-kode',
      title: 'Menyematkan Video dan Kode di Artikel',
      description: 'Contoh post.',
      publishedAt: new Date('2026-10-05'),
      image: '/images/blog/cover-contoh.svg',
      tags: ['nuxt', 'konten'],
    },
  ]),
}))

describe('blog index page', () => {
  it('lists published posts', async () => {
    const wrapper = await mountSuspended(BlogIndex)
    const html = wrapper.html()

    expect(html).toContain('Halo Dunia')
    expect(html).toContain('Menyematkan Video dan Kode di Artikel')
  })
})
