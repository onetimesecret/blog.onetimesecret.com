<script setup lang="ts">
/**
 * The under-the-hood companion to ProvenanceToggle. Shows a short marked
 * string as it renders, then the code points it is actually made of, so a
 * reader can see that the marks are in the text whether or not the font
 * draws them.
 *
 * Usage in markdown:
 *   ::ProvenanceInspector{sample="once."}
 *   ::
 */
interface Props {
  label?: string;
  sample?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: 'With Provenance',
  sample: 'once.',
});

const { enabled } = useProvenanceFonts();

const AI_MARK = '\u{E0101}';
const WHITESPACE = /\s/;

interface Unit {
  key: number;
  glyph: string;
  codePoint: string;
  mark: boolean;
}

function hex(ch: string) {
  return `U+${ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`;
}

// One entry per code point, in string order: each printable character is
// followed by the mark, whitespace is passed through bare.
const units = computed<Unit[]>(() => {
  const out: Unit[] = [];
  for (const ch of Array.from(props.sample)) {
    const space = WHITESPACE.test(ch);
    out.push({ key: out.length, glyph: space ? '␣' : ch, codePoint: hex(ch), mark: false });
    if (!space)
      out.push({ key: out.length, glyph: '', codePoint: hex(AI_MARK), mark: true });
  }
  return out;
});

const markedSample = computed(() =>
  Array.from(props.sample).map(ch => WHITESPACE.test(ch) ? ch : ch + AI_MARK).join(''),
);

const encoder = new TextEncoder();
const stats = computed(() => ({
  visible: Array.from(props.sample).length,
  marks: units.value.filter(u => u.mark).length,
  codePoints: units.value.length,
  bytes: encoder.encode(markedSample.value).length,
}));
</script>

<template>
  <ProvenancePanel :label="label">
    <dl class="grid gap-x-4 gap-y-3 sm:grid-cols-[auto_1fr]">
      <dt class="text-sm text-midnight-600 dark:text-midnight-400">
        Rendered
      </dt>
      <dd class="text-2xl">
        {{ markedSample }}
      </dd>

      <dt class="text-sm text-midnight-600 dark:text-midnight-400">
        Code points
      </dt>
      <dd>
        <ol class="flex flex-wrap gap-1.5 font-mono text-xs">
          <li
            v-for="u in units"
            :key="u.key"
            class="flex min-w-[4.5rem] flex-col items-center rounded border px-1.5 py-1 leading-tight"
            :class="u.mark
              ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
              : 'border-midnight-200 bg-white text-midnight-900 dark:border-midnight-600 dark:bg-midnight-900 dark:text-midnight-100'"
          >
            <span class="font-serif text-base" :class="{ 'opacity-0': u.mark }">{{ u.mark ? '·' : u.glyph }}</span>
            <span>{{ u.codePoint }}</span>
          </li>
        </ol>
      </dd>

      <dt class="text-sm text-midnight-600 dark:text-midnight-400">
        Size
      </dt>
      <dd class="text-sm">
        {{ stats.visible }} characters on screen &middot;
        {{ stats.marks }} marks &middot;
        {{ stats.codePoints }} code points &middot;
        {{ stats.bytes }} bytes in UTF-8
      </dd>
    </dl>

    <p class="text-xs text-midnight-500 dark:text-midnight-400">
      <template v-if="enabled">
        The highlighted code points are what the font draws the bar for. They are part of
        the string, so they come along with a copy and paste.
      </template>
      <template v-else>
        The highlighted code points are still in the string. With P+ off, the plain face
        has no glyph for them and they take up no space.
      </template>
    </p>
  </ProvenancePanel>
</template>
