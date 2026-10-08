import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import CategoryPanels from './CategoryPanels.vue'

vi.mock('~/composables/useCategories', () => ({
  useCategories: vi.fn(async () => [
    { slug: 'umum', label: 'Umum', description: 'd' },
    { slug: 'opini', label: 'Opini', description: 'd' },
    { slug: 'kosong', label: 'Kosong', description: 'd' },
  ]),
}))

describe('categoryPanels', () => {
  it('renders a shelf per non-empty category with 2 latest posts', async () => {
    const wrapper = await mountSuspended(CategoryPanels, {
      props: {
        posts: [
          { path: '/blog/a', title: 'A Terbaru', description: 'd', publishedAt: '2026-03-01', category: 'umum' },
          { path: '/blog/b', title: 'B Lama', description: 'd', publishedAt: '2026-01-01', category: 'umum' },
          { path: '/blog/c', title: 'C Opini', description: 'd', publishedAt: '2026-02-01', category: 'opini' },
          { path: '/blog/x', title: 'X Kosong', description: 'd', publishedAt: '2026-02-01', category: 'kosong-tidak-ada' },
        ],
      },
    })

    const html = wrapper.html()
    expect(html).toContain('Rak Arsip')
    expect(html).toContain('Rak · Umum')
    expect(html).toContain('Rak · Opini')
    expect(html).toContain('A Terbaru')
    expect(html).toContain('B Lama')
    expect(html).toContain('C Opini')
    expect(html).toContain('/blog/a')
    expect(html).toContain('/blog/c')
    // Category without posts is omitted, uncurated posts never leak
    expect(html).not.toContain('Rak · Kosong')
    expect(html).not.toContain('X Kosong')
  })
})
