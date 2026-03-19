<template>
  <div>
    <UCard class="rounded-none sm:rounded-lg " variant="ghost">
      <div class="md:flex justify-between relative">
        <UButton color="neutral" variant="soft" size="xl" :class="isNormalView ? 'hidden' : 'md:hidden'"
          :icon="isNormalView ? '' : 'i-heroicons-x-mark-solid'" class="rounded-full absolute top-0 right-0"
          @click="$emit('enlarge')" />
        <div class="md:flex gap-4 w-full">
          <div class=" md:mt-0 mt-1  md:mb-2 w-full">
            <div class="flex w-full justify-between gap-3">
              <div>
                <div class="text-3xl font-medium flex items-center text-secondary-500 min-w-0">
                  <UIcon name="solar:dna-linear" class="mr-2" />
                  <h1 class="truncate">
                    Alla mykorrhizasvampar
                  </h1>
                </div>
                <div class="flex gap-2">
                  <h1 class="text-md text-neutral-500">
                    {{ speciesCountLabel }} arter baserat på {{ sampleEnvCount }}
                    skogar
                  </h1>
                  <UBadge v-if="sampleEnvCount < 10" :icon="sampleEnvCount < 10 ? 'i-cuida-warning-outline' : undefined"
                    size="md" :color="sampleEnvCount < 10 ? 'warning' : 'secondary'" variant="subtle"
                    class="h-fit flex ">
                    {{ sampleEnvCount < 10 ? 'Få prov' : null }} </UBadge>
                </div>
              </div>

              <!-- <div class="absolute -top-2 right-0 flex flex-col justify-end">
                <UTabs
                  v-if="showBarChart && activeTab === 'columnChart' && !isSmallScreen"
                  v-model="chartTypeTab"
                  :items="chartTypeTabs"
                  size="md"
                  :ui="{
                    root: '',
                    list: 'flex-nowrap gap-2 bg-transparent',
                    indicator: 'bg-white border border-muted/50 shadow',
                    trigger: 'data-[state=active]:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                  }"
                />
                <div class="w-full flex justify-end">
                  <USelect
                    v-if="showBarChart && activeTab === 'columnChart' && chartTypeTab === 'treemap' && !isSmallScreen"
                    v-model="treemapGroupingMode"
                    :items="treemapGroupingOptions"
                    item-value="value"
                    item-label="label"
                    class="ring-muted/50 w-fit"
                    :ui="{ content: 'min-w-fit' }"
                  >
                    <template #default="{ ui }">
                      <span
                        v-if="selectedTreemapGroupingItem"
                        :class="ui.value({ class: 'flex items-center gap-2 min-w-0 overflow-hidden' })"
                      >
                        <UIcon
                          :name="selectedTreemapGroupingItem.icon"
                          class="size-4 text-neutral-500 shrink-0"
                        />
                        <span class="truncate">{{ selectedTreemapGroupingItem.label }}</span>
                      </span>
                      <span
                        v-else
                        :class="ui.placeholder({ class: '' })"
                      >Välj gruppering</span>
                    </template>
<template #item="{ item }">
                      <div class="flex items-center gap-2">
                        <UIcon
                          v-if="item.icon"
                          :name="item.icon"
                          class="size-4 text-neutral-500"
                        />
                        <span>{{ item.label }}</span>
                      </div>
                    </template>
