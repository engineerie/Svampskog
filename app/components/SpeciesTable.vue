<template>
  <div class="">
    <div class="">
      <div v-if="!useMobileLayout" class="flex md:gap-2 mt-2 justify-between z-30">
        <div class="flex gap-2 items-end justify-end w-full mb-2">
          <!-- <UInput :model-value="table?.tableApi?.getColumn('Commonname')?.getFilterValue() || ''"
            class="max-w-sm min-w-[12ch] hidden md:block" placeholder="Sök på namn" icon="i-heroicons-magnifying-glass"
            @update:model-value="value => {
              table?.tableApi?.getColumn('Commonname')?.setFilterValue(value);
              onSearchInput(value);
            }" variant="ghost" /> -->

          <div class="flex gap-2 px-4">
            <div id="scrollbar" class="flex my-1 gap-2 overflow-scroll">
              <template v-if="selectedMark.length">
                <span v-for="filter in selectedMark" :key="'mark-' + filter">
                  <UBadge trailing-icon="i-heroicons-x-mark-solid" variant="subtle"
                    :color="filter === 'KALKmark' ? 'kalkmark' : filter === 'ANNANmark' ? 'vanligmark' : 'neutral'"
                    :class="['cursor-pointer mb-2 md:mb-0', isFilterActive('mark', filter) ? '' : 'opacity-50']"
                    @click="selectedMark = selectedMark.filter(f => f !== filter)">
                    {{ filter === 'KALKmark' ? 'Kalkmark' : filter === 'ANNANmark' ? 'Vanlig skogsmark'
                      : capitalize(filter) }}
                  </UBadge>
                </span>
              </template>
              <template v-if="selectedFilter.length">
                <span v-for="filter in selectedFilter" :key="'svamp-' + filter">
                  <UBadge trailing-icon="i-heroicons-x-mark-solid" variant="subtle"
                    :color="filter === 'Matsvamp' ? 'warning' : filter === 'Giftsvamp' ? 'poison' : 'neutral'"
                    :class="['cursor-pointer mb-2 md:mb-0', isFilterActive(props.mat, filter) ? '' : 'opacity-50']"
                    @click="selectedFilter = selectedFilter.filter(f => f !== filter)">
                    {{ capitalize(filter) }}
                  </UBadge>
                </span>
              </template>
              <template v-if="selectedGrupp.length">
                <span v-for="filter in selectedGrupp" :key="'grupp-' + filter">
                  <UBadge trailing-icon="i-heroicons-x-mark-solid" variant="subtle" color="neutral"
                    :class="['cursor-pointer mb-2 md:mb-0', isFilterActive(props.grupp, filter) ? '' : 'opacity-50']"
                    @click="selectedGrupp = selectedGrupp.filter(f => f !== filter)">
                    {{ capitalize(filter) }}
                  </UBadge>
                </span>
              </template>
              <template v-if="selectedStatus.length">
                <span v-for="filter in selectedStatus" :key="'status-' + filter">
                  <UBadge trailing-icon="i-heroicons-x-mark-solid" variant="subtle"
                    :color="filter === 'Signalart' ? 'signal' : getStatusColor(filter)"
                    :class="['cursor-pointer mb-2 md:mb-0', isFilterActive('RL2020kat', filter) ? '' : 'opacity-50']"
                    @click="selectedStatus = selectedStatus.filter(f => f !== filter)">
                    {{ filter === 'Signalart' ? 'Signalart' : getStatusTooltip(filter) }}
                  </UBadge>
                </span>
              </template>
            </div>
            <UPopover v-if="!useMobileLayout" :content="{ align: 'end', side: 'bottom' }">
              <UButton label="Visning" color="neutral" variant="outline" class="ring-muted/50 min-w-24"
                icon="i-heroicons-adjustments-horizontal" />
              <template #content>
                <div class="w-80 p-3 space-y-2">
                  <div v-if="props.chartGroupingMode === 'bar' || props.dataTypeFolder !== 'edna'"
                    class="flex items-center justify-between gap-3">
                    <p class="text-sm text-neutral-700">Gruppering</p>
                    <USelect v-model="selectedTableGrouping" :items="tableGroupingMenuOptions" item-value="value"
                      item-label="label" class="max-w-42 ring-muted/50" :ui="{ content: 'min-w-fit' }" />
                  </div>

                  <div v-if="paginationEnabled" class="flex items-center justify-between gap-3"
                    :class="isTableGroupingActive ? 'opacity-60' : ''">
                    <p class="text-sm text-neutral-700">Rader</p>
                    <USelect v-model="rowsPerPage" :items="rowsPerPageOptions" item-value="value" item-label="label"
                      class="max-w-42 ring-muted/50" :disabled="isTableGroupingActive" :ui="{ content: 'min-w-fit' }" />
                  </div>

                  <div class="space-y-2">
                    <p class="text-sm text-neutral-700">Kolumner</p>
                    <div class="flex flex-wrap gap-2">
                      <UBadge size="md" v-for="column in columnVisibilityBadgeItems" :key="column.id"
                        :variant="column.visible ? 'outline' : 'soft'" :color="column.visible ? 'neutral' : 'neutral'"
                        :class="column.visible ? 'ring-muted/50 shadow' : 'opacity-50'"
                        class="cursor-pointer select-none" @click="toggleColumnVisibility(column.id)">
                        {{ column.label }}
                      </UBadge>
                    </div>
                  </div>
                </div>
              </template>
            </UPopover>
          </div>
        </div>
      </div>

      <div v-if="useMobileLayout" id="scrollbar" class="flex my-1 gap-2 overflow-scroll">
        <template v-if="selectedMark.length">
          <span v-for="filter in selectedMark" :key="'mark-' + filter">
            <UBadge trailing-icon="i-heroicons-x-mark-solid" variant="subtle"
              :color="filter === 'KALKmark' ? 'kalkmark' : filter === 'ANNANmark' ? 'vanligmark' : 'neutral'"
              class="cursor-pointer mb-2 md:mb-0" @click="selectedMark = selectedMark.filter(f => f !== filter)">
              {{ filter === 'KALKmark' ? 'Kalkmark' : filter === 'ANNANmark' ? 'Vanlig skogsmark' : capitalize(filter)
              }}
            </UBadge>
          </span>
        </template>
        <template v-if="selectedFilter.length">
          <span v-for="filter in selectedFilter" :key="'svamp-' + filter">
            <UBadge trailing-icon="i-heroicons-x-mark-solid" variant="subtle"
              :color="filter === 'Matsvamp' ? 'warning' : filter === 'Giftsvamp' ? 'poison' : 'neutral'"
              class="cursor-pointer mb-2 md:mb-0 " @click="selectedFilter = selectedFilter.filter(f => f !== filter)">
              {{ capitalize(filter) }}
            </UBadge>
          </span>
        </template>
        <template v-if="selectedGrupp.length">
          <span v-for="filter in selectedGrupp" :key="'grupp-' + filter">
            <UBadge trailing-icon="i-heroicons-x-mark-solid" variant="subtle" color="neutral"
              class="cursor-pointer mb-2 md:mb-0 " @click="selectedGrupp = selectedGrupp.filter(f => f !== filter)">
              {{ capitalize(filter) }}
            </UBadge>
          </span>
        </template>
        <template v-if="selectedStatus.length">
          <span v-for="filter in selectedStatus" :key="'status-' + filter">
            <UBadge trailing-icon="i-heroicons-x-mark-solid" variant="subtle"
              :color="filter === 'Signalart' ? 'signal' : getStatusColor(filter)" class="cursor-pointer mb-2 md:mb-0 "
              @click="selectedStatus = selectedStatus.filter(f => f !== filter)">
              {{ filter === 'Signalart' ? 'Signalart' : getStatusTooltip(filter) }}
            </UBadge>
          </span>
        </template>
      </div>
    </div>

    <div v-if="useMobileLayout && isMobile" class="flex gap-2 w-full mb-2">
      <UDropdownMenu :size="isMobile ? 'xl' : 'md'" :items="sortMenuItems" :content="{ align: 'start' }"
        :ui="{ content: 'min-w-fit' }">
        <UButton :variant="isMobile ? 'soft' : 'ghost'" icon="i-lucide-arrow-up-down" :size="isMobile ? 'xl' : 'md'"
          :label="isMobile ? null : null" color="neutral" trailing />
      </UDropdownMenu>
      <UDropdownMenu :size="isMobile ? 'xl' : 'md'" :items="filterMenuItems" :content="{ align: 'start' }"
        :ui="{ content: 'min-w-fit' }">
        <UButton :variant="isMobile ? 'soft' : 'ghost'" icon="i-lucide-list-filter" :size="isMobile ? 'xl' : 'md'"
          :label="isMobile ? null : null" color="neutral" />
      </UDropdownMenu>
      <UInput :variant="isMobile ? 'soft' : 'ghost'"
        :model-value="table?.tableApi?.getColumn('Commonname')?.getFilterValue() || ''" class="w-full min-w-[12ch]"
        placeholder="Sök på namn" :size="isMobile ? 'xl' : 'md'" icon="i-heroicons-magnifying-glass"
        @update:model-value="value => {
          table?.tableApi?.getColumn('Commonname')?.setFilterValue(value);
          onSearchInput(value);
        }" />
    </div>
    <USeparator v-if="isMobile" :ui="{ border: 'border-muted/50' }" class="" />
    <div v-if="filteredData" :class="[isNormalView ? '' : '']">
      <div class="">
        <UTable :key="tableRenderKey" ref="table" v-model:column-visibility="columnVisibility"
          v-model:pagination="pagination" v-model:sorting="sorting" :data="displayedData" :columns="columns" sticky
          :loading="isLoading" :grouping="tableGrouping" :grouping-options="groupingOptions" :auto-reset-all="false"
          :pagination-options="(isMobile && !paginationEnabled)
            ? undefined
            : (paginationEnabled && !isTableGroupingActive
              ? { getPaginationRowModel: getPaginationRowModel() }
              : undefined)" :class="{ '': isNormalView }" :ui="tableUi" class="" @select="selectRow" />

        <div v-if="!useMobileLayout"
          class="md:flex justify-between items-center pb-2 md:pt-5 md:p-5 border-neutral-200 dark:border-neutral-700">
          <div class="flex h-fit shrink-0 gap-1 items-center justify-between">
            <!-- Left mini-legend -->

            <h1 v-if="!isTableGroupingActive" class="flex">
              Visar <span class="hidden md:flex">&nbsp;{{ startItem }} till&nbsp;</span> {{ endItem }} av
              {{ totalItems }} arter
            </h1>
            <UButton v-if="isNormalView" class="md:hidden" color="neutral" variant="soft" label="Visa alla" size="md"
              @click="emit('enlarge')" />
          </div>

          <div>
            <!-- Pagination component -->
            <div v-if="paginationEnabled && !isTableGroupingActive && rowsPerPage !== 'Alla' && !isMobile">
              <div class="flex justify-center">
                <UPagination active-variant="ghost" variant="ghost"
                  :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
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
</template>

