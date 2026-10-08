import { describe, expect, it } from 'vitest'

import { formatBytes } from './formatBytes'

describe('formatBytes', () => {
  it('keeps bytes exact without a unit switch', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(1023)).toBe('1023 B')
  })

  it('switches to KB and MB at binary thresholds', () => {
    expect(formatBytes(1024)).toBe('1 KB')
    expect(formatBytes(2048)).toBe('2 KB')
    expect(formatBytes(1024 * 1024)).toBe('1 MB')
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB')
  })

  it('formats fractions with the Indonesian decimal comma', () => {
    expect(formatBytes(1536)).toBe('1,5 KB')
    expect(formatBytes(1024 * 1024 * 2.5)).toBe('2,5 MB')
  })

  it('never throws on nonsense input', () => {
    expect(formatBytes(Number.NaN)).toBe('0 B')
    expect(formatBytes(-5)).toBe('0 B')
  })
})
