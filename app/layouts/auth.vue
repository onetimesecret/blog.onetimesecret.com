<template>
  <div class="h-screen flex items-center justify-center bg-white dark:bg-midnight-950 relative">
    <div class="absolute inset-0 pointer-events-none bg-gradient-radial" />

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
  background-image: radial-gradient(50% 50% at 50% 50%, color-mix(in srgb, var(--color-brand-500) 25%, transparent), white);
}

:global(.dark) .bg-gradient-radial {
  background-image: radial-gradient(50% 50% at 50% 50%, color-mix(in srgb, var(--color-brand-400) 10%, transparent), var(--color-gray-950, #030712));
}
</style>
