<script setup lang="ts">
import { computed } from '#imports'

import { formatBytes } from '~/utils/formatBytes'
import { formatDate } from '~/utils/formatDate'
import { readingMinutes } from '~/utils/readingMinutes'

interface PackageResource {
  title: string
  file: string
  bytes: number
}

const props = defineProps<{
  categoryLabel?: string
  publishedAt?: Date | string
  body?: unknown
  resources?: PackageResource[]
  id?: string
}>()

const resources = computed(() => props.resources ?? [])

const totalBytes = computed(() =>
  resources.value.reduce((sum, resource) => sum + resource.bytes, 0),
)

const rows = computed(() => [
  { label: 'Kategori', value: props.categoryLabel ?? '-' },
  { label: 'Waktu baca', value: `${readingMinutes(props.body)} menit` },
  { label: 'Terbit', value: props.publishedAt ? formatDate(props.publishedAt) : '-' },
  { label: 'File', value: `${resources.value.length} berkas` },
  { label: 'Ukuran', value: formatBytes(totalBytes.value) },
])

function fileFormat(file: string): string {
  const ext = file.split('.').pop()
  return ext ? ext.toUpperCase() : 'BERKAS'
}
</script>

<template>
  <aside :id="id" class="border border-foreground bg-plate text-plate-fg">
    <div class="flex items-center justify-between border-b border-plate-muted/40 px-5 py-3">
      <span class="label-caps text-plate-fg">Spesifikasi Paket</span>
      <span class="h-2.5 w-2.5 shrink-0 bg-primary" aria-hidden="true" />
    </div>

    <dl class="px-5 pb-2 pt-1">
      <div
        v-for="(row, i) in rows"
        :key="row.label"
        class="spec-row animate-[plate-row-in_560ms_both]"
        :style="{ animationDelay: `${i * 55}ms` }"
      >
        <dt class="label-caps text-plate-muted">
          {{ row.label }}
        </dt>
        <dd class="text-right text-[13px] text-plate-fg font-medium tabular-nums">
          {{ row.value }}
        </dd>
      </div>
    </dl>

    <div class="border-t border-plate-muted/40 px-5 pb-4 pt-3.5">
      <div class="mb-1 label-caps text-plate-muted">
        Isi Unduhan
      </div>
      <ul v-if="resources.length" class="divide-y divide-plate-muted/25">
        <li v-for="resource in resources" :key="resource.file">
          <a
            :href="resource.file"
            :download="resource.file.split('/').pop()"
            class="group flex items-center justify-between gap-4 py-2.5"
          >
            <span class="min-w-0">
              <span class="block truncate text-sm text-plate-fg underline-offset-4 group-hover:underline">
                {{ resource.title }}
              </span>
              <span class="mt-0.5 block label-caps text-plate-muted">
                {{ fileFormat(resource.file) }} · {{ formatBytes(resource.bytes) }}
              </span>
            </span>
            <svg
              viewBox="0 0 16 16"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              aria-hidden="true"
              class="shrink-0 text-primary transition-transform duration-200 group-hover:translate-y-0.5"
            >
              <path d="M8 2v8m0 0 3-3m-3 3-3-3M3 12v2h10v-2" />
            </svg>
            <span class="sr-only">Unduh</span>
          </a>
        </li>
      </ul>
      <p v-else class="py-2 text-sm text-plate-muted leading-relaxed">
        Paket ini belum menyertakan berkas unduhan. Baca artikelnya dulu;
        file menyusul kalau materinya memang butuh pendamping.
      </p>
    </div>
  </aside>
</template>
