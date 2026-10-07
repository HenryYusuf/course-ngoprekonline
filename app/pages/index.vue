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
 * ddpanda-style `?page=N`: garbage or missing params degrade to a valid
 * page inside paginate() instead of erroring, keeping SSR and prerender
 * pure (no client-only state).
 */
const archive = computed(() =>
  paginate(posts, Number(route.query.page), ARCHIVE_PER_PAGE),
)

const pages = computed(() => pageWindow(archive.value.page, archive.value.totalPages))

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
  <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
    <HeroSection />
    <PostSlider :posts="posts" />
    <CategoryPanels :posts="posts" />

    <section>
      <h2 class="mb-5 min-w-0 truncate label-caps text-foreground">
        <span class="text-primary">$</span>
        ARSIP --archive
      </h2>
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
          class="border border-border bg-surface-low px-3 py-1.5 label-caps text-muted-foreground opacity-50"
          aria-disabled="true"
        >
          PREV
        </span>
        <NuxtLink
          v-else
          :to="pageHref(archive.page - 1)"
          class="border border-border bg-background px-3 py-1.5 label-caps text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          PREV
        </NuxtLink>

        <template v-for="(n, i) in pages" :key="`${n}-${i}`">
          <span v-if="n === 0" class="px-1 label-caps text-muted-foreground" aria-hidden="true">…</span>
          <span
            v-else-if="n === archive.page"
            class="border border-primary bg-primary px-3 py-1.5 label-caps text-primary-foreground"
            aria-current="page"
          >
            {{ n }}
          </span>
          <NuxtLink
            v-else
            :to="pageHref(n)"
            class="border border-border bg-background px-3 py-1.5 label-caps text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {{ n }}
          </NuxtLink>
        </template>

        <span
          v-if="archive.page >= archive.totalPages"
          class="border border-border bg-surface-low px-3 py-1.5 label-caps text-muted-foreground opacity-50"
          aria-disabled="true"
        >
          NEXT
        </span>
        <NuxtLink
          v-else
          :to="pageHref(archive.page + 1)"
          class="border border-border bg-background px-3 py-1.5 label-caps text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          NEXT
        </NuxtLink>
      </nav>
    </section>
  </main>
</template>
