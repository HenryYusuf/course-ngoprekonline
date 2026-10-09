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

  it('states the empty package honestly when no files ship', async () => {
    const wrapper = await mountSuspended(SpecPlate)
    const html = wrapper.html()

    expect(html).toContain('Paket ini belum menyertakan berkas unduhan')
    expect(html).toContain('0 berkas')
    expect(html).toContain('0 B')
    expect(html).not.toContain('<ul')
  })
})
