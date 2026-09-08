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

Some of the text on this blog is written with help from an AI assistant. Rather than putting a disclaimer at the top of a post, we're trying something at the glyph level: the webfonts on this site are now "P+" provenance builds. When a character is followed by the Unicode variation selector U+E0101, the font draws a mark under it. Text without the selector looks exactly as it always has.

The idea comes from a [Nerd Fonts experiment](https://github.com/delano/nerd-fonts/issues/10). The fonts carry a format 14 cmap subtable that maps three selectors (U+E0100, U+E0101, U+E0102) for the printable characters, and the explicit-style build renders U+E0101 as a visible bar. The selector is an ordinary code point, so it survives copy and paste, search, and screen readers ignore it.

## Try it

The switch below swaps every font on the page. Headings use Zilla Slab and body text uses Maryheather, which is Merriweather renamed because "Merriweather" is a reserved font name under the Open Font License. The two lines in the panel are the same sentence, once bare and once with U+E0101 after each character.

::ProvenanceToggle{sample="Secrets are for sharing, once."}
T󠄁h󠄁i󠄁s󠄁 p󠄁a󠄁r󠄁a󠄁g󠄁r󠄁a󠄁p󠄁h󠄁 w󠄁a󠄁s󠄁 d󠄁r󠄁a󠄁f󠄁t󠄁e󠄁d󠄁 b󠄁y󠄁 a󠄁n󠄁 A󠄁I󠄁 a󠄁s󠄁s󠄁i󠄁s󠄁t󠄁a󠄁n󠄁t󠄁 a󠄁n󠄁d󠄁 l󠄁e󠄁f󠄁t󠄁 a󠄁s󠄁 w󠄁r󠄁i󠄁t󠄁t󠄁e󠄁n󠄁.󠄁 E󠄁v󠄁e󠄁r󠄁y󠄁 p󠄁r󠄁i󠄁n󠄁t󠄁a󠄁b󠄁l󠄁e󠄁 c󠄁h󠄁a󠄁r󠄁a󠄁c󠄁t󠄁e󠄁r󠄁 i󠄁n󠄁 i󠄁t󠄁 i󠄁s󠄁 f󠄁o󠄁l󠄁l󠄁o󠄁w󠄁e󠄁d󠄁 b󠄁y󠄁 U󠄁+󠄁E󠄁0󠄁1󠄁0󠄁1󠄁,󠄁 s󠄁o󠄁 w󠄁i󠄁t󠄁h󠄁 t󠄁h󠄁e󠄁 p󠄁r󠄁o󠄁v󠄁e󠄁n󠄁a󠄁n󠄁c󠄁e󠄁 f󠄁o󠄁n󠄁t󠄁s󠄁 o󠄁n󠄁 y󠄁o󠄁u󠄁 s󠄁e󠄁e󠄁 a󠄁 b󠄁a󠄁r󠄁 u󠄁n󠄁d󠄁e󠄁r󠄁 e󠄁a󠄁c󠄁h󠄁 g󠄁l󠄁y󠄁p󠄁h󠄁.󠄁 F󠄁l󠄁i󠄁p󠄁 t󠄁h󠄁e󠄁 s󠄁w󠄁i󠄁t󠄁c󠄁h󠄁 a󠄁b󠄁o󠄁v󠄁e󠄁 a󠄁n󠄁d󠄁 t󠄁h󠄁e󠄁 s󠄁a󠄁m󠄁e󠄁 b󠄁y󠄁t󠄁e󠄁s󠄁 r󠄁e󠄁n󠄁d󠄁e󠄁r󠄁 i󠄁n󠄁 t󠄁h󠄁e󠄁 p󠄁l󠄁a󠄁i󠄁n󠄁 f󠄁a󠄁c󠄁e󠄁 w󠄁i󠄁t󠄁h󠄁 n󠄁o󠄁t󠄁h󠄁i󠄁n󠄁g󠄁 t󠄁o󠄁 s󠄁h󠄁o󠄁w󠄁.󠄁
::

With P+ on, the marked line and the paragraph inside the panel show the bar. With P+ off, the same characters render in the plain faces and the marks disappear. The toggle is client-side only and resets on the next page load.

## Under the hood

The mark is not a style or an annotation layered on top of the text. It is a code point sitting in the string after each character. The word below is five characters on screen and ten code points in the file, and that stays true whichever way the switch is set. Only the font's opinion about U+E0101 changes.

::ProvenanceInspector{sample="once."}
::

## Why bother

A footnote saying "AI helped write this" tells you nothing about which sentences. A mark carried in the text itself travels with the words, down to the character, and doesn't depend on anyone remembering to add a note. It also degrades cleanly: on a device without these fonts, the selector is invisible and the text reads normally.

We haven't decided how widely to use this. For now it's a working demo, and the fonts are self-hosted so nothing is fetched from a third party. If you're curious about the build, the [blog repository](https://github.com/onetimesecret/blog.onetimesecret.com) has the script that subsets the patched fonts into the WOFF2 files the site serves.
