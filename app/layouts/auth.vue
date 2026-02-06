<template>
  <div class="h-screen flex items-center justify-center bg-white dark:bg-gray-950 relative">
    <div class="absolute inset-0 pointer-events-none bg-gradient-radial from-brand-500/25 to-white dark:from-brand-400/10 dark:to-gray-950" />

    <UButton
      icon="i-heroicons-home"
      label="Home"
      to="/"
      color="neutral"
      class="absolute top-4 left-4"
    />

    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.bg-gradient-radial {
  background-image: radial-gradient(50% 50% at 50% 50%, var(--tw-gradient-from), var(--tw-gradient-to));
}
</style>