</USelect>
</div>
</div> -->
            </div>
          </div>

          <div class=" justify-between hidden">
            <UTabs v-model="activeTab" :items="items" class="w-full" color="neutral" variant="link"
              :unmount-on-hide="false" />
          </div>
        </div>
        <div class="flex gap-3 items-start" />
      </div>
    </UCard>
    <transition name="fade" mode="out-in" class="md:min-h-[550px] min-h-full">
      <div v-if="activeTab === 'columnChart'" class="sm:mt-2">
        <div ref="barChartRef" class="px-6">
          <BarChart v-if="showBarChart" :key="`main-${barChartInstanceKey}`" class="mb-6" :chart-data="data"
            :chart-width="chartWidth" :geography="geographyValue" :forest-type="forestTypeValue"
            :stand-age="standAgeValue" :vegetation-type="vegetationTypeValue" :matsvamp-filter="matsvampFilter"
            :giftsvamp-filter="giftsvampFilter" :grupp-filter="gruppFilter" :status-filter="statusFilter"
            :search-term="effectiveSearchTerm" :sort-order="tableSorting" :visible-range="tableVisibleRange"
            :view-mode="chartView" :bar-grouping-mode="tableGroupingMode" :show-mode-tabs="false"
            @update:view-mode="chartView = $event" />
        </div>
        <SpeciesTable @enlarge="emit('enlarge')" :isNormalView="isNormalView"
          @update:matsvamp-filter="matsvampFilter = $event" :column-visibility-overrides="columnVisibilityOverrides"
          @update:giftsvamp-filter="giftsvampFilter = $event" :search-term="effectiveSearchTerm"
          @update:grupp-filter="gruppFilter = $event" :external-svamp-filter="externalSvampFilter"
          @update:status-filter="statusFilter = $event" :external-status-filter="externalStatusFilter"
          @update:search-term="handleSearchUpdate" :external-grupp-filter="externalGruppFilter"
          @update:sorting="tableSorting = $event" :chart-grouping-mode="chartView"
          @update:visible-range="tableVisibleRange = $event" :enable-pagination="true"
          @update:table-grouping-mode="tableGroupingMode = $event" table-key="edna" />
      </div>
    </transition>

    <transition name="fold-down">
      <UContainer
        v-if="isBarChartSticky && showBarChart && chartView === 'bar' && activeTab === 'columnChart' && !isSmallScreen"
        class="shadow hidden md:block fixed top-0 pt-16 z-20 bg-neutral-50 dark:bg-black border-b border-x rounded-xl border-neutral-200 dark:border-neutral-800 left-0 right-0">
        <div class="w-full mx-auto max-w-7xl py-2 px-4">
          <BarChart :key="`sticky-${barChartInstanceKey}`" :chart-data="data" :chart-width="chartWidth"
            :chart-height="40" :show-controls="false" :show-y-axis="false" :show-tooltip="false"
            :geography="geographyValue" :forest-type="forestTypeValue" :stand-age="standAgeValue"
            :vegetation-type="vegetationTypeValue" :matsvamp-filter="matsvampFilter" :giftsvamp-filter="giftsvampFilter"
            :grupp-filter="gruppFilter" :status-filter="statusFilter" :search-term="effectiveSearchTerm"
            :sort-order="tableSorting" :visible-range="tableVisibleRange" :view-mode="chartView"
            :bar-grouping-mode="tableGroupingMode" :show-mode-tabs="false" @update:view-mode="chartView = $event" />
        </div>
      </UContainer>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, toRefs } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useEnvParamsStore } from '~/stores/envParamsStore'
import { storeToRefs } from 'pinia'
import { useTabsStore } from '~/stores/tabsStore'
import { hasEdnaDataset } from '~/utils/edna'

