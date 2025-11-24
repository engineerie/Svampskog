<template>
  <div>
    <!-- Environment Row -->
    <div class="sm:px-2 text-lg font-semibold py-2 flex overflow-hidden   gap-2 sm:gap-4 w-full">
      <transition name="slide-up" mode="out-in">
        <UBadge :key="currentEnvLabels.geography" size="lg" color="neutral" variant="soft" class="shrink-0">
          {{ currentEnvLabels.geography }}
        </UBadge>
      </transition>
      <transition name="slide-up" mode="out-in">
        <UBadge :key="currentEnvLabels.forestType" size="lg" color="neutral" variant="soft" class="shrink-0">
          {{ currentEnvLabels.forestType }}
        </UBadge>
      </transition>
      <transition name="slide-up" mode="out-in">
        <UBadge :key="currentEnvLabels.standAge" size="lg" color="neutral" variant="soft" class="shrink-0">
          {{ currentEnvLabels.standAge }}
        </UBadge>
      </transition>
      <transition name="slide-up" mode="out-in">
        <UBadge :key="currentEnvLabels.vegetationType" size="lg" color="neutral" variant="soft" class="shrink-0">
          {{ currentEnvLabels.vegetationType }}
        </UBadge>
      </transition>
    </div>

    <!-- Grid of species with group transition -->
    <transition mode="out-in" name="fade">
      <transition-group name="fade" tag="div" :key="currentFileIndex"
        class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 sm:p-2">
        <div v-for="(row, index) in gridPaginatedData" :key="row.Commonname + row.Scientificname + index"
          class="group relative bg-white overflow-hidden rounded-lg border border-muted/50 h-[142px] transition-transform duration-200 hover:scale-[1.03]"
          @click="selectRow(row)">
          <div class="w-full h-full relative overflow-hidden">
            <img v-if="row.images && row.images.length" :src="row.images[0]"
              class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
              alt="Species image" height="300" width="450" loading="lazy" decoding="async" />
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <Icon name="material-symbols:photo" class="w-8 h-8 text-neutral-500" />
            </div>
            <div
              class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            </div>
            <UBadge variant="outline" color="neutral"
              class="ring-muted/50 pointer-events-none absolute left-2 bottom-2 opacity-0 group-hover:opacity-100 transition duration-200">
              {{ capitalize(row.Commonname) }}
            </UBadge>
          </div>
        </div>
      </transition-group>
    </transition>

    <!-- GRID VIEW PAGINATION (currently commented out) -->
    <!--
    <div class="flex justify-between items-center px-5 py-2">
      <div>
        <p>
          Visar {{ gridStartItem }} till {{ gridEndItem }} av {{ totalItems }} arter
        </p>
      </div>
      <div>
        <UPagination
          :items-per-page="gridPageSize"
          v-model:page="gridPage"   
          :total="totalItems"
          active-variant="ghost"
          variant="ghost"
        />
      </div>
    </div>
    -->
    <!-- Animated progress bar -->
    <div class="mt-2 px-4">
      <div class="w-full bg-gray-200 dark:bg-gray-700 h-0.5 rounded overflow-hidden">
        <div :key="currentFileIndex" class="h-1 bg-primary-500 rounded animate-progress"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSpeciesStore } from '~/stores/speciesStore'
import {
  geographyOptions,
  forestTypeOptions,
  standAgeOptions,
  vegetationTypeOptions,
} from '~/stores/envParamsStore'
import { useMediaQuery } from '@vueuse/core'

// Define props used in the component
const props = defineProps({
  filterEdible: {
    type: Boolean,
    default: false
  },
  filterPoison: {
    type: Boolean,
    default: false
  },
  isNormalView: {
    type: Boolean,
    default: true
  },
  dataTypeFolder: {
    type: String,
    default: 'edible'
  }
})

const statusFilter = ref([])
const statusOptions = [
  { value: "LC", label: 'Livskraftig' },
  { value: "NT", label: 'Nära hotad' },
  { value: "EN", label: 'Starkt hotad' },
  { value: "VU", label: 'Sårbar' },
  { value: "CR", label: 'Akut hotad' },
  { value: "RE", label: 'Nationellt utdöd' },
  { value: "DD", label: 'Kunskapsbrist' },
  { value: "Ej bedömd", label: 'Ej bedömd' },
  { value: "Signalart", label: "Signalart" }
]

