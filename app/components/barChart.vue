<template>
  <div>
    <div v-if="showControls && !isMobile" class="flex items-center justify-between gap-3 mb-3">
      <UTabs v-if="showModeTabs" v-model="chartTypeTab" :items="chartTypeTabs" size="md" :ui="{
        root: '',
        list: 'flex-nowrap gap-2 bg-transparent',
        indicator: 'bg-white border border-muted/50 shadow',
        trigger: 'data-[state=active]:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
      }" />
      <USelect v-if="showModeTabs && chartTypeTab === 'treemap'" v-model="treemapGroupingMode"
        :items="treemapGroupingOptions" item-value="value" item-label="label" class="ring-muted/50"
        :ui="{ content: 'min-w-fit' }" />
    </div>
    <!-- Zoom controls only on desktop -->
    <!-- <div v-if="showControls && !isMobile" class="flex justify-end gap-2 mb-2 mx-2">
      <UButton @click="zoomOut" icon="i-heroicons-magnifying-glass-minus" color="neutral" variant="ghost" />
      <UButton @click="zoomIn" icon="i-heroicons-magnifying-glass-plus" color="neutral" variant="ghost" />
    </div> -->
    <!-- Chart on desktop -->
    <div v-if="!isMobile" :key="chartShellRenderKey" ref="chartHostRef" :class="[
      'w-full overflow-y-auto overflow-x-scroll',
      { 'bar-chart-container': currentZoomIndex === 0 }
    ]" @click="handleChartClick">
      <EdnaBarModeChart v-if="viewMode === 'bar'" :data="displayedBarData" :width="chartWidth" :height="chartHeight"
        :plot-band-range="plotBandRange" :selected-plot-band-range="selectedPlotBandRange" :x-accessor="xAccessor"
        :y-accessor="yAccessor" :bar-color-accessor="barColorAccessor" :show-y-axis="showYAxis"
        :show-tooltip="showTooltip" :has-data="hasData" :triggers="triggers" :tooltip-template="tooltipTemplate"
        :bar-events="barEvents" />

      <div v-else ref="treemapWrapperRef" class="space-y-2">
        <div ref="treemapContainerRef">
          <VisSingleContainer :data="treemapSourceData" :height="chartHeight">
            <VisTooltip :horizontal-placement="treemapTooltipPlacement" :horizontal-shift="12"
              :triggers="treemapTooltipTriggersConfig" />
            <VisTreemap :id="treemapDatumId" :tile-border-radius="4" :layers="treemapLayersConfig"
              :value="treemapValueAccessor" :tile-color="treemapTileColorConfig" :tile-label="treemapTileLabelConfig"
              :label-offset-x="6" :label-offset-y="8" :tile-padding-top="20" :enable-lightness-variance="false"
              :enable-tile-label-font-size-variation="true" :tile-show-html-tooltip="false"
              :show-tile-click-affordance="true" :label-internal-nodes="true" :events="treemapEventsWithTooltipFlip" />
          </VisSingleContainer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useMediaQuery, useElementSize } from '@vueuse/core'
import { VisSingleContainer, VisTooltip, VisTreemap, VisTreemapSelectors } from '@unovis/vue'
import { Position, StackedBar, Treemap } from '@unovis/ts'
import { useEnvParamsStore } from '~/stores/envParamsStore'
import { useSpeciesStore } from '~/stores/speciesStore'
import { hasEdnaDataset } from '~/utils/edna'

const props = defineProps({
  searchTerm: { type: String, default: '' },
  matsvampFilter: { type: Boolean, default: false },
  giftsvampFilter: { type: Boolean, default: false },
  gruppFilter: { type: Array as PropType<string[]>, default: () => [] },
  groupKey: { type: String, default: 'Svamp-grupp-släkte' },
  statusFilter: { type: Array as PropType<string[]>, default: () => [] },
  sortOrder: { type: Array as PropType<Array<{ id: string, desc: boolean }>>, default: () => [] },
  visibleRange: { type: Object as PropType<{ startIndex: number, endIndex: number, total: number } | null>, default: null },
  chartHeight: { type: Number, default: 150 },
  showControls: { type: Boolean, default: true },
  showModeTabs: { type: Boolean, default: true },
  showYAxis: { type: Boolean, default: true },
  showTooltip: { type: Boolean, default: true },
  barGroupingMode: { type: String as PropType<'none' | 'groups' | 'edibility' | 'redlist' | 'visible'>, default: 'none' },
  viewMode: { type: String as PropType<'bar' | 'treemap-standard' | 'treemap-groups' | 'treemap-edibility' | 'treemap-redlist' | 'treemap-visible'>, default: 'bar' }
})
const emit = defineEmits<{
  (e: 'update:viewMode', value: 'bar' | 'treemap-standard' | 'treemap-groups' | 'treemap-edibility' | 'treemap-redlist' | 'treemap-visible'): void
}>()

