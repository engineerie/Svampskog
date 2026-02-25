<template>
  <div>
    <!-- Dropdown to select which chart to display -->

    <div v-if="showHeaderRow" class=" flex justify-between">
      <USelect v-if="showControls" v-model="selectedChartControl" :items="selectChartOptions" value-key="value"
        option-attribute="label" size="md" class="hover:bg-neutral-50 ring-0 mb-2 w-full sm:w-fit max-w-full"
        :icon="selectedChartIcon" :ui="{ content: 'min-w-fit', value: ' text-neutral-700 ' }" />



      <!-- <UButton color="neutral" variant="subtle"
        :icon="chartType === 'area' ? 'i-carbon-chart-column' : 'i-carbon-chart-line-smooth'"
        @click="ToggleChartType" /> -->
    </div>

    <div class="space-y-3 relative">
      <UTabs v-if="selectedChart === 'grupper'" v-model="grupperChartMode" :items="grupperModeTabs" size="sm" :ui="{
        root: 'shrink-0',
        list: 'flex-nowrap gap-1 bg-transparent',
        indicator: 'bg-white border border-muted/50 shadow',
        trigger: 'px-2 data-[state=active]:text-neutral-800'
      }" class="sm:mr-2 mt-0.5 absolute -top-2 right-0 z-40 " />
      <ForestryChartDisplay v-bind="chartDisplayProps" />

      <UTabs v-if="showPrimaryInlineTabs" v-model="selectedChart" :items="inlineChartTabs" size="sm" :ui="{
        root: '',
        list: 'flex-nowrap gap-2 bg-transparent',
        indicator: 'bg-white border border-muted/50 shadow',
        trigger: 'data-[state=active]:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
      }" class="sm:px-2 pt-2 " />
      <UTabs v-if="selectedChart === 'matsvampar' && showMatsvampSelector" v-model="selectedMatsvampVariant"
        :items="matsvampVariantOptions" size="sm" :ui="{
          root: '',
          list: 'flex-nowrap gap-2 bg-transparent',
          indicator: 'bg-white border border-muted/50 shadow',
          trigger: 'data-[state=active]:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
        }" class="sm:px-2 pt-2 " />
      <div v-if="selectedChart === 'grupper'" class="w-full min-w-0 flex flex-wrap justify-between items-start gap-2">
        <USelect v-if="!isFrameworkCompareMode && grupperChartMode === 'stacked'" v-model="selectedArtkategori" multiple
          :items="grupperLegendSelectItems" option-attribute="label" value-key="value"
          class="w-full sm:w-fit max-w-full ring-muted/50 sm:mx-2 mb-2" size="lg" variant="outline"
          :ui="{ content: 'min-w-fit' }">
          <template #default="{ ui }">
            <span v-if="selectedGrupperLegendItems.length"
              :class="ui.value({ class: 'flex items-center gap-2 min-w-0 overflow-hidden' })">
              <span class="inline-flex items-center gap-2 min-w-0 overflow-visible">
                <span v-for="item in selectedGrupperLegendItems" :key="item.value"
                  class="inline-flex items-center gap-1 shrink-0">
                  <span v-if="item.icon" class="h-3.5 w-3.5" :style="{
                    backgroundColor: item.color || '#000',
                    WebkitMask: `url(${item.icon}) center / contain no-repeat`,
                    mask: `url(${item.icon}) center / contain no-repeat`,
                  }" />
                </span>
              </span>
            </span>
            <span v-else :class="ui.placeholder({ class: '' })">Välj svampgrupp</span>
          </template>
          <template #item="{ item }">
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-2">
                <div v-if="item.icon" class="h-4 w-4" :style="{
                  backgroundColor: item.color || '#000',
                  WebkitMask: `url(${item.icon}) center / contain no-repeat`,
                  mask: `url(${item.icon}) center / contain no-repeat`,
                }" />
                <span>{{ item.label }}</span>
              </div>
              <UIcon name="i-lucide-check" class="size-3 text-neutral-700"
                :class="isGrupperLegendSelected(item.value) ? 'opacity-100' : 'opacity-0'" />
            </div>
          </template>
        </USelect>
        <USelect v-if="!isFrameworkCompareMode && grupperChartMode === 'single'" v-model="selectedSingleArtkategori"
          :items="compareArtkategoriOptionsReversed" option-attribute="label" value-key="value" size="md"
          variant="outline" placeholder="Välj svampgrupp"
          class="hover:cursor-pointer ring-muted/50 sm:mx-2 mb-2 w-full sm:w-fit max-w-full"
          :ui="{ content: 'min-w-fit' }">
          <template #default="{ ui }">
            <span v-if="selectedSingleItem"
              :class="ui.value({ class: 'flex items-center gap-2 min-w-0 overflow-hidden' })">
              <span class="inline-flex items-center gap-2 min-w-0 overflow-visible">
                <span v-if="selectedSingleItem.icon" class="h-3.5 w-3.5" :style="{
                  backgroundColor: selectedSingleItem.color || '#000',
                  WebkitMask: `url(${selectedSingleItem.icon}) center / contain no-repeat`,
                  mask: `url(${selectedSingleItem.icon}) center / contain no-repeat`,
                }" />
                <span>{{ selectedSingleItem.label }}</span>
              </span>
            </span>
            <span v-else :class="ui.placeholder({ class: '' })">Välj svampgrupp</span>
          </template>
          <template #item="{ item }">
            <div class="flex items-center gap-2">
              <span v-if="item.icon" class="h-4 w-4" :style="{
                backgroundColor: item.color || '#000',
                WebkitMask: `url(${item.icon}) center / contain no-repeat`,
                mask: `url(${item.icon}) center / contain no-repeat`,
              }" />
              <span>{{ item.label }}</span>
            </div>
          </template>
        </USelect>
        <USelect v-if="isFrameworkCompareMode" v-model="selectedCompareArtkategori"
          :items="compareArtkategoriOptionsReversed" option-attribute="label" value-key="value" size="md"
          variant="outline" placeholder="Välj svampgrupp"
          class="hover:cursor-pointer ring-muted/50 sm:mx-2 mb-2 w-full sm:w-fit max-w-full"
          :ui="{ content: 'min-w-fit' }">
          <template #default="{ ui }">
            <span v-if="selectedCompareItem"
              :class="ui.value({ class: 'flex items-center gap-2 min-w-0 overflow-hidden' })">
              <span class="inline-flex items-center gap-2 min-w-0 overflow-visible">
                <span v-if="selectedCompareItem.icon" class="h-3.5 w-3.5" :style="{
                  backgroundColor: selectedCompareItem.color || '#000',
                  WebkitMask: `url(${selectedCompareItem.icon}) center / contain no-repeat`,
                  mask: `url(${selectedCompareItem.icon}) center / contain no-repeat`,
                }" />
                <span>{{ selectedCompareItem.label }}</span>
              </span>
            </span>
            <span v-else :class="ui.placeholder({ class: '' })">Välj svampgrupp</span>
          </template>
          <template #item="{ item }">
            <div class="flex items-center gap-2">
              <span v-if="item.icon" class="h-4 w-4" :style="{
                backgroundColor: item.color || '#000',
                WebkitMask: `url(${item.icon}) center / contain no-repeat`,
                mask: `url(${item.icon}) center / contain no-repeat`,
              }" />
              <span>{{ item.label }}</span>
            </div>
          </template>
        </USelect>

      </div>
      <div class="px-4 pb-2 text-sm text-muted" v-if="chartDescription">
        {{ chartDescription }}
      </div>
      <div v-if="selectedChart === 'grupper'" class="mx-2 my-2">
        <UModal :fullscreen="isMobile ? true : false" title="Relativ mängd" description="">

          <UButton size="lg" variant="outline" class="px-3 flex justify-center ring-muted/50" color="neutral"
            icon="i-carbon-diagram-reference" label="Relativ mängd vid olika åldrar" />
          <template #body>
            <div class="flex flex-col gap-4">
              <ForestryChartDisplay :selectedFrameworks="['trakthygge']"
                :selectedArtkategori="defaultGrupperArtkategori" chartType="area" :singleFrameworkSelection="true"
                :relativeChart="true" />
              <p class="text-sm text-muted">
                {{ grupperModalDescription }}
              </p>
            </div>
          </template>
        </UModal>
      </div>
      <div v-if="selectedChart === 'matsvampar' && selectedMatsvampVariant === 'goda'" class="mx-2 my-2">
        <UModal :fullscreen="isMobile ? true : false" title="Om goda matsvampar" description="">
          <UButton size="lg" variant="outline" class="px-3 flex justify-center ring-muted/50" color="neutral"
            icon="heroicons:question-mark-circle" label="Om goda matsvampar" />
          <template #body>
            <div class="flex flex-col gap-4">
              <p v-for="(paragraph, index) in godaMatsvamparModalParagraphs" :key="index" class="text-sm text-muted">
                {{ paragraph }}
              </p>
            </div>
          </template>
        </UModal>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useAsyncData } from '#app'

