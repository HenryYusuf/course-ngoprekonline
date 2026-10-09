import { zipSync } from 'fflate'

export interface ZipEntry {
  name: string
  data: Uint8Array
}

/**
 * Build a ZIP archive from in-memory entries. Directory prefixes are stripped
 * so every file lands at the archive root; colliding basenames get a numeric
 * suffix so no entry silently overwrites another.
 */
export function buildPackageZip(entries: ZipEntry[]): Uint8Array {
  const files: Record<string, Uint8Array> = {}
  const used = new Set<string>()

  for (const { name, data } of entries) {
    const base = name.split('/').pop() || name
    let candidate = base
    let counter = 2
    while (used.has(candidate)) {
      const dot = base.lastIndexOf('.')
      candidate = dot > 0
        ? `${base.slice(0, dot)}-${counter}${base.slice(dot)}`
        : `${base}-${counter}`
      counter++
    }
    used.add(candidate)
    files[candidate] = data
  }

  return zipSync(files)
}