<script setup>
import { ref, computed, watch, h, resolveComponent, onBeforeUnmount, onMounted } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useSpeciesStore } from '~/stores/speciesStore'
import { useEnvParamsStore } from '~/stores/envParamsStore'
import { useTableStateStore } from '~/stores/tableStateStore'
import { getPaginationRowModel, getGroupedRowModel } from '@tanstack/vue-table'
import { upperFirst } from 'scule'
import { hasEdnaDataset } from '~/utils/edna'

const props = defineProps({
  isNormalView: { type: Boolean, default: false },
  dataTypeFolder: { type: String, default: 'edna' },
  dataType: { type: String, default: 'edna' },
  grupp: { type: String, default: 'Svamp-grupp-släkte' },
  mat: { type: String, default: 'matsvamp' },
  obs: { type: String, default: 'sample_plot_count' },
  obsLabel: { type: String, default: 'Förekomst' },
  columnVisibilityOverrides: { type: Object, default: () => ({}) },
  filterEdible: { type: Boolean, default: false },
  filterPoison: { type: Boolean, default: false },
  searchTerm: { type: String, default: '' },
  externalSvampFilter: { type: Array, default: undefined },
  externalMatsvampFilter: { type: Boolean, default: undefined },
  externalStatusFilter: { type: Array, default: undefined },
  externalGruppFilter: { type: Array, default: undefined },
  chartGroupingMode: { type: String, default: 'treemap-standard' },
  enablePagination: { type: Boolean, default: false },
  tableKey: { type: String, default: '' }
})

const isMobile = useMediaQuery('(max-width: 767px)')
const useMobileLayout = computed(() =>
  isMobile.value || (props.isNormalView && props.dataTypeFolder !== 'edna')
)

const tableStateStore = useTableStateStore()
const resolvedTableKey = computed(() =>
  props.tableKey || `${props.dataTypeFolder}:${props.dataType}:${props.mat}:${props.obs}`
)

// allow child to emit an "enlarge" event
const emit = defineEmits([
  'enlarge',
  'update:matsvampFilter',
  'update:giftsvampFilter',
  'update:gruppFilter',
  'update:statusFilter',
  'update:searchTerm',
  'update:sorting',
  'update:visibleRange',
  'update:tableGroupingMode'
])

// Temporary storage for raw input and debounce timer
const rawSearch = ref('')
let searchTimeout = null

// Called on each keystroke: update rawSearch and reset debounce timer
function onSearchInput(value) {
  rawSearch.value = value
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    emit('update:searchTerm', rawSearch.value)
  }, 300) // 300 ms debounce
}

// Clear the timeout if the component unmounts
onBeforeUnmount(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})

const table = useTemplateRef('table')

watch(
  [() => props.searchTerm, () => table.value?.tableApi],
  ([value, api]) => {
    const nextValue = value ?? ''
    rawSearch.value = nextValue
    if (!api) return
    api.getColumn('Commonname')?.setFilterValue(nextValue)
  },
  { immediate: true, flush: 'post' }
)

const defaultVisibility = useMobileLayout.value
  ? {
    'RankRed': false,
    'Rank matsvamp': false,
    'Rank giftsvamp': false,
    [props.grupp]: false,
    'mark': false,
    [props.mat]: false,
    'RL2020kat': false,
    'Commonname': false,
    'Scientificname': false,
    'images': false,
    '__groupingOrder': false,
    [props.obs]: false
  }
  : {
    __groupingOrder: false
  }

if (props.dataType === 'edna') {
  defaultVisibility.mark = false
}

const columnVisibility = ref({ ...defaultVisibility, ...props.columnVisibilityOverrides })

// Define a reactive array for selected mark filters
const selectedMark = ref([])
// Create computed mark options – these will include the count of matches.
const formatCountLabel = (visible = 0, total = 0) => {
  if (!total) return null
  return visible === total ? `${total}` : `${visible}/${total}`
}

const markOptions = computed(() => {
  const totalCounts = {}
  // Total counts from filteredData (before column filters)
  filteredData.value.forEach((row) => {
    if (row.KALKmark) {
      totalCounts['KALKmark'] = (totalCounts['KALKmark'] || 0) + 1
    }
    if (row.ANNANmark) {
      totalCounts['ANNANmark'] = (totalCounts['ANNANmark'] || 0) + 1
    }
  })
  // Visible counts from current table rows after column filters
  const visibleRows = table.value?.tableApi?.getFilteredRowModel()?.rows || []
  const visibleCounts = {}
  visibleRows.forEach((rowModel) => {
    const row = rowModel.original
    if (row.KALKmark) {
      visibleCounts['KALKmark'] = (visibleCounts['KALKmark'] || 0) + 1
    }
    if (row.ANNANmark) {
      visibleCounts['ANNANmark'] = (visibleCounts['ANNANmark'] || 0) + 1
    }
  })
  const opts = [
    {
      label: 'Kalkmark',
      value: 'KALKmark',
      visible: visibleCounts['KALKmark'] || 0,
      total: totalCounts['KALKmark'] || 0
    },
    {
      label: 'Vanlig skogsmark',
      value: 'ANNANmark',
      visible: visibleCounts['ANNANmark'] || 0,
      total: totalCounts['ANNANmark'] || 0
    }
  ]
  return opts
    .map((opt) => {
      const suffix = formatCountLabel(opt.visible, opt.total)
      if (!suffix) return null
      return { label: `${opt.label} (${suffix})`, value: opt.value }
    })
    .filter(Boolean)
})

// Create the markMenuItems computed property similar to statusMenuItems:
const markMenuItems = computed(() => {
  return markOptions.value.map(option => ({
    label: option.label,
    type: 'checkbox',
    checked: selectedMark.value.includes(option.value),
    onUpdateChecked(checked) {
      if (checked) {
        if (!selectedMark.value.includes(option.value)) {
          selectedMark.value.push(option.value)
        }
      } else {
        selectedMark.value = selectedMark.value.filter(val => val !== option.value)
      }
    },
    onSelect(e) {
      e.preventDefault()
    }
  }))
})

const svampOptions = computed(() => {
  const options = ['Matsvamp', 'Giftsvamp']
  // Compute total counts from filteredData (before column filters)
  const totalCounts = {}
  filteredData.value.forEach((row) => {
    if (isEdibleSpecies(row)) {
      totalCounts['Matsvamp'] = (totalCounts['Matsvamp'] || 0) + 1
    }
    if (isPoisonSpecies(row)) {
      totalCounts['Giftsvamp'] = (totalCounts['Giftsvamp'] || 0) + 1
    }
  })
  // Compute visible counts from current table rows after column filters
  const visibleRows = table.value?.tableApi?.getFilteredRowModel()?.rows || []
  const visibleCounts = {}
  visibleRows.forEach((rowModel) => {
    const row = rowModel.original
    if (isEdibleSpecies(row)) {
      visibleCounts['Matsvamp'] = (visibleCounts['Matsvamp'] || 0) + 1
    }
    if (isPoisonSpecies(row)) {
      visibleCounts['Giftsvamp'] = (visibleCounts['Giftsvamp'] || 0) + 1
    }
  })
  return options
    .map((opt) => {
      const total = totalCounts[opt] || 0
      const visible = visibleCounts[opt] || 0
      const suffix = formatCountLabel(visible, total)
      if (!suffix) return null
      return {
        label: `${opt} (${suffix})`,
        value: opt
      }
    })
    .filter(Boolean)
})

