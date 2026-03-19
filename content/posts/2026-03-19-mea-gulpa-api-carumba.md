---
layout: post
title: "Mea gulpa: a big bowl of humble broth (or, API-carumba: an upgrade story)"
date: 2026-03-19
authors:
  - name: Delano
    to: https://blog.onetimesecret.com/about
    avatar:
      src: /img/portrait-profile-pic-delano-2025-m.png
image:
  src: /img/blog/2026/20260319-api-carumba.svg
badge:
  label: Mistakes were made
readingTime: 5
description: "A tale of trailing slashes, payload key mismatches, and the humble act of debugging one's own assumptions."
---

> [NOTE]: This post is part of our "Mistakes were made" series, where we share stories of things that could have gone better (or ideally not at all). There's no overarching theme or grand lesson. We're simply sharing experiences.

I befuddled up the upgrade from v0.23 to v0.24. Part of the problem was procedural: there were about 5000 commits and 8 months worth of changes. That's thousands as in more than 500, 50, and 5 combined. Or about 20 commits a day, every day for 240 days. But commits are like notes: they can range anywhere from a few scratches on a napkin to flow blown essays.

The road was too long. There was a lot to get done and I'm not sure I would have made it to the end if I'd spent more time planning at the start. My theory on planning projects goes like this:

- There's a continuum with chaos at one end and certainty on the other.
- Everyone tends to be comfortable at some point along that line, depending on their appetite for risk.
- Zero planning gets close to maximum chaos; maximal planning gets close to infinity time units.


On this continuum, I'm a lefist moving towards centrism. As a chronic lateral thinker, it's hard for me to sit down and plan in a linear fashion. The answers don't come quickly without more context and when they do, they do'nt travel in a straight line form point to point. It's more like a maze of fuzzy potentials with sporatic moments of clarity. Anyway, enough about my process. My point is that as a result, it's not a surprise that there were some gaps left.

It's wild to think that in the time it took from then until now, the quality of LLM tools and our nascent understanding of how to use them effectively (neè, how to avoid the traps, sinkholes, and dead ends) has improved so much. At this point I spend more time in conversations about the work and design ideas and concepts and the naming of things than the actual coding of the thing. This is what I meant about how I'm moving towards centrism: more time spent in chaotic planning and less time coding, because the work produced is a manifestation of the design that already somewhat exists.

...

---



### About the title

_The title is a layered and unnecessary pun: "Mea culpa" → "Mea gulpa" (as in gulp, swallowing one's pride at 7/11) + "humble broth" (like eating humble pie, but soup) + "API-carumba" (a reference to Bart Simpson's, "Ay carumba"). Completly unnecessary. No one is asking for this stuff, yet here we are._


---

Scraps

- Not many people advocate for either extreme (the ones that do tend to offer violent dismissals about being punched in the face or something about being on a battlefield). (graphic futilists?)
- So how to choose? Sometimes we don't have the freedom to choose. But when we do? Or how to cope when we don't?
