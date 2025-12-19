<template>
  <div>
    <!-- Dropdown to select which chart to display -->

    <div class="mt-2 mb-1 flex justify-between">
      <USelect v-model="selectedChart" :items="chartOptions" value-key="value" option-attribute="label" size="xl"
        variant="none" class="hover:cursor-pointer" :icon="selectedChartIcon"
        :ui="{ content: 'min-w-fit', value: 'sm:text-lg sm:font-medium text-neutral-700' }" />
      <div class="pr-2">


        <USelect v-if="selectedChart === 'grupper' && isFrameworkCompareMode" v-model="selectedCompareArtkategori"
          :items="compareArtkategoriOptions" option-attribute="label" value-key="value" size="lg" variant="soft"
          placeholder="Välj svampgrupp" class="hover:cursor-pointer rounded-full"
          :ui="{ content: 'min-w-fit', value: 'hidden sm:flex', base: 'min-h-8' }" :avatar="selectedCompareAvatar">
          <template #item="{ item }">
            <div class="flex items-center gap-2">
              <img v-if="item.icon" :src="item.icon" alt="" class="size-5 rounded-sm object-contain" />
              <span>{{ item.label }}</span>
            </div>
          </template>
        </USelect>
        <USelect v-if="selectedChart === 'matsvampar'" v-model="selectedMatsvampVariant" :items="matsvampVariantOptions"
          :content="{
            align: 'end',
            side: 'bottom',
            sideOffset: 8
          }" option-attribute="label" value-key="value" placeholder="Välj dataset"
          class="hover:cursor-pointer rounded-full" size="lg" variant="soft"
          :ui="{ content: 'w-fit shrink-0', value: 'hidden', base: 'min-h-8', item: 'gap-0' }"
          :icon="selectedMatsvampIcon" :aria-label="selectedMatsvampLabel">
          <template #item="{ item }">
            <div class="flex items-center gap-2">
              <UIcon v-if="item.icon" :name="item.icon" class="size-4" />
              <span>{{ item.label }}</span>
            </div>
          </template>
        </USelect>
      </div>


      <!-- <UButton color="neutral" variant="subtle"
        :icon="chartType === 'area' ? 'i-carbon-chart-column' : 'i-carbon-chart-line-smooth'"
        @click="ToggleChartType" /> -->
    </div>

    <div class="space-y-3">

      <ForestryChartDisplay v-bind="chartDisplayProps" />

      <div class="px-4 pb-4 text-sm text-muted" v-if="chartDescription">
        {{ chartDescription }}
      </div>
      <div v-if="selectedChart === 'grupper'" class="mx-2">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useAsyncData } from '#app'

const isMobile = useMediaQuery('(max-width: 767px)')

type MatsvampVariant = 'standard' | 'goda' | 'kg'

interface ForestryChartTextVariant {
  id: string
  description: string
}

interface ForestryChartTextEntry {
  id: string
  description: string
  modalDescription?: string
  variants?: ForestryChartTextVariant[]
}

const fallbackChartDescriptions = {
  skogsskole: 'Mängd mykorrhizasvamp i marken i förhållande till förekomsten i äldre skog/före avverkning (%).',
  rodlistade: 'Mängden av mykorrhizasvampar som är rödlistade/signalarter i marken i förhållande till förekomsten i äldre skog/före avverkning (%).',
  grupper: 'Mängden av olika grupper svampar i förhållande till förekomsten i äldre skog/före avverkning (%).'
} as const

const fallbackGrupperModalDescription = 'Den relativa fördelningen av olika grupper mykorrhizasvampar vid olika skogsåldrar. Uppgifterna baseras enbart på förekomst i skogar av olika åldrar och är inte kopplade till vilken skogsskötselmetod som använts.'

const fallbackMatsvampVariantDescriptions: Record<MatsvampVariant, string> = {
  standard: 'Mängden av alla matsvampar i marken förhållande till förekomsten i äldre skog/före avverkning (%).',
  goda: 'Mängden av alla goda matsvampar i förhållande till förekomsten i äldre skog/före avverkning (%).',
  kg: 'Färskvikten av alla matsvampar (kg/ha) under en säsong i förhållande till förekomsten i äldre skog/före avverkning. Medel- samt min-maxvärde.'
}

const matsvampVariantKeys: MatsvampVariant[] = ['standard', 'goda', 'kg']

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

