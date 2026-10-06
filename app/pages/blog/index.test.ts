import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import BlogIndex from './index.vue'

vi.mock('~/composables/useCategories', () => ({
  useCategories: vi.fn(async () => [
    { slug: 'tutorial', label: 'Tutorial', description: 'Panduan langkah demi langkah.' },
    { slug: 'umum', label: 'Umum', description: 'Catatan ringan seputar situs.' },
    { slug: 'opini', label: 'Opini', description: 'Pandangan soal ngoprek.' },
  ]),
}))

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

  it('always shows every curated category as a browsing entry point', async () => {
    const wrapper = await mountSuspended(BlogIndex)
    const html = wrapper.html()

    expect(html).toContain('/blog/category/tutorial')
    expect(html).toContain('/blog/category/umum')
    expect(html).toContain('/blog/category/opini')
  })
})
