<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useSpeciesStore } from '~/stores/speciesStore'

type SpeciesRow = {
  Commonname: string
  Scientificname: string
}

type GraphFilterState = {
  level: 'fylum' | 'klass' | 'ordning' | 'familj' | 'slakte' | null
  value: string | null
}

type QueryState = {
  search: string
  page: number
  pageSize: number
  sort: string
  order: 'asc' | 'desc'
  filters: Record<string, string[]>
}

type SpeciesResponse = {
  items: SpeciesRow[]
  total: number
  page: number
  pageSize: number
  filterOptions: {
    group: string[]
    status: string[]
    matsvamp: string[]
    fylum: string[]
    klass: string[]
    ordning: string[]
    familj: string[]
    slakte: string[]
    taxonomyPhylumByValue: {
      klass: Record<string, string>
      ordning: Record<string, string>
      familj: Record<string, string>
      slakte: Record<string, string>
    }
  }
}

useSeoMeta({
  title: 'Alla arter',
  description: 'Sök bland alla arter och se deras förekomst per skogstyp, beståndsålder och fältskikt.'
})

const speciesStore = useSpeciesStore()
const showSlideover = ref(false)
const isPinned = ref(false)
const showGraph = ref(true)
const graphSectionRef = ref<HTMLElement | null>(null)
const graphFilter = ref<GraphFilterState>({
  level: null,
  value: null
})
const queryState = ref<QueryState>({
  search: '',
  page: 1,
  pageSize: 25,
  sort: 'Commonname',
  order: 'asc',
  filters: {
    group: [],
    status: [],
    matsvamp: [],
    fylum: [],
    klass: [],
    ordning: [],
    familj: [],
    slakte: []
  }
})

const requestQuery = computed(() => ({
  search: queryState.value.search,
  page: queryState.value.page,
  pageSize: queryState.value.pageSize,
  sort: queryState.value.sort,
  order: queryState.value.order,
  group: queryState.value.filters.group.join(','),
  status: queryState.value.filters.status.join(','),
  matsvamp: queryState.value.filters.matsvamp.join(','),
  fylum: queryState.value.filters.fylum.join(','),
  klass: queryState.value.filters.klass.join(','),
  ordning: queryState.value.filters.ordning.join(','),
  familj: queryState.value.filters.familj.join(','),
  slakte: queryState.value.filters.slakte.join(',')
}))

const hasGraphFilter = computed(() => Boolean(graphFilter.value.level && graphFilter.value.value))
const graphFilterTitle = computed(() => {
  if (graphFilter.value.level === 'slakte') {
    return `Filtrerar på släkte: ${graphFilter.value.value}`
  }

  if (graphFilter.value.level === 'familj') {
    return `Filtrerar på familj: ${graphFilter.value.value}`
  }

  if (graphFilter.value.level === 'ordning') {
    return `Filtrerar på ordning: ${graphFilter.value.value}`
  }

  if (graphFilter.value.level === 'klass') {
    return `Filtrerar på klass: ${graphFilter.value.value}`
  }

  if (graphFilter.value.level === 'fylum') {
    return `Filtrerar på fylum: ${graphFilter.value.value}`
  }

  return ''
})

const fetchKey = computed(() =>
  `all-species:${requestQuery.value.search}:${requestQuery.value.page}:${requestQuery.value.pageSize}:${requestQuery.value.sort}:${requestQuery.value.order}:${requestQuery.value.group}:${requestQuery.value.status}:${requestQuery.value.matsvamp}:${requestQuery.value.fylum}:${requestQuery.value.klass}:${requestQuery.value.ordning}:${requestQuery.value.familj}:${requestQuery.value.slakte}`
)

const { data, status, error } = await useLazyFetch<SpeciesResponse>('/api/all-species', {
  key: fetchKey,
  query: requestQuery,
  default: () => ({
    items: [],
    total: 0,
    page: 1,
    pageSize: 25,
    filterOptions: {
      group: [],
      status: [],
      matsvamp: [],
      fylum: [],
      klass: [],
      ordning: [],
      familj: [],
      slakte: [],
      taxonomyPhylumByValue: {
        klass: {},
        ordning: {},
        familj: {},
        slakte: {}
      }
    }
  }),
  server: false
})

function areFilterArraysEqual(a: string[] = [], b: string[] = []) {
  return a.length === b.length && a.every((value, index) => value === b[index])
}

function areFiltersEqual(
  a: QueryState['filters'],
  b: QueryState['filters']
) {
  return areFilterArraysEqual(a.group, b.group)
    && areFilterArraysEqual(a.status, b.status)
    && areFilterArraysEqual(a.matsvamp, b.matsvamp)
    && areFilterArraysEqual(a.fylum, b.fylum)
    && areFilterArraysEqual(a.klass, b.klass)
    && areFilterArraysEqual(a.ordning, b.ordning)
    && areFilterArraysEqual(a.familj, b.familj)
    && areFilterArraysEqual(a.slakte, b.slakte)
}

watch(
  () => speciesStore.selectedSpecies,
  (selected) => {
    if (selected) {
      showSlideover.value = true
    }
  }
)

