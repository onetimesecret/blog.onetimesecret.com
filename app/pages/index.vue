<script setup lang="ts">
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

const { data: page } = await useAsyncData('homepage', () => queryCollection('content').path('/').first());
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

const { data: posts } = await useAsyncData('posts', () => queryCollection('posts')
  .order('date', 'DESC')
  .all());

useSeoMeta({
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description,
});

defineOgImage({
  component: 'Blog',
  title: page.value.title,
  description: page.value.description,
} as any);

function formatDate(date: string) {
  const dateParts = date.split('-');
  const year = Number.parseInt(dateParts[0], 10);
  const month = Number.parseInt(dateParts[1], 10) - 1;
  const day = Number.parseInt(dateParts[2], 10);
  const dateOut = new Date(year, month, day);
  return format(dateOut, 'MMMM d, yyyy', { locale: enUS });
}
</script>

<template>
  <UContainer class="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
    <UPageHeader
      :title="page?.title"
      :description="page?.description"
      :headline="page?.headline"
      :links="[
        { label: 'GitHub', color: 'neutral' as const, to: 'https://github.com/onetimesecret/onetimesecret', target: '_blank', icon: 'i-simple-icons-github' },
        { label: 'Docker Images', color: 'neutral' as const, to: 'https://github.com/onetimesecret/onetimesecret/pkgs/container/onetimesecret', target: '_blank', icon: 'i-simple-icons-docker' },
      ]"
      class="mb-16"
    />

    <UPageBody>
      <UBlogPosts>
        <UBlogPost
          v-for="(post, index) in posts"
          :key="index"
          :to="post.path"
          :title="post.title"
          :description="post.description"
          :image="post.image as any"
          :date="formatDate(post.date)"
          :authors="post.authors as any"
          :badge="post.badge as any"
          :orientation="index === 0 ? 'horizontal' : 'vertical'"
          class="transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-700 rounded-lg overflow-hidden"
          :class="[
            index === 0 ? 'col-span-full mb-16' : '',
          ]"
        />
      </UBlogPosts>
    </UPageBody>
  </UContainer>
</template>
