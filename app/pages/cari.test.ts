import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import { useBlogSearch } from '~/composables/useBlogSearch'
import CariPage from './cari.vue'

const searchMock = vi.hoisted(() => vi.fn())
const routeQuery = vi.hoisted(() => ({ q: undefined as string | undefined }))

vi.mock('~/composables/useBlogSearch', () => ({
  useBlogSearch: vi.fn(),
}))

mockNuxtImport('useRoute', () => () => ({ query: routeQuery }))

const results = [
  {
    path: '/blog/panduan-docker-untuk-pemula',
    title: 'Panduan Docker untuk Pemula',
    snippet: 'Belajar <mark>docker</mark> dari nol.',
  },
]

type SearchStatus = 'idle' | 'loading' | 'ready' | 'error'

function searchComposable(statusValue: SearchStatus): Awaited<ReturnType<typeof useBlogSearch>> {
  return {
    status: ref(statusValue),
    search: searchMock,
  }
}

beforeEach(() => {
  routeQuery.q = undefined
  searchMock.mockReset()
  vi.mocked(useBlogSearch).mockResolvedValue(searchComposable('ready'))
})

describe('cari page', () => {
  it('renders an Indonesian-labeled search input and lists results as the reader types', async () => {
    searchMock.mockResolvedValue(results)
    const wrapper = await mountSuspended(CariPage)

    const input = wrapper.get('input')
    expect(wrapper.get('label').text()).toBe('Kata kunci')

    await input.setValue('docker')
    await flushPromises()

    expect(searchMock).toHaveBeenCalledWith('docker')
    expect(wrapper.text()).toContain('Panduan Docker untuk Pemula')
    expect(wrapper.get('a[href="/blog/panduan-docker-untuk-pemula"]').text()).toContain('Panduan Docker untuk Pemula')
    expect(wrapper.html()).toContain('<mark>docker</mark>')
  })

  it('reads the initial query from the URL so a shared link shows its results', async () => {
    routeQuery.q = 'docker'
    searchMock.mockResolvedValue(results)
    const wrapper = await mountSuspended(CariPage)
    await flushPromises()

    expect(searchMock).toHaveBeenCalledWith('docker')
    expect(wrapper.text()).toContain('Panduan Docker untuk Pemula')
  })

  it('shows an Indonesian empty state naming the query with no matches', async () => {
    searchMock.mockResolvedValue([])
    const wrapper = await mountSuspended(CariPage)

    await wrapper.get('input').setValue('kata-tidak-ada')
    await flushPromises()

    expect(wrapper.get('[data-testid="state-empty"]').text()).toBe('Tidak ada hasil untuk “kata-tidak-ada”.')
  })

  it('shows a hint for an empty query and an Indonesian message while the index is loading', async () => {
    const wrapper = await mountSuspended(CariPage)

    expect(wrapper.get('[data-testid="state-hint"]').text()).toBe('Ketik kata kunci untuk mulai mencari.')

    vi.mocked(useBlogSearch).mockResolvedValueOnce(searchComposable('loading'))
    const loadingWrapper = await mountSuspended(CariPage)

    expect(loadingWrapper.get('[data-testid="state-loading"]').text()).toBe('Menyiapkan pencarian…')
    await loadingWrapper.get('input').setValue('docker')
    await flushPromises()
    expect(searchMock).not.toHaveBeenCalled()
  })

  it('shows a searching message while results are still in flight', async () => {
    let resolveResults!: (value: typeof results) => void
    searchMock.mockReturnValue(new Promise<typeof results>((resolve) => {
      resolveResults = resolve
    }))
    const wrapper = await mountSuspended(CariPage)

    await wrapper.get('input').setValue('docker')
    await nextTick()
    await nextTick()

    expect(wrapper.get('[data-testid="state-pending"]').text()).toBe('Mencari…')

    resolveResults(results)
    await flushPromises()

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
    await flushPromises()

    expect(wrapper.get('[data-testid="state-error"]').text()).toBe('Pencarian gagal dimuat. Muat ulang halaman untuk mencoba lagi.')
    expect(wrapper.find('[data-testid="state-empty"]').exists()).toBe(false)
  })
})
