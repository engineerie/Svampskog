// DashboardInfoStore.ts

import { defineStore } from 'pinia';

export const useDashboardInfoStore = defineStore({
  id: 'dashboardInfoStore',
  state: () => ({
    RedListedMessage: ''

  }),
  actions: {
    updateRedListedMessage(message) {
      this.RedListedMessage = message;
    },
    updateEnvironmentMessage(message) {
        this.EnvironmentMessage = message;
      },
  },
});
