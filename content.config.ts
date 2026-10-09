import { defineCollection, defineContentConfig, z } from '@nuxt/content'

import { isExternalFile } from './shared/utils/resources'

export default defineContentConfig({
  collections: {
    categories: defineCollection({
      type: 'data',
      source: 'categories/*.yml',
      schema: z.object({
        slug: z.string(),
        label: z.string(),
        description: z.string(),
      }),
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        publishedAt: z.date(),
        image: z.string().optional(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false),
        // Required, no default: a post without a curated Category must fail
        // loudly instead of shipping un-categorized (ADR 0003).
        category: z.string(),
        // The download half of "Edutorial Blog Download": files shipped with
        // the article. Origin is inferred from the link's shape: an absolute
        // http(s) URL is external, anything else is a local /downloads file
        // (ADR 0004).
        resources: z.array(z.object({
          title: z.string(),
          file: z.string().refine(
            value => isExternalFile(value) || /^\/downloads\//.test(value),
            { message: 'resource file must be a /downloads/ path or an absolute http(s) URL (ADR 0004)' },
          ),
          // Required for local files, whose declared size must match the real
          // file so spec plates never lie. Optional for external resources,
          // where the PPD host's size is not ours to know. Zod cannot see the
          // disk, so the invariant test re-checks local bytes against the file.
          bytes: z.number().int().positive().optional(),
        })).default([]),
      }),
    }),
  },
})
