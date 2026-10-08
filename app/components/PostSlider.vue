<script setup lang="ts">
import { computed } from '#imports'

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
</script>

<template>
  <section class="pb-12">
    <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
      <h2 class="text-xl font-extrabold tracking-[-0.01em] sm:text-2xl">
        Keluaran Terbaru
      </h2>
      <span class="label-caps text-muted-foreground">{{ latest.length }} paket</span>
    </div>
    <div class="no-scrollbar flex snap-x gap-4 overflow-x-auto px-4 -mx-4 sm:px-6 sm:-mx-6">
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
