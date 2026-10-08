<script setup lang="ts">
import { useCategories } from '~/composables/useCategories'

const categories = await useCategories()
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-foreground/15 bg-background/95 backdrop-blur-sm">
    <div class="mx-auto max-w-6xl flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
      <NuxtLink to="/" class="group min-w-0 flex items-center gap-2.5">
        <span
          class="h-3.5 w-3.5 shrink-0 border border-foreground bg-primary transition-transform duration-300 group-hover:rotate-45"
          aria-hidden="true"
        />
        <span class="truncate text-[17px] font-extrabold tracking-[-0.02em]">Ngoprek.Online</span>
      </NuxtLink>

      <nav class="flex shrink-0 items-center gap-3 sm:gap-5" aria-label="Navigasi utama">
        <NuxtLink
          to="/blog"
          class="label-caps text-muted-foreground transition-colors hover:text-foreground"
        >
          Blog
        </NuxtLink>
        <!-- /rss.xml is a Nitro server route invisible to vue-router: a plain
             anchor avoids a VUE_ROUTER_R0004 warning on every navigation. -->
        <a
          href="/rss.xml"
          class="hidden label-caps text-muted-foreground transition-colors sm:inline hover:text-foreground"
        >
          RSS
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
