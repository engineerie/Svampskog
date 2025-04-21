<template>
  <UCard class="text-lg/8 text-neutral-500 dark:text-neutral-400 h-full" variant="naked">
    <p class="mb-2">
      I denna skogsmiljö dominerar ofta
      <span
        class="font-semibold text-neutral-600 dark:text-neutral-50 cursor-pointer"
        @click="openSpecies(speciesStore.topTwoCommon[0])"
      >
        {{ speciesStore.topTwoCommon[0]?.Commonname }}
      </span>
      <span class="italic text-neutral-500 dark:text-neutral-400">
        ({{ speciesStore.topTwoCommon[0]?.Scientificname }})
      </span>
      ,
      <span
        class="font-semibold text-neutral-600 dark:text-neutral-50 cursor-pointer"
        @click="openSpecies(speciesStore.topTwoCommon[1])"
      >
        {{ speciesStore.topTwoCommon[1]?.Commonname }}
      </span>
      <span class="italic text-neutral-500 dark:text-neutral-400">
        ({{ speciesStore.topTwoCommon[1]?.Scientificname }})
      </span>
      och
      <span
        class="font-semibold text-neutral-600 dark:text-neutral-50 cursor-pointer"
        @click="openSpecies(speciesStore.topTwoCommon[2])"
      >
        {{ speciesStore.topTwoCommon[2]?.Commonname }}
      </span>
      <span class="italic text-neutral-500 dark:text-neutral-400">
        ({{ speciesStore.topTwoCommon[2]?.Scientificname }})
      </span>
      som mycel.
    </p>
    
    <div v-if="envStore.standAge == '1-40'" class="mb-2">Oftast saknas naturvårdsarter. Undantagsvis kan enstaka förekomma. Då ofta vid lämnad naturhänsyn. </div>

    <div v-else-if="envStore.standAge === '41-90'" class="mb-2">
      Sällsynt kan naturvårdsarter som t ex
      <span
        class="font-semibold text-neutral-600 dark:text-neutral-50 cursor-pointer"
        @click="openSpecies(speciesStore.topTwoRedlisted[0])"
      >
        {{ speciesStore.topTwoRedlisted[0]?.Commonname }}
      </span>
      <span class="italic text-neutral-500 dark:text-neutral-400">
        ({{ speciesStore.topTwoRedlisted[0]?.Scientificname }})
      </span>
      och
      <span
        class="font-semibold text-neutral-600 dark:text-neutral-50 cursor-pointer"
        @click="openSpecies(speciesStore.topTwoRedlisted[1])"
      >
        {{ speciesStore.topTwoRedlisted[1]?.Commonname }}
      </span>
      <span class="italic text-neutral-500 dark:text-neutral-400">
        ({{ speciesStore.topTwoRedlisted[1]?.Scientificname }})
      </span>
      kan förekomma.
    </div>
    <div v-else-if="envStore.standAge === '91' || 'allaåldrar'" class="mb-2">
      Naturvårdsarter som t ex
      <span
        class="font-semibold text-neutral-600 dark:text-neutral-50 cursor-pointer"
        @click="openSpecies(speciesStore.topTwoRedlisted[0])"
      >
        {{ speciesStore.topTwoRedlisted[0]?.Commonname }}
      </span>
      <span class="italic text-neutral-500 dark:text-neutral-400">
        ({{ speciesStore.topTwoRedlisted[0]?.Scientificname }})
      </span>
      och
      <span
        class="font-semibold text-neutral-600 dark:text-neutral-50 cursor-pointer"
        @click="openSpecies(speciesStore.topTwoRedlisted[1])"
      >
        {{ speciesStore.topTwoRedlisted[1]?.Commonname }}
      </span>
      <span class="italic text-neutral-500 dark:text-neutral-400">
        ({{ speciesStore.topTwoRedlisted[1]?.Scientificname }})
      </span>
      kan förekomma.
    </div>
    <p class="mb-2">
      Det kan finnas många olika matsvampar. Vanliga är t ex
      <span
        class="font-semibold text-neutral-600 dark:text-neutral-50 cursor-pointer"
        @click="openSpecies(speciesStore.topTwoEdible[0])"
      >
        {{ speciesStore.topTwoEdible[0]?.Commonname }}
      </span>
      <span class="italic text-neutral-500 dark:text-neutral-400">
        ({{ speciesStore.topTwoEdible[0]?.Scientificname }})
      </span>
      och
      <span
        class="font-semibold text-neutral-600 dark:text-neutral-50 cursor-pointer"
        @click="openSpecies(speciesStore.topTwoEdible[1])"
      >
        {{ speciesStore.topTwoEdible[1]?.Commonname }}
      </span>
      <span class="italic text-neutral-500 dark:text-neutral-400">
        ({{ speciesStore.topTwoEdible[1]?.Scientificname }})
      </span>.
    </p>
  </UCard>
</template>

<script setup>
import { watch } from 'vue'
import { useEnvParamsStore } from '~/stores/envParamsStore'
import { useSpeciesDataStore } from '~/stores/speciesDataStore'
import { useSpeciesStore } from '~/stores/speciesStore'
import { capitalize } from 'lodash-es'

const envStore = useEnvParamsStore()
const speciesStore = useSpeciesDataStore()
const globalSpeciesStore = useSpeciesStore()

// Define a function to open the Myslideover with the selected species
const openSpecies = (species) => {
  if (!species) return;
  globalSpeciesStore.selectSpecies(species, 'Myslideover')
}

// Watch for changes in environment parameters and fetch edna, edible, and redlisted data accordingly
watch(
  () => [envStore.geography, envStore.forestType, envStore.standAge, envStore.vegetationType],
  ([geog, forest, age, veg]) => {
    if (geog && forest && age && veg) {
      // Fetch edna data from /edna/data-*.json for topTwoCommon
      speciesStore.fetchSpeciesData('data', 'edna')
      // Fetch edible data from /edible/edibledata-*.json for topTwoEdible
      speciesStore.fetchSpeciesData('data', 'edible')
      // Fetch redlisted data from /redlisted/redlisted-*.json for topTwoRedlisted
      speciesStore.fetchSpeciesData('data', 'redlisted')
    }
  },
  { immediate: true }
)
</script>

<style scoped>
/* Component-specific styles can go here */
</style>