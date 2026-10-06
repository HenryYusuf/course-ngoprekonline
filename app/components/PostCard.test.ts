import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import PostCard from './PostCard.vue'

describe('postCard', () => {
  it('renders title, formatted date, and tag links', async () => {
    const wrapper = await mountSuspended(PostCard, {
      props: {
        post: {
          path: '/blog/halo-dunia',
          title: 'Halo Dunia',
          description: 'Post pertama.',
          publishedAt: '2026-09-20',
          tags: ['umum'],
        },
      },
    })

    const html = wrapper.html()
    expect(html).toContain('Halo Dunia')
    expect(html).toContain('20 September 2026')
    expect(html).toContain('/blog/tag/umum')
  })

  it('renders the category badge linking to its archive', async () => {
    const wrapper = await mountSuspended(PostCard, {
      props: {
        post: {
          path: '/blog/halo-dunia',
          title: 'Halo Dunia',
          description: 'Post pertama.',
          publishedAt: '2026-09-20',
          tags: ['umum'],
        },
        category: { slug: 'tutorial', label: 'Tutorial' },
      },
    })

    const link = wrapper.find('a[href="/blog/category/tutorial"]')
    expect(link.exists()).toBe(true)
    expect(link.text()).toBe('Tutorial')
  })

  it('renders no category badge when the post carries none (legacy content)', async () => {
    const wrapper = await mountSuspended(PostCard, {
      props: {
        post: {
          path: '/blog/halo-dunia',
          title: 'Halo Dunia',
          description: 'Post pertama.',
          publishedAt: '2026-09-20',
          tags: ['umum'],
        },
      },
    })

    expect(wrapper.html()).not.toContain('/blog/category/')
  })
})
