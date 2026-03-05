<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';

interface Props {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
}

const props = defineProps<Props>();

const isModalOpen = ref(false);
const triggerButtonRef = ref<HTMLButtonElement | null>(null);
const closeButtonRef = ref<HTMLButtonElement | null>(null);

function openModal() {
  isModalOpen.value = true;
  nextTick(() => {
    closeButtonRef.value?.focus();
  });
}

function closeModal() {
  isModalOpen.value = false;
  nextTick(() => {
    triggerButtonRef.value?.focus();
  });
}

function handleOverlayClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    closeModal();
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isModalOpen.value) {
    closeModal();
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <div>
    <button
      ref="triggerButtonRef"
      type="button"
      class="image-trigger"
      :aria-label="`View full size: ${props.alt}`"
      @click="openModal"
    >
      <NuxtImg
        :src="src"
        :alt="alt"
        :width="width"
        :height="height"
        class="rounded-lg border border-midnight-300 shadow-lg dark:opacity-75 cursor-pointer"
      />
    </button>
    <teleport to="body">
      <div
        v-if="isModalOpen"
        role="dialog"
        aria-modal="true"
        aria-label="Full size image"
        class="modal"
        @click="handleOverlayClick"
      >
        <button
          ref="closeButtonRef"
          type="button"
          class="modal-close"
          aria-label="Close"
          @click="closeModal"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <NuxtImg :src="src" :alt="alt" class="modal-image" />
      </div>
    </teleport>
  </div>
</template>

<style scoped>
.image-trigger {
  all: unset;
  display: inline-block;
  cursor: pointer;
}

.image-trigger:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
  border-radius: 0.5rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: 2px solid transparent;
  color: white;
  font-size: 2rem;
  line-height: 1;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  border-radius: 0.25rem;
  z-index: 1001;
}

.modal-close:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.modal-close:focus-visible {
  outline: 2px solid white;
  outline-offset: 2px;
}

.modal-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  transform: scale(1.2);
  transition: transform 0.3s ease-in-out;
}

.modal-image:hover {
  transform: scale(1);
}
</style>
