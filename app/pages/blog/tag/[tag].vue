<script setup lang="ts">
import { createError, definePageMeta, useHead, useRoute, useRuntimeConfig, useSeoMeta } from '#imports'

import PostCard from '~/components/PostCard.vue'
import { usePublishedPosts } from '~/composables/usePublishedPosts'

definePageMeta({
  key: route => route.fullPath,
})

const route = useRoute()
const { public: { siteUrl, siteName } } = useRuntimeConfig()

const tag = String(route.params.tag)
const posts = (await usePublishedPosts()).filter(post => post.tags?.includes(tag))

if (posts.length === 0) {
  // Published posts are the source of truth for tags: junk URLs get a 404,
  // not an empty archive a search engine could index (same as categories).
  throw createError({ statusCode: 404, statusMessage: 'Tag tidak ditemukan', fatal: true })
}

useSeoMeta({
  title: `Tag: ${tag}`,
  description: `Artikel ${siteName} dengan tag ${tag}.`,
  ogTitle: `Tag: ${tag}`,
  ogDescription: `Artikel ${siteName} dengan tag ${tag}.`,
  ogLocale: 'id_ID',
})
useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/blog/tag/${tag}` }],
})
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
    <header class="mb-8 border-b border-border pb-7">
      <h1 class="text-3xl font-extrabold tracking-[-0.02em] sm:text-4xl">
        Tag #{{ tag }}
      </h1>
      <p class="mt-3 label-caps text-muted-foreground">
        {{ posts.length }} paket dengan tag ini
      </p>
    </header>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:grid-cols-2">
      <PostCard v-for="post in posts" :key="post.path" :post="post" />
    </div>
  </main>
</template>
