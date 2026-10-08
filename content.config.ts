import { defineCollection, defineContentConfig, z } from '@nuxt/content'

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
        // the article. `bytes` must match the real file so spec plates never
        // lie about package size.
        resources: z.array(z.object({
          title: z.string(),
          file: z.string(),
          bytes: z.number().int().positive(),
        })).default([]),
      }),
    }),
  },
})
