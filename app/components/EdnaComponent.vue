<template>
  <div>


    <UCard class="rounded-none sm:rounded-lg" variant="ghost">

      <!-- Header / List View -->

      <div class="md:flex justify-between relative">
        <UButton color="neutral" variant="soft" size="xl" @click="$emit('enlarge')"
          :class="isNormalView ? 'hidden' : 'md:hidden'" :icon="isNormalView ? '' : 'i-heroicons-x-mark-solid'"
          class="rounded-full absolute top-0 right-0" />
        <div class="md:flex gap-4">
          <div class=" md:mt-0 mt-1 mb-1 md:mb-2">

            <div class="text-3xl font-medium flex items-center text-secondary-500">
              <UIcon name="solar:dna-linear" class="mr-2" />
              <h1 class="truncate">Alla mykorrhizasvampar</h1>
            </div>
            <div class="flex gap-2">
              <h1 class="text-md text-neutral-500">{{ speciesCountLabel }} arter baserat på {{ sampleEnvCount }} skogar</h1>
              <UBadge v-if="sampleEnvCount < 10" :icon="sampleEnvCount < 10 ? 'i-cuida-warning-outline' : undefined"
                size="md" :color="sampleEnvCount < 10 ? 'warning' : 'secondary'" variant="subtle" class="h-fit flex ">
                {{ sampleEnvCount < 10 ? 'Få prov' : null }} </UBadge>
            </div>

          </div>

          <!-- <div class="flex gap-2">
            <UModal fullscreen title="Diagram" :ui="{
              body: 'pt-0',
            }">
              <template #body>
                <EnvironmentSelector :initialMobileCollapsed="true" />
                <UButton variant="ghost" size="md" @click="showBarChart = !showBarChart"
                  :label="showBarChart ? 'Dölj diagram' : 'Visa diagram'" class="mb-2 hidden md:block" />
                <BarChart v-if="showBarChart" class="mb-2" :chartData="data" :chartWidth="chartWidth"
                  :geography="geographyValue" :forestType="forestTypeValue" :standAge="standAgeValue"
                  :vegetationType="vegetationTypeValue" :matsvampFilter="matsvampFilter"
                  :giftsvampFilter="giftsvampFilter" :gruppFilter="gruppFilter" :statusFilter="statusFilter"
                  :search-term="modalSearchTerm" />
                <SpeciesTable class="mt-2" @enlarge="emit('enlarge')" @update:matsvampFilter="matsvampFilter = $event"
                  @update:giftsvampFilter="giftsvampFilter = $event" @update:gruppFilter="gruppFilter = $event"
                  @update:statusFilter="statusFilter = $event" @update:searchTerm="modalSearchTerm = $event"
                  :isNormalView="isNormalView" :column-visibility-overrides="columnVisibilityOverrides"
                  :search-term="modalSearchTerm" />
              </template>
