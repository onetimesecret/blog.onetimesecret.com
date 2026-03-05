<script setup lang="ts">
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { joinURL } from 'ufo';

const route = useRoute();

const { data: post } = await useAsyncData(route.path, () => queryCollection('posts').path(route.path).first());
if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true });
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => queryCollectionItemSurroundings('posts', route.path), { default: () => [] });

const title = post.value.title;
const description = post.value.description;

const formattedDate = computed(() => {
  if (!post.value?.date) {
    return 'No date';
  }
  const dateParts = post.value.date.split('-');
  const year = Number.parseInt(dateParts[0], 10);
  const month = Number.parseInt(dateParts[1], 10) - 1;
  const day = Number.parseInt(dateParts[2], 10);
  const date = new Date(year, month, day);
  return format(date, 'MMMM d, yyyy', { locale: enUS });
});

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
});

if (post.value.image?.src) {
  const site = useSiteConfig();

  useSeoMeta({
    ogImage: joinURL(site.url, post.value.image.src),
    twitterImage: joinURL(site.url, post.value.image.src),
  });
}
else {
  defineOgImage({
    component: 'OgImageOnetimeSecretOg',
    props: {
      title,
      description,
      headline: 'Blog',
    },
  });
}
</script>

<template>
  <UContainer v-if="post" class="py-8 sm:py-16">
    <div class="mb-8">
      <NuxtLink to="/" class="text-sm font-medium text-brand-600 hover:text-brand-500">
        <svg class="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Blog
      </NuxtLink>
    </div>

    <article class="max-w-3xl mx-auto prose dark:prose-invert">
      <header class="mb-12">
        <div v-if="post.image?.src" class="not-prose mb-6">
          <NuxtImg
            :src="post.image.src"
            :alt="post.image.alt || post.title"
            class="w-full h-auto rounded-lg shadow-sm"
            loading="lazy"
          />
        </div>

        <UBadge
          v-if="post.badge"
          :label="post.badge.label"
          variant="subtle"
          class="mb-4"
        />
        <h1 class="text-4xl sm:text-5xl font-bold text-midnight-900 dark:text-white mb-4">
          {{ post.title }}
        </h1>
        <div class="flex items-center space-x-4 text-sm text-midnight-500 dark:text-midnight-400">
          <time :datetime="post.date">{{ formattedDate }}</time>
          <span>&middot;</span>
          <span>{{ post.readingTime }} min read</span>
        </div>
        <div class="mt-6 flex flex-wrap items-center gap-4">
          <UButton
            v-for="(author, index) in post.authors"
            :key="index"
            :to="author.to"
            color="neutral"
            target="_blank"
            size="sm"
            class="inline-flex items-center px-3 py-1.5 rounded-full bg-midnight-100 dark:bg-midnight-800 text-midnight-700 dark:text-midnight-300 hover:bg-midnight-200 dark:hover:bg-midnight-700 transition"
          >
            <UAvatar
              v-bind="author.avatar"
              :alt="author.name"
              size="xs"
              class="mr-2"
            />
            {{ author.name }}
          </UButton>
        </div>
      </header>

      <UPage class="relative">
        <UPageBody class="max-w-none">
          <ContentRenderer
            v-if="post && post.body"
            :value="post"
          />

          <USeparator v-if="surround?.filter(Boolean).length" class="mt-12" />
          <UContentSurround :surround="(surround as any)" class="mt-6" />
        </UPageBody>

        <template v-if="post.body?.toc?.links?.length" #right>
          <UContentToc
            :links="post.body.toc.links"
            class="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto text-sm text-midnight-600 dark:text-midnight-400"
          />
        </template>
      </UPage>
    </article>
  </UContainer>
</template>