watch(showSlideover, (isOpen) => {
  if (!isOpen) {
    speciesStore.clearSelection()
  }
})

function handleQueryChange(nextQuery: QueryState) {
  if (
    queryState.value.search === nextQuery.search
    && queryState.value.page === nextQuery.page
    && queryState.value.pageSize === nextQuery.pageSize
    && queryState.value.sort === nextQuery.sort
    && queryState.value.order === nextQuery.order
    && areFiltersEqual(queryState.value.filters, nextQuery.filters)
  ) {
    return
  }

  queryState.value = nextQuery
}

function handleGraphFilterChange(nextFilter: GraphFilterState) {
  if (graphFilter.value.level === nextFilter.level && graphFilter.value.value === nextFilter.value) {
    return
  }

  const nextFilters = {
    ...queryState.value.filters,
    fylum: nextFilter.level === 'fylum' && nextFilter.value ? [nextFilter.value] : [],
    klass: nextFilter.level === 'klass' && nextFilter.value ? [nextFilter.value] : [],
    ordning: nextFilter.level === 'ordning' && nextFilter.value ? [nextFilter.value] : [],
    familj: nextFilter.level === 'familj' && nextFilter.value ? [nextFilter.value] : [],
    slakte: nextFilter.level === 'slakte' && nextFilter.value ? [nextFilter.value] : []
  }

  graphFilter.value = nextFilter

  if (areFiltersEqual(queryState.value.filters, nextFilters) && queryState.value.page === 1) {
    return
  }

  queryState.value = {
    ...queryState.value,
    filters: nextFilters,
    page: 1
  }
}

function handleShowPhylogeneticTree(anchor: GraphFilterState) {
  showGraph.value = true
  handleGraphFilterChange(anchor)
  graphSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

watch(
  () => queryState.value.filters,
  (filters) => {
    const taxonomyOrder: Array<GraphFilterState['level']> = ['slakte', 'familj', 'ordning', 'klass', 'fylum']
    const nextLevel = taxonomyOrder.find((level) => level && filters[level]?.length)
    const nextFilter = nextLevel
      ? { level: nextLevel, value: filters[nextLevel]?.[0] || null }
      : { level: null, value: null }

    if (graphFilter.value.level === nextFilter.level && graphFilter.value.value === nextFilter.value) {
      return
    }

    graphFilter.value = nextFilter
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <UPage class="bg-neutral-50">
    <MySlideover v-model="showSlideover" :pinned="isPinned" @update:pinned="(value) => (isPinned = value)">
      <SpeciesInfo v-if="speciesStore.selectedSpecies" :species="speciesStore.selectedSpecies"
        :show-phylogenetic-tree-button="true" @show-phylogenetic-tree="handleShowPhylogeneticTree" />
    </MySlideover>
    <UContainer>
      <div ref="graphSectionRef" class="sm:border border-muted/50 bg-white sm:rounded-xl sm:shadow my-4 ">

        <div class="flex items-center justify-between gap-3 p-4">
          <div>
            <h2 class="text-base font-semibold text-neutral-900">
              Taxonomisk översikt
            </h2>
            <p class="text-sm text-neutral-500">
              Visa eller dölj trädet utan att påverka tabellens filter.
            </p>
          </div>

          <UButton :label="showGraph ? 'Dölj träd' : 'Visa träd'"
            :icon="showGraph ? 'i-lucide-eye-off' : 'i-lucide-eye'" color="neutral" variant="outline"
            @click="showGraph = !showGraph" />
        </div>
        <div v-if="showGraph" class="">
          <AllSpeciesGraph :active-filter="graphFilter" :group-filters="queryState.filters.group"
            :search-term="queryState.search" :status-filters="queryState.filters.status"
            :matsvamp-filters="queryState.filters.matsvamp" :fylum-filters="queryState.filters.fylum"
            :klass-filters="queryState.filters.klass" :ordning-filters="queryState.filters.ordning"
            :familj-filters="queryState.filters.familj" :slakte-filters="queryState.filters.slakte"
            @filter-change="handleGraphFilterChange" />
        </div>





        <div v-if="(status === 'pending' || status === 'idle') && !(data?.items?.length)"
          class="max-w-sm space-y-3 mt-6">
          <USkeleton class="h-4 w-full rounded" />
          <USkeleton class="h-4 w-[90%] rounded" />
          <USkeleton class="h-4 w-[80%] rounded" />
        </div>

        <UAlert v-if="error" color="error" variant="subtle" title="Kunde inte läsa in artlistan"
          description="Kontrollera att JSON-filen för alla arter har byggts." class="mt-6" />

        <div v-else class="">
          <AllSpeciesTable :rows="data?.items || []" :total="data?.total || 0"
            :loading="status === 'pending' || status === 'idle'"
            :filter-options="data?.filterOptions || { group: [], status: [], matsvamp: [], fylum: [], klass: [], ordning: [], familj: [], slakte: [], taxonomyPhylumByValue: { klass: {}, ordning: {}, familj: {}, slakte: {} } }"
            :initial-filters="queryState.filters" @query-change="handleQueryChange" />
        </div>
      </div>
    </UContainer>
  </UPage>
</template>
