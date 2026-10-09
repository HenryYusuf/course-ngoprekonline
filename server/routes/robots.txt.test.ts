import { describe, expect, it, vi } from 'vitest'

import handler from './robots.txt'

vi.mock('nitropack/runtime', () => ({
  useRuntimeConfig: vi.fn(() => ({
    public: { siteUrl: 'https://ngoprekonline.example' },
  })),
}))

function renderRobots() {
  return handler({} as never)
}

function parseText(text: string) {
  return text.split(/\r?\n/).map(line => line.trim()).filter(Boolean)
}

describe('robots.txt (GET /robots.txt)', () => {
  it('allows all crawlers and points at the sitemap on the configured site URL', async () => {
    const body = await renderRobots()
    const lines = parseText(body)

    expect(lines).toContain('User-Agent: *')
    expect(lines).toContain('Allow: /')
    expect(lines).toContain('Sitemap: https://ngoprekonline.example/sitemap.xml')
  })

  it('is plain text a crawler can read without HTML wrapping', async () => {
    const body = await renderRobots()

    expect(typeof body).toBe('string')
    expect(body).not.toContain('<')
  })
})
