<script setup lang="ts">
/**
 * Renders text that may carry TextProv marks as the spans the upstream
 * decoder's render() would produce in exact display, so the markup is already
 * present in the prerendered HTML and nothing flashes on hydration. The text
 * is passed through untouched: marks stay in the string and survive copying.
 */
import textprov from '~/vendor/textprov/textprov.js';

const props = defineProps<{ text: string }>();

// Whitespace between two marked runs joins them, so a marked phrase is one
// span with one pair of seams rather than one per word.
const runs = computed(() => textprov.runs(props.text, { merge_whitespace: true }));

const passage = computed(() => {
  const states = Array.from(new Set(runs.value.filter(r => r.state).map(r => r.state))).sort();
  if (states.length === 0)
    return null;
  return states.length === 1 ? states[0] : 'mixed';
});
</script>

<template>
  <!-- Kept on one line: a line break inside the inline run would become a space in the text. -->
  <!-- eslint-disable vue/singleline-html-element-content-newline -->
  <span v-if="passage" class="prov-passage" :data-prov-passage="passage"><template v-for="(run, i) in runs" :key="i"><span v-if="run.state" class="prov" :class="`prov-${run.state}`" :data-prov="run.state">{{ run.text }}</span><template v-else>{{ run.text }}</template></template></span>
  <template v-else>{{ text }}</template>
  <!-- eslint-enable vue/singleline-html-element-content-newline -->
</template>
