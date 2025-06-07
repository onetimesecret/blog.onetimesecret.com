---
layout: post
title: "Denial of Service (DoS) Attack: A brief summary"
date: 2024-09-10
authors:
  - name: Delano
    to: https://blog.onetimesecret.com/about
    avatar:
      src: /img/portrait-profile-pic-delano-2025-m.png
image:
  src: /img/blog/2024/hetzner-lb1-30d-2024-09-10-1200.jpeg
badge:
  label: Operations
readingTime: 4
---


_See the follow-up posts:_

* (Sept 12th, 2024) _[Denial of Service (DoS) Attack: Continued Adventure](/posts/2024-09-12-ddos-day-4)._
* (Sept 13th, 2024)  _[Denial of Service (DoS) Attack: Day 5](/posts/2024-09-13-ddos-day-5)._

_And see the [updates to this post at the end](#updates)._

---

Original post:

## What Happened

I wanted to give you a quick update on what's been happening with Onetime Secret.

We had a rough day today. A significant DoS attack hit us, taking the site down for over ~8 hours~ 12 hours. It was intense - we're talking about 15,000 connection attempts per second at its peak. That's... a lot.

I know we were radio silent during this time, and that's not ideal. We were heads-down trying to get things back up and running. It was a long, stressful day, but we managed to restore service.

## Key Points

Here's what we know so far:

1. The attack overwhelmed our systems, maxing out our CPU and disk I/O.
2. It came from multiple IP addresses with malformed HTTP headers.
3. As we brought services back up, they'd quickly go down again due to the load.

## Moving Forward

We're still investigating and will share a full post-mortem soon. This incident revealed some weak points in our infrastructure - which, while painful now, gives us a chance to improve and become more resilient.

To whoever was behind this attack: bravo, I guess? But seriously, can we all go home now?

I'm not going to sugarcoat it. This was a major disruption to our service, and that doesn't feel great. Actualyl it specifically feels bad. Our focus now is learning from this and making Onetime Secret better.

Thanks for your patience and understanding. We'll keep you updated as we know more.

---

## A few (technical) screenshots

I managed to get a few screenshots while the attack was happening. The first one shows the load balancer's connections on the scale of 1hour. This was taken from a couple hours into it and shows two spikes where we got the site back up only to go back down again shortly after.

The top chart is total open connections; the bottom chart is connections opening per second. We get up to around 50 open connections on a regular day. The two spikes were approaching 8000 with 15k connection attempts per second. Which seems like a little much.

#### 15,000 connections per second (sure, that's totally fine)

::ImageModal{src="/img/blog/2024/hetzner-graphs-lb-1h-20240909-0922.png" title="Hetzner Dashboard - DoS Attack Sept 9th, 2024" alt="Hetzner Dashboard - DoS Attack Sept 9th, 2024" width="320"}
::

#### Max CPU, 1GB/s disk I/O, only 40 packets per second (?)

This one is from the web server's perspective. 12 hours of mostly normal traffic and then whammo.

::ImageModal{src="/img/blog/2024/hetzner-graphs-lb-12h-20240909-0955am.jpeg" title="Hetzner Dashboard - DoS Attack Sept 9th, 2024" alt="Hetzner Dashboard - DoS Attack Sept 9th, 2024" width="320"}
::

#### Many IP addresses, bad HTTP headers, and a lot of traffic

::ImageModal{src="/img/blog/2024/web-server-logs-20240909-0730-example.png" title="Hetzner Dashboard - DoS Attack Sept 9th, 2024" alt="Hetzner Dashboard - DoS Attack Sept 9th, 2024" width="320"}
::

::ImageModal{src="/img/blog/2024/web-server-logs-20240909-0730-example2.png" title="Hetzner Dashboard - DoS Attack Sept 9th, 2024" alt="Hetzner Dashboard - DoS Attack Sept 9th, 2024" width="320"}
::

::CollapsibleContent{summary="View Hetzner Traffic Incident Report"}

```plaintext
> Direction IN
> Internal 49.13.44.122 (this is us)
> Threshold Packets 1,000,000 packets/s
> Sum 311,775,000 packets/300s (1,039,250 packets/s), 62,354 flows/300s (207 flows/s), 13.169 GByte/300s (359 MBit/s)
> External 50.205.0.0, 15,000 packets/300s (50 packets/s), 3 flows/300s (0 flows/s), 0.001 GByte/300s (0 MBit/s)
> External 177.233.0.0, 10,000 packets/300s (33 packets/s), 1 flows/300s (0 flows/s), 0.002 GByte/300s (0 MBit/s)
> External 77.182.0.0, 10,000 packets/300s (33 packets/s), 2 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 50.7.0.0, 10,000 packets/300s (33 packets/s), 2 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 125.82.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 174.205.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 18.195.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 167.100.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 185.160.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 222.3.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 32.229.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 58.159.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 83.219.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 117.65.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 209.26.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 71.31.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 123.168.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 63.16.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 31.20.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 212.51.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 169.234.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 44.200.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 38.126.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 60.180.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 99.37.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 70.67.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 186.70.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 38.43.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
> External 170.46.0.0, 5,000 packets/300s (16 packets/s), 1 flows/300s (0 flows/s), 0.000 GByte/300s (0 MBit/s)
```

::



## Updates

Here's the formatted version with timestamps as headers:

### 18:00 PDT, Sept 9, 2024

The attack seems like it may not actually be done yet.

### 19:00 PDT, Sept 9, 2024

The attack is still ongoing. The network team at our hosting company (Hetzner) emailed earlier. I'm just catching up on emails now. They included some numbers. Around noon today (PDT), over a five minute period: over 1 million packets per second, 311+ million packets total. That's a lot. And it's being going on and off for hours.

### 23:45 PDT, Sept 9, 2024

Some questionable traffic is still coming in, but we managed to wrangle almost all of it. We're still monitoring the situation. The solution for now is everything bigger -- load balancer, web servers, etc -- and some carefully tuned network services.

### 07:00 PDT, Sept 10, 2024 (Day 2)

The attack has mostly tapered off. There's still a lot of junk traffic coming from about 1200+ IP addresses which we're managing now. We're still monitoring the situation. They change up the patterns so we need to make adjustments every so often. In general I get the sense that this is a copycat rather than the original perpetrators that started this adventure off yesterday.

### 12:30 PDT, Sept 10, 2024

The junk traffic continues. There are around 1600 unique IP addresses generating a considerable number of requests. But the situation has settled down somewhat -- with all the infrastructure changes we've made, we're able to weather the bursts and recover quickly. I'll start working on another post after this update.


For comparison, this is what traffic from the previous 30 days looked like (the spike on the right is the start of the attack):

::ImageModal{src="/img/blog/2024/hetzner-lb1-30d-2024-09-10-1200.jpeg" title="Hetzner Dashboard - The Past 30 days - Sept 10, 2024" alt="Hetzner Dashboard - The Past 30 days - Sept 10, 2024" width="320"}
::
