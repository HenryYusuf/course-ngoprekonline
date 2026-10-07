<script setup lang="ts">
import { computed } from '#imports'

import { formatDate } from '~/utils/formatDate'

const props = defineProps<{
  post: {
    path: string
    title: string
    description: string
    publishedAt: Date | string
    image?: string
  }
  /**
   * Resolved Category of the post, provided by the page that owns the
   * curated list. Rendered as a chip, not a link: the whole card is one
   * anchor, so nested links are not allowed (ddpanda does the same).
   */
  category?: { slug: string, label: string }
}>()

const isoDate = computed(() => new Date(props.post.publishedAt).toISOString())

const GLYPHS = ['</>', '{ }', '[ ]', '$_', '#_', '~>'] as const

/**
 * The undefined.jpg-style CSS-only cover: deterministic initials plus a
 * glyph picked from the slug hash, so every card gets a stable identity
 * without shipping an image or firing a 404.
 */
const fallbackInitials = computed(() => {
  const words = props.post.title.trim().split(/\s+/)
  if (words.length >= 2 && words[0] && words[1])
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
  return props.post.title.trim().slice(0, 2).toUpperCase()
})

const fallbackGlyph = computed(() => {
  const slug = props.post.path.split('/').pop() ?? props.post.title
  let hash = 0
  for (const ch of slug) hash = (hash * 31 + (ch.codePointAt(0) ?? 0)) % 997
  return GLYPHS[hash % GLYPHS.length]
})
</script>

<template>
  <article class="group border border-border bg-card transition-colors duration-300 hover:border-primary">
    <NuxtLink :to="post.path" class="h-full flex flex-col">
      <div v-if="post.image" class="aspect-[16/10] overflow-hidden border-b border-border bg-muted">
        <img
          :src="post.image"
          :alt="post.title"
          loading="lazy"
          decoding="async"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        >
      </div>
      <div
        v-else
        class="aspect-[16/10] flex items-center justify-center gap-3 border-b border-border bg-surface-low"
        aria-hidden="true"
      >
        <span class="label-caps text-primary">{{ fallbackGlyph }}</span>
        <span class="text-2xl text-muted-foreground font-extrabold tracking-tight font-display">{{ fallbackInitials }}</span>
      </div>
      <div class="flex flex-1 flex-col justify-between gap-4 p-5">
        <div>
          <div class="mb-3 flex flex-wrap items-center gap-2 label-caps text-muted-foreground">
            <span class="text-primary">$</span>
            <time :datetime="isoDate">{{ formatDate(post.publishedAt) }}</time>
            <span
              v-if="category"
              class="border border-border bg-surface-low px-1.5 py-0.5 text-foreground"
            >
              {{ category.label }}
            </span>
          </div>
          <h3 class="line-clamp-2 text-lg text-foreground font-extrabold leading-tight font-display transition-colors sm:text-xl group-hover:text-primary">
            {{ post.title }}
          </h3>
          <p class="line-clamp-3 mt-2 text-sm text-muted-foreground leading-relaxed">
            {{ post.description }}
          </p>
        </div>
        <span class="inline-flex items-center gap-1 label-caps text-primary">
          BACA
          <span aria-hidden="true" class="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </NuxtLink>
  </article>
</template>
