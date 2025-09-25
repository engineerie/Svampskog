<template>
  <div class="">
    <div class="">
      <div class="flex gap-2 p-2 justify-end z-30">
        <!-- Remove these USelect components from the top filter bar -->
        <!--
<USelect
  v-model="selectedFilter"
  multiple
  :items="svampOptions"
  placeholder="Filtrera svamptyp"
/>
<USelect
  v-model="selectedGrupp"
  multiple
  :items="gruppOptions"
  placeholder="Filtrera grupp"
/>
<USelect
  v-model="selectedStatus"
  multiple
  :items="statusOptions"
  placeholder="Filtrera status"
/>
-->

        <!-- And add the following block in their place -->
        <div class="flex gap-2 items-end"> <template v-if="selectedFilter.length">
            <span v-for="filter in selectedFilter" :key="'svamp-' + filter">
              <UBadge trailing-icon="i-heroicons-x-mark-solid" variant="subtle"
                :color="filter === 'Matsvamp' ? 'warning' : filter === 'Giftsvamp' ? 'poison' : 'neutral'"
                class="cursor-pointer" @click="selectedFilter = selectedFilter.filter(f => f !== filter)">
                {{ capitalize(filter) }}
              </UBadge>
            </span>
          </template>
          <template v-if="selectedGrupp.length">
            <span v-for="filter in selectedGrupp" :key="'grupp-' + filter">
              <UBadge trailing-icon="i-heroicons-x-mark-solid" variant="subtle" color="neutral" class="cursor-pointer"
                @click="selectedGrupp = selectedGrupp.filter(f => f !== filter)">
                {{ capitalize(filter) }}
              </UBadge>
            </span>
          </template>
          <template v-if="selectedStatus.length">
            <span v-for="filter in selectedStatus" :key="'status-' + filter">
              <UBadge trailing-icon="i-heroicons-x-mark-solid" variant="subtle"
                :color="filter === 'Signalart' ? 'signal' : getStatusColor(filter)" class="cursor-pointer"
                @click="selectedStatus = selectedStatus.filter(f => f !== filter)">
                {{ filter === 'Signalart' ? 'Signalart' : getStatusTooltip(filter) }}
              </UBadge>
            </span>
          </template>
        </div>
        <div v-if="!isNormalView">
          <USelect v-model="rowsPerPage" :items="[10, 20, 30, 40, 50, 'Alla']" placeholder="Rader per sida" />

        </div>

        <UInput :model-value="table?.tableApi?.getState().globalFilter || ''" class="max-w-sm min-w-[12ch]"
          placeholder="Sök i tabell" @update:model-value="value => table?.tableApi?.setGlobalFilter(value)" />
      </div>
      <div v-if="filteredData" :class="[isNormalView ? '' : '']">
        <div class="">
          <!-- v-model="selectedRows" -->

          <!-- UTable with Filtered Data -->

          <UTable ref="table" v-model:pagination="pagination" :data="sortedData" :columns="columns" sticky
            :loading="isLoading" :sort="sort" @update:sort="sort = $event" @select="selectRow" :autoResetAll="true"
            :pagination-options="!isNormalView ? { getPaginationRowModel: getPaginationRowModel() } : undefined"
            :class="{ 'h-[442px]': isNormalView }" />
          <div class="flex justify-between items-center p-5 border-t-[1px] border-neutral-200 dark:border-neutral-700">
            <div class="flex h-fit shrink-0 gap-1 items-center">
              <!-- Left mini-legend -->

              <h1>
                Visar {{ startItem }} till {{ endItem }} av
                {{ totalItems }} arter
              </h1>

            </div>

            <div>
              <!-- Pagination component -->
              <div v-if="!isNormalView && rowsPerPage !== 'Alla'">
                <div class="flex justify-center">
                  <UPagination :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                    :items-per-page="table?.tableApi?.getState().pagination.pageSize"
                    :total="table?.tableApi?.getFilteredRowModel().rows.length"
                    @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="max-w-sm space-y-2 mt-2">
          <USkeleton class="h-4 w-full rounded" />
          <USkeleton class="h-4 w-[85%] rounded" />
        </div>
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, h, resolveComponent } from "vue";
import { useSpeciesStore } from "~/stores/speciesStore";
import { useEnvParamsStore } from '~/stores/envParamsStore'
import { hasEdnaDataset } from '~/utils/edna'
import { getPaginationRowModel } from '@tanstack/vue-table'

const props = defineProps({
  isNormalView: Boolean,
});

const table = useTemplateRef('table')

