<template>
  <div class="cursor-pointer" @click="handleClick">
    <UBadge :label="annotation.title" color="neutral" v-if="isSelected" />
    <div class="w-full flex justify-center">
      <div :class="['relative transition-all', isSelected ? 'size-12' : 'size-12']">
        <Icon name="i-heroicons-map-pin-solid" :class="[
          'absolute  transition-all ',
          isSelected ? 'size-12 text-green-500' : 'size-12 text-neutral-600',
        ]" />
        <Icon name="i-heroicons-outline-map-pin" :class="[
          'absolute transition-all ',
          isSelected ? 'size-12 text-white' : ' size-12 text-white',
        ]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSelectedAnnotationStore } from "~/stores/selectedAnnotationStore";

interface Annotation {
  id: string;
  title: string;
  [key: string]: any;
}

const props = defineProps<{
  annotation: Annotation;
}>();

const selectedAnnotationStore = useSelectedAnnotationStore();

// Reactive computed property to check if this marker's annotation is the selected one.
const isSelected = computed(() => {
  return selectedAnnotationStore.selectedAnnotation?.id === props.annotation.id;
});

// When this marker is clicked, update the store.
function handleClick() {
  selectedAnnotationStore.setSelectedAnnotation(props.annotation);
}
</script>
