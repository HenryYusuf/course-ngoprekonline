<script setup lang="ts">
import { useHead, useRuntimeConfig, useSeoMeta } from '#imports'

import { findCategory } from '#shared/utils/categories'

import PostCard from '~/components/PostCard.vue'
import { useCategories } from '~/composables/useCategories'
import { usePublishedPosts } from '~/composables/usePublishedPosts'

const { public: { siteName, siteUrl, siteDescription } } = useRuntimeConfig()

const posts = (await usePublishedPosts()).slice(0, 3)
const categories = await useCategories()

useSeoMeta({
  title: siteName,
  description: siteDescription,
  ogTitle: siteName,
  ogDescription: siteDescription,
  ogLocale: 'id_ID',
})
useHead({
  link: [{ rel: 'canonical', href: siteUrl }],
})
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 py-12">
    <section>
      <h1 class="text-4xl font-bold">
        {{ siteName }}
      </h1>
      <p class="mt-3 text-lg text-gray-600">
        {{ siteDescription }}
      </p>
      <NuxtLink
        to="/blog"
        class="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
      >
        Lihat semua artikel
      </NuxtLink>
    </section>
    <section class="mt-10">
      <h2 class="text-2xl font-semibold">
        Artikel terbaru
      </h2>
      <div class="mt-4 flex flex-col gap-4">
        <PostCard
          v-for="post in posts"
          :key="post.path"
          :post="post"
          :category="findCategory(categories, post.category ?? '')"
        />
      </div>
    </section>
  </main>
</template>