</UModal>
</div> -->
          <div class=" justify-between hidden">
            <UTabs v-model="activeTab" :items="items" class="w-full" color="neutral" variant="link"
              :unmount-on-hide="false" />
          </div>

        </div>
        <div class="flex gap-3 items-start">
          <!-- <UBadge
          v-if="!isNormalView" 
          icon="solar:dna-linear"
          size="lg"
          color="secondary"
          variant="subtle"
          label="Enligt DNA från markinventeringens provytor"
          class="h-fit hidden md:flex"
        />    -->

          <!-- <UBadge
          :icon="sampleEnvCount < 10 ? 'i-cuida-warning-outline' : undefined"
          size="lg"
          :color="sampleEnvCount < 10 ? 'warning' : 'secondary'"
          variant="subtle"
          class="h-fit hidden md:flex"
        >
          {{ sampleEnvCount < 10 ? 'Lågt provantal: ' + sampleEnvCount + ' skogar' : 'Baserat på ' + sampleEnvCount + ' skogar' }}
        </UBadge> -->
          <div class="hidden md:flex flex-col items-start gap-2">
            <!-- <UButton class="h-fit ring-muted/60" color="neutral" variant="outline" size="sm"
              @click="showBarChart = !showBarChart" :label="showBarChart ? 'Dölj diagram' : 'Visa diagram'" /> -->
            <div class="flex flex-col gap-2">
              <p class="text-xs font-semibold uppercase tracking-wide text-neutral-500">Snabbfilter</p>
              <div class="flex flex-wrap gap-2">
                <UButton size="md" :variant="quickFilter === 'matsvamp' ? 'solid' : 'outline'" color="warning"
                  @click="toggleQuickFilter('matsvamp')" label="Matsvampar" />
                <UButton size="md" :variant="quickFilter === 'naturvard' ? 'solid' : 'outline'" color="signal"
                  @click="toggleQuickFilter('naturvard')" label="Naturvårdssvampar" />
                <UButton size="md" :variant="quickFilter === 'syns' ? 'solid' : 'outline'" color="neutral"
                  @click="toggleQuickFilter('syns')" label="Svampar som syns" />
              </div>
            </div>
          </div>

          <!-- <UButton
        class="hidden md:flex h-fit"
        color="neutral"
        variant="ghost"
          size="lg"
          :icon="isNormalView ? 'material-symbols:open-in-full' : 'material-symbols:close-fullscreen'"
          @click="$emit('enlarge')"
        /> -->
        </div>
      </div>

      <!-- FullScreenEdna (if spatialForest tab is active) -->
      <!-- <FullScreenEdna v-if="activeTab === 'spatialForest'" :isNormalView="isNormalView" /> -->
      <transition name="fade" mode="out-in" class="md:min-h-[550px] min-h-full">
        <div v-if="activeTab === 'spatialForest'" class="">
          <!-- <UButton
        class="md:hidden block absolute bottom-0 right-0"
        color="primary"
        variant="ghost"
        label="Visa alla"
        size="xl"
        
          @click="$emit('enlarge')"
        /> -->
          <SpeciesTable @enlarge="emit('enlarge')" @update:sorting="tableSorting = $event"
            @update:visibleRange="tableVisibleRange = $event" :isNormalView="isNormalView"
            :column-visibility-overrides="columnVisibilityOverrides" :externalMatsvampFilter="externalMatsvampFilter"
            :externalStatusFilter="externalStatusFilter" :externalGruppFilter="externalGruppFilter"
            :search-term="effectiveSearchTerm" @update:searchTerm="handleSearchUpdate" :enablePagination="true"
            tableKey="edna" />
        </div>

        <div v-else-if="activeTab === 'columnChart'" class="">

          <div ref="barChartRef">
            <BarChart class="mb-6" v-if="showBarChart" :chartData="data" :chartWidth="chartWidth"
              :geography="geographyValue" :forestType="forestTypeValue" :standAge="standAgeValue"
              :vegetationType="vegetationTypeValue" :matsvampFilter="matsvampFilter" :giftsvampFilter="giftsvampFilter"
              :gruppFilter="gruppFilter" :statusFilter="statusFilter" :search-term="effectiveSearchTerm"
              :sort-order="tableSorting" :visible-range="tableVisibleRange" />
          </div>
          <SpeciesTable @enlarge="emit('enlarge')" @update:matsvampFilter="matsvampFilter = $event"
            @update:giftsvampFilter="giftsvampFilter = $event" @update:gruppFilter="gruppFilter = $event"
            @update:statusFilter="statusFilter = $event" @update:searchTerm="handleSearchUpdate"
            @update:sorting="tableSorting = $event" @update:visibleRange="tableVisibleRange = $event"
            :isNormalView="isNormalView" :column-visibility-overrides="columnVisibilityOverrides"
            :search-term="effectiveSearchTerm" :externalMatsvampFilter="externalMatsvampFilter"
            :externalStatusFilter="externalStatusFilter" :externalGruppFilter="externalGruppFilter"
            :enablePagination="true" tableKey="edna" />
        </div>
      </transition>

    </UCard>
    <transition name="fold-down">
      <UContainer v-if="isBarChartSticky && showBarChart && activeTab === 'columnChart' && !isSmallScreen"
        class="shadow hidden md:block fixed top-0 pt-16 z-20 bg-neutral-50 dark:bg-black border-b border-x rounded-xl border-neutral-200 dark:border-neutral-800 left-0 right-0">
        <div class="w-full mx-auto max-w-7xl py-2 px-4">
          <BarChart :chartData="data" :chartWidth="chartWidth" :chartHeight="40" :showControls="false"
            :showYAxis="false" :showTooltip="false" :geography="geographyValue" :forestType="forestTypeValue"
            :standAge="standAgeValue"
            :vegetationType="vegetationTypeValue" :matsvampFilter="matsvampFilter" :giftsvampFilter="giftsvampFilter"
            :gruppFilter="gruppFilter" :statusFilter="statusFilter" :search-term="effectiveSearchTerm"
            :sort-order="tableSorting" :visible-range="tableVisibleRange" />
        </div>
      </UContainer>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, toRefs } from "vue";
