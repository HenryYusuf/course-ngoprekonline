<script setup lang="ts">
import { definePageMeta, useHead, useRoute, useRuntimeConfig, useSeoMeta } from '#imports'

import PostCard from '~/components/PostCard.vue'
import { usePublishedPosts } from '~/composables/usePublishedPosts'

definePageMeta({
  key: route => route.fullPath,
})

const route = useRoute()
const { public: { siteUrl, siteName } } = useRuntimeConfig()

const tag = String(route.params.tag)
const posts = (await usePublishedPosts()).filter(post => post.tags?.includes(tag))

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
  <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
    <h1 class="mb-5 min-w-0 truncate label-caps text-foreground">
      <span class="text-primary">$</span>
      TAG: {{ tag }}
    </h1>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:grid-cols-2">
      <PostCard v-for="post in posts" :key="post.path" :post="post" />
    </div>
    <p v-if="posts.length === 0" class="label-caps text-muted-foreground">
      $ BELUM ADA POST
    </p>
  </main>
</template>
