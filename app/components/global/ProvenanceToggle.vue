<script setup lang="ts">
/**
 * Lets a reader switch the page between the provenance (P+) fonts and the
 * plain faces of the same typefaces. Text carrying the AI-generated mark
 * (U+E0101 after each character) shows a sawtooth only while P+ is on.
 *
 * Usage in markdown:
 *   ::ProvenanceToggle
 *   ::
 *   ::ProvenanceToggle{sample="Custom sentence to mark as AI-generated."}
 *   Optional slot content, e.g. your own pre-marked text.
 *   ::
 */
interface Props {
  label?: string;
  sample?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: 'With Provenance',
  sample: 'The quick brown fox jumps over the lazy dog.',
});

const { enabled } = useProvenanceFonts();

// VS17 (U+E0101) marks the preceding character as AI-generated. The fonts
// map it for printable characters only, so whitespace is left bare.
const AI_MARK = '\u{E0101}';
const WHITESPACE = /\s/;
const markedSample = computed(() =>
  Array.from(props.sample).map(ch => WHITESPACE.test(ch) ? ch : ch + AI_MARK).join(''),
);

// The base family names never change. The "P+" suffix is always
// rendered and only hidden when P+ is off, so the readout keeps its width and
// nothing shifts when the switch flips.
const families = { headings: 'Zilla Slab', body: 'Maryheather' };
</script>

<template>
  <ProvenancePanel :label="label">
    <p class="text-sm text-midnight-600 dark:text-midnight-400">
      Headings: <span class="font-brand text-midnight-900 dark:text-midnight-100">{{ families.headings }} <span :class="{ invisible: !enabled }">P+</span></span>
      &middot;
      Body: <span class="text-midnight-900 dark:text-midnight-100">{{ families.body }} <span :class="{ invisible: !enabled }">P+</span></span>
    </p>

    <dl class="grid gap-x-4 gap-y-2 sm:grid-cols-[auto_1fr]">
      <dt class="text-sm text-midnight-600 dark:text-midnight-400">
        Default (assumed human)
      </dt>
      <dd class="text-lg">
        {{ sample }}
      </dd>
      <dt class="text-sm text-midnight-600 dark:text-midnight-400">
        Marked AI-generated
      </dt>
      <dd class="text-lg">
        {{ markedSample }}
      </dd>
    </dl>

    <div v-if="$slots.default" class="border-t border-midnight-200 pt-3 dark:border-midnight-700">
      <slot />
    </div>

    <p class="text-xs text-midnight-500 dark:text-midnight-400">
      The marked line carries U+E0101 after each character. With P+ off, the same
      characters render in the plain face and the marks are invisible.
    </p>
  </ProvenancePanel>
</template>
