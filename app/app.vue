<script setup lang="ts">
import SiteFooter from '~/components/SiteFooter.vue'
import SiteHeader from '~/components/SiteHeader.vue'

const year = new Date().getFullYear()
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />

    <div class="border-b border-foreground bg-plate text-plate-fg">
      <div class="mx-auto h-8 max-w-6xl flex items-center justify-between gap-4 px-4 label-caps sm:px-6">
        <span>Edutorial blog download</span>
        <span class="hidden items-center gap-2 sm:flex">
          Sumber daya gratis
          <span class="h-2 w-2 shrink-0 bg-primary" aria-hidden="true" />
        </span>
        <span>Edisi {{ year }}</span>
      </div>
    </div>

    <SiteHeader />
    <NuxtPage />
    <SiteFooter />
  </div>
</template>