const paginationEnabled = computed(() => {
  if (isMobile.value) return false
  return !props.isNormalView || props.enablePagination
})
const DEFAULT_ROWS_PER_PAGE = 10
const rowsPerPage = ref((props.isNormalView && !props.enablePagination) ? 'Alla' : DEFAULT_ROWS_PER_PAGE)
const selectedFilter = ref([])
const selectedStatus = ref([])
const selectedTableGrouping = ref('none')
const naturvardsStatuses = ['VU', 'NT', 'EN', 'CR', 'DD', 'Signalart']
const isNaturvardsGroupSelected = computed(() =>
  naturvardsStatuses.every(status => selectedStatus.value.includes(status))
)
const toggleNaturvardsGroup = (checked) => {
  if (checked) {
    const merged = new Set([...selectedStatus.value, ...naturvardsStatuses])
    selectedStatus.value = Array.from(merged)
  } else {
    selectedStatus.value = selectedStatus.value.filter(status => !naturvardsStatuses.includes(status))
  }
}
const selectedGrupp = ref([])
const hasExternalSvampFilter = computed(() => Array.isArray(props.externalSvampFilter))
const hasExternalStatusFilter = computed(() => Array.isArray(props.externalStatusFilter))
const hasExternalGruppFilter = computed(() => Array.isArray(props.externalGruppFilter))

watch(() => props.externalMatsvampFilter, (val) => {
  if (typeof val !== 'boolean') return
  if (val) {
    selectedFilter.value = ['Matsvamp']
  } else {
    selectedFilter.value = selectedFilter.value.filter(entry => entry !== 'Matsvamp')
  }
}, { immediate: true })

watch(() => props.externalSvampFilter, (val) => {
  if (!Array.isArray(val)) return
  selectedFilter.value = [...val]
}, { immediate: true, flush: 'post' })

watch(() => props.externalStatusFilter, (val) => {
  if (!Array.isArray(val)) return
  selectedStatus.value = [...val]
}, { immediate: true, flush: 'post' })

watch(() => props.externalGruppFilter, (val) => {
  if (!Array.isArray(val)) return
  const seen = new Set()
  selectedGrupp.value = val.filter((entry) => {
    const normalized = normalizeGroupKey(entry)
    if (seen.has(normalized)) return false
    seen.add(normalized)
    return true
  })
}, { immediate: true, flush: 'post' })
const gruppMenuItems = computed(() => {
  return gruppOptions.value.map(option => ({
    label: option.label,
    type: 'checkbox',
    checked: selectedGrupp.value.includes(option.value),
    onUpdateChecked(checked) {
      if (checked) {
        if (!selectedGrupp.value.includes(option.value)) {
          selectedGrupp.value.push(option.value)
        }
      } else {
        selectedGrupp.value = selectedGrupp.value.filter(val => val !== option.value)
      }
    },
    onSelect(e) {
      e.preventDefault()
    }
  }))
})

const svampMenuItems = computed(() => {
  return svampOptions.value.map(option => ({
    label: option.label,
    type: 'checkbox',
    checked: selectedFilter.value.includes(option.value),
    onUpdateChecked(checked) {
      if (checked) {
        if (!selectedFilter.value.includes(option.value)) {
          selectedFilter.value.push(option.value)
        }
      } else {
        selectedFilter.value = selectedFilter.value.filter(val => val !== option.value)
      }
    },
    onSelect(e) {
      e.preventDefault()
    }
  }))
})

const statusMenuItems = computed(() => {
  return statusOptions.value.map((option) => {
    if (option.type === 'separator') {
      return option
    }
    const isGroup = option.value === 'Naturvårdsarter'
    return {
      label: option.label,
      type: 'checkbox',
      icon: option.icon,
      checked: isGroup ? isNaturvardsGroupSelected.value : selectedStatus.value.includes(option.value),
      onUpdateChecked(checked) {
        if (isGroup) {
          toggleNaturvardsGroup(checked)
          return
        }
        if (checked) {
          if (!selectedStatus.value.includes(option.value)) {
            selectedStatus.value.push(option.value)
          }
        } else {
          selectedStatus.value = selectedStatus.value.filter(val => val !== option.value)
        }
      },
      onSelect(e) {
        e.preventDefault()
      }
    }
  })
})

const sortMenuItems = computed(() => [
  {
    label: 'Namn',
    children: [
      {
        label: 'A → Ö',
        onSelect(e) {
          e.preventDefault()
          table.value?.tableApi?.setSorting([{ id: 'Commonname', desc: false }])
        }
      },
      {
        label: 'Ö → A',
        onSelect(e) {
          e.preventDefault()
          table.value?.tableApi?.setSorting([{ id: 'Commonname', desc: true }])
        }
      }
    ]
  },
  {
    label: 'Vetenskapligt namn',
    children: [
      {
        label: 'A → Ö',
        onSelect(e) {
          e.preventDefault()
          table.value?.tableApi?.setSorting([{ id: 'Scientificname', desc: false }])
        }
      },
      {
        label: 'Ö → A',
        onSelect(e) {
          e.preventDefault()
          table.value?.tableApi?.setSorting([{ id: 'Scientificname', desc: true }])
        }
      }
    ]
  },
  {
    label: props.obsLabel || 'Förekomst',
    children: [
      {
        label: 'Högst → Lägst',
        onSelect(e) {
          e.preventDefault()
          table.value?.tableApi?.setSorting([{ id: props.obs, desc: false }])
        }
      },
      {
        label: 'Lägst → Högst',
        onSelect(e) {
          e.preventDefault()
          table.value?.tableApi?.setSorting([{ id: props.obs, desc: true }])
        }
      }
    ]
  }
])

// Combined mobile filter menu (nested)
const filterMenuItems = computed(() => [
  { label: 'Grupp', children: gruppMenuItems.value },
  { label: 'Matsvamp', children: svampMenuItems.value },
  { label: 'Status', children: statusMenuItems.value },
  { label: 'Mark', children: markMenuItems.value }
])

const tableGroupingMenuOptions = computed(() => {
  const options = [
    { label: 'Ingen gruppering', value: 'none' },
    { label: 'Svampgrupp', value: 'groups' },
    { label: 'Matsvamp/Giftsvamp', value: 'edibility' },
    { label: 'Status', value: 'redlist' }
  ]
  if (props.dataTypeFolder === 'edna') {
    options.push({ label: 'Synlighet', value: 'visible' })
  }
  return options
})

const rowsPerPageOptions = [
  { value: 5, label: '5 rader' },
  { value: 10, label: '10 rader' },
  { value: 20, label: '20 rader' },
  { value: 30, label: '30 rader' },
  { value: 40, label: '40 rader' },
  { value: 50, label: '50 rader' },
  { value: 'Alla', label: 'Alla' }
]

const columnVisibilityBadgeItems = computed(() =>
(table.value?.tableApi?.getAllColumns()
  ?.filter(column => column.getCanHide() && column.id !== '__groupingOrder')
  ?.map(column => ({
    id: column.id,
    label: column.columnDef.meta?.headerText || upperFirst(column.id),
    visible: column.getIsVisible()
  })) ?? [])
)

const toggleColumnVisibility = (columnId) => {
  const column = table.value?.tableApi?.getColumn(columnId)
  if (!column) return
  column.toggleVisibility(!column.getIsVisible())
}

const gruppOptions = computed(() => {
  const totalCounts = {}
  // Total counts from filteredData before column filters
  filteredData.value.forEach((row) => {
    const group = row[props.grupp]
    if (group) {
      totalCounts[group] = (totalCounts[group] || 0) + 1
    }
  })
  // Visible counts from the table’s current filtered rows
  const visibleRows = table.value?.tableApi?.getFilteredRowModel()?.rows || []
  const visibleCounts = {}
  visibleRows.forEach((rowModel) => {
    const row = rowModel.original
    const group = row[props.grupp]
    if (group) {
      visibleCounts[group] = (visibleCounts[group] || 0) + 1
    }
  })

  return Object.keys(totalCounts)
    .map((group) => {
      const total = totalCounts[group] || 0
      const visible = visibleCounts[group] || 0
      const suffix = formatCountLabel(visible, total)
      if (!suffix) return null
      return {
        label: `${capitalize(group)} (${suffix})`,
        value: group
      }
    })
    .filter(Boolean)
})

