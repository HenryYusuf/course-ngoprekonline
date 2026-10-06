import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCategories } from './useCategories'

const queryCollectionMock = vi.hoisted(() => vi.fn())
mockNuxtImport('queryCollection', () => queryCollectionMock)

beforeEach(() => {
  queryCollectionMock.mockReset()
})

describe('useCategories', () => {
  it('reads the curated category list from the categories collection', async () => {
    const query = {
      all: vi.fn().mockResolvedValue([
        { slug: 'tutorial', label: 'Tutorial', description: 'Panduan langkah demi langkah.' },
        { slug: 'umum', label: 'Umum', description: 'Catatan ringan seputar situs.' },
      ]),
    }
    queryCollectionMock.mockReturnValue(query)

    const categories = await useCategories()

    expect(queryCollectionMock).toHaveBeenCalledWith('categories')
    expect(categories).toHaveLength(2)
    expect(categories[0]?.slug).toBe('tutorial')
  })

  it('returns an empty list when no category is curated yet', async () => {
    queryCollectionMock.mockReturnValue({ all: vi.fn().mockResolvedValue([]) })

    expect(await useCategories()).toEqual([])
  })
})
