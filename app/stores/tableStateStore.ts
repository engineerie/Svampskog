import { defineStore } from 'pinia';

type TableState = {
  selectedFilter?: string[];
  selectedStatus?: string[];
  selectedGrupp?: string[];
  selectedMark?: string[];
  sorting?: Array<{ id: string; desc: boolean }>;
  rowsPerPage?: number | string;
  pagination?: { pageIndex: number; pageSize: number };
  columnVisibility?: Record<string, boolean>;
};

type TableStateMap = Record<string, TableState>;

export const useTableStateStore = defineStore('tableState', {
  state: () => ({
    tables: {} as TableStateMap,
  }),
  actions: {
    getState(key: string) {
      return this.tables[key];
    },
    setState(key: string, state: TableState) {
      this.tables[key] = {
        ...(this.tables[key] || {}),
        ...state,
      };
    },
  },
});
