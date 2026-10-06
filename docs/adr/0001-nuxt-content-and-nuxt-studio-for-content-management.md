# Git-based content with Nuxt Content and self-hosted Nuxt Studio

Blog content is managed as Markdown files in the repository through Nuxt Content v3, with self-hosted Nuxt Studio (free and open source since January 2026) as the visual editing UI. We chose this over a headless CMS (Sanity, Strapi, Contentful) and over a custom database-backed admin panel because it needs no database, no separate auth system, and no vendor account, while still giving non-technical editors a real editing interface; content changes flow through the existing git and CI pipeline.

## Considered Options

- **Nuxt Content + Nuxt Studio** (chosen)
- **Headless CMS** (Sanity, Strapi, Contentful): external accounts, API keys, vendor dependency
- **Custom admin panel** (database + server routes + auth): the largest build, and the only option requiring persistent infrastructure
- **Plain Markdown without Studio**: viable, but no editing UI for non-developers

## Consequences

- Publishing is a commit; the repository is the source of truth for content.
- Enabling Studio in production requires a GitHub OAuth app (deferred until a deployment exists).
- No database or auth infrastructure exists for content; a future DB-backed feature (e.g. comments) is a separate decision.
