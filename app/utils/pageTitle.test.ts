import { describe, expect, it } from 'vitest'

import { pageTitle } from './pageTitle'

const SITE_NAME = 'Ngoprek Online'

describe('pageTitle', () => {
  it('appends the site name to a page title', () => {
    expect(pageTitle('Blog', SITE_NAME)).toBe('Blog · Ngoprek Online')
  })

  it('returns the bare site name when no page title is set', () => {
    expect(pageTitle(undefined, SITE_NAME)).toBe('Ngoprek Online')
    expect(pageTitle(null, SITE_NAME)).toBe('Ngoprek Online')
    expect(pageTitle('', SITE_NAME)).toBe('Ngoprek Online')
  })

  it('never doubles the site name on the homepage', () => {
    expect(pageTitle('Ngoprek Online', SITE_NAME)).toBe('Ngoprek Online')
  })
})
