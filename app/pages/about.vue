<script setup lang="ts">
const title = 'About Onetime Secret';
const description = 'The people and work behind Onetime Secret, an open-source service for sharing sensitive information.';

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
});

useHead({
  link: [{ rel: 'canonical', href: 'https://blog.onetimesecret.com/about' }],
});
</script>

<template>
  <UContainer class="py-8 sm:py-16 max-w-3xl">
    <UPageHeader
      :title="title"
      description="Secure, ephemeral information sharing"
    />

    <UPageBody>
      <div class="space-y-8 text-base leading-7">
        <p>
          Onetime Secret provides a simple way to share sensitive information
          through links that can be viewed once. The project is open source,
          with its code available on
          <a href="https://github.com/onetimesecret/onetimesecret" class="underline underline-offset-4 hover:text-primary">GitHub</a>.
        </p>

        <section aria-labelledby="author-heading" class="space-y-4">
          <h2 id="author-heading" class="text-2xl font-semibold">
            About the author
          </h2>
          <div class="flex flex-col gap-6 sm:flex-row sm:items-start">
            <img
              src="/img/portrait-profile-pic-delano-2025-m.png"
              alt="Delano Mandelbaum"
              width="128"
              height="128"
              class="size-32 shrink-0 rounded-lg object-cover"
            >
            <p>
              Delano Mandelbaum is the creator of Onetime Secret. This blog shares
              product updates, engineering notes, and lessons from building and
              running the service.
            </p>
          </div>
        </section>

        <section aria-labelledby="explore-heading" class="space-y-4">
          <h2 id="explore-heading" class="text-2xl font-semibold">
            Explore Onetime Secret
          </h2>
          <ul class="list-disc space-y-2 ps-5">
            <li><NuxtLink to="/" class="underline underline-offset-4 hover:text-primary">Read the latest blog posts</NuxtLink></li>
            <li><a href="https://onetimesecret.com/" class="underline underline-offset-4 hover:text-primary">Share a secret</a></li>
            <li><a href="https://docs.onetimesecret.com/" class="underline underline-offset-4 hover:text-primary">Read the documentation</a></li>
            <li><a href="https://github.com/onetimesecret/onetimesecret" class="underline underline-offset-4 hover:text-primary">Explore the source code</a></li>
          </ul>
        </section>
      </div>
    </UPageBody>
  </UContainer>
</template>
