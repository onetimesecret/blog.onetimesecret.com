<script setup lang="ts">
const colorMode = useColorMode();

const color = computed(() => colorMode.value === 'dark' ? '#111827' : 'white');

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'canonical', href: 'https://blog.onetimesecret.com/' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
});

useSeoMeta({
  titleTemplate: '%s - Onetime Secret - Share Secrets Securely',
  ogImage: '/onetime-socialcard-20240823-2.png',
  twitterImage: '/onetime-socialcard-20240823-2.png',
  twitterCard: 'summary_large_image',
});
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="repeating-linear-gradient(to right,#dc4a22 0%,#f7dec3 50%,#fcf8f2 100%)" :height="5" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