const statusOptions = computed(() => {
  const statuses = ['LC', 'NT', 'EN', 'VU', 'CR', 'DD']

  const totalCounts = {}
  filteredData.value.forEach((row) => {
    const statusVal = row.RL2020kat
    if (statuses.includes(statusVal)) {
      totalCounts[statusVal] = (totalCounts[statusVal] || 0) + 1
    } else if (
      statusVal === null
      || statusVal === '0'
      || statusVal === 0
      || String(statusVal).toUpperCase() === 'NE'
    ) {
      totalCounts['Ej bedömd'] = (totalCounts['Ej bedömd'] || 0) + 1
    } else if (String(statusVal).toUpperCase() === 'NA') {
      totalCounts['Ej tillämplig'] = (totalCounts['Ej tillämplig'] || 0) + 1
    }
    if (row.SIGNAL_art === 'S') {
      totalCounts['Signalart'] = (totalCounts['Signalart'] || 0) + 1
    }
  })

  const visibleRows = table.value?.tableApi?.getFilteredRowModel()?.rows || []
  const visibleCounts = {}
  visibleRows.forEach((rowModel) => {
    const row = rowModel.original
    const statusVal = row.RL2020kat
    if (statuses.includes(statusVal)) {
      visibleCounts[statusVal] = (visibleCounts[statusVal] || 0) + 1
    } else if (
      statusVal === null
      || statusVal === '0'
      || statusVal === 0
      || String(statusVal).toUpperCase() === 'NE'
    ) {
      visibleCounts['Ej bedömd'] = (visibleCounts['Ej bedömd'] || 0) + 1
    } else if (String(statusVal).toUpperCase() === 'NA') {
      visibleCounts['Ej tillämplig'] = (visibleCounts['Ej tillämplig'] || 0) + 1
    }
    if (row.SIGNAL_art === 'S') {
      visibleCounts['Signalart'] = (visibleCounts['Signalart'] || 0) + 1
    }
  })

  const naturvardsTotal = naturvardsStatuses.reduce((sum, status) => sum + (totalCounts[status] || 0), 0)
  const naturvardsVisible = naturvardsStatuses.reduce((sum, status) => sum + (visibleCounts[status] || 0), 0)

  const items = []

  const pushStatus = (value, text, visible = 0, total = 0, extra = {}) => {
    const suffix = formatCountLabel(visible, total)
    if (!suffix) return
    items.push({ label: `${text} (${suffix})`, value, ...extra })
  }

  // 1. Livskraftig
  pushStatus('LC', 'Livskraftig', visibleCounts['LC'] || 0, totalCounts['LC'] || 0, { icon: 'i-heroicons-check-circle' })

  // 2. Ej bedömd
  pushStatus('Ej bedömd', 'Ej bedömd', visibleCounts['Ej bedömd'] || 0, totalCounts['Ej bedömd'] || 0, { icon: 'i-heroicons-question-mark-circle' })

  // 3. Ej tillämplig
  pushStatus('Ej tillämplig', 'Ej tillämplig', visibleCounts['Ej tillämplig'] || 0, totalCounts['Ej tillämplig'] || 0, { icon: 'i-heroicons-minus-circle' })

  // 4. Naturvårdssvampar group toggle
  const naturSuffix = formatCountLabel(naturvardsVisible, naturvardsTotal)
  if (naturSuffix) {
    items.push({
      label: `Naturvårdssvampar (${naturSuffix})`,
      value: 'Naturvårdsarter',
      icon: 'i-material-symbols-award-star-outline'
    })
  }

  // 5. Separator
  if (items.length) items.push({ type: 'separator' })

  // 6. All naturvårdsarter options
  naturvardsStatuses.forEach((status) => {
    pushStatus(
      status,
      getStatusTooltip(status),
      visibleCounts[status] || 0,
      totalCounts[status] || 0
    )
  })

  // 7. Separator
  if (items.length && items[items.length - 1]?.type !== 'separator') {
    items.push({ type: 'separator' })
  }

  // Remove trailing separator if nothing follows
  while (items.length && items[items.length - 1]?.type === 'separator') {
    items.pop()
  }

  return items
})

const pagination = ref({
  pageIndex: 0,
  pageSize: paginationEnabled.value ? DEFAULT_ROWS_PER_PAGE : 100000
})

const speciesStore = useSpeciesStore()

function selectRow(e, row) {
  const tableRow = row?.original ? row : (e?.original ? e : null)
  if (!tableRow) return
  if (typeof tableRow.getIsGrouped === 'function' && tableRow.getIsGrouped()) return
  if (tableRow.original?.__groupingKey && !tableRow.original?.Scientificname) return
  speciesStore.selectSpecies(tableRow.original ?? tableRow, 'edna')
}

const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const sampleEnvCount = computed(() => {
  return data.value.length > 0 ? data.value[0].sample_env_count : 0
})

const getIconPath = (svampGrupp) => {
  const iconMapping = {
    övrigt: 'ovrigt.webp',
    hattsvamp: 'hattsvamp.png',
    kantarell: 'kantarell.webp',
    sopp: 'sopp.png',
    taggsvamp: 'taggsvamp.png',
    fingersvamp: 'fingersvamp.webp',
    tryffel: 'tryffel.webp',
    skinnsvamp: 'skinnsvamp.webp',
    skålsvamp: 'skalsvamp.webp'
  }

  return `/images/svampgrupp/${iconMapping[svampGrupp] || 'default-icon.webp'}`
}

const getStatusColor = (status) => {
  const colors = {
    LC: 'rl-lc',
    DD: 'rl-dd',
    NT: 'rl-nt',
    VU: 'rl-vu',
    EN: 'rl-en',
    CR: 'rl-cr',
    RE: 'rl-re'
  }
  return colors[status] || 'neutral'
}

const groupingBaseColors = {
  ovrigt: '#9ca3af',
  hattsvamp: '#fb7185',
  kantarell: '#fbbf24',
  sopp: '#34d399',
  taggsvamp: '#38bdf8',
  fingersvamp: '#a78bfa',
  skinnsvamp: '#e879f9',
  skinnsvampar: '#e879f9',
  skalsvamp: '#fb923c',
  tryffel: '#a3e635'
}

const groupingEdibilityColors = {
  matsvamp: '#facc15',
  giftsvamp: '#a3e635',
  ovrigt: '#9ca3af'
}

const groupingRedlistColors = {
  livskraftig: '#CDD400',
  kunskapsbrist: '#9CA3AF',
  'nara hotad': '#F9C6C7',
  sarbar: '#EF858F',
  'starkt hotad': '#EA516D',
  'akut hotad': '#E5014F',
  'nationellt utdod': '#490F2C',
  ovrigt: '#9ca3af'
}

const groupingVisibleColors = {
  'svampar som syns': '#a37153',
  'svampar som ar svara att se': '#e3d6c5',
  'synlighet saknas': '#d4d4d4'
}

const getGroupingAccentColor = (label) => {
  const normalized = normalizeGroupKey(label)
  const mode = effectiveGroupingMode.value

  if (mode === 'groups') return groupingBaseColors[normalized] || '#9ca3af'
  if (mode === 'edibility') return groupingEdibilityColors[normalized] || groupingEdibilityColors.ovrigt
  if (mode === 'redlist') return groupingRedlistColors[normalized] || groupingRedlistColors.ovrigt
  if (mode === 'visible') return groupingVisibleColors[normalized] || groupingVisibleColors['synlighet saknas']
  return '#9ca3af'
}

const getStatusTooltip = (status) => {
  if (status === 'Ej bedömd') return 'Ej bedömd'
  if (status === 'Ej tillämplig') return 'Ej tillämplig'
  const tooltips = {
    LC: 'Livskraftig',
    NT: 'Nära hotad',
    EN: 'Starkt hotad',
    VU: 'Sårbar',
    CR: 'Akut hotad',
    RE: 'Nationellt utdöd',
    DD: 'Kunskapsbrist'
  }
  if (status === null || status === 0 || String(status).toUpperCase() === 'NE') {
    return 'Ej bedömd'
  }
  if (String(status).toUpperCase() === 'NA') {
    return 'Ej tillämplig'
  }
  return tooltips[status] || 'Ej bedömd'
}

const getProbabilityLabel = (rankValue, obsKey) => {
  const rank = Number(rankValue)
  const isEdibleOrPoisonRank = obsKey === 'Rank matsvamp' || obsKey === 'Rank giftsvamp'

  if (rank === 3) {
    return isEdibleOrPoisonRank ? 'Minst vanlig' : 'Sällsynt'
  }
  if (rank === 2) {
    return isEdibleOrPoisonRank ? 'Mindre vanlig' : 'Ovanlig'
  }
  return ''
}

const isRankColumn = props.obs.startsWith('Rank')
const sorting = ref(
  isRankColumn
    ? [{ id: props.obs, desc: false }, { id: 'Commonname', desc: false }]
    : [{ id: props.obs, desc: true }]
)

