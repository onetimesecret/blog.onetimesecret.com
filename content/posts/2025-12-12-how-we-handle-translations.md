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

## Git-Based, Community-Driven

No translation management platform. Contributors submit PRs against locale files. We review for quality, merge, done.

This works because:
- Our UI vocabulary is limited (~500 strings)
- Security terminology must be precise—crowdsourced "good enough" isn't acceptable
- We can review every change

## What We Look For

**Terminology consistency.** "Secret" translates differently across languages. In Danish, the literal "Hemmeligheder" sounds childish—contributors use "Beskeder" (messages) instead. In Russian, "секрет" works perfectly; "тайна" carries unwanted emotional weight. Each language has its own decisions, documented in per-language glossaries.

**Technical accuracy.** "Burn" means permanent deletion. A literal translation ("сжечь" in Russian) sounds absurd in digital context. We use "уничтожить" (destroy). These decisions are captured once and applied consistently.

**Regional neutrality.** Russian speakers span Russia, Belarus, Kazakhstan, the Baltics, and diaspora communities worldwide. We use standard literary Russian that works everywhere—no regional slang, no dialect markers.

## Documentation Over Tooling

Each language has two reference documents:
- **Glossary**: Standard translations for key terms
- **Language notes**: Grammar rules, pitfalls, examples

When a contributor from Minsk submitted a complete Russian translation, we reviewed it against these documents. The translation used neutral literary Russian appropriate for a global audience—exactly what the docs specify.

## Quality Signals

We check for:
- JSON key preservation (changing keys breaks the app)
- Consistent register (formal "вы" throughout, not mixed)
- Proper pluralization (Russian needs three forms, not two)
- No encoding corruption

## When We'd Change Approaches

If we had 10+ active translators per language, we'd consider a TMS. For now, the overhead isn't worth it.

## Contributing

Fork the repo, update locale files in `src/locales/{lang}/`, submit a PR. Check the glossary and language notes first. We review every submission.
