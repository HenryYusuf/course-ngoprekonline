import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import { useNuxtApp } from '#app'
import { useBlogSearch } from '~/composables/useBlogSearch'
import CariPage from './cari.vue'

const searchMock = vi.hoisted(() => vi.fn())
const routeQuery = vi.hoisted(() => ({ q: undefined as string | undefined }))
const routerReplace = vi.hoisted(() => vi.fn())
const routerPush = vi.hoisted(() => vi.fn())

vi.mock('~/composables/useBlogSearch', () => ({
  useBlogSearch: vi.fn(),
}))

mockNuxtImport('useRoute', () => () => ({ query: routeQuery }))
mockNuxtImport('useRouter', () => () => {
  const real = useNuxtApp().$router
  return new Proxy(real, {
    get(target, prop) {
      if (prop === 'replace') {
        return routerReplace
      }
      if (prop === 'push') {
        return routerPush
      }
      const value = Reflect.get(target, prop)
      return typeof value === 'function' ? value.bind(target) : value
    },
  })
})

const results = [
  {
    path: '/blog/panduan-docker-untuk-pemula',
    title: 'Panduan Docker untuk Pemula',
    snippet: 'Belajar <mark>docker</mark> dari nol.',
  },
]

type SearchStatus = 'idle' | 'loading' | 'ready' | 'error'

const DEBOUNCE_MS = 250

function searchComposable(statusValue: SearchStatus): Awaited<ReturnType<typeof useBlogSearch>> {
  return {
    status: ref(statusValue),
    search: searchMock,
  }
}

async function settle(ms = DEBOUNCE_MS): Promise<void> {
  await vi.advanceTimersByTimeAsync(ms)
  for (let i = 0; i < 10; i++) {
    await Promise.resolve()
  }
  await nextTick()
}

