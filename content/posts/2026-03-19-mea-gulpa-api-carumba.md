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
description: "Planning a big release, shipping an incremental rollout, and discovering which approach actually works."
---

> [NOTE]: This post is part of our "Mistakes were made" series, where we share stories of things that could have gone better (or ideally not at all). There's no overarching theme or grand lesson. We're simply sharing experiences.


**Section 1: The plan**

I befuddled up the upgrade from v0.23 to v0.24. Prior to to that I was averaging about a month per release. Part of the problem was procedural: there was a lot that needed to get done for a codebase going on 15 years of age and regular day to day business activity to tend to.

In the end it amounted to over about 5000 commits, several false starts, and 8 months of prioritizing and re-prioritizing. That's about 20 commits a day, every day for 240 days, though commits are like notes: they can range anywhere from a few scratches on a napkin to full blown essays. But essays can suck and a note on a napkin can be super insightful so the numbers don't mean much other than to say, "that's a lot of something".


**Section 2: The road is long**

<!-- Neil Diamond, He Ain't Heavy He's my Brother. First line, "The road is loooOOooong..." -->
<iframe width="480" src="https://www.youtube-nocookie.com/embed/usZtSl8mX08" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

The road was too long. I knew there were a few key areas that needed to be addressed to support a new level of complexity and functionality, but I didn't have a sense of what the critical path was. Or I should say, I thought I did. That's why I started with the configuration system and made some potentially helpful improvements, like separating the monolith config.yaml into fixed portion that loaded once at boot time and mutable that could be updated on the fly. While that solved some problems, the net complexity increased (especially when you track config changes like diffs [ed: add github link to relevant PR/commit]). Increasing the complexity of something is a natural consequence of that thing being able to do more stuff. But it has to be measured and contained in the right places for it to be effective longterm and not immediately contribute to tech debt.

I was like, "Wow there is a lot going on a boot time. It now seems wildly inappropriate to have gotten so specific about configruation without address the Initialization Experience more broadly. That was the first false start. (A bit over a month, month and a half)


So then I focused on boot order. False start number two. Each time I carried some of that learning through as a kinf od like abridged version of config management and abridged version of boot semantics. Both important and necessary improvements. But it was the codebase guiding me at this point. The code is the guru.

And from there I made the commitment to continue in earnest, knowing there were mile markers I wanted to hit -- background jobs, new authentication system, _revisit encryption_ -- and letting the relative complexity be my guide.

I'm not sure I would have made it to the end if I'd spent more time planning at the start. My theory on planning projects goes like this:

- There's a continuum with chaos at one end and certainty on the other.
- Everyone tends to be comfortable at some point along that line, depending on their appetite for risk.
- Zero planning gets close to maximum chaos; maximal planning gets close to infinity time units.

On this continuum, I'm a leftist moving towards centrism. As a chronic and hopeful lateral thinker, it's hard for me to sit down and plan in a linear fashion. The answers don't come quickly without more context and when they do, they don't travel in a straight line from point to point. It's more like a maze of fuzzy potentials with sporadic moments of clarity.


**Section 3: What forced the pivot**

[MISSING: The "reality bites" moment. What happened that turned a planned big release into an incremental rollout?]


**Section 4: The rollout sequence**

We don't maintain any formal metrics on an ongoing basis, beyond what we need for operations and continuity. So the amount of activity per region is just a rough estimate. The EU is the O.G. region which was for many years all of onetimesecret.com until its coming out party in 2024 [ed: link to EU/US regions launch and get specific date]. Indirectly from the operational data, the EU region handles about 65% of the total activity across all regions. The US is about 15% and the remaining 20% is CA, NZ, and UK. As a customer base, it's ~30% EU, ~30% US, and ~30% everywhere else. [ed: generate a vector graphic chart that demonstrates the customer base superimposed on the regions].

**Section 5: The contained blast radius**

Going by those numbers, by rolling out v0.24 incrementally I've annoyed and disrupted about 35% of our user base, and a subset of those more than others. That's relatively _not bad_ but it's not something I take lightly.


**Section 6: The takeaway**

The pattern common to all technological advancement: make it work and then make it better. It needs to exist so that it can be improved in a tangible way. But it hopefully can radiate the least amount of annoyance and disruption as is feasible in doing so.

[MISSING: What would have broken if it had been big-bang? What does this change about future releases?]

---


### About the title

_The title is a layered and unnecessary pun: "Mea culpa" → "Mea gulpa" (as in gulp, swallowing one's pride at 7/11) and "humble broth" (like eating humble pie, but soup) and "API-carumba" (a reference to Bart Simpson as a modern software developer, "Ay carumba"). No one asks for this stuff, yet here we are._


---


---
