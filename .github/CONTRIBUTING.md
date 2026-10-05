# Contributing

## Branch model

`main` is the only long-lived branch. It is protected: direct pushes are blocked, history must be linear, and force pushes and deletions are not allowed.

Work on short-lived branches named after the change:

| Prefix | Use for |
| --- | --- |
| `feat/` | New feature |
| `fix/` | Bug fix |
| `perf/` | Performance improvement |
| `refactor/` | Code change that neither fixes a bug nor adds a feature |
| `docs/` | Documentation only |
| `chore/` | Tooling, dependencies, config |
| `ci/` | CI and build pipeline |

Example: `feat/enroll-button`.

## Commit convention

Commits are linted by [commitlint](https://commitlint.js.org) with `@commitlint/config-conventional` via a `commit-msg` hook. The format is:

```
type(scope): subject

body

footer
```

`type` is one of `feat`, `fix`, `perf`, `refactor`, `docs`, `chore`, `ci`, `style`, `test`, `build`, `revert`. `scope` is optional. The subject is lowercase, imperative, and ends without a period.

```
feat(enrollment): add enroll button
fix: correct redirect after login
docs: update contributing guide
```

A commit whose footer contains `BREAKING CHANGE:` or whose type is suffixed with `!` marks a breaking change.

## Pull requests

Open a PR against `main`. `main` requires the `unit-test` check to pass before merging; keep PRs small and focused.

Every commit on a PR triggers the `ci` gate locally on `pre-commit`, and CI runs it again on the server:

```bash
pnpm run ci   # lint && typecheck && knip && test --run
```

If `autofix.ci` can apply a fix, it commits it to your PR branch automatically.

## Before you commit

```bash
pnpm run lint --fix
pnpm run ci
```

Do not commit with a failing `ci`. Fix the root cause rather than silencing rules or adding ignores.
