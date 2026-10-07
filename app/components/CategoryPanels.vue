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
  <section class="pb-10 sm:pb-14">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div
        v-for="group in groups"
        :key="group.category.slug"
        class="border border-border bg-card"
      >
        <h3 class="min-w-0 truncate border-b border-border bg-surface-low px-5 py-3 label-caps text-foreground">
          <span class="text-primary">$</span>
          {{ group.category.slug }} --latest
        </h3>
        <ul class="divide-y divide-border">
          <li v-for="post in group.posts" :key="post.path">
            <NuxtLink :to="post.path" class="group block px-5 py-4 transition-colors hover:bg-accent">
              <div class="flex items-center justify-between gap-4">
                <h4 class="min-w-0 truncate text-base text-foreground font-bold leading-snug font-display transition-colors group-hover:text-primary">
                  {{ post.title }}
                </h4>
                <span class="shrink-0 label-caps text-primary transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </NuxtLink>
          </li>
        </ul>
        <div class="px-5 py-3">
          <NuxtLink
            :to="`/blog/category/${group.category.slug}`"
            class="inline-flex items-center gap-1 label-caps text-primary hover:text-foreground"
          >
            LIHAT SEMUA
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
