<script setup lang="ts">
const links = [
  {
    label: 'Docs',
    to: 'https://docs.onetimesecret.com/',
  },
  {
    label: 'Principles',
    to: 'https://docs.onetimesecret.com/principles/',
  },
  {
    label: 'Pricing',
    to: 'https://onetimesecret.com/pricing',
  },
  {
    label: 'Blog',
    to: '/',
  },
];
</script>

<template>
  <UHeader
    :links="links"
    class="dark:bg-midnight-800"
  >
    <template #title>
      <OnetimeLogo class="dark:text-white rounded-md" />
      <span class="font-brand dark:text-white">Onetime Secret</span>
      <UBadge
        label="Blog"
        color="info"
        variant="subtle"
        class="mb-0.5 dark:bg-midnight-700 dark:text-midnight-300"
      />
    </template>

    <template #right>
      <nav aria-label="Account" class="flex items-center gap-4">
        <a
          href="https://onetimesecret.com/signin"
          class="hidden lg:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-midnight-700 bg-midnight-200 hover:bg-midnight-300 dark:bg-midnight-700 dark:text-midnight-200 dark:hover:bg-midnight-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-midnight-500 transition-colors duration-150 ease-in-out"
        >
          Sign in
        </a>
        <a
          href="https://onetimesecret.com/signup"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md font-brand text-white bg-brand-600 hover:bg-brand-700 dark:bg-brand-700 dark:text-midnight-100 dark:hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors duration-150 ease-in-out"
        >
          Sign up
          <svg class="ml-2 -mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </a>
      </nav>
    </template>

    <template #body>
      <nav class="flex flex-col gap-1" aria-label="Site navigation">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="flex items-center px-3 py-3 text-base font-brand font-medium rounded-lg text-midnight-700 hover:bg-midnight-100 transition-colors dark:text-midnight-200 dark:hover:bg-midnight-700/50"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
      <USeparator class="my-3" />
      <div class="flex flex-col gap-3 px-3">
        <a
          href="https://onetimesecret.com/signin"
          class="flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg border border-midnight-200 text-midnight-700 hover:bg-midnight-50 transition-colors dark:border-midnight-600 dark:text-midnight-200 dark:hover:bg-midnight-700/50"
        >
          Sign in
        </a>
        <a
          href="https://onetimesecret.com/signup"
          class="flex items-center justify-center px-4 py-2.5 text-sm font-brand font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 transition-colors dark:bg-brand-700 dark:hover:bg-brand-600"
        >
          Sign up
          <svg class="ml-2 -mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </a>
      </div>
    </template>
  </UHeader>
</template>
