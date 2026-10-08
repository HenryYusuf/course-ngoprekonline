<script setup lang="ts">
import { computed } from '#imports'

import { useCategories } from '~/composables/useCategories'

const year = computed(() => new Date().getFullYear())

const categories = await useCategories()
</script>

<template>
  <footer class="mt-16 border-t border-foreground/15 bg-surface-low">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <div class="flex flex-wrap items-start justify-between gap-8 py-10">
        <div class="max-w-sm">
          <div class="flex items-center gap-2.5">
            <span class="h-3.5 w-3.5 shrink-0 border border-foreground bg-primary" aria-hidden="true" />
            <span class="text-[17px] font-extrabold tracking-[-0.02em]">Ngoprek.Online</span>
          </div>
          <p class="mt-3 text-sm text-muted-foreground leading-relaxed">
            Edutorial blog download: tutorial Indonesia yang tiap paketnya
            jujur soal isi, dan berkas pendampingnya boleh diambil.
          </p>
        </div>

        <nav class="flex flex-wrap gap-x-5 gap-y-2 label-caps text-muted-foreground" aria-label="Navigasi footer">
          <NuxtLink
            to="/blog"
            class="transition-colors hover:text-foreground"
          >
            Blog
          </NuxtLink>
          <a
            href="/rss.xml"
            class="transition-colors hover:text-foreground"
          >
            RSS
          </a>
          <NuxtLink
            v-for="category in categories"
            :key="category.slug"
            :to="`/blog/category/${category.slug}`"
            class="transition-colors hover:text-foreground"
          >
            {{ category.label }}
          </NuxtLink>
        </nav>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 border-t border-border py-5 label-caps text-muted-foreground">
        <span>&copy; {{ year }} NGOPREK.ONLINE // ALL RIGHTS RESERVED</span>
        <span class="flex items-center gap-2">
          <span class="h-2 w-2 shrink-0 bg-primary" aria-hidden="true" />
          EDISI {{ year }}
        </span>
      </div>
    </div>
  </footer>
</template>