beforeEach(() => {
  vi.useFakeTimers()
  routeQuery.q = undefined
  searchMock.mockReset()
  routerReplace.mockReset()
  routerReplace.mockImplementation((to: { query?: Record<string, string | undefined> } | string) => {
    if (typeof to === 'object' && to !== null && to.query !== undefined) {
      routeQuery.q = to.query.q
    }
  })
  routerPush.mockReset()
  vi.mocked(useBlogSearch).mockResolvedValue(searchComposable('ready'))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('cari page', () => {
  it('renders an Indonesian-labeled search input and lists results as the reader types', async () => {
    searchMock.mockResolvedValue(results)
    const wrapper = await mountSuspended(CariPage)

    const input = wrapper.get('input')
    expect(wrapper.get('label').text()).toBe('Kata kunci')

    await input.setValue('docker')
    await settle()

    expect(searchMock).toHaveBeenCalledWith('docker')
    expect(wrapper.text()).toContain('Panduan Docker untuk Pemula')
    expect(wrapper.get('a[href="/blog/panduan-docker-untuk-pemula"]').text()).toContain('Panduan Docker untuk Pemula')
    expect(wrapper.html()).toContain('<mark>docker</mark>')
  })

  it('debounces the search so raw keystrokes do not fire a query per keypress', async () => {
    searchMock.mockResolvedValue(results)
    const wrapper = await mountSuspended(CariPage)
    const input = wrapper.get('input')

    await input.setValue('d')
    await input.setValue('do')
    await input.setValue('docker')

    await settle(DEBOUNCE_MS - 1)
    expect(searchMock).not.toHaveBeenCalled()

    await settle(1)
    expect(searchMock).toHaveBeenCalledTimes(1)
    expect(searchMock).toHaveBeenCalledWith('docker')
  })

  it('moves the selection with arrow keys, clamps at the ends, and opens the selected result with Enter', async () => {
    searchMock.mockResolvedValue([
      { path: '/blog/panduan-docker-untuk-pemula', title: 'Panduan Docker untuk Pemula', snippet: 'docker satu' },
      { path: '/blog/docker-compose', title: 'Docker Compose', snippet: 'docker dua' },
      { path: '/blog/linux-dasar', title: 'Linux Dasar', snippet: 'docker tiga' },
    ])
    const wrapper = await mountSuspended(CariPage)
    const input = wrapper.get('input')

    await input.setValue('docker')
    await settle()

    expect(input.attributes('aria-activedescendant')).toBeUndefined()

    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(input.attributes('aria-activedescendant')).toBe('cari-hasil-0')

    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(input.attributes('aria-activedescendant')).toBe('cari-hasil-2')

    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(input.attributes('aria-activedescendant')).toBe('cari-hasil-1')

    await input.trigger('keydown', { key: 'ArrowUp' })
    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(input.attributes('aria-activedescendant')).toBeUndefined()

    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(input.attributes('aria-activedescendant')).toBe('cari-hasil-2')

    await input.trigger('keydown', { key: 'Enter' })
    expect(routerPush).toHaveBeenCalledWith('/blog/linux-dasar')
  })

  it('exposes the combobox pattern: role, aria-expanded, aria-controls, listbox and aria-selected options', async () => {
    searchMock.mockResolvedValue(results)
    const wrapper = await mountSuspended(CariPage)
    const input = wrapper.get('input')

    expect(input.attributes('role')).toBe('combobox')
    expect(input.attributes('aria-expanded')).toBe('false')

    await input.setValue('docker')
    await settle()

    expect(input.attributes('aria-expanded')).toBe('true')
    expect(input.attributes('aria-controls')).toBe('cari-hasil')

    const list = wrapper.get('[role="listbox"]')
    expect(list.attributes('id')).toBe('cari-hasil')
    const options = wrapper.findAll('[role="option"]')
    expect(options).toHaveLength(1)
    expect(options[0]!.attributes('aria-selected')).toBe('false')

    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(options[0]!.attributes('aria-selected')).toBe('true')

    await input.trigger('keydown', { key: 'Escape' })
    expect(input.attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
  })

  it('marks the input as busy while the index is still loading and not busy when ready', async () => {
    vi.mocked(useBlogSearch).mockResolvedValueOnce(searchComposable('loading'))
    const loadingWrapper = await mountSuspended(CariPage)
    expect(loadingWrapper.get('input').attributes('aria-busy')).toBe('true')

    const readyWrapper = await mountSuspended(CariPage)
    expect(readyWrapper.get('input').attributes('aria-busy')).toBe('false')
  })

  it('clears the query, the selection, and the URL with Escape', async () => {
    searchMock.mockResolvedValue(results)
    const wrapper = await mountSuspended(CariPage)
    const input = wrapper.get('input')

    await input.setValue('docker')
    await settle()
    expect(wrapper.text()).toContain('Panduan Docker untuk Pemula')

    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(input.attributes('aria-activedescendant')).toBe('cari-hasil-0')

    await input.trigger('keydown', { key: 'Escape' })
    expect((input.element as HTMLInputElement).value).toBe('')
    expect(input.attributes('aria-activedescendant')).toBeUndefined()

    await settle()
    expect(wrapper.find('[data-testid="state-hint"]').exists()).toBe(true)
    expect(routerReplace).toHaveBeenLastCalledWith({ query: { q: undefined } })
  })

  it('writes the typed query back into the URL after the debounce without a full navigation', async () => {
    searchMock.mockResolvedValue(results)
    const wrapper = await mountSuspended(CariPage)
    routerReplace.mockClear()

    await wrapper.get('input').setValue('docker')
    await settle(DEBOUNCE_MS - 1)
    expect(routerReplace).not.toHaveBeenCalled()

    await settle(1)
    expect(routerReplace).toHaveBeenCalledTimes(1)
    expect(routerReplace).toHaveBeenCalledWith({ query: { q: 'docker' } })
  })

  it('reads the initial query from the URL so a shared link shows its results', async () => {
    routeQuery.q = 'docker'
    searchMock.mockResolvedValue(results)
    const wrapper = await mountSuspended(CariPage)
    await settle()

    expect(searchMock).toHaveBeenCalledWith('docker')
    expect(wrapper.text()).toContain('Panduan Docker untuk Pemula')
  })

  it('shows an Indonesian empty state naming the query with no matches', async () => {
    searchMock.mockResolvedValue([])
    const wrapper = await mountSuspended(CariPage)

    await wrapper.get('input').setValue('kata-tidak-ada')
    await settle()

    expect(wrapper.get('[data-testid="state-empty"]').text()).toBe('Tidak ada hasil untuk “kata-tidak-ada”.')
  })

  it('shows a hint for an empty query and an Indonesian message while the index is loading', async () => {
    const wrapper = await mountSuspended(CariPage)

    expect(wrapper.get('[data-testid="state-hint"]').text()).toBe('Ketik kata kunci untuk mulai mencari.')

    vi.mocked(useBlogSearch).mockResolvedValueOnce(searchComposable('loading'))
    const loadingWrapper = await mountSuspended(CariPage)

    expect(loadingWrapper.get('[data-testid="state-loading"]').text()).toBe('Menyiapkan pencarian…')
    await loadingWrapper.get('input').setValue('docker')
    await settle()
    expect(searchMock).not.toHaveBeenCalled()
  })

  it('shows a searching message while results are still in flight', async () => {
    let resolveResults!: (value: typeof results) => void
    searchMock.mockReturnValue(new Promise<typeof results>((resolve) => {
      resolveResults = resolve
    }))
    const wrapper = await mountSuspended(CariPage)

    await wrapper.get('input').setValue('docker')
    await settle()

    expect(wrapper.get('[data-testid="state-pending"]').text()).toBe('Mencari…')

    resolveResults(results)
    await settle(0)

    expect(wrapper.text()).toContain('Panduan Docker untuk Pemula')
  })

  it('shows an Indonesian error message when the search index fails to load', async () => {
    vi.mocked(useBlogSearch).mockResolvedValueOnce(searchComposable('error'))
    const wrapper = await mountSuspended(CariPage)

    expect(wrapper.get('[data-testid="state-error"]').text()).toBe('Pencarian gagal dimuat. Muat ulang halaman untuk mencoba lagi.')
  })

  it('shows the error state when a search rejects instead of an empty state', async () => {
    searchMock.mockRejectedValue(new Error('index rusak'))
    const wrapper = await mountSuspended(CariPage)

    await wrapper.get('input').setValue('docker')
    await settle()

    expect(wrapper.get('[data-testid="state-error"]').text()).toBe('Pencarian gagal dimuat. Muat ulang halaman untuk mencoba lagi.')
    expect(wrapper.find('[data-testid="state-empty"]').exists()).toBe(false)
  })
})
