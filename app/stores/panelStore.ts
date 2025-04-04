// stores/panelStore.js
import { defineStore } from "pinia";

export const usePanelStore = defineStore("panel", {
  state: () => ({
    isPanelMinimized: false,
  }),
  actions: {
    togglePanel() {
      this.isPanelMinimized = !this.isPanelMinimized;
    },
    setPanelMinimized(value: boolean) {
      this.isPanelMinimized = value;
    },
  },
});
