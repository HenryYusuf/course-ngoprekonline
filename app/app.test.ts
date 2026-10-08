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
    expect(html).toContain('Edutorial blog download')
    expect(html).toContain('/blog')
    expect(html).toContain('/rss.xml')
    expect(html).toContain('ALL RIGHTS RESERVED')
  })

  it('renders server-only routes like /rss.xml as plain anchors, not NuxtLink', async () => {
    // NuxtLink resolves its target through vue-router; /rss.xml is a Nitro
    // server route invisible to the router, so a NuxtLink there warns
    // [VUE_ROUTER_R0004] No match found on every mount (dev + tests).
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      await mountSuspended(App)
      const routerWarnings = warn.mock.calls
        .map(args => args.join(' '))
        .filter(text => text.includes('VUE_ROUTER_R0004'))
      expect(routerWarnings).toEqual([])
    }
    finally {
      warn.mockRestore()
    }
  })
})
