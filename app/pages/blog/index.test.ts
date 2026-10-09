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

const PUBLISHED = Array.from({ length: 30 }, (_, i) => ({
  path: `/blog/post-${i + 1}`,
  title: `Post ${i + 1}`,
  description: 'deskripsi demo',
  publishedAt: new Date(2026, 8, 30 - i),
  category: 'umum',
}))

vi.mock('~/composables/usePublishedPosts', () => ({
  usePublishedPosts: vi.fn(async () => PUBLISHED),
}))

describe('blog index page', () => {
  it('lists the first archive page of published posts with a NEXT link', async () => {
    const wrapper = await mountSuspended(BlogIndex, { route: '/blog' })
    const html = wrapper.html()

    expect(html).toContain('Post 1')
    expect(html).toContain('Post 24')
    expect(html).not.toContain('Post 25')
    expect(wrapper.find('a[href="/blog?page=2"]').exists()).toBe(true)
  })

  it('renders page 2 with the remaining posts and no NEXT link', async () => {
    const wrapper = await mountSuspended(BlogIndex, { route: '/blog?page=2' })
    const html = wrapper.html()

    expect(html).toContain('Post 25')
    expect(html).toContain('Post 30')
    expect(html).not.toContain('Post 24')
    expect(html).not.toContain('/blog?page=3')
    expect(wrapper.find('a[href="/blog"]').exists()).toBe(true)
  })

  it('always shows every curated category as a browsing entry point', async () => {
    const wrapper = await mountSuspended(BlogIndex, { route: '/blog' })
    const html = wrapper.html()

    expect(html).toContain('/blog/category/tutorial')
    expect(html).toContain('/blog/category/umum')
    expect(html).toContain('/blog/category/opini')
  })
})