const chartDisplayProps = computed(() => {
  const baseFrameworks = props.parentSelectedFrameworks ?? ['naturskydd', 'trakthygge', 'luckhuggning', 'blädning', 'skärmträd']

  if (selectedChart.value === 'rodlistade') {
    return {
      selectedFrameworks: baseFrameworks,
      selectedArtkategori: ['rödlistade + signalarter'],
      chartType: chartType.value,
      selectedStartskog: props.currentStartskog,
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
      selectedStartskog: props.currentStartskog,
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
      selectedArtkategori: isFrameworkCompareMode.value ? [selectedCompareArtkategori.value] : selectedArtkategori.value,
      frameworkComparisonMode: isFrameworkCompareMode.value,
      chartType: chartType.value,
      singleFrameworkSelection: true,
      selectedStartskog: props.currentStartskog,
      currentTimeValue: props.currentTimeValue,
      preserveFrameworkOrder: props.preserveFrameworkOrder,
    }
  }

  // skogsskole default
  return {
    selectedFrameworks: baseFrameworks,
    selectedArtkategori: ['total'],
    chartType: chartType.value,
    maxYValue: 130,
    currentTimeValue: props.currentTimeValue,
    frameworkComparisonMode: isFrameworkCompareMode.value,
    preserveFrameworkOrder: props.preserveFrameworkOrder,
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
  const entry = chartTextMap.value['matsvampar']
  if (entry?.variants?.length) {
    for (const variant of entry.variants) {
      if (isMatsvampVariant(variant?.id) && variant.description) {
        map[variant.id] = variant.description
      }
    }
  } else if (entry?.description) {
    map.standard = entry.description
  }
  return map
})

function isMatsvampVariant(value: string | undefined): value is MatsvampVariant {
  if (!value) return false
  return matsvampVariantKeys.includes(value as MatsvampVariant)
}

interface Props {
  parentSelectedFrameworks?: string[]
  currentTimeValue?: string
  currentStartskog?: string
  selectedChart?: string
  preserveFrameworkOrder?: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:selectedChart', value: string): void
}>()

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
  { label: 'Mängd mykorrhizasvamp', value: 'skogsskole', icon: 'i-lineicons-mushroom-1' },
  { label: 'Svampgrupper', value: 'grupper', icon: 'i-material-symbols-category-rounded' },
  { label: 'Naturvårdssvampar', value: 'rodlistade', icon: 'i-material-symbols-award-star' },
  { label: 'Matsvampar', value: 'matsvampar', icon: 'icon-park-solid:knife-fork' },

]
const selectedChart = ref<string>(
  chartOptions.some(opt => opt.value === (props.selectedChart as any))
    ? (props.selectedChart as string)
    : chartOptions[0].value
)
const selectedChartIcon = computed(() =>
  chartOptions.find(opt => opt.value === selectedChart.value)?.icon
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

const selectedMatsvampIcon = computed(() =>
  matsvampVariantOptions.find(opt => opt.value === selectedMatsvampVariant.value)?.icon
)

const selectedMatsvampLabel = computed(() =>
  matsvampVariantOptions.find(opt => opt.value === selectedMatsvampVariant.value)?.label ?? 'Välj dataset'
)

const matsvampDescription = computed(() =>
  matsvampVariantDescriptions.value[selectedMatsvampVariant.value]
)

const matsvampMaxY = computed(() => selectedMatsvampVariant.value === 'kg' ? 55 : 28)

const selectedArtkategori = ref<string[]>([...defaultGrupperArtkategori]);

const compareArtkategoriOptions = [
  {
    label: 'Skinnsvampar',
    value: 'atheliales',
    icon: '/images/svampgrupp/skinnsvamp.png',
    avatar: {
      src: '/images/svampgrupp/skinnsvamp.png',
      alt: 'Skinnsvampar'
    }
  },
  {
    label: 'Soppar',
    value: 'boletales',
    icon: '/images/svampgrupp/sopp.png',
    avatar: {
      src: '/images/svampgrupp/sopp.png',
      alt: 'Soppar'
    }
  },
  {
    label: 'Kantarellsläktingar',
    value: 'cantharellales',
    icon: '/images/svampgrupp/kantarell.png',
    avatar: {
      src: '/images/svampgrupp/kantarell.png',
      alt: 'Kantarellsläktingar'
    }
  },
  {
    label: 'Spindelskivlingar',
    value: 'spindlingar',
    icon: '/images/svampgrupp/hattsvamp.png',
    avatar: {
      src: '/images/svampgrupp/hattsvamp.png',
      alt: 'Spindelskivlingar'
    }
  },
  {
    label: 'Kremlor & riskor',
    value: 'russulales',
    icon: '/images/svampgrupp/hattsvamp.png',
    avatar: {
      src: '/images/svampgrupp/hattsvamp.png',
      alt: 'Kremlor & riskor'
    }
  },
  {
    label: 'Tagg- och tomentelloida svampar',
    value: 'thelephorales',
    icon: '/images/svampgrupp/taggsvamp.png',
    avatar: {
      src: '/images/svampgrupp/taggsvamp.png',
      alt: 'Tagg- och tomentelloida svampar'
    }
  },
  {
    label: 'Sporsäckssvampar',
    value: 'ascomycota',
    icon: '/images/svampgrupp/skalsvamp.png',
    avatar: {
      src: '/images/svampgrupp/skalsvamp.png',
      alt: 'Sporsäckssvampar'
    }
  },
  {
    label: 'Övriga svampar',
    value: 'övriga',
    icon: '/images/svampgrupp/ovrigt.png',
    avatar: {
      src: '/images/svampgrupp/ovrigt.png',
      alt: 'Övriga svampar'
    }
  }
]

const selectedCompareArtkategori = ref(compareArtkategoriOptions[0].value)

const selectedCompareAvatar = computed(() =>
  compareArtkategoriOptions.find(opt => opt.value === selectedCompareArtkategori.value)?.avatar
)

watch([selectedChart, isFrameworkCompareMode], ([chart, compare]) => {
  if (!(chart === 'grupper' && compare)) {
    selectedCompareArtkategori.value = compareArtkategoriOptions[0].value
  }
  if (chart === 'grupper' && !compare) {
    selectedArtkategori.value = [...defaultGrupperArtkategori]
  }
})

watch(() => props.parentSelectedFrameworks?.length, () => {
  if (selectedChart.value === 'grupper' && isFrameworkCompareMode.value) {
    selectedCompareArtkategori.value = compareArtkategoriOptions[0].value
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
