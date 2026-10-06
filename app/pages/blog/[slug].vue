<script setup lang="ts">
import { createError, useHead, useRoute, useRuntimeConfig, useSeoMeta } from '#imports'

import { usePublishedPost } from '~/composables/usePublishedPosts'
import { formatDate } from '~/utils/formatDate'

const route = useRoute()
const { public: { siteUrl } } = useRuntimeConfig()

const post = await usePublishedPost(route.path)

if (!post) {
  throw createError({ statusCode: 404, statusMessage: 'Post tidak ditemukan', fatal: true })
}

const publishedTime = new Date(post.publishedAt).toISOString()

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
      <time :datetime="publishedTime" class="text-gray-500">{{ formatDate(post.publishedAt) }}</time>
      <img v-if="post.image" :src="post.image" :alt="post.title">
      <ContentRenderer :value="post" />
    </article>
  </main>
</template>
