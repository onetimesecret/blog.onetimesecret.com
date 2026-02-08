<script setup lang="ts">
interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string | { type: string; text: string }[];
}

const props = defineProps<MessageBubbleProps>();

const isUser = props.role === 'user';

const displayContent = computed(() => {
  if (typeof props.content === 'string') {
    return props.content;
  }
  return props.content
    .filter(item => item.type === 'text')
    .map(item => item.text)
    .join('\n\n');
});
</script>

<template>
  <div
    class="p-4 cursor-pointer transition-colors duration-200 dark:text-midnight-200"
    :class="{
      'bg-brandcompdim-100 dark:bg-brandcompdim-900': isUser,
      'bg-brandcomp-300 dark:bg-brandcomp-800': !isUser,
    }"
  >
    <h3 class="dark:text-midnight-100">
      {{ isUser ? 'User' : 'Assistant' }}
    </h3>
    <div class="prose dark:prose-invert dark:text-white" v-html="displayContent" />
  </div>
</template>
