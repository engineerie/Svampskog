type ComponentName = 'EdnaComponent' | 'RedlistedComponent' | 'FullscreenEdible' | 'FullscreenPoison';

import { defineStore } from 'pinia';

export const useTabsStore = defineStore('tabs', {
  state: () => ({
    // Store individual active tab state for each component
    componentTabs: {
      EdnaComponent: 'columnChart',
      RedlistedComponent: 'grid',
      FullscreenEdible: 'grid',
      FullscreenPoison: 'grid',
    } as Record<ComponentName, string>,
  }),
  getters: {
    // Getter to retrieve the active tab for a given component by name.
    getActiveTab: (state) => {
      return (componentName: ComponentName) => state.componentTabs[componentName] || 'grid';
    },
  },
  actions: {
    // Action to update the active tab for a component.
    setActiveTab(componentName: ComponentName, tabValue: string) {
      this.componentTabs[componentName] = tabValue;
    },
  },
});