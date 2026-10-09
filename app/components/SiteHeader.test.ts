import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useNuxtApp } from '#app'
import SiteHeader from './SiteHeader.vue'

const routerPush = vi.hoisted(() => vi.fn())

vi.mock('~/composables/useCategories', () => ({
  useCategories: vi.fn(async () => [
    { slug: 'devops', label: 'DevOps' },
  ]),
}))

mockNuxtImport('useRouter', () => () => {
  const real = useNuxtApp().$router
  return new Proxy(real, {
    get(target, prop) {
      if (prop === 'push') {
        return routerPush
      }
      const value = Reflect.get(target, prop)
      return typeof value === 'function' ? value.bind(target) : value
    },
  })
})

beforeEach(() => {
  routerPush.mockReset()
})

describe('site header', () => {
  it('shows an Indonesian search trigger that is not hidden at any breakpoint', async () => {
    const wrapper = await mountSuspended(SiteHeader)

    const form = wrapper.get('form[role="search"]')
    expect(form.classes()).not.toContain('hidden')
    expect(form.classes()).not.toContain('sm:hidden')
    expect(wrapper.get('label[for="header-cari-input"]').text()).toBe('Kata kunci')
    expect(wrapper.get('input#header-cari-input').attributes('name')).toBe('q')
    expect(wrapper.get('button[type="submit"]').text()).toBe('Cari')
  })

  it('opens the search page carrying the typed query when submitted', async () => {
    const wrapper = await mountSuspended(SiteHeader)
    const input = wrapper.get('input#header-cari-input')

    await input.setValue('docker com')
    await wrapper.get('form[role="search"]').trigger('submit')

    expect(routerPush).toHaveBeenCalledWith({ path: '/cari', query: { q: 'docker com' } })
  })

  it('opens an empty search page when submitted without usable text', async () => {
    const wrapper = await mountSuspended(SiteHeader)
    const form = wrapper.get('form[role="search"]')

    await form.trigger('submit')
    expect(routerPush).toHaveBeenLastCalledWith({ path: '/cari' })

    await wrapper.get('input#header-cari-input').setValue('   ')
    await form.trigger('submit')

    expect(routerPush).toHaveBeenLastCalledWith({ path: '/cari' })
  })
})
