<script setup lang="ts">
defineProps<{ id: string }>()
</script>

<template>
  <div class="my-4 aspect-video w-full overflow-hidden rounded-lg">
    <iframe
      class="h-full w-full"
      :src="`https://www.youtube-nocookie.com/embed/${id}`"
      title="Video YouTube"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </div>
</template>
