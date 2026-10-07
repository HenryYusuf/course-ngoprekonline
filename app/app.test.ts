import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import App from './app.vue'

vi.mock('~/composables/useCategories', () => ({
  useCategories: vi.fn(async () => [
    { slug: 'umum', label: 'Umum', description: 'd' },
    { slug: 'opini', label: 'Opini', description: 'd' },
    { slug: 'tutorial', label: 'Tutorial', description: 'd' },
  ]),
}))

vi.mock('~/composables/usePublishedPosts', () => ({
  usePublishedPosts: vi.fn(async () => []),
}))

describe('app shell', () => {
  it('wraps the page with the site header and footer', async () => {
    const wrapper = await mountSuspended(App)
    const html = wrapper.html()

    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('footer').exists()).toBe(true)
    expect(html).toContain('&gt;_')
    expect(html).toContain('/blog')
    expect(html).toContain('/rss.xml')
    expect(html).toContain('ALL RIGHTS RESERVED')
  })
})
