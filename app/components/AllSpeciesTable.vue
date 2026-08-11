<template>
  <div>
    <div class="flex flex-col gap-3 px-4 sm:p-6 sm:pb-0 mb-3">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <UInput v-model="search" class="w-full md:max-w-40" placeholder="Sök på namn"
          icon="i-heroicons-magnifying-glass" variant="outline" />
        <div class="flex gap-2">
          <div class="flex flex-wrap gap-2">
            <template v-for="filter in activeFilterBadges" :key="`${filter.key}:${filter.value}`">
              <UBadge trailing-icon="i-heroicons-x-mark-solid" variant="subtle" color="neutral" class="cursor-pointer"
                @click="removeFilterValue(filter.key, filter.value)">
                {{ filter.label }}
              </UBadge>
            </template>
          </div>
          <div class="text-sm text-neutral-500">
            Visar {{ total }} arter
          </div>
        </div>

      </div>


    </div>

    <UTable v-model:sorting="sorting" :data="rows" :columns="columns" :loading="loading" sticky :ui="tableUi"
      @select="selectRow" />

    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-4">
      <div class="text-sm text-neutral-500">
        Visar {{ startItem }} till {{ endItem }} av {{ total }} arter
      </div>

      <div class="flex items-center gap-3 ">
        <USelect v-model="rowsPerPage" :items="rowsPerPageOptions" item-value="value" item-label="label"
          class="w-28 ring-muted/50" :ui="{ content: 'min-w-fit' }" />

        <UPagination active-variant="ghost" variant="ghost" v-model:page="page" :items-per-page="pageSize"
          :total="total" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, ref, resolveComponent, watch } from 'vue'
import { refDebounced } from '@vueuse/core'
import type { TableColumn } from '@nuxt/ui'
import { useSpeciesStore } from '~/stores/speciesStore'

type CountMap = Record<string, number>
type FilterKey = 'group' | 'status' | 'matsvamp' | 'fylum' | 'klass' | 'ordning' | 'familj' | 'slakte'
type FilterState = Record<FilterKey, string[]>
type FilterOptions = Record<FilterKey, string[]> & {
  taxonomyPhylumByValue: {
    klass: Record<string, string>
    ordning: Record<string, string>
    familj: Record<string, string>
    slakte: Record<string, string>
  }
}

type SpeciesRow = {
  Commonname: string
  Scientificname: string
  RL2020kat?: string | null
  SIGNAL_art?: string | null
  'Svamp-grupp'?: string | null
  'Svamp-grupp-släkte'?: string | null
  SKR_rek_matsvamp_2026?: string | null
  Giftsvamp?: string | null
  Fylum?: string | null
  Klass?: string | null
  Ordning?: string | null
  Familj?: string | null
  Släkte?: string | null
  images?: string[]
  total_plot_count: number
  forest_type_plot_counts: CountMap
  stand_age_plot_counts: CountMap
  vegetation_plot_counts: CountMap
}

type QueryChangePayload = {
  search: string
  page: number
  pageSize: number
  sort: string
  order: 'asc' | 'desc'
  filters: FilterState
}

const props = defineProps<{
  rows: SpeciesRow[]
  total: number
  loading?: boolean
  filterOptions: FilterOptions
  initialFilters?: Partial<FilterState>
}>()

const emit = defineEmits<{
  queryChange: [payload: QueryChangePayload]
}>()

const speciesStore = useSpeciesStore()
const search = ref('')
const debouncedSearch = refDebounced(search, 300)
const sorting = ref([{ id: 'Commonname', desc: false }])
const rowsPerPageOptions = [
  { value: 25, label: '25 rader' },
  { value: 50, label: '50 rader' },
  { value: 100, label: '100 rader' }
]
const rowsPerPage = ref(25)
const page = ref(1)

