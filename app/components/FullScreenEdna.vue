<template>
  <div class="">
    <div
      class=""
    >
      <div class="flex gap-2 p-2 justify-end z-30" >
        <div v-if="!isNormalView">
          <USelect
  v-model="rowsPerPage"
  :items="[10, 20, 30, 40, 50, 'Alla']"
  placeholder="Rader per sida"
/>
        </div>

        <UInput
  :model-value="table?.tableApi?.getState().globalFilter || ''"
  class="max-w-sm min-w-[12ch]"
  placeholder="Sök i tabell"
  @update:model-value="value => table?.tableApi?.setGlobalFilter(value)"
/>
      </div>
      <div v-if="filteredData" :class="[isNormalView ? '' : '']">
        <div class="">
          <!-- v-model="selectedRows" -->

          <!-- UTable with Filtered Data -->
         <UTable
  ref="table"
  v-model:pagination="pagination"
  :data="sortedData"
  :columns="columns"
  sticky
  :loading="isLoading"
  :sort="sort"
  @update:sort="sort = $event"
  @select="selectRow"
  :pagination-options="!isNormalView ? { getPaginationRowModel: getPaginationRowModel() } : undefined"
  :class="{ 'h-[442px]': isNormalView }"
/>
          <div
            class="flex justify-between items-center p-5 border-t-[1px] border-neutral-200 dark:border-neutral-700"
          >
            <div class="flex h-fit shrink-0 gap-1 items-center">
              <!-- Left mini-legend -->
              
              <h1
            
              >
                Visar {{ startItem }} till {{ endItem }} av
                {{ totalItems }} arter
              </h1>
          
            </div>

            <div>
              <!-- Pagination component -->
              <div v-if="!isNormalView && rowsPerPage !== 'Alla'">
                <div class="flex justify-center">
  <UPagination
    :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
    :items-per-page="table?.tableApi?.getState().pagination.pageSize"
    :total="table?.tableApi?.getFilteredRowModel().rows.length"
    @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
  />
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
import { ref, reactive, onMounted, onUnmounted, computed, watch, h, resolveComponent } from "vue";
import { useRoute } from "vue-router";
import { useSpeciesStore } from "~/stores/speciesStore";
import { useEnvParamsStore } from '~/stores/envParamsStore'
import { getPaginationRowModel } from '@tanstack/vue-table'

const props = defineProps({
  isNormalView: Boolean,
});

const table = useTemplateRef('table')

const rowsPerPage = ref(props.isNormalView ? 500 : 10);

const pagination = ref({
  pageIndex: 0,
  pageSize: 10
});

const speciesStore = useSpeciesStore();

function selectRow(row, e) {
  speciesStore.selectSpecies(row.original, "edna");
}

const color = computed(() => {
  switch (true) {
    case sampleEnvCount.value < 10:
      return "error";
    case sampleEnvCount.value < 50:
      return "warning";
    default:
      return "primary";
  }
});

// Method to strip 'detaljer' from the URL if it exists
const stripDetailsFromURL = (url) => {
  if (!url) return "";
  return url.replace("/detaljer", "").replace("/artinformation", "");
};

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
    övrigt: "BasilOther1Solid.png",
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



const route = useRoute();
const activeTab = ref("spatialForest");

