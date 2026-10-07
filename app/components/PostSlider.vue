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
  <section class="pb-10 sm:pb-14">
    <h2 class="mb-5 min-w-0 truncate label-caps text-foreground">
      <span class="text-primary">$</span>
      TERBARU --stream -n 10
    </h2>
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
