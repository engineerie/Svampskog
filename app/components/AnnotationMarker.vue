<template>
  <div class="cursor-pointer" @click="handleClick">
    <UBadge :label="annotation.title" color="neutral" class="bg-neutral-800/20 backdrop-blur-2xl" v-if="isSelected" />
    <div class="w-full flex justify-center z-30">
      <div :class="['relative transition-all', isSelected ? 'size-8' : 'size-8']">
        <Icon :name="annotation.icon" :class="[
          'absolute transition-all z-8',
          isSelected ? 'size-8 text-green-500' : 'size-8 text-' + annotation.color,
        ]" />
        <Icon :name="annotation.iconOutline" :class="[
          'absolute transition-all z-20',
          isSelected ? 'size-8 text-white' : 'size-8 text-white',
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
