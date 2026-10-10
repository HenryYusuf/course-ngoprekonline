<script setup lang="ts">
import { computed } from '#imports'

import { pageWindow } from '#shared/utils/pagination'

const props = defineProps<{
  /** 1-based current page (already clamped by paginate()). */
  page: number
  totalPages: number
  /** Archive root; page 1 is this path, later pages append `?page=N`. */
  basePath: string
  ariaLabel?: string
}>()

const pages = computed(() => pageWindow(props.page, props.totalPages))

function pageHref(page: number): string {
  return page <= 1 ? props.basePath : `${props.basePath}?page=${page}`
}
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="mt-8 flex flex-wrap items-center justify-center gap-2"
    :aria-label="ariaLabel ?? 'Halaman arsip'"
  >
    <span
      v-if="page <= 1"
      class="border border-foreground/20 px-3 py-1.5 label-caps text-muted-foreground opacity-50"
      aria-disabled="true"
    >
      PREV
    </span>
    <NuxtLink
      v-else
      :to="pageHref(page - 1)"
      class="border border-foreground/25 px-3 py-1.5 label-caps transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
    >
      PREV
    </NuxtLink>

    <template v-for="(n, i) in pages" :key="`${n}-${i}`">
      <span v-if="n === 0" class="px-1 label-caps text-muted-foreground" aria-hidden="true">…</span>
      <span
        v-else-if="n === page"
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
      v-if="page >= totalPages"
      class="border border-foreground/20 px-3 py-1.5 label-caps text-muted-foreground opacity-50"
      aria-disabled="true"
    >
      NEXT
    </span>
    <NuxtLink
      v-else
      :to="pageHref(page + 1)"
      class="border border-foreground/25 px-3 py-1.5 label-caps transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
    >
      NEXT
    </NuxtLink>
  </nav>
</template>
