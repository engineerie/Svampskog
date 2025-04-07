<template>
  <div class="cursor-pointer" @click="handleClick">
    <UBadge :label="annotation.title" color="neutral" v-if="isSelected" />
    <div class="w-full flex justify-center z-30">
      <div :class="['relative transition-all', isSelected ? 'size-10' : 'size-10']">
        <Icon :name="annotation.icon" :class="[
          'absolute transition-all z-10',
          isSelected ? 'size-10 text-green-500' : 'size-10 text-' + annotation.color,
        ]" />
        <Icon :name="annotation.iconOutline" :class="[
          'absolute transition-all z-20',
          isSelected ? 'size-10 text-white' : 'size-10 text-white',
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
