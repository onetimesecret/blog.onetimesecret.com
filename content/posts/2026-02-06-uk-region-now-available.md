---
layout: post
title: "UK Region Now Available"
date: 2026-02-06
authors:
  - name: Onetime
    to: https://blog.onetimesecret.com/about
    avatar:
      src: /img/onetime-logo-v3-sm.png
image:
  src: /img/blog/2026/20260206-uk-data-centre-launch.svg
badge:
  label: Feature
readingTime: 5
---

We've expanded our data center network with a new United Kingdom location. The UK region ([uk.onetimesecret.com](https://uk.onetimesecret.com)) follows our share-nothing architecture — ensuring data created in the UK stays in the UK.

## Now Serving UK Customers

We're pleased to introduce our new UK region, hosted with [UpCloud](https://upcloud.com/) in the United Kingdom. The UK instance is now available at uk.onetimesecret.com and follows our share-nothing architecture that ensures data created in the UK stays in the UK.

<div class="flex justify-center items-center my-10">
  <a href="https://uk.onetimesecret.com/" class="text-center inline-block">
    <span class="font-brand text-3xl sm:text-4xl md:text-5xl
                 bg-clip-text text-transparent
                 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500
                 animate-flowing-colors
                 hover:animate-bounce
                 transition-all duration-300 ease-in-out
                 transform hover:scale-105
                 rounded-xl
                 dark:border-brand-600">
      uk.onetimesecret.com
    </span>
  </a>
</div>

### A Soft Launch

This is a soft launch. Our existing regions are in a configuration freeze as we roll out v0.24.0. That means the UK region isn't yet listed in the region dropdowns on eu.onetimesecret.com and our other regional sites. Once the v0.24.0 rollout is complete, we'll add the UK to the region selectors across the board.

In the meantime, you can access the UK region directly at [uk.onetimesecret.com](https://uk.onetimesecret.com).

### A Share-Nothing Architecture

As with all our regions, the UK instance operates under our share-nothing architecture. Each data center is fully independent:

- Data created in the UK region stays in the UK
- Each region maintains its own separate database and storage
- No cross-region data sharing or synchronization of any kind[^1]

[^1]: With the exception of error reporting via catch.onetimesecret.com, which receives error metadata from all regions (hosted in the EU). No secret content is included.

The UK is our fifth region, joining the EU, US, Canada, and Aotearoa New Zealand. We continue to evaluate additional regions based on user needs and regulatory requirements. For details on custom domain configuration, the UK regulatory environment, and infrastructure specifics, see the [UK region page](https://docs.onetimesecret.com/en/regions/united-kingdom) on our documentation site.

### How to Use

Visit [uk.onetimesecret.com](https://uk.onetimesecret.com) directly. All security features available in other regions are fully implemented in the UK instance. Once the v0.24.0 rollout is complete, you will also be able to select "United Kingdom" from the region selector on the main site.

For organizations requiring dedicated instances or custom deployments within specific regions, [please contact us](https://onetimesecret.com/feedback) to discuss your requirements.

## Meta content: About the post image

::ImageModal{src="/img/blog/2026/20260206-uk-data-centre-launch.svg" alt="UK Region Launch" width="600"}
::
