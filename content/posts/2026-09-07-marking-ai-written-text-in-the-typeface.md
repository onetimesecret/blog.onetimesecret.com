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

A lot of the more recent text on this blog was written with the help of an AI assistant. I manually edit the output and still toil away on it b/c it feels crappy to put something out there for people to read when it's been extruded from a machine. It's more obvious with processed food. When I choose a can of Pringles, I know what I'm doing. With text, it's not so clear.

I have been transparent about this from the start with the onetimesecret repo, including an AI notice in the main `README.md`. I'm transparent here with the god-awful AI-generated SVGs and notes in posts where AI was used. But more than transparency, I want to keep track of what I wrote and what an AI wrote *during the process of writing it*. So over the weekend I got to hacking something together: a simple provenance marker in the typeface itself, heavily inspired by [Nerd Fonts](https://www.nerdfonts.com/) and built with its tooling. The idea is to mark the text at the glyph level, so it can travel with the words when copied and pasted, rather than relying on someone to keep track.

All of the work behind it is documented in my [Nerd Fonts experimental fork](https://github.com/delano/nerd-fonts/issues/10), so I'll stick to the practical side of things here. This is a prototype, and I don't know if it will ever be used outside of this blog and my local environment. But I wanted to share it because it might be useful to others.

The fonts on this site are now Nerd Fonts provenance builds, indicated by "P+" (there's a 32-character limit, so I had to keep it short).

## Try it

The switch below swaps the page between the P+ and plain versions of its fonts. Headings use Zilla Slab and body text uses Maryheather, which is Merriweather renamed because "Merriweather" is a reserved font name under the Open Font License. The two lines in the panel are the same sentence, once bare and once with U+E0101 after each printable character.

::ProvenanceToggle{sample="Secrets are for sharing, once."}
T󠄁h󠄁i󠄁s󠄁 p󠄁a󠄁r󠄁a󠄁g󠄁r󠄁a󠄁p󠄁h󠄁 w󠄁a󠄁s󠄁 d󠄁r󠄁a󠄁f󠄁t󠄁e󠄁d󠄁 b󠄁y󠄁 a󠄁n󠄁 A󠄁I󠄁 a󠄁s󠄁s󠄁i󠄁s󠄁t󠄁a󠄁n󠄁t󠄁 a󠄁n󠄁d󠄁 l󠄁e󠄁f󠄁t󠄁 u󠄁n󠄁c󠄁h󠄁a󠄁n󠄁g󠄁e󠄁d󠄁.󠄁 E󠄁a󠄁c󠄁h󠄁 p󠄁r󠄁i󠄁n󠄁t󠄁a󠄁b󠄁l󠄁e󠄁 c󠄁h󠄁a󠄁r󠄁a󠄁c󠄁t󠄁e󠄁r󠄁 i󠄁s󠄁 f󠄁o󠄁l󠄁l󠄁o󠄁w󠄁e󠄁d󠄁 b󠄁y󠄁 `U󠄁+󠄁E󠄁0󠄁1󠄁0󠄁1󠄁`.󠄁 W󠄁i󠄁t󠄁h󠄁 a󠄁 p󠄁r󠄁o󠄁v󠄁e󠄁n󠄁a󠄁n󠄁c󠄁e󠄁-󠄁a󠄁w󠄁a󠄁r󠄁e󠄁 f󠄁o󠄁n󠄁t󠄁 e󠄁n󠄁a󠄁b󠄁l󠄁e󠄁d󠄁,󠄁 a󠄁 s󠄁a󠄁w󠄁t󠄁o󠄁o󠄁t󠄁h󠄁 a󠄁p󠄁p󠄁e󠄁a󠄁r󠄁s󠄁 b󠄁e󠄁n󠄁e󠄁a󠄁t󠄁h󠄁 e󠄁a󠄁c󠄁h󠄁 g󠄁l󠄁y󠄁p󠄁h󠄁.󠄁 T󠄁u󠄁r󠄁n󠄁 o󠄁f󠄁f󠄁 t󠄁h󠄁e󠄁 s󠄁w󠄁i󠄁t󠄁c󠄁h󠄁 a󠄁b󠄁o󠄁v󠄁e󠄁 t󠄁o󠄁 r󠄁e󠄁n󠄁d󠄁e󠄁r󠄁 t󠄁h󠄁e󠄁 s󠄁a󠄁m󠄁e󠄁 b󠄁y󠄁t󠄁e󠄁s󠄁 i󠄁n󠄁 a󠄁 p󠄁l󠄁a󠄁i󠄁n󠄁 f󠄁o󠄁n󠄁t󠄁,󠄁 w󠄁h󠄁e󠄁r󠄁e󠄁 t󠄁h󠄁e󠄁 m󠄁a󠄁r󠄁k󠄁e󠄁r󠄁s󠄁 a󠄁r󠄁e󠄁 i󠄁n󠄁v󠄁i󠄁s󠄁i󠄁b󠄁l󠄁e󠄁.󠄁
::

With Provenance on, the marked line and the paragraph inside the panel show the sawtooth. With Provenance off, the same characters render in the plain faces and the marks disappear. The toggle is client-side only and resets on the next page load.

## Under the hood

The mark is not a style or an annotation layered on top of the text. It is a variation-selector code point in the string after each printable character. Below is the same word twice, once as typed and once with the mark. The switch never changes either string. It only changes whether the font knows to render the U+E0101 selector as a sawtooth.

::ProvenanceInspector{sample="once."}
::

## Why bother

A footnote saying "AI helped write this" tells you nothing about which sentences. A mark carried in the text itself can travel with the words, down to the character, and doesn't depend on anyone remembering to add a note. It also degrades cleanly: in a plain font, the selector takes up no space and the text reads normally.

We haven't decided how widely to use this. For now it's a working demo, and the fonts are self-hosted, so the font files are not fetched from a third party. If you're curious about the build, the [blog repository](https://github.com/onetimesecret/blog.onetimesecret.com) has the script that subsets the patched fonts into the WOFF2 files the site serves.
