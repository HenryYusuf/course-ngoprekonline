# External resources via PPD links, opened by redirect

A Resource may be hosted externally on a pay-per-download (PPD) host such as Rapidgator instead of the repository's downloads area. The origin is detected from the shape of the declared link (`/downloads/...` = local, `https://...` = external); external resources open in a new tab via plain redirect, their `bytes` are optional, and the "Unduh semua" ZIP bundles only local resources. We chose redirect over a server proxy that force-downloads: PPD hosts typically block hotlinking and issue expiring, tokenized URLs, so a proxy would be fragile and a bandwidth liability.

## Considered Options

- **Redirect to the PPD link in a new tab** (chosen)
- **Nitro proxy re-serving the file with `Content-Disposition: attachment`**: PPD hosts block hotlinking, URLs expire and are tokenized, and the site would carry the bandwidth cost
- **Force-download via `<a download>`**: ignored by browsers cross-origin, silently degrading to navigation
- **Keep every resource repo-local**: contradicts the actual storage situation; large files do not belong in git

## Consequences

- The resources invariant test branches by origin: local files must exist on disk with matching `bytes`; external links need only match `^https?://`. No network checks, because PPD links expire and reject HEAD.
- `bytes` becomes optional; when any resource on a post lacks it, the PostCard shows the resource count alone rather than a partial total.
- The ZIP route combines local resources only, and its button appears only when a post has two or more local resources.
- External links can die without a deploy; recovery is editing the link in frontmatter.
