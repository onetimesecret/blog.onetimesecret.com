<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    required: true,
  },
});

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.',
});

useHead({
  htmlAttrs: {
    lang: 'en',
  },
});

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('posts'), { default: () => [] });

provide('navigation', navigation);
</script>

<template>
  <UApp>
    <AppHeader />

    <UMain>
      <UContainer>
        <UPage>
          <UPageError :error="error" />
        </UPage>
      </UContainer>
    </UMain>

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :navigation="navigation"
      />
    </ClientOnly>
  </UApp>
</template>
