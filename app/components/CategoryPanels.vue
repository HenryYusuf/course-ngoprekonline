<script setup lang="ts">
import type { PostRef } from '~/utils/latestPerCategory'

import { computed } from '#imports'
import { useCategories } from '~/composables/useCategories'
import { latestPerCategory } from '~/utils/latestPerCategory'

const props = defineProps<{
  posts: PostRef[]
}>()

const categories = await useCategories()

const groups = computed(() => latestPerCategory(props.posts, categories, 2))
</script>

<template>
  <section class="pb-12">
    <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
      <h2 class="text-xl font-extrabold tracking-[-0.01em] sm:text-2xl">
        Rak Arsip
      </h2>
      <span class="label-caps text-muted-foreground">Per kategori</span>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div
        v-for="group in groups"
        :key="group.category.slug"
        class="flex flex-col border border-foreground/20 bg-card"
      >
        <div class="flex items-center justify-between gap-3 border-b border-border bg-surface-low px-5 py-3">
          <h3 class="min-w-0 truncate label-caps text-foreground">
            Rak · {{ group.category.label }}
          </h3>
          <span class="h-2 w-2 shrink-0 bg-primary" aria-hidden="true" />
        </div>

        <ul class="flex-1 divide-y divide-border">
          <li v-for="post in group.posts" :key="post.path">
            <NuxtLink
              :to="post.path"
              class="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-accent"
            >
              <span class="min-w-0 truncate font-bold leading-snug transition-colors group-hover:text-primary-deep">
                {{ post.title }}
              </span>
              <svg
                viewBox="0 0 16 16"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
                class="shrink-0 text-primary-deep transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M3 8h10m0 0-4-4m4 4-4 4" />
              </svg>
            </NuxtLink>
          </li>
        </ul>

        <div class="border-t border-border px-5 py-3">
          <NuxtLink
            :to="`/blog/category/${group.category.slug}`"
            class="label-caps text-primary-deep transition-colors hover:text-foreground"
          >
            Lihat semua
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
