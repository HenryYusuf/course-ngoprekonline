import { describe, expect, it } from 'vitest'

import { isExternalFile, isLocalDownload } from './resources'

describe('isExternalFile', () => {
  it('treats absolute http(s) URLs as external', () => {
    expect(isExternalFile('https://rapidgator.net/file/abc123/paket-latihan.zip')).toBe(true)
    expect(isExternalFile('http://example.com/files/paket-latihan.zip')).toBe(true)
  })

  it('matches the scheme regardless of case', () => {
    expect(isExternalFile('HTTPS://rapidgator.net/file/abc123/paket.zip')).toBe(true)
  })

  it('treats repository download paths as not external', () => {
    expect(isExternalFile('/downloads/cheat-sheet-otomasi-excel-python.md')).toBe(false)
  })

  it('treats relative paths and empty strings as not external', () => {
    expect(isExternalFile('downloads/relative.md')).toBe(false)
    expect(isExternalFile('')).toBe(false)
  })
})

describe('isLocalDownload', () => {
  it('recognizes the repository download area', () => {
    expect(isLocalDownload('/downloads/cheat-sheet-otomasi-excel-python.md')).toBe(true)
  })

  it('rejects absolute URLs and relative paths', () => {
    expect(isLocalDownload('https://rapidgator.net/file/abc123/paket.zip')).toBe(false)
    expect(isLocalDownload('downloads/relative.md')).toBe(false)
  })
})
