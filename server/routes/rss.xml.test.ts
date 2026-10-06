import { queryCollection } from '@nuxt/content/nitro'
import { Window } from 'happy-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import handler from './rss.xml'

vi.mock('@nuxt/content/nitro', () => ({
  queryCollection: vi.fn(),
}))
vi.mock('nitropack/runtime', () => ({
  useRuntimeConfig: vi.fn(() => ({
    public: {
      siteUrl: 'https://ngoprekonline.example',
      siteName: 'Ngoprek Online',
    },
  })),
}))

const curatedCategories = [
  { slug: 'tutorial', label: 'Tutorial', description: 'Panduan langkah demi langkah.' },
  { slug: 'umum', label: 'Umum', description: 'Catatan ringan seputar situs.' },
]

const publishedPost = {
  path: '/blog/artikel-terbit',
  title: 'Artikel Terbit',
  description: 'Sudah dipublikasikan.',
  publishedAt: new Date('2026-09-20T00:00:00.000Z'),
  category: 'umum',
  tags: ['umum'],
}

const draftPost = {
  path: '/blog/artikel-draf',
  title: 'Artikel Draf',
  description: 'Belum dipublikasikan.',
  publishedAt: new Date('2026-10-01T00:00:00.000Z'),
  draft: true,
  category: 'umum',
  tags: [],
}

function mockQueries(blogResult: unknown[], categoryResult: unknown[] = curatedCategories) {
  const blogQuery = {
    order: vi.fn().mockReturnThis(),
    all: vi.fn().mockResolvedValue(blogResult),
  }
  const categoryQuery = {
    all: vi.fn().mockResolvedValue(categoryResult),
  }
  vi.mocked(queryCollection).mockImplementation((_event, name) =>
    name === 'categories' ? categoryQuery as never : blogQuery as never)
}

async function renderFeed(posts: unknown[], categoryResult?: unknown[]) {
  mockQueries(posts, categoryResult)
  const setHeader = vi.fn()
  // Minimal structural shim: the handler only reads `node.res.setHeader`.
  const event = { node: { res: { setHeader } } } as never
  const xml = await handler(event)
  return { xml, setHeader }
}

function parseXml(xml: string) {
  // happy-dom requires a Window instance when parsing outside a browser
  const domWindow = new Window({ url: 'https://localhost' })
  return new domWindow.DOMParser().parseFromString(xml, 'application/xml')
}

beforeEach(() => {
  vi.mocked(queryCollection).mockReset()
})

describe('rss feed (GET /rss.xml)', () => {
  it('responds with valid RSS XML describing the site channel', async () => {
    const { xml, setHeader } = await renderFeed([publishedPost])

    const doc = parseXml(xml)
    expect(doc.querySelector('parsererror')).toBeNull()
    expect(doc.querySelector('channel > title')?.textContent).toBe('Ngoprek Online')
    expect(doc.querySelector('channel > link')?.textContent).toBe('https://ngoprekonline.example')
    expect(setHeader).toHaveBeenCalledWith('content-type', 'application/rss+xml; charset=utf-8')
  })

  it('excludes draft posts from the feed', async () => {
    const { xml } = await renderFeed([publishedPost, draftPost])

    const doc = parseXml(xml)
    const titles = [...doc.querySelectorAll('item > title')].map(node => node.textContent)
    expect(titles).toEqual(['Artikel Terbit'])
  })

  it('escapes XML special characters so titles round-trip through the parser', async () => {
    const tricky = { ...publishedPost, title: '<Kode & "Trik">' }
    const { xml } = await renderFeed([tricky])

    expect(xml).toContain('&lt;Kode &amp; &quot;Trik&quot;&gt;')
    const doc = parseXml(xml)
    expect(doc.querySelector('parsererror')).toBeNull()
    expect(doc.querySelector('item > title')?.textContent).toBe('<Kode & "Trik">')
  })

  it('links each item permanently with its publish date', async () => {
    const { xml } = await renderFeed([publishedPost])

    const doc = parseXml(xml)
    const item = doc.querySelector('item')
    expect(item?.querySelector('link')?.textContent).toBe('https://ngoprekonline.example/blog/artikel-terbit')
    expect(item?.querySelector('guid')?.getAttribute('isPermaLink')).toBe('true')
    expect(new Date(item?.querySelector('pubDate')?.textContent ?? '').getUTCFullYear()).toBe(2026)
  })

  it('labels each item with the curated category of its post', async () => {
    const { xml } = await renderFeed([{ ...publishedPost, category: 'tutorial' }])

    const doc = parseXml(xml)
    expect(doc.querySelector('item > category')?.textContent).toBe('Tutorial')
  })

  it('falls back to the raw slug when a post category is not in the curated list', async () => {
    const { xml } = await renderFeed([{ ...publishedPost, category: 'hilang' }], [])

    const doc = parseXml(xml)
    expect(doc.querySelector('item > category')?.textContent).toBe('hilang')
  })
})
