<template>
  <div>
    <!-- Controls: filtering and zoom -->
    <div class="flex justify-between gap-2 mb-4 mx-2">
      <div class="flex gap-2">
        <UInput
    v-model="chartSearchTerm"
    placeholder="Sök på namn"
    variant="ghost"
  />
      <USelect
        v-model="selectedFilters"
        multiple
        :items="filterItems"
        class="w-fit"
        placeholder="Fokusera på grupp"
        variant="ghost"
      />
      </div>
      
      <div class="flex gap-0.5">
         <UButton @click="zoomOut" icon="i-heroicons-magnifying-glass-minus" color="neutral" variant="ghost"/>
      <UButton @click="zoomIn"  icon="i-heroicons-magnifying-glass-plus" color="neutral" variant="ghost"/>
 
      </div>
        </div>

    <!-- Chart Container: we attach a click handler here -->
    <div class="w-full h-[420px] overflow-y-auto overflow-x-scroll" @click="handleChartClick">
      <VisXYContainer :data="updatedChartData" :width="chartWidth" :height="chartHeight">
        <!-- Bar Chart -->
        <VisStackedBar :data="updatedChartData" :x="xAccessor" :y="yAccessor" :color="barColorAccessor" :barPadding="0.1"/>
        <VisAxis
          :gridLine="false"
          type="x"
          tickTextAnchor="start"
          tickTextAngle="30"
          :numTicks="updatedChartData.length"
          tickTextFitMode="trim"
          :tickTextWidth="150"
          tickTextAlign="left"
          :tick-format="tickFormat"
        />
        <VisAxis type="y" label="Antal skogar där arten påträffats" :gridLine="false" />
        <!-- Tooltip: followCursor remains true (or default) so that hover works; allowHover not needed -->
        <VisTooltip :triggers="triggers" :followCursor="true" />
        <!-- Crosshair for better pointer guidance -->
        <VisCrosshair :color="barColorAccessor" :template="tooltipTemplate" />
      </VisXYContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { VisXYContainer, VisStackedBar, VisAxis, VisTooltip, VisCrosshair } from '@unovis/vue'
import { StackedBar } from '@unovis/ts'
import { useEnvParamsStore } from '~/stores/envParamsStore'
import { useSpeciesStore } from '~/stores/speciesStore'

const chartSearchTerm = ref('')

// ----- Filtering & Zoom Setup -----
const filterItems = ref(['Matsvamp', 'Giftsvamp', 'Rödlistade svampar', 'Signalarter'])
const selectedFilters = ref<string[]>([])
const zoomLevels = ["100%", "200%", "400%", "800%"]
const currentZoomIndex = ref(0)
const chartWidth = computed(() => zoomLevels[currentZoomIndex.value])
const chartHeight = ref(400)

// ----- Chart Data & Color Setup -----
const chartData = ref<any[]>([])
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
async function fetchChartData() {
  const envStore = useEnvParamsStore()
  if (envStore.geography && envStore.forestType && envStore.standAge && envStore.vegetationType) {
    const filename = `edna-${envStore.geography}-${envStore.forestType}-${envStore.standAge}-${envStore.vegetationType}.json`
    try {
      const response = await fetch(`/edna/${filename}`)
      if (!response.ok) throw new Error(`Failed to fetch ${filename}`)
      let jsonData = await response.json()
      jsonData = sortData(jsonData)
      const totalSpecies = jsonData.length
      const numberOfGrayBars = Math.floor(totalSpecies * 0.1)
      const numberOfColorBars = totalSpecies - numberOfGrayBars
      const grayColors = generateColors([82,82,82], [212,212,212], numberOfGrayBars)
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
}
onMounted(fetchChartData)
watch(
  () => [useEnvParamsStore().geography, useEnvParamsStore().forestType, useEnvParamsStore().standAge, useEnvParamsStore().vegetationType],
  fetchChartData,
  { immediate: true }
)

// ----- Accessors & Formatters -----
const xAccessor = (_: any, i: number) => i
const yAccessor = (d: any) => d.sample_plot_count
const tickFormat = (_: any, i: number) => {
  const d = updatedChartData.value[i]
  // When a search term is entered, only show names for matching species
  if (chartSearchTerm.value.trim() !== "") {
    const term = chartSearchTerm.value.trim().toLowerCase()
    if ((d.Commonname && d.Commonname.toLowerCase().includes(term)) ||
        (d.Scientificname && d.Scientificname.toLowerCase().includes(term))) {
      return capitalizeFirstLetter(d.Commonname)
    } else {
      return ""
    }
  } else {
    // Otherwise, use the existing group filter logic
    if (selectedFilters.value.length === 0) return ""
    if (d && d.barColor === '#d4d4d4') return ""
    return capitalizeFirstLetter(d.Commonname)
  }
}
function capitalizeFirstLetter(str: string): string {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ""
}

// ----- Tooltip Trigger & Template -----
// We use a reactive variable to store the current hovered datum.
const currentHoveredDatum = ref<any>(null)
function tooltipTemplate(d: any): string {
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
    RE: "Nationellt utdöd"
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
  return chartData.value.map(d => {
    let newColor = d.fillColor || 'var(--ui-primary)'
    
    // If there's a search term, override the colors based on matching species names.
    if (chartSearchTerm.value.trim() !== "") {
      const term = chartSearchTerm.value.trim().toLowerCase()
      if (
        (d.Commonname && d.Commonname.toLowerCase().includes(term)) ||
        (d.Scientificname && d.Scientificname.toLowerCase().includes(term))
      ) {
        newColor = '#22c55e'  // Green for matching species
      } else {
        newColor = '#d4d4d4'  // Gray for non-matching species
      }
    }
    // Else, if group filters are active, use your existing logic.
    else if (selectedFilters.value.length > 0) {
      if (selectedFilters.value.includes('Matsvamp') && d.matsvamp == 1) {
        newColor = '#eab308'
      } else if (selectedFilters.value.includes('Giftsvamp') && d.Giftsvamp === "x") {
        newColor = '#84cc16'
      } else if (selectedFilters.value.includes('Rödlistade svampar') && ["NT", "EN", "VU", "CR", "DD", "RE"].includes(d["RL2020kat"])) {
        newColor = '#ef4444'
      } else if (selectedFilters.value.includes('Signalarter') && d["SIGNAL_art"] === "S") {
        newColor = '#14b8a6'
      } else {
        newColor = '#d4d4d4'
      }
    }
    // Otherwise, retain the original fill color.
    return { ...d, barColor: newColor }
  })
})
const barColorAccessor = (d: any) => d.barColor

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
function handleChartClick(event: MouseEvent) {
  if (currentHoveredDatum.value) {
    speciesStore.selectSpecies(currentHoveredDatum.value, "edna")
  } else {
    console.log("No datum available from tooltip.")
  }
}
</script>

