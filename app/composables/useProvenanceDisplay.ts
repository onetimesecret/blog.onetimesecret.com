/**
 * Reader-controlled tier for the TextProv display: the `v0.3.0-bracket`
 * candidate (three-tier watermark) from the vendored stylesheet. The state
 * lives in Nuxt's shared state so every provenance panel on the page agrees;
 * the stylesheet keys on attributes of the document root, which useHead
 * keeps in sync on the server and the client.
 *
 * Marked text is always rendered in exact display (the recorded ranges, not
 * whole passages), which is what the mockup shows.
 */
import '~/vendor/textprov/textprov.css';
import '~/assets/css/provenance.css';

export const PROVENANCE_TIERS = ['latent', 'quiet', 'loud'] as const;
export type ProvenanceTier = typeof PROVENANCE_TIERS[number];
export const PROVENANCE_DISPLAY_VERSION = 'v0.3.0-bracket';

// VS17 (U+E0101) after a character marks it as AI-generated. Whitespace
// cannot carry a mark (a selector after it is inert), so it is left bare.
export const AI_MARK = '\u{E0101}';
const WHITESPACE = /\s/;

export function markAi(text: string) {
  return Array.from(text).map(ch => WHITESPACE.test(ch) ? ch : ch + AI_MARK).join('');
}

export function useProvenanceDisplay() {
  const tier = useState<ProvenanceTier>('provenance-tier', () => 'latent');

  useHead({
    htmlAttrs: {
      'data-prov-display-version': PROVENANCE_DISPLAY_VERSION,
      'data-prov-display': 'exact',
      'data-prov-tier': tier,
    },
  });

  return { tier, tiers: PROVENANCE_TIERS };
}
