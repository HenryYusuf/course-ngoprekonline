<script setup lang="ts">
import { computed, ref } from '#imports'

import { findCategory } from '#shared/utils/categories'

import PostCard from '~/components/PostCard.vue'
import { useCategories } from '~/composables/useCategories'

const props = defineProps<{
  posts: Array<{
    path: string
    title: string
    description: string
    publishedAt: Date | string
    image?: string
    category?: string
  }>
}>()

const categories = await useCategories()

const latest = computed(() => props.posts.slice(0, 10))

const strip = ref<HTMLElement | null>(null)

function scrollStrip(direction: 1 | -1) {
  const el = strip.value
  if (!el)
    return
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  el.scrollBy({
    left: direction * el.clientWidth,
    behavior: reduced ? 'auto' : 'smooth',
  })
}
</script>

<template>
  <section class="pb-12">
    <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
      <h2 class="text-xl font-extrabold tracking-[-0.01em] sm:text-2xl">
        Keluaran Terbaru
      </h2>
      <div class="flex items-center gap-3">
        <span class="label-caps text-muted-foreground">{{ latest.length }} paket</span>
        <div class="flex gap-2">
          <button
            type="button"
            aria-label="Sebelumnya"
            class="border border-foreground/25 px-2.5 py-1.5 transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
            @click="scrollStrip(-1)"
          >
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path d="M10 3 5 8l5 5" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Berikutnya"
            class="border border-foreground/25 px-2.5 py-1.5 transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
            @click="scrollStrip(1)"
          >
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path d="m6 3 5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div
      ref="strip"
      role="region"
      aria-label="Keluaran Terbaru"
      tabindex="0"
      class="no-scrollbar flex snap-x gap-4 overflow-x-auto px-4 -mx-4 sm:px-6 sm:-mx-6"
    >
      <div
        v-for="post in latest"
        :key="post.path"
        class="w-[85%] shrink-0 snap-start lg:w-[32%] md:w-[45%] sm:w-[60%]"
      >
        <PostCard
          :post="post"
          :category="findCategory(categories, post.category ?? '')"
        />
      </div>
    </div>
  </section>
</template>
