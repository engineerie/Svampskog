import { defineStore } from 'pinia';
import { useEnvParamsStore } from '~/stores/envParamsStore';

interface SpeciesDataSet {
  data: any[];
  isLoading: boolean;
  error: string | null;
}

interface SpeciesDataState {
  edna: SpeciesDataSet;
  edible: SpeciesDataSet;
  redlisted: SpeciesDataSet;
}

export const useSpeciesDataStore = defineStore('speciesData', {
  state: (): SpeciesDataState => ({
    edna: {
      data: [],
      isLoading: false,
      error: null,
    },
    edible: {
      data: [],
      isLoading: false,
      error: null,
    },
    redlisted: {
      data: [],
      isLoading: false,
      error: null,
    },
  }),
  actions: {
    async fetchSpeciesData(dataType: string, dataTypeFolder: 'edna' | 'edible' | 'redlisted') {
      const envStore = useEnvParamsStore();
      if (
        envStore.geography &&
        envStore.forestType &&
        envStore.standAge &&
        envStore.vegetationType
      ) {
        // Set prefix based on dataTypeFolder: use 'data' for edna, 'edibledata' for edible, and 'redlisted' for redlisted
        const prefix =
          dataTypeFolder === 'edible'
            ? 'edibledata'
            : dataTypeFolder === 'redlisted'
            ? 'redlisted'
            : 'edna';
        const filename = `${prefix}-${envStore.geography}-${envStore.forestType}-${envStore.standAge}-${envStore.vegetationType}.json`;
        this[dataTypeFolder].isLoading = true;
        try {
          const response = await fetch(`/${dataTypeFolder}/${filename}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch data from ${filename}`);
          }
          const jsonData = await response.json();
          // Process the data: assign a stable colorIndex
          jsonData.forEach((row: any, i: number) => {
            row.colorIndex = i;
          });
          this[dataTypeFolder].data = jsonData;
          this[dataTypeFolder].error = null;
        } catch (error: any) {
          console.error("Error fetching species data:", error);
          this[dataTypeFolder].error = error.message || 'Unknown error';
          this[dataTypeFolder].data = [];
        } finally {
          this[dataTypeFolder].isLoading = false;
        }
      }
    },
  },
  getters: {
    // Top two edible species: filter on 'Nyasvamp-boken' equals "x",
    // then sort ascending by 'Rank matsvamp' and alphabetically by Commonname.
    topTwoEdible(state): any[] {
      const edibleData = state.edible.data.filter(row => row['Nyasvamp-boken'] === 'x');
      const sorted = [...edibleData].sort((a, b) => {
        const rankA = Number(a['Rank matsvamp']) || 0;
        const rankB = Number(b['Rank matsvamp']) || 0;
        if (rankA !== rankB) return rankA - rankB; // lower rank first
        const nameA = (a.Commonname || '').toLowerCase();
        const nameB = (b.Commonname || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
      return sorted.slice(0, 2);
    },
    // Top two redlisted species: filter out entries with RL2020kat equal to "0" or "LC",
    // then sort ascending by 'RankRed' and, within the same rank, sort alphabetically by Commonname.
    topTwoRedlisted(state): any[] {
      const redlistedData = state.redlisted.data.filter(row => {
        const status = row.RL2020kat;
        return status && status !== "0" && status !== "LC";
      });
      const sorted = [...redlistedData].sort((a, b) => {
        const rankA = Number(a.RankRed) || 0;
        const rankB = Number(b.RankRed) || 0;
        if (rankA !== rankB) return rankA - rankB; // lower RankRed first
        const nameA = (a.Commonname || '').toLowerCase();
        const nameB = (b.Commonname || '').toLowerCase();
        return nameA.localeCompare(nameB); // alphabetical order if RankRed is equal
      });
      return sorted.slice(0, 2);
    },
    // Top two common species from edna: simply return the first two entries
    topTwoCommon(state): any[] {
      return state.edna.data.slice(0, 3);
    },
    // Derive sampleEnvCount from edible data
    sampleEnvCount(state): number {
      return state.edible.data.length > 0 ? Number(state.edible.data[0].sample_env_count) : 0;
    },
  },
});