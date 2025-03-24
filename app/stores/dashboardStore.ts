import { defineStore } from 'pinia';

export const useDashboardStore = defineStore({
    id: 'dashboard',
    state: () => ({
        selectedOptions: {
            geography: null,
            forestType: null,
            vegetationType: null,
            standAge: null
        },
    }),
    actions: {
        setSelectedOptions(options) {
            this.selectedOptions = options;
        },
    },
});
