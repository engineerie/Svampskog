// useTitleStore.ts
import { defineStore } from 'pinia';

export const useTitleStore = defineStore('titleStore', {
  state: () => ({
    title: 'Default Title',
  }),
  actions: {
    setTitle(newTitle: string) {
      this.title = newTitle;
    },
  },
});
