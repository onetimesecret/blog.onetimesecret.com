<script setup lang="ts">
/**
 * The under-the-hood companion to ProvenanceTiers. Puts the same word side
 * by side, once as typed and once with the AI-generated mark after each
 * character, and shows what is actually in each string. The tier control
 * never changes the code points; it only changes how the stylesheet paints
 * the span the decoder wraps around the marked run.
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
  label: 'In the string',
  sample: 'once.',
});

const { tier } = useProvenanceDisplay();

const WHITESPACE = /\s/;

interface Unit {
  key: number;
  glyph: string;
  codePoint: string;
  mark: string | null;
}

function hex(ch: string) {
  return `U+${ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`;
}

// One chip per visible character. A mark that follows it is attached to the
// same chip, so the two columns line up one-to-one.
function toUnits(text: string): Unit[] {
  const out: Unit[] = [];
  for (const ch of Array.from(text)) {
    if (ch === AI_MARK && out.length > 0) {
      out.at(-1).mark = hex(ch);
      continue;
    }
    out.push({ key: out.length, glyph: WHITESPACE.test(ch) ? '␣' : ch, codePoint: hex(ch), mark: null });
  }
  return out;
}

const markedSample = computed(() => markAi(props.sample));

const encoder = new TextEncoder();

interface Column {
  heading: string;
  text: string;
  units: Unit[];
  codePoints: number;
  bytes: number;
  marks: number;
}

function toColumn(heading: string, text: string): Column {
  const units = toUnits(text);
  return {
    heading,
    text,
    units,
    codePoints: Array.from(text).length,
    bytes: encoder.encode(text).length,
    marks: units.filter(u => u.mark).length,
  };
}

const columns = computed<Column[]>(() => [
  toColumn('Default (assumed human)', props.sample),
  toColumn('Marked AI-generated', markedSample.value),
]);

const paints: Record<ProvenanceTier, string> = {
  latent: 'a bar in the margin',
  quiet: 'ghost text with corner seams',
  loud: 'a tint, a glow and corner seams',
};

function painted(col: Column) {
  if (col.marks === 0)
    return 'nothing extra';
  return paints[tier.value];
}
</script>

<template>
  <ProvenancePanel :label="label">
    <div class="grid grid-cols-2 gap-x-4 gap-y-1">
      <div
        v-for="col in columns"
        :key="col.heading"
        class="text-sm font-medium text-midnight-700 dark:text-midnight-300"
      >
        {{ col.heading }}
      </div>

      <div class="col-span-2 mt-2 text-xs uppercase tracking-wide text-midnight-500 dark:text-midnight-400">
        Rendered
      </div>
      <div v-for="col in columns" :key="col.heading" class="pl-5">
        <p class="prov-plain-face text-2xl text-midnight-900 dark:text-midnight-100">
          <ProvenanceMarked :text="col.text" />
        </p>
      </div>

      <div class="col-span-2 mt-2 text-xs uppercase tracking-wide text-midnight-500 dark:text-midnight-400">
        In the string
      </div>
      <div v-for="col in columns" :key="col.heading">
        <ol class="flex flex-wrap items-start gap-1 font-mono text-[10px]">
          <li
            v-for="u in col.units"
            :key="u.key"
            class="flex min-w-[2.75rem] flex-col items-stretch overflow-hidden rounded border border-midnight-200 bg-white text-center text-midnight-900 dark:border-midnight-600 dark:bg-midnight-900 dark:text-midnight-100"
          >
            <span class="font-serif text-base leading-tight">{{ u.glyph }}</span>
            <span class="px-1 pb-0.5 leading-tight">{{ u.codePoint }}</span>
            <span
              v-if="u.mark"
              class="border-t border-brand-300 bg-brand-50 px-1 py-0.5 leading-tight text-brand-700 dark:border-brand-700 dark:bg-brand-950/50 dark:text-brand-300"
            >{{ u.mark }}</span>
          </li>
        </ol>
        <p class="mt-1.5 text-xs text-midnight-600 dark:text-midnight-400">
          {{ col.codePoints }} code points &middot; {{ col.bytes }} bytes
        </p>
      </div>

      <div class="col-span-2 mt-2 text-xs uppercase tracking-wide text-midnight-500 dark:text-midnight-400">
        Stylesheet paints
      </div>
      <div
        v-for="col in columns"
        :key="col.heading"
        class="text-sm"
        :class="col.marks > 0 ? 'text-brand-700 dark:text-brand-300' : 'text-midnight-700 dark:text-midnight-300'"
      >
        {{ painted(col) }}
      </div>
    </div>

    <p class="text-xs text-midnight-500 dark:text-midnight-400">
      The control changes nothing in either string. The decoder wraps the run that
      carries U+E0101 in a span, and the stylesheet paints that span for the
      selected tier. The plain string has no span to paint.
    </p>
  </ProvenancePanel>
</template>
