import { unzipSync } from 'fflate'
import { describe, expect, it } from 'vitest'

import { buildPackageZip } from './packageZip'

describe('buildPackageZip', () => {
  it('returns a buffer that unzips back to the exact file contents', () => {
    const entries = [
      { name: 'catatan.md', data: new TextEncoder().encode('# Catatan\nIsi berkas pertama.\n') },
      { name: 'skrip.py', data: new TextEncoder().encode('print("halo")\n') },
    ]

    const zip = buildPackageZip(entries)
    const restored = unzipSync(zip)

    expect(Object.keys(restored).sort()).toEqual(['catatan.md', 'skrip.py'])
    expect(new TextDecoder().decode(restored['catatan.md'])).toBe('# Catatan\nIsi berkas pertama.\n')
    expect(new TextDecoder().decode(restored['skrip.py'])).toBe('print("halo")\n')
  })

  it('preserves binary files byte-for-byte', () => {
    const binary = new Uint8Array([0, 1, 2, 250, 251, 252, 253, 254, 255])
    const zip = buildPackageZip([{ name: 'data.bin', data: binary }])

    expect(unzipSync(zip)['data.bin']).toEqual(binary)
  })

  it('strips directory prefixes so all files land at the archive root', () => {
    const zip = buildPackageZip([
      { name: 'folder/rahasia.txt', data: new TextEncoder().encode('rahasia') },
    ])

    const restored = unzipSync(zip)
    expect(Object.keys(restored)).toEqual(['rahasia.txt'])
    expect(new TextDecoder().decode(restored['rahasia.txt'])).toBe('rahasia')
  })

  it('handles an empty entry list by producing a valid empty archive', () => {
    const zip = buildPackageZip([])

    expect(zip.byteLength).toBeGreaterThan(0)
    expect(unzipSync(zip)).toEqual({})
  })

  it('keeps two same-named files distinguishable by suffixing a counter', () => {
    const zip = buildPackageZip([
      { name: 'a/catatan.md', data: new TextEncoder().encode('satu') },
      { name: 'b/catatan.md', data: new TextEncoder().encode('dua') },
    ])

    const restored = unzipSync(zip)
    const values = Object.values(restored).map(chunk => new TextDecoder().decode(chunk)).sort()
    expect(values).toEqual(['dua', 'satu'])
  })
})
