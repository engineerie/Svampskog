<template>
  <div>
    <!-- Header with title, filters and view toggle -->
    <div class="flex justify-between items-end">
      <div class="flex gap-4">
        <UIcon
          name="material-symbols:award-star-outline"
          class="h-10 w-10 text-teal-500 ml-4"
        />

        <h1 class="text-neutral-800 dark:text-neutral-300 text-3xl">
          Naturvårdsarter
        </h1>
        <UTabs
      v-model="activeTab"
      :items="items"
      variant="link"
      color="neutral"
    />
        <UBadge
          v-if="!isNormalView"
          class="truncate h-fit"
          size="lg"
          color="amber"
          variant="subtle"
          :ui="{ rounded: 'rounded-lg' }"
          ><Icon
            name="lineicons:mushroom-1"
            class="size-6 text-amber-500 mr-1"
          />Enligt samlad kunskap, främst var fruktkroppar förekommer
        </UBadge>
      </div>

      <!-- New: Grid/table view toggle -->

      <div class="flex gap-2 items-end mb-2">
        <UButton
          size="lg"
          :color="props.isNormalView ? 'white' : 'rose'"
          :icon="
            props.isNormalView
              ? 'material-symbols:open-in-full'
              : 'material-symbols:close-fullscreen'
          "
          :ui="{ rounded: 'rounded-full' }"
          @click="$emit(props.isNormalView ? 'enlarge' : 'close')"
        />
      </div>
    </div>

    <!-- Main content: switch between table view and grid view -->
    <div class="p-2">
      <div class="flex gap-2 p-2 justify-end z-30" v-if="!isNormalView">
        <USelectMenu
          :ui="{ rounded: 'rounded-full' }"
          v-model="rowsPerPage"
          :options="[10, 20, 30, 40, 50, 'Alla']"
          placeholder="Rader per sida"
        />

        <USelectMenu
          v-model="selectedMark"
          :options="markOptions"
          placeholder="Välj marktyp"
          label="Marktyp"
       
        />
        <UInput
         
          icon="i-heroicons-magnifying-glass-20-solid"
          v-model="searchQuery"
          placeholder="Sök i tabell"
        />
      </div>

      <!-- TABLE VIEW -->
      <div v-if="isTableView">
        <div v-if="filteredData" :class="[isNormalView ? '' : 'border-t']">
          <UTable
            :loading="isLoading"
            :loading-state="{
              icon: 'i-heroicons-arrow-path-20-solid',
              label: 'Laddar',
            }"
            :class="{
              'min-h-[415px]': isNormalView,
              '': !isNormalView,
            }"
            :sort-button="{
              color: 'text-neutral-700 dark:text-neutral-300',
              size: 'xl',
            }"
            :ui="computedUITable"
            :columns="selectedColumns"
            :rows="paginatedData"
            @select="selectRow"
            v-model:sort="sort"
            sort-mode="manual"
            :key="route.fullPath"
          >
            <template #empty-state>
              <div class="flex flex-col items-center justify-center py-6 gap-3">
                <span class="italic text-sm">
                  Inga naturvårdsarter att visa i denna miljön
                </span>
              </div>
            </template>
            <template #image-data="{ row }">
              <NuxtImg
                v-if="row.images && row.images.length"
                :src="row.images[0]"
                class="size-12 object-cover -my-4 rounded-lg border border-neutral-200"
                alt="Species Image"
                height="300"
                width="450"
                format="webp"
              />
              <div
                v-else
                class="size-12 -my-4 rounded-lg flex items-center justify-center bg-gray-200 dark:bg-gray-700"
              >
                <Icon
                  name="material-symbols:photo"
                  class="size-5 text-neutral-500"
                />
              </div>
            </template>
            <template #RL2020kat-data="{ row }">
              <div class="flex items-center space-x-2">
                <UBadge
                  v-if="row.SIGNAL_art !== 'S'"
                  color="rose"
                  variant="subtle"
                  size="xs"
                  :label="
                    row.RL2020kat !== 'Saknas'
                      ? getStatusTooltip(row.RL2020kat)
                      : 'Ej bedömd'
                  "
                />

                <UBadge
                  v-if="row.SIGNAL_art === 'S'"
                  color="gray"
                  variant="solid"
                  size="xs"
                  label="Signalart"
                />
                <!-- <div
                  v-if="row.SIGNAL_art !== 'S'"
                  :class="getStatusColor(row.RL2020kat)"
                  class="h-8 w-8 rounded-full flex items-center justify-center text-white z-0 max-w-12"
                  data-nui-tooltip-position="right"
                  :data-nui-tooltip="
                    row['RL2020kat'] !== 'Saknas'
                      ? getStatusTooltip(row.RL2020kat)
                      : 'Ej bedömd'
                  "
                >
                  {{ getStatusAbbreviation(row.RL2020kat) }}
                </div>
                <div v-if="row.SIGNAL_art === 'S'" class="relative">
                  <div
                    class="h-8 w-8 rounded-full bg-neutral-500 opacity-100 flex items-center justify-center text-white z-10"
                    data-nui-tooltip-position="right"
                    :data-nui-tooltip="'Signalart'"
                  >
                    S
                  </div>
                </div> -->
              </div>
            </template>
            <template #Commonname-data="{ row }">
              <div class="truncate">
                {{ capitalize(row.Commonname) }}
                <span class="italic text-neutral-400" v-if="props.isNormalView">
                  ({{ capitalize(row.Scientificname) }})
                </span>
              </div>
            </template>
            <template #Scientificname-data="{ row }">
              <div class="italic text-neutral-400">
                {{ row.Scientificname }}
              </div>
            </template>
            <template #Mark-data="{ row }">
              <div class="flex items-center space-x-1">
                <div v-if="row.KALKmark">
                  <UBadge color="amber" variant="subtle"> Kalkmark </UBadge>
                </div>
                <div v-if="row.ANNANmark">
                  <UBadge color="emerald" variant="subtle">
                    Vanlig skogsmark
                  </UBadge>
                </div>
              </div>
            </template>
            <template #OVANLIGHET-data="{ row }">
              <div
                v-if="row.OVANLIGHET == 2"
                data-nui-tooltip-position="left"
                :data-nui-tooltip="'Väldigt sällsynt'"
                class="ml-2"
              >
                <Icon
                  name="material-symbols:star-rounded"
                  class="w-8 h-8 text-teal-500"
                />
              </div>
            </template>
            <template #Svamp-grupp-data="{ row }">
              <div
                data-nui-tooltip-position="left"
                :data-nui-tooltip="capitalize(row['Svamp-grupp'])"
                class="ml-2"
              >
                <NuxtImg
                  :src="getIconPath(row['Svamp-grupp'])"
                  class="w-5"
                  alt="Svamp Icon"
                />
              </div>
            </template>
            <template #RankRed-data="{ row }">
              <div class="px-2 w-32">
                <UProgress
                  max="3"
                  :value="getInvertedRankValue(row.RankRed)"
                  :color="getColorForRank(row.RankRed)"
                  size="md"
                  data-nui-tooltip-position="right"
                  :data-nui-tooltip="getRankTooltip(row.RankRed)"
                />
              </div>
            </template>
          </UTable>
          <div
            class="flex justify-between items-center p-5 border-t-[1px] border-neutral-200 dark:border-neutral-800"
          >
            <div>
              <p class="text-sm">
                Visar {{ startItem }} till {{ endItem }} av
                {{ totalItems }} arter
              </p>
            </div>
            <div v-if="rowsPerPage !== 'Alla'">
              <UPagination
                :max="2"
                v-model="page"
                :page-count="rowsPerPage"
                :total="totalItems"
                :ui="{
                  wrapper: 'flex items-center gap-1',
                  rounded: '!rounded-full min-w-[32px] justify-center px-4',
                  default: {},
                }"
                size="lg"
              >
                <template #prev="{ onClick }">
                  <UButton
                    icon="i-heroicons-chevron-left-20-solid"
                    size="lg"
                    color="white"
                    :ui="{ rounded: 'rounded-full dark:border-neutral-800' }"
                    class="rtl:[&_span:first-child]:rotate-180 dark:bg-neutral-900 border-[0.5px]"
                    @click="onClick"
                  />
                </template>
                <template #next="{ onClick }">
                  <UButton
                    icon="i-heroicons-chevron-right-20-solid"
                    size="lg"
                    color="white"
                    :ui="{ rounded: 'rounded-full dark:border-neutral-800' }"
                    class="rtl:[&_span:last-child]:rotate-180 dark:bg-neutral-900 border-[0.5px]"
                    @click="onClick"
                  />
                </template>
              </UPagination>
            </div>
          </div>
        </div>
      </div>

      <!-- GRID VIEW -->
      <div v-else>
        <div
          :class="[
            'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4  min-h-[399px] ',
            props.isNormalView ? 'md:grid-cols-6' : 'md:grid-cols-6 border-t',
          ]"
        >
          <div
            v-for="(row, index) in gridPaginatedData"
            :key="row.Commonname + row.Scientificname + index"
            class="bg-white dark:bg-neutral-800 rounded-2xl shadow hover:shadow-md transition-shadow cursor-pointer h-[184px]"
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
                <!-- <div
                  v-if="row.SIGNAL_art !== 'S'"
                  :class="getStatusColor(row.RL2020kat)"
                  class="h-8 w-8 rounded-full flex items-center justify-center text-white z-0 max-w-12"
                  data-nui-tooltip-position="right"
                  :data-nui-tooltip="
                    row.RL2020kat !== 'Saknas'
                      ? getStatusTooltip(row.RL2020kat)
                      : 'Ej bedömd'
                  "
                >
                  {{ getStatusAbbreviation(row.RL2020kat) }}
                </div> -->
                <UBadge
                  v-if="row.SIGNAL_art !== 'S'"
                  color="rose"
                  variant="subtle"
                  size="xs"
                  :label="
                    row.RL2020kat !== 'Saknas'
                      ? getStatusTooltip(row.RL2020kat)
                      : 'Ej bedömd'
                  "
                />

                <UBadge
                  v-if="row.SIGNAL_art === 'S'"
                  color="gray"
                  variant="solid"
                  size="xs"
                  label="Signalart"
                />
              </div>
            </div>
            <!-- Species Names -->
            <div class="p-2 pt-1">
              <div
                class="text-md font-medium text-neutral-500 dark:text-neutral-300 truncate"
              >
                {{ capitalize(row.Commonname) }}
              </div>
              <div
                class="text-sm font-medium text-neutral-400 dark:text-neutral-300 truncate"
              >
                {{ capitalize(row.Scientificname) }}
              </div>
            </div>
          </div>
        </div>

        <!-- GRID VIEW PAGINATION -->
        <div
          class="flex justify-between items-center "
        >
          <div>
            <p class="text-sm">
              Visar {{ gridStartItem }} till {{ gridEndItem }} av
              {{ totalItems }} arter
            </p>
          </div>
          <div>
            <UPagination
              v-model="gridPage"
              :page-count="gridPageSize"
              :total="totalItems"
             
         
            >
              <!-- <template #prev="{ onClick }">
                <UButton
                  icon="i-heroicons-chevron-left-20-solid"
          
                  color="white"
                  :ui="{ rounded: 'rounded-full dark:border-neutral-800' }"
                  class="rtl:[&_span:first-child]:rotate-180 dark:bg-neutral-900 border-[0.5px]"
                  @click="onClick"
                />
              </template>
              <template #next="{ onClick }">
                <UButton
                  icon="i-heroicons-chevron-right-20-solid"
                  size="lg"
            
                  :ui="{ rounded: 'rounded-full dark:border-neutral-800' }"
                  class="rtl:[&_span:last-child]:rotate-180 dark:bg-neutral-900 border-[0.5px]"
                  @click="onClick"
                />
              </template> -->
            </UPagination>
          </div>
        </div>
      </div>
      <!-- End of grid view -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useSpeciesStore } from "~/stores/speciesStore";

