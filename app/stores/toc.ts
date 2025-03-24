import { defineStore } from "pinia";

export const useTocStore = defineStore("toc", {
  state: () => ({
    items: [] as Array<{ id: string; text: string }>,
  }),
  actions: {
    setItems(newItems: Array<{ id: string; text: string }>) {
      this.items = newItems;
    },
  },
});
