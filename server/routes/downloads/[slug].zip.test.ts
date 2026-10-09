import { queryCollection } from '@nuxt/content/nitro'
import { unzipSync } from 'fflate'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import handler from './[slug].zip'

vi.mock('@nuxt/content/nitro', () => ({
  queryCollection: vi.fn(),
}))

const storage = new Map<string, Uint8Array | string>()
vi.mock('nitropack/runtime', () => ({
  useStorage: vi.fn(() => ({
    getItemRaw: vi.fn(async (key: string) => storage.get(key)),
  })),
}))

const catatan = new TextEncoder().encode('# Catatan\nIsi berkas pertama.\n')
const skrip = new TextEncoder().encode('print("halo")\n')

const packagedPost = {
  path: '/blog/paket-berresource',
  title: 'Paket Berresource',
  draft: false,
  publishedAt: new Date('2026-09-20T00:00:00.000Z'),
  resources: [
    { title: 'Catatan', file: '/downloads/catatan.md', bytes: catatan.byteLength },
    { title: 'Skrip', file: '/downloads/skrip.py', bytes: skrip.byteLength },
  ],
}

const barePost = {
  path: '/blog/tanpa-resource',
  title: 'Tanpa Resource',
  draft: false,
  publishedAt: new Date('2026-09-20T00:00:00.000Z'),
  resources: [],
}

function mockPost(post: unknown) {
  const query = { path: vi.fn().mockReturnThis(), first: vi.fn().mockResolvedValue(post) }
  vi.mocked(queryCollection).mockReturnValue(query as never)
}

const setHeader = vi.fn()

function fakeEvent(slug: string) {
  // `[slug].zip.ts` registers the radix3 param as `slug.zip`, and the captured
  // value includes the extension (e.g. `paket-berresource.zip`).
  return { context: { params: { 'slug.zip': `${slug}.zip` } }, node: { res: { setHeader } } } as never
}

beforeEach(() => {
  vi.mocked(queryCollection).mockReset()
  setHeader.mockReset()
  storage.clear()
  storage.set('downloads/catatan.md', catatan)
  storage.set('downloads/skrip.py', skrip)
})

describe('package zip (GET /downloads/[slug].zip)', () => {
  it('returns a zip containing every resource file of the post', async () => {
    mockPost(packagedPost)

    const response = await handler(fakeEvent('paket-berresource'))

    const restored = unzipSync(response as Uint8Array)
    expect(Object.keys(restored).sort()).toEqual(['catatan.md', 'skrip.py'])
    expect(new TextDecoder().decode(restored['catatan.md'])).toBe('# Catatan\nIsi berkas pertama.\n')
    expect(new TextDecoder().decode(restored['skrip.py'])).toBe('print("halo")\n')
  })

  it('marks the response as a file download named after the slug', async () => {
    mockPost(packagedPost)

    await handler(fakeEvent('paket-berresource'))

    expect(setHeader).toHaveBeenCalledWith('content-type', 'application/zip')
    expect(setHeader).toHaveBeenCalledWith(
      'content-disposition',
      'attachment; filename="paket-berresource.zip"',
    )
    // Deploy-stable content: cache like the homepage's SWR window.
    expect(setHeader).toHaveBeenCalledWith('cache-control', 'public, max-age=3600')
  })

  it('encodes string asset contents the same as raw bytes', async () => {
    mockPost(packagedPost)
    // The production asset driver returns strings, not Uint8Arrays.
    storage.set('downloads/catatan.md', '# Catatan\nIsi berkas pertama.\n')

    const response = await handler(fakeEvent('paket-berresource'))

    const restored = unzipSync(response as Uint8Array)
    expect(new TextDecoder().decode(restored['catatan.md'])).toBe('# Catatan\nIsi berkas pertama.\n')
  })

  it('404s when the post does not exist', async () => {
    mockPost(null)

    await expect(handler(fakeEvent('tidak-ada'))).rejects.toMatchObject({ statusCode: 404 })
  })

  it('404s when the post is a draft', async () => {
    mockPost({ ...packagedPost, draft: true })

    await expect(handler(fakeEvent('paket-berresource'))).rejects.toMatchObject({ statusCode: 404 })
  })

  it('404s when the post has no resource files', async () => {
    mockPost(barePost)

    await expect(handler(fakeEvent('tanpa-resource'))).rejects.toMatchObject({ statusCode: 404 })
  })

  it('gathers only local resources, leaving external ones out of the archive', async () => {
    mockPost({
      ...packagedPost,
      resources: [
        ...packagedPost.resources,
        { title: 'Paket latihan', file: 'https://rapidgator.net/file/abc123/paket.zip' },
      ],
    })

    const response = await handler(fakeEvent('paket-berresource'))

    // The external resource is a redirect to a PPD host: not this repo's file
    // to stat or gather, so it must not break or bloat the archive.
    expect(Object.keys(unzipSync(response as Uint8Array)).sort()).toEqual(['catatan.md', 'skrip.py'])
  })

  it('404s when the post ships only external resources', async () => {
    mockPost({
      ...packagedPost,
      resources: [{ title: 'Paket latihan', file: 'https://rapidgator.net/file/abc123/paket.zip' }],
    })

    await expect(handler(fakeEvent('paket-berresource'))).rejects.toMatchObject({ statusCode: 404 })
  })
})
