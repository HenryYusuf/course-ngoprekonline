import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import PaginationNav from './PaginationNav.vue'

describe('paginationNav', () => {
  it('renders nothing for a single page archive', async () => {
    const wrapper = await mountSuspended(PaginationNav, {
      props: { page: 1, totalPages: 1, basePath: '/blog' },
    })

    expect(wrapper.find('nav').exists()).toBe(false)
  })

  it('links PREV/NEXT with the base path and marks the current page', async () => {
    const wrapper = await mountSuspended(PaginationNav, {
      props: { page: 2, totalPages: 3, basePath: '/blog' },
    })

    expect(wrapper.find('a[href="/blog"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/blog?page=3"]').exists()).toBe(true)
    const current = wrapper.find('[aria-current="page"]')
    expect(current.exists()).toBe(true)
    expect(current.text()).toBe('2')
  })

  it('drops the query on page 1 so the archive root stays canonical', async () => {
    const wrapper = await mountSuspended(PaginationNav, {
      props: { page: 2, totalPages: 3, basePath: '/' },
    })

    expect(wrapper.find('a[href="/"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/?page=3"]').exists()).toBe(true)
  })
})
