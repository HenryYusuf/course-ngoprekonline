<script setup lang="ts">
import { computed } from '#imports'

import SpecPlate from '~/components/SpecPlate.vue'

const props = defineProps<{
  post?: {
    path: string
    title: string
    description: string
    publishedAt: Date | string
    body?: unknown
    resources?: { title: string, file: string, bytes?: number }[]
  }
  categoryLabel?: string
}>()

const stampLabel = computed(() =>
  props.post
    ? `Paket terbaru · ${props.categoryLabel ?? 'Tanpa kategori'}`
    : 'Edutorial blog download',
)

// Blog posts live at `/blog/<slug>`; the zip route is keyed by that slug.
const slug = computed(() =>
  props.post?.path.replace(/^\/blog\//, '') || undefined,
)
</script>

<template>
  <section class="grid gap-8 pb-12 lg:grid-cols-12 lg:gap-10 lg:pb-16">
    <template v-if="post">
      <div class="flex flex-col justify-center lg:col-span-7">
        <span class="stamp self-start">
          <span class="h-2 w-2 shrink-0 bg-primary" aria-hidden="true" />
          {{ stampLabel }}
        </span>

        <h1 class="mt-6 text-[2.4rem] font-extrabold leading-[1.05] tracking-[-0.03em] lg:text-[3.5rem] sm:text-5xl">
          {{ post.title }}
        </h1>

        <p class="mt-5 max-w-[54ch] text-lg text-muted-foreground leading-relaxed">
          {{ post.description }}
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <NuxtLink :to="post.path" class="btn-signal">
            BACA PAKET
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path d="M3 8h10m0 0-4-4m4 4-4 4" />
            </svg>
          </NuxtLink>
          <a href="#spesifikasi" class="btn-ghost">LIHAT ISI</a>
        </div>
      </div>

      <SpecPlate
        id="spesifikasi"
        class="lg:col-span-5"
        :category-label="categoryLabel"
        :published-at="post.publishedAt"
        :body="post.body"
        :resources="post.resources"
        :slug="slug"
      />
    </template>

    <template v-else>
      <div class="flex flex-col justify-center lg:col-span-7">
        <span class="stamp self-start">
          <span class="h-2 w-2 shrink-0 bg-primary" aria-hidden="true" />
          {{ stampLabel }}
        </span>
        <h1 class="mt-6 text-[2.4rem] font-extrabold leading-[1.05] tracking-[-0.03em] lg:text-[3.5rem] sm:text-5xl">
          Tutorial Indonesia, siap dibaca dan diunduh.
        </h1>
        <p class="mt-5 max-w-[54ch] text-lg text-muted-foreground leading-relaxed">
          Satu paket per artikel: panduan yang jujur soal isinya, lengkap dengan
          berkas pendamping yang boleh langsung diambil.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <NuxtLink to="/blog" class="btn-signal">
            LIHAT ARSIP
          </NuxtLink>
        </div>
      </div>
      <aside class="flex items-center justify-center border border-foreground/20 bg-surface-low p-8 lg:col-span-5">
        <p class="label-caps text-muted-foreground">
          Belum ada paket terbit
        </p>
      </aside>
    </template>
  </section>
</template>
