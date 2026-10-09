<script setup lang="ts">
import { computed, ref, useHead, useRoute, useRouter, useRuntimeConfig, useSeoMeta, watch } from '#imports'

import { useBlogSearch } from '~/composables/useBlogSearch'

const route = useRoute()
const router = useRouter()
const { public: { siteUrl, siteName } } = useRuntimeConfig()

function readRouteQ(): string {
  return typeof route.query.q === 'string' ? route.query.q : ''
}

const query = ref(readRouteQ())
const { status, search } = await useBlogSearch()
const results = ref<Awaited<ReturnType<typeof search>>>([])
const pending = ref(false)
const failed = ref(false)
const DEBOUNCE_MS = 250
let sequence = 0
let timer: ReturnType<typeof setTimeout> | undefined

const selectedIndex = ref(-1)

const activeId = computed(() => {
  if (selectedIndex.value >= 0 && selectedIndex.value < results.value.length) {
    return `cari-hasil-${selectedIndex.value}`
  }
  return undefined
})

const listOpen = computed(() =>
  status.value === 'ready'
  && !!query.value.trim()
  && !pending.value
  && !failed.value
  && results.value.length > 0,
)

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowDown' && results.value.length > 0) {
    event.preventDefault()
    selectedIndex.value = Math.min(selectedIndex.value + 1, results.value.length - 1)
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
  }
  else if (event.key === 'Enter') {
    const selected = results.value[selectedIndex.value]
    if (selected) {
      event.preventDefault()
      void router.push(selected.path)
    }
  }
  else if (event.key === 'Escape') {
    event.preventDefault()
    query.value = ''
    selectedIndex.value = -1
  }
}

function syncUrl(): void {
  const trimmed = query.value.trim()
  if (trimmed !== readRouteQ()) {
    void router.replace({ query: { ...route.query, q: trimmed || undefined } })
  }
}

async function executeSearch(): Promise<void> {
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
}

watch([query, () => status.value], () => {
  selectedIndex.value = -1
  if (timer !== undefined) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    timer = undefined
    syncUrl()
    void executeSearch()
  }, DEBOUNCE_MS)
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
        role="combobox"
        :aria-expanded="listOpen ? 'true' : 'false'"
        :aria-controls="listOpen ? 'cari-hasil' : undefined"
        :aria-activedescendant="activeId"
        :aria-busy="status !== 'ready' || pending ? 'true' : 'false'"
        @keydown="onKeydown"
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

    <ul v-else id="cari-hasil" role="listbox" class="mt-6 flex flex-col gap-4">
      <li
        v-for="(result, index) in results"
        :id="`cari-hasil-${index}`"
        :key="result.path"
        role="option"
        :aria-selected="selectedIndex === index ? 'true' : 'false'"
        class="border border-border p-4 transition-colors hover:border-foreground"
        :class="{ 'border-foreground bg-foreground text-background': selectedIndex === index }"
      >
        <NuxtLink :to="result.path" tabindex="-1" class="block">
          <span class="block text-lg font-bold tracking-[-0.01em]">{{ result.title }}</span>
          <span class="mt-1 block text-sm text-muted-foreground" v-html="result.snippet" />
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>