const speciesStore = useSpeciesStore()

// Define edible JSON files to cycle through.
const edibleFiles = [
  '/redlisted/redlisted-Söder-EkBokskog-91-Örter_grupp.json',
  '/edible/edibledata-Söder-Tallskog-1-40-Lingon_grupp.json',
  '/redlisted/redlisted-Norr-Granskog-41-90-Blåbär_grupp.json',
  // '/edible/edibledata-Norr-Barrblandskog-allaåldrar-Lingon_grupp.json',
]

// Map each JSON file to its corresponding environment parameters.
const fileEnvironments = [
  { geography: "Söder", forestType: "EkBokskog", standAge: "91", vegetationType: "Örter_grupp" },
  { geography: "Söder", forestType: "Tallskog", standAge: "1-40", vegetationType: "Lingon_grupp" },
  { geography: "Norr", forestType: "Granskog", standAge: "41-90", vegetationType: "Blåbär_grupp" }
]

const currentFileIndex = ref(0)
const data = ref([])
const isLoading = ref(true)
let intervalId = null


async function fetchData() {
  const url = edibleFiles[currentFileIndex.value]
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to fetch data from ${url}`)
    data.value = await response.json()
    isLoading.value = false

  } catch (error) {
    console.error('Error fetching species data:', error)
  }
}

const currentEnvironment = computed(() => fileEnvironments[currentFileIndex.value])

const currentEnvLabels = computed(() => {
  const geography = geographyOptions.find(option => option.value === currentEnvironment.value?.geography)
  const forestType = forestTypeOptions.find(option => option.value === currentEnvironment.value?.forestType)
  const standAge = standAgeOptions.find(option => option.value === currentEnvironment.value?.standAge)
  const vegetationType = vegetationTypeOptions.find(option => option.value === currentEnvironment.value?.vegetationType)

  return {
    geography: geography?.label || currentEnvironment.value?.geography || '',
    forestType: forestType?.label || currentEnvironment.value?.forestType || '',
    standAge: standAge?.label || currentEnvironment.value?.standAge || '',
    vegetationType: vegetationType?.label || currentEnvironment.value?.vegetationType || '',
  }
})

onMounted(async () => {
  // Fetch initial data
  await fetchData()
  // Cycle data every 30 seconds
  intervalId = setInterval(async () => {
    currentFileIndex.value = (currentFileIndex.value + 1) % edibleFiles.length
    isLoading.value = true
    await fetchData()
  }, 15000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

// Sorting: use RankRed as primary sort and then Commonname.
const sort = ref({ column: '', direction: 'asc' })
const sortedData = computed(() => {
  let result = data.value.slice()
  if (sort.value?.column) {
    const { column, direction } = sort.value
    result.sort((a, b) => {
      const valueA = a[column]
      const valueB = b[column]
      if (valueA == null && valueB != null) return 1
      if (valueA != null && valueB == null) return -1
      if (valueA == null && valueB == null) return 0
      const comparison = String(valueA).localeCompare(String(valueB), 'sv', {
        numeric: true,
        sensitivity: 'base'
      })
      return direction === 'asc' ? comparison : -comparison
    })
  } else {
    result.sort((a, b) => {
      const rankA = a.RankRed ?? 99999
      const rankB = b.RankRed ?? 99999
      if (rankA !== rankB) return rankA - rankB
      const nameA = a.Commonname?.toString().toLowerCase() || ''
      const nameB = b.Commonname?.toString().toLowerCase() || ''
      return nameA.localeCompare(nameB, 'sv', { numeric: true, sensitivity: 'base' })
    })
  }
  return result
})

// New: Search functionality
const searchTerm = ref('')
const baseFilteredData = computed(() => {
  let result = sortedData.value
  if (searchTerm.value.trim() !== '') {
    const term = searchTerm.value.trim().toLowerCase()
    result = result.filter(row =>
      (row.Commonname && row.Commonname.toLowerCase().includes(term)) ||
      (row.Scientificname && row.Scientificname.toLowerCase().includes(term))
    )
  }
  if (props.filterEdible) {
    result = result.filter(row => {
      const edibleVal = row["Nyasvamp-boken"]
      return edibleVal && String(edibleVal).toLowerCase() === 'x'
    })
  } else if (props.filterPoison) {
    result = result.filter(row => {
      const edibleVal = row["Nyasvamp-boken"]
      return !(edibleVal && String(edibleVal).toLowerCase() === 'x')
    })
  }
  return result
})

// Compute status options with counts based on baseFilteredData
const statusOptionsWithCount = computed(() => {
  return statusOptions.map(option => {
    let count = 0
    if (option.value === 'Ej bedömd') {
      count = baseFilteredData.value.filter(row => {
        const rowStatus = String(row.RL2020kat).trim()
        return ['0', 'NA', 'NE', 'Saknas', 'null'].includes(rowStatus)
      }).length
    } else if (option.value === 'Signalart') {
      count = baseFilteredData.value.filter(row => row.SIGNAL_art === 'S').length
    } else {
      count = baseFilteredData.value.filter(row => {
        const rowStatus = String(row.RL2020kat).trim()
        return rowStatus === option.value
      }).length
    }
    return {
      ...option,
      label: `${option.label} (${count})`
    }
  })
})

// Filter the sortedData based on the searchTerm and statusFilter
const filteredData = computed(() => {
  let result = sortedData.value
  if (searchTerm.value.trim() !== '') {
    const term = searchTerm.value.trim().toLowerCase()
    result = result.filter(row =>
      (row.Commonname && row.Commonname.toLowerCase().includes(term)) ||
      (row.Scientificname && row.Scientificname.toLowerCase().includes(term))
    )
  }
  if (statusFilter.value.length > 0) {
    result = result.filter(row => {
      const rowStatus = String(row.RL2020kat).trim()
      return statusFilter.value.some(selected => {
        const selectedValue = (selected && selected.value) ? selected.value : selected
        if (selectedValue === 'Ej bedömd') {
          return ['0', 'NA', 'NE', 'Saknas', 'null'].includes(rowStatus)
        } else if (selectedValue === 'Signalart') {
          return row.SIGNAL_art === 'S'
        }
        return rowStatus === selectedValue
      })
    })
  }
  // Only include rows with images
  result = result.filter(row => row.images && row.images.length > 0)
  return result
})

// Grid pagination – adjust page size based on isNormalView prop
const isSmallScreen = useMediaQuery('(max-width: 640px)')
const gridPageSize = computed(() => isSmallScreen.value ? 4 : 6)
const gridPage = ref(1)
const gridPaginatedData = computed(() => {
  const start = (gridPage.value - 1) * gridPageSize.value
  return filteredData.value.slice(start, start + gridPageSize.value)
})
const gridStartItem = computed(() =>
  filteredData.value.length > 0 ? (gridPage.value - 1) * gridPageSize.value + 1 : 0
)
const gridEndItem = computed(() =>
  Math.min(gridPage.value * gridPageSize.value, filteredData.value.length)
)
const totalItems = computed(() => filteredData.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / gridPageSize.value))

// Utility function to capitalize species names
function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Utility function to get the status tooltip
function getStatusTooltip(status) {
  const tooltips = {
    LC: 'Livskraftig',
    NT: 'Nära hotad',
    EN: 'Starkt hotad',
    VU: 'Sårbar',
    CR: 'Akut hotad',
    RE: 'Nationellt utdöd',
    DD: 'Kunskapsbrist'
  }
  return tooltips[status] || 'Ej bedömd'
}

// Handle row click: Pass the selected row to the SpeciesStore (to open the slideover)
function selectRow(row) {
  speciesStore.selectSpecies(row, props.dataTypeFolder)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease, transform 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;

}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>

<style scoped>
@keyframes progressAnimation {
  from {
    width: 0%;
  }

  to {
    width: 100%;
  }
}

.animate-progress {
  width: 100%;
  animation: progressAnimation 15s linear forwards;
}
</style>
