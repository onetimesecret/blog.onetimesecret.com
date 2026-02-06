---
layout: post
title: "The Ramshackler's Guide to i18n"
date: 2025-12-12
authors:
  - name: Delano
    to: https://blog.onetimesecret.com/about
    avatar:
      src: /img/portrait-profile-pic-delano-2025-m.png
badge:
  label: Process
image:
  src: /img/blog/2025/20251212-delano-translating.jpg
readingTime: 3
---

We support 12+ languages. I can only read 1. Here's how we do it without a dedicated localization team.

## A Cacophony of Agents

I don't use a translation management platform. Just git, jq, a variety of LLM agents, and many many markdown files. I've tried a few platform tools this year with mixed results. I have a hard time changing my somewhat baroque working process but I enjoyed Lokalise the best. Big shout-out to [i18n-ally](https://github.com/lokalise/i18n-ally), it's the only reason I switch to VS Code from Zed.

Updates are a combination of contributors submitting PRs against the JSON locale files and me using one or more tools to translate new keys added during development cycles. I work through the PRs and try to capture as much insight from the terms used and choices made. This works partly because our UI vocabulary is limited (~1000 not-at-all-optimized strings, lots of overlap).

## Friggin Words, How Do They Work?

**Terminology consistency.** "Secret" translates differently across languages. In Danish, the literal "Hemmeligheder" sounds childish. [@jetdk](https://github.com/jetdk) [chose "Beskeder"](https://github.com/onetimesecret/onetimesecret/pull/956) (messages) instead, explaining that while technically correct, the literal carries the wrong connotation in everyday use. This revealed a pattern we hadn't documented: sometimes the literal translation undermines the professional security context. In Russian, "секрет" works perfectly; "тайна" carries unwanted emotional weight. Each language has its own decisions, now documented in per-language glossaries.

**Technical accuracy.** "Burn" means it's deleted permanently. A literal translation ("сжечь" in Russian) sounds absurd in digital context. Thanks to human translation we use "уничтожить" (destroy). These decisions are captured once and applied consistently. I can't read either one but various agents have assured me it's a good choice.

## Humans are Important

[@jetdk's Danish contribution](https://github.com/onetimesecret/onetimesecret/pull/956) was a real eye opener into the pitfalls of bad word choices. Starting from there, I captured the insights in a markdown file and branched into other languages. I now have binders full of glossaries and language guides, well, more like a [thorough peppering of markdown files](https://github.com/onetimesecret/onetimesecret/tree/ac6c1644afc58cef449d9e35c929d9f101a41f1e/src/locales) across [several](https://github.com/onetimesecret/docs.onetimesecret.com/blob/8f1b38bc6fa875fd53bb5998a1007ebd88325579/qa/locales/reviews/2025-11-16/locale-quality-analysis-de.md) [repos](https://github.com/onetimesecret/docs.onetimesecret.com).

The glue is two reference documents per language:
* [**Glossary**](https://github.com/onetimesecret/docs.onetimesecret.com/blob/8f1b38bc6fa875fd53bb5998a1007ebd88325579/src/content/docs/nl/translations/glossary.md): Standard translations for key terms
* [**Language notes**](https://github.com/onetimesecret/docs.onetimesecret.com/blob/8f1b38bc6fa875fd53bb5998a1007ebd88325579/src/content/docs/nl/translations/language-notes.md): Grammar rules, pitfalls, examples

When [@kh0mka](https://github.com/kh0mka) from Minsk submitted a [Russian translation](https://github.com/onetimesecret/onetimesecret/pull/2130), I reviewed it with our in-house language Czar named Claude against these documents. We then [expanded the Russian glossary and language notes](https://github.com/onetimesecret/docs.onetimesecret.com/pull/254) to capture the terminology decisions and rationale for future reference.

### Contributing

If you're interested, [fork the repo](https://github.com/onetimesecret/onetimesecret/fork), update locale files in `src/locales/{lang}/`, and submit a PR. Check the glossary and language notes in our [documentation repo](https://docs.onetimesecret.com). It takes me a while sometimes to respond depending on what I'm working on but I always review and reply.

## More Like Parkour Than a Science

I don't want this to come across like I think this ramshackle process is the gods' gift to linguistics. There are still strange word choices and grammatical mistakes out there. It wouldn't be feasible at all without generous help from people, not to mention all the human content that LLMs have consumed to make what they do possible.
In conclusion, this is me working with multiple LLM agents in Dutch:

<img src="/img/blog/2025/20251212-llm-agent-parkour.gif" alt="Working on translations with multiple LLM agents" />
