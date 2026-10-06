<script setup lang="ts">
import { createError, useHead, useRoute, useRuntimeConfig, useSeoMeta } from '#imports'

import { findCategory } from '#shared/utils/categories'

import { useCategories } from '~/composables/useCategories'
import { usePublishedPost } from '~/composables/usePublishedPosts'
import { formatDate } from '~/utils/formatDate'

const route = useRoute()
const { public: { siteUrl } } = useRuntimeConfig()

const post = await usePublishedPost(route.path)

if (!post) {
  throw createError({ statusCode: 404, statusMessage: 'Post tidak ditemukan', fatal: true })
}

const publishedTime = new Date(post.publishedAt).toISOString()
const category = findCategory(await useCategories(), post.category)

useSeoMeta({
  title: post.title,
  description: post.description,
  ogTitle: post.title,
  ogDescription: post.description,
  ogType: 'article',
  ogLocale: 'id_ID',
  ogImage: post.image ? `${siteUrl}${post.image}` : undefined,
  articlePublishedTime: publishedTime,
})
useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}${route.path}` }],
})
</script>

<template>
  <main v-if="post" class="mx-auto max-w-3xl px-4 py-8">
    <article class="prose">
      <span
        v-if="post.draft"
        class="inline-block rounded bg-yellow-100 px-2 py-0.5 text-sm text-yellow-800 font-medium"
      >Draf</span>
      <h1>{{ post.title }}</h1>
      <div class="mt-1 flex items-center gap-3 text-gray-500">
        <NuxtLink
          v-if="category"
          :to="`/blog/category/${post.category}`"
          class="text-gray-700 font-medium hover:text-blue-600"
        >
          {{ category.label }}
        </NuxtLink>
        <time :datetime="publishedTime">{{ formatDate(post.publishedAt) }}</time>
      </div>
      <img v-if="post.image" :src="post.image" :alt="post.title">
      <ContentRenderer :value="post" />
    </article>
  </main>
</template>