onMounted(() => {
  const saved = tableStateStore.getState(resolvedTableKey.value)
  if (!saved) return
  if (!hasExternalSvampFilter.value && Array.isArray(saved.selectedFilter)) selectedFilter.value = [...saved.selectedFilter]
  if (!hasExternalStatusFilter.value && Array.isArray(saved.selectedStatus)) selectedStatus.value = [...saved.selectedStatus]
  if (!hasExternalGruppFilter.value && Array.isArray(saved.selectedGrupp)) selectedGrupp.value = [...saved.selectedGrupp]
  if (Array.isArray(saved.selectedMark)) selectedMark.value = [...saved.selectedMark]
  if (Array.isArray(saved.sorting)) sorting.value = [...saved.sorting]
  if (saved.rowsPerPage !== undefined) {
    const savedRowsPerPage = saved.rowsPerPage === 'Alla' ? 'Alla' : Number(saved.rowsPerPage)
    if (paginationEnabled.value) {
      rowsPerPage.value = savedRowsPerPage === 'Alla'
        ? 'Alla'
        : (Number.isFinite(savedRowsPerPage) && savedRowsPerPage > 0 && savedRowsPerPage <= 100
          ? savedRowsPerPage
          : DEFAULT_ROWS_PER_PAGE)
    } else {
      rowsPerPage.value = 'Alla'
    }
  }
  const shouldRestoreAllRows = rowsPerPage.value === 'Alla' || !paginationEnabled.value
  if (saved.pagination) {
    const savedPageSize = Number(saved.pagination.pageSize ?? pagination.value.pageSize)
    const allRowsSize = Math.max(1, filteredData.value.length || data.value.length || 1)
    const sanitizedPageSize = paginationEnabled.value
      ? (shouldRestoreAllRows
        ? allRowsSize
        : (Number.isFinite(savedPageSize) && savedPageSize > 0 && savedPageSize <= 100
          ? savedPageSize
          : DEFAULT_ROWS_PER_PAGE))
      : 100000
    pagination.value = {
      pageIndex: shouldRestoreAllRows ? 0 : (saved.pagination.pageIndex ?? 0),
      pageSize: sanitizedPageSize
    }
  } else if (shouldRestoreAllRows) {
    pagination.value = {
      pageIndex: 0,
      pageSize: paginationEnabled.value
        ? Math.max(1, filteredData.value.length || data.value.length || 1)
        : 100000
    }
  }
  if (saved.columnVisibility && typeof saved.columnVisibility === 'object') {
    columnVisibility.value = {
      ...columnVisibility.value,
      ...saved.columnVisibility
    }
  }
  if (typeof saved.selectedGrouping === 'string') {
    const groupingIsAvailable = tableGroupingMenuOptions.value.some(option => option.value === saved.selectedGrouping)
    selectedTableGrouping.value = groupingIsAvailable ? saved.selectedGrouping : 'none'
  }
})

watch(
  () => [props.dataTypeFolder, selectedTableGrouping.value],
  ([dataTypeFolder, grouping]) => {
    if (dataTypeFolder === 'edna') return
    if (grouping !== 'visible') return
    selectedTableGrouping.value = 'none'
  },
  { immediate: true }
)

watch(
  [selectedFilter, selectedStatus, selectedGrupp, selectedMark, selectedTableGrouping, sorting, rowsPerPage, pagination, columnVisibility],
  () => {
    tableStateStore.setState(resolvedTableKey.value, {
      selectedFilter: [...selectedFilter.value],
      selectedStatus: [...selectedStatus.value],
      selectedGrupp: [...selectedGrupp.value],
      selectedMark: [...selectedMark.value],
      selectedGrouping: selectedTableGrouping.value,
      sorting: [...sorting.value],
      rowsPerPage: rowsPerPage.value,
      pagination: { ...pagination.value },
      columnVisibility: { ...columnVisibility.value }
    })
  },
  { deep: true }
)

const UBadge = resolveComponent('UBadge')
const UProgress = resolveComponent('UProgress')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const Icon = resolveComponent('Icon')

function normalizeGroupKey(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}+/gu, '')
}

const isVisibleMushroomGroup = (value) => {
  const normalized = normalizeGroupKey(value)
  return !normalized.includes('skinnsvamp') && !normalized.includes('tryffel')
}

const getVisibilityGroupingLabel = (row) => {
  if (props.dataType === 'edna') {
    const synlighet = row?.synlighet
    if (synlighet === 1 || synlighet === '1') return 'Svampar som syns'
    if (synlighet === 0 || synlighet === '0') return 'Svampar som är svåra att se'
    return 'Synlighet saknas'
  }

  return isVisibleMushroomGroup(row?.[props.grupp])
    ? 'Svampar som syns'
    : 'Svampar som är svåra att se'
}

const isEdibleSpecies = (row) => {
  const primaryValue = row?.[props.mat]
  const normalizedPrimary = String(primaryValue ?? '').trim().toLowerCase()
  if (normalizedPrimary === 'x' || normalizedPrimary === '1' || normalizedPrimary === 'true') return true

  const fallbackValue = row?.matsvamp
  const normalizedFallback = String(fallbackValue ?? '').trim().toLowerCase()
  return fallbackValue == 1 || normalizedFallback === 'x' || normalizedFallback === '1' || normalizedFallback === 'true'
}

const isPoisonSpecies = (row) => String(row?.Giftsvamp ?? '').trim().toLowerCase() === 'x'

const resolveGroupingModeFromChart = (mode) => {
  if (mode === 'treemap-groups') return 'groups'
  if (mode === 'treemap-edibility') return 'edibility'
  if (mode === 'treemap-visible') return 'visible'
  if (mode === 'treemap-redlist') return 'redlist'
  return 'none'
}

const effectiveGroupingMode = computed(() => {
  const chartMode = String(props.chartGroupingMode || '')
  if (chartMode.startsWith('treemap-') && chartMode !== 'treemap-standard') {
    return resolveGroupingModeFromChart(chartMode)
  }
  return selectedTableGrouping.value || 'none'
})

const getRowGroupingLabel = (row) => {
  const mode = effectiveGroupingMode.value
  if (mode === 'groups') return String(row?.[props.grupp] || 'Övrigt')
  if (mode === 'edibility') {
    const isEdible = isEdibleSpecies(row)
    const isPoison = isPoisonSpecies(row)
    if (isEdible) return 'Matsvamp'
    if (isPoison) return 'Giftsvamp'
    return 'Övrigt'
  }
  if (mode === 'redlist') {
    const status = String(row?.RL2020kat || '').trim().toUpperCase()
    const redlistLabelByCode = {
      LC: 'Livskraftig',
      DD: 'Kunskapsbrist',
      NT: 'Nära hotad',
      VU: 'Sårbar',
      EN: 'Starkt hotad',
      CR: 'Akut hotad',
      RE: 'Nationellt utdöd'
    }
    return redlistLabelByCode[status] || 'Övrigt'
  }
  if (mode === 'visible') return getVisibilityGroupingLabel(row)
  return ''
}

const getRowGroupingOrder = (row) => {
  const mode = effectiveGroupingMode.value
  if (mode === 'groups') {
    const normalized = normalizeGroupKey(getRowGroupingLabel(row))
    const order = ['ovrigt', 'hattsvamp', 'kantarell', 'sopp', 'taggsvamp', 'fingersvamp', 'skinnsvamp', 'skalsvamp', 'tryffel']
    const idx = order.indexOf(normalized)
    return idx === -1 ? Number.POSITIVE_INFINITY : idx
  }
  if (mode === 'edibility') {
    const label = getRowGroupingLabel(row)
    const order = { Matsvamp: 0, Giftsvamp: 1, Övrigt: 2 }
    return order[label] ?? Number.POSITIVE_INFINITY
  }
  if (mode === 'redlist') {
    const label = getRowGroupingLabel(row)
    const order = {
      'Livskraftig': 0,
      'Kunskapsbrist': 1,
      'Nära hotad': 2,
      'Sårbar': 3,
      'Starkt hotad': 4,
      'Akut hotad': 5,
      'Nationellt utdöd': 6,
      'Övrigt': 7
    }
    return order[label] ?? Number.POSITIVE_INFINITY
  }
  if (mode === 'visible') {
    const label = getRowGroupingLabel(row)
    const order = { 'Svampar som syns': 0, 'Svampar som är svåra att se': 1, 'Synlighet saknas': 2 }
    return order[label] ?? Number.POSITIVE_INFINITY
  }
  return Number.POSITIVE_INFINITY
}

const isTableGroupingActive = computed(() => effectiveGroupingMode.value !== 'none')

const tableGrouping = computed(() => isTableGroupingActive.value ? ['__groupingKey'] : [])
const tableRenderKey = computed(() =>
  `${resolvedTableKey.value}:${isTableGroupingActive.value ? 'grouped' : 'paged'}:${effectiveGroupingMode.value}`
)

const groupingOptions = computed(() => ({
  groupedColumnMode: 'reorder',
  getGroupedRowModel: getGroupedRowModel()
}))

