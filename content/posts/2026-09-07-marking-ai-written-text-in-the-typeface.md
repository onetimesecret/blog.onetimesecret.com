---
layout: post
title: "Marking AI-written text in the typeface itself"
date: 2026-09-07
authors:
  - name: Delano
    to: https://blog.onetimesecret.com/about
    avatar:
      src: /img/portrait-profile-pic-delano-2025-m.png
image:
  src: /img/blog/2026/20260907-provenance-sawtooth.svg
badge:
  label: Experiments
readingTime: 4
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

## What's next?

The fonts are the easy half. They only show marks that are already in the text, and today the only way to put marks in is to run `nfprov.py` over a paragraph after the fact. That is a footnote with extra steps. What I want is for the marks to come out of the drafting process, from the tool that inserted the text, at the moment it inserted it.

For this blog that tool is Claude Code, so the next piece is a hook for it ([#15](https://github.com/delano/nerd-fonts/issues/15)). Before an edit it snapshots the prose files in the repo, after the edit it snapshots again, and only the span that changed in each line gets the selector. Edits I make between tool calls stay unmarked, and edits the agent makes through a shell command are caught the same as edits through its editor tools. When a line is ambiguous the rule is to over-mark. The failure this exists to prevent is AI text passing as mine, not the reverse.

After that, the same thin hook for Cursor, Codex CLI and Gemini CLI, an MCP server so any agent can mark or audit text on request, and a producer handbook that pins down the rules a marker has to follow ([#16](https://github.com/delano/nerd-fonts/issues/16)). The code points are already documented as never reassigned; that issue turns it into a written stability commitment for the whole encoding, so text marked today keeps meaning the same thing.

What is not on the list is anything that needs an editor to cooperate. Selectors in the string need none, which is why they are the vehicle for now. They have a real cost, though: the agent that wrote a sentence cannot see the marks, so its next attempt to edit that sentence fails to match. That is tolerable for blog posts and wrong for code, and it is why the marks stay out of source files. Rendering in Safari, Terminal.app and Zed is out of my hands entirely until CoreText honours the format 14 cmap subtable.

None of this is decided beyond the first hook. It is a weekend prototype with a release tag, and if you install the fonts and something breaks, an issue on the fork is the right place for it.


## Install it on your machine

The same fonts are packaged as desktop TTFs, one ZIP per family, on the [provenance-v0.1.0 release](https://github.com/delano/nerd-fonts/releases/tag/provenance-v0.1.0) of the fork. Each ZIP has the Regular, Italic, Bold and Bold Italic faces, the upstream Open Font License text, and a README that records the commit the fonts were built from. The website keeps using subset WOFF2 files; WOFF2 is a delivery format for browsers, not something you install.

1. Download [zilla-slab-provenance-p-plus.zip](https://github.com/delano/nerd-fonts/releases/download/provenance-v0.1.0/zilla-slab-provenance-p-plus.zip) or [maryheather-provenance-p-plus.zip](https://github.com/delano/nerd-fonts/releases/download/provenance-v0.1.0/maryheather-provenance-p-plus.zip) and install the TTFs the usual way: double-click on macOS, right-click and Install on Windows, or copy them into `~/.local/share/fonts` and run `fc-cache -f` on Linux.
2. Open an editor and set its font to `Maryheather Nerd Font Propo P+` or `ZillaSlab Nerd Font Propo P+`. VS Code works; see the caveat below about which apps do not.
3. Copy the marked paragraph from the panel above and paste it in. The selectors survive the clipboard, so the sawtooth appears wherever the P+ font is active and vanishes wherever it is not.

To mark your own text, the fork's `nfprov.py` needs only Python 3. It puts `U+E0101` after every printable character and leaves whitespace alone:

```bash
echo "Secrets are for sharing, once." | python3 bin/scripts/nfprov.py mark --ai -
```

The same script has `inspect`, which counts the states in a file, and `strip`, which removes the marks.

One caveat. The marks depend on the text renderer honouring the font's format 14 cmap table. HarfBuzz does, so Chrome, Firefox, VS Code and most Linux applications show them. CoreText does not yet, so Safari, Terminal.app, Zed and other apps that shape with CoreText render the same text plain, with no boxes and no extra spacing. `nfprov.py` has a display-only PUA encoding (`--mode=pua`) that CoreText does render, but it shows up as missing-glyph boxes in any other font, so keep it out of text you share. Windows DirectWrite is untested.


---

::CollapsibleContent{summary="About this post"}

**The image** was created by Claude. The brief was the post itself: a letter whose shadow is the sawtooth, a marked "once." next to a plain one, and the P+ stamp. The glowing conveyor of teeth along the bottom is Claude's idea of the marks travelling with the words.

::
