<script setup lang="ts">
import { computed } from '#imports'

import { isExternalFile } from '#shared/utils/resources'

import { formatBytes } from '~/utils/formatBytes'
import { formatDate } from '~/utils/formatDate'
import { readingMinutes } from '~/utils/readingMinutes'

interface PackageResource {
  title: string
  file: string
  bytes?: number
}

const props = defineProps<{
  categoryLabel?: string
  publishedAt?: Date | string
  body?: unknown
  resources?: PackageResource[]
  /** Post slug, used to link the "download all" zip route. */
  slug?: string
  id?: string
}>()

const resources = computed(() => props.resources ?? [])

// Origin is detected from the link's shape (ADR 0004). External rows are a
// redirect to a PPD host, so they open in a new tab and carry no download
// attribute (browsers ignore `download` cross-origin anyway).
const rows = computed(() => resources.value.map(resource => ({
  ...resource,
  external: isExternalFile(resource.file),
  fileName: resource.file.split('/').pop() ?? resource.file,
})))

// Only the repo's own files can be bundled; external resources stay a
// redirect the ZIP cannot gather.
const localRows = computed(() => rows.value.filter(row => !row.external))

// A total is only honest when every row declares a size; an external resource
// may omit `bytes`, and a partial sum would mislabel itself as the package size.
const size = computed(() =>
  rows.value.length === 0
    ? '0 B'
    : rows.value.every(row => row.bytes !== undefined)
      ? formatBytes(rows.value.reduce((sum, row) => sum + (row.bytes ?? 0), 0))
      : '-',
)

// The ZIP gathers local files only, so its badge sums just those.
const zipBadge = computed(() =>
  localRows.value.length >= 2
    ? `ZIP · isi ${formatBytes(localRows.value.reduce((sum, row) => sum + (row.bytes ?? 0), 0))}`
    : undefined,
)

// A single-file "zip" adds nothing over the direct link; only offer the
// bundle when there is genuinely more than one local file to gather.
const zipHref = computed(() =>
  props.slug && localRows.value.length >= 2 ? `/downloads/${props.slug}.zip` : undefined,
)

const specs = computed(() => [
  { label: 'Kategori', value: props.categoryLabel ?? '-' },
  { label: 'Waktu baca', value: `${readingMinutes(props.body)} menit` },
  { label: 'Terbit', value: props.publishedAt ? formatDate(props.publishedAt) : '-' },
  { label: 'File', value: `${rows.value.length} berkas` },
  { label: 'Ukuran', value: size.value },
])

function fileFormat(file: string): string {
  const ext = file.split('?')[0]?.split('#')[0]?.split('.').pop()
  return ext && ext !== file ? ext.toUpperCase() : 'BERKAS'
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
        v-for="(row, i) in specs"
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
      <ul v-if="rows.length" class="divide-y divide-plate-muted/25">
        <li v-for="resource in rows" :key="resource.file">
          <a
            :href="resource.file"
            :download="resource.external ? undefined : resource.fileName"
            :target="resource.external ? '_blank' : undefined"
            :rel="resource.external ? 'noopener' : undefined"
            class="group flex items-center justify-between gap-4 py-2.5"
          >
            <span class="min-w-0">
              <span class="block truncate text-sm text-plate-fg underline-offset-4 group-hover:underline">
                {{ resource.title }}
              </span>
              <span class="mt-0.5 block label-caps text-plate-muted">
                {{ fileFormat(resource.file) }}<template v-if="resource.bytes !== undefined"> · {{ formatBytes(resource.bytes) }}</template>
              </span>
            </span>
            <svg
              v-if="resource.external"
              viewBox="0 0 16 16"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              aria-hidden="true"
              class="shrink-0 text-primary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path d="M6 10 12 4m0 0H7m5 0v5M4 12v1.5A1.5 1.5 0 0 0 5.5 15h7a1.5 1.5 0 0 0 1.5-1.5V10" />
            </svg>
            <svg
              v-else
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
            <span class="sr-only">{{ resource.external ? 'Buka di situs lain' : 'Unduh' }}</span>
          </a>
        </li>
      </ul>
      <p v-else class="py-2 text-sm text-plate-muted leading-relaxed">
        Paket ini belum menyertakan berkas unduhan. Baca artikelnya dulu;
        file menyusul kalau materinya memang butuh pendamping.
      </p>

      <a
        v-if="zipHref"
        :href="zipHref"
        :download="`${slug}.zip`"
        class="mt-3 flex items-center justify-between gap-3 border border-plate-muted/40 px-3.5 py-2.5 transition-colors hover:border-plate-fg"
      >
        <span class="label-caps text-plate-fg">Unduh semua</span>
        <span class="label-caps text-plate-muted">{{ zipBadge }}</span>
      </a>
    </div>
  </aside>
</template>