const desktopColumns = [
  {
    accessorKey: '__groupingOrder',
    enableHiding: true,
    enableSorting: true,
    header: '',
    cell: () => null,
    aggregationFn: 'min',
    sortingFn: 'basic',
    meta: { headerText: 'Grupperingsordning' }
  },
  {
    accessorKey: '__groupingKey',
    enableHiding: false,
    header: '',
    cell: ({ row }) => {
      if (!row.getIsGrouped()) return null
      const label = String(row.getValue('__groupingKey') || row.original?.__groupingKey || 'Grupp')
      const count = row.subRows?.length ?? 0
      const showGroupIcon = effectiveGroupingMode.value === 'groups'
      const iconNode = showGroupIcon
        ? h('img', {
          src: getIconPath(label),
          alt: `${label || 'Svamp'} ikon`,
          class: 'w-5 h-5',
          loading: 'lazy',
          decoding: 'async'
        })
        : null
      const colorNode = h('span', {
        class: 'inline-block h-3 w-3 rounded-full ring-1 ring-black/10 shrink-0',
        style: { backgroundColor: getGroupingAccentColor(label) },
        'aria-hidden': 'true'
      })
      return h('div', { class: 'flex items-center gap-2 py-1' }, [
        h('span', { class: 'inline-block', style: { width: `${row.depth * 0.9}rem` } }),
        h(UButton, {
          variant: 'outline',
          color: 'neutral',
          size: 'xs',
          icon: row.getIsExpanded() ? 'i-lucide-minus' : 'i-lucide-plus',
          onClick: () => row.toggleExpanded()
        }),
        colorNode,
        iconNode,
        h('strong', { class: 'text-sm' }, `${label} (${count} arter)`)
      ])
    },
    aggregationFn: 'count',
    meta: { headerText: 'Gruppering' }
  },
  {
    accessorKey: 'images',
    header: '',
    sortable: false,
    cell: ({ row }) => {
      if (row.getIsGrouped()) return null
      const images = row.getValue('images') || []
      if (images.length) {
        return h('img', {
          src: images[0],
          class: 'h-11 w-14 min-w-14 shrink-0 object-cover -my-3 rounded-md border border-neutral-100 dark:border-neutral-800',
          alt: row.original?.Commonname ? `${row.original.Commonname} bild` : 'Species image',
          loading: 'lazy',
          decoding: 'async',
          height: 300,
          width: 450
        })
      }
      return null
    },
    meta: {
      headerText: 'Bild',
      class: {
        th: 'w-16 min-w-16',
        td: 'w-16 min-w-16'
      }
    }
  },

  {
    accessorKey: 'Commonname',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(
        UButton,
        {
          color: 'neutral',
          variant: 'outline',
          label: 'Namn',
          icon: isSorted
            ? (isSorted === 'asc'
              ? 'i-lucide-arrow-up-narrow-wide'
              : 'i-lucide-arrow-down-wide-narrow')
            : 'i-lucide-arrow-up-down',
          class: '-mx-2.5 ring-muted/50 shadow',
          onClick: () => column.toggleSorting(isSorted === 'asc')
        }
      )
    },
    cell: ({ row }) =>
      row.getIsGrouped()
        ? null
        : h('div', { class: 'text-neutral-700 dark:text-neutral-200 font-semibold truncate text-[16px]' }, capitalize(row.getValue('Commonname'))),
    filterFn: (row, _columnId, filterValue) => {
      if (!filterValue) return true
      const term = String(filterValue).toLowerCase()
      const common = String(row.getValue('Commonname') || '').toLowerCase()
      const scientific = String(row.getValue('Scientificname') || '').toLowerCase()
      return common.includes(term) || scientific.includes(term)
    },
    meta: {
      headerText: 'Namn',
      class: {
        th: 'max-w-60',
        td: 'max-w-60'
      }
    }
  },

  {
    accessorKey: 'Scientificname',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(
        UButton,
        {
          color: 'neutral',
          variant: 'outline',
          label: 'Latinskt namn',
          icon: isSorted
            ? (isSorted === 'asc'
              ? 'i-lucide-arrow-up-narrow-wide'
              : 'i-lucide-arrow-down-wide-narrow')
            : 'i-lucide-arrow-up-down',
          class: '-mx-2.5 ring-muted/50 shadow',
          onClick: () => column.toggleSorting(isSorted === 'asc')
        }
      )
    },
    cell: ({ row }) =>
      row.getIsGrouped()
        ? null
        : h('div', { class: 'max-w-60 truncate text-[16px]' }, row.getValue('Scientificname')),
    meta: {
      headerText: 'Latinskt namn',
      class: {
        th: 'max-w-60',
        td: 'max-w-60'
      }
    }
  },

  {
    accessorKey: props.grupp,
    header: () => h(UDropdownMenu, {
      items: gruppMenuItems.value,
      content: { align: 'start' },
      ui: { content: 'w-48 min-w-fit' }
    }, {
      default: () => h(UButton, { label: 'Grupp', variant: 'outline', color: 'neutral', icon: 'i-lucide-list-filter', class: '-mx-2.5 ring-muted/50 shadow' })
    }),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true
      const rowGroup = normalizeGroupKey(row.getValue(columnId))
      const normalizedFilters = filterValue.map(normalizeGroupKey)
      return normalizedFilters.includes(rowGroup)
    },
    cell: ({ row }) => {
      if (row.getIsGrouped()) return null
      const grupp = row.getValue(props.grupp)
      if (grupp !== 'Saknas') {
        return h('img', {
          src: getIconPath(grupp),
          alt: `${grupp || 'Svamp'} ikon`,
          class: 'w-6',
          loading: 'lazy',
          decoding: 'async'
        })
      }
      return h(Icon, { name: 'heroicons:x-mark-20-solid', class: 'size-7' })
    },
    meta: { headerText: 'Grupp' }
  },
  {
    accessorKey: 'mark',
    enableHiding: props.dataType === 'edna' ? false : true,
    header: () =>
      h(
        UDropdownMenu,
        {
          items: markMenuItems.value,
          content: { align: 'start' },
          ui: { content: 'w-48 min-w-fit' }
        },
        {
          default: () =>
            h(UButton, {
              label: 'Mark',
              variant: 'outline',
              color: 'neutral',
              icon: 'i-lucide-list-filter',
              class: '-mx-2.5 ring-muted/50 shadow'
            })
        }
      ),
    filterFn: (row, _columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true
      let match = false
      if (filterValue.includes('KALKmark') && row.original.KALKmark) match = true
      if (filterValue.includes('ANNANmark') && row.original.ANNANmark) match = true
      return match
    },
    cell: ({ row }) => {
      if (row.getIsGrouped()) return null
      return h(
        'div',
        { class: 'flex items-center space-x-1' },
        [
          row.original.KALKmark && h(UBadge, { color: 'kalkmark', variant: 'subtle' }, () => 'Kalkmark'),
          row.original.ANNANmark && h(UBadge, { color: 'vanligmark', variant: 'subtle' }, () => 'Vanlig skogsmark')
        ].filter(Boolean)
      )
    },
    meta: { headerText: 'Mark' }
  },
  {
    accessorKey: props.mat,
    header: () => h(UDropdownMenu, {
      items: svampMenuItems.value,
      content: { align: 'start' },
      ui: { content: 'w-48 min-w-fit' }
    }, {
      default: () => h(UButton, { label: 'Matsvamp', variant: 'outline', color: 'neutral', icon: 'i-lucide-list-filter', class: '-mx-2.5 ring-muted/50 shadow' })
    }),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true
      let match = false
      if (filterValue.includes('Matsvamp')) {
        match = match || isEdibleSpecies(row.original)
      }
      if (filterValue.includes('Giftsvamp')) {
        match = match || isPoisonSpecies(row.original)
      }
      return match
    },
    cell: ({ row }) =>
      row.getIsGrouped()
        ? null
        : h('div', { class: 'flex gap-1' }, [
          isEdibleSpecies(row.original) && h(UBadge, { color: 'warning', variant: 'subtle' }, () => 'Matsvamp'),
          isPoisonSpecies(row.original) && h(UBadge, { color: 'poison', variant: 'subtle' }, () => 'Giftsvamp')
        ].filter(Boolean)),
    meta: { headerText: 'Matsvamp' }
  },
  {
    accessorKey: 'RL2020kat',
    header: () => h(UDropdownMenu, {
      items: statusMenuItems.value,
      content: { align: 'start' },
      ui: { content: 'w-48 min-w-fit' }
    }, {
      default: () => h(UButton, { label: 'Status', variant: 'outline', color: 'neutral', icon: 'i-lucide-list-filter', class: '-mx-2.5 ring-muted/50 shadow' })
    }),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true
      const statusVal = row.getValue(columnId)
      return filterValue.some((filter) => {
        if (filter === 'Ej bedömd') {
          return (
            statusVal === null
            || statusVal === 0
            || statusVal === '0'
            || String(statusVal).toUpperCase() === 'NE'
          )
        }
        if (filter === 'Ej tillämplig') {
          return String(statusVal).toUpperCase() === 'NA'
        }
        if (filter === 'Signalart') {
          return row.original.SIGNAL_art === 'S'
        }
        return filter === statusVal
      })
    },
    cell: ({ row }) => {
      if (row.getIsGrouped()) return null
      const status = row.getValue('RL2020kat')
      const mainBadge = h(
        UBadge,
        { color: getStatusColor(status), variant: 'subtle' },
        () => getStatusTooltip(status)
      )
      const signalBadge
        = row.original.SIGNAL_art === 'S'
          ? h(UBadge, { color: 'signal', variant: 'subtle' }, 'Signalart')
          : null
      return h('div', { class: 'flex gap-1' }, [mainBadge, signalBadge].filter(Boolean))
    },
    meta: { headerText: 'Status' }
  },
  {
    accessorKey: props.obs,
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(
        UButton,
        {
          color: 'neutral',
          variant: 'outline',
          label: props.obsLabel,
          icon: isSorted
            ? (isSorted === 'asc'
              ? 'i-lucide-arrow-up-narrow-wide'
              : 'i-lucide-arrow-down-wide-narrow')
            : 'i-lucide-arrow-up-down',
          class: '-mx-2.5 ring-muted/50 shadow',
          onClick: () => column.toggleSorting(isSorted === 'asc')
        }
      )
    },
    cell: ({ row }) => {
      if (row.getIsGrouped()) return null
      const val = row.getValue(props.obs)
      if (props.obs.startsWith('Rank')) {
        const label = getProbabilityLabel(val, props.obs)
        if (label) {
          const badgeColor = Number(val) === 3 ? 'error' : 'warning'
          return h(UBadge, { color: badgeColor, variant: 'subtle' }, () => label)
        }
        return null
      }
      return h(UBadge, { variant: 'subtle', color: 'secondary' }, () => `${val} skogar`)
    },
    meta: { headerText: props.obsLabel }
  }
]