const isMobile = useMediaQuery('(max-width: 767px)')

type MatsvampVariant = 'standard' | 'goda' | 'kg'

interface ForestryChartTextEntry {
  id: string
  description: string
  modalDescription?: string
}

const fallbackChartDescriptions = {
  skogsskole: 'Mängd mykorrhizasvamp i marken i förhållande till förekomsten i äldre skog/före avverkning (%).',
  rodlistade: 'Mängden av mykorrhizasvampar som är rödlistade/signalarter i marken i förhållande till förekomsten i äldre skog/före avverkning (%).',
  grupper: 'Mängden av olika grupper svampar i förhållande till förekomsten i äldre skog/före avverkning (%).'
} as const

const fallbackGrupperModalDescription = 'Den relativa fördelningen av olika grupper mykorrhizasvampar vid olika skogsåldrar. Uppgifterna baseras enbart på förekomst i skogar av olika åldrar och är inte kopplade till vilken skogsskötselmetod som använts.'
const fallbackGodaMatsvamparModalDescription = 'Matsvampar omfattar de 75 arter som klassas som matsvampar i Nya svampboken (Holmberg & Marklund 2014) och av Svampguiden.com.\n\nVad som är en god matsvamp är subjektivt. Här har vi klassat 43 arter som goda (bl a kantarell, stensopp och trattkantarell) och resterade 32 arter som ordinära matsvampar (bl a björksopp, grönkremla och pepparriska).'

