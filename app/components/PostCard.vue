<script setup lang="ts">
import { computed } from '#imports'

import { formatDate } from '~/utils/formatDate'

const props = defineProps<{
  post: {
    path: string
    title: string
    description: string
    publishedAt: Date | string
    image?: string
    tags?: string[]
  }
}>()

const isoDate = computed(() => new Date(props.post.publishedAt).toISOString())
</script>

<template>
  <article class="border border-gray-200 rounded-lg p-5">
    <img v-if="post.image" :src="post.image" :alt="post.title" class="mb-3 w-full rounded">
    <h2 class="text-xl font-semibold">
      <NuxtLink :to="post.path" class="hover:underline">
        {{ post.title }}
      </NuxtLink>
    </h2>
    <p class="mt-1 text-gray-600">
      {{ post.description }}
    </p>
    <div class="mt-3 flex items-center gap-3 text-sm text-gray-500">
      <time :datetime="isoDate">{{ formatDate(post.publishedAt) }}</time>
      <NuxtLink
        v-for="tag in post.tags"
        :key="tag"
        :to="`/blog/tag/${tag}`"
        class="text-blue-600 hover:underline"
      >
        #{{ tag }}
      </NuxtLink>
    </div>
  </article>
</template>
