#!/usr/bin/env bash
#
# Stage the provenance (P+) webfonts used by the blog.
#
# Input:  explicit-provenance Nerd Font builds produced by the delano/nerd-fonts
#         fork (see https://github.com/delano/nerd-fonts/issues/10). The fork
#         commits them under patched-fonts/{zilla,maryheather}/patched/, so run
#           FONT_SRC=/path/to/nerd-fonts/patched-fonts scripts/build-fonts.sh
#         The default FONT_SRC of temp/ expects the same layout:
#         temp/zilla/patched/ZillaSlabNerdFontPropoP+-*.ttf and
#         temp/maryheather/patched/MaryheatherNerdFontPropoP+-*.ttf.
#         The ai mark (U+E0101) is a sawtooth; the unknown mark (U+E0102) is a bar.
#
# Merriweather declares "Merriweather" as an OFL Reserved Font Name, so the
# patcher renames the generated family to Maryheather via the fork's SIL table,
# the same mechanism upstream uses for Source Code Pro -> SauceCodePro. The
# upstream copyright (name ID 0) and trademark notice (ID 7) are retained as
# OFL clause 2 requires; only the font's own name identity changes.
# Output: subset WOFF2 files under app/assets/css/fonts/, referenced by
#         app/assets/css/font.css.
#
# The plain (non-P+) Maryheather build is staged as well, from
# temp/maryheather/patched/MaryheatherNerdFontPropo-*.ttf. It backs the
# "provenance off" state of the ProvenanceToggle content component, so readers
# can compare the same typeface with and without the marks. Zilla Slab's plain
# faces already ship in fonts/zs/.
#
# The patcher's --complete build adds ~10k icon glyphs (about 1 MB per face).
# The blog only needs the text glyphs plus the provenance machinery, so each
# face is subset to:
#   0000-DFFF        every non-PUA BMP code point the source font covers
#   E0100-E01EF      variation selectors (VS17..VS256; the P+ marks use VS17-19)
#   F900-FFFF        remaining BMP code points after the PUA block
#   10000-EFFFF      supplementary planes 1-14 (no Nerd Font icons live here)
#   100000-1000FF    Supplementary PUA-B: the PUA provenance encoding
# which drops the E000-F8FF and F0000-FFFFF icon blocks. The format 14 cmap
# subtable (selector -> .human/.ai/.unknown glyphs) survives because the base
# code points are retained. All OpenType layout features and name records are
# kept.
#
# Requires: pyftsubset (fonttools + brotli), unzip.
# Validate afterwards with the fork's validator, e.g.
#   woff2_decompress <face>.woff2   # into a scratch dir
#   python3 bin/scripts/test-provenance.py <face>.ttf
#   hb-shape <face>.ttf -u 0041,E0101   # expect A.ai / uni0041.ai

set -euo pipefail

ROOT=$(cd "$(dirname "$0")/.." && pwd)
SRC=${FONT_SRC:-$ROOT/temp}
OUT=${FONT_OUT:-$ROOT/app/assets/css/fonts}
UNICODES='0000-DFFF,E0100-E01EF,F900-FFFF,10000-EFFFF,100000-1000FF'

command -v pyftsubset >/dev/null || { echo "pyftsubset not found (pip install fonttools brotli)" >&2; exit 1; }

subset() {
  local in=$1 out=$2
  [ -f "$in" ] || { echo "missing input: $in" >&2; exit 1; }
  pyftsubset "$in" \
    --unicodes="$UNICODES" \
    --layout-features='*' \
    --name-IDs='*' \
    --notdef-outline \
    --glyph-names \
    --drop-tables+=PfEd \
    --flavor=woff2 \
    --output-file="$out"
  printf '%8d  %s\n' "$(stat -f %z "$out")" "${out#"$ROOT"/}"
}

# Four faces per family: 400/700 x normal/italic.
FACES=(Regular Italic Bold BoldItalic)

mkdir -p "$OUT/zilla-slab-provenance" "$OUT/maryheather-provenance" "$OUT/maryheather"

for face in "${FACES[@]}"; do
  subset "$SRC/zilla/patched/ZillaSlabNerdFontPropoP+-$face.ttf" \
         "$OUT/zilla-slab-provenance/ZillaSlabNerdFontPropoP+-$face.woff2"
done

for face in "${FACES[@]}"; do
  subset "$SRC/maryheather/patched/MaryheatherNerdFontPropoP+-$face.ttf" \
         "$OUT/maryheather-provenance/MaryheatherNerdFontPropoP+-$face.woff2"
done

for face in "${FACES[@]}"; do
  subset "$SRC/maryheather/patched/MaryheatherNerdFontPropo-$face.ttf" \
         "$OUT/maryheather/MaryheatherNerdFontPropo-$face.woff2"
done

# Upstream licence texts ship beside the derived fonts (OFL 1.1 clause 2).
if [ -f "$SRC/zilla/zilla.zip" ]; then
  unzip -p "$SRC/zilla/zilla.zip" 'zilla-slab/LICENSE' > "$OUT/zilla-slab-provenance/LICENSE"
fi
if [ -f "$SRC/maryheather/merriweather.zip" ]; then
  unzip -p "$SRC/maryheather/merriweather.zip" 'Merriweather-1.582/OFL.txt' > "$OUT/maryheather-provenance/OFL.txt"
  unzip -p "$SRC/maryheather/merriweather.zip" 'Merriweather-1.582/OFL.txt' > "$OUT/maryheather/OFL.txt"
fi
