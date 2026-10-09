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

  it('states the empty package honestly when no files ship', async () => {
    const wrapper = await mountSuspended(SpecPlate)
    const html = wrapper.html()

    expect(html).toContain('Paket ini belum menyertakan berkas unduhan')
    expect(html).toContain('0 berkas')
    expect(html).toContain('0 B')
    expect(html).not.toContain('<ul')
  })
})
