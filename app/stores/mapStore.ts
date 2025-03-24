import { defineStore } from "pinia";

export const useMapStore = defineStore({
  id: "map",
  state: () => ({
    lnglat: [15.448, 61.255] as [number, number], // Initialize as a tuple of [number, number]
  }),
  actions: {
    updateCoordinates(newCoordinates: [number, number]) {
      this.lnglat = newCoordinates;
    },
  },
});
