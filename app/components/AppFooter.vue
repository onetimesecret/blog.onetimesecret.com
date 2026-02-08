<script setup lang="ts">
const links = [
  {
    label: 'Resources',
    children: [
      { label: 'Docs', to: 'https://docs.onetimesecret.com/docs' },
      { label: 'Blog', to: '/' },
      { label: 'Issues', to: 'https://github.com/onetimesecret/onetimesecret/issues' },
      { label: 'Status', to: 'https://status.onetimesecret.com/' },
    ],
  },
  {
    label: 'Features',
    children: [
      { label: 'Custom Domains', to: 'https://docs.onetimesecret.com/docs/custom-links' },
      { label: 'Single-use links', to: 'https://docs.onetimesecret.com//docs/secret-links' },
      { label: 'API', to: 'https://docs.onetimesecret.com//docs/rest-api' },
      { label: 'Docker', to: 'https://github.com/onetimesecret/onetimesecret/pkgs/container/onetimesecret' },
    ],
  },
  {
    label: 'Company',
    children: [
      { label: 'About', to: 'https://docs.onetimesecret.com/about' },
      { label: 'Pricing', to: 'https://onetimesecret.com/pricing' },
      { label: 'Sponsors', to: 'https://github.com/sponsors/onetimesecret' },
      { label: 'Careers', to: 'https://docs.onetimesecret.com/careers' },
    ],
  },
];
</script>

<template>
  <UFooter class="bg-white dark:bg-midnight-900">
    <template #top>
      <UFooterColumns
        :links="links"
        class="dark:text-midnight-300"
      />
    </template>

    <template #left>
      <p class="text-midnight-500 dark:text-midnight-400 text-sm">
        Copyright © {{ new Date().getFullYear() }}. All rights reserved.
        <span class="ml-2">
          <NuxtLink to="https://onetimesecret.com/info/terms" class="hover:underline">Terms</NuxtLink>
          <span class="mx-1">·</span>
          <NuxtLink to="https://onetimesecret.com/info/privacy" class="hover:underline">Privacy</NuxtLink>
          <span class="mx-1">·</span>
          <NuxtLink to="https://onetimesecret.com/info/security" class="hover:underline">Security</NuxtLink>
        </span>
      </p>
    </template>

    <template #right>
      <UButton
        to="https://onetimesecret.com"
        target="_blank"
        aria-label="OnetimeSecret.com"
        color="neutral"
        variant="ghost"
        class="hover:bg-midnight-100 dark:hover:bg-midnight-800 mr-2 text-sm"
      >
        OnetimeSecret.com
      </UButton>

      <UColorModeButton
        size="sm"
        class="mr-2"
      />

      <UButton
        to="https://github.com/onetimesecret/blog.onetimesecret.com"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="GitHub"
        color="neutral"
        variant="ghost"
        class="hover:bg-midnight-100 dark:hover:bg-midnight-800"
      />
    </template>
  </UFooter>
</template>
