<script setup lang="ts">
/**
 * Lets a reader switch the page between the provenance (P+) fonts and the
 * plain faces of the same typefaces. Text carrying the AI-generated mark
 * (U+E0101 after each character) shows a bar only while P+ is on.
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
  label: 'Provenance fonts',
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

const families = computed(() => enabled.value
  ? { headings: 'Zilla Slab Provenance', body: 'Maryheather Provenance' }
  : { headings: 'Zilla Slab', body: 'Maryheather' },
);
</script>

<template>
  <div class="not-prose my-8 rounded-lg border border-midnight-200 bg-midnight-50 shadow-sm dark:border-midnight-700 dark:bg-midnight-800/50">
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-midnight-200 px-4 py-3 dark:border-midnight-700">
      <div class="font-brand text-lg font-medium text-midnight-900 dark:text-midnight-100">
        {{ label }}
      </div>
      <USwitch
        v-model="enabled"
        :label="enabled ? 'P+ on' : 'P+ off'"
        color="primary"
        size="lg"
      />
    </div>

    <div class="space-y-3 px-4 py-4 text-base text-midnight-800 dark:text-midnight-200">
      <p class="text-sm text-midnight-600 dark:text-midnight-400">
        Headings: <span class="font-brand text-midnight-900 dark:text-midnight-100">{{ families.headings }}</span>
        &middot;
        Body: <span class="text-midnight-900 dark:text-midnight-100">{{ families.body }}</span>
      </p>

      <dl class="grid gap-x-4 gap-y-2 sm:grid-cols-[auto_1fr]">
        <dt class="text-sm text-midnight-600 dark:text-midnight-400">
          Unmarked
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
    </div>
  </div>
</template>
