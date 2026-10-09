import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import HeroSection from './HeroSection.vue'

const featuredPost = {
  path: '/blog/otomasi-excel-python',
  title: 'Otomasi Excel dengan Python',
  description: 'Hentikan kerja manual di spreadsheet.',
  publishedAt: new Date('2026-10-06'),
  resources: [
    { title: 'Cheat sheet', file: '/downloads/cheat-sheet-otomasi-excel-python.md', bytes: 2069 },
    { title: 'Template script', file: '/downloads/template-script-otomasi-excel.py', bytes: 1618 },
  ],
}

describe('heroSection', () => {
  it('renders the featured package with stamp, CTAs, and a spec plate', async () => {
    const wrapper = await mountSuspended(HeroSection, {
      props: { post: featuredPost, categoryLabel: 'Tutorial' },
    })
    const html = wrapper.html()

    expect(html).toContain('Paket terbaru · Tutorial')
    expect(html).toContain('Otomasi Excel dengan Python')
    expect(html).toContain('Hentikan kerja manual di spreadsheet.')

    const readLink = wrapper.find('a[href="/blog/otomasi-excel-python"]')
    expect(readLink.exists()).toBe(true)
    expect(readLink.text()).toContain('BACA PAKET')

    const jumpLink = wrapper.find('a[href="#spesifikasi"]')
    expect(jumpLink.exists()).toBe(true)
    expect(jumpLink.text()).toContain('LIHAT ISI')
  })

  it('spec plate anchors the section and reports the package honestly', async () => {
    const wrapper = await mountSuspended(HeroSection, {
      props: { post: featuredPost, categoryLabel: 'Tutorial' },
    })
    const html = wrapper.html()

    expect(wrapper.find('#spesifikasi').exists()).toBe(true)
    expect(html).toContain('Spesifikasi Paket')
    expect(html).toContain('Isi Unduhan')
    expect(html).toContain('Tutorial')
    expect(html).toContain('6 Oktober 2026')
    expect(html).toContain('2 berkas')
    // 2069 + 1618 bytes, formatted with the Indonesian decimal comma
    expect(html).toContain('3,6 KB')

    const download = wrapper.find('a[href="/downloads/cheat-sheet-otomasi-excel-python.md"]')
    expect(download.exists()).toBe(true)
    expect(download.attributes('download')).toBe('cheat-sheet-otomasi-excel-python.md')

    // The featured post ships two files, so the homepage plate offers the zip too.
    const zip = wrapper.find('a[href="/downloads/otomasi-excel-python.zip"]')
    expect(zip.exists()).toBe(true)
    expect(zip.text()).toContain('Unduh semua')
    expect(zip.text()).toContain('ZIP · isi 3,6 KB')
  })

  it('states an honest empty package when the featured post ships no files', async () => {
    const wrapper = await mountSuspended(HeroSection, {
      props: {
        post: { ...featuredPost, resources: [] },
        categoryLabel: 'Umum',
      },
    })
    const html = wrapper.html()

    expect(html).toContain('0 berkas')
    expect(html).toContain('Paket ini belum menyertakan berkas unduhan')
  })

  it('renders the shelf fallback when there is no featured post', async () => {
    const wrapper = await mountSuspended(HeroSection)
    const html = wrapper.html()

    expect(html).toContain('Tutorial Indonesia, siap dibaca dan diunduh.')
    expect(html).toContain('Edutorial blog download')
    expect(html).toContain('Belum ada paket terbit')
    expect(wrapper.find('a[href="/blog"]').text()).toContain('LIHAT ARSIP')
  })
})
