import { describe, expect, it } from 'vitest'

import { findCategory, isValidCategorySlug } from './categories'

const categories = [
  { slug: 'tutorial', label: 'Tutorial', description: 'Panduan langkah demi langkah.' },
  { slug: 'umum', label: 'Umum', description: 'Catatan ringan seputar situs.' },
]

describe('isValidCategorySlug', () => {
  it('accepts simple lowercase slugs', () => {
    expect(isValidCategorySlug('tutorial')).toBe(true)
  })

  it('accepts hyphenated slugs', () => {
    expect(isValidCategorySlug('tips-trik')).toBe(true)
  })

  it('rejects uppercase, spaces, slashes, and empty slugs', () => {
    expect(isValidCategorySlug('Tutorial')).toBe(false)
    expect(isValidCategorySlug('dua kata')).toBe(false)
    expect(isValidCategorySlug('a/b')).toBe(false)
    expect(isValidCategorySlug('')).toBe(false)
  })
})

describe('findCategory', () => {
  it('finds a curated category by its slug', () => {
    expect(findCategory(categories, 'tutorial')).toEqual(categories[0])
  })

  it('returns undefined for a slug outside the curated list', () => {
    expect(findCategory(categories, 'tidak-ada')).toBeUndefined()
  })

  it('handles an empty curated list', () => {
    expect(findCategory([], 'umum')).toBeUndefined()
  })
})
