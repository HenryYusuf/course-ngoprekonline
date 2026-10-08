<script setup lang="ts">
import { computed } from '#imports'

import { formatBytes } from '~/utils/formatBytes'
import { formatDate } from '~/utils/formatDate'
import { readingMinutes } from '~/utils/readingMinutes'

const props = defineProps<{
  post: {
    path: string
    title: string
    description: string
    publishedAt: Date | string
    image?: string
    body?: unknown
    resources?: { title: string, file: string, bytes: number }[]
  }
  /**
   * Resolved Category of the post, provided by the page that owns the
   * curated list. Rendered as a chip, not a link: the whole card is one
   * anchor, so nested links are not allowed.
   */
  category?: { slug: string, label: string }
}>()

const isoDate = computed(() => new Date(props.post.publishedAt).toISOString())

const resources = computed(() => props.post.resources ?? [])

const totalBytes = computed(() =>
  resources.value.reduce((sum, resource) => sum + resource.bytes, 0),
)

/**
 * Deterministic initials plus a barcode drawn from the slug hash: every
 * package gets a stable printed identity without shipping an image.
 */
const fallbackInitials = computed(() => {
  const words = props.post.title.trim().split(/\s+/)
  if (words.length >= 2 && words[0] && words[1])
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
  return props.post.title.trim().slice(0, 2).toUpperCase()
})

const barcode = computed(() => {
  const slug = props.post.path
  let hash = 0
  for (const ch of slug) hash = (hash * 31 + (ch.codePointAt(0) ?? 0)) % 10000019

  const bars: Array<{ x: number, w: number }> = []
  let x = 0
  for (let i = 0; i < 26; i++) {
    const w = 1 + (hash % 3)
    bars.push({ x, w })
    x += w + 1.5
    hash = Math.floor(hash / 7) + i * 13 + 1
  }
  return { bars, width: x }
})
</script>

<template>
  <article class="group flex flex-col border border-foreground/20 bg-card transition-colors duration-200 hover:border-foreground">
    <NuxtLink :to="post.path" class="h-full flex flex-col">
      <div v-if="post.image" class="aspect-[16/10] overflow-hidden border-b border-border bg-muted">
        <img
          :src="post.image"
          :alt="post.title"
          loading="lazy"
          decoding="async"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        >
      </div>
      <div
        v-else
        class="relative aspect-[16/10] overflow-hidden border-b border-border bg-surface-low px-5 pb-4"
        aria-hidden="true"
      >
        <span class="absolute bottom-3 left-5 text-6xl text-foreground/15 font-extrabold leading-none tracking-[-0.04em]">
          {{ fallbackInitials }}
        </span>
        <svg
          class="absolute bottom-4 right-5 text-foreground/35"
          :width="Math.min(barcode.width, 96)"
          height="28"
          viewBox="0 0 96 28"
          preserveAspectRatio="xMaxYMax meet"
          aria-hidden="true"
        >
          <rect
            v-for="(bar, i) in barcode.bars"
            :key="i"
            :x="bar.x * (96 / barcode.width)"
            :y="0"
            :width="bar.w * (96 / barcode.width)"
            height="28"
            fill="currentColor"
          />
        </svg>
      </div>

      <div class="flex flex-1 flex-col p-5">
        <div class="flex flex-wrap items-center gap-2.5 label-caps text-muted-foreground">
          <time :datetime="isoDate">{{ formatDate(post.publishedAt) }}</time>
          <span
            v-if="category"
            class="border border-foreground/30 px-1.5 py-0.5 text-foreground"
          >
            {{ category.label }}
          </span>
        </div>

        <h3 class="line-clamp-2 mt-3 text-lg font-bold leading-tight tracking-[-0.01em] transition-colors sm:text-xl group-hover:text-primary-deep">
          {{ post.title }}
        </h3>
        <p class="line-clamp-3 mt-2 text-sm text-muted-foreground leading-relaxed">
          {{ post.description }}
        </p>
      </div>

      <div class="mt-auto flex items-center justify-between gap-4 border-t border-border px-5 py-3.5 label-caps">
        <span class="min-w-0 truncate text-muted-foreground">
          {{ readingMinutes(post.body) }} menit baca<template v-if="resources.length">
            · {{ resources.length }} file · {{ formatBytes(totalBytes) }}</template>
        </span>
        <span class="inline-flex shrink-0 items-center gap-1 text-primary-deep">
          BACA
          <svg
            viewBox="0 0 16 16"
            width="13"
            height="13"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
            class="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M3 8h10m0 0-4-4m4 4-4 4" />
          </svg>
        </span>
      </div>
    </NuxtLink>
  </article>
</template>