const svampOptions = computed(() => {
  const options = ['Matsvamp', 'Giftsvamp'];
  const counts = {};
  filteredData.value.forEach(row => {
    if (row.matsvamp == 1) {
      counts['Matsvamp'] = (counts['Matsvamp'] || 0) + 1;
    }
    if ((row.Giftsvamp || '').toLowerCase() === 'x') {
      counts['Giftsvamp'] = (counts['Giftsvamp'] || 0) + 1;
    }
  });
  return options.map(opt => ({
    label: `${opt} (${counts[opt] || 0})`,
    value: opt
  }));
});

const rowsPerPage = ref(props.isNormalView ? 500 : 10);
const selectedFilter = ref([]);
const selectedStatus = ref([]);
const selectedGrupp = ref([]);
const gruppMenuItems = computed(() => {
  return gruppOptions.value.map(option => ({
    label: option.label,
    type: 'checkbox',
    checked: selectedGrupp.value.includes(option.value),
    onUpdateChecked(checked) {
      if (checked) {
        if (!selectedGrupp.value.includes(option.value)) {
          selectedGrupp.value.push(option.value);
        }
      } else {
        selectedGrupp.value = selectedGrupp.value.filter(val => val !== option.value);
      }
    },
    onSelect(e) {
      e.preventDefault();
    }
  }));
});

const svampMenuItems = computed(() => {
  return svampOptions.value.map(option => ({
    label: option.label,
    type: 'checkbox',
    checked: selectedFilter.value.includes(option.value),
    onUpdateChecked(checked) {
      if (checked) {
        if (!selectedFilter.value.includes(option.value)) {
          selectedFilter.value.push(option.value);
        }
      } else {
        selectedFilter.value = selectedFilter.value.filter(val => val !== option.value);
      }
    },
    onSelect(e) {
      e.preventDefault();
    }
  }));
});

const statusMenuItems = computed(() => {
  return statusOptions.value.map(option => ({
    label: option.label,
    type: 'checkbox',
    checked: selectedStatus.value.includes(option.value),
    onUpdateChecked(checked) {
      if (checked) {
        if (!selectedStatus.value.includes(option.value)) {
          selectedStatus.value.push(option.value);
        }
      } else {
        selectedStatus.value = selectedStatus.value.filter(val => val !== option.value);
      }
    },
    onSelect(e) {
      e.preventDefault();
    }
  }));
});

const gruppOptions = computed(() => {
  const counts = {};
  // Iterate over filteredData (or data.value if you want counts from all data)
  filteredData.value.forEach(row => {
    const group = row["Svamp-grupp-släkte"];
    if (group) {
      counts[group] = (counts[group] || 0) + 1;
    }
  });
  // Create an options array with labels including counts
  return Object.keys(counts).map(group => ({
    label: `${capitalize(group)} (${counts[group]})`,
    value: group
  }));
});

const statusOptions = computed(() => {
  // Define the base statuses
  const statuses = ['LC', 'NT', 'EN', 'VU', 'CR', 'RE', 'DD'];

  // Initialize a counts object for each status and for 'Ej bedömd'
  const counts = {};
  // Iterate over the full data
  data.value.forEach(row => {
    const statusVal = row.RL2020kat;
    if (statuses.includes(statusVal)) {
      counts[statusVal] = (counts[statusVal] || 0) + 1;
    } else if (
      statusVal === '0' ||
      String(statusVal).toUpperCase() === 'NA' ||
      String(statusVal).toUpperCase() === 'NE'
    ) {
      counts['Ej bedömd'] = (counts['Ej bedömd'] || 0) + 1;
    }
  });

  // Compute the number of rows that have SIGNAL_art === 'S'
  const signalCount = data.value.reduce((acc, row) => {
    return acc + ((row.SIGNAL_art === 'S') ? 1 : 0);
  }, 0);

  // Build the options array with counts appended to the label
  return [
    ...statuses.map(s => ({
      label: `${getStatusTooltip(s)} (${counts[s] || 0})`,
      value: s
    })),
    { label: `Ej bedömd (${counts['Ej bedömd'] || 0})`, value: 'Ej bedömd' },
    { label: `Signalart (${signalCount})`, value: 'Signalart' }
  ];
});

const pagination = ref({
  pageIndex: 0,
  pageSize: 10
});

const speciesStore = useSpeciesStore();

function selectRow(row, e) {
  speciesStore.selectSpecies(row.original, "edna");
}

// Capitalize function for displaying the species name
const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const sampleEnvCount = computed(() => {
  return data.value.length > 0 ? data.value[0].sample_env_count : 0;
});

