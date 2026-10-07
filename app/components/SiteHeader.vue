<script setup lang="ts">
import { useCategories } from '~/composables/useCategories'

const ROUTES = [
  { to: '/blog', label: 'Blog' },
  { to: '/rss.xml', label: 'RSS' },
] as const

const categories = await useCategories()
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
    <div class="grid grid-cols-[minmax(0,1fr)_auto] mx-auto max-w-6xl items-center gap-2 px-4 py-4 sm:px-6">
      <NuxtLink to="/" class="group min-w-0 flex items-center gap-2">
        <span class="label-caps text-primary transition-transform duration-300 group-hover:-translate-x-0.5">&gt;_</span>
        <span class="truncate text-lg text-foreground font-bold tracking-tight font-display">Ngoprek<span class="text-primary">.</span>Online</span>
      </NuxtLink>
      <nav class="flex shrink-0 items-center gap-2 sm:gap-4" aria-label="Navigasi utama">
        <a
          v-for="routeItem in ROUTES"
          :key="routeItem.to"
          :href="routeItem.to"
          class="hidden label-caps text-muted-foreground transition-colors sm:inline hover:text-foreground"
        >
          {{ routeItem.label }}
        </a>
        <NuxtLink
          v-for="category in categories"
          :key="category.slug"
          :to="`/blog/category/${category.slug}`"
          class="hidden label-caps text-muted-foreground transition-colors sm:inline hover:text-foreground"
        >
          {{ category.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
