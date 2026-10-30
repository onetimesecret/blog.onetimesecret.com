<script setup lang="ts">
/**
 * Segmented control that steps the page through the three display tiers.
 * One control per panel, all bound to the same shared state.
 */
const { tier, tiers } = useProvenanceDisplay();

const labels: Record<ProvenanceTier, string> = {
  latent: 'Latent',
  quiet: 'Quiet',
  loud: 'Loud',
};
</script>

<template>
  <div
    role="radiogroup"
    aria-label="Provenance display tier"
    class="inline-flex overflow-hidden rounded-md border border-midnight-200 text-sm dark:border-midnight-600"
  >
    <button
      v-for="t in tiers"
      :key="t"
      type="button"
      role="radio"
      :aria-checked="tier === t"
      class="px-3 py-1 transition-colors"
      :class="tier === t
        ? 'bg-midnight-200 font-medium text-midnight-900 dark:bg-midnight-700 dark:text-midnight-100'
        : 'text-midnight-600 hover:bg-midnight-100 dark:text-midnight-300 dark:hover:bg-midnight-800'"
      @click="tier = t"
    >
      {{ labels[t] }}
    </button>
  </div>
</template>
