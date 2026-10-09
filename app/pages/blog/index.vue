<script setup lang="ts">
import { computed, useHead, useRoute, useRuntimeConfig, useSeoMeta } from '#imports'

import { findCategory } from '#shared/utils/categories'

import PaginationNav from '~/components/PaginationNav.vue'
import PostCard from '~/components/PostCard.vue'
import { useCategories } from '~/composables/useCategories'
import { usePublishedPosts } from '~/composables/usePublishedPosts'
import { ARCHIVE_PER_PAGE, paginate } from '~/utils/pagination'

const { public: { siteUrl, siteName } } = useRuntimeConfig()

const route = useRoute()

const posts = await usePublishedPosts()
const categories = await useCategories()

const archive = computed(() =>
  paginate(posts, Number(route.query.page), ARCHIVE_PER_PAGE),
)

const canonicalHref = computed(() =>
  archive.value.page === 1
    ? `${siteUrl}/blog`
    : `${siteUrl}/blog?page=${archive.value.page}`,
)

useSeoMeta({
  title: 'Blog',
  description: `Kumpulan artikel terbaru dari ${siteName}.`,
  ogTitle: 'Blog',
  ogDescription: `Kumpulan artikel terbaru dari ${siteName}.`,
  ogLocale: 'id_ID',
})
useHead({
  link: [{ rel: 'canonical', href: canonicalHref }],
})
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
    <header class="mb-8 border-b border-border pb-7">
      <h1 class="text-3xl font-extrabold tracking-[-0.02em] sm:text-4xl">
        Semua Paket
      </h1>
      <p class="mt-3 label-caps text-muted-foreground">
        {{ archive.total }} paket terbit · halaman {{ archive.page }} dari {{ archive.totalPages }} · urut terbaru dulu
      </p>
    </header>

    <nav aria-label="Kategori artikel" class="mb-8 flex flex-wrap gap-2">
      <NuxtLink
        v-for="category in categories"
        :key="category.slug"
        :to="`/blog/category/${category.slug}`"
        class="stamp transition-colors hover:bg-foreground hover:text-background"
      >
        {{ category.label }}
      </NuxtLink>
    </nav>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:grid-cols-2">
      <PostCard
        v-for="post in archive.items"
        :key="post.path"
        :post="post"
        :category="findCategory(categories, post.category ?? '')"
      />
    </div>

    <p v-if="archive.total === 0" class="label-caps text-muted-foreground">
      Belum ada paket terbit
    </p>

    <PaginationNav
      :page="archive.page"
      :total-pages="archive.totalPages"
      base-path="/blog"
    />
  </main>
</template>