const fallbackMatsvampVariantDescriptions: Record<MatsvampVariant, string> = {
  standard: 'Mängden av alla matsvampar i marken förhållande till förekomsten i äldre skog/före avverkning (%).',
  goda: 'Mängden av alla goda matsvampar i förhållande till förekomsten i äldre skog/före avverkning (%).',
  kg: 'Färskvikten av alla matsvampar (kg/ha) under en säsong i förhållande till förekomsten i äldre skog/före avverkning. Medel- samt min-maxvärde.'
}

const { data: forestryChartTextsDoc } = await useAsyncData('forestry-chart-texts', () =>
  queryCollection('forestryChartTexts').first()
)

function extractChartTextEntries(payload: any): ForestryChartTextEntry[] {
  if (!payload) return []
  if (Array.isArray(payload)) return payload as ForestryChartTextEntry[]
  if (Array.isArray(payload?.entries)) return payload.entries as ForestryChartTextEntry[]
  if (Array.isArray(payload?.body)) return payload.body as ForestryChartTextEntry[]
  if (Array.isArray(payload?.data)) return payload.data as ForestryChartTextEntry[]
  return []
}

const chartTextEntries = computed<ForestryChartTextEntry[]>(() => extractChartTextEntries(forestryChartTextsDoc.value))

