import { describe, expect, it } from 'vitest'

import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('formats a date in Indonesian', () => {
    expect(formatDate('2026-10-06')).toBe('6 Oktober 2026')
  })
})
