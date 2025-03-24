// comparisonStore.ts
import { defineStore } from 'pinia';

export const useComparisonStore = defineStore({
  id: 'comparisonStore',
  state: () => ({
    environments: [],
    duplicateEnvironment: false, 
  }),
  actions: {
    addEnvironment(newEnvironment) {
      // Check if the environment already exists
      const isDuplicate = this.environments.some(env => {
        return JSON.stringify(env) === JSON.stringify(newEnvironment);
      });

      if (isDuplicate) {
        this.duplicateEnvironment = true; // Set the flag here
        return;
      }

      this.duplicateEnvironment = false; // Reset the flag here

      // Check for the maximum number of environments
      if (this.environments.length >= 5) {
        // Display a message to the user about max number of environments reached
        console.log('Maximum number of environments reached');
        return;
      }
      
      this.environments.push(newEnvironment);
    },
    clearDuplicateFlag() {
        console.log('clearDuplicateFlag called');  // Debugging line
        this.duplicateEnvironment = false;
      },
    clearEnvironments() {
      this.environments = [];
    },
    removeEnvironment(index) {
      this.environments.splice(index, 1);
    },
  },
});