import { useMediaQuery } from '@vueuse/core';
import { useEnvParamsStore } from "~/stores/envParamsStore";
import { storeToRefs } from "pinia";
import { useTabsStore } from '~/stores/tabsStore';
import { hasEdnaDataset } from '~/utils/edna';

const matsvampFilter = ref(false);
const giftsvampFilter = ref(false);
const gruppFilter = ref<string[]>([]);
const statusFilter = ref<string[]>([]);
const quickFilter = ref<'matsvamp' | 'naturvard' | 'syns' | null>(null);



const localSearchTerm = ref('');
const tableSorting = ref<Array<{ id: string; desc: boolean }>>([]);
const tableVisibleRange = ref<{ startIndex: number; endIndex: number; total: number } | null>(null);
const showBarChart = ref(true);
const isBarChartSticky = ref(false);
const barChartRef = ref<HTMLElement | null>(null);
let barChartObserver: IntersectionObserver | null = null;
let barChartObservedEl: HTMLElement | null = null;

const props = defineProps<{ isNormalView: boolean; searchTerm?: string; isActive?: boolean }>();
const { isNormalView } = toRefs(props);
const emit = defineEmits<{ (e: "enlarge"): void; (e: "update:searchTerm", value: string): void }>();

const effectiveSearchTerm = computed(() => props.searchTerm ?? localSearchTerm.value);

function handleSearchUpdate(value: string) {
  if (props.searchTerm !== undefined) {
    emit('update:searchTerm', value);
    return;
  }
  localSearchTerm.value = value;
}

const tabsStore = useTabsStore();
const activeTab = computed({
  get: () => isSmallScreen.value ? 'spatialForest' : tabsStore.getActiveTab("EdnaComponent"),
  set: (val) => {
    if (!isSmallScreen.value) {
      tabsStore.setActiveTab("EdnaComponent", val);
    }
  }
});

const items = [
  { label: "Diagram", icon: "material-symbols:bar-chart", value: "columnChart" },
  { label: "Tabell", icon: "material-symbols:table-outline", value: "spatialForest" },
];

// Use the environment store.
const envStore = useEnvParamsStore();
const { geography, forestType, standAge, vegetationType } = storeToRefs(envStore);

// Expose store values as computed (for passing down to BarChart).
const geographyValue = computed(() => geography.value);
const forestTypeValue = computed(() => forestType.value);
const standAgeValue = computed(() => standAge.value);
const vegetationTypeValue = computed(() => vegetationType.value);

// Data for chart fetched based on environment.
const data = ref<any[]>([]);
const totalSpecies = computed(() => data.value.length);
const sampleEnvCount = computed(() =>
  data.value.length > 0 ? data.value[0].sample_env_count || 0 : 0
);
const filteredSpeciesCount = computed(() => tableVisibleRange.value?.total ?? totalSpecies.value);
const isFiltered = computed(() => filteredSpeciesCount.value !== totalSpecies.value);
const speciesCountLabel = computed(() =>
  isFiltered.value
    ? `${filteredSpeciesCount.value} av ${totalSpecies.value}`
    : `${totalSpecies.value}`
);
const chartWidth = ref("100%");

// hide image column on small (mobile) screens
const isSmallScreen = useMediaQuery('(max-width: 767px)');
const columnVisibilityOverrides = computed(() => ({
  mark: false,
  ...(isSmallScreen.value ? { images: false } : {})
}));

const naturvardsStatuses = ['VU', 'NT', 'EN', 'CR', 'DD', 'Signalart'];
const synligaGruppFilter = computed(() => {
  const excluded = new Set(['skinnsvamp', 'skinnsvampar', 'tryffel', 'tryfflar']);
  const map = new Map<string, string>();
  data.value.forEach(row => {
    const group = row?.['Svamp-grupp-släkte'];
    if (!group) return;
    const normalized = String(group)
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}+/gu, '');
    if (Array.from(excluded).some(entry => normalized.includes(entry))) return;
    if (!map.has(normalized)) map.set(normalized, String(group));
  });
  return Array.from(map.values());
});

