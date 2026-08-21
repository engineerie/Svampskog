import { defineStore } from 'pinia'

type SpeciesRecord = Record<string, unknown> & {
  Scientificname?: string | null
  SpeciesCode?: string | null
  id?: string | number | null
}

type SpeciesStoreState = {
  selectedSpecies: SpeciesRecord | null
  sourceComponent: string | null
  pendingScientificname: string | null
  enrichmentRequestId: number
  savedSpecies: SpeciesRecord[]
}

const enrichedSpeciesCache = new Map<string, SpeciesRecord>()

export const useSpeciesStore = defineStore('speciesStore', {
  state: (): SpeciesStoreState => ({
    selectedSpecies: null,
    sourceComponent: null,
    pendingScientificname: null,
    enrichmentRequestId: 0,
    // 1) New array to hold saved species
    savedSpecies: []
  }),

  actions: {
    selectSpecies(speciesData: SpeciesRecord, sourceComponent: string) {
      const requestId = ++this.enrichmentRequestId

      // If user picked the same species again, force watchers to see a change
      if (this.selectedSpecies === speciesData) {
        this.selectedSpecies = null
        this.sourceComponent = null
        setTimeout(() => {
          this.selectedSpecies = speciesData
          this.sourceComponent = sourceComponent
          if (sourceComponent === 'edna') {
            this.enrichSelectedSpecies(speciesData, requestId)
          }
        }, 0)
      } else {
        this.selectedSpecies = speciesData
        this.sourceComponent = sourceComponent
        if (sourceComponent === 'edna') {
          this.enrichSelectedSpecies(speciesData, requestId)
        }
      }
    },

    async enrichSelectedSpecies(speciesData: SpeciesRecord, requestId: number) {
      const scientificName = String(speciesData?.Scientificname || '').trim()
      if (!scientificName) return

      const speciesCode = String(speciesData?.SpeciesCode || '').trim()
      const cacheKey = speciesCode || scientificName.toLocaleLowerCase('sv-SE')

      try {
        let enrichedSpecies = enrichedSpeciesCache.get(cacheKey)
        if (!enrichedSpecies) {
          enrichedSpecies = await $fetch<SpeciesRecord>('/api/species-details', {
            query: { scientificName, speciesCode: speciesCode || undefined }
          })
          enrichedSpeciesCache.set(cacheKey, enrichedSpecies)
        }

        if (
          requestId !== this.enrichmentRequestId
          || this.sourceComponent !== 'edna'
        ) {
          return
        }

        this.selectedSpecies = {
          ...speciesData,
          ...enrichedSpecies
        }
      } catch (error: unknown) {
        const fetchError = error as { statusCode?: number, response?: { status?: number } }
        const statusCode = fetchError.statusCode || fetchError.response?.status
        if (statusCode !== 404) {
          console.error(`Failed to enrich species data for ${scientificName}`, error)
        }
      }
    },

    clearSelection() {
      this.enrichmentRequestId++
      this.selectedSpecies = null
      this.sourceComponent = null
    },

    // 2) Add a function to load saved species from localStorage on store init
    loadSavedSpecies() {
      try {
        const fromStorage = localStorage.getItem('savedSpecies')
        if (fromStorage) {
          this.savedSpecies = JSON.parse(fromStorage)
        }
      } catch (err) {
        console.error('Failed to parse savedSpecies from localStorage', err)
      }
    },

    // 3) Add a function to save a species to the array AND to localStorage
    addToSavedSpecies(species: SpeciesRecord) {
      // Optional: check if it's already saved to avoid duplicates
      const alreadySaved = this.savedSpecies.some(
        s => s && s.id === species.id
      )
      if (!alreadySaved) {
        this.savedSpecies.push(species)
        this.persistSavedSpecies()
      }
    },

    // 4) Persist the saved species array
    persistSavedSpecies() {
      localStorage.setItem('savedSpecies', JSON.stringify(this.savedSpecies))
    },

    // 5) Remove from saved species (optional)
    removeFromSavedSpecies(speciesId: string | number) {
      this.savedSpecies = this.savedSpecies.filter(s => s.id !== speciesId)
      this.persistSavedSpecies()
    }
  }
})
