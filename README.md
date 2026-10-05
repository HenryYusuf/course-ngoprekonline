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
