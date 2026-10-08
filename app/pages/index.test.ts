import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import HomePage from './index.vue'

vi.mock('~/composables/useCategories', () => ({
  useCategories: vi.fn(async () => [
    { slug: 'umum', label: 'Umum', description: 'd' },
    { slug: 'opini', label: 'Opini', description: 'd' },
  ]),
}))

// 30 published posts: exactly one full archive page (24) plus 6 on page 2,
// matching the demo content supply that the ddpanda-style layout ships
// with. Newest first, mirroring the DESC publish order.
const PUBLISHED = Array.from({ length: 30 }, (_, i) => ({
  path: `/blog/post-${i + 1}`,
  title: `Post ${i + 1}`,
  description: 'deskripsi demo',
  publishedAt: new Date(2026, 8, 30 - i),
  category: i % 2 === 0 ? 'umum' : 'opini',
}))

vi.mock('~/composables/usePublishedPosts', () => ({
  usePublishedPosts: vi.fn(async () => PUBLISHED),
}))

describe('homepage', () => {
  it('renders hero, 10-post shelf, racks, and a 24-card first archive page with NEXT', async () => {
    const wrapper = await mountSuspended(HomePage, { route: '/?page=1' })
    const html = wrapper.html()

    expect(html).toContain('Paket terbaru · Umum')
    expect(html).toContain('BACA PAKET')
    expect(html).toContain('Keluaran Terbaru')
    expect(html).toContain('Rak Arsip')
    expect(html).toContain('Arsip Lengkap')
    expect(html).toContain('Post 1')
    expect(html).toContain('Post 24')
    expect(html).not.toContain('Post 25')
    expect(wrapper.find('a[href="/?page=2"]').exists()).toBe(true)
  })

  it('renders page 2 with the 6 remaining posts and no NEXT link', async () => {
    const wrapper = await mountSuspended(HomePage, { route: '/?page=2' })
    const html = wrapper.html()

    expect(html).toContain('Post 25')
    expect(html).toContain('Post 30')
    expect(html).not.toContain('Post 24')
    // No forward page: the disabled NEXT span is not a link.
    expect(html).not.toContain('/?page=3')
    expect(wrapper.find('a[href="/"]').exists()).toBe(true)
  })

  it('degrades a garbage page param to the first page', async () => {
    const wrapper = await mountSuspended(HomePage, { route: '/?page=abc' })
    const html = wrapper.html()

    expect(html).toContain('Post 1')
    expect(html).not.toContain('Post 25')
  })
})
