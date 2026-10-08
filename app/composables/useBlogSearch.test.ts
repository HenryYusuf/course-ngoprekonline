import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import { useBlogSearch } from './useBlogSearch'

const searchMock = vi.hoisted(() => vi.fn())
const useSearchCollectionMock = vi.hoisted(() => vi.fn())
mockNuxtImport('useSearchCollection', () => useSearchCollectionMock)

const queryCollectionMock = vi.hoisted(() => vi.fn())
mockNuxtImport('queryCollection', () => queryCollectionMock)

const posts = [
  {
    path: '/blog/terbaru',
    title: 'Post Terbaru',
    description: 'Publik paling baru.',
    publishedAt: new Date('2026-10-05'),
    tags: [],
  },
  {
    path: '/blog/draf',
    title: 'Post Draf',
    description: 'Belum dipublikasikan.',
    publishedAt: new Date('2026-10-01'),
    draft: true,
    tags: [],
  },
  {
    path: '/blog/mendatang',
    title: 'Post Mendatang',
    description: 'Ber-tanggal masa depan.',
    publishedAt: new Date('2099-01-01'),
    tags: [],
  },
  {
    path: '/blog/html',
    title: 'Post HTML',
    description: '<b>Tebal</b> & coret',
    publishedAt: new Date('2026-09-01'),
    tags: [],
  },
]

function section(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    collection: 'blog',
    id: '/blog/terbaru',
    title: 'Post Terbaru',
    titles: [],
    level: 1,
    content: 'Isi artikel.',
    rank: 1,
    ...overrides,
  }
}

function mockQueryCollection() {
  const query = {
    order: vi.fn().mockReturnThis(),
    all: vi.fn().mockResolvedValue(posts),
    path: vi.fn().mockReturnThis(),
    first: vi.fn().mockResolvedValue(null),
  }
  queryCollectionMock.mockReturnValue(query)
  return query
}

beforeEach(() => {
  queryCollectionMock.mockReset()
  searchMock.mockReset()
  useSearchCollectionMock.mockReturnValue({
    status: ref('ready'),
    search: searchMock,
  })
})

describe('useBlogSearch', () => {
  it('excludes Draft and future-dated posts even when their sections are indexed', async () => {
    mockQueryCollection()
    searchMock.mockResolvedValue([
      section({ id: '/blog/terbaru' }),
      section({ id: '/blog/draf', title: 'Post Draf' }),
      section({ id: '/blog/mendatang', title: 'Post Mendatang' }),
    ])

    const { search } = await useBlogSearch()
    const results = await search('docker')

    expect(results.map(result => result.path)).toEqual(['/blog/terbaru'])
  })

  it('returns one result per Blog Post: post title wins, first engine-ranked section kept, others dropped', async () => {
    mockQueryCollection()
    searchMock.mockResolvedValue([
      section({ id: '/blog/terbaru#bagian-2', title: 'Bagian Dua', level: 2, rank: -2.5, snippets: { content: 'cuplikan terbaik <mark>docker</mark>' } }),
      section({ id: '/blog/terbaru', title: 'Post Terbaru', level: 1, rank: -1.1, snippets: { content: 'cuplikan lain' } }),
      section({ id: '/blog/terbaru#bagian-3', title: 'Bagian Tiga', level: 2, rank: -0.4, snippets: { content: 'cuplikan ketiga' } }),
    ])

    const { search } = await useBlogSearch()
    const results = await search('docker')

    expect(results).toEqual([
      {
        path: '/blog/terbaru',
        title: 'Post Terbaru',
        snippet: 'cuplikan terbaik <mark>docker</mark>',
      },
    ])
  })

  it('returns an empty list for an empty or whitespace query without searching the index', async () => {
    mockQueryCollection()

    const { search } = await useBlogSearch()

    expect(await search('')).toEqual([])
    expect(await search('   ')).toEqual([])
    expect(searchMock).not.toHaveBeenCalled()
  })

  it('asks the engine for highlighted content snippets around the match', async () => {
    mockQueryCollection()
    searchMock.mockResolvedValue([])

    const { search } = await useBlogSearch()
    await search('docker')

    expect(searchMock).toHaveBeenCalledWith('docker', {
      snippet: { columns: ['content'], around: 30 },
    })
  })

  it('falls back to the post description when the engine returns no snippet', async () => {
    mockQueryCollection()
    searchMock.mockResolvedValue([section({ id: '/blog/terbaru', snippets: undefined })])

    const { search } = await useBlogSearch()
    const results = await search('docker')

    expect(results[0]?.snippet).toBe('Publik paling baru.')
  })

  it('escapes article text in snippets so markup renders as text while highlights survive', async () => {
    mockQueryCollection()
    searchMock.mockResolvedValue([
      section({ id: '/blog/terbaru', snippets: { content: 'kode <script>alert(1)</script> dengan <mark>docker</mark>' } }),
    ])

    const { search } = await useBlogSearch()
    const results = await search('docker')

    expect(results[0]?.snippet).toBe('kode &lt;script&gt;alert(1)&lt;/script&gt; dengan <mark>docker</mark>')
  })

  it('escapes the description fallback as well', async () => {
    mockQueryCollection()
    searchMock.mockResolvedValue([section({ id: '/blog/html', snippets: undefined })])

    const { search } = await useBlogSearch()
    const results = await search('docker')

    expect(results[0]?.snippet).toBe('&lt;b&gt;Tebal&lt;/b&gt; &amp; coret')
  })
})
