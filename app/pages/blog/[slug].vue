<script setup lang="ts">
import { createError, useHead, useRoute, useRuntimeConfig, useSeoMeta } from '#imports'

import { findCategory } from '#shared/utils/categories'

import PostCard from '~/components/PostCard.vue'
import SpecPlate from '~/components/SpecPlate.vue'
import { useCategories } from '~/composables/useCategories'
import { usePublishedPost, usePublishedPosts } from '~/composables/usePublishedPosts'
import { articleJsonLd } from '~/utils/articleJsonLd'
import { formatDate } from '~/utils/formatDate'
import { readingMinutes } from '~/utils/readingMinutes'
import { relatedPosts } from '~/utils/relatedPosts'

const route = useRoute()
const { public: { siteUrl, siteName } } = useRuntimeConfig()

const post = await usePublishedPost(route.path)

if (!post) {
  throw createError({ statusCode: 404, statusMessage: 'Post tidak ditemukan', fatal: true })
}

const publishedTime = new Date(post.publishedAt).toISOString()
const categories = await useCategories()
const category = findCategory(categories, post.category)

const related = relatedPosts(post, await usePublishedPosts())

useSeoMeta({
  title: post.title,
  description: post.description,
  ogTitle: post.title,
  ogDescription: post.description,
  ogType: 'article',
  ogLocale: 'id_ID',
  ogImage: post.image ? `${siteUrl}${post.image}` : `${siteUrl}/images/og-default.png`,
  articlePublishedTime: publishedTime,
})
useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}${route.path}` }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(articleJsonLd({
        path: route.path,
        title: post.title,
        description: post.description,
        publishedAt: post.publishedAt,
        image: post.image,
        categorySlug: post.category,
        categoryLabel: category?.label,
      }, siteUrl, siteName)),
    },
  ],
})
</script>

<template>
  <main v-if="post" class="mx-auto max-w-3xl px-4 py-10 sm:py-12">
    <article>
      <header>
        <span
          v-if="post.draft"
          class="inline-block border border-foreground px-2 py-0.5 label-caps"
        >Draf</span>

        <h1 class="mt-3 text-3xl font-extrabold leading-[1.08] tracking-[-0.02em] lg:text-[2.75rem] sm:text-4xl">
          {{ post.title }}
        </h1>

        <p class="mt-4 max-w-[62ch] text-lg text-muted-foreground leading-relaxed">
          {{ post.description }}
        </p>

        <div class="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 label-caps text-muted-foreground">
          <NuxtLink
            v-if="category"
            :to="`/blog/category/${post.category}`"
            class="border border-foreground/30 px-1.5 py-0.5 text-foreground transition-colors hover:border-foreground"
          >
            {{ category.label }}
          </NuxtLink>
          <time :datetime="publishedTime">{{ formatDate(post.publishedAt) }}</time>
          <span>{{ readingMinutes(post.body) }} menit baca</span>
        </div>
      </header>

      <img
        v-if="post.image"
        :src="post.image"
        :alt="post.title"
        class="mt-8 aspect-[16/9] w-full border border-foreground/20 object-cover"
      >

      <SpecPlate
        class="mt-8"
        :category-label="category?.label"
        :published-at="post.publishedAt"
        :body="post.body"
        :resources="post.resources"
      />

      <div class="mt-10">
        <ContentRenderer :value="post" class="prose" />
      </div>

      <footer
        v-if="post.tags && post.tags.length > 0"
        class="mt-12 border-t border-border pt-6"
      >
        <h2 class="label-caps text-muted-foreground">
          Tag
        </h2>
        <ul class="mt-3 flex flex-wrap gap-2">
          <li v-for="tag in post.tags" :key="tag">
            <NuxtLink
              :to="`/blog/tag/${tag}`"
              class="inline-block border border-foreground/20 px-1.5 py-0.5 label-caps text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              #{{ tag }}
            </NuxtLink>
          </li>
        </ul>
      </footer>
    </article>

    <section v-if="related.length > 0" class="mt-16 border-t border-border pt-10">
      <h2 class="text-xl font-extrabold tracking-[-0.01em] sm:text-2xl">
        Paket Terkait
      </h2>
      <div class="grid mt-6 gap-6 lg:grid-cols-3 sm:grid-cols-2">
        <PostCard
          v-for="relatedPost in related"
          :key="relatedPost.path"
          :post="relatedPost"
          :category="findCategory(categories, relatedPost.category)"
        />
      </div>
    </section>
  </main>
</template>
