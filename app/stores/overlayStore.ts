// stores/overlayStore.ts
import { defineStore } from "pinia";

export const useOverlayStore = defineStore("overlay", {
  state: () => ({
    staticOverlayVisible: false,
  }),
  actions: {
    toggleStaticOverlay() {
      this.staticOverlayVisible = !this.staticOverlayVisible;
    },
    setStaticOverlayVisible(value: boolean) {
      this.staticOverlayVisible = value;
    },
  },
});
