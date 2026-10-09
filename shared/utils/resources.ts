/**
 * A Resource's origin is inferred from its declared link: a `/downloads/...`
 * path is a file this repo serves itself; an absolute http(s) URL points at
 * an external PPD host that the site links out to (ADR 0004). Origin is
 * detected from the link's shape, never from a separate flag.
 */
export function isExternalFile(file: string): boolean {
  return /^https?:\/\//i.test(file)
}

/** The positive half of the ADR-0004 rule: a link this repo serves itself. */
export function isLocalDownload(file: string): boolean {
  return /^\/downloads\//.test(file)
}

/**
 * An attached downloadable of a Blog Post. Local Resources live in the
 * repo's downloads area and must declare `bytes`; external ones link to a
 * PPD host and may omit the size, which is the host's to know (ADR 0004).
 */
export interface Resource {
  title: string
  file: string
  bytes?: number
}
