<!-- pages/debug.vue -->
<script setup>
const { data: content } = await useAsyncData('content', () => queryCollection('posts').all());
</script>

<template>
  <div>
    <h1>Content Debug</h1>
    <pre>{{ content }}</pre>
  </div>
</template>
