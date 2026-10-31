# Vendored TextProv decoder and stylesheet

`textprov.js` and `textprov.css` are copies of `js/textprov.js` and
`js/textprov.css` from <https://github.com/textprov/textprov>, taken from a
local checkout at commit `9e1fe82` plus the then-uncommitted `v0.3.0-bracket`
candidate (the three-tier watermark) on 2026-10-30. The published npm package
(`textprov@0.3.0`) does not carry the candidate yet; replace these copies with
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

Licence: Apache-2.0 (see the upstream `js/LICENSE`).
