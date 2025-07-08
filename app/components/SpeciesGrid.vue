<template>
    <div class="p-2 flex gap-2">
    <UInput v-model="searchTerm" placeholder="Sök på namn" variant="soft"/>
    <USelect
      v-model="statusFilter"
      :items="statusOptionsWithCount"
      item-value="value"
      item-label="label"
      placeholder="Filtrera på status"
      multiple
      variant="soft"
    />
    <USelect
      v-model="groupFilter"
      :items="groupOptionsWithCount"
      item-value="value"
      item-label="label"
      placeholder="Filtrera på grupp"
      multiple
      variant="soft"
    />
  </div>
  <!-- min-h-[399px] -->
    <div
            class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-8 gap-4   p-2"
          >
            <div
              v-for="(row, index) in gridPaginatedData"
              :key="row.Commonname + row.Scientificname + index"
              class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700/40 hover:shadow-md transition-shadow cursor-pointer h-[126px]"
              @click="selectRow(row)"
            >
              <!-- Image Thumbnail -->
              <div class="w-full h-24 relative rounded-t-lg overflow-hidden">
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
                  class="w-full h-full flex items-center justify-center bg-neutral-200 dark:bg-neutral-700"
                >
                  <Icon
                    name="material-symbols:photo"
                    class="w-8 h-8 text-neutral-500"
                  />
                </div>
                <div class="absolute bottom-1 left-1 flex gap-1">
                    <UBadge
                    v-if="row.SIGNAL_art !== 'S' && !(['LC', '0', 'NA', 'NE', 'Saknas', null].includes(row.RL2020kat))"
                    class="bg-error-50 dark:bg-error-950/80"
                    color="error"
                    variant="subtle"
                    size="sm"
                    :label="row.RL2020kat !== 'Saknas' ? getStatusTooltip(row.RL2020kat) : 'Ej bedömd'"
                  />
                  <UBadge
                    v-if="row.SIGNAL_art === 'S'"
                    color="signal"
                    variant="subtle"
                    label="Signalart"
                    size="sm"
                  />
                  <!-- <UBadge
                    v-if="row['Nyasvamp-boken'] === 'x'"
                    color="warning"
                    variant="subtle"
                    label="Matsvamp"
                    size="sm"
                  />
                  <UBadge
                    v-if="row['Giftsvamp'] === 'x'"
                    color="poison"
                    variant="subtle"
                    label="Giftsvamp"
                    size="sm"
                  /> -->
                </div>
              </div>
              <!-- Species Names -->
              <div class="p-2 pt-1">
                <div
                  class="text-sm font-medium text-neutral-500 dark:text-neutral-300 truncate"
                >
                  {{ capitalize(row.Commonname) }}
                </div>
                <!-- <div
                  class="text-sm font-medium text-neutral-400 dark:text-neutral-300 truncate"
                >
                  {{ capitalize(row.Scientificname) }}
                </div> -->
              </div>
            </div>
          </div>
  
          <!-- GRID VIEW PAGINATION -->
          <div
            class="flex justify-between items-center px-5 py-2 "
          >
            <div>
              <p >
                Visar {{ gridStartItem }} till {{ gridEndItem }} av
                {{ totalItems }} arter
              </p>
            </div>
            <div>
                <UPagination
                :items-per-page="gridPageSize"
                v-model:page="gridPage"   
  :total="totalItems"
  

    active-variant="ghost"
                  variant="ghost"
>
</UPagination>
          
            </div>
          </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { useEnvParamsStore } from '~/stores/envParamsStore'
import { useSpeciesStore } from '~/stores/speciesStore'

const statusFilter = ref([])
const groupFilter = ref([])
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
];

// Accept the isNormalView prop (passed from the parent, e.g. RedlistedComponent)
const props = defineProps({
  isNormalView: Boolean,
  dataTypeFolder: { type: String, default: 'edna' },
  dataType: { type: String, default: 'data' },
  filterEdible: { type: Boolean, default: false },
  filterPoison: { type: Boolean, default: false },
  grupp: { type: String, default: 'Svamp-grupp' },
})

// Set up the stores
const envStore = useEnvParamsStore()
const speciesStore = useSpeciesStore()

// Data fetching using environment parameters
const data = ref([])
const isLoading = ref(true)
async function fetchData() {
  // Construct filename using the current environment parameters
  const { geography, forestType, standAge, vegetationType } = envStore
  const filename = `${props.dataType}-${geography}-${forestType}-${standAge}-${vegetationType}.json`
  try {
    const response = await fetch(`/${props.dataTypeFolder}/${filename}`)
    if (!response.ok) throw new Error(`Failed to fetch data from ${filename}`)
    data.value = await response.json()
    isLoading.value = false
  } catch (error) {
    console.error('Error fetching species data:', error)
  }
}

// Refetch data whenever any of the environment parameters change
watch(
  () => [envStore.geography, envStore.forestType, envStore.standAge, envStore.vegetationType],
  () => {
    isLoading.value = true
    fetchData()
  },
  { immediate: true }
)

// Sort the data (using RankRed as primary sorting, then Commonname)
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

// ### New: Search Functionality
// Define a reactive search term
const searchTerm = ref('')

