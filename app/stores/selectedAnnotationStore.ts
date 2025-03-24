// stores/selectedAnnotationStore.ts
import { defineStore } from "pinia";

export const useSelectedAnnotationStore = defineStore("selectedAnnotation", {
  state: () => ({
    selectedAnnotation: null as null | { id: string; [key: string]: any },
  }),
  actions: {
    setSelectedAnnotation(
      annotation: { id: string; [key: string]: any } | null
    ) {
      this.selectedAnnotation = annotation;
    },
    clearSelectedAnnotation() {
      this.selectedAnnotation = null;
    },
  },
});
