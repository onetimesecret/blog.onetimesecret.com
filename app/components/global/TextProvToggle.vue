<script setup lang="ts">
/**
 * Reader switch on enrolled posts. With `textprov: true` the post page shows
 * it in the header; with `textprov: inline` the post places it in the body as
 * a `::TextProvToggle` block (hence app/components/global/). The build has already wrapped
 * each AI-written run in <span class="textprov-ai"> (scripts/textprov.js);
 * the switch only decides whether provenance.css paints those spans, through
 * data-textprov on the document root. Like the docs site's toggle, the choice
 * is one preference for the whole site, saved in this browser.
 *
 * The inline head script applies a saved choice before first paint. After
 * that the attribute is written directly rather than through useHead, which
 * would reset it to the prerendered value on hydration and flash.
 */
import '~/assets/css/provenance.css';

const KEY = 'blog:textprov';

useHead({
  script: [{
    key: 'textprov-preference',
    tagPosition: 'head',
    innerHTML: `try{document.documentElement.dataset.textprov=localStorage.getItem('${KEY}')==='shown'?'shown':'hidden'}catch(e){document.documentElement.dataset.textprov='hidden'}`,
  }],
});

// Nuxt UI paints the unchecked track with --ui-bg-accented and the thumb with
// --ui-bg; with the midnight neutral those are two near-black blues in dark
// mode, so the switch disappears. Fixed track and thumb colours keep the
// control above 3:1 against the page and the thumb above 3:1 against the
// track in both modes and both states.
const switchUi = {
  base: 'data-[state=unchecked]:bg-midnight-400 dark:data-[state=unchecked]:bg-midnight-300',
  thumb: 'bg-white dark:bg-midnight-950',
  label: 'text-highlighted',
};

const shown = ref(false);

function apply() {
  document.documentElement.dataset.textprov = shown.value ? 'shown' : 'hidden';
}

onMounted(() => {
  try {
    shown.value = localStorage.getItem(KEY) === 'shown';
  }
  catch { /* Private browsing may deny storage. */ }
  apply();
});

function update(value: boolean) {
  shown.value = value;
  apply();
  try {
    localStorage.setItem(KEY, value ? 'shown' : 'hidden');
  }
  catch { /* Keep this page's choice. */ }
}
</script>

<template>
  <div class="not-prose textprov-toggle print:hidden">
    <USwitch
      :model-value="shown"
      :ui="switchUi"
      label="Highlight AI-written text"
      description="Shows the characters recorded as written by AI."
      @update:model-value="update"
    />
  </div>
</template>
