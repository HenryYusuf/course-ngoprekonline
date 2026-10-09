import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import SpecPlate from './SpecPlate.vue'

const resources = [
  { title: 'Cheat sheet', file: '/downloads/cheat-sheet-otomasi-excel-python.md', bytes: 2069 },
  { title: 'Template script', file: '/downloads/template-script-otomasi-excel.py', bytes: 1618 },
]

describe('specPlate', () => {
  it('lists the package rows with honest totals', async () => {
    const wrapper = await mountSuspended(SpecPlate, {
      props: {
        id: 'spesifikasi',
        categoryLabel: 'Tutorial',
        publishedAt: new Date('2026-10-06'),
        resources,
      },
    })
    const html = wrapper.html()

    expect(wrapper.find('#spesifikasi').exists()).toBe(true)
    expect(html).toContain('Spesifikasi Paket')
    expect(html).toContain('Isi Unduhan')
    expect(html).toContain('Tutorial')
    expect(html).toContain('6 Oktober 2026')
    expect(html).toContain('2 berkas')
    expect(html).toContain('3,6 KB')

    const first = wrapper.find('a[href="/downloads/cheat-sheet-otomasi-excel-python.md"]')
    expect(first.exists()).toBe(true)
    expect(first.attributes('download')).toBe('cheat-sheet-otomasi-excel-python.md')
    expect(html).toContain('MD · 2 KB')

    const second = wrapper.find('a[href="/downloads/template-script-otomasi-excel.py"]')
    expect(second.exists()).toBe(true)
    expect(html).toContain('PY · 1,6 KB')
  })

  it('offers a single zip of the whole package when several files ship', async () => {
    const wrapper = await mountSuspended(SpecPlate, {
      props: { slug: 'otomasi-excel-python', resources },
    })

    const zip = wrapper.find('a[href="/downloads/otomasi-excel-python.zip"]')
    expect(zip.exists()).toBe(true)
    expect(zip.attributes('download')).toBe('otomasi-excel-python.zip')
    expect(zip.text()).toContain('Unduh semua')
    // The badge labels the summed source sizes as contents, not archive size.
    expect(zip.text()).toContain('ZIP · isi 3,6 KB')
  })

  it('counts only local resources toward the zip, ignoring external ones', async () => {
    const wrapper = await mountSuspended(SpecPlate, {
      props: {
        slug: 'campur',
        // One local + one external = two resources, but only one local file.
        resources: [
          resources[0]!,
          { title: 'Paket latihan', file: 'https://rapidgator.net/file/abc123/paket-latihan.zip' },
        ],
      },
    })

    const hrefs = wrapper.findAll('a').map(a => a.attributes('href') ?? '')
    // A ZIP of a single local file adds nothing over the direct link, so the
    // external resource must not be counted toward the "several files" gate.
    // Only the bundled route counts: an external href may also end in `.zip`.
    expect(hrefs.filter(href => href.startsWith('/downloads/') && href.endsWith('.zip'))).toEqual([])
    wrapper.unmount()
  })

  it('sums the zip badge from local bytes only', async () => {
    const wrapper = await mountSuspended(SpecPlate, {
      props: {
        slug: 'campur',
        resources: [
          resources[0]!,
          resources[1]!,
          { title: 'Paket latihan', file: 'https://rapidgator.net/file/abc123/paket-latihan.zip' },
        ],
      },
    })

    // 2069 + 1618 local bytes; the external resource contributes nothing.
    expect(wrapper.find('a[href="/downloads/campur.zip"]').text()).toContain('ZIP · isi 3,6 KB')
  })

  it('hides the zip button when only one file ships', async () => {
    const wrapper = await mountSuspended(SpecPlate, {
      props: { slug: 'panduan-docker-untuk-pemula', resources: [resources[0]!] },
    })

    expect(wrapper.find('a[href$=".zip"]').exists()).toBe(false)
  })

  it('hides the zip button when the post slug is unknown', async () => {
    const wrapper = await mountSuspended(SpecPlate, { props: { resources } })

    expect(wrapper.find('a[href$=".zip"]').exists()).toBe(false)
  })

  it('links an external resource out to a new tab without a download attribute', async () => {
    const wrapper = await mountSuspended(SpecPlate, {
      props: {
        resources: [{
          title: 'Paket latihan',
          file: 'https://rapidgator.net/file/abc123/paket-latihan.zip',
        }],
      },
    })

    const link = wrapper.find('a[href="https://rapidgator.net/file/abc123/paket-latihan.zip"]')
    expect(link.exists()).toBe(true)
    // A cross-origin `download` attribute is ignored by browsers, and this is
    // a redirect to a PPD host, not a file this site serves.
    expect(link.attributes('download')).toBeUndefined()
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener')
    // Extension is taken from the URL's last path segment.
    expect(link.text()).toContain('ZIP')
    // No declared size, so none is shown rather than a misleading zero.
    expect(link.text()).not.toContain('KB')
    expect(link.text()).toContain('Buka di situs lain')
  })

  it('states the empty package honestly when no files ship', async () => {
    const wrapper = await mountSuspended(SpecPlate)
    const html = wrapper.html()

    expect(html).toContain('Paket ini belum menyertakan berkas unduhan')
    expect(html).toContain('0 berkas')
    expect(html).toContain('0 B')
    expect(html).not.toContain('<ul')
  })
})
