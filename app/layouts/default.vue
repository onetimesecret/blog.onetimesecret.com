<script setup lang="ts">
const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('posts'), { default: () => [] });

provide('navigation', navigation);
</script>

<template>
  <div>
    <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-white focus:text-brand-700 focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-brand-500 dark:focus:bg-midnight-800 dark:focus:text-white">
      Skip to content
    </a>

    <AppHeader />

    <UMain id="main-content">
      <slot />
    </UMain>

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :navigation="navigation"
      />
    </ClientOnly>
  </div>
</template>