const chartTextMap = computed<Record<string, ForestryChartTextEntry>>(() => {
  const map: Record<string, ForestryChartTextEntry> = {}
  for (const entry of chartTextEntries.value) {
    if (entry?.id) {
      map[entry.id] = entry
    }
  }
  return map
})

const skogsskoleDescription = computed(() =>
  chartTextMap.value['skogsskole']?.description ?? fallbackChartDescriptions.skogsskole
)

const rodlistadeDescription = computed(() =>
  chartTextMap.value['rodlistade']?.description ?? fallbackChartDescriptions.rodlistade
)

const grupperDescription = computed(() =>
  chartTextMap.value['grupper']?.description ?? fallbackChartDescriptions.grupper
)

const grupperModalDescription = computed(() =>
  chartTextMap.value['grupper']?.modalDescription ?? fallbackGrupperModalDescription
)

const godaMatsvamparModalDescription = computed(() =>
  chartTextMap.value['goda matsvampar']?.modalDescription ?? fallbackGodaMatsvamparModalDescription
)

const godaMatsvamparModalParagraphs = computed(() =>
  godaMatsvamparModalDescription.value
    .split(/\n{2,}/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean)
)

const chartDisplayProps = computed(() => {
  const baseFrameworks = props.parentSelectedFrameworks ?? ['naturskydd', 'trakthygge', 'luckhuggning', 'blädning', 'skärmträd']
  const startskogValue =
    typeof props.currentStartskog === 'string'
      ? props.currentStartskog
      : (props.currentStartskog as any)?.value ?? ''

  if (selectedChart.value === 'rodlistade') {
    return {
      selectedFrameworks: baseFrameworks,
      selectedArtkategori: ['rödlistade + signalarter'],
      chartType: chartType.value,
      selectedStartskog: startskogValue,
      redColor: true,
      maxYValue: 0.65,
      currentTimeValue: props.currentTimeValue,
      frameworkComparisonMode: isFrameworkCompareMode.value,
      preserveFrameworkOrder: props.preserveFrameworkOrder,
    }
  }

  if (selectedChart.value === 'matsvampar') {
    return {
      selectedFrameworks: baseFrameworks,
      selectedArtkategori: [matsvampChartArtkategori.value],
      chartType: chartType.value,
      selectedStartskog: startskogValue,
      yellowColor: true,
      maxYValue: matsvampMaxY.value,
      currentTimeValue: props.currentTimeValue,
      matsvampVariant: selectedMatsvampVariant.value,
      frameworkComparisonMode: isFrameworkCompareMode.value,
      preserveFrameworkOrder: props.preserveFrameworkOrder,
    }
  }

  if (selectedChart.value === 'grupper') {
    return {
      selectedFrameworks: props.parentSelectedFrameworks ?? [selectedSingleFramework.value],
      selectedArtkategori: isFrameworkCompareMode.value
        ? [selectedCompareArtkategori.value]
        : (grupperChartMode.value === 'single' ? [selectedSingleArtkategori.value] : selectedArtkategori.value),
      frameworkComparisonMode: isFrameworkCompareMode.value,
      grupperDisplayMode: isFrameworkCompareMode.value ? 'single' : grupperChartMode.value,
      chartType: chartType.value,
      singleFrameworkSelection: true,
      selectedStartskog: startskogValue,
      currentTimeValue: props.currentTimeValue,
      preserveFrameworkOrder: props.preserveFrameworkOrder,
    }
  }

  // skogsskole default
  return {
    selectedFrameworks: baseFrameworks,
    selectedArtkategori: ['total'],
    chartType: chartType.value,
    // maxYValue: 130,
    currentTimeValue: props.currentTimeValue,
    frameworkComparisonMode: isFrameworkCompareMode.value,
    preserveFrameworkOrder: props.preserveFrameworkOrder,
    selectedStartskog: startskogValue,
  }
})