const categoryFilters = ref<FilterState>({
  group: [],
  status: [],
  matsvamp: [],
  fylum: [],
  klass: [],
  ordning: [],
  familj: [],
  slakte: []
})

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const taxonomyBadgeColorByPhylum = {
  Basidiomycota: 'amber',
  Ascomycota: 'sky',
  Glomeromycota: 'purple'
} as const
const taxonomyBadgeClassMap = {
  sky: {
    fylum: 'bg-sky-200/90 text-sky-900 ring ring-inset ring-sky-300/90',
    klass: 'bg-sky-100 text-sky-800 ring ring-inset ring-sky-300/80',
    ordning: 'bg-sky-100 text-sky-700 ring ring-inset ring-sky-300/75',
    familj: 'bg-sky-50 text-sky-700 ring ring-inset ring-sky-200/80',
    slakte: 'bg-sky-100/70 text-sky-700 ring ring-inset ring-sky-200/90'
  },
  amber: {
    fylum: 'bg-amber-200/90 text-amber-900 ring ring-inset ring-amber-300/90',
    klass: 'bg-amber-100 text-amber-800 ring ring-inset ring-amber-300/80',
    ordning: 'bg-amber-100 text-amber-700 ring ring-inset ring-amber-300/75',
    familj: 'bg-amber-50 text-amber-700 ring ring-inset ring-amber-200/80',
    slakte: 'bg-amber-100/70 text-amber-700 ring ring-inset ring-amber-200/90'
  },
  purple: {
    fylum: 'bg-purple-200/90 text-purple-900 ring ring-inset ring-purple-300/90',
    klass: 'bg-purple-100 text-purple-800 ring ring-inset ring-purple-300/80',
    ordning: 'bg-purple-100 text-purple-700 ring ring-inset ring-purple-300/75',
    familj: 'bg-purple-50 text-purple-700 ring ring-inset ring-purple-200/80',
    slakte: 'bg-purple-100/70 text-purple-700 ring ring-inset ring-purple-200/90'
  },
  neutral: {
    fylum: 'bg-gray-200/90 text-gray-900 ring ring-inset ring-gray-300/90',
    klass: 'bg-gray-100 text-gray-800 ring ring-inset ring-gray-300/80',
    ordning: 'bg-gray-100 text-gray-700 ring ring-inset ring-gray-300/75',
    familj: 'bg-gray-50 text-gray-700 ring ring-inset ring-gray-200/80',
    slakte: 'bg-gray-100/70 text-gray-700 ring ring-inset ring-gray-200/90'
  }
} as const
const taxonomyFilterChipClassMap = {
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
  purple: 'bg-purple-500',
  neutral: 'bg-gray-400'
} as const

function areArraysEqual(a: string[] = [], b: string[] = []) {
  return a.length === b.length && a.every((value, index) => value === b[index])
}

function areFiltersEqual(a: FilterState, b: FilterState) {
  return areArraysEqual(a.group, b.group)
    && areArraysEqual(a.status, b.status)
    && areArraysEqual(a.matsvamp, b.matsvamp)
    && areArraysEqual(a.fylum, b.fylum)
    && areArraysEqual(a.klass, b.klass)
    && areArraysEqual(a.ordning, b.ordning)
    && areArraysEqual(a.familj, b.familj)
    && areArraysEqual(a.slakte, b.slakte)
}

