<script setup lang="ts">
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

const POSTS_PER_PAGE = 20;

const { data: page } = await useAsyncData('homepage', () => queryCollection('content').path('/').first());
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

const { data: posts } = await useAsyncData('posts', () => queryCollection('posts')
  .order('date', 'DESC')
  .all());

const visibleCount = ref(POSTS_PER_PAGE);

const visiblePosts = computed(() => posts.value?.slice(0, visibleCount.value) ?? []);
const hasMore = computed(() => (posts.value?.length ?? 0) > visibleCount.value);

function showMore() {
  visibleCount.value += POSTS_PER_PAGE;
}

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

function imageProps(post: any, index: number) {
  const base = typeof post.image === 'string'
    ? { src: post.image }
    : { ...post.image };
  if (index > 0) {
    base.loading = 'lazy';
  }
  return base;
}
</script>

<template>
  <UContainer class="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
          v-for="(post, index) in visiblePosts"
          :key="post.path"
          :to="post.path"
          :title="post.title"
          :description="post.description"
          :image="post.image ? imageProps(post, index) as any : undefined"
          :date="formatDate(post.date)"
          :authors="post.authors as any"
          :badge="post.badge as any"
          :orientation="index === 0 ? 'horizontal' : 'vertical'"
          class="transition-all duration-300 hover:shadow-lg dark:hover:shadow-midnight-700 rounded-lg overflow-hidden"
          :class="[
            index === 0 ? 'col-span-full mb-16' : '',
          ]"
        />
      </UBlogPosts>

      <div v-if="hasMore" class="mt-12 flex justify-center">
        <UButton
          label="Show older posts"
          color="neutral"
          variant="outline"
          size="lg"
          @click="showMore"
        />
      </div>
    </UPageBody>
  </UContainer>
</template>