const mobileColumns = [
  {
    header: 'Namn',
    cell: ({ row }) => {
      const images = row.original.images || []
      let rarityIcon = null
      const rankVal = props.filterPoison
        ? row.original['Rank giftsvamp']
        : props.filterEdible
          ? row.original['Rank matsvamp']
          : row.original.RankRed
      if (rankVal === 3) {
        rarityIcon = h(Icon, { name: 'codicon:circle-large-filled', class: 'text-red-700 ml-1 size-3.5' })
      } else if (rankVal === 2) {
        rarityIcon = h(Icon, { name: 'codicon:color-mode', class: 'text-yellow-600 ml-1 size-3.5' })
      }
      const imageComp = images.length
        ? h('img', {
          src: images[0],
          alt: row.original.Commonname || 'Svampbild',
          class: 'h-20 w-26 object-cover rounded sm:rounded-md border-[0.5px] border-neutral-200 dark:border-neutral-800 md:ml-2',
          loading: 'lazy',
          decoding: 'async',
          height: 300,
          width: 450
        })
        : h('div', {
          class: 'h-20 w-26 rounded-sm flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 md:ml-2'
        }, [
          h('img', {
            src: getIconPath(row.original[props.grupp]),
            alt: `${row.original[props.grupp] || 'Svamp'} icon`,
            class: 'w-6 h-6',
            loading: 'lazy',
            decoding: 'async'
          })
        ])
      const headerComp = h('div', { class: 'flex items-center text-neutral-700 dark:text-neutral-200' }, [
        h('div', { class: 'flex-1 min-w-0' }, [
          h('div', { class: 'text-lg font-semibold whitespace-normal break-words' }, [
            capitalize(row.original.Commonname),
            rarityIcon
          ]),
          h('small', { class: 'text-xs text-neutral-500 dark:text-neutral-400 italic block truncate max-w-48' }, row.original.Scientificname)
        ])
      ])
      const badgesComp = h('div', { class: 'flex flex-wrap gap-2 mt-2 ' }, [
        (row.original.RL2020kat !== 'LC' && row.original.RL2020kat !== 'NA' && row.original.RL2020kat !== 'NE' && row.original.RL2020kat !== '0')
          ? h(UBadge, { color: getStatusColor(row.original.RL2020kat), variant: 'soft', size: 'sm' }, () => getStatusTooltip(row.original.RL2020kat))
          : null,
        row.original.SIGNAL_art === 'S'
          ? h(UBadge, { color: 'signal', variant: 'soft', size: 'sm' }, () => 'Signalart')
          : null,
        props.dataType === 'edna'
          ? h(UProgress, {
            'modelValue': row.getValue(props.obs),
            'max': sampleEnvCount.value,
            'color': 'secondary',
            'size': 'sm',
            status,
            'indeterminate': false,
            'onUpdate:modelValue': () => { }
          })
          : null
      ].filter(Boolean))
      // Combine into two-column layout: image | (icon+names + badges)
      return h('div', { class: 'flex space-x-4 items-start' }, [
        imageComp,
        h('div', { class: 'flex flex-col flex-1' }, [headerComp, badgesComp])
      ])
    },
    meta: { headerText: 'Namn' }
  },
  // Spread in the desktopColumns, but override the mark column to set enableHiding as needed
  ...desktopColumns.map((col) => {
    if (col.accessorKey === 'mark') {
      return {
        ...col,
        enableHiding: props.dataType === 'edna' ? false : true
      }
    }
    return col
  })
]

// switch between desktop and mobile column sets
const columns = computed(() =>
  useMobileLayout.value ? mobileColumns : desktopColumns
)
// Apply the mobile table styling (headers, dividers, padding) when useMobileLayout is true
const tableUi = computed(() => ({
  root: 'md:px-4',
  thead: useMobileLayout.value
    ? 'hidden'
    : 'hidden md:table-header-group  ',
  tr: useMobileLayout.value
    ? ''
    : 'md:rounded-md',
  tbody: useMobileLayout.value
    ? 'divide-none'
    : 'divide-none md:divide-none md:rounded-md',
  td: useMobileLayout.value
    ? 'empty:p-0 px-0 pt-2 pb-3 cursor-pointer'
    : 'empty:p-0 px-0 md:px-4 md:pt-4 md:pb-4 pt-2 pb-3 first:rounded-l-lg last:rounded-r-lg cursor-default',
  separator: 'bg-transparent '
}))
const topCount = ref(0)
const remainingCount = ref(0)

const data = ref([])
const isLoading = ref(true)
const allColors = ref([])

const generateColors = (start, end, steps) => {
  const stepR = (end[0] - start[0]) / (steps - 1)
  const stepG = (end[1] - start[1]) / (steps - 1)
  const stepB = (end[2] - start[2]) / (steps - 1)
  const colors = []

  for (let i = 0; i < steps; i++) {
    const r = Math.round(start[0] + stepR * i)
    const g = Math.round(start[1] + stepG * i)
    const b = Math.round(start[2] + stepB * i)
    colors.push(`rgb(${r}, ${g}, ${b})`)
  }
  return colors
}
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

  if (
    props.dataTypeFolder === 'edna'
    && !hasEdnaDataset(
      envStore.geography,
      envStore.forestType,
      envStore.standAge,
      envStore.vegetationType
    )
  ) {
    resetData()
    isLoading.value = false
    return
  }

  const filename = `${props.dataType}-${envStore.geography}-${envStore.forestType}-${envStore.standAge}-${envStore.vegetationType}.json`
  try {
    const response = await fetch(`/${props.dataTypeFolder}/${filename}`)
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
    console.error('Error fetching data:', error)
    resetData()
    isLoading.value = false
  }
}

// Helper function to generate rainbow colors
function generateRainbowColors(steps) {
  const colors = []
  const saturation = 70 // Adjust for vibrancy
  const lightness = 50 // Adjust for brightness

  for (let i = 0; i < steps; i++) {
    // Calculate hue from 30° (orange) to 330° (red)
    const hue = 45 + (300 / (steps - 1 || 1)) * i
    colors.push(`hsl(${hue % 360}, ${saturation}%, ${lightness}%)`)
  }
  return colors
}

const envStore = useEnvParamsStore()

watch(
  () => [
    envStore.geography,
    envStore.forestType,
    envStore.standAge,
    envStore.vegetationType
  ],
  () => {
    // Clear previous data and show loading state immediately when parameters change
    // data.value = [];
    isLoading.value = true
    fetchData()
  },
  { immediate: true }
)

const searchQuery = ref('')

const filteredData = computed(() => {
  let result = data.value

  // Apply global search filtering
  if (searchQuery.value) {
    result = result.filter((row) => {
      return Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })
  }

  // Apply edible/poison filtering if specified via props
  if (props.filterEdible) {
    result = result.filter((row) => isEdibleSpecies(row))
  } else if (props.filterPoison) {
    result = result.filter((row) => !isEdibleSpecies(row))
  }

  return result
})

// Limit rows on mobile when in normal view to the top 4 species
const displayedData = computed(() => {
  const rows = filteredData.value
  if (!isTableGroupingActive.value) return rows
  return rows.map(row => ({
    ...row,
    __groupingKey: getRowGroupingLabel(row),
    __groupingOrder: getRowGroupingOrder(row)
  }))
})

watch(
  () => [isTableGroupingActive.value, effectiveGroupingMode.value],
  ([active]) => {
    if (!active) return
    sorting.value = [
      { id: '__groupingOrder', desc: false },
      { id: props.obs, desc: true }
    ]
  },
  { immediate: true }
)

