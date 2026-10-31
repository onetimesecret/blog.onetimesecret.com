<script setup lang="ts">
/**
 * The TextProv three-tier watermark (display version v0.3.0-bracket, board 6
 * of the marking mockups). One run of the paragraph carries U+E0101 after
 * each character; the control steps the page through the tiers:
 *
 *   latent  a faint bar in the margin beside the paragraph; prose untouched
 *   quiet   the run as ghost text between faint corner seams
 *   loud    tint and glow on the run, seams in full colour; no bar
 *
 * Usage in markdown:
 *   ::ProvenanceTiers
 *   ::
 *   ::ProvenanceTiers{before="Human text, " marked="machine text" after=", human again."}
 *   ::
 */
interface Props {
  label?: string;
  before?: string;
  marked?: string;
  after?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Display Tiers',
  before: 'We drafted the proposal on Tuesday, and ',
  marked: 'the model filled in the budget section with figures from last quarter',
  after: ', which we then checked against the ledger. Nothing else in this paragraph was touched.',
});

const { tier } = useProvenanceDisplay();

const sample = computed(() => props.before + markAi(props.marked) + props.after);

const notes: Record<ProvenanceTier, string> = {
  latent: 'A faint bar in the margin beside any paragraph that contains a mark. The prose itself is untouched.',
  quiet: 'The marked run set as ghost text between faint corner seams.',
  loud: 'A tint and glow on the run, with the seams in full colour. The bar drops out: the run is already prominent.',
};
</script>

<template>
  <ProvenancePanel :label="label">
    <div class="pl-5">
      <p class="prov-plain-face text-lg leading-relaxed text-midnight-900 dark:text-midnight-100">
        <ProvenanceMarked :text="sample" />
      </p>
    </div>

    <p class="text-xs text-midnight-500 dark:text-midnight-400">
      {{ notes[tier] }} The text and its marks are the same under every tier.
    </p>
  </ProvenancePanel>
</template>
