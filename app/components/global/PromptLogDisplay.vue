<script setup lang="ts">
interface PromptLog {
  modelTitle: string;
  prompt: string;
  completion: string;
  completionOptions: {
    model: string;
    maxTokens: number;
  };
}

interface PromptLogDisplayProps {
  promptLogs: PromptLog[];
}

defineProps<PromptLogDisplayProps>();
</script>

<template>
  <div class="bg-midnight-100 dark:bg-midnight-800 p-4 border-t border-midnight-200 dark:border-midnight-700">
    <h3 class="text-lg font-semibold mb-2 dark:text-white">
      Prompt Logs
    </h3>
    <div v-for="(log, index) in promptLogs" :key="index" class="mb-4">
      <div class="font-medium dark:text-midnight-200">
        {{ log.modelTitle }}
      </div>
      <div class="text-sm dark:text-midnight-300">
        <strong class="dark:text-midnight-200">Prompt:</strong> {{ log.prompt }}
      </div>
      <div class="text-sm dark:text-midnight-300">
        <strong class="dark:text-midnight-200">Completion:</strong> {{ log.completion }}
      </div>
      <div class="text-xs text-midnight-600 dark:text-midnight-400">
        Model: {{ log.completionOptions.model }}, Max Tokens: {{ log.completionOptions.maxTokens }}
      </div>
    </div>
  </div>
</template>