const getIconPath = (svampGrupp) => {
  const iconMapping = {
    övrigt: "ovrigt.webp",
    hattsvamp: "hattsvamp.png",
    kantarell: "kantarell.webp",
    sopp: "sopp.png",
    taggsvamp: "taggsvamp.png",
    fingersvamp: "fingersvamp.webp",
    tryffel: "tryffel.webp",
    skinnsvamp: "skinnsvamp.webp",
    skålsvamp: "skalsvamp.webp",
  };

  return `/images/svampgrupp/${iconMapping[svampGrupp] || "default-icon.webp"}`;
};

const getStatusColor = (status) => {
  const colors = {
    LC: "success",
    NT: "error",
    EN: "error",
    VU: "error",
    CR: "error",
    RE: "error",
    DD: "neutral",
  };
  return colors[status] || "neutral";
};

const getStatusTooltip = (status) => {
  const tooltips = {
    LC: "Livskraftig",
    NT: "Nära hotad",
    EN: "Starkt hotad",
    VU: "Sårbar",
    CR: "Akut hotad",
    RE: "Nationellt utdöd",
    DD: "Kunskapsbrist",
  };
  return tooltips[status] || "Ej bedömd";
};

const sort = ref({ column: "", direction: "asc" });

const UBadge = resolveComponent('UBadge')
const UProgress = resolveComponent('UProgress')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')


const columns = [
  {
    accessorKey: "sample_plot_count",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(
        UButton,
        {
          color: 'neutral',
          variant: 'ghost',
          label: 'Förekomst',
          icon: isSorted
            ? (isSorted === 'asc'
              ? 'i-lucide-arrow-up-narrow-wide'
              : 'i-lucide-arrow-down-wide-narrow')
            : 'i-lucide-arrow-up-down',
          class: '-mx-2.5',
          onClick: () => column.toggleSorting(isSorted === 'asc')
        }
      );
    },
    cell: ({ row, index }) => {
      const progressVal = Number(row.getValue("sample_plot_count"));
      const maxVal = Number(sampleEnvCount.value) || 100;

      return h(UProgress, {
        modelValue: progressVal,
        max: maxVal,
        // Instead of passing the color prop, use the style attribute to override the CSS variable:


        color: allColors.value[index],
        indeterminate: false,

        "onUpdate:modelValue": () => { }
      });
    }
  },
  {
    accessorKey: "Commonname",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(
        UButton,
        {
          color: 'neutral',
          variant: 'ghost',
          label: 'Namn',
          icon: isSorted
            ? (isSorted === 'asc'
              ? 'i-lucide-arrow-up-narrow-wide'
              : 'i-lucide-arrow-down-wide-narrow')
            : 'i-lucide-arrow-up-down',
          class: '-mx-2.5',
          onClick: () => column.toggleSorting(isSorted === 'asc')
        }
      );
    },
    cell: ({ row }) =>
      h('div', { class: 'text-neutral-700' }, capitalize(row.getValue("Commonname")))
  },

  {
    accessorKey: "Scientificname",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(
        UButton,
        {
          color: 'neutral',
          variant: 'ghost',
          label: 'Latinskt namn',
          icon: isSorted
            ? (isSorted === 'asc'
              ? 'i-lucide-arrow-up-narrow-wide'
              : 'i-lucide-arrow-down-wide-narrow')
            : 'i-lucide-arrow-up-down',
          class: '-mx-2.5',
          onClick: () => column.toggleSorting(isSorted === 'asc')
        }
      );
    },
    // sortable: true,
    cell: ({ row }) => `${row.getValue('Scientificname')}`

  },

  {
    accessorKey: "Svamp-grupp-släkte",
    header: () => h(UDropdownMenu, {
      items: gruppMenuItems.value,
      content: { align: 'start' },
      ui: { content: 'w-48' }
    }, {
      default: () => h(UButton, { label: 'Grupp', variant: 'ghost', color: 'neutral', icon: "i-lucide-list-filter" })
    }),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(columnId));
    },
    cell: ({ row }) => {
      const grupp = row.getValue("Svamp-grupp-släkte");
      if (grupp !== "Saknas") {
        return h('img', {
          src: getIconPath(grupp),
          alt: `${grupp || 'Svamp'} ikon`,
          class: "w-6",
          loading: 'lazy',
          decoding: 'async'
        });
      }
      return h(Icon, { name: "heroicons:x-mark-20-solid", class: "size-7" });
    }
  },
  {
    accessorKey: 'matsvamp',
    header: () => h(UDropdownMenu, {
      items: svampMenuItems.value,
      content: { align: 'start' },
      ui: { content: 'w-48' }
    }, {
      default: () => h(UButton, { label: 'Matsvamp', variant: 'ghost', color: 'neutral', icon: "i-lucide-list-filter" })
    }),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      let match = false;
      if (filterValue.includes('Matsvamp')) {
        match = match || (row.getValue(columnId) === 1);
      }
      if (filterValue.includes('Giftsvamp')) {
        match = match || ((row.original.Giftsvamp || '').toLowerCase() === 'x');
      }
      return match;
    },
    cell: ({ row }) =>
      h('div', { class: 'flex gap-1' }, [
        row.getValue('matsvamp') === 1 && h(UBadge, { color: 'warning', variant: 'subtle' }, () => 'Matsvamp'),
        row.original.Giftsvamp?.toLowerCase() === 'x' && h(UBadge, { color: 'poison', variant: 'subtle' }, () => 'Giftsvamp')
      ].filter(Boolean))
  },
  {
    accessorKey: 'RL2020kat',
    header: () => h(UDropdownMenu, {
      items: statusMenuItems.value,
      content: { align: 'start' },
      ui: { content: 'w-48' }
    }, {
      default: () => h(UButton, { label: 'Status', variant: 'ghost', color: 'neutral', icon: "i-lucide-list-filter" })
    }),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      const statusVal = row.getValue(columnId);
      return filterValue.some(filter => {
        if (filter === 'Ej bedömd') {
          return (
            statusVal === 0 ||
            statusVal === '0' ||
            String(statusVal).toUpperCase() === 'NA' ||
            String(statusVal).toUpperCase() === 'NE'
          );
        }
        if (filter === 'Signalart') {
          return row.original.SIGNAL_art === 'S';
        }
        return filter === statusVal;
      });
    },
    cell: ({ row }) => {
      const status = row.getValue('RL2020kat');
      const mainBadge = h(
        UBadge,
        { color: getStatusColor(status), variant: 'subtle' },
        () => getStatusTooltip(status)
      );
      const signalBadge =
        row.original.SIGNAL_art === 'S'
          ? h(UBadge, { color: 'signal', variant: 'subtle' }, 'Signalart')
          : null;
      return h('div', { class: 'flex gap-1' }, [mainBadge, signalBadge].filter(Boolean));
    }
  },
];

