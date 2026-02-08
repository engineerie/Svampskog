<template>
  <div>
    <!-- Zoom controls only on desktop -->
    <div v-if="showControls && !isMobile" class="flex justify-end gap-2 mb-2 mx-2">
      <UButton @click="zoomOut" icon="i-heroicons-magnifying-glass-minus" color="neutral" variant="ghost" />
      <UButton @click="zoomIn" icon="i-heroicons-magnifying-glass-plus" color="neutral" variant="ghost" />
    </div>
    <!-- Bar chart on desktop -->
    <div v-if="!isMobile" :class="[
      'w-full overflow-y-auto overflow-x-scroll',
      { 'bar-chart-container': currentZoomIndex === 0 }
    ]" @click="handleChartClick">
      <VisXYContainer :data="updatedChartData" :width="chartWidth" :height="chartHeight">
        <!-- <VisXYLabels v-if="showGroupLabels" :data="labelData" :x="labelX" :y="labelY" :label="labelText"
          :labelFontSize="10" :clustering="false" backgroundColor="#ffffff" color="#111827" /> -->
        <VisPlotband v-if="plotBandRange" axis="x" :from="plotBandRange.from" :to="plotBandRange.to"
          color="rgba(234, 179, 8, 0.15)" :zIndex="5" />
        <VisStackedBar :data="updatedChartData" :x="xAccessor" :y="yAccessor" :color="barColorAccessor"
          :barPadding="0.1" />


        <!-- <VisAxis :tickLine="false" :gridLine="false" type="x" tickTextAnchor="start" tickTextAngle="30"
          :numTicks="updatedChartData.length" tickTextFitMode="trim" :tickTextWidth="150" tickTextAlign="left"
          :tick-format="tickFormat" /> -->
        <VisAxis v-if="showYAxis" type="y" label="Antal skogar" :gridLine="false" />
        <VisTooltip v-if="showTooltip && hasData" :triggers="triggers" :followCursor="true" />
        <VisCrosshair v-if="showTooltip && hasData" :color="barColorAccessor" :template="tooltipTemplate" />

      </VisXYContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { VisXYContainer, VisStackedBar, VisAxis, VisTooltip, VisCrosshair, VisSingleContainer, VisDonut, VisXYLabels, VisPlotband } from '@unovis/vue'
import { StackedBar } from '@unovis/ts'
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
  sortOrder: { type: Array as PropType<Array<{ id: string; desc: boolean }>>, default: () => [] },
  visibleRange: { type: Object as PropType<{ startIndex: number; endIndex: number; total: number } | null>, default: null },
  chartHeight: { type: Number, default: 150 },
  showControls: { type: Boolean, default: true },
  showYAxis: { type: Boolean, default: true },
  showTooltip: { type: Boolean, default: true }
})

// ----- Filtering & Zoom Setup -----
const zoomLevels = ["100%", "200%", "400%", "800%"]
const currentZoomIndex = ref(0)
const chartWidth = computed(() => zoomLevels[currentZoomIndex.value])

// ----- Chart Data & Color Setup -----
const chartData = ref<any[]>([])
const envStore = useEnvParamsStore()
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
    const numberOfGrayBars = Math.floor(totalSpecies * 0.1)
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
function shouldShowLabel(d: any) {
  if (!d) return false
  const term = props.searchTerm.trim().toLowerCase()
  const common = String(d.Commonname || '').toLowerCase()
  const scientific = String(d.Scientificname || '').toLowerCase()
  const matchSearch = term ? (common.includes(term) || scientific.includes(term)) : true

  const statusActive = props.statusFilter.length > 0
  const svampActive = props.matsvampFilter || props.giftsvampFilter
  const groupActive = props.gruppFilter.length > 0

  if (!statusActive && !svampActive && !groupActive && props.searchTerm.trim() !== '') {
    return matchSearch
  }

  const matchSignal =
    statusActive &&
    props.statusFilter.includes('Signalart') &&
    (d.SIGNAL_art === 'S')

  const otherStatuses = props.statusFilter.filter(s => s !== 'Signalart')
  const matchEjBedom = statusActive && props.statusFilter.includes('Ej bedömd') &&
    (d.RL2020kat === null || d.RL2020kat === 0 || d.RL2020kat === '0' || String(d.RL2020kat).toUpperCase() === 'NE')
  const matchEjTillamplig = statusActive && props.statusFilter.includes('Ej tillämplig') &&
    String(d.RL2020kat).toUpperCase() === 'NA'
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

  return false
}

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

  const matchSignal =
    statusActive &&
    props.statusFilter.includes('Signalart') &&
    (d.SIGNAL_art === 'S')

  const otherStatuses = props.statusFilter.filter(s => s !== 'Signalart')
  const matchEjBedom = statusActive && props.statusFilter.includes('Ej bedömd') &&
    (d.RL2020kat === null || d.RL2020kat === 0 || d.RL2020kat === '0' || String(d.RL2020kat).toUpperCase() === 'NE')
  const matchEjTillamplig = statusActive && props.statusFilter.includes('Ej tillämplig') &&
    String(d.RL2020kat).toUpperCase() === 'NA'
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
  return props.gruppFilter.includes(d[props.groupKey])
}