const items = [
  {
    label: "Galleri",
    icon: "i-heroicons-squares-2x2",
    value: "grid",
  },
  {
    label: "Tabell",
    icon: "material-symbols:table-outline",
    value: "table",
  },
];

// --- View Toggle ---
const activeTab = ref("grid");
const isTableView = computed(() => activeTab.value === "table");

// Create a computed property that converts between the index and the custom value
const selectedIndex = computed({
  get() {
    // Find the index of the active tab value in the items array.
    const index = items.findIndex((item) => item.value === activeView.value);
    return index === -1 ? 0 : index;
  },
  set(index) {
    // Update your custom active tab value based on the new index.
    activeView.value = items[index].value;
  },
});

// --- Props and UI Config ---
const props = defineProps({ isNormalView: Boolean });
console.log("isNormalView in FullscreenRedlisted:", props.isNormalView);

const computedUITable = computed(() => ({
  thead: !props.isNormalView
    ? "sticky top-12 bg-white dark:bg-neutral-800 dark:bg-opacity-100 shadow-sm shadow-neutral-300 dark:shadow-neutral-700 z-10"
    : " bg-white dark:bg-neutral-800 dark:bg-opacity-100 shadow-sm shadow-neutral-300 dark:shadow-neutral-700 z-10",
  wrapper: { base: "" },

  td: {
    base: "",
    padding: "py-6 pl-6",
    size: "text-md",
    color: "text-neutral-500 dark:text-neutral-400",
  },
  th: { padding: "pt-4 pl-6" },
  tr: {
    padding: "pl-12",
    base: "overflow-hidden",
    selected: "bg-neutral-100 dark:bg-neutral-900",
    active:
      "hover:bg-neutral-100 dark:hover:bg-neutral-800 active:bg-neutral-200 dark:active:bg-neutral-900",
  },
}));

