<script setup lang="ts">
import { defineProps, withDefaults } from 'vue';

interface Props {
  imageSrc: string;
  imageAlt?: string;
  floatRight?: boolean;
}

withDefaults(defineProps<Props>(), {
  imageAlt: 'Image',
  floatRight: false,
});
</script>

<template>
  <div class="flex flex-col md:flex-row gap-4 my-6">
    <NuxtImg
      :src="imageSrc"
      :alt="imageAlt"
      class="max-w-full md:max-w-sm rounded-lg shadow-md" :class="[
        floatRight ? 'md:order-1 md:mr-4' : 'md:order-2 md:ml-4',
      ]"
    />
    <p class="text-midnight-700">
      <slot />
    </p>
  </div>
</template>