const chartDescription = computed(() => {
  if (selectedChart.value === 'rodlistade') return rodlistadeDescription.value
  if (selectedChart.value === 'matsvampar') return matsvampDescription.value
  if (selectedChart.value === 'grupper') return grupperDescription.value
  return skogsskoleDescription.value
})

const matsvampVariantDescriptions = computed<Record<MatsvampVariant, string>>(() => {
  const map: Record<MatsvampVariant, string> = { ...fallbackMatsvampVariantDescriptions }
  if (chartTextMap.value['alla matsvampar']?.description) {
    map.standard = chartTextMap.value['alla matsvampar'].description
  }
  if (chartTextMap.value['goda matsvampar']?.description) {
    map.goda = chartTextMap.value['goda matsvampar'].description
  }
  if (chartTextMap.value['kg matsvampar']?.description) {
    map.kg = chartTextMap.value['kg matsvampar'].description
  }
  return map
})

interface Props {
  parentSelectedFrameworks?: string[]
  currentTimeValue?: string
  currentStartskog?: string
  selectedChart?: string
  preserveFrameworkOrder?: boolean
  showControls?: boolean
  showMatsvampSelector?: boolean
  showInlineTabs?: boolean
  hideGrupperInSelect?: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:selectedChart', value: string): void
}>()

const showControls = computed(() => props.showControls !== false)
const showMatsvampSelector = computed(() => props.showMatsvampSelector !== false)
const showInlineTabs = computed(() => props.showInlineTabs === true)
const showPrimaryInlineTabs = computed(() =>
  showInlineTabs.value && (selectedChart.value === 'skogsskole' || selectedChart.value === 'grupper')
)
const showHeaderRow = computed(() =>
  showControls.value
  || (selectedChart.value === 'grupper' && isFrameworkCompareMode.value)
)

const selectedStartskog = ref('naturskog');
const selectedStartskog2 = ref('naturskog');
const selectedStartskog3 = ref('naturskog');

const selectedSingleFramework = ref('trakthygge');

const TreeChartLine = ref(true)

const showDesc1 = ref(false)
const showDesc2 = ref(false)
const showDesc3 = ref(false)
const showDesc4 = ref(false)
const showDesc5 = ref(false)

const chartOptions = [
  { label: 'Mängd mykorrhizasvamp', value: 'skogsskole', icon: 'i-lineicons-mushroom' },
  { label: 'Svampgrupper', value: 'grupper', icon: 'i-material-symbols-category-rounded' },
  { label: 'Naturvårdssvampar', value: 'rodlistade', icon: 'i-material-symbols-award-star' },
  { label: 'Matsvampar', value: 'matsvampar', icon: 'icon-park-solid:knife-fork' },

]
const selectChartOptions = computed(() =>
  props.hideGrupperInSelect
    ? chartOptions.filter(option => option.value !== 'grupper')
    : chartOptions
)
const inlineChartTabs = [
  { label: 'Total mängd', value: 'skogsskole', icon: 'i-lineicons-mushroom' },
  { label: 'Svampgrupper', value: 'grupper', icon: 'i-material-symbols-category-rounded' },
]
const selectedChart = ref<string>(
  chartOptions.some(opt => opt.value === (props.selectedChart as any))
    ? (props.selectedChart as string)
    : chartOptions[0].value
)
const selectedChartControl = computed<string>({
  get: () => (props.hideGrupperInSelect && selectedChart.value === 'grupper' ? 'skogsskole' : selectedChart.value),
  set: (value) => {
    if (chartOptions.some(opt => opt.value === value)) {
      selectedChart.value = value
    }
  }
})
const selectedChartIcon = computed(() =>
  chartOptions.find(opt => opt.value === selectedChartControl.value)?.icon
)
const isFrameworkCompareMode = computed(() => (props.parentSelectedFrameworks?.length ?? 0) === 2)

function ToggleTreeChartType() {
  TreeChartLine.value = !TreeChartLine.value;
}

