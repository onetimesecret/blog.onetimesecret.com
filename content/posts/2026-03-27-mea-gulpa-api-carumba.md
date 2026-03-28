---
layout: post
title: "Mea gulpa: a big bowl of humble broth (or, API-carumba: an upgrade story)"
date: 2026-03-27
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


::note
This post is part of our "Mistakes were made" series, where we share stories of things that could have gone better (or ideally not at all). There's no overarching theme or grand lesson. We're simply sharing experiences.
::


## The plan

I befuddled up the upgrade from v0.23 to v0.24. Prior to that I was averaging about a month per release. Part of the problem was procedural: there was a lot that needed to get done for a codebase going on 15 years of age and regular day to day business activity to tend to.

In the end it amounted to about [5000 commits, several false starts, and 8 months of prioritizing and re-prioritizing](https://github.com/onetimesecret/onetimesecret/pull/2421). That's about 20 commits a day, every day for 240 days, though commits are like notes: they can range anywhere from a few scratches on a napkin to full blown essays. But essays can suck and a note on a napkin can be super insightful so the numbers don't mean much other than to say, "that's a lot of something".


## The road is long

::youtube-no-cookie{video-id="usZtSl8mX08" caption="Neil Diamond - He Ain't Heavy, He's My Brother"}
::

The road was too long. I knew there were a few key areas that needed to be addressed to support a new level of complexity and functionality, but I didn't have a sense of what the critical path was. Or I should say, I thought I did. That's why I started with the configuration system and made some potentially helpful improvements, like separating the monolith config.yaml into a fixed portion that loaded once at boot time and a mutable portion that could be updated on the fly. While that solved some problems, the net complexity increased (especially when you [track config changes like diffs](https://github.com/onetimesecret/onetimesecret/pull/1494)). Increasing the complexity of something is a natural consequence of that thing being able to do more stuff. But it has to be measured and contained in the right places for it to be effective long term and not immediately contribute to tech debt.

I was like, "Wow there is a lot going on at boot time. It now seems wildly inappropriate to have gotten so specific about configuration without addressing the Initialization Experience more broadly." That was the first false start. A bit over a month, month and a half.

So then I focused on boot order. False start number two. Each time I carried some of that learning through as a kind of abridged version of config management and abridged version of boot semantics. Both important and necessary improvements. But it was the codebase guiding me at this point. The code is the guru.

And from there I made the commitment to continue in earnest, knowing there were mile markers I wanted to hit (background jobs, new authentication system, _revisit encryption_) and letting the relative complexity be my guide.


## What forced the pivot

We're now getting to the new year at this point and I knew that if I didn't start taking some real steps, it may never end. So out of desperation I realized it was not feasible to update all of the regions at the same time. Or at least that with a bit of additional work and planning, they could be staggered. But it still meant that the payment system integration needed to be fleshed out so that it was built in a way that supported each region running its own configuration.

A straightforward example is with webhooks. When something happens in the external payment system, it makes a call back to the application to keep it informed. How is that going to work when you have 5 completely separate production environments that don't share data or communicate in any way? Well, the payment system (Stripe) supports multiple webhooks which is great. But when there's an event, it calls all of the webhooks which is not... actually that's fine because only one needs to care and the others can ignore it. In order for that one environment to care, there needs to be a way to match up the event with the environment. We just label everything in the payment system with a region. Each environment knows what region it is so it can filter webhook events based on that. Beauteous.

The data migrations were a huge part of the Update Experience and took about 3-4 weeks to stabilize and get repeatable. There are about 14 steps to the process. All of the data steps were idempotent to minimize the chance of introducing unexpected results and making it possible to debug an error and continue processing without having to go back to make code changes to the scripts and cut a new release.

Setting up the new environments so we could keep the current systems in normal working condition right up until the upgrade. That way if anything went pear-shaped we could simply start the existing system back up and live to try another day. That pre-work to get an environment ready is about a day and a half to two days.

So by chunking out the sysadmin environment work one at a time, it made sense to continue on that one environment to do the upgrade as well. It did not seem feasible to spend 1.5-2 weeks dedicated to sysadmin before upgrading even one region.


## The rollout sequence

We rolled out UK first because it was a completely new region. That helped get the system install and setup sequence worked out. The UK got the first cut of v0.24. The billing system wasn't done but it didn't block creating an account. The API was broken but no one was using it yet. All together it was enough to get a beachhead, draw a line in the sand, and use that as feedback on what fires to put out and in roughly what order.

There were issues with the API. Even though we have separate API versions, v1 and v2, the expectation is that those versions are like contracts. It works this way or that way, but it's consistent and reliable. There were issues with missing fields and authentication errors. Given the scope of the changes, the v1 API was partially reimplemented. The v2 code is mostly unchanged but has a new authentication system, and the data store serializes to JSON types now, so to remain consistent, we need to convert typed values back to strings. Needless to say I didn't get it quite right the first time ([#2615](https://github.com/onetimesecret/onetimesecret/issues/2615), [#2618](https://github.com/onetimesecret/onetimesecret/issues/2618), [#2699](https://github.com/onetimesecret/onetimesecret/issues/2699)).

How I worked through that in a systematic way is the story for another post. But the process took about a month.


## The contained blast radius

We don't maintain any formal metrics on an ongoing basis, beyond what we need for operations and continuity. So the amount of activity per region is just a rough estimate. The EU is the O.G. region which was for many years all of onetimesecret.com until its coming out party in [October 2024](/posts/2024-10-23-us-data-center). Indirectly from the operational data, the EU region handles about 65% of the total activity across all regions. The US is about 15% and the remaining 20% is CA, NZ, and UK. As a customer base, it's ~30% EU, ~30% US, and ~30% everywhere else.

Going by those numbers, by rolling out v0.24 incrementally I've annoyed and disrupted about 35% of our user base, and a subset of those more than others. That's relatively _not bad_ but it's not nothing either. That's why I'm writing this post after all.

But there were real consequences. The NZ region was unavailable for about 8 hours. And just by the nature of needing to make it happen, I didn't give any lead time warning about the outage. Although scheduled overnight to minimize impact, there were a couple customers that were not insignificantly inconvenienced.

The next rollout, CA, was better. Only about 4 hours. And US, about 3. EU which I had thought would be first is now more realistically the last. It will likely take the longest just based on the amount of data. But it'll be a sweet release indeed and timely spring cleaning for the O.G. instance of Redis.


## The takeaway

The pattern common to all technological advancement: make it work and then make it better. It needs to exist so that it can be improved in a tangible way. But it can hopefully radiate the least amount of annoyance and disruption as is feasible in doing so.

I'm not sure I would have made it to the end if I'd spent more time planning at the start. More planning would have meant more assumptions, I wouldn't have learned that config and boot sequence weren't as important as I thought until much later, and in general would have meant less feedback. The incremental rollout forced me to confront problems earlier in NZ (newest region before UK, convenient timezone) before they could compound in EU.

Going forward, rolling releases are the norm. One topic per release, shipped in rough priority order. Priorities can still shift based on feedback, or when design work on one concept comes together faster than another. Rather than kill momentum, skip ahead when needed.

_- Delano_

---

::CollapsibleContent{summary="About this post"}

**The title**
is a layered and unnecessary pun: "Mea culpa" → "Mea gulpa" (as in gulp, swallowing one's pride at 7-Eleven) and "humble broth" (like eating humble pie, but soup) and "API-carumba" (a reference to Bart Simpson as a modern software developer, "Ay carumba"). No one asks for this stuff, yet here we are.

**The image** was created by Claude after I suggested using a random Kagi search for inspiration when starting this "Mistakes were made" post. It picked a result about Dalí and came up with the melting clock motif.

> **Me:** Help me understand the 3:14 reference.
>
> **Claude:** It's pi time — 3.14 rendered as a clock face. A nod to Dalí's melting clocks from *The Persistence of Memory*, but instead of showing a "real" time, it shows π. Fits the surreal math-meets-art vibe, and the warp filter makes the clock face melt just like the original.

![The melting clock detail showing 3:14](/img/blog/2026/20260319-api-carumba-clock-detail.png)

Nailed it, buddy.

::
