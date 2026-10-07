import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import CategoryPage from './[category].vue'

vi.mock('~/composables/usePublishedPosts', () => ({
  usePublishedPosts: vi.fn(async () => [
    {
      path: '/blog/menyematkan-video',
      title: 'Post Tutorial',
      description: 'Berkategori tutorial.',
      publishedAt: new Date('2026-10-05'),
      category: 'tutorial',
      tags: ['nuxt'],
    },
    {
      path: '/blog/lain',
      title: 'Post Lain',
      description: 'Berkategori umum.',
      publishedAt: new Date('2026-09-20'),
      category: 'umum',
      tags: ['umum'],
    },
  ]),
}))

vi.mock('~/composables/useCategories', () => ({
  useCategories: vi.fn(async () => [
    { slug: 'tutorial', label: 'Tutorial', description: 'Panduan langkah demi langkah.' },
    { slug: 'umum', label: 'Umum', description: 'Catatan ringan seputar situs.' },
    { slug: 'opini', label: 'Opini', description: 'Pandangan soal ngoprek.' },
  ]),
}))

describe('category archive page', () => {
  it('lists only the published posts of the category route param', async () => {
    const wrapper = await mountSuspended(CategoryPage, { route: '/blog/category/tutorial' })
    const html = wrapper.html()

    expect(html).toContain('Post Tutorial')
    expect(html).not.toContain('Post Lain')
  })

  it('shows the curated label and description of the category', async () => {
    const wrapper = await mountSuspended(CategoryPage, { route: '/blog/category/tutorial' })
    const html = wrapper.html()

    expect(html).toContain('KATEGORI: Tutorial')
    expect(html).toContain('Panduan langkah demi langkah.')
  })

  it('renders an empty state for a known category without published posts', async () => {
    const wrapper = await mountSuspended(CategoryPage, { route: '/blog/category/opini' })

    expect(wrapper.html()).toContain('$ BELUM ADA POST')
  })

  it('404s for a slug outside the curated list', async () => {
    await expect(mountSuspended(CategoryPage, { route: '/blog/category/tidak-ada' })).rejects.toThrow()
  })
})
