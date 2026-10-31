<script setup lang="ts">
/**
 * Reader switch on posts with `textprov: true`. The build has already wrapped
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
  <USwitch
    :model-value="shown"
    class="textprov-toggle print:hidden"
    label="Highlight AI-written text"
    description="Shows the characters recorded as AI-written while this post was drafted. The words stay the same."
    @update:model-value="update"
  />
</template>