// --- Drag and Info Box ---
const selectedRows = ref([]);
const boxPosition = reactive({ top: 100, left: 100 });
const isDragging = ref(false);
const dragOffset = reactive({ x: 0, y: 0 });

function startDrag(event) {
  isDragging.value = true;
  const boxRect = event.target.getBoundingClientRect();
  dragOffset.x = event.clientX - boxRect.left;
  dragOffset.y = event.clientY - boxRect.top;
}
function stopDrag() {
  isDragging.value = false;
}
function drag(event) {
  if (isDragging.value) {
    boxPosition.left = event.clientX - dragOffset.x;
    boxPosition.top = event.clientY - dragOffset.y;
  }
}
onMounted(() => {
  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);
});
onUnmounted(() => {
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
});
function closeInfoBox() {
  selectedRows.value = [];
}

// --- Species Store & Selection ---
const speciesStore = useSpeciesStore();
function selectRow(row) {
  speciesStore.selectSpecies(row, "redlisted");
}

// --- Utility Functions ---
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function getInvertedRankValue(rank) {
  return !rank ? 0 : 4 - rank;
}
function getRankTooltip(rank) {
  switch (rank) {
    case 1:
      return "Många fynd";
    case 2:
      return "Färre fynd";
    case 3:
      return "Få fynd";
    default:
      return "";
  }
}
function getColorForRank(rank) {
  switch (rank) {
    case 1:
      return "yellow";
    case 2:
      return "amber";
    case 3:
      return "orange";
    default:
      return "neutral";
  }
}
const getStatusAbbreviation = (status) => {
  const abbreviations = {
    LC: "LC",
    NT: "NT",
    EN: "EN",
    VU: "VU",
    CR: "CR",
    RE: "RE",
    DD: "DD",
  };
  return abbreviations[status] || "NE";
};
const getStatusColor = (status) => {
  const colors = {
    LC: "bg-green-500",
    NT: "bg-[#D7838E]",
    EN: "bg-[#C4004F]",
    VU: "bg-[#D7838E]",
    CR: "bg-[#C4004F]",
    RE: "bg-[#421A31]",
    DD: "bg-[#E8E9E7]",
  };
  return colors[status] || "bg-[#EAB61F]";
};
const getStatusTooltip = (status) => {
  const tooltips = {
    LC: "Nära hotad",
    NT: "Nära hotad",
    EN: "Starkt hotad",
    VU: "Sårbar",
    CR: "Akut hotad",
    RE: "Nationellt utdöd",
    DD: "Kunskapsbrist",
  };
  return tooltips[status] || "Ej bedömd";
};
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

