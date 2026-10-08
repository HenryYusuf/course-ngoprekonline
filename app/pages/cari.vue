<script setup lang="ts">
import { ref, useHead, useRoute, useRuntimeConfig, useSeoMeta, watch } from '#imports'

import { useBlogSearch } from '~/composables/useBlogSearch'

const route = useRoute()
const { public: { siteUrl, siteName } } = useRuntimeConfig()

const query = ref(typeof route.query.q === 'string' ? route.query.q : '')
const { status, search } = await useBlogSearch()
const results = ref<Awaited<ReturnType<typeof search>>>([])
const pending = ref(false)
const failed = ref(false)
let sequence = 0

watch([query, () => status.value], async () => {
  if (status.value !== 'ready') {
    return
  }
  const current = ++sequence
  const trimmed = query.value.trim()
  failed.value = false
  if (!trimmed) {
    results.value = []
    pending.value = false
    return
  }
  pending.value = true
  try {
    const found = await search(trimmed)
    if (current === sequence) {
      results.value = found
    }
  }
  catch {
    if (current === sequence) {
      failed.value = true
      results.value = []
    }
  }
  finally {
    if (current === sequence) {
      pending.value = false
    }
  }
}, { immediate: true })

useSeoMeta({
  title: 'Cari',
  description: `Cari Blog Post di ${siteName}.`,
  ogTitle: 'Cari',
  ogDescription: `Cari Blog Post di ${siteName}.`,
  ogLocale: 'id_ID',
})
useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/cari` }],
})
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
    <header class="mb-8 border-b border-border pb-7">
      <h1 class="text-3xl font-extrabold tracking-[-0.02em] sm:text-4xl">
        Cari
      </h1>
      <p class="mt-3 label-caps text-muted-foreground">
        Cari di seluruh Blog Post
      </p>
    </header>

    <div>
      <label for="cari-input" class="label-caps text-muted-foreground">
        Kata kunci
      </label>
      <input
        id="cari-input"
        v-model="query"
        type="search"
        class="mt-2 w-full border border-foreground/25 bg-background px-3 py-2.5 text-base"
        placeholder="Ketik kata kunci…"
        autocomplete="off"
      >
    </div>

    <p v-if="status === 'error' || failed" class="mt-6 label-caps text-muted-foreground" data-testid="state-error">
      Pencarian gagal dimuat. Muat ulang halaman untuk mencoba lagi.
    </p>
    <p v-else-if="status !== 'ready'" class="mt-6 label-caps text-muted-foreground" data-testid="state-loading">
      Menyiapkan pencarian…
    </p>
    <p v-else-if="!query.trim()" class="mt-6 label-caps text-muted-foreground" data-testid="state-hint">
      Ketik kata kunci untuk mulai mencari.
    </p>
    <p v-else-if="pending" class="mt-6 label-caps text-muted-foreground" data-testid="state-pending">
      Mencari…
    </p>
    <p v-else-if="results.length === 0" class="mt-6 label-caps text-muted-foreground" data-testid="state-empty">
      Tidak ada hasil untuk “{{ query.trim() }}”.
    </p>

    <ul v-else class="mt-6 flex flex-col gap-4">
      <li
        v-for="result in results"
        :key="result.path"
        class="border border-border p-4 transition-colors hover:border-foreground"
      >
        <NuxtLink :to="result.path" class="block">
          <span class="block text-lg font-bold tracking-[-0.01em]">{{ result.title }}</span>
          <span class="mt-1 block text-sm text-muted-foreground" v-html="result.snippet" />
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>