const externalMatsvampFilter = computed(() => quickFilter.value === 'matsvamp');
const externalStatusFilter = computed(() =>
  quickFilter.value === 'naturvard' ? naturvardsStatuses : []
);
const externalGruppFilter = computed(() =>
  quickFilter.value === 'syns' ? synligaGruppFilter.value : []
);

function toggleQuickFilter(type: 'matsvamp' | 'naturvard' | 'syns') {
  quickFilter.value = quickFilter.value === type ? null : type;
}

watch(quickFilter, (val) => {
  if (val === 'matsvamp') {
    matsvampFilter.value = true;
    giftsvampFilter.value = false;
    statusFilter.value = [];
    gruppFilter.value = [];
    return;
  }
  if (val === 'naturvard') {
    matsvampFilter.value = false;
    giftsvampFilter.value = false;
    statusFilter.value = [...naturvardsStatuses];
    gruppFilter.value = [];
    return;
  }
  if (val === 'syns') {
    matsvampFilter.value = false;
    giftsvampFilter.value = false;
    statusFilter.value = [];
    gruppFilter.value = [...synligaGruppFilter.value];
    return;
  }
  matsvampFilter.value = false;
  giftsvampFilter.value = false;
  statusFilter.value = [];
  gruppFilter.value = [];
}, { immediate: true });

watch(synligaGruppFilter, (val) => {
  if (quickFilter.value === 'syns') {
    gruppFilter.value = [...val];
  }
});

function cleanupBarChartObserver() {
  if (barChartObserver && barChartObservedEl) {
    barChartObserver.unobserve(barChartObservedEl);
  }
  barChartObservedEl = null;
  barChartObserver = null;
}

function setupBarChartObserver() {
  cleanupBarChartObserver();
  if (!barChartRef.value) return;
  barChartObserver = new IntersectionObserver(
    ([entry]) => {
      isBarChartSticky.value = !(entry?.isIntersecting ?? true);
    },
    { threshold: 0, rootMargin: '-180px 0px 0px 0px' }
  );
  barChartObserver.observe(barChartRef.value);
  barChartObservedEl = barChartRef.value;
}

onMounted(() => {
  setupBarChartObserver();
});

onBeforeUnmount(() => {
  cleanupBarChartObserver();
});

watch(
  [() => barChartRef.value, () => activeTab.value, () => showBarChart.value, () => isSmallScreen.value, () => props.isActive],
  ([element, tab, isVisible, isSmall, isActive]) => {
    if (!element || tab !== 'columnChart' || !isVisible || isSmall || isActive === false) {
      isBarChartSticky.value = false;
      cleanupBarChartObserver();
      return;
    }
    setupBarChartObserver();
  },
  { immediate: true }
);

// Fetch data when environment store values change.
async function fetchData(geog: string, forest: string, age: string, veg: string) {
  if (!geog || !forest || !age || !veg) {
    data.value = []
    return
  }

  if (!hasEdnaDataset(geog, forest, age, veg)) {
    data.value = []
    return
  }
  const filename = `edna-${geog}-${forest}-${age}-${veg}.json`;
  try {
    const response = await fetch(`/edna/${filename}`);
    if (!response.ok) {
      if (response.status === 404) {
        data.value = []
        return
      }
      throw new Error(`Failed to fetch ${filename}`)
    }
    const jsonData = await response.json();
    jsonData.sort((a: any, b: any) => b.sample_plot_count - a.sample_plot_count);
    data.value = jsonData;
  } catch (error) {
    console.error("Error fetching data:", error);
    data.value = [];
  }
}

// When store values change, fetch new data.
watch(
  () => [geography.value, forestType.value, standAge.value, vegetationType.value],
  ([geog, forest, age, veg]) => {
    if (geog && forest && age && veg) {
      fetchData(geog, forest, age, veg);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fold-down-enter-active,
.fold-down-leave-active {
  transition: transform 0.3s ease;
}

.fold-down-enter-from,
.fold-down-leave-to {
  transform: translateY(-100%);
}

.fold-down-enter-to,
.fold-down-leave-from {
  transform: translateY(0);
}
</style>
