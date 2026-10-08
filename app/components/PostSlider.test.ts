import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import PostSlider from './PostSlider.vue'

vi.mock('~/composables/useCategories', () => ({
  useCategories: vi.fn(async () => [
    { slug: 'umum', label: 'Umum', description: 'd' },
  ]),
}))

function post(n: number) {
  return {
    path: `/blog/post-${n}`,
    title: `Post ${n}`,
    description: 'deskripsi',
    publishedAt: `2026-09-${String(n).padStart(2, '0')}`,
    category: 'umum',
  }
}

describe('postSlider', () => {
  it('caps the shelf at 10 cards with slider widths and a plain heading', async () => {
    const wrapper = await mountSuspended(PostSlider, {
      props: { posts: Array.from({ length: 14 }, (_, i) => post(i + 1)) },
    })

    const html = wrapper.html()
    expect(html).toContain('Keluaran Terbaru')
    expect(html).toContain('10 paket')
    expect(html).toContain('w-[85%]')
    for (let n = 1; n <= 10; n++) expect(html).toContain(`Post ${n}`)
    expect(html).not.toContain('Post 11')
  })

  it('renders fewer cards when supply is small', async () => {
    const wrapper = await mountSuspended(PostSlider, {
      props: { posts: [post(1), post(2)] },
    })
    const html = wrapper.html()
    expect(html).toContain('Post 1')
    expect(html).toContain('Post 2')
    expect(html).not.toContain('Post 3')
    expect(html).toContain('2 paket')
  })
})