const tickFormat = (_: any, i: number) => {
  const d = updatedChartData.value[i]
  if (!shouldShowLabel(d)) return ''
  return capitalizeFirstLetter(d.Commonname)
}
function capitalizeFirstLetter(str: string): string {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ""
}

const showGroupLabels = computed(() => props.gruppFilter.length > 0)
const maxYValue = computed(() =>
  Math.max(...updatedChartData.value.map(row => Number(row.sample_plot_count || 0)), 1)
)
const labelYOffset = computed(() => maxYValue.value * 0.04)
const labelData = computed(() =>
  updatedChartData.value
    .map((d, i) => ({ ...d, __xIndex: i }))
    .filter(d => matchesGroupFilter(d))
)
const labelX = (d: any) => d.__xIndex
const labelY = (d: any) => Number(d.sample_plot_count || 0) + labelYOffset.value
const labelText = () => 'x'

const filteredSortedData = computed(() => sortedChartData.value.filter(d => shouldMatchTable(d)))
const keyForRow = (d: any) => d?.Scientificname || d?.Commonname || d?.id || d?.ID || ''

const plotBandRange = computed(() => {
  const range = props.visibleRange
  if (!range || range.endIndex < range.startIndex) return null
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

// ----- Tooltip Trigger & Template -----
// We use a reactive variable to store the current hovered datum.
const currentHoveredDatum = ref<any>(null)
function tooltipTemplate(d: any): string {
  if (!d) {
    currentHoveredDatum.value = null
    return '<div class="p-2 text-sm text-neutral-500">Ingen data</div>'
  }
  // Update the reactive variable with the current datum
  currentHoveredDatum.value = d
  // Return the tooltip HTML (badges, image, etc.)
  const matsvampBadge = d.matsvamp == 1
    ? `<div class="font-md bg-yellow-50 border border-yellow-200 text-yellow-500 text-xs rounded-md py-0.5 px-1">Matsvamp</div>`
    : ""
  const giftsvampBadge = d.Giftsvamp === "x"
    ? `<div class="font-md bg-lime-50 border border-lime-200 text-lime-500 text-xs rounded-md py-0.5 px-1">Giftsvamp</div>`
    : ""
  const rlMapping: Record<string, string> = {
    NT: "Nära hotad",
    EN: "Starkt hotad",
    VU: "Sårbar",
    CR: "Akut hotad",
    DD: "Kunskapsbrist",
    RE: "Nationellt utdöd",
  }
  const rodlisteBadge = rlMapping[d["RL2020kat"]]
    ? `<div class="font-md bg-rose-50 border border-rose-200 text-rose-500 text-xs rounded-md py-0.5 px-1">${rlMapping[d["RL2020kat"]]}</div>`
    : ""
  const signalartBadge = d["SIGNAL_art"] === "S"
    ? `<div class="font-md bg-teal-50 border border-teal-200 text-teal-500 text-xs rounded-md py-0.5 px-1">Signalarter</div>`
    : ""
  return `
    <div class="p-2">
      <img src="/images/svampgrupp/${d["Svamp-grupp-släkte"]}.png" class="h-5 mb-1" />
      <div class="text-sm flex gap-1">
        <strong>${capitalizeFirstLetter(d.Commonname)}</strong> <em>${capitalizeFirstLetter(d.Scientificname)}</em>
      </div>
      <div class="text-sm text-neutral-500">
        Påträffad i ${d.sample_plot_count} av ${d.sample_env_count} skogar
      </div>
      <div class="flex gap-1 mt-1">
        ${matsvampBadge} ${giftsvampBadge} ${rodlisteBadge} ${signalartBadge}
      </div>
    </div>
  `
}
// For convenience we define triggers using our tooltipTemplate.
const triggers = { [StackedBar.selectors.bar]: tooltipTemplate }

// ----- Custom Bar Color Based on Selected Filters -----
const updatedChartData = computed(() => {
  const defaultGray = '#d4d4d4'
  return sortedChartData.value.map(d => {
    // Highlight selected species only while the slide-over is open
    if (
      isSlideOverOpen.value &&
      d.Scientificname === speciesStore.selectedSpecies?.Scientificname
    ) {
      return { ...d, barColor: '#b1835e' }
    }
    // Compute matchSearch at the top
    const term = props.searchTerm.trim().toLowerCase();
    const common = String(d.Commonname || '').toLowerCase();
    const scientific = String(d.Scientificname || '').toLowerCase();
    const matchSearch = term ? (common.includes(term) || scientific.includes(term)) : true;

    // 1) Only search active (no other filters)
    const statusActive = props.statusFilter.length > 0
    const svampActive = props.matsvampFilter || props.giftsvampFilter
    const groupActive = props.gruppFilter.length > 0
    if (!statusActive && !svampActive && !groupActive && props.searchTerm.trim() !== '') {
      return { ...d, barColor: matchSearch ? '#8b5cf6' : defaultGray }
    }

    // 2a) Compute boolean matches for each category
    const matchSignal =
      statusActive &&
      props.statusFilter.includes('Signalart') &&
      d.SIGNAL_art === 'S'

    const otherStatuses = props.statusFilter.filter(s => s !== 'Signalart')
    // Add Ej bedömd and Ej tillämplig logic
    const matchEjBedom = statusActive && props.statusFilter.includes('Ej bedömd') &&
      (d.RL2020kat === null || d.RL2020kat === 0 || d.RL2020kat === '0' || String(d.RL2020kat).toUpperCase() === 'NE')
    const matchEjTillamplig = statusActive && props.statusFilter.includes('Ej tillämplig') &&
      String(d.RL2020kat).toUpperCase() === 'NA'
    const matchStatus = statusActive
      ? matchSignal || otherStatuses.includes(d.RL2020kat)
      : false

    const matchMats = props.matsvampFilter ? d.matsvamp == 1 : false
    const matchGifts = props.giftsvampFilter
      ? (d.Giftsvamp || '').toLowerCase() === 'x'
      : false

    const matchGroup = groupActive
      ? props.gruppFilter.includes(d[props.groupKey])
      : false

    // 3) If any Status filter is on, handle Status‐first logic:
    if (statusActive) {
      // 3a) Only Status (no Svamp, no Grupp)
      if (!svampActive && !groupActive) {
        if (matchSearch && matchSignal) return { ...d, barColor: '#14b8a6' }    // teal-500
        if (matchSearch && (matchSignal || matchStatus || matchEjBedom || matchEjTillamplig)) {
          if (matchSignal) return { ...d, barColor: '#14b8a6' }
          if (d.RL2020kat === 'LC') return { ...d, barColor: '#22c55e' }
          if (['NT', 'EN', 'VU', 'CR'].includes(d.RL2020kat)) return { ...d, barColor: '#ef4444' }
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
          if (d.RL2020kat === 'LC') return { ...d, barColor: '#22c55e' }
          if (['NT', 'EN', 'VU', 'CR'].includes(d.RL2020kat)) return { ...d, barColor: '#ef4444' }
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
        if (matchSearch && matchMats) return { ...d, barColor: '#eab308' }  // yellow
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
const barColorAccessor = (d: any) => d.barColor
const hasData = computed(() => updatedChartData.value.length > 0)

watch(updatedChartData, (newVal) => {
  if (!newVal.length) {
    currentHoveredDatum.value = null
  }
})


// ----- Zoom Functions -----
function zoomIn() {
  if (currentZoomIndex.value < zoomLevels.length - 1) {
    currentZoomIndex.value++
  }
}
function zoomOut() {
  if (currentZoomIndex.value > 0) {
    currentZoomIndex.value--
  }
}

// ----- Sidebar Trigger on Chart Click -----
const speciesStore = useSpeciesStore()
const isSlideOverOpen = computed(() => speciesStore.selectedSpecies !== null)

// Detect mobile screens (< md)
const isMobile = useMediaQuery('(max-width: 767px)')

function handleChartClick(event: MouseEvent) {
  if (currentHoveredDatum.value) {
    speciesStore.selectSpecies(currentHoveredDatum.value, "edna")
  } else {
    console.log("No datum available from tooltip.")
  }
}
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
