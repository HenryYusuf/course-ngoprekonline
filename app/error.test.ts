import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import ErrorPage from './error.vue'

function errorProps(statusCode: number, statusMessage?: string) {
  return {
    props: {
      error: {
        statusCode,
        statusMessage,
        message: statusMessage ?? `Error ${statusCode}`,
      } as never,
    },
  }
}

describe('error page', () => {
  it('renders an Indonesian 404 with a way home', async () => {
    const wrapper = await mountSuspended(ErrorPage, errorProps(404, 'Post tidak ditemukan'))
    const html = wrapper.html()

    expect(html).toContain('404')
    expect(html).toContain('Halaman tidak ditemukan')
    expect(html).toContain('Kembali ke beranda')
    expect(html).toContain('Ngoprek.Online')
  })

  it('renders a generic Indonesian message for non-404 failures', async () => {
    const wrapper = await mountSuspended(ErrorPage, errorProps(500))
    const html = wrapper.html()

    expect(html).toContain('500')
    expect(html).toContain('Terjadi kesalahan')
    expect(html).not.toContain('Halaman tidak ditemukan')
  })
})
