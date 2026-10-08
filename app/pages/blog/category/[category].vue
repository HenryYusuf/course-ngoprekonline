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
  <main class="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
    <header class="mb-8 border-b border-border pb-7">
      <h1 class="text-3xl font-extrabold tracking-[-0.02em] sm:text-4xl">
        {{ category.label }}
      </h1>
      <p class="mt-3 label-caps text-muted-foreground">
        {{ posts.length }} paket di rak ini
      </p>
      <p class="mt-4 max-w-[64ch] text-base text-muted-foreground leading-relaxed">
        {{ category.description }}
      </p>
    </header>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:grid-cols-2">
      <PostCard
        v-for="post in posts"
        :key="post.path"
        :post="post"
        :category="category"
      />
    </div>

    <p v-if="posts.length === 0" class="label-caps text-muted-foreground">
      Belum ada paket di rak ini
    </p>
  </main>
</template>
