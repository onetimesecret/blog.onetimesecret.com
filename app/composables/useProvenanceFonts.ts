/**
 * Reader-controlled switch between the provenance (P+) webfonts and their
 * plain counterparts. The state lives in Nuxt's shared state so every
 * ProvenanceToggle on the page (and across client-side navigation) agrees;
 * the CSS side is `html[data-provenance='off']` in app/assets/css/main.css.
 */
const ATTR = 'data-provenance';

function apply(enabled: boolean) {
  if (!import.meta.client)
    return;
  const root = document.documentElement;
  if (enabled)
    root.removeAttribute(ATTR);
  else
    root.setAttribute(ATTR, 'off');
}

export function useProvenanceFonts() {
  const state = useState<boolean>('provenance-fonts', () => true);

  const enabled = computed<boolean>({
    get: () => state.value,
    set: (value) => {
      state.value = value;
      apply(value);
    },
  });

  // Re-sync the attribute after hydration and after client-side navigation.
  onMounted(() => apply(state.value));

  return { enabled };
}
