import { describe, expect, it } from 'vitest'

import { pageWindow, paginate } from './pagination'

function range(n: number) {
  return Array.from({ length: n }, (_, i) => i + 1)
}

describe('paginate', () => {
  it('slices the requested page and reports totals', () => {
    const result = paginate(range(30), 1, 24)
    expect(result.items).toEqual(range(24))
    expect(result.page).toBe(1)
    expect(result.totalPages).toBe(2)
    expect(result.total).toBe(30)
  })

  it('returns the remainder on the last page', () => {
    const result = paginate(range(30), 2, 24)
    expect(result.items).toEqual([25, 26, 27, 28, 29, 30])
    expect(result.page).toBe(2)
  })

  it('clamps pages beyond the last page to the last page', () => {
    const result = paginate(range(30), 99, 24)
    expect(result.page).toBe(2)
    expect(result.items).toEqual([25, 26, 27, 28, 29, 30])
  })

  it('clamps zero, negative, and non-finite pages to the first page', () => {
    expect(paginate(range(30), 0, 24).page).toBe(1)
    expect(paginate(range(30), -3, 24).page).toBe(1)
    expect(paginate(range(30), Number.NaN, 24).page).toBe(1)
    expect(paginate(range(30), Number.POSITIVE_INFINITY, 24).page).toBe(2)
  })

  it('never divides by zero: perPage below 1 counts one item per page', () => {
    expect(paginate(range(3), 1, 0).totalPages).toBe(3)
    expect(paginate(range(3), 2, -5).items).toEqual([2])
  })

  it('handles empty collections as a single empty page', () => {
    const result = paginate([], 4, 24)
    expect(result.items).toEqual([])
    expect(result.page).toBe(1)
    expect(result.totalPages).toBe(1)
  })
})

describe('pageWindow', () => {
  it('shows every page when there are few', () => {
    expect(pageWindow(1, 1)).toEqual([1])
    expect(pageWindow(2, 2)).toEqual([1, 2])
    expect(pageWindow(5, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('marks omitted runs with a 0 separator', () => {
    expect(pageWindow(4, 9)).toEqual([1, 0, 3, 4, 5, 0, 9])
    expect(pageWindow(1, 9)).toEqual([1, 2, 0, 9])
    expect(pageWindow(9, 9)).toEqual([1, 0, 8, 9])
  })

  it('clamps out-of-range currents before building the window', () => {
    expect(pageWindow(0, 9)).toEqual(pageWindow(1, 9))
    expect(pageWindow(42, 9)).toEqual(pageWindow(9, 9))
  })

  it('clamps infinite currents to the last page', () => {
    expect(pageWindow(Number.POSITIVE_INFINITY, 9)).toEqual(pageWindow(9, 9))
  })
})
