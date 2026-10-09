# course-ngoprekonline

Nuxt 4 app. Built with the [antfu](https://github.com/antfu) conventions: pnpm catalogs, `@antfu/eslint-config`, Vitest, Knip.

## Setup

```bash
pnpm i
```

## Development

```bash
pnpm dev
```

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start dev server on http://localhost:3000 |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Lint (with cache) |
| `pnpm lint:fix` | Lint and autofix |
| `pnpm typecheck` | Typecheck via `vue-tsc` |
| `pnpm knip` | Find unused files, exports, dependencies |
| `pnpm test` | Run Vitest in watch mode |
| `pnpm ci` | Full gate: lint + typecheck + knip + test |

Run `pnpm run lint --fix` before every commit, then `pnpm run ci`. Do not commit with a failing `ci`.

## Content Management & Blog

Blog content lives as Markdown files in `content/blog/` ([Nuxt Content v3](https://content.nuxt.com)), edited directly or through the self-hosted [Nuxt Studio](https://nuxt.studio) editor. See `docs/adr/0001-nuxt-content-and-nuxt-studio-for-content-management.md` and `docs/adr/0002-ssr-with-platform-neutral-deployment.md` for the decisions behind this.

### Authoring a post

Create `content/blog/<slug>.md` (frontmatter example):

```md
---
title: Judul Post
description: Ringkasan singkat untuk daftar blog dan SEO.
category: tutorial
publishedAt: 2026-10-05
image: /images/blog/<slug>/cover.png
tags:
  - nuxt
  - konten
draft: false
---
```

`image` is optional; put files under `public/images/blog/`. `category` is required: pick the slug of a curated category (see below). The body is Markdown supporting code blocks and video embeds via MDC components:

```md
::youtube{id="VIDEO_ID"}
::vimeo{id="VIDEO_ID"}
```

### Categories

Every post carries exactly one **Category**, a curated primary grouping distinct from free-form tags (see `docs/adr/0003-curated-categories-as-content-coexisting-with-tags.md`). The list lives as content: one YAML file per category under `content/categories/`, holding the `slug` (which must match the file name), a `label`, and an Indonesian `description`. Posts reference the category by slug; a post whose slug is not in the list fails the build and the content invariant test.

### Publish gate

A post is visible on the public site only when it is **not** a draft and its `publishedAt` date has passed. The gate lives in one place (`shared/utils/publishing.ts`) and applies to every surface:

- Lists (`/`, `/blog`, `/blog/tag/[tag]`, `/blog/category/[category]`): draft and future-dated posts never appear.
- Post pages (`/blog/[slug]`): draft posts render with a `Draf` badge in dev only; production returns 404.

### Editing in Nuxt Studio

- **Dev:** run `pnpm dev`, open the app, click the floating Studio button (bottom left). Changes sync to your local files in real time; commit them with your normal git workflow.
- **Production:** Studio publishes changes straight to git. It requires:
  1. An SSR deployment (`nuxt build`),
  2. A GitHub OAuth app, configured via `STUDIO_GITHUB_CLIENT_ID` and `STUDIO_GITHUB_CLIENT_SECRET` (run [`scripts/setup-studio.sh`](scripts/setup-studio.sh) to create the app and write both variables to `.env`),
  3. On Vercel/Netlify/GitHub Actions the repository details are auto-detected; elsewhere set them under the `studio.repository` option in `nuxt.config.ts`.

  Studio is reachable at `/_studio` (default route).

### Environment & deployment

| Variable | Purpose | Default |
| --- | --- | --- |
| `NUXT_PUBLIC_SITE_URL` | Absolute base URL for canonical tags, sitemap, and RSS | `https://ngoprekonline.example` |
| `STUDIO_GITHUB_CLIENT_ID` | Studio OAuth app id (production only) | none |
| `STUDIO_GITHUB_CLIENT_SECRET` | Studio OAuth app secret (production only) | none |

- **Serverless** (Vercel, Netlify): deploy directly; the Nitro preset is auto-detected.
- **VPS via Docker**: a `Dockerfile` and `docker-compose.yml` are included.

  ```bash
  # on the VPS, from the repo root
  echo 'NUXT_PUBLIC_SITE_URL=https://your-domain.example' > .env
  docker compose up -d --build
  ```

  The container runs the Nitro `node-server` build on port 3000, bound to
  `127.0.0.1` on the host so TLS terminates at a reverse proxy. Minimal Caddy
  example (`Caddyfile`):

  ```
  your-domain.example {
      reverse_proxy 127.0.0.1:3000
  }
  ```

  With nginx, proxy `server_name your-domain.example;` to `http://127.0.0.1:3000`.
  Content changes published through Studio land in git; pull and
  `docker compose up -d --build` again to update the site (automate with cron or CI if desired).

Public blog pages are prerendered at build time; the running server stays available for Studio auth and future dynamic features.

### Content surfaces

| Route | Purpose |
| --- | --- |
| `/` | Homepage: featured hero, category panels, a 10-post latest slider, and the full archive paginated at 24 per page (`?page=N`) |
| `/blog` | All published posts, paginated at 24 per page (`?page=N`) |
| `/blog/[slug]` | Post detail with prose, images, code, and video embeds |
| `/blog/tag/[tag]` | Tag archive |
| `/blog/category/[category]` | Category archive (404 for unknown slugs) |
| `/cari` | Full-text search over published posts (FTS5, keyboard-driven) |
| `/rss.xml` | RSS feed of the 20 most recent published posts |
| `/sitemap.xml` | Sitemap (via `@nuxtjs/sitemap`) |
| `/robots.txt` | Robots file pointing at the sitemap (Nitro route) |
