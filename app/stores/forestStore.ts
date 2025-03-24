// stores/forestStore.ts
import { defineStore } from 'pinia';

export const useForestStore = defineStore({
  id: 'forest',
  state: () => ({
    time: 'before', // Possible values: 'before', '1', '10', '20', '40', '60'
    stateOn: true,  // Tracks whether the state is 'on' or 'off'
  }),
  getters: {
    currentImage: (state) => {
      const statePrefix = state.stateOn ? 'on' : 'off';
      return `/images/${statePrefix}_${state.time}.jpg`; // Adjusted path to the image based on the state and time
    }
  }
});