const matsvampFilter = ref(false)
const giftsvampFilter = ref(false)
const gruppFilter = ref<string[]>([])
const statusFilter = ref<string[]>([])
const localSearchTerm = ref('')
const tableSorting = ref<Array<{ id: string, desc: boolean }>>([])
const tableVisibleRange = ref<{ startIndex: number, endIndex: number, total: number } | null>(null)
const tableGroupingMode = ref<'none' | 'groups' | 'edibility' | 'redlist' | 'visible'>('none')
const showBarChart = ref(true)
const chartView = useState<'bar' | 'treemap-standard' | 'treemap-groups' | 'treemap-edibility' | 'treemap-redlist' | 'treemap-visible'>(
  'edna-chart-view',
  () => 'bar'
)
const lastTreemapMode = useState<'treemap-standard' | 'treemap-groups' | 'treemap-edibility' | 'treemap-redlist' | 'treemap-visible'>(
  'edna-last-treemap-mode',
  () => 'treemap-groups'
)
const chartTypeTabs = [
  { label: 'Stapeldiagram', value: 'bar', icon: 'fluent:data-bar-vertical-20-regular' },
  { label: 'Träddiagram', value: 'treemap', icon: 'fluent:data-treemap-20-regular' }
]
const chartTypeTab = computed<'bar' | 'treemap'>({
  get: () => (chartView.value === 'bar' ? 'bar' : 'treemap'),
  set: (value) => {
    if (value === 'bar') {
      chartView.value = 'bar'
      return
    }
    if (chartView.value === 'bar') {
      chartView.value = lastTreemapMode.value === 'treemap-standard' ? 'treemap-groups' : lastTreemapMode.value
    }
  }
})
const treemapGroupingOptions = [
  { label: 'Svampgrupper', value: 'treemap-groups', icon: 'i-material-symbols-category-rounded' },
  { label: 'Matsvamp', value: 'treemap-edibility', icon: 'icon-park-solid:knife-fork' },
  { label: 'Status', value: 'treemap-redlist', icon: 'i-material-symbols-flag-rounded' },
  { label: 'Svampar som syns', value: 'treemap-visible', icon: 'i-heroicons-eye' }
]
const treemapGroupingMode = computed<'treemap-standard' | 'treemap-groups' | 'treemap-edibility' | 'treemap-redlist' | 'treemap-visible'>({
  get: () => {
    if (chartView.value === 'treemap-standard') return 'treemap-groups'
    if (chartView.value === 'treemap-edibility') return 'treemap-edibility'
    if (chartView.value === 'treemap-redlist') return 'treemap-redlist'
    if (chartView.value === 'treemap-visible') return 'treemap-visible'
    return 'treemap-groups'
  },
  set: (value) => {
    chartView.value = value
  }
})
const selectedTreemapGroupingItem = computed(() =>
  treemapGroupingOptions.find(option => option.value === treemapGroupingMode.value)
)
const barChartInstanceKey = ref(0)
const isBarChartSticky = ref(false)
const barChartRef = ref<HTMLElement | null>(null)
let barChartObserver: IntersectionObserver | null = null
let barChartObservedEl: HTMLElement | null = null

const props = defineProps<{
  isNormalView: boolean
  searchTerm?: string
  isActive?: boolean
  externalSvampFilter?: string[]
  externalStatusFilter?: string[]
  externalGruppFilter?: string[]
}>()
const { isNormalView } = toRefs(props)
const emit = defineEmits<{ (e: 'enlarge'): void, (e: 'update:searchTerm', value: string): void }>()

const effectiveSearchTerm = computed(() => props.searchTerm ?? localSearchTerm.value)

function handleSearchUpdate(value: string) {
  if (props.searchTerm !== undefined) {
    emit('update:searchTerm', value)
    return
  }
  localSearchTerm.value = value
}

const tabsStore = useTabsStore()
const activeTab = computed({
  get: () => isSmallScreen.value ? 'columnChart' : tabsStore.getActiveTab('EdnaComponent'),
  set: (val) => {
    if (!isSmallScreen.value) {
      tabsStore.setActiveTab('EdnaComponent', val)
    }
  }
})

const items = [
  { label: 'Diagram', icon: 'material-symbols:bar-chart', value: 'columnChart' },
  { label: 'Tabell', icon: 'material-symbols:table-outline', value: 'spatialForest' }
]

// Use the environment store.
const envStore = useEnvParamsStore()
const { geography, forestType, standAge, vegetationType } = storeToRefs(envStore)

// Expose store values as computed (for passing down to BarChart).
const geographyValue = computed(() => geography.value)
const forestTypeValue = computed(() => forestType.value)
const standAgeValue = computed(() => standAge.value)
const vegetationTypeValue = computed(() => vegetationType.value)

