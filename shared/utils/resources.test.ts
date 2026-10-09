import { describe, expect, it } from 'vitest'

import { isExternalFile } from './resources'

describe('isExternalFile', () => {
  it('treats repository download paths as local', () => {
    expect(isExternalFile('/downloads/cheat-sheet-otomasi-excel-python.md')).toBe(false)
  })

  it('treats absolute http(s) URLs as external', () => {
    expect(isExternalFile('https://rapidgator.net/file/abc123/paket-latihan.zip')).toBe(true)
    expect(isExternalFile('http://example.com/files/paket-latihan.zip')).toBe(true)
  })

  it('treats relative paths and empty strings as local', () => {
    expect(isExternalFile('downloads/relative.md')).toBe(false)
    expect(isExternalFile('')).toBe(false)
  })
})
