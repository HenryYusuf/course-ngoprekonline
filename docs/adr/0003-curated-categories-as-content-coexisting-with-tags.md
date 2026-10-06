# Curated categories as content, coexisting with tags

Every Blog Post carries exactly one Category, chosen from a small curated list that lives in the repository as content (one YAML file per category, editable in Nuxt Studio alongside posts), coexisting with free-form Tags. Category is the stable primary grouping that powers navigation and per-category archive pages; Tags remain the free-form secondary topics. We chose a curated content-owned list over a code enum, which would make every editorial list change a code change and leaves nowhere for a per-category description, and over replacing tags entirely, which would break existing tag URLs and erase a taxonomy that already works. The category's URL identifier is permanent; its display name and description may be edited freely. Categories are flat and do not nest.

## Considered Options

- **Curated content-owned list coexisting with tags** (chosen)
- **Replace tags with categories**: breaks existing tag URLs and collapses two different jobs (primary grouping vs free-form topics) into one
- **Enum in `content.config.ts`**: built-in validation, but list changes require a code change and there is no home for per-category descriptions
- **Convention-only free-form categories**: no curation guarantee, so categories degenerate back into tags

## Consequences

- Every post must declare exactly one category; the existing posts are backfilled as part of the rollout.
- Renaming a category means editing its display name; changing its URL identifier means creating a new category and migrating posts, and the old URL 404s.
- Category archive pages return 404 for unknown slugs and render an empty state for known-but-empty ones; all categories always appear in blog navigation regardless of content.
- Hierarchy is deliberately out of scope; if a real need appears later, that is a new decision.
