<template>
  <div>
    <!-- Environment Row -->
    <div class="sm:px-2 text-lg font-semibold py-2 flex flex-wrap gap-2 sm:gap-4">
  <transition name="slide-up" mode="out-in">
    <UBadge :key="envParamsStore.geographyLabel" size="lg" color="neutral" variant="subtle">
      {{ envParamsStore.geographyLabel }}
    </UBadge>
  </transition>
  <transition name="slide-up" mode="out-in">
    <UBadge :key="envParamsStore.forestTypeLabel" size="lg" color="neutral" variant="subtle">
      {{ envParamsStore.forestTypeLabel }}
    </UBadge>
  </transition>
  <transition name="slide-up" mode="out-in">
    <UBadge :key="envParamsStore.standAgeLabel" size="lg" color="neutral" variant="subtle">
      {{ envParamsStore.standAgeLabel }}
    </UBadge>
  </transition>
  <transition name="slide-up" mode="out-in">
    <UBadge :key="envParamsStore.vegetationTypeLabel" size="lg" color="neutral" variant="subtle">
      {{ envParamsStore.vegetationTypeLabel }}
    </UBadge>
  </transition>
</div>

    <!-- Grid of species with group transition -->
    <transition mode="out-in" name="fade">
      <transition-group
        name="fade"
        tag="div"
        :key="currentFileIndex"
        class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 sm:p-2"
      >
        <div
          v-for="(row, index) in gridPaginatedData"
          :key="row.Commonname + row.Scientificname + index"
          class="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow cursor-pointer h-[184px]"
          @click="selectRow(row)"
        >
          <!-- Image Thumbnail -->
          <div class="w-full h-32 relative rounded-t-2xl overflow-hidden">
            <NuxtImg
              v-if="row.images && row.images.length"
              :src="row.images[0]"
              class="w-full h-full object-cover"
              alt="Species Image"
              height="300"
              width="450"
              format="webp"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700"
            >
              <Icon
                name="material-symbols:photo"
                class="w-8 h-8 text-neutral-500"
              />
            </div>
            <div class="absolute bottom-2 left-2 flex gap-1">
              <UBadge
                v-if="row.SIGNAL_art !== 'S' && !(['LC', '0', 'NA', 'NE', 'Saknas', null].includes(row.RL2020kat))"
                class="bg-error-50 dark:bg-error-950/80"
                color="error"
                variant="subtle"
                :label="row.RL2020kat !== 'Saknas' ? getStatusTooltip(row.RL2020kat) : 'Ej bedömd'"
              />
              <UBadge
                v-if="row.SIGNAL_art === 'S'"
                color="signal"
                variant="subtle"
                label="Signalart"
              />
              <UBadge
                v-if="row['Nyasvamp-boken'] === 'x'"
                color="warning"
                variant="subtle"
                label="Matsvamp"
              />
              <UBadge
                v-if="row['Giftsvamp'] === 'x'"
                color="poison"
                variant="subtle"
                label="Giftsvamp"
              />
            </div>
          </div>
          <!-- Species Names -->
          <div class="p-2 pt-1">
            <div class="text-md font-medium text-neutral-500 dark:text-neutral-300 truncate">
              {{ capitalize(row.Commonname) }}
            </div>
            <div class="text-sm font-medium text-neutral-400 dark:text-neutral-300 truncate">
              {{ capitalize(row.Scientificname) }}
            </div>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSpeciesStore } from '~/stores/speciesStore'
import { useEnvParamsStore } from '~/stores/envParamsStore'
import { useMediaQuery } from '@vueuse/core'

const envParamsStore = useEnvParamsStore()

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

    // Update environment parameters based on the current file
    envParamsStore.setParams(fileEnvironments[currentFileIndex.value])
  } catch (error) {
    console.error('Error fetching species data:', error)
  }
}

onMounted(() => {
  fetchData()
  intervalId = setInterval(() => {
    currentFileIndex.value = (currentFileIndex.value + 1) % edibleFiles.length
    isLoading.value = true
    fetchData()
  }, 30000)  // updated to 10 seconds
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
  transition: all 0.25s ease-out;
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