const topCount = ref(0);
const remainingCount = ref(0);

const data = ref([]);
const isLoading = ref(true);
const allColors = ref([]);

const generateColors = (start, end, steps) => {
  const stepR = (end[0] - start[0]) / (steps - 1);
  const stepG = (end[1] - start[1]) / (steps - 1);
  const stepB = (end[2] - start[2]) / (steps - 1);
  const colors = [];

  for (let i = 0; i < steps; i++) {
    const r = Math.round(start[0] + stepR * i);
    const g = Math.round(start[1] + stepG * i);
    const b = Math.round(start[2] + stepB * i);
    colors.push(`rgb(${r}, ${g}, ${b})`);
  }
  return colors;
};
const resetData = () => {
  data.value = []
  topCount.value = 0
  remainingCount.value = 0
  allColors.value = []
}

const fetchData = async () => {
  const params = [
    envStore.geography,
    envStore.forestType,
    envStore.standAge,
    envStore.vegetationType
  ]

  if (params.some(param => !param)) {
    resetData()
    isLoading.value = false
    return
  }

  if (!hasEdnaDataset(
    envStore.geography,
    envStore.forestType,
    envStore.standAge,
    envStore.vegetationType
  )) {
    resetData()
    isLoading.value = false
    return
  }

  const filename = `data-${envStore.geography}-${envStore.forestType}-${envStore.standAge}-${envStore.vegetationType}.json`
  try {
    const response = await fetch(`/edna/${filename}`)
    if (!response.ok) {
      if (response.status === 404) {
        resetData()
        isLoading.value = false
        return
      }
      throw new Error(`Failed to fetch data from ${filename}`)
    }
    data.value = await response.json()

    // Once data is fetched, turn off loading
    isLoading.value = false

    // 1) Assign each row a stable colorIndex based on its original position
    data.value.forEach((row, i) => {
      row.colorIndex = i
    })

    // 2) Figure out how many total species we have
    const totalSpecies = data.value.length

    // 3) Use your existing logic for topCount (10% in your case)
    topCount.value = Math.floor(totalSpecies * 0.1)
    remainingCount.value = totalSpecies - topCount.value

    // 4) Generate the color arrays
    const grayColors = generateColors(
      [82, 82, 82],
      [212, 212, 212],
      topCount.value
    )
    const rainbowColors = generateRainbowColors(remainingCount.value)

    // 5) Combine them into one big array
    allColors.value = [...grayColors, ...rainbowColors]
  } catch (error) {
    console.error("Error fetching data:", error)
    resetData()
    isLoading.value = false
  }
}