function setSelectedChart(value: string) {
  if (chartOptions.some(opt => opt.value === value)) {
    selectedChart.value = value
  }
}

defineExpose({
  setSelectedChart,
})

// Keep internal selection in sync with parent prop changes
watch(() => props.selectedChart, (val) => {
  if (typeof val === 'string' && chartOptions.some(opt => opt.value === val)) {
    if (selectedChart.value !== val) selectedChart.value = val
  }
})

// Emit updates to parent when selection changes locally
watch(selectedChart, (val) => {
  emit('update:selectedChart', val)
})

// Options for frameworks
const frameworkOptions = [
  { label: 'Naturskydd', value: 'naturskydd' },
  { label: 'Blädning', value: 'blädning' },
  { label: 'Trakthygge', value: 'trakthygge' },
  { label: 'Skärmträd', value: 'skärmträd' },
  { label: 'Luckhuggning', value: 'luckhuggning' }
]

// Options for artkategorier
const defaultGrupperArtkategori = [
  'atheliales',
  'boletales',
  'cantharellales',
  'spindlingar',
  'russulales',
  'thelephorales',
  'ascomycota',
  'övriga',
]

const artkategoriOptions = [
  { label: 'Atheliales', value: 'atheliales' },
  { label: 'Boletales', value: 'boletales' },
  { label: 'Cantharellales', value: 'cantharellales' },
  { label: 'Spindlingar', value: 'spindlingar' },
  { label: 'Russulales', value: 'russulales' },
  { label: 'Thelephorales', value: 'thelephorales' },
  { label: 'Sporsäckssvampar', value: 'ascomycota' },
  { label: 'Övriga', value: 'övriga' },
  { label: 'matsvamp', value: 'matsvamp' },
  { label: 'rödlistade + signalarter', value: 'rödlistade + signalarter' },
  { label: 'total', value: 'total' },
]
const chartType = ref('area')


function ToggleChartType() {
  chartType.value = chartType.value === 'area' ? 'bar' : 'area';
}

const chartType2 = ref('area')

function ToggleChartType2() {
  chartType2.value = chartType2.value === 'area' ? 'bar' : 'area';
}

const matsvampVariantOptions = [
  { label: 'Alla matsvampar', value: 'standard', icon: 'i-lineicons-mushroom-1' },
  { label: 'Goda matsvampar', value: 'goda', icon: 'i-heroicons-star-16-solid' },
  { label: 'Kg matsvampar', value: 'kg', icon: 'i-material-symbols-scale-outline-rounded' },
]

const selectedMatsvampVariant = ref<MatsvampVariant>('standard')
const matsvampChartArtkategori = computed(() => selectedMatsvampVariant.value === 'goda' ? 'goda matsvampar' : 'matsvamp')

const matsvampDescription = computed(() =>
  matsvampVariantDescriptions.value[selectedMatsvampVariant.value]
)

const matsvampMaxY = computed(() => (selectedMatsvampVariant.value === 'kg' ? 55 : 28) + 5)
const grupperChartMode = ref<'stacked' | 'single'>('stacked')
const grupperModeTabs = computed(() => [
  { value: 'stacked', icon: 'i-carbon-chart-area', label: '', disabled: isFrameworkCompareMode.value },
  { value: 'single', icon: 'i-carbon-chart-line', label: '' },
])

const selectedArtkategori = ref<string[]>([...defaultGrupperArtkategori]);
const grupperLegendSelectItems = computed(() => compareArtkategoriOptionsReversed.value.map(item => ({
  label: item.label,
  value: item.value,
  icon: item.icon,
  color: item.color,
})))
const selectedGrupperLegendItems = computed(() =>
  grupperLegendSelectItems.value.filter(item => selectedArtkategori.value.includes(item.value))
)
function isGrupperLegendSelected(value?: string) {
  if (!value) return false
  return selectedArtkategori.value.includes(value)
}