function capitalize(value?: string | null) {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

function getStatusTooltip(status?: string | null) {
  if (status === 'Ej bedömd') return 'Ej bedömd'
  if (status === 'Ej tillämplig') return 'Ej tillämplig'
  const tooltips: Record<string, string> = {
    LC: 'Livskraftig',
    NT: 'Nära hotad',
    EN: 'Starkt hotad',
    VU: 'Sårbar',
    CR: 'Akut hotad',
    RE: 'Nationellt utdöd',
    DD: 'Kunskapsbrist'
  }

  const normalized = String(status || '').toUpperCase()
  if (!status || status === '0' || normalized === 'NE') return 'Ej bedömd'
  if (normalized === 'NA') return 'Ej tillämplig'
  return tooltips[String(status)] || 'Ej bedömd'
}

function getStatusColor(status?: string | null) {
  const colors: Record<string, string> = {
    LC: 'rl-lc',
    DD: 'rl-dd',
    NT: 'rl-nt',
    VU: 'rl-vu',
    EN: 'rl-en',
    CR: 'rl-cr',
    RE: 'rl-re'
  }
  return colors[String(status)] || 'neutral'
}

function isEdibleSpecies(row: SpeciesRow) {
  return String(row.SKR_rek_matsvamp_2026 || '').toLowerCase() === 'x'
}

function isPoisonSpecies(row: SpeciesRow) {
  return String(row.Giftsvamp || '').toLowerCase() === 'x'
}

function getDisplayGroup(row: SpeciesRow) {
  if (row['Svamp-grupp'] && row['Svamp-grupp'] !== '0') return row['Svamp-grupp']
  return row['Svamp-grupp-släkte'] || 'Saknas'
}

function getTaxonomyBadgeColor(fylum?: string | null) {
  return taxonomyBadgeColorByPhylum[fylum as keyof typeof taxonomyBadgeColorByPhylum] || 'neutral'
}

function getTaxonomyFilterItemColor(
  key: Extract<FilterKey, 'fylum' | 'klass' | 'ordning' | 'familj' | 'slakte'>,
  value: string
) {
  if (key === 'fylum') {
    return getTaxonomyBadgeColor(value)
  }

  const phylum = props.filterOptions.taxonomyPhylumByValue?.[key]?.[value]
  return getTaxonomyBadgeColor(phylum)
}

function renderTaxonomyBadge(
  value: string | null | undefined,
  level: 'fylum' | 'klass' | 'ordning' | 'familj' | 'slakte',
  row: SpeciesRow
) {
  const label = value || 'Saknas'
  const color = getTaxonomyBadgeColor(row.Fylum)
  return h(UBadge, {
    variant: 'subtle',
    color,
    class: taxonomyBadgeClassMap[color][level]
  }, () => label)
}

function getIconPath(svampGrupp?: string | null) {
  const iconMapping: Record<string, string> = {
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

  return `/images/svampgrupp/${iconMapping[String(svampGrupp)] || 'default-icon.webp'}`
}

function buildFilterMenuItems(
  key: FilterKey,
  options: string[],
  formatter?: (value: string) => string
) {
  const isTaxonomyKey = ['fylum', 'klass', 'ordning', 'familj', 'slakte'].includes(key)

  return options.map((option) => ({
    label: formatter ? formatter(option) : option,
    type: 'checkbox' as const,
    chipClass: isTaxonomyKey
      ? taxonomyFilterChipClassMap[
      getTaxonomyFilterItemColor(
        key as Extract<FilterKey, 'fylum' | 'klass' | 'ordning' | 'familj' | 'slakte'>,
        option
      )
      ]
      : undefined,
    checked: categoryFilters.value[key].includes(option),
    onUpdateChecked(checked: boolean) {
      if (checked) {
        if (!categoryFilters.value[key].includes(option)) {
          categoryFilters.value[key].push(option)
        }
      } else {
        categoryFilters.value[key] = categoryFilters.value[key].filter((value) => value !== option)
      }
      page.value = 1
    },
    onSelect(event: Event) {
      event.preventDefault()
    }
  }))
}

const activeFilterBadges = computed(() => [
  ...categoryFilters.value.group.map((value) => ({ key: 'group', value, label: `Grupp: ${capitalize(value)}` })),
  ...categoryFilters.value.status.map((value) => ({ key: 'status', value, label: `Status: ${value}` })),
  ...categoryFilters.value.matsvamp.map((value) => ({ key: 'matsvamp', value, label: `Mat/Gift: ${value}` })),
  ...categoryFilters.value.fylum.map((value) => ({ key: 'fylum', value, label: `Fylum: ${value}` })),
  ...categoryFilters.value.klass.map((value) => ({ key: 'klass', value, label: `Klass: ${value}` })),
  ...categoryFilters.value.ordning.map((value) => ({ key: 'ordning', value, label: `Ordning: ${value}` })),
  ...categoryFilters.value.familj.map((value) => ({ key: 'familj', value, label: `Familj: ${value}` })),
  ...categoryFilters.value.slakte.map((value) => ({ key: 'slakte', value, label: `Släkte: ${value}` }))
])

watch(
  () => props.initialFilters,
  (nextFilters) => {
    if (!nextFilters) return
    const normalizedFilters = {
      group: [...(nextFilters.group || [])],
      status: [...(nextFilters.status || [])],
      matsvamp: [...(nextFilters.matsvamp || [])],
      fylum: [...(nextFilters.fylum || [])],
      klass: [...(nextFilters.klass || [])],
      ordning: [...(nextFilters.ordning || [])],
      familj: [...(nextFilters.familj || [])],
      slakte: [...(nextFilters.slakte || [])]
    }

    if (areFiltersEqual(categoryFilters.value, normalizedFilters)) {
      return
    }

    categoryFilters.value = normalizedFilters
    page.value = 1
  },
  { deep: true, immediate: true }
)

function removeFilterValue(key: string, value: string) {
  const typedKey = key as FilterKey
  categoryFilters.value[typedKey] = categoryFilters.value[typedKey].filter((entry) => entry !== value)
  page.value = 1
}

const pageSize = computed(() => rowsPerPage.value)
const startItem = computed(() => {
  if (!props.total) return 0
  return (page.value - 1) * pageSize.value + 1
})
const endItem = computed(() => Math.min(page.value * pageSize.value, props.total))

watch(rowsPerPage, () => {
  page.value = 1
})

watch(search, () => {
  page.value = 1
})

watch(sorting, () => {
  page.value = 1
}, { deep: true })

watch(
  [debouncedSearch, page, rowsPerPage, sorting, categoryFilters],
  () => {
    const currentSorting = sorting.value[0] || { id: 'Commonname', desc: false }
    emit('queryChange', {
      search: debouncedSearch.value,
      page: page.value,
      pageSize: rowsPerPage.value,
      sort: currentSorting.id,
      order: currentSorting.desc ? 'desc' : 'asc',
      filters: {
        group: [...categoryFilters.value.group],
        status: [...categoryFilters.value.status],
        matsvamp: [...categoryFilters.value.matsvamp],
        fylum: [...categoryFilters.value.fylum],
        klass: [...categoryFilters.value.klass],
        ordning: [...categoryFilters.value.ordning],
        familj: [...categoryFilters.value.familj],
        slakte: [...categoryFilters.value.slakte]
      }
    })
  },
  { immediate: true, deep: true }
)

watch(() => props.total, (value) => {
  const maxPage = Math.max(1, Math.ceil(value / pageSize.value))
  if (page.value > maxPage) {
    page.value = maxPage
  }
})

function renderSortableHeader(label: string, column: any) {
  const isSorted = column.getIsSorted()
  return h(UButton, {
    color: 'neutral',
    variant: 'outline',
    label,
    icon: isSorted
      ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow')
      : 'i-lucide-arrow-up-down',
    class: '-mx-2.5 ring-muted/50 shadow',
    onClick: () => column.toggleSorting(isSorted === 'asc')
  })
}

function renderFilterHeader(label: string, items: any[]) {
  return h(UDropdownMenu, {
    items,
    content: { align: 'start' },
    ui: { content: 'w-56 min-w-fit max-h-96 overflow-auto' }
  }, {
    'item-leading': ({ item }: { item: { chipClass?: string } }) => (
      item.chipClass
        ? [
          h('span', {
            class: ['inline-block h-2.5 w-2.5 rounded-full shrink-0 self-center', item.chipClass]
          })
        ]
        : []
    ),
    default: () => h(UButton, {
      label,
      variant: 'outline',
      color: 'neutral',
      icon: 'i-lucide-list-filter',
      class: '-mx-2.5 ring-muted/50 shadow'
    })
  })
}

function selectRow(event: unknown, row?: { original?: SpeciesRow }) {
  const selected = row?.original || (event as { original?: SpeciesRow })?.original
  if (!selected) return
  speciesStore.selectSpecies(selected, 'all-species')
}

const columns: TableColumn<SpeciesRow>[] = [
  {
    accessorKey: 'images',
    header: '',
    cell: ({ row }) => {
      const image = row.original.images?.[0]
      if (image) {
        return h('img', {
          src: image,
          class: 'h-11 w-14 min-w-14 shrink-0 object-cover -my-3 rounded-md border border-neutral-100',
          alt: row.original.Commonname ? `${row.original.Commonname} bild` : 'Artbild',
          loading: 'lazy',
          decoding: 'async',
          height: 300,
          width: 450
        })
      }

      return null
    }
  },
  {
    accessorKey: 'Commonname',
    header: ({ column }) => renderSortableHeader('Namn', column),
    cell: ({ row }) => h('div', { class: 'text-neutral-700 font-semibold truncate text-[16px]' }, capitalize(row.original.Commonname)),
    sortingFn: 'alphanumeric'
  },
  {
    accessorKey: 'Scientificname',
    header: ({ column }) => renderSortableHeader('Latinskt namn', column),
    cell: ({ row }) => h('div', { class: 'max-w-60 truncate text-[16px] italic' }, row.original.Scientificname),
    sortingFn: 'alphanumeric'
  },
  {
    id: 'group',
    accessorFn: (row) => getDisplayGroup(row),
    header: () => renderFilterHeader('Grupp', buildFilterMenuItems('group', props.filterOptions.group || [], capitalize)),
    cell: ({ row }) => h('div', { class: 'flex items-center justify-center' }, [
      h('img', {
        src: getIconPath(getDisplayGroup(row.original)),
        alt: 'Svampgrupp',
        class: 'w-6 h-6',
        loading: 'lazy',
        decoding: 'async'
      })
    ]),
    sortingFn: 'alphanumeric'
  },
  {
    id: 'matsvamp',
    accessorFn: (row) => [
      isEdibleSpecies(row) ? 'Matsvamp' : null,
      isPoisonSpecies(row) ? 'Giftsvamp' : null
    ].filter(Boolean).join(', '),
    header: () => renderFilterHeader(
      'Matsvamp',
      buildFilterMenuItems(
        'matsvamp',
        props.filterOptions.matsvamp || []
      )
    ),
    cell: ({ row }) => h('div', { class: 'flex gap-1 flex-wrap' }, [
      isEdibleSpecies(row.original)
        ? h(UBadge, { color: 'warning', variant: 'subtle' }, () => 'Matsvamp')
        : null,
      isPoisonSpecies(row.original)
        ? h(UBadge, { color: 'poison', variant: 'subtle' }, () => 'Giftsvamp')
        : null
    ].filter(Boolean)),
    sortingFn: 'alphanumeric'
  },
  {
    id: 'status',
    accessorFn: (row) => getStatusTooltip(row.RL2020kat),
    header: () => renderFilterHeader('Status', buildFilterMenuItems('status', props.filterOptions.status || [])),
    cell: ({ row }) => h('div', { class: 'flex gap-1 flex-wrap' }, [
      h(UBadge, { color: getStatusColor(row.original.RL2020kat), variant: 'subtle' }, () => getStatusTooltip(row.original.RL2020kat)),
      row.original.SIGNAL_art === 'S'
        ? h(UBadge, { color: 'signal', variant: 'subtle' }, () => 'Signalart')
        : null
    ].filter(Boolean)),
    sortingFn: 'alphanumeric'
  },
  {
    accessorKey: 'total_plot_count',
    header: ({ column }) => renderSortableHeader('Provytor', column),
    cell: ({ row }) => h('div', { class: 'text-neutral-700 text-sm tabular-nums' }, String(Number(row.original.total_plot_count || 0))),
    sortingFn: 'basic'
  },
  {
    accessorKey: 'Fylum',
    header: () => renderFilterHeader('Fylum', buildFilterMenuItems('fylum', props.filterOptions.fylum || [])),
    cell: ({ row }) => renderTaxonomyBadge(row.original.Fylum, 'fylum', row.original),
    sortingFn: 'alphanumeric'
  },
  {
    accessorKey: 'Klass',
    header: () => renderFilterHeader('Klass', buildFilterMenuItems('klass', props.filterOptions.klass || [])),
    cell: ({ row }) => renderTaxonomyBadge(row.original.Klass, 'klass', row.original),
    sortingFn: 'alphanumeric'
  },
  {
    accessorKey: 'Ordning',
    header: () => renderFilterHeader('Ordning', buildFilterMenuItems('ordning', props.filterOptions.ordning || [])),
    cell: ({ row }) => renderTaxonomyBadge(row.original.Ordning, 'ordning', row.original),
    sortingFn: 'alphanumeric'
  },
  {
    accessorKey: 'Familj',
    header: () => renderFilterHeader('Familj', buildFilterMenuItems('familj', props.filterOptions.familj || [])),
    cell: ({ row }) => renderTaxonomyBadge(row.original.Familj, 'familj', row.original),
    sortingFn: 'alphanumeric'
  },
  {
    accessorKey: 'Släkte',
    header: () => renderFilterHeader('Släkte', buildFilterMenuItems('slakte', props.filterOptions.slakte || [])),
    cell: ({ row }) => renderTaxonomyBadge(row.original.Släkte, 'slakte', row.original),
    sortingFn: 'alphanumeric'
  }
]

const tableUi = {
  root: 'md:px-4',
  thead: 'hidden md:table-header-group',
  tr: 'md:rounded-md',
  tbody: 'divide-none md:divide-none md:rounded-md',
  td: 'empty:p-0 px-0 md:px-4 md:pt-4 md:pb-4 pt-2 pb-3 first:rounded-l-lg last:rounded-r-lg cursor-default',
  separator: 'bg-transparent'
}
</script>
