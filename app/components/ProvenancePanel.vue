<script setup lang="ts">
/**
 * Shared chrome for the provenance demos: a titled panel with the display
 * tier control in its header. The tier comes from useProvenanceDisplay, so
 * every panel on the page steps together.
 */
interface Props {
  label?: string;
}

withDefaults(defineProps<Props>(), {
  label: 'Provenance display',
});
</script>

<template>
  <div class="not-prose my-8 rounded-lg border border-midnight-200 bg-midnight-50 shadow-sm dark:border-midnight-700 dark:bg-midnight-800/50">
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-midnight-200 px-4 py-3 dark:border-midnight-700">
      <div class="font-brand text-lg font-medium text-midnight-900 dark:text-midnight-100">
        {{ label }}
      </div>
      <slot name="controls">
        <ProvenanceTierControl />
      </slot>
    </div>

    <!-- Exact display (the recorded ranges, not whole passages). The vendored
         stylesheet looks for this attribute on an ancestor below the root. -->
    <div
      data-prov-display="exact"
      class="space-y-3 px-4 py-4 text-base text-midnight-800 dark:text-midnight-200"
    >
      <slot />
    </div>
  </div>
</template>
