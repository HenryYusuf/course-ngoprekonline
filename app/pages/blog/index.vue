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
  <main class="mx-auto max-w-3xl px-4 py-8">
    <h1 class="text-3xl font-bold">
      Blog
    </h1>
    <nav aria-label="Kategori artikel" class="mt-4 flex flex-wrap gap-2">
      <NuxtLink
        v-for="category in categories"
        :key="category.slug"
        :to="`/blog/category/${category.slug}`"
        class="border border-gray-200 rounded-full px-3 py-1 text-sm text-gray-600 hover:border-blue-600 hover:text-blue-600"
      >
        {{ category.label }}
      </NuxtLink>
    </nav>
    <div class="mt-6 flex flex-col gap-4">
      <PostCard
        v-for="post in posts"
        :key="post.path"
        :post="post"
        :category="findCategory(categories, post.category ?? '')"
      />
      <p v-if="posts.length === 0" class="text-gray-500">
        Belum ada artikel.
      </p>
    </div>
  </main>
</template>
