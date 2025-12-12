# content/posts/2025-12-12-how-we-handle-translations.md
---
layout: post
title: "How We Handle Translations"
date: 2025-12-12
authors:
  - name: Delano
    to: https://blog.onetimesecret.com/about
    avatar:
      src: /img/portrait-profile-pic-delano-2025-m.png
badge:
  label: Engineering
readingTime: 3
draft: true
---

We support 30+ languages. Here's how we do it without a dedicated localization team.

## High-Value Community Contributions & a cacophony of tools

I don't use a translation management platform. Just git, jq, and a variety of LLN agents. I've tried a few platform tools this year with mixed results. I have a hard time changing my somewhat boroque working process but I enjoyed Lokalise the best. Big shout-out to i18n-a11y [VS Code extensiom](https://github.com/lokalise/i18n-ally). It's the only reason I switch to VS Code from Zed. 

Updates to translations are a combination of contributors submitting PRs against the JSON locale files and me using one or more tools to translate new keys added during development cycles. I work through the PRs and try to capture as much insight from the terms used and choices made. This has been working so far, in part because our UI vocabulary is limited (~1000, not at all optimized strings, lots of overlap).


## Friggin words, how do they work?

**Terminology consistency.** "Secret" translates differently across languages. In Danish, the literal "Hemmeligheder" sounds childish—[@jetdk](https://github.com/jetdk) [chose "Beskeder"](https://github.com/onetimesecret/onetimesecret/pull/956) (messages) instead, explaining that while technically correct, it carries the wrong connotation in everyday use. This insight revealed a pattern we hadn't documented: sometimes the literal translation undermines the professional security context. In Russian, "секрет" works perfectly; "тайна" carries unwanted emotional weight. Each language has its own decisions, now documented in per-language glossaries.

**Technical accuracy.** "Burn" means it's deleted permenantly. A literal translation ("сжечь" in Russian) sounds absurd in digital context. Thanks to human translation we use "уничтожить" (destroy). These decisions are captured once and applied consistently. I can't read either one but the variety agents have assured me that it's a good choice. I don't know what triangulation feels like but I imagine it feels something like zero-shot prompting multiple LLMs from different sources to develop an understanding of a word in another language. It's a bit easier now that  

## More like parkour than a science

I have no doubt that there are still lots of strange word choices and grammatical mistakes. I should be clear about that because I don't want it to come across like I think this ramshackle process is god's gift to the world. It's not a substitue for real, human translation. This process would not be feasible at all without the generous help from people. Not to mention all of the human content that our LLM friends and foes have consumed to make what they do possible.

![](https://i.makeagif.com/media/10-06-2021/AO0o3Q.gif)

If you set the playback speed to 4x and skip ahead to about 1 minute in, it's basically a live feed of how I look working this process.
https://www.youtube.com/watch?v=USRN6FUCYgU

## Documentation Over Tooling

[@jetdk's Danish contribution](https://github.com/onetimesecret/onetimesecret/pull/956) was a real eye opener into the pitfalls of bad word choices. Starting from there, I captured the insights in a markdown file as best I could and branched into other languages from there. I now have binders full of glossaries and language guides. Well, more like a thorough [peppering of markdown files](https://github.com/onetimesecret/onetimesecret/tree/ac6c1644afc58cef449d9e35c929d9f101a41f1e/src/locales) across [several](https://github.com/onetimesecret/docs.onetimesecret.com/blob/8f1b38bc6fa875fd53bb5998a1007ebd88325579/qa/locales/reviews/2025-11-16/locale-quality-analysis-de.md) [repos](). 

What holds it all together is that for each language I create two reference documents:
- [**Glossary**](https://github.com/onetimesecret/docs.onetimesecret.com/blob/8f1b38bc6fa875fd53bb5998a1007ebd88325579/src/content/docs/nl/translations/glossary.md): Standard translations for key terms
- [**Language notes**](https://github.com/onetimesecret/docs.onetimesecret.com/blob/8f1b38bc6fa875fd53bb5998a1007ebd88325579/src/content/docs/nl/translations/language-notes.md): Grammar rules, pitfalls, examples

When [@kh0mka](https://github.com/kh0mka) from Minsk submitted a [Russian translation](https://github.com/onetimesecret/onetimesecret/pull/2130), I reviewed it with our in-house language Czar named Claude against these documents. "We" then [expanded the Russian glossary and language notes](https://github.com/onetimesecret/docs.onetimesecret.com/pull/254) to capture the terminology decisions and rationale for future reference. 


## When We'd Change Approaches

If we had multiple active translators per language or multiple applications, I'd consider using a platform again. For now, the overhead isn't worth it. I've [documented this decision](https://github.com/onetimesecret/docs.onetimesecret.com/pull/253) with criteria for when to reconsider.

## Contributing

If you're interested in contributing, fork the repo, update locale files in `src/locales/{lang}/`, and submit a PR. Check the glossary and language notes in our [documentation repo]. It takes me a while sometimes to respond depending on what I'm working on but I always review and reply.