// Helper function to generate rainbow colors
function generateRainbowColors(steps) {
  const colors = [];
  const saturation = 70; // Adjust for vibrancy
  const lightness = 50; // Adjust for brightness

  for (let i = 0; i < steps; i++) {
    // Calculate hue from 30° (orange) to 330° (red)
    const hue = 45 + (300 / (steps - 1 || 1)) * i;
    colors.push(`hsl(${hue % 360}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
}

const envStore = useEnvParamsStore();

watch(
  () => [
    envStore.geography,
    envStore.forestType,
    envStore.standAge,
    envStore.vegetationType
  ],
  () => {
    // Clear previous data and show loading state immediately when parameters change
    resetData();
    isLoading.value = true;
    fetchData();
  },
  { immediate: true }
);

const searchQuery = ref("");


const filteredData = computed(() => {
  let result = data.value;

  // Apply any filters you have
  if (searchQuery.value) {
    result = result.filter((row) => {
      return Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });
  }

  return result;
});

const sortedData = computed(() => {
  let result = filteredData.value.slice(); // Create a shallow copy to sort

  if (sort.value && sort.value.column) {
    const column = sort.value.column;
    const direction = sort.value.direction;

    result.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      // Handle null or undefined values
      if (valueA == null && valueB != null) return 1;
      if (valueA != null && valueB == null) return -1;
      if (valueA == null && valueB == null) return 0;

      // Compare values using Swedish locale
      const comparison = String(valueA).localeCompare(String(valueB), "sv", {
        numeric: true,
        sensitivity: "base",
      });

      return direction === "asc" ? comparison : -comparison;
    });
  }

  return result;
});
// const totalItems = computed(() => filteredData.value.length);

watch(rowsPerPage, (newVal) => {
  let newPageSize =
    newVal === "Alla" ? totalItems.value || data.value.length : Number(newVal);
  // Update our reactive pagination object:
  pagination.value.pageSize = newPageSize;
  pagination.value.pageIndex = 0;
  // Force the table to update by calling its API methods:
  if (table.value?.tableApi) {
    table.value.tableApi.setPageSize(newPageSize);
    table.value.tableApi.setPageIndex(0);
  }
});

const currentPaginationRows = computed(() => {
  return table.value?.tableApi?.getPaginationRowModel().rows || [];
});

const paginationState = computed(() => table.value?.tableApi?.getState().pagination || { pageIndex: 0, pageSize: 10 });

const startItem = computed(() => {
  // Start index is based on the current page index and page size
  return (paginationState.value.pageIndex * paginationState.value.pageSize) + 1;
});

const endItem = computed(() => {
  // End index is the start plus the number of rows in the current page
  const end = (paginationState.value.pageIndex * paginationState.value.pageSize) + currentPaginationRows.value.length;
  // Ensure end doesn't exceed the total number of filtered items
  return end > totalItems.value ? totalItems.value : end;
});

const totalItems = computed(() => {
  return table.value?.tableApi?.getFilteredRowModel().rows.length || 0;
});

const columnFilters = computed(() => {
  const filters = [];
  if (selectedFilter.value && selectedFilter.value.length > 0) {
    filters.push({ id: 'matsvamp', value: selectedFilter.value });
  }
  if (selectedStatus.value && selectedStatus.value.length > 0) {
    filters.push({ id: 'RL2020kat', value: selectedStatus.value });
  }
  if (selectedGrupp.value && selectedGrupp.value.length > 0) {
    filters.push({ id: 'Svamp-grupp-släkte', value: selectedGrupp.value });
  }
  return filters;
});

watch(columnFilters, (newFilters) => {
  if (table.value?.tableApi) {
    table.value.tableApi.setColumnFilters(newFilters);
  }
});
</script>

<style scoped>
/* For Webkit browsers like Chrome, Safari */

/* Hide scrollbar for IE, Edge and Firefox */
#scrollbar {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

#scrollbar::-webkit-scrollbar-thumb {
  display: none;
  background-color: #6f202033;
  /* color of the scroll thumb */
  border-radius: 20px;
  /* roundness of the scroll thumb */
}

#scrollbar:hover::-webkit-scrollbar-thumb {
  display: block;
}

/* For Firefox */
#scrollbar {
  scrollbar-width: medium;
  scrollbar-color: #88888800 #f2f3f500;
  transition: scrollbar-color 1s ease-in-out;
  /* transition effect for Firefox */
}
</style>
