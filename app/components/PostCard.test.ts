import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import PostCard from './PostCard.vue'

const basePost = {
  path: '/blog/halo-dunia',
  title: 'Halo Dunia',
  description: 'Post pertama.',
  publishedAt: '2026-09-20',
}

describe('postCard', () => {
  it('renders one anchor to the post with title, date, and BACA cta', async () => {
    const wrapper = await mountSuspended(PostCard, {
      props: { post: basePost },
    })

    const links = wrapper.findAll('a')
    expect(links).toHaveLength(1)
    expect(links[0]?.attributes('href')).toBe('/blog/halo-dunia')

    const html = wrapper.html()
    expect(html).toContain('Halo Dunia')
    expect(html).toContain('20 September 2026')
    expect(html).toContain('BACA')
  })

  it('renders the category as a chip inside the single anchor, not a nested link', async () => {
    const wrapper = await mountSuspended(PostCard, {
      props: {
        post: basePost,
        category: { slug: 'tutorial', label: 'Tutorial' },
      },
    })

    const html = wrapper.html()
    expect(html).toContain('Tutorial')
    expect(html).not.toContain('/blog/category/')
    expect(wrapper.findAll('a')).toHaveLength(1)
  })

  it('falls back to a CSS-only cover with initials when there is no image', async () => {
    const wrapper = await mountSuspended(PostCard, {
      props: { post: basePost },
    })

    const html = wrapper.html()
    expect(html).not.toContain('<img')
    expect(html).toContain('HD')
  })

  it('renders the image cover when the post carries one', async () => {
    const wrapper = await mountSuspended(PostCard, {
      props: {
        post: { ...basePost, image: '/images/blog/cover.png' },
      },
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/images/blog/cover.png')
    expect(img.attributes('alt')).toBe('Halo Dunia')
  })
})
