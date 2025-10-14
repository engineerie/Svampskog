import { defineStore } from "pinia";

interface OnboardingState {
  selectedStartskog: number | null;
  selectedFramework: number | null;
}

export const useOnboardingStore = defineStore("onboardingStore", {
  state: (): OnboardingState => ({
    selectedStartskog: 0,
    selectedFramework: 1,
  }),
});
