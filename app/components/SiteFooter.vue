<script setup lang="ts">
import { computed } from '#imports'

import { useCategories } from '~/composables/useCategories'

const year = computed(() => new Date().getFullYear())

const ROUTES = [
  { to: '/blog', label: 'Blog' },
  { to: '/rss.xml', label: 'RSS' },
] as const

const categories = await useCategories()
</script>

<template>
  <footer class="mt-16 border-t border-border bg-surface-low">
    <div class="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-2 px-6 py-6">
      <span class="label-caps text-muted-foreground">&copy; {{ year }} NGOPREK.ONLINE // ALL RIGHTS RESERVED</span>
      <nav class="flex flex-wrap items-center gap-4 label-caps text-muted-foreground" aria-label="Navigasi footer">
        <a
          v-for="routeItem in ROUTES"
          :key="routeItem.to"
          :href="routeItem.to"
          class="hover:text-foreground"
        >
          {{ routeItem.label }}
        </a>
        <NuxtLink
          v-for="category in categories"
          :key="category.slug"
          :to="`/blog/category/${category.slug}`"
          class="hover:text-foreground"
        >
          {{ category.label }}
        </NuxtLink>
      </nav>
    </div>
  </footer>
</template>
