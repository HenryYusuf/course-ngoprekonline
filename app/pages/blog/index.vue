<script setup lang="ts">
import { useHead, useRuntimeConfig, useSeoMeta } from '#imports'

import PostCard from '~/components/PostCard.vue'
import { usePublishedPosts } from '~/composables/usePublishedPosts'

const { public: { siteUrl, siteName } } = useRuntimeConfig()

const posts = await usePublishedPosts()

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
    <div class="mt-6 flex flex-col gap-4">
      <PostCard v-for="post in posts" :key="post.path" :post="post" />
      <p v-if="posts.length === 0" class="text-gray-500">
        Belum ada artikel.
      </p>
    </div>
  </main>
</template>
