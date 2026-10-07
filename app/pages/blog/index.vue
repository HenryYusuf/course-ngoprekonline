<script setup lang="ts">
import { useHead, useRuntimeConfig, useSeoMeta } from '#imports'

import { findCategory } from '#shared/utils/categories'

import PostCard from '~/components/PostCard.vue'
import { useCategories } from '~/composables/useCategories'
import { usePublishedPosts } from '~/composables/usePublishedPosts'

const { public: { siteUrl, siteName } } = useRuntimeConfig()

const posts = await usePublishedPosts()
const categories = await useCategories()

useSeoMeta({
  title: 'Blog',
  description: `Kumpulan artikel terbaru dari ${siteName}.`,
  ogTitle: 'Blog',
  ogDescription: `Kumpulan artikel terbaru dari ${siteName}.`,
  ogLocale: 'id_ID',
})
useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/blog` }],
})
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
    <h1 class="mb-5 min-w-0 truncate label-caps text-foreground">
      <span class="text-primary">$</span>
      BLOG --semua
    </h1>
    <nav aria-label="Kategori artikel" class="mb-8 flex flex-wrap gap-2">
      <NuxtLink
        v-for="category in categories"
        :key="category.slug"
        :to="`/blog/category/${category.slug}`"
        class="border border-border bg-card px-2.5 py-1.5 label-caps text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        {{ category.label }}
      </NuxtLink>
    </nav>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:grid-cols-2">
      <PostCard
        v-for="post in posts"
        :key="post.path"
        :post="post"
        :category="findCategory(categories, post.category ?? '')"
      />
    </div>
    <p v-if="posts.length === 0" class="label-caps text-muted-foreground">
      $ BELUM ADA POST
    </p>
  </main>
</template>
