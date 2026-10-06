# SSR with platform-neutral deployment

The app renders via server-side rendering rather than static generation, and stays platform-neutral so the same build runs both on serverless hosts and on a VPS via Docker. We deliberately avoid platform-specific features and pin no Nitro preset, because both targets must remain first-class; public blog pages are prerendered for speed, while a running server stays available for Nuxt Studio's in-production editing and future dynamic features.

## Considered Options

- **SSR, platform-neutral** (chosen)
- **Static generation** (`nuxt generate`): cheapest hosting, but rules out in-production Studio editing and future server-side features
- **Single-platform deployment** (e.g. Vercel-only): allows platform-specific optimizations but locks the deployment target

## Consequences

- Docker builds use the `node-server` Nitro preset; serverless hosts use their auto-detected preset.
- Public pages should stay prerenderable to keep the dual-target build fast.