watch(
  sorting,
  (currentSorting) => {
    if (!isTableGroupingActive.value) return

    const withoutGroupingOrder = (currentSorting || []).filter(sort => sort.id !== '__groupingOrder')
    const nextSorting = [{ id: '__groupingOrder', desc: false }, ...withoutGroupingOrder]

    const unchanged = nextSorting.length === (currentSorting?.length || 0)
      && nextSorting.every((sort, index) =>
        sort.id === currentSorting[index]?.id && sort.desc === currentSorting[index]?.desc
      )

    if (!unchanged) {
      sorting.value = nextSorting
    }
  },
  { deep: true }
)

const syncPaginationForGroupingMode = (active) => {
  if (!table.value?.tableApi) return
  if (active) {
    table.value.tableApi.setPagination({
      pageIndex: 0,
      pageSize: Math.max(1, filteredData.value.length)
    })
    return
  }

  const restoredSize = rowsPerPage.value === 'Alla'
    ? Math.max(1, totalItems.value)
    : Number(rowsPerPage.value || 10)

  table.value.tableApi.setPagination({
    pageIndex: 0,
    pageSize: restoredSize
  })
}

watch(
  [isTableGroupingActive, () => table.value?.tableApi],
  ([active]) => {
    syncPaginationForGroupingMode(active)
  },
  { immediate: true, flush: 'post' }
)

// const sorting = ref([{ id: props.obs, desc: false }])

// const sortedData = computed(() => {
//   let result = filteredData.value.slice(); // Create a shallow copy to sort

//   if (sort.value && sort.value.column) {
//     const column = sort.value.column;
//     const direction = sort.value.direction;

//     result.sort((a, b) => {
//       const valueA = a[column];
//       const valueB = b[column];

//       // Handle null or undefined values
//       if (valueA == null && valueB != null) return 1;
//       if (valueA != null && valueB == null) return -1;
//       if (valueA == null && valueB == null) return 0;

//       // Compare values using Swedish locale
//       const comparison = String(valueA).localeCompare(String(valueB), "sv", {
//         numeric: true,
//         sensitivity: "base",
//       });

//       return direction === "asc" ? comparison : -comparison;
//     });
//   }

//   return result;
// });
// const totalItems = computed(() => filteredData.value.length);

watch(rowsPerPage, (newVal) => {
  const newPageSize = !paginationEnabled.value
    ? 100000
    : (newVal === 'Alla' ? totalItems.value || data.value.length : Number(newVal))
  // Update our reactive pagination object:
  pagination.value.pageSize = newPageSize
  pagination.value.pageIndex = 0
  // Force the table to update by calling its API methods:
  if (table.value?.tableApi) {
    table.value.tableApi.setPageSize(newPageSize)
    table.value.tableApi.setPageIndex(0)
  }
})

watch(isMobile, (mobile) => {
  if (!mobile) return
  if (selectedTableGrouping.value !== 'none') {
    selectedTableGrouping.value = 'none'
  }
}, { immediate: true })

watch(
  [rowsPerPage, () => filteredData.value.length, () => table.value?.tableApi, paginationEnabled],
  ([currentRowsPerPage]) => {
    if (!paginationEnabled.value || currentRowsPerPage !== 'Alla') return

    const allRowsSize = Math.max(1, filteredData.value.length || data.value.length || 1)
    const needsLocalUpdate
      = pagination.value.pageIndex !== 0 || pagination.value.pageSize !== allRowsSize

    if (needsLocalUpdate) {
      pagination.value.pageIndex = 0
      pagination.value.pageSize = allRowsSize
    }

    if (table.value?.tableApi) {
      table.value.tableApi.setPagination({
        pageIndex: 0,
        pageSize: allRowsSize
      })
    }
  },
  { immediate: true, flush: 'post' }
)

const currentPaginationRows = computed(() => {
  return table.value?.tableApi?.getPaginationRowModel().rows || []
})

const paginationState = computed(() => table.value?.tableApi?.getState().pagination || { pageIndex: 0, pageSize: 10 })

const startItem = computed(() => {
  // Start index is based on the current page index and page size
  return (paginationState.value.pageIndex * paginationState.value.pageSize) + 1
})

const endItem = computed(() => {
  // End index is the start plus the number of rows in the current page
  const end = (paginationState.value.pageIndex * paginationState.value.pageSize) + currentPaginationRows.value.length
  // Ensure end doesn't exceed the total number of filtered items
  return end > totalItems.value ? totalItems.value : end
})

const totalItems = computed(() => {
  return table.value?.tableApi?.getFilteredRowModel()?.rows.length || 0
})

const visibleRange = computed(() => {
  if (!paginationEnabled.value) {
    return { startIndex: 0, endIndex: Math.max(0, totalItems.value - 1), total: totalItems.value }
  }
  const pageIndex = paginationState.value.pageIndex || 0
  const pageSize = paginationState.value.pageSize || 10
  const startIndex = pageIndex * pageSize
  const endIndex = startIndex + Math.max(0, currentPaginationRows.value.length - 1)
  return { startIndex, endIndex, total: totalItems.value }
})

const columnFilters = computed(() => {
  // If searchTerm is present, filter Commonname (and Scientificname via filterFn)
  const filters = props.searchTerm
    ? [{ id: 'Commonname', value: props.searchTerm }]
    : []
  if (selectedFilter.value && selectedFilter.value.length > 0) {
    filters.push({ id: props.mat, value: selectedFilter.value })
  }
  if (selectedStatus.value && selectedStatus.value.length > 0) {
    filters.push({ id: 'RL2020kat', value: selectedStatus.value })
  }
  if (selectedGrupp.value && selectedGrupp.value.length > 0) {
    filters.push({ id: props.grupp, value: selectedGrupp.value })
  }
  if (selectedMark.value && selectedMark.value.length > 0) {
    filters.push({ id: 'mark', value: selectedMark.value })
  }
  return filters
})

const isFilterActive = (columnId, value) => {
  const rows = table.value?.tableApi?.getFilteredRowModel()?.rows || []
  if (!rows.length) return false
  if (columnId === 'mark') {
    if (value === 'KALKmark') return rows.some(row => row.original.KALKmark)
    if (value === 'ANNANmark') return rows.some(row => row.original.ANNANmark)
    return false
  }
  if (columnId === props.mat) {
    if (value === 'Matsvamp') {
      return rows.some((row) => isEdibleSpecies(row.original))
    }
    if (value === 'Giftsvamp') {
      return rows.some(row => isPoisonSpecies(row.original))
    }
  }
  if (columnId === props.grupp) {
    const normalizedValue = normalizeGroupKey(value)
    return rows.some(row => normalizeGroupKey(row.original?.[props.grupp]) === normalizedValue)
  }
  return rows.some((row) => {
    if (columnId === 'RL2020kat') {
      if (value === 'Ej bedömd') {
        const statusVal = row.original.RL2020kat
        return (
          statusVal === null
          || statusVal === 0
          || statusVal === '0'
          || String(statusVal).toUpperCase() === 'NE'
        )
      }
      if (value === 'Ej tillämplig') {
        return String(row.original.RL2020kat).toUpperCase() === 'NA'
      }
      if (value === 'Signalart') {
        return row.original.SIGNAL_art === 'S'
      }
      return row.original.RL2020kat === value
    }
    return row.getValue(columnId) === value
  })
}

watch(
  columnFilters,
  (newFilters) => {
    if (!table.value?.tableApi) return
    table.value.tableApi.setColumnFilters(newFilters)
  },
  { deep: true, immediate: true, flush: 'post' }
)

watch(
  () => table.value?.tableApi,
  (api) => {
    if (!api) return
    api.setColumnFilters(columnFilters.value)
  },
  { immediate: true, flush: 'post' }
)

// Watch columnFilters to emit matsvampFilter when the matsvamp column filter is active
watch(columnFilters, (newFilters) => {
  // 1) Matsvamp/Giftsvamp
  const svampFilter = newFilters.find(f => f.id === props.mat)
  const svampValues = svampFilter?.value ?? []
  emit('update:matsvampFilter', svampValues.includes('Matsvamp'))
  emit('update:giftsvampFilter', svampValues.includes('Giftsvamp'))

  // 2) Grupp
  const gruppFilterEntry = newFilters.find(f => f.id === props.grupp)
  const gruppValues = gruppFilterEntry?.value ?? []
  emit('update:gruppFilter', gruppValues)

  // 3) Status (RL2020kat)
  const statusFilterEntry = newFilters.find(f => f.id === 'RL2020kat')
  const statusValues = statusFilterEntry?.value ?? []
  emit('update:statusFilter', statusValues)
}, { deep: true, immediate: true })

watch(sorting, (val) => {
  emit('update:sorting', val)
}, { deep: true, immediate: true })

watch(
  selectedTableGrouping,
  (val) => {
    if (String(props.chartGroupingMode || '') !== 'bar') return
    emit('update:tableGroupingMode', val || 'none')
  },
  { immediate: true }
)

watch(visibleRange, (val) => {
  emit('update:visibleRange', val)
}, { deep: true, immediate: true })
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