// --- Data Fetching & Filtering ---
const route = useRoute();
const geography = ref("");
const forestType = ref("");
const standAge = ref("");
const vegetationType = ref("");
const data = ref([]);
const isLoading = ref(true);
async function fetchData(geography, forestType, standAge, vegetationType) {
  const filename = `redlisted-${geography}-${forestType}-${standAge}-${vegetationType}.json`;
  try {
    const response = await fetch(`/redlisted/${filename}`);
    if (!response.ok) throw new Error(`Failed to fetch data from ${filename}`);
    data.value = await response.json();
    isLoading.value = false;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
watch(
  () => route.params,
  (params) => {
    isLoading.value = true;
    const { geography, forestType, standAge, vegetationType } = params;
    if (geography && forestType && standAge && vegetationType) {
      fetchData(geography, forestType, standAge, vegetationType);
    }
  },
  { immediate: true }
);
watch(
  () => route.params,
  (params) => {
    geography.value = params.geography || "default-value";
    forestType.value = params.forestType || "default-value";
    standAge.value = params.standAge || "default-value";
    vegetationType.value = params.vegetationType || "default-value";
  },
  { immediate: true }
);

const searchQuery = ref("");
const page = ref(1);
const rowsPerPage = ref(props.isNormalView ? 5 : 10);
const markOptions = [
  { id: "all", label: "Alla marker", value: null },
  { id: "kalkmark", label: "Kalkmark", value: "KALKmark" },
  { id: "annanmark", label: "Vanlig skogsmark", value: "ANNANmark" },
];
const selectedMark = ref(markOptions[0]);
const filteredData = computed(() => {
  let result = data.value;
  if (selectedMark.value && selectedMark.value.value !== null) {
    result = result.filter((row) => row[selectedMark.value.value] != null);
  }
  if (searchQuery.value) {
    result = result.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    );
  }
  return result;
});
const sortedData = computed(() => {
  let result = filteredData.value.slice();
  if (sort.value?.column) {
    const { column, direction } = sort.value;
    result.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];
      if (valueA == null && valueB != null) return 1;
      if (valueA != null && valueB == null) return -1;
      if (valueA == null && valueB == null) return 0;
      const comparison = String(valueA).localeCompare(String(valueB), "sv", {
        numeric: true,
        sensitivity: "base",
      });
      return direction === "asc" ? comparison : -comparison;
    });
  } else {
    result.sort((a, b) => {
      const rankA = a.RankRed ?? 99999;
      const rankB = b.RankRed ?? 99999;
      if (rankA !== rankB) return rankA - rankB;
      const nameA = a.Commonname?.toString().toLowerCase() || "";
      const nameB = b.Commonname?.toString().toLowerCase() || "";
      return nameA.localeCompare(nameB, "sv", {
        numeric: true,
        sensitivity: "base",
      });
    });
  }
  return result;
});
const totalItems = computed(() => sortedData.value.length);
const startItem = computed(() => {
  if (rowsPerPage.value === "Alla") return totalItems.value > 0 ? 1 : 0;
  return (page.value - 1) * rowsPerPage.value + 1;
});
const endItem = computed(() => {
  if (rowsPerPage.value === "Alla") return totalItems.value;
  return Math.min(page.value * rowsPerPage.value, totalItems.value);
});

