# syntax=docker/dockerfile:1
ARG NODE_VERSION=22

# ---------- Build stage ----------
# Node official slim image; Node 22 LTS matches the Nitro/nuxt 4 support window.
# Native deps (better-sqlite3, sharp) install from prebuilt binaries. If a VPS
# registry blocks the binary download and compile is needed, temporarily switch
# the builder base to node:${NODE_VERSION}-bookworm (non-slim ships build tools).
FROM node:${NODE_VERSION}-bookworm-slim AS builder

# pnpm is pinned by the `packageManager` field in package.json
RUN corepack enable

WORKDIR /app
ENV NUXT_TELEMETRY_DISABLED=1

# Dependency layer (cached until the lockfile changes)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# --ignore-scripts skips the repo's git-hooks `prepare` script (no git repo in
# the image); the native modules that need build scripts are rebuilt below.
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts \
 && pnpm rebuild better-sqlite3 sharp esbuild

# Source layer (cached until app code or content changes)
COPY . .

# Site URL is baked into prerendered pages and the sitemap at build time.
ARG NUXT_PUBLIC_SITE_URL=https://ngoprekonline.example
ENV NUXT_PUBLIC_SITE_URL=$NUXT_PUBLIC_SITE_URL

RUN pnpm build

# ---------- Runtime stage ----------
FROM node:${NODE_VERSION}-bookworm-slim AS runner

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

WORKDIR /app
COPY --from=builder --chown=node:node /app/.output ./

# Runtime site URL (used by SSR canonical/OG/RSS at request time)
ARG NUXT_PUBLIC_SITE_URL=https://ngoprekonline.example
ENV NUXT_PUBLIC_SITE_URL=$NUXT_PUBLIC_SITE_URL

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", ".output/server/index.mjs"]
