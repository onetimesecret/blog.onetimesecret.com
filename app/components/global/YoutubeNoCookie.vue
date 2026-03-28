<script setup lang="ts">
interface Props {
  videoId: string;
  title?: string;
  caption?: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'YouTube video player',
  caption: '',
  width: 560,
  height: 315,
  aspectRatio: '16/9',
});

const embedUrl = computed(() => `https://www.youtube-nocookie.com/embed/${props.videoId}`);
</script>

<template>
  <figure class="my-6">
    <div
      class="relative w-full overflow-hidden rounded-lg shadow-md"
      :style="{ aspectRatio }"
    >
      <iframe
        :src="embedUrl"
        :title="title"
        :width="width"
        :height="height"
        class="absolute inset-0 h-full w-full"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      />
    </div>
    <figcaption class="mt-2 text-sm text-gray-500 dark:text-gray-400">
      <span v-if="caption">{{ caption }} &mdash; </span>
      <span class="italic">Embedded via youtube-nocookie.com for privacy</span>
    </figcaption>
  </figure>
</template>