// --- Add Computed for Table Pagination ---
const paginatedData = computed(() => {
  if (rowsPerPage.value === "Alla") {
    return sortedData.value;
  } else {
    const start = (page.value - 1) * rowsPerPage.value;
    const end = page.value * rowsPerPage.value;
    return sortedData.value.slice(start, end);
  }
});

// --- Grid View Pagination ---
const gridPageSize = computed(() => (props.isNormalView ? 12 : 24));
const gridPage = ref(1);
const gridPaginatedData = computed(() => {
  const start = (gridPage.value - 1) * gridPageSize.value;
  return sortedData.value.slice(start, start + gridPageSize.value);
});
const gridStartItem = computed(() =>
  sortedData.value.length > 0
    ? (gridPage.value - 1) * gridPageSize.value + 1
    : 0
);
const gridEndItem = computed(() =>
  Math.min(gridPage.value * gridPageSize.value, sortedData.value.length)
);

const sort = ref({ column: "", direction: "asc" });

const imageColumn = {
  key: "image",
  label: "",
  sortable: false,
};

const columns = [
  {
    key: "RL2020kat",
    label: "Status",
    sortable: props.isNormalView ? false : true,
  },
  {
    key: "Commonname",
    label: "Namn",
    sortable: props.isNormalView ? false : true,
  },
  {
    key: "Scientificname",
    label: "Latinskt namn",
    sortable: props.isNormalView ? false : true,
  },
  { key: "Mark", label: "Mark", sortable: props.isNormalView ? false : true },
  {
    key: "OVANLIGHET",
    label: "Extra ovanlig",
    sortable: props.isNormalView ? false : true,
  },
  {
    key: "Svamp-grupp",
    label: "Grupp",
    sortable: props.isNormalView ? false : true,
  },
  { key: "RankRed", label: "Antal fynd", sortable: true },
];
const isRare = ref(false);
const toggleRare = () => {
  isRare.value = !isRare.value;
};
const selectedColumns = computed(() =>
  [
    imageColumn,
    columns[0],
    columns[1],
    !props.isNormalView ? columns[2] : null,

    columns[3],
    isRare.value ? columns[4] : null,
    columns[5],

    !props.isNormalView ? columns[6] : null,
  ].filter((col) => col !== null)
);
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
