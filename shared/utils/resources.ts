/**
 * A Resource's origin is inferred from its declared link: a `/downloads/...`
 * path is a file this repo serves itself; an absolute http(s) URL points at
 * an external PPD host that the site links out to (ADR 0004). Origin is
 * detected from the link's shape, never from a separate flag.
 */
export function isExternalFile(file: string): boolean {
  return /^https?:\/\//.test(file)
}