// Data for chart fetched based on environment.
const data = ref<any[]>([])
const totalSpecies = computed(() => data.value.length)
const sampleEnvCount = computed(() =>
  data.value.length > 0 ? data.value[0].sample_env_count || 0 : 0
)
const filteredSpeciesCount = computed(() => tableVisibleRange.value?.total ?? totalSpecies.value)
const isFiltered = computed(() => filteredSpeciesCount.value !== totalSpecies.value)
const speciesCountLabel = computed(() =>
  isFiltered.value
    ? `${filteredSpeciesCount.value} av ${totalSpecies.value}`
    : `${totalSpecies.value}`
)
const chartWidth = ref('100%')

// hide image column on small (mobile) screens
const isSmallScreen = useMediaQuery('(max-width: 767px)')
const columnVisibilityOverrides = computed(() => ({
  mark: false,
  ...(isSmallScreen.value ? { images: false } : {})
}))

const externalSvampFilter = computed(() => Array.isArray(props.externalSvampFilter) ? props.externalSvampFilter : [])
const externalStatusFilter = computed(() => Array.isArray(props.externalStatusFilter) ? props.externalStatusFilter : [])
const externalGruppFilter = computed(() => Array.isArray(props.externalGruppFilter) ? props.externalGruppFilter : [])

watch(chartView, (mode, prevMode) => {
  if (mode !== 'bar' && mode !== 'treemap-standard') {
    lastTreemapMode.value = mode
  }
  const crossingBarBoundary = (mode === 'bar') !== (prevMode === 'bar')
  if (crossingBarBoundary) {
    barChartInstanceKey.value += 1
  }
})

function cleanupBarChartObserver() {
  if (barChartObserver && barChartObservedEl) {
    barChartObserver.unobserve(barChartObservedEl)
  }
  barChartObservedEl = null
  barChartObserver = null
}

function setupBarChartObserver() {
  cleanupBarChartObserver()
  if (!barChartRef.value) return
  barChartObserver = new IntersectionObserver(
    ([entry]) => {
      isBarChartSticky.value = !(entry?.isIntersecting ?? true)
    },
    { threshold: 0, rootMargin: '-180px 0px 0px 0px' }
  )
  barChartObserver.observe(barChartRef.value)
  barChartObservedEl = barChartRef.value
}

onMounted(() => {
  setupBarChartObserver()
})

onBeforeUnmount(() => {
  cleanupBarChartObserver()
})

watch(
  [() => barChartRef.value, () => activeTab.value, () => showBarChart.value, () => chartView.value, () => isSmallScreen.value, () => props.isActive],
  ([element, tab, isVisible, currentChartView, isSmall, isActive]) => {
    if (!element || tab !== 'columnChart' || !isVisible || currentChartView !== 'bar' || isSmall || isActive === false) {
      isBarChartSticky.value = false
      cleanupBarChartObserver()
      return
    }
    setupBarChartObserver()
  },
  { immediate: true }
)

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
  const filename = `edna-${geog}-${forest}-${age}-${veg}.json`
  try {
    const response = await fetch(`/edna/${filename}`)
    if (!response.ok) {
      if (response.status === 404) {
        data.value = []
        return
      }
      throw new Error(`Failed to fetch ${filename}`)
    }
    const jsonData = await response.json()
    jsonData.sort((a: any, b: any) => b.sample_plot_count - a.sample_plot_count)
    data.value = jsonData
  } catch (error) {
    console.error('Error fetching data:', error)
    data.value = []
  }
}

// When store values change, fetch new data.
watch(
  () => [geography.value, forestType.value, standAge.value, vegetationType.value],
  ([geog, forest, age, veg]) => {
    if (geog && forest && age && veg) {
      fetchData(geog, forest, age, veg)
    }
  },
  { immediate: true }
)
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
