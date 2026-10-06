import { readdirSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Vitest runs from the project root, so the content directory is stable here.
const contentDir = join(process.cwd(), 'content')

/** Minimal reader for the flat, repo-owned frontmatter and plain-YAML shapes in content/. */
function flatEntries(source: string): Record<string, string> {
  // Posts carry a frontmatter block; category data files are plain YAML.
  const lines = source.split(/\r?\n/)
  let body = lines
  if (lines[0] === '---') {
    const end = lines.indexOf('---', 1)
    body = end === -1 ? [] : lines.slice(1, end)
  }
  const entries: Record<string, string> = {}
  for (const line of body) {
    const colon = line.indexOf(':')
    if (colon <= 0) {
      continue
    }
    const key = line.slice(0, colon)
    if (!/^[\w-]+$/.test(key)) {
      continue
    }
    const value = line.slice(colon + 1).trim()
    if (value !== '') {
      entries[key] = value.replace(/^['"]|['"]$/g, '')
    }
  }
  return entries
}

describe('content category invariant', () => {
  const categoryFiles = readdirSync(join(contentDir, 'categories')).filter(name => name.endsWith('.yml'))
  const curatedSlugs = categoryFiles.map(name => flatEntries(readFileSync(join(contentDir, 'categories', name), 'utf8')).slug)

  it('curates every category with slug, label, and description, and the slug matches the file name', () => {
    expect(categoryFiles.length).toBeGreaterThan(0)
    for (const name of categoryFiles) {
      const entry = flatEntries(readFileSync(join(contentDir, 'categories', name), 'utf8'))
      expect(entry.slug, `${name} carries a slug`).toBeTruthy()
      expect(entry.slug, `${name}: slug must match the file name`).toBe(basename(name, '.yml'))
      expect(entry.label, `${name} carries a display label`).toBeTruthy()
      expect(entry.description, `${name} carries a description`).toBeTruthy()
    }
  })

  it('gives every Blog Post a Category that resolves against the curated list', () => {
    const posts = readdirSync(join(contentDir, 'blog')).filter(name => name.endsWith('.md'))
    expect(posts.length).toBeGreaterThan(0)
    for (const name of posts) {
      const frontmatter = flatEntries(readFileSync(join(contentDir, 'blog', name), 'utf8'))
      expect(frontmatter.category, `${name} declares exactly one category`).toBeTruthy()
      expect(curatedSlugs, `${name} references a curated category (got ${frontmatter.category})`).toContain(frontmatter.category)
    }
  })
})
