# Vendored TextProv decoder and stylesheet

`textprov.js` and `textprov.css` are copies of `js/textprov.js` and
`js/textprov.css` from <https://github.com/textprov/textprov>, taken from a
local checkout at commit `9e1fe82` plus the then-uncommitted `v0.3.0-bracket`
candidate (the three-tier watermark) on 2026-10-30. The published npm package
(󠄁l󠄁a󠄁t󠄁e󠄁s󠄁t󠄁 `textprov@0.2.1`)󠄁 does not carry the candidate yet; replace these copies with
the package once a release does.

- `textprov.css` is byte-identical to upstream.
- `textprov.js` carries one patch, marked in the file: the UMD wrapper
  (`(function (global) { ... })(window || this)`) is replaced by
  `const textprov = (function () { ... })(); export default textprov;` so the
  module loads during Nuxt server rendering, where neither `module` nor
  `window` exists. Nothing between the wrapper lines is changed.
- `textprov.d.ts` is hand-written for the parts of the API the site uses.

Used by `app/composables/useProvenanceDisplay.ts` (stylesheet and root
attributes) and `app/components/ProvenanceMarked.vue` (decoder). The site's
palette overrides live in `app/assets/css/provenance.css`.

`scripts/textprov.js` a󠄁l󠄁s󠄁o󠄁 i󠄁m󠄁p󠄁o󠄁r󠄁t󠄁s󠄁 `textprov.js` t󠄁o󠄁 d󠄁e󠄁c󠄁o󠄁d󠄁e󠄁 p󠄁o󠄁s󠄁t󠄁s󠄁 a󠄁t󠄁 b󠄁u󠄁i󠄁l󠄁d󠄁 t󠄁i󠄁m󠄁e󠄁,󠄁
a󠄁n󠄁d󠄁 `scripts/check-content.js` l󠄁o󠄁a󠄁d󠄁s󠄁 t󠄁h󠄁a󠄁t󠄁 s󠄁c󠄁r󠄁i󠄁p󠄁t󠄁.󠄁 I󠄁t󠄁s󠄁 C󠄁I󠄁 j󠄁o󠄁b󠄁 r󠄁u󠄁n󠄁s󠄁 o󠄁n󠄁 p󠄁l󠄁a󠄁i󠄁n󠄁 N󠄁o󠄁d󠄁e󠄁
w󠄁i󠄁t󠄁h󠄁o󠄁u󠄁t󠄁 `pnpm install`,󠄁 s󠄁o󠄁 s󠄁w󠄁i󠄁t󠄁c󠄁h󠄁i󠄁n󠄁g󠄁 t󠄁o󠄁 t󠄁h󠄁e󠄁 p󠄁a󠄁c󠄁k󠄁a󠄁g󠄁e󠄁 m󠄁e󠄁a󠄁n󠄁s󠄁 t󠄁h󠄁a󠄁t󠄁 j󠄁o󠄁b󠄁 h󠄁a󠄁s󠄁 t󠄁o󠄁
i󠄁n󠄁s󠄁t󠄁a󠄁l󠄁l󠄁 i󠄁t󠄁 t󠄁o󠄁o󠄁.󠄁

Licence: Apache-2.0 (see the upstream `js/LICENSE`).
