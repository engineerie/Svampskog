import { defineStore } from 'pinia';

export const useViewerStore = defineStore('viewer', {
  state: () => ({
    zoom: 1,
    center: { x: 0, y: 0 } as { x: number; y: number },
  }),
  actions: {
    setViewport(zoom: number, center: { x: number; y: number }) {
      this.zoom = zoom;
      this.center = center;
    }
  }
});