const compareArtkategoriOptions = [
  {
    label: 'Skinnsvampar',
    value: 'atheliales',
    icon: '/images/svampgrupp/skinnsvamp.png',
    color: '#8B5CF6',
    avatar: {
      src: '/images/svampgrupp/skinnsvamp.png',
      alt: 'Skinnsvampar'
    }
  },
  {
    label: 'Soppar',
    value: 'boletales',
    icon: '/images/svampgrupp/sopp.png',
    color: '#EC4899',
    avatar: {
      src: '/images/svampgrupp/sopp.png',
      alt: 'Soppar'
    }
  },
  {
    label: 'Kantarellsläktingar',
    value: 'cantharellales',
    icon: '/images/svampgrupp/kantarell.png',
    color: '#eab308',
    avatar: {
      src: '/images/svampgrupp/kantarell.png',
      alt: 'Kantarellsläktingar'
    }
  },
  {
    label: 'Spindelskivlingar',
    value: 'spindlingar',
    icon: '/images/svampgrupp/hattsvamp.png',
    color: '#F97316',
    avatar: {
      src: '/images/svampgrupp/hattsvamp.png',
      alt: 'Spindelskivlingar'
    }
  },
  {
    label: 'Kremlor & riskor',
    value: 'russulales',
    icon: '/images/svampgrupp/hattsvamp.png',
    color: '#22C55E',
    avatar: {
      src: '/images/svampgrupp/hattsvamp.png',
      alt: 'Kremlor & riskor'
    }
  },
  {
    label: 'Tagg- och tomentelloida svampar',
    value: 'thelephorales',
    icon: '/images/svampgrupp/taggsvamp.png',
    color: '#0EA5E9',
    avatar: {
      src: '/images/svampgrupp/taggsvamp.png',
      alt: 'Tagg- och tomentelloida svampar'
    }
  },
  {
    label: 'Sporsäckssvampar',
    value: 'ascomycota',
    icon: '/images/svampgrupp/skalsvamp.png',
    color: '#DC2626',
    avatar: {
      src: '/images/svampgrupp/skalsvamp.png',
      alt: 'Sporsäckssvampar'
    }
  },
  {
    label: 'Övriga svampar',
    value: 'övriga',
    icon: '/images/svampgrupp/ovrigt.png',
    color: '#94A3B8',
    avatar: {
      src: '/images/svampgrupp/ovrigt.png',
      alt: 'Övriga svampar'
    }
  }
]
const compareArtkategoriOptionsReversed = computed(() => [...compareArtkategoriOptions].reverse())

const selectedCompareArtkategori = ref(compareArtkategoriOptions[0].value)
const selectedCompareItem = computed(() =>
  compareArtkategoriOptions.find(opt => opt.value === selectedCompareArtkategori.value)
)
const selectedSingleArtkategori = ref(compareArtkategoriOptions[0].value)
const selectedSingleItem = computed(() =>
  compareArtkategoriOptions.find(opt => opt.value === selectedSingleArtkategori.value)
)

watch([selectedChart, isFrameworkCompareMode], ([chart, compare]) => {
  if (!(chart === 'grupper' && compare)) {
    selectedCompareArtkategori.value = compareArtkategoriOptions[0].value
  }
  if (chart === 'grupper' && !compare) {
    selectedArtkategori.value = [...defaultGrupperArtkategori]
  }
  if (chart === 'grupper' && compare) {
    grupperChartMode.value = 'single'
  }
})

watch(() => props.parentSelectedFrameworks?.length, () => {
  if (selectedChart.value === 'grupper' && isFrameworkCompareMode.value) {
    selectedCompareArtkategori.value = compareArtkategoriOptions[0].value
  }
})

watch(grupperChartMode, (mode) => {
  if (mode === 'single' && selectedArtkategori.value.length > 0) {
    selectedSingleArtkategori.value = selectedArtkategori.value[0]
  }
})


</script>

<style scoped>
.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
</style>
