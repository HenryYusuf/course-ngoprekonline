<script setup lang="ts">
defineProps<{ id: string }>()
</script>

<template>
  <div class="my-4 aspect-video w-full overflow-hidden rounded-lg">
    <iframe
      class="h-full w-full"
      :src="`https://player.vimeo.com/video/${id}`"
      title="Video Vimeo"
      loading="lazy"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
    />
  </div>
</template>
