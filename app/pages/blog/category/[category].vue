<script setup lang="ts">
import { createError, definePageMeta, useHead, useRoute, useRuntimeConfig, useSeoMeta } from '#imports'

import { findCategory } from '#shared/utils/categories'

import PostCard from '~/components/PostCard.vue'
import { useCategories } from '~/composables/useCategories'
import { usePublishedPosts } from '~/composables/usePublishedPosts'

definePageMeta({
  key: route => route.fullPath,
})

const route = useRoute()
const { public: { siteUrl } } = useRuntimeConfig()

const slug = String(route.params.category)
const category = findCategory(await useCategories(), slug)

if (!category) {
  // The curated list is the source of truth: unknown slugs are junk URLs.
  throw createError({ statusCode: 404, statusMessage: 'Kategori tidak ditemukan', fatal: true })
}

const posts = (await usePublishedPosts()).filter(post => post.category === slug)

useSeoMeta({
  title: `Kategori: ${category.label}`,
  description: category.description,
  ogTitle: `Kategori: ${category.label}`,
  ogDescription: category.description,
  ogLocale: 'id_ID',
})
useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/blog/category/${slug}` }],
})
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
    <h1 class="mb-1 min-w-0 truncate label-caps text-foreground">
      <span class="text-primary">$</span>
      KATEGORI: {{ category.label }}
    </h1>
    <p class="mb-8 text-sm text-muted-foreground">
      {{ category.description }}
    </p>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:grid-cols-2">
      <PostCard
        v-for="post in posts"
        :key="post.path"
        :post="post"
        :category="category"
      />
    </div>
    <p v-if="posts.length === 0" class="label-caps text-muted-foreground">
      $ BELUM ADA POST
    </p>
  </main>
</template>
