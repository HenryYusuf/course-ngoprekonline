import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { isExternalFile } from '../shared/utils/resources'

// Vitest runs from the project root, so content/ and public/ are stable here.
const contentDir = join(process.cwd(), 'content')
const publicDir = join(process.cwd(), 'public')

interface ResourcePair {
  file: string
  bytes?: number
}

/**
 * Extract `file:` / `bytes:` pairs from the nested `resources:` frontmatter list.
 * Each `-` item is parsed on its own: an external Resource may omit `bytes`,
 * and pairing by position would shift every following local Resource's size.
 * Newlines are normalized so CRLF checkouts (Windows CI) parse the same as LF.
 */
function resourcePairs(source: string): ResourcePair[] {
  const text = source.replace(/\r\n/g, '\n')
  const block = text.match(/resources:\n([\s\S]*?)(?=\n\S|$)/)?.[1] ?? ''
  return block
    .split(/(?=^\s*- )/m)
    .filter(item => item.trim().startsWith('-'))
    .map((item) => {
      const file = item.match(/file:\s*(\S+)/)?.[1] ?? ''
      const size = item.match(/bytes:\s*(\d+)/)?.[1]
      return { file, bytes: size === undefined ? undefined : Number(size) }
    })
}

describe('content resource size invariant', () => {
  it('keeps local resources on disk with matching bytes, and external ones as bare URLs', () => {
    const posts = readdirSync(join(contentDir, 'blog')).filter(name => name.endsWith('.md'))
    expect(posts.length).toBeGreaterThan(0)

    let checked = 0
    for (const name of posts) {
      const source = readFileSync(join(contentDir, 'blog', name), 'utf8')
      for (const { file, bytes } of resourcePairs(source)) {
        if (isExternalFile(file)) {
          // External PPD links are validated by shape only: they expire,
          // reject HEAD, and are not this repo's files to stat (ADR 0004).
          expect(file, `${name}: external resource URL`).toMatch(/^https?:\/\//)
          checked++
          continue
        }
        expect(file, `${name}: resource file path`).toMatch(/^\/downloads\//)
        const realBytes = statSync(join(publicDir, file)).size
        expect(
          bytes,
          `${name}: bytes for ${file} must be ${realBytes}, got ${bytes}`,
        ).toBe(realBytes)
        checked++
      }
    }
    // Every packaged post currently ships at least one file; this floor
    // guards against a mass-edit silently emptying the download library.
    expect(checked).toBeGreaterThanOrEqual(11)
  })

  it('keeps every post with two or more local resources able to offer the "download all" zip', () => {
    const posts = readdirSync(join(contentDir, 'blog')).filter(name => name.endsWith('.md'))
    // The zip bundles local files only, so the threshold counts local Resources.
    const multiResourcePosts = posts.filter(
      name => resourcePairs(readFileSync(join(contentDir, 'blog', name), 'utf8'))
        .filter(resource => !isExternalFile(resource.file))
        .length >= 2,
    )

    // The zip route only adds value once several files ship together, so at
    // least one post must exercise it and stay covered by the SpecPlate button.
    expect(multiResourcePosts.length).toBeGreaterThanOrEqual(2)
  })
})
