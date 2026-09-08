---
layout: post
title: "Marking AI-written text in the typeface itself"
date: 2026-09-07
authors:
  - name: Delano
    to: https://blog.onetimesecret.com/about
    avatar:
      src: /img/portrait-profile-pic-delano-2025-m.png
badge:
  label: Experiments
readingTime: 3
description: "The blog now ships provenance (P+) builds of its webfonts. A toggle in this post lets you compare them with the plain faces."
---

Much of this blog's recent text begins with an AI assistant. I edit the output manually, but I am still uneasy about publishing prose whose first draft came from a machine. With processed food, the trade-off is more obvious: when I choose a can of Pringles, I know what I am choosing. With text, it is less clear.

I have tried to be transparent from the start: the main [`onetimesecret` README](https://github.com/onetimesecret/onetimesecret) has an AI notice, and this blog calls out AI use in relevant posts and its AI-generated SVGs. But disclosure alone does not record which text came from whom. I wanted a way to track my contributions and an AI's contributions *while writing*.

Over the weekend, I built a prototype inspired by [Nerd Fonts](https://www.nerdfonts.com/) and its tooling. It encodes a provenance marker in the text string, then uses a custom font to make that marker visible at the glyph level. The marker can accompany copied text when the receiving application preserves variation selectors; it is not guaranteed to survive every editor, sanitizer, or copy-and-paste path.

The implementation is documented in my [experimental Nerd Fonts fork](https://github.com/delano/nerd-fonts/issues/10), so I will focus on how it works in practice. This is a prototype. I do not know whether it will be useful beyond this blog and my local environment, but it may be useful to others experimenting with authorship disclosure.

This site now uses provenance-enabled variants of its two text faces, identified by the `P+` suffix. The suffix is short because the build tooling limits the generated font family name to 32 characters.

## Try it

The switch below changes the site's heading and body faces between their provenance-enabled and plain variants. Headings use Zilla Slab; body text uses Maryheather, a modified and renamed Merriweather. `Merriweather` is a Reserved Font Name under the SIL Open Font License, so a modified version needs a different primary family name unless its copyright holder gives permission.

The panel shows the same sentence twice: once unmarked, and once with `U+E0101` after each non-whitespace character. `U+E0101` is Variation Selector-18. In the P+ font, the character-plus-selector sequence chooses a visibly marked glyph.

::ProvenanceToggle{sample="Secrets are for sharing, once."}
T󠄁h󠄁i󠄁s󠄁 p󠄁a󠄁r󠄁a󠄁g󠄁r󠄁a󠄁p󠄁h󠄁 w󠄁a󠄁s󠄁 d󠄁r󠄁a󠄁f󠄁t󠄁e󠄁d󠄁 b󠄁y󠄁 a󠄁n󠄁 A󠄁I󠄁 a󠄁s󠄁s󠄁i󠄁s󠄁t󠄁a󠄁n󠄁t󠄁 a󠄁n󠄁d󠄁 l󠄁e󠄁f󠄁t󠄁 u󠄁n󠄁c󠄁h󠄁a󠄁n󠄁g󠄁e󠄁d󠄁.󠄁 E󠄁a󠄁c󠄁h󠄁 p󠄁r󠄁i󠄁n󠄁t󠄁a󠄁b󠄁l󠄁e󠄁 c󠄁h󠄁a󠄁r󠄁a󠄁c󠄁t󠄁e󠄁r󠄁 i󠄁s󠄁 f󠄁o󠄁l󠄁l󠄁o󠄁w󠄁e󠄁d󠄁 b󠄁y󠄁 `U󠄁+󠄁E󠄁0󠄁1󠄁0󠄁1󠄁`.󠄁 W󠄁i󠄁t󠄁h󠄁 a󠄁 p󠄁r󠄁o󠄁v󠄁e󠄁n󠄁a󠄁n󠄁c󠄁e󠄁-󠄁a󠄁w󠄁a󠄁r󠄁e󠄁 f󠄁o󠄁n󠄁t󠄁 e󠄁n󠄁a󠄁b󠄁l󠄁e󠄁d󠄁,󠄁 a󠄁 s󠄁a󠄁w󠄁t󠄁o󠄁o󠄁t󠄁h󠄁 a󠄁p󠄁p󠄁e󠄁a󠄁r󠄁s󠄁 b󠄁e󠄁n󠄁e󠄁a󠄁t󠄁h󠄁 e󠄁a󠄁c󠄁h󠄁 g󠄁l󠄁y󠄁p󠄁h󠄁.󠄁 T󠄁u󠄁r󠄁n󠄁 o󠄁f󠄁f󠄁 t󠄁h󠄁e󠄁 s󠄁w󠄁i󠄁t󠄁c󠄁h󠄁 a󠄁b󠄁o󠄁v󠄁e󠄁 t󠄁o󠄁 r󠄁e󠄁n󠄁d󠄁e󠄁r󠄁 t󠄁h󠄁e󠄁 s󠄁a󠄁m󠄁e󠄁 b󠄁y󠄁t󠄁e󠄁s󠄁 i󠄁n󠄁 a󠄁 p󠄁l󠄁a󠄁i󠄁n󠄁 f󠄁o󠄁n󠄁t󠄁,󠄁 w󠄁h󠄁e󠄁r󠄁e󠄁 t󠄁h󠄁e󠄁 m󠄁a󠄁r󠄁k󠄁e󠄁r󠄁s󠄁 a󠄁r󠄁e󠄁 i󠄁n󠄁v󠄁i󠄁s󠄁i󠄁b󠄁l󠄁e󠄁.󠄁
::

With Provenance on, the marked line and the paragraph inside the panel show a sawtooth. With P+ off, the text's byte sequence is unchanged, but the plain faces do not draw the selector, so the text appears unmarked. The toggle is client-side only and resets on the next page load.

## Under the hood

The mark is not a CSS style or an annotation layered over the text. It is a code point in the string, immediately after the character it marks. Together, that character and `U+E0101` form a variation sequence. Below is the same word twice: once as typed, and once with the marker after every non-whitespace character. The switch never changes either string; it changes whether the selected font recognizes the sequence and renders the marked glyph.

::ProvenanceInspector{sample="once."}
::

## Why bother

A footnote saying "AI helped write this" does not say which sentences were affected. A marker carried in the text can make that distinction down to the character, without depending on someone remembering to add a note. It degrades cleanly: a font without these variation sequences normally ignores the selector and renders the ordinary text.

This is an authorship aid, not cryptographic proof of origin and not a reliable detector of AI-written text. The marker can be added, removed, or stripped by software. Its value is that it lets an author make a more specific disclosure in text they control.

I have not decided how widely to use it. For now, it is a working demo. The fonts are self-hosted, so readers' browsers do not fetch font files from a third party. If you are curious about the build, the [blog repository](https://github.com/onetimesecret/blog.onetimesecret.com) includes the script that subsets the patched fonts into the WOFF2 files the site serves.