// ----- Filtering & Zoom Setup -----
const zoomLevels = [1, 2, 4, 8]
const currentZoomIndex = ref(0)
const chartShellRenderKey = ref(0)
const chartHostRef = ref<HTMLElement | null>(null)
const { width: chartHostWidth } = useElementSize(chartHostRef)
const chartWidth = computed(() => {
  const baseWidth = Math.max(320, Math.floor(chartHostWidth.value || 0))
  return Math.floor(baseWidth * zoomLevels[currentZoomIndex.value])
})
const viewMode = computed(() => props.viewMode)
const lastTreemapMode = useState<'treemap-standard' | 'treemap-groups' | 'treemap-edibility' | 'treemap-redlist' | 'treemap-visible'>(
  'edna-last-treemap-mode',
  () => 'treemap-groups'
)
const chartTypeTabs = [
  { label: 'Stapeldiagram', value: 'bar', icon: 'fluent:data-bar-vertical-20-regular' },
  { label: 'Träddiagram', value: 'treemap', icon: 'fluent:data-treemap-20-regular' }
]
const chartTypeTab = computed<'bar' | 'treemap'>({
  get: () => (viewMode.value === 'bar' ? 'bar' : 'treemap'),
  set: (value) => {
    if (value === 'bar') {
      emit('update:viewMode', 'bar')
      return
    }
    if (viewMode.value === 'bar') {
      emit('update:viewMode', lastTreemapMode.value === 'treemap-standard' ? 'treemap-groups' : lastTreemapMode.value)
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
    if (viewMode.value === 'treemap-standard') return 'treemap-groups'
    if (viewMode.value === 'treemap-edibility') return 'treemap-edibility'
    if (viewMode.value === 'treemap-redlist') return 'treemap-redlist'
    if (viewMode.value === 'treemap-visible') return 'treemap-visible'
    return 'treemap-groups'
  },
  set: (value) => {
    emit('update:viewMode', value)
  }
})
const treemapWrapperRef = ref<HTMLElement | null>(null)
const treemapContainerRef = ref<HTMLElement | null>(null)
let treemapSyncRaf = 0
let treemapSyncTimer: ReturnType<typeof setTimeout> | null = null
const treemapTooltipPlacement = ref<Position.Left | Position.Right>(Position.Right)
const enableTreemapLeafGroupIcons = true
const activeTreemapMode = computed<'treemap-standard' | 'treemap-groups' | 'treemap-edibility' | 'treemap-redlist' | 'treemap-visible'>(() => {
  if (viewMode.value === 'treemap-standard') return 'treemap-standard'
  if (viewMode.value === 'treemap-edibility') return 'treemap-edibility'
  if (viewMode.value === 'treemap-redlist') return 'treemap-redlist'
  if (viewMode.value === 'treemap-visible') return 'treemap-visible'
  return 'treemap-groups'
})

// ----- Chart Data & Color Setup -----
const chartData = ref<any[]>([])
const envStore = useEnvParamsStore()
const speciesStore = useSpeciesStore()
const normalizeScientificName = (value: any) => String(value || '').trim().toLowerCase()
const activeSelectedScientificName = computed(() =>
  normalizeScientificName(speciesStore.pendingScientificname || (speciesStore.selectedSpecies as any)?.Scientificname)
)
function sortData(data: any[]) {
  return data.sort((a, b) => b.sample_plot_count - a.sample_plot_count)
}
function generateColors(
  start: [number, number, number],
  end: [number, number, number],
  steps: number
): string[] {
  if (steps <= 0) return []
  const stepR = (end[0] - start[0]) / (steps - 1 || 1)
  const stepG = (end[1] - start[1]) / (steps - 1 || 1)
  const stepB = (end[2] - start[2]) / (steps - 1 || 1)
  const colors = []
  for (let i = 0; i < steps; i++) {
    const r = Math.round(start[0] + stepR * i)
    const g = Math.round(start[1] + stepG * i)
    const b = Math.round(start[2] + stepB * i)
    colors.push(`rgb(${r}, ${g}, ${b})`)
  }
  return colors
}
function generateRainbowColors(steps: number): string[] {
  const colors = []
  const saturation = 70, lightness = 50
  for (let i = 0; i < steps; i++) {
    const hue = 45 + (300 / (steps - 1 || 1)) * i
    colors.push(`hsl(${hue % 360}, ${saturation}%, ${lightness}%)`)
  }
  return colors
}

function getSortValue(row: any, key: string) {
  if (!row || !key) return undefined
  return row[key]
}

function compareRowsBySortOrder(a: any, b: any, sorters: Array<{ id: string, desc: boolean }>) {
  for (const sorter of sorters) {
    const key = sorter.id
    if (!key || key === '__groupingOrder') continue
    const aVal = getSortValue(a, key)
    const bVal = getSortValue(b, key)
    const aNum = typeof aVal === 'number' ? aVal : Number(aVal)
    const bNum = typeof bVal === 'number' ? bVal : Number(bVal)
    let cmp = 0
    if (Number.isFinite(aNum) && Number.isFinite(bNum)) {
      cmp = aNum - bNum
    } else {
      cmp = String(aVal ?? '').localeCompare(String(bVal ?? ''), 'sv')
    }
    if (cmp !== 0) return sorter.desc ? -cmp : cmp
  }
  return 0
}

const sortedChartData = computed(() => {
  const data = [...chartData.value]
  if (!props.sortOrder.length) return data
  const sorters = props.sortOrder
  data.sort((a, b) => {
    for (const sorter of sorters) {
      const key = sorter.id
      const aVal = getSortValue(a, key)
      const bVal = getSortValue(b, key)
      const aNum = typeof aVal === 'number' ? aVal : Number(aVal)
      const bNum = typeof bVal === 'number' ? bVal : Number(bVal)
      let cmp = 0
      if (Number.isFinite(aNum) && Number.isFinite(bNum)) {
        cmp = aNum - bNum
      } else {
        cmp = String(aVal ?? '').localeCompare(String(bVal ?? ''), 'sv')
      }
      if (cmp !== 0) return sorter.desc ? -cmp : cmp
    }
    return 0
  })
  return data
})

async function fetchChartData() {
  const params = [envStore.geography, envStore.forestType, envStore.standAge, envStore.vegetationType]
  if (params.some(param => !param)) {
    chartData.value = []
    return
  }

  if (!hasEdnaDataset(...params)) {
    chartData.value = []
    return
  }

  const filename = `edna-${envStore.geography}-${envStore.forestType}-${envStore.standAge}-${envStore.vegetationType}.json`
  try {
    const response = await fetch(`/edna/${filename}`)
    if (!response.ok) {
      if (response.status === 404) {
        chartData.value = []
        return
      }
      throw new Error(`Failed to fetch ${filename}`)
    }
    let jsonData = await response.json()
    jsonData = sortData(jsonData)
    const totalSpecies = jsonData.length
    const numberOfGrayBars = Math.floor(totalSpecies * 0.2)
    const numberOfColorBars = totalSpecies - numberOfGrayBars
    const grayColors = generateColors([82, 82, 82], [212, 212, 212], numberOfGrayBars)
    const rainbowColors = generateRainbowColors(numberOfColorBars)
    const colors = [...grayColors, ...rainbowColors]
    chartData.value = jsonData.map((d: any, i: number) => ({
      ...d,
      fillColor: colors[i] || 'var(--ui-primary)'
    }))
  } catch (error) {
    console.error('Error fetching chart data:', error)
    chartData.value = []
  }
}
onMounted(fetchChartData)
watch(
  () => [envStore.geography, envStore.forestType, envStore.standAge, envStore.vegetationType],
  fetchChartData,
  { immediate: true }
)

// ----- Accessors & Formatters -----
const xAccessor = (_: any, i: number) => i
const yAccessor = (d: any) => d.sample_plot_count

function shouldMatchTable(d: any) {
  if (!d) return false
  const term = props.searchTerm.trim().toLowerCase()
  const common = String(d.Commonname || '').toLowerCase()
  const scientific = String(d.Scientificname || '').toLowerCase()
  const matchSearch = term ? (common.includes(term) || scientific.includes(term)) : true

  const statusActive = props.statusFilter.length > 0
  const svampActive = props.matsvampFilter || props.giftsvampFilter
  const groupActive = props.gruppFilter.length > 0

  if (!statusActive && !svampActive && !groupActive && props.searchTerm.trim() === '') {
    return true
  }

  const matchSignal
    = statusActive
    && props.statusFilter.includes('Signalart')
    && (d.SIGNAL_art === 'S')

  const otherStatuses = props.statusFilter.filter(s => s !== 'Signalart')
  const matchEjBedom = statusActive && props.statusFilter.includes('Ej bedömd')
    && (d.RL2020kat === null || d.RL2020kat === 0 || d.RL2020kat === '0' || String(d.RL2020kat).toUpperCase() === 'NE')
  const matchEjTillamplig = statusActive && props.statusFilter.includes('Ej tillämplig')
    && String(d.RL2020kat).toUpperCase() === 'NA'
  const matchStatus = statusActive
    ? matchSignal || otherStatuses.includes(d.RL2020kat)
    : false

  const matchMats = props.matsvampFilter ? d.matsvamp == 1 : false
  const matchGifts = props.giftsvampFilter
    ? (d.Giftsvamp || '').toLowerCase() === 'x'
    : false

  const matchGroup = matchesGroupFilter(d)

  if (statusActive) {
    if (!svampActive && !groupActive) {
      return matchSearch && (matchSignal || matchStatus || matchEjBedom || matchEjTillamplig)
    }
    const passesStatus = matchSearch && (matchSignal || matchStatus || matchEjBedom || matchEjTillamplig)
    const passesSvamp = svampActive ? (matchMats || matchGifts) : true
    const passesGroupVal = groupActive ? matchGroup : true
    return passesStatus && passesSvamp && passesGroupVal
  }

  if (svampActive || groupActive) {
    if (svampActive && !groupActive) return matchSearch && (matchMats || matchGifts)
    if (!svampActive && groupActive) return matchSearch && matchGroup
    const passesSvampOnly = matchSearch && (matchMats || matchGifts)
    return passesSvampOnly && matchGroup
  }

  return matchSearch
}

function matchesGroupFilter(d: any) {
  if (!props.gruppFilter.length) return false
  const rowGroup = normalizeGroupKey(d?.[props.groupKey])
  return props.gruppFilter.some(group => normalizeGroupKey(group) === rowGroup)
}

function capitalizeFirstLetter(str: string): string {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

const filteredSortedData = computed(() => sortedChartData.value.filter(d => shouldMatchTable(d)))
const treemapBaseData = computed(() => filteredSortedData.value)
const getSpeciesStableId = (d: any) => {
  const scientific = String(d?.Scientificname || '').trim()
  if (scientific) return scientific
  const common = String(d?.Commonname || '').trim()
  if (common) return common
  return 'Okänd art'
}
const keyForRow = (d: any) => getSpeciesStableId(d)

const getTreemapSpeciesLayerKey = (
  datum: any
) => {
  return getSpeciesStableId(datum)
}

const treemapDatumId = (d: any) => getTreemapSpeciesLayerKey(d)

const treemapValueAccessor = (d: any) => Number(d?.sample_plot_count || 0)

const treemapPalette = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#e11d48']
const treemapGroupColorOverrides: Record<string, string> = {
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
const treemapGroupIconMap: Record<string, string> = {
  ovrigt: 'ovrigt.webp',
  hattsvamp: 'hattsvamp.png',
  kantarell: 'kantarell.webp',
  sopp: 'sopp.png',
  taggsvamp: 'taggsvamp.png',
  fingersvamp: 'fingersvamp.webp',
  tryffel: 'tryffel.webp',
  skinnsvamp: 'skinnsvamp.webp',
  skalsvamp: 'skalsvamp.webp'
}
const treemapEdibilityColors: Record<string, string> = {
  matsvamp: '#facc15',
  giftsvamp: '#a3e635',
  ovrigt: '#9ca3af'
}
const redlistColorByCode: Record<string, string> = {
  LC: 'var(--color-redlist-lc)',
  DD: 'var(--color-redlist-dd)',
  NT: 'var(--color-redlist-nt)',
  VU: 'var(--color-redlist-vu)',
  EN: 'var(--color-redlist-en)',
  CR: 'var(--color-redlist-cr)',
  RE: 'var(--color-redlist-re)'
}
const treemapRedlistColors: Record<string, string> = {
  lc: redlistColorByCode.LC,
  dd: redlistColorByCode.DD,
  nt: redlistColorByCode.NT,
  vu: redlistColorByCode.VU,
  en: redlistColorByCode.EN,
  cr: redlistColorByCode.CR,
  re: redlistColorByCode.RE,
  ovrigt: '#9ca3af'
}
const treemapVisibleColors: Record<string, string> = {
  'svampar som syns': '#a37153',
  'svampar som ar svara att se': '#d1bba0',
  'synlighet saknas': '#d4d4d4'
}

const normalizeGroupKey = (value: string) => String(value || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/\p{Diacritic}+/gu, '')

const getGroupIconUrl = (group: string) => {
  const normalized = normalizeGroupKey(group)
  const iconFile = treemapGroupIconMap[normalized] ?? 'default-icon.png'
  return `/images/svampgrupp/${iconFile}`
}

const getEdibilityGroup = (datum: any) => {
  const isEdible = datum?.matsvamp == 1
  const isPoison = String(datum?.Giftsvamp || '').toLowerCase() === 'x'
  if (isEdible) return 'Matsvamp'
  if (isPoison) return 'Giftsvamp'
  return 'Övrigt'
}

const getRedlistGroup = (datum: any) => {
  const status = String(datum?.RL2020kat || '').trim().toUpperCase()
  const redlistLabelByCode: Record<string, string> = {
    LC: 'Livskraftig',
    DD: 'Kunskapsbrist',
    NT: 'Nära hotad',
    VU: 'Sårbar',
    EN: 'Starkt hotad',
    CR: 'Akut hotad',
    RE: 'Nationellt utdöd'
  }
  if (redlistLabelByCode[status]) return redlistLabelByCode[status]
  return 'Övrigt'
}

const getRedlistColorForDatum = (datum: any) => {
  const status = String(datum?.RL2020kat || '').trim().toUpperCase()
  return redlistColorByCode[status] || null
}

const getVisibilityGroup = (datum: any) => {
  const synlighet = datum?.synlighet
  if (synlighet === 1 || synlighet === '1') return 'Svampar som syns'
  if (synlighet === 0 || synlighet === '0') return 'Svampar som är svåra att se'
  return 'Synlighet saknas'
}

const getTreemapGroupForDatum = (datum: any, mode = activeTreemapMode.value) => {
  if (mode === 'treemap-edibility') return getEdibilityGroup(datum)
  if (mode === 'treemap-redlist') return getRedlistGroup(datum)
  if (mode === 'treemap-visible') return getVisibilityGroup(datum)
  return String(datum?.[props.groupKey] || 'övrigt')
}

const getTreemapGroupNodeKey = (
  datum: any,
  mode: 'treemap-standard' | 'treemap-groups' | 'treemap-edibility' | 'treemap-redlist' | 'treemap-visible' = activeTreemapMode.value
) => {
  const group = getTreemapGroupForDatum(datum, mode)
  return `${mode}::${group}`
}

const getTreemapGroupLabelFromNodeKey = (key: string) => {
  const raw = String(key || '')
  const sepIndex = raw.indexOf('::')
  return sepIndex >= 0 ? raw.slice(sepIndex + 2) : raw
}

const stableColorIndex = (key: string, modulo: number) => {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  }
  return modulo > 0 ? hash % modulo : 0
}

const getStableGroupColor = (group: string) => {
  const normalized = normalizeGroupKey(group)
  const override = treemapGroupColorOverrides[normalized]
  if (override) return override
  return treemapPalette[stableColorIndex(normalized, treemapPalette.length)] ?? '#64748b'
}

const getTreemapGroupColor = (group: string, mode = activeTreemapMode.value) => {
  const normalized = normalizeGroupKey(group)

  if (mode === 'treemap-edibility') {
    return treemapEdibilityColors[normalized] ?? treemapEdibilityColors.ovrigt
  }

  if (mode === 'treemap-redlist') {
    const redlistCodeByLabel: Record<string, string> = {
      'livskraftig': 'lc',
      'kunskapsbrist': 'dd',
      'nara hotad': 'nt',
      'sarbar': 'vu',
      'starkt hotad': 'en',
      'akut hotad': 'cr',
      'nationellt utdod': 're'
    }
    const code = redlistCodeByLabel[normalized] ?? normalized
    return treemapRedlistColors[code] ?? treemapRedlistColors.ovrigt
  }

  if (mode === 'treemap-visible') {
    return treemapVisibleColors[normalized] ?? treemapVisibleColors['svampar som syns']
  }

  return getStableGroupColor(group)
}

const treemapSourceData = computed(() => {
  const rows = [...treemapBaseData.value]
  rows.sort((a, b) => {
    const valueCmp = Number(b.sample_plot_count || 0) - Number(a.sample_plot_count || 0)
    if (valueCmp !== 0) return valueCmp
    return getSpeciesStableId(a).localeCompare(getSpeciesStableId(b), 'sv')
  })
  return rows
})

const treemapLayersConfig = computed(() => {
  const mode = activeTreemapMode.value
  if (mode === 'treemap-standard') {
    return [(d: any) => getTreemapSpeciesLayerKey(d)]
  }
  return [
    (d: any) => getTreemapGroupNodeKey(d, mode),
    (d: any) => getTreemapSpeciesLayerKey(d, mode)
  ]
})

const treemapSpeciesColorByKey = computed(() => {
  const map = new Map<string, string>()
  updatedChartData.value.forEach((d) => {
    map.set(keyForRow(d), d.barColor || d.fillColor || '#94a3b8')
  })
  return map
})

const treemapTileColorConfig = computed(() => {
  const mode = activeTreemapMode.value
  const selectedScientificName = String((speciesStore.selectedSpecies as any)?.Scientificname || '').toLowerCase()
  const hasSelectedSpecies = speciesStore.selectedSpecies !== null
  return (node: any) => {
    const datum = node?.data?.datum
    const nodeScientificName = String(datum?.Scientificname || '').toLowerCase()
    if (hasSelectedSpecies && selectedScientificName && nodeScientificName === selectedScientificName) {
      return '#b1835e'
    }

    if (mode === 'treemap-standard') {
      if (!datum) return undefined
      return treemapSpeciesColorByKey.value.get(keyForRow(datum)) ?? '#94a3b8'
    }
    if (mode === 'treemap-redlist' && node?.depth === 2) {
      if (datum?.SIGNAL_art === 'S') return '#99f6e4'
      return undefined
    }
    if (node?.depth !== 1) return undefined
    const groupKey = getTreemapGroupLabelFromNodeKey(String(node?.data?.key || 'övrigt'))
    return getTreemapGroupColor(groupKey, mode)
  }
})

const treemapTileLabelConfig = computed(() => (node: any) => {
  if (!node) return ''
  const tileWidth = Math.max(0, Number(node?.x1 ?? 0) - Number(node?.x0 ?? 0))
  const tileHeight = Math.max(0, Number(node?.y1 ?? 0) - Number(node?.y0 ?? 0))
  const canShowLeafIcon = enableTreemapLeafGroupIcons && tileWidth >= 18 && tileHeight >= 18
  if (activeTreemapMode.value === 'treemap-standard') {
    // Keep leaf label nodes in DOM so we can replace text with group icons.
    return node.depth === 1 && canShowLeafIcon ? ' ' : ''
  }
  if (node.depth === 1) {
    const speciesCount = Array.isArray(node?.children)
      ? node.children.filter((child: any) => child?.depth === 2).length
      : 0
    const groupLabel = getTreemapGroupLabelFromNodeKey(String(node?.data?.key || 'Övrigt'))
    return `${capitalizeFirstLetter(groupLabel)} (${speciesCount} arter)`
  }
  // Keep leaf label nodes in DOM so we can replace text with group icons.
  return canShowLeafIcon ? ' ' : ''
})

const getSpeciesBadgesHtml = (datum: any) => {
  const matsvampBadge = datum.matsvamp == 1
    ? '<div class="font-md bg-yellow-50 border border-yellow-200 text-yellow-500 text-xs rounded-md py-0.5 px-1">Matsvamp</div>'
    : ''
  const giftsvampBadge = String(datum.Giftsvamp || '').toLowerCase() === 'x'
    ? '<div class="font-md bg-lime-50 border border-lime-200 text-lime-500 text-xs rounded-md py-0.5 px-1">Giftsvamp</div>'
    : ''
  const rlMapping: Record<string, string> = {
    NT: 'Nära hotad',
    EN: 'Starkt hotad',
    VU: 'Sårbar',
    CR: 'Akut hotad',
    DD: 'Kunskapsbrist',
    RE: 'Nationellt utdöd',
    LC: 'Livskraftig'
  }
  const rlBadgeStyleByCode: Record<string, string> = {
    LC: 'background-color: var(--color-redlist-lc-bg-subtle); border-color: var(--color-redlist-lc-ring-subtle); color: var(--color-redlist-lc-text-subtle);',
    DD: 'background-color: var(--color-redlist-dd-bg-subtle); border-color: var(--color-redlist-dd-ring-subtle); color: var(--color-redlist-dd-text-subtle);',
    NT: 'background-color: var(--color-redlist-nt-bg-subtle); border-color: var(--color-redlist-nt-ring-subtle); color: var(--color-redlist-nt-text-subtle);',
    VU: 'background-color: var(--color-redlist-vu-bg-subtle); border-color: var(--color-redlist-vu-ring-subtle); color: var(--color-redlist-vu-text-subtle);',
    EN: 'background-color: var(--color-redlist-en-bg-subtle); border-color: var(--color-redlist-en-ring-subtle); color: var(--color-redlist-en-text-subtle);',
    CR: 'background-color: var(--color-redlist-cr-bg-subtle); border-color: var(--color-redlist-cr-ring-subtle); color: var(--color-redlist-cr-text-subtle);',
    RE: 'background-color: var(--color-redlist-re-bg-subtle); border-color: var(--color-redlist-re-ring-subtle); color: var(--color-redlist-re-text-subtle);'
  }
  const rl = String(datum.RL2020kat || '').toUpperCase()
  const rlBadgeStyle = rlBadgeStyleByCode[rl] || 'background-color: #f5f5f5; border-color: #e5e5e5; color: #737373;'
  const rodlisteBadge = rlMapping[rl]
    ? `<div class="font-md border text-xs rounded-md py-0.5 px-1" style="${rlBadgeStyle}">${rlMapping[rl]}</div>`
    : ''
  const signalartBadge = datum.SIGNAL_art === 'S'
    ? '<div class="font-md bg-teal-50 border border-teal-200 text-teal-500 text-xs rounded-md py-0.5 px-1">Signalart</div>'
    : ''

  return `${matsvampBadge}${giftsvampBadge}${rodlisteBadge}${signalartBadge}`
}

const buildSpeciesTooltipHtml = (datum: any, extraMetaLine = '') => {
  const commonName = capitalizeFirstLetter(String(datum?.Commonname || 'Okänd art'))
  const scientificName = String(datum?.Scientificname || '')
  const count = Number(datum?.sample_plot_count || 0)
  const envCount = datum?.sample_env_count ?? '?'
  const groupIcon = getGroupIconUrl(String(datum?.[props.groupKey] || 'övrigt'))
  const badges = getSpeciesBadgesHtml(datum)

  return `
    <div class="p-2">
      <img src="${groupIcon}" class="h-5 mb-1" />
      <div class="text-sm flex gap-1">
        <strong>${commonName}</strong> <em>${scientificName}</em>
      </div>
      <div class="text-sm text-neutral-500">
        Påträffad i ${count} av ${envCount} skogar
      </div>
      ${extraMetaLine}
      <div class="flex gap-1 mt-1">
        ${badges}
      </div>
    </div>
  `
}

const treemapTooltipTriggersConfig = computed(() => {
  const mode = activeTreemapMode.value
  const content = (node: any) => {
    const datum = node?.data?.datum
    if (!datum) {
      const groupName = getTreemapGroupLabelFromNodeKey(String(node?.data?.key || 'Övrigt'))
      return `<div class="p-2 text-sm"><strong>${capitalizeFirstLetter(groupName)}</strong></div>`
    }

    const groupName = getTreemapGroupForDatum(datum, mode)
    const extraMetaLine = mode === 'treemap-redlist'
      ? `<div class="text-xs text-neutral-500 mt-1">Rödlistestatus: ${capitalizeFirstLetter(groupName)}</div>`
      : ''
    return buildSpeciesTooltipHtml(
      datum,
      extraMetaLine
    )
  }

  return {
    [Treemap.selectors.tile]: content
  }
})

const applyTreemapLeafGroupIcons = () => {
  if (!enableTreemapLeafGroupIcons) return
  const root = treemapWrapperRef.value
  if (!root) return

  root.querySelectorAll('.treemap-leaf-group-icon').forEach(node => node.remove())

  const labels = Array.from(
    root.querySelectorAll(`.${VisTreemapSelectors.label}`)
  ) as SVGTextElement[]

  const leafDepth = activeTreemapMode.value === 'treemap-standard' ? 1 : 2

  labels.forEach((labelEl) => {
    labelEl.style.opacity = ''
  })

  labels.forEach((labelEl) => {
    const node = (labelEl as any).__data__
    if (!node || node.depth !== leafDepth) return
    const tileWidth = Math.max(0, Number(node?.x1 ?? 0) - Number(node?.x0 ?? 0))
    const tileHeight = Math.max(0, Number(node?.y1 ?? 0) - Number(node?.y0 ?? 0))
    if (tileWidth < 18 || tileHeight < 18) return

    const datum = node?.data?.datum
    const groupName = String(datum?.[props.groupKey] || '')
    const iconHref = getGroupIconUrl(groupName)
    const x = Number(labelEl.getAttribute('x') ?? (node.x0 + 6))
    const y = Number(labelEl.getAttribute('y') ?? (node.y0 + 10))

    labelEl.style.opacity = '0'

    const imageNode = document.createElementNS('http://www.w3.org/2000/svg', 'image')
    imageNode.setAttribute('href', iconHref)
    imageNode.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', iconHref)
    imageNode.setAttribute('x', String(x))
    imageNode.setAttribute('y', String(Math.max(0, y - 12)))
    imageNode.setAttribute('width', '14')
    imageNode.setAttribute('height', '14')
    imageNode.setAttribute('class', 'treemap-leaf-group-icon')
    imageNode.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    imageNode.setAttribute('pointer-events', 'none')

    labelEl.parentElement?.appendChild(imageNode)
  })
}

const scheduleTreemapIconSync = async () => {
  if (!enableTreemapLeafGroupIcons) return
  await nextTick()
  if (treemapSyncRaf) cancelAnimationFrame(treemapSyncRaf)
  treemapSyncRaf = requestAnimationFrame(() => {
    applyTreemapLeafGroupIcons()
    setTimeout(() => applyTreemapLeafGroupIcons(), 180)
  })
}

function updateTreemapTooltipPlacementFromEvent(event: MouseEvent) {
  const rect = treemapContainerRef.value?.getBoundingClientRect()
  if (!rect || !Number.isFinite(event.clientX)) return
  const relativeX = event.clientX - rect.left
  treemapTooltipPlacement.value = relativeX > rect.width * 0.55 ? Position.Left : Position.Right
}

const treemapEventsWithTooltipFlip = {
  [Treemap.selectors.tile]: {
    click: (node: any) => {
      const datum = node?.data?.datum
      if (datum) speciesStore.selectSpecies(datum, 'edna')
    },
    mousemove: (_d: any, event: MouseEvent) => {
      updateTreemapTooltipPlacementFromEvent(event)
    }
  }
}
const suppressPlotBandAfterUngroup = ref(false)
let suppressPlotBandTimer: ReturnType<typeof setTimeout> | null = null

const plotBandRange = computed(() => {
  if (isBarGroupedActive.value) return null
  if (suppressPlotBandAfterUngroup.value) return null
  const range = props.visibleRange
  if (!range || range.endIndex < range.startIndex) return null
  const rangeSize = (range.endIndex - range.startIndex) + 1
  if (rangeSize <= 1) return null
  const total = Number(range.total ?? 0)
  const showsAllRows = total > 0 && range.startIndex <= 0 && range.endIndex >= total - 1
  if (showsAllRows) return null
  const slice = filteredSortedData.value.slice(range.startIndex, range.endIndex + 1)
  if (!slice.length) return null
  const indices = slice
    .map(item => sortedChartData.value.findIndex(row => keyForRow(row) === keyForRow(item)))
    .filter(idx => idx >= 0)
  if (!indices.length) return null
  const min = Math.min(...indices)
  const max = Math.max(...indices)
  return { from: min - 0.5, to: max + 0.5 }
})

const selectedPlotBandRange = computed(() => {
  if (viewMode.value !== 'bar') return null
  const selectedScientificName = activeSelectedScientificName.value
  if (!selectedScientificName) return null

  const selectedIndex = displayedBarData.value.findIndex(d =>
    normalizeScientificName(d?.Scientificname) === selectedScientificName
  )

  if (selectedIndex < 0) return null
  return { from: selectedIndex - 0.5, to: selectedIndex + 0.5 }
})

const isSpeciesDatum = (value: any) =>
  value && (typeof value.Commonname === 'string' || typeof value.Scientificname === 'string')

const resolveBarDatum = (payload: any) => {
  if (!payload) return null
  if (isSpeciesDatum(payload)) return payload

  const nestedCandidates = [payload.datum, payload.data, payload.original]
  for (const candidate of nestedCandidates) {
    if (isSpeciesDatum(candidate)) return candidate
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      if (isSpeciesDatum(item)) return item
      if (item?.datum && isSpeciesDatum(item.datum)) return item.datum
    }
  }

  const idxCandidates = [
    payload.index,
    payload.i,
    payload.dataIndex,
    payload._index,
    payload.x,
    payload.xIndex
  ]
  for (const idx of idxCandidates) {
    if (!Number.isInteger(idx)) continue
    const row = displayedBarData.value[idx]
    if (isSpeciesDatum(row)) return row
  }

  return null
}

// ----- Tooltip Trigger & Template -----
function tooltipTemplate(d: any): string {
  const datum = resolveBarDatum(d)
  if (!datum) {
    return '<div class="p-2 text-sm text-neutral-500">Ingen data</div>'
  }
  currentHoveredDatum.value = datum
  return buildSpeciesTooltipHtml(datum)
}
const triggers = { [StackedBar.selectors.bar]: tooltipTemplate }
const currentHoveredDatum = ref<any | null>(null)
const barEvents = {
  [StackedBar.selectors.bar]: {
    click: (payload: any) => {
      const datum = resolveBarDatum(payload)
      if (datum) {
        speciesStore.selectSpecies(datum, 'edna')
      }
    }
  }
}
// ----- Custom Bar Color Based on Selected Filters -----
const updatedChartData = computed(() => {
  const defaultGray = '#d4d4d4'
  const selectedScientificName = activeSelectedScientificName.value
  return sortedChartData.value.map((d) => {
    if (selectedScientificName && normalizeScientificName(d?.Scientificname) === selectedScientificName) {
      return { ...d, barColor: '#b1835e' }
    }
    // Compute matchSearch at the top
    const term = props.searchTerm.trim().toLowerCase()
    const common = String(d.Commonname || '').toLowerCase()
    const scientific = String(d.Scientificname || '').toLowerCase()
    const matchSearch = term ? (common.includes(term) || scientific.includes(term)) : true

    // 1) Only search active (no other filters)
    const statusActive = props.statusFilter.length > 0
    const svampActive = props.matsvampFilter || props.giftsvampFilter
    const groupActive = props.gruppFilter.length > 0
    if (!statusActive && !svampActive && !groupActive && props.searchTerm.trim() !== '') {
      return { ...d, barColor: matchSearch ? '#8b5cf6' : defaultGray }
    }

    // 2a) Compute boolean matches for each category
    const matchSignal
      = statusActive
      && props.statusFilter.includes('Signalart')
      && d.SIGNAL_art === 'S'

    const otherStatuses = props.statusFilter.filter(s => s !== 'Signalart')
    // Add Ej bedömd and Ej tillämplig logic
    const matchEjBedom = statusActive && props.statusFilter.includes('Ej bedömd')
      && (d.RL2020kat === null || d.RL2020kat === 0 || d.RL2020kat === '0' || String(d.RL2020kat).toUpperCase() === 'NE')
    const matchEjTillamplig = statusActive && props.statusFilter.includes('Ej tillämplig')
      && String(d.RL2020kat).toUpperCase() === 'NA'
    const matchStatus = statusActive
      ? matchSignal || otherStatuses.includes(d.RL2020kat)
      : false

    const matchMats = props.matsvampFilter ? d.matsvamp == 1 : false
    const matchGifts = props.giftsvampFilter
      ? (d.Giftsvamp || '').toLowerCase() === 'x'
      : false

    const matchGroup = groupActive
      ? props.gruppFilter.some(group => normalizeGroupKey(group) === normalizeGroupKey(d?.[props.groupKey]))
      : false

    // 3) If any Status filter is on, handle Status‐first logic:
    if (statusActive) {
      // 3a) Only Status (no Svamp, no Grupp)
      if (!svampActive && !groupActive) {
        if (matchSearch && matchSignal) return { ...d, barColor: '#14b8a6' } // teal-500
        if (matchSearch && (matchSignal || matchStatus || matchEjBedom || matchEjTillamplig)) {
          if (matchSignal) return { ...d, barColor: '#14b8a6' }
          const redlistColor = getRedlistColorForDatum(d)
          if (redlistColor) return { ...d, barColor: redlistColor }
          if (matchEjBedom || matchEjTillamplig) return { ...d, barColor: '#737373' }
          return { ...d, barColor: '#1f2937' }
        }
        return { ...d, barColor: defaultGray }
      }
      // 3b) Status + (possibly Svamp/Group)
      const passesStatus = matchSearch && (matchSignal || matchStatus || matchEjBedom || matchEjTillamplig)
      const passesSvamp = svampActive ? (matchMats || matchGifts) : true
      const passesGroupVal = groupActive ? matchGroup : true

      if (passesStatus && passesSvamp && passesGroupVal) {
        // Color precedence: Signalart > RL status > Matsvamp > Giftsvamp > Grupp
        if (matchSignal) return { ...d, barColor: '#14b8a6' }
        if (otherStatuses.length > 0) {
          const redlistColor = getRedlistColorForDatum(d)
          if (redlistColor) return { ...d, barColor: redlistColor }
          if (matchEjBedom || matchEjTillamplig) return { ...d, barColor: '#737373' }
          return { ...d, barColor: '#1f2937' }
        }
        if (props.matsvampFilter && matchMats) return { ...d, barColor: '#eab308' }
        if (props.giftsvampFilter && matchGifts) return { ...d, barColor: '#84cc16' }
        if (groupActive && matchGroup) return { ...d, barColor: '#000000' }
      }
      return { ...d, barColor: defaultGray }
    }

    // 4) Otherwise (no Status filter), fall back to Svamp/Group logic:
    if (svampActive || groupActive) {
      // 4a) Only Svamp (no Grupp)
      if (svampActive && !groupActive) {
        if (matchSearch && matchMats) return { ...d, barColor: '#eab308' } // yellow
        if (matchSearch && matchGifts) return { ...d, barColor: '#84cc16' } // green
        return { ...d, barColor: defaultGray }
      }
      // 4b) Only Grupp (no Svamp)
      if (!svampActive && groupActive) {
        if (matchSearch && matchGroup) return { ...d, barColor: '#000000' } // black
        return { ...d, barColor: defaultGray }
      }
      // 4c) Svamp + Grupp
      const passesSvampOnly = matchSearch && (matchMats || matchGifts)
      if (passesSvampOnly && matchGroup) {
        if (matchMats) return { ...d, barColor: '#eab308' }
        if (matchGifts) return { ...d, barColor: '#84cc16' }
      }
      return { ...d, barColor: defaultGray }
    }

    // 5) No filters or search → keep each bar's original fillColor
    return { ...d, barColor: d.fillColor || 'var(--ui-primary)' }
  })
})

const isBarGroupedActive = computed(() =>
  viewMode.value === 'bar' && props.barGroupingMode !== 'none'
)

watch(isBarGroupedActive, (active, prevActive) => {
  if (prevActive && !active) {
    suppressPlotBandAfterUngroup.value = true
    if (suppressPlotBandTimer) clearTimeout(suppressPlotBandTimer)
    suppressPlotBandTimer = setTimeout(() => {
      suppressPlotBandAfterUngroup.value = false
      suppressPlotBandTimer = null
    }, 260)
  }
})

const getBarGroupingLabel = (datum: any) => {
  if (props.barGroupingMode === 'groups') return String(datum?.[props.groupKey] || 'Övrigt')
  if (props.barGroupingMode === 'edibility') return getEdibilityGroup(datum)
  if (props.barGroupingMode === 'redlist') {
    const status = String(datum?.RL2020kat || '').trim().toUpperCase()
    const redlistLabelByCode: Record<string, string> = {
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
  if (props.barGroupingMode === 'visible') return getVisibilityGroup(datum)
  return String(datum?.Commonname || 'Övrigt')
}

const getBarGroupingOrder = (label: string) => {
  if (props.barGroupingMode === 'groups') {
    const normalized = normalizeGroupKey(label)
    const order = ['ovrigt', 'hattsvamp', 'kantarell', 'sopp', 'taggsvamp', 'fingersvamp', 'skinnsvamp', 'skalsvamp', 'tryffel']
    const idx = order.indexOf(normalized)
    return idx === -1 ? Number.POSITIVE_INFINITY : idx
  }
  if (props.barGroupingMode === 'edibility') {
    const order = ['Matsvamp', 'Giftsvamp', 'Övrigt']
    const idx = order.indexOf(label)
    return idx === -1 ? Number.POSITIVE_INFINITY : idx
  }
  if (props.barGroupingMode === 'redlist') {
    const order = ['Livskraftig', 'Kunskapsbrist', 'Nära hotad', 'Sårbar', 'Starkt hotad', 'Akut hotad', 'Nationellt utdöd', 'Övrigt']
    const idx = order.indexOf(label)
    return idx === -1 ? Number.POSITIVE_INFINITY : idx
  }
  if (props.barGroupingMode === 'visible') {
    const order = ['Svampar som syns', 'Svampar som är svåra att se', 'Synlighet saknas']
    const idx = order.indexOf(label)
    return idx === -1 ? Number.POSITIVE_INFINITY : idx
  }
  return Number.POSITIVE_INFINITY
}

const getBarGroupingColor = (label: string) => {
  if (props.barGroupingMode === 'groups') return getStableGroupColor(label)
  if (props.barGroupingMode === 'edibility') return getTreemapGroupColor(label, 'treemap-edibility')
  if (props.barGroupingMode === 'redlist') return getTreemapGroupColor(label, 'treemap-redlist')
  if (props.barGroupingMode === 'visible') return getTreemapGroupColor(label, 'treemap-visible')
  return '#d4d4d4'
}

const groupedSpeciesBarData = computed(() => {
  const selectedScientificName = activeSelectedScientificName.value
  const sorters = props.sortOrder.length
    ? props.sortOrder
    : [{ id: 'sample_plot_count', desc: true }]
  const rows = updatedChartData.value
    .filter(d => shouldMatchTable(d))
    .map((d) => {
      const groupingLabel = getBarGroupingLabel(d)
      const datumScientificName = normalizeScientificName(d?.Scientificname)
      const isSelected = selectedScientificName && datumScientificName === selectedScientificName
      return {
        ...d,
        __groupingLabel: groupingLabel,
        barColor: isSelected ? '#b1835e' : getBarGroupingColor(groupingLabel)
      }
    })
  return rows.sort((a, b) => {
    const orderCmp = getBarGroupingOrder(String(a.__groupingLabel)) - getBarGroupingOrder(String(b.__groupingLabel))
    if (orderCmp !== 0) return orderCmp
    const sorterCmp = compareRowsBySortOrder(a, b, sorters)
    if (sorterCmp !== 0) return sorterCmp
    return Number(b.sample_plot_count || 0) - Number(a.sample_plot_count || 0)
  })
})

const displayedBarData = computed(() =>
  isBarGroupedActive.value ? groupedSpeciesBarData.value : updatedChartData.value
)

const barColorAccessor = (d: any) => d.barColor
const hasData = computed(() => displayedBarData.value.length > 0)

watch(displayedBarData, (newVal) => {
  if (!newVal.length) {
    currentHoveredDatum.value = null
  }
})

watch(viewMode, (mode, prevMode) => {
  if (mode !== 'bar' && mode !== 'treemap-standard') {
    lastTreemapMode.value = mode
  }
  const isCrossingBarBoundary = (mode === 'bar') !== (prevMode === 'bar')
  if (isCrossingBarBoundary) {
    if (treemapSyncRaf) cancelAnimationFrame(treemapSyncRaf)
    if (treemapSyncTimer) clearTimeout(treemapSyncTimer)
    chartShellRenderKey.value += 1
  }
  if (mode !== 'bar') {
    scheduleTreemapIconSync()
    // Re-run after animation settles to avoid mutating DOM during treemap transition.
    if (treemapSyncTimer) clearTimeout(treemapSyncTimer)
    treemapSyncTimer = setTimeout(() => {
      scheduleTreemapIconSync()
      treemapSyncTimer = null
    }, 760)
  }
})

watch(
  [activeTreemapMode, treemapSourceData],
  () => {
    if (viewMode.value === 'bar') return
    scheduleTreemapIconSync()
    if (treemapSyncTimer) clearTimeout(treemapSyncTimer)
    treemapSyncTimer = setTimeout(() => {
      scheduleTreemapIconSync()
      treemapSyncTimer = null
    }, 760)
  },
  { immediate: true, deep: true, flush: 'post' }
)

// Detect mobile screens (< md)
const isMobile = useMediaQuery('(max-width: 767px)')

function handleChartClick() {
  if (viewMode.value !== 'bar') return
  if (currentHoveredDatum.value) {
    speciesStore.selectSpecies(currentHoveredDatum.value, 'edna')
  }
}

onMounted(() => {
  scheduleTreemapIconSync()
})

watch(
  () => treemapWrapperRef.value,
  () => {
    scheduleTreemapIconSync()
  },
  { flush: 'post' }
)

onBeforeUnmount(() => {
  if (suppressPlotBandTimer) clearTimeout(suppressPlotBandTimer)
  if (treemapSyncRaf) cancelAnimationFrame(treemapSyncRaf)
  if (treemapSyncTimer) clearTimeout(treemapSyncTimer)
})
</script>

<style scoped>
.bar-chart-container {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.bar-chart-container::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari, Opera */
}
</style>