// Compute the list after applying the search filter only
// const searchFilteredData = computed(() => {
//   let result = sortedData.value;
//   if (searchTerm.value.trim() !== '') {
//     const term = searchTerm.value.trim().toLowerCase();
//     result = result.filter(row =>
//       (row.Commonname && row.Commonname.toLowerCase().includes(term)) ||
//       (row.Scientificname && row.Scientificname.toLowerCase().includes(term))
//     );
//   }
//   return result;
// });

const baseFilteredData = computed(() => {
  let result = sortedData.value;
  if (searchTerm.value.trim() !== '') {
    const term = searchTerm.value.trim().toLowerCase();
    result = result.filter(row =>
      (row.Commonname && row.Commonname.toLowerCase().includes(term)) ||
      (row.Scientificname && row.Scientificname.toLowerCase().includes(term))
    );
  }
  if (props.filterEdible) {
    result = result.filter(row => {
      const edibleVal = row["Nyasvamp-boken"];
      return edibleVal && String(edibleVal).toLowerCase() === 'x';
    });
  } else if (props.filterPoison) {
    result = result.filter(row => {
      const edibleVal = row["Nyasvamp-boken"];
      return !(edibleVal && String(edibleVal).toLowerCase() === 'x');
    });
  }
  return result;
});

// Compute status options with counts based on searchFilteredData
const statusOptionsWithCount = computed(() => {
  return statusOptions.map(option => {
    let count = 0;
    if (option.value === 'Ej bedömd') {
      count = baseFilteredData.value.filter(row => {
        const rowStatus = String(row.RL2020kat).trim();
        return ['0', 'NA', 'NE', 'Saknas', 'null'].includes(rowStatus);
      }).length;
    } else if (option.value === 'Signalart') {
      count = baseFilteredData.value.filter(row => row.SIGNAL_art === 'S').length;
    } else {
      count = baseFilteredData.value.filter(row => {
        const rowStatus = String(row.RL2020kat).trim();
        return rowStatus === option.value;
      }).length;
    }
    return {
      ...option,
      label: `${option.label} (${count})`
    };
  });
});

const groupOptionsWithCount = computed(() => {
  const counts = {};
  baseFilteredData.value.forEach(row => {
    const raw = row[props.grupp];
    if (raw !== undefined && raw !== null) {
      const group = String(raw).trim();
      // Skip literal "undefined" or empty strings
      if (group && group.toLowerCase() !== "undefined") {
        counts[group] = (counts[group] || 0) + 1;
      }
    }
  });
  return Object.keys(counts).map(group => ({
    value: group,
    label: `${capitalize(group)} (${counts[group]})`
  }));
});

// Filter the sortedData based on the searchTerm
const filteredData = computed(() => {
  let result = sortedData.value;

  // Apply search filtering
  if (searchTerm.value.trim() !== '') {
    const term = searchTerm.value.trim().toLowerCase();
    result = result.filter(row =>
      (row.Commonname && row.Commonname.toLowerCase().includes(term)) ||
      (row.Scientificname && row.Scientificname.toLowerCase().includes(term))
    );
    console.log('After search filtering, count:', result.length);
  }

  // Apply status filtering using RL2020kat
  if (statusFilter.value.length > 0) {
    console.log('Status filter values:', statusFilter.value);
    result = result.filter(row => {
      const rowStatus = String(row.RL2020kat).trim();
      const matches = statusFilter.value.some(selected => {
        const selectedValue = (selected && selected.value) ? selected.value : selected;
        if (selectedValue === 'Ej bedömd') {
          return ['0', 'NA', 'NE', 'Saknas', 'null'].includes(rowStatus);
        } else if (selectedValue === 'Signalart') {
          return row.SIGNAL_art === 'S';
        }
        return rowStatus === selectedValue;
      });
      console.log(`Row "${row.Commonname}" with RL2020kat "${rowStatus}" matches:`, matches);
      return matches;
    });
    console.log('After status filtering, count:', result.length);
  }

  // Apply group filtering
  if (groupFilter.value.length > 0) {
    result = result.filter(row => {
      const raw = row[props.grupp];
      const rowGroup = raw !== undefined && raw !== null ? String(raw).trim() : '';
      return groupFilter.value.includes(rowGroup);
    });
  }

  // Apply edible or poisonous filtering based on props
  if (props.filterEdible) {
    result = result.filter(row => {
      // For edible species, we expect the "Nyasvamp-boken" field to equal "x" (case-insensitive)
      const edibleVal = row["Nyasvamp-boken"];
      return edibleVal && String(edibleVal).toLowerCase() === 'x';
    });
    console.log('After edible filtering, count:', result.length);
  } else if (props.filterPoison) {
    result = result.filter(row => {
      // For poisonous species, exclude those that are edible
      const edibleVal = row["Nyasvamp-boken"];
      return !(edibleVal && String(edibleVal).toLowerCase() === 'x');
    });
    console.log('After poison filtering, count:', result.length);
  }

  console.log('Final filteredData count:', result.length);
  return result;
});

// Grid pagination – adjust page size based on isNormalView
const gridPageSize = computed(() => (props.isNormalView ? 24 : 32))
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