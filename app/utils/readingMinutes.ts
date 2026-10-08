interface ContentNode {
  type?: unknown
  value?: unknown
  children?: unknown
}

/**
 * Walk the @nuxt/content mdast body and join every text-bearing node.
 * Unknown shapes are skipped, so a missing or mocked body degrades to an
 * empty string instead of throwing during render.
 */
function collectText(node: unknown, out: string[]): void {
  if (!node || typeof node !== 'object')
    return
  const candidate = node as ContentNode
  if (typeof candidate.value === 'string')
    out.push(candidate.value)
  if (Array.isArray(candidate.children)) {
    for (const child of candidate.children)
      collectText(child, out)
  }
}

/**
 * Reading time at 200 words per minute, floored at 1 minute: a spec-plate
 * value that stays honest for real articles and safe for bodies the tests
 * do not provide.
 */
export function readingMinutes(body: unknown): number {
  const parts: string[] = []
  collectText(body, parts)
  const words = parts.join(' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
