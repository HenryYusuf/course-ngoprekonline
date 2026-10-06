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
  <main class="mx-auto max-w-3xl px-4 py-8">
    <h1 class="text-3xl font-bold">
      Tag: {{ tag }}
    </h1>
    <div class="mt-6 flex flex-col gap-4">
      <PostCard v-for="post in posts" :key="post.path" :post="post" />
      <p v-if="posts.length === 0" class="text-gray-500">
        Belum ada artikel dengan tag ini.
      </p>
    </div>
  </main>
</template>
