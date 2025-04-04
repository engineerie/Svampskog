<template>
  <!-- <UCard
    class="w-64 absolute"
    :ui="{
      rounded: 'rounded-md',
      body: {
        padding: 'p-2 sm:p-2',
      },
    }"
  >
    <NuxtImg
      width="400"
      :src="annotation.thumbnail"
      :alt="annotation.title"
      class="rounded-md w-fit border border-neutral-200"
    />
    <div class="p-1">
      <h3 class="text-lg font-medium text-neutral-800">
        {{ annotation.title }}
      </h3>
      <p class="text-md font-normal text-neutral-500">
        {{ annotation.text }}
      </p>
      <UButton
        size="xs"
        class="close-button absolute top-4 right-4 shadow"
        color="white"
        icon="i-heroicons-x-mark-solid"
        :ui="{ rounded: 'rounded-full' }"
        @click="closePopup"
      />
    </div>
  </UCard> -->
</template>

<!-- <script setup>
import { useAnnotationStore } from "~/stores/annotationStore";

const props = defineProps({
  annotation: {
    type: Object,
    required: true,
  },
});

const annotationStore = useAnnotationStore();

function closePopup() {
  console.log("[AnnotationPopup] closePopup button clicked.");
  // When the user clicks Close, update the store.
  annotationStore.closePopup();
  // Optionally log after store update.
  console.log(
    "[AnnotationPopup] annotationStore.activeAnnotation:",
    annotationStore.activeAnnotation
  );
}
</script> -->
