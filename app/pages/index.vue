<script setup lang="ts">
import { computed, useHead, useRoute, useRuntimeConfig, useSeoMeta } from '#imports'

import { findCategory } from '#shared/utils/categories'

import CategoryPanels from '~/components/CategoryPanels.vue'
import HeroSection from '~/components/HeroSection.vue'
import PostCard from '~/components/PostCard.vue'
import PostSlider from '~/components/PostSlider.vue'
import { useCategories } from '~/composables/useCategories'
import { usePublishedPosts } from '~/composables/usePublishedPosts'
import { pageWindow, paginate } from '~/utils/pagination'

const { public: { siteUrl, siteName, siteDescription } } = useRuntimeConfig()

const route = useRoute()

const posts = await usePublishedPosts()
const categories = await useCategories()

const ARCHIVE_PER_PAGE = 24

/**
 * `?page=N`: garbage or missing params degrade to a valid page inside
 * paginate() instead of erroring, keeping SSR and prerender pure
 * (no client-only state).
 */
const archive = computed(() =>
  paginate(posts, Number(route.query.page), ARCHIVE_PER_PAGE),
)

const pages = computed(() => pageWindow(archive.value.page, archive.value.totalPages))

const featured = posts[0]
const featuredCategory = featured
  ? findCategory(categories, featured.category ?? '')
  : undefined

function pageHref(page: number): string {
  return page <= 1 ? '/' : `/?page=${page}`
}

const canonicalHref = computed(() =>
  archive.value.page === 1 ? siteUrl : `${siteUrl}/?page=${archive.value.page}`,
)

useSeoMeta({
  title: siteName,
  description: siteDescription,
  ogTitle: siteName,
  ogDescription: siteDescription,
  ogLocale: 'id_ID',
})
useHead({
  link: [{ rel: 'canonical', href: canonicalHref }],
})
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 sm:pt-10">
    <HeroSection
      :post="featured"
      :category-label="featuredCategory?.label"
      class="border-b border-border"
    />

    <CategoryPanels :posts="posts" />

    <div class="pt-10">
      <PostSlider :posts="posts" />
    </div>

    <section>
      <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
        <h2 class="text-xl font-extrabold tracking-[-0.01em] sm:text-2xl">
          Arsip Lengkap
        </h2>
        <span class="label-caps text-muted-foreground">
          {{ archive.total }} paket · halaman {{ archive.page }} dari {{ archive.totalPages }}
        </span>
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:grid-cols-2">
        <PostCard
          v-for="post in archive.items"
          :key="post.path"
          :post="post"
          :category="findCategory(categories, post.category ?? '')"
        />
      </div>

      <nav
        v-if="archive.totalPages > 1"
        class="mt-8 flex flex-wrap items-center justify-center gap-2"
        aria-label="Halaman arsip"
      >
        <span
          v-if="archive.page <= 1"
          class="border border-foreground/20 px-3 py-1.5 label-caps text-muted-foreground opacity-50"
          aria-disabled="true"
        >
          PREV
        </span>
        <NuxtLink
          v-else
          :to="pageHref(archive.page - 1)"
          class="border border-foreground/25 px-3 py-1.5 label-caps transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
        >
          PREV
        </NuxtLink>

        <template v-for="(n, i) in pages" :key="`${n}-${i}`">
          <span v-if="n === 0" class="px-1 label-caps text-muted-foreground" aria-hidden="true">…</span>
          <span
            v-else-if="n === archive.page"
            class="border border-foreground bg-foreground px-3 py-1.5 label-caps text-background"
            aria-current="page"
          >
            {{ n }}
          </span>
          <NuxtLink
            v-else
            :to="pageHref(n)"
            class="border border-foreground/25 px-3 py-1.5 label-caps transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
          >
            {{ n }}
          </NuxtLink>
        </template>

        <span
          v-if="archive.page >= archive.totalPages"
          class="border border-foreground/20 px-3 py-1.5 label-caps text-muted-foreground opacity-50"
          aria-disabled="true"
        >
          NEXT
        </span>
        <NuxtLink
          v-else
          :to="pageHref(archive.page + 1)"
          class="border border-foreground/25 px-3 py-1.5 label-caps transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
        >
          NEXT
        </NuxtLink>
      </nav>
    </section>
  </main>
</template>
