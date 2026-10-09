import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Vitest runs from the project root, so content/ and public/ are stable here.
const contentDir = join(process.cwd(), 'content')
const publicDir = join(process.cwd(), 'public')

interface ResourcePair {
  file: string
  bytes: number
}

/**
 * Extract `file:` / `bytes:` pairs from the nested `resources:` frontmatter list.
 * Frontmatter in this repo always lists `file` then `bytes` per item.
 * Newlines are normalized so CRLF checkouts (Windows CI) parse the same as LF.
 */
function resourcePairs(source: string): ResourcePair[] {
  const text = source.replace(/\r\n/g, '\n')
  const block = text.match(/resources:\n([\s\S]*?)(?=\n\S|$)/)?.[1] ?? ''
  const files = [...block.matchAll(/file:\s*(\S+)/g)].map(match => match[1])
  const sizes = [...block.matchAll(/bytes:\s*(\d+)/g)].map(match => Number(match[1]))
  return files.map((file, index) => ({ file, bytes: sizes[index]! }))
}

describe('content resource size invariant', () => {
  it('declares bytes that match the real download file, so spec plates never lie', () => {
    const posts = readdirSync(join(contentDir, 'blog')).filter(name => name.endsWith('.md'))
    expect(posts.length).toBeGreaterThan(0)

    let checked = 0
    for (const name of posts) {
      const source = readFileSync(join(contentDir, 'blog', name), 'utf8')
      for (const { file, bytes } of resourcePairs(source)) {
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

  it('keeps every multi-resource post able to offer the "download all" zip', () => {
    const posts = readdirSync(join(contentDir, 'blog')).filter(name => name.endsWith('.md'))
    const multiResourcePosts = posts.filter(
      name => resourcePairs(readFileSync(join(contentDir, 'blog', name), 'utf8')).length >= 2,
    )

    // The zip route only adds value once several files ship together, so at
    // least one post must exercise it and stay covered by the SpecPlate button.
    expect(multiResourcePosts.length).toBeGreaterThanOrEqual(2)
  })
})
