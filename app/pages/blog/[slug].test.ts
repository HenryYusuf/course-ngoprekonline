import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import PostPage from './[slug].vue'

vi.mock('~/composables/usePublishedPosts', () => ({
  usePublishedPost: vi.fn(async (path: string) => {
    if (path === '/blog/halo-dunia') {
      return {
        path: '/blog/halo-dunia',
        title: 'Halo Dunia',
        description: 'Post pertama.',
        publishedAt: new Date('2026-09-20'),
        tags: ['umum'],
      }
    }
    if (path === '/blog/post-draf') {
      return {
        path: '/blog/post-draf',
        title: 'Post Draf',
        description: 'Belum dipublikasikan.',
        publishedAt: new Date('2026-10-01'),
        draft: true,
        tags: [],
      }
    }
    return null
  }),
}))

describe('blog post page', () => {
  it('renders the post for its route', async () => {
    const wrapper = await mountSuspended(PostPage, { route: '/blog/halo-dunia' })
    const html = wrapper.html()

    expect(html).toContain('Halo Dunia')
    expect(html).toContain('20 September 2026')
  })

  it('marks a draft post with a Draf badge (dev preview contract)', async () => {
    const wrapper = await mountSuspended(PostPage, { route: '/blog/post-draf' })

    expect(wrapper.html()).toContain('Post Draf')
    const badge = wrapper.findAll('span').find(span => span.text() === 'Draf')
    expect(badge?.exists()).toBe(true)
  })

  it('shows no Draf badge on published posts', async () => {
    const wrapper = await mountSuspended(PostPage, { route: '/blog/halo-dunia' })

    const badge = wrapper.findAll('span').find(span => span.text() === 'Draf')
    expect(badge).toBeUndefined()
  })

  it('renders nothing for unknown posts (fatal 404 is verified e2e)', async () => {
    // mountSuspended swallows the thrown fatal error in the DOM environment,
    // so the observable contract here is the v-if guard: no article content.
    // The HTTP-level 404 is asserted by the build-and-serve verification.
    const wrapper = await mountSuspended(PostPage, { route: '/blog/tidak-ada' })
    expect(wrapper.html()).not.toContain('<article')
  })
})