const getStatusAbbreviation = (status) => {
  const abbreviations = {
    LC: "LC",
    NT: "NT", // Near Threatened
    EN: "EN", // Endangered
    VU: "VU", // Vulnerable
    CR: "CR", // Critically Endangered
    RE: "RE", // Regionally Extinct
    DD: "DD", // Data Deficient
  };
  return abbreviations[status] || "NE"; // Default case
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
const NuxtImg = resolveComponent('NuxtImg')
const UProgress = resolveComponent('UProgress')
const UButton = resolveComponent('UButton')


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

      "onUpdate:modelValue": () => {}
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
  header: ({ column }) => {
    const isSorted = column.getIsSorted();
    return h(
      UButton,
      {
        color: 'neutral',
        variant: 'ghost',
        label: 'Grupp',
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
  sortable: props.isNormalView ? false : true,
  cell: ({ row }) => {
    const grupp = row.getValue("Svamp-grupp-släkte");
    return grupp !== "Saknas"
      ? h(NuxtImg, {
          src: getIconPath(grupp),
          alt: "Svamp Icon",
          class: "w-6"
        })
      : h(Icon, { name: "heroicons:x-mark-20-solid", class: "size-7" });
  }
},
  {
  accessorKey: 'matsvamp',
  header: 'Matsvamp',
  cell: ({ row }) =>
    h('div', { class: 'flex gap-1' }, [
      row.getValue('matsvamp') === 1 && h(UBadge, { color: 'warning', variant: 'subtle' }, () => 'Matsvamp'),
      row.original.Giftsvamp?.toLowerCase() === 'x' && h(UBadge, { color: 'poison', variant: 'subtle' }, () => 'Giftsvamp')
    ].filter(Boolean))
},
{
  accessorKey: 'RL2020kat',
  header: 'Status',
  cell: ({ row }) => {
    const status = row.getValue('RL2020kat');
    const mainBadge = h(
      UBadge,
      { color: getStatusColor(status), variant: 'subtle' },
      () => getStatusTooltip(status)
    );
    // Check if SIGNAL_art is "S" and conditionally add the Signalart badge
    const signalBadge =
      row.original.SIGNAL_art === 'S'
        ? h(UBadge, { color: 'signal', variant: 'subtle' }, 'Signalart')
        : null;
    return h('div', { class: 'flex gap-1' }, [mainBadge, signalBadge].filter(Boolean));
  }
},
];

const geography = ref("");
const forestType = ref("");
const standAge = ref("");
const vegetationType = ref("");

const topCount = ref(0);
const remainingCount = ref(0);
const topPercentage = ref(0);
const remainingPercentage = ref(0);

const handleInfoUpdate = (info) => {
  topCount.value = info.topCount;
  remainingCount.value = info.remainingCount;
  topPercentage.value = info.topPercentage;
  remainingPercentage.value = info.remainingPercentage;
};

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
const fetchData = async () => {
  if (
    envStore.geography &&
    envStore.forestType &&
    envStore.standAge &&
    envStore.vegetationType
  ) {
    const filename = `data-${envStore.geography}-${envStore.forestType}-${envStore.standAge}-${envStore.vegetationType}.json`;
    try {
      const response = await fetch(`/edna/${filename}`);
      if (!response.ok)
        throw new Error(`Failed to fetch data from ${filename}`);
      data.value = await response.json();

      // Once data is fetched, turn off loading
      isLoading.value = false;

      // 1) Assign each row a stable colorIndex based on its original position
      data.value.forEach((row, i) => {
        row.colorIndex = i;
      });

      // 2) Figure out how many total species we have
      const totalSpecies = data.value.length;

      // 3) Use your existing logic for topCount (10% in your case)
      topCount.value = Math.floor(totalSpecies * 0.1);
      remainingCount.value = totalSpecies - topCount.value;

      // 4) Generate the color arrays
      const grayColors = generateColors(
        [82, 82, 82],
        [212, 212, 212],
        topCount.value
      );
      const rainbowColors = generateRainbowColors(remainingCount.value);

      // 5) Combine them into one big array
      allColors.value = [...grayColors, ...rainbowColors];
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};

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
    // Call your fetch function when any of these change:
    fetchData();
  },
  { immediate: true }
);

const searchQuery = ref("");
const page = ref(1);
const rowsPerPageOptions = [5, 10, 20, 30, 40, 50]; // Options for rows per page


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

const paginatedData = computed(() => {
  // If "All" is selected, show all rows
  if (rowsPerPage.value === "Alla") {
    return sortedData.value;
  } else {
    const start = (page.value - 1) * rowsPerPage.value;
    const end = page.value * rowsPerPage.value;
    return sortedData.value.slice(start, end);
  }
});

// Calculate totalPages only if rowsPerPage is a number
const totalPages = computed(() => {
  if (rowsPerPage.value === "Alla") {
    return 1;
  }
  return Math.ceil(totalItems.value / rowsPerPage.value);
});

const currentPaginationRows = computed(() => {
  return table.value?.tableApi?.getPaginationRowModel().rows || [];
});

const startItem = computed(() => {
  const rows = currentPaginationRows.value;
  return rows.length > 0 ? rows[0].index + 1 : 0;
});

const endItem = computed(() => {
  const rows = currentPaginationRows.value;
  return rows.length > 0 ? rows[rows.length - 1].index + 1 : 0;
});

const totalItems = computed(() => {
  return table.value?.tableApi?.getFilteredRowModel().rows.length || 0;
});
</script>

<style scoped>
/* For Webkit browsers like Chrome, Safari */

/* Hide scrollbar for IE, Edge and Firefox */
#scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

#scrollbar::-webkit-scrollbar-thumb {
  display: none;
  background-color: #6f202033; /* color of the scroll thumb */
  border-radius: 20px; /* roundness of the scroll thumb */
}

#scrollbar:hover::-webkit-scrollbar-thumb {
  display: block;
}

/* For Firefox */
#scrollbar {
  scrollbar-width: medium;
  scrollbar-color: #88888800 #f2f3f500;
  transition: scrollbar-color 1s ease-in-out; /* transition effect for Firefox */
}
</style>
