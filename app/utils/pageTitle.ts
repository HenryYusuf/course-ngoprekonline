export function pageTitle(title: string | null | undefined, siteName: string): string {
  if (!title || title === siteName)
    return siteName
  return `${title} · ${siteName}`
}
