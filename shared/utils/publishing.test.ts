import { describe, expect, it } from 'vitest'

import { isPublished } from './publishing'

describe('isPublished', () => {
  const now = new Date('2026-10-06T00:00:00.000Z')

  it('is true for a non-draft post published in the past', () => {
    expect(isPublished({ draft: false, publishedAt: new Date('2026-09-20') }, now)).toBe(true)
  })

  it('is false for a draft post even with a past date', () => {
    expect(isPublished({ draft: true, publishedAt: new Date('2026-09-20') }, now)).toBe(false)
  })

  it('is false for a future publish date', () => {
    expect(isPublished({ draft: false, publishedAt: new Date('2026-12-01') }, now)).toBe(false)
  })

  it('accepts ISO string dates', () => {
    expect(isPublished({ draft: false, publishedAt: '2026-09-20' }, now)).toBe(true)
  })

  it('treats a missing draft flag as not a draft (Content v3 omits defaulted fields)', () => {
    expect(isPublished({ draft: undefined, publishedAt: new Date('2026-09-20') }, now)).toBe(true)
  })

  it('counts a post published exactly at the current moment as published', () => {
    expect(isPublished({ draft: false, publishedAt: now }, now)).toBe(true)
  })
})
