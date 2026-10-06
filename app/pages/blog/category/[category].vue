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
  <main class="mx-auto max-w-3xl px-4 py-8">
    <h1 class="text-3xl font-bold">
      Kategori: {{ category.label }}
    </h1>
    <p class="mt-2 text-gray-600">
      {{ category.description }}
    </p>
    <div class="mt-6 flex flex-col gap-4">
      <PostCard v-for="post in posts" :key="post.path" :post="post" />
      <p v-if="posts.length === 0" class="text-gray-500">
        Belum ada artikel dengan kategori ini.
      </p>
    </div>
  </main>
</template>
