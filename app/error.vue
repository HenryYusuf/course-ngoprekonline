<script setup lang="ts">
import type { NuxtError } from '#app'

import { clearError, navigateTo, useHead } from '#imports'

defineProps<{ error: NuxtError }>()

useHead({ title: 'Terjadi kesalahan' })

function goHome() {
  clearError({ redirect: '/' })
  navigateTo('/')
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <div class="border-b border-foreground bg-plate text-plate-fg">
      <div class="mx-auto h-8 max-w-6xl flex items-center justify-between gap-4 px-4 label-caps sm:px-6">
        <span>Edutorial blog download</span>
        <span>Edisi {{ new Date().getFullYear() }}</span>
      </div>
    </div>

    <main class="mx-auto max-w-6xl flex flex-col items-start px-4 py-16 sm:px-6 sm:py-24">
      <p class="label-caps text-muted-foreground">
        Ngoprek.Online
      </p>

      <p
        v-if="error?.statusCode"
        class="mt-6 text-6xl font-extrabold tracking-[-0.03em] sm:text-7xl"
        data-testid="error-status"
      >
        {{ error.statusCode }}
      </p>

      <h1 class="mt-4 text-3xl font-extrabold tracking-[-0.02em] sm:text-4xl">
        {{ error?.statusCode === 404 ? 'Halaman tidak ditemukan' : 'Terjadi kesalahan' }}
      </h1>

      <p class="mt-4 max-w-[54ch] text-muted-foreground leading-relaxed">
        {{ error?.statusCode === 404
          ? 'Halaman yang kamu cari tidak ada atau sudah dipindahkan. Coba mulai lagi dari beranda.'
          : 'Terjadi kesalahan saat memuat halaman. Coba lagi beberapa saat lagi.' }}
      </p>

      <button
        type="button"
        class="mt-8 btn-signal"
        @click="goHome"
      >
        Kembali ke beranda
      </button>
    </main>
  </div>
</template>
