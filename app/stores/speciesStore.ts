import { defineStore } from "pinia";

export const useSpeciesStore = defineStore("speciesStore", {
  state: () => ({
    selectedSpecies: null,
    sourceComponent: null,
    // 1) New array to hold saved species
    savedSpecies: [],
  }),

  actions: {
    selectSpecies(speciesData, sourceComponent) {
      // If user picked the same species again, force watchers to see a change
      if (this.selectedSpecies === speciesData) {
        this.selectedSpecies = null;
        this.sourceComponent = null;
        setTimeout(() => {
          this.selectedSpecies = speciesData;
          this.sourceComponent = sourceComponent;
        }, 0);
      } else {
        this.selectedSpecies = speciesData;
        this.sourceComponent = sourceComponent;
      }
    },

    clearSelection() {
      this.selectedSpecies = null;
      this.sourceComponent = null;
    },

    // 2) Add a function to load saved species from localStorage on store init
    loadSavedSpecies() {
      try {
        const fromStorage = localStorage.getItem("savedSpecies");
        if (fromStorage) {
          this.savedSpecies = JSON.parse(fromStorage);
        }
      } catch (err) {
        console.error("Failed to parse savedSpecies from localStorage", err);
      }
    },

    // 3) Add a function to save a species to the array AND to localStorage
    addToSavedSpecies(species) {
      // Optional: check if it's already saved to avoid duplicates
      const alreadySaved = this.savedSpecies.some(
        (s) => s && s.id === species.id
      );
      if (!alreadySaved) {
        this.savedSpecies.push(species);
        this.persistSavedSpecies();
      }
    },

    // 4) Persist the saved species array
    persistSavedSpecies() {
      localStorage.setItem("savedSpecies", JSON.stringify(this.savedSpecies));
    },

    // 5) Remove from saved species (optional)
    removeFromSavedSpecies(speciesId) {
      this.savedSpecies = this.savedSpecies.filter((s) => s.id !== speciesId);
      this.persistSavedSpecies();
    },
  },
});
