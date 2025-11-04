<template>
  <div>
    <!-- Dropdown to select which chart to display -->

    <div class="mt-2 ml-2 flex justify-between">
      <UPopover :content="{
        align: 'start',
        side: 'bottom',
        sideOffset: 8,
      }">
        <!-- <UButton variant="ghost" size="lg" icon="i-heroicons-chevron-up-down" :label="chartOptions.find(opt => opt.value === selectedChart)?.label || 'Välj diagram'" trailing /> -->
        <div class="flex items-center cursor-pointer w-fit hover:bg-muted px-2">
          <h1 class="text-neutral-800 text-md font-semibold leading-loose   pr-2 rounded-sm">
            {{
              chartOptions.find(opt => opt.value === selectedChart)?.label || 'Välj diagram'}}
          </h1>
          <Icon name="i-heroicons-chevron-up-down" class="size-4 " />
        </div>


        <template #content>
          <div class="p-2 flex flex-col gap-2">
            <UButton size="lg" v-for="opt in chartOptions" :key="opt.value" color="neutral" variant="ghost"
              @click="selectedChart = opt.value">
              {{ opt.label }}
            </UButton>
          </div>
        </template>
      </UPopover>
      <div class="pr-4">
        <USelect v-if="selectedChart === 'grupper' && isFrameworkCompareMode" v-model="selectedCompareArtkategori"
          :items="compareArtkategoriOptions" size="sm" placeholder="Välj svampgrupp" />
        <USelect v-if="selectedChart === 'matsvampar'" v-model="selectedMatsvampVariant" :items="matsvampVariantOptions"
          size="sm" placeholder="Välj dataset" />
      </div>


      <!-- <UButton color="neutral" variant="subtle"
        :icon="chartType === 'area' ? 'i-carbon-chart-column' : 'i-carbon-chart-line-smooth'"
        @click="ToggleChartType" /> -->
    </div>

    <div>

      <div v-if="selectedChart === 'skogsskole'">
        <ForestryChartDisplay
          :selectedFrameworks="props.parentSelectedFrameworks ?? ['naturskydd', 'trakthygge', 'luckhuggning', 'blädning', 'skärmträd']"
          :selectedArtkategori="['total']" :chartType="chartType" :maxYValue="130"
          :currentTimeValue="props.currentTimeValue" />
        <div class="px-4 pb-4 text-xs text-muted">
          Mängd mykorrhizasvamp i marken i förhållande till förekomsten i äldre skog/före avverkning (%).
        </div>
      </div>
      <div v-if="selectedChart === 'rodlistade'">
        <ForestryChartDisplay
          :selectedFrameworks="props.parentSelectedFrameworks ?? ['naturskydd', 'trakthygge', 'luckhuggning', 'blädning', 'skärmträd']"
          :selectedArtkategori="['rödlistade + signalarter']" :chartType="chartType"
          :selectedStartskog="props.currentStartskog" :redColor="true" :maxYValue="0.65"
          :currentTimeValue="props.currentTimeValue" />
        <div class="px-4 pb-4 text-xs text-muted">
          Mängden av mykorrhizasvampar som är rödlistade/signalarter i marken i förhållande till förekomsten i äldre
          skog/före avverkning (%).
        </div>
      </div>
      <div v-if="selectedChart === 'matsvampar'">
        <ForestryChartDisplay
          :selectedFrameworks="props.parentSelectedFrameworks ?? ['naturskydd', 'trakthygge', 'luckhuggning', 'blädning', 'skärmträd']"
          :selectedArtkategori="['matsvamp']" :chartType="chartType" :selectedStartskog="props.currentStartskog"
          :yellowColor="true" :maxYValue="matsvampMaxY" :currentTimeValue="props.currentTimeValue"
          :matsvampVariant="selectedMatsvampVariant" />
        <div class="px-4 pb-4 text-xs text-muted">
          {{ matsvampDescription }}
        </div>
      </div>
      <div v-if="selectedChart === 'grupper'">
        <ForestryChartDisplay :selectedFrameworks="props.parentSelectedFrameworks ?? [selectedSingleFramework]"
          :selectedArtkategori="isFrameworkCompareMode ? [selectedCompareArtkategori] : selectedArtkategori"
          :frameworkComparisonMode="isFrameworkCompareMode" :chartType="chartType" :singleFrameworkSelection="true"
          :selectedStartskog="props.currentStartskog" :currentTimeValue="props.currentTimeValue" />
        <div class="px-4 pb-4 text-xs text-muted">
          Mängden av olika grupper svampar i förhållande till förekomsten i äldre skog/före avverkning (%).
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  parentSelectedFrameworks?: string[]
  currentTimeValue?: string
  currentStartskog?: string
  selectedChart?: string
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
  { label: 'Total mängd mykorrhizasvamp', value: 'skogsskole' },
  { label: 'Naturvårdsarter', value: 'rodlistade' },
  { label: 'Matsvampar', value: 'matsvampar' },
  { label: 'Olika svampgrupper', value: 'grupper' }
]
const selectedChart = ref<string>(
  chartOptions.some(opt => opt.value === (props.selectedChart as any))
    ? (props.selectedChart as string)
    : chartOptions[0].value
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
]

const artkategoriOptions = [
  { label: 'Atheliales', value: 'atheliales' },
  { label: 'Boletales', value: 'boletales' },
  { label: 'Cantharellales', value: 'cantharellales' },
  { label: 'Spindlingar', value: 'spindlingar' },
  { label: 'Russulales', value: 'russulales' },
  { label: 'Thelephorales', value: 'thelephorales' },
  { label: 'Sporsäckssvampar', value: 'ascomycota' },
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
  { label: 'Alla matsvampar', value: 'standard' },
  { label: 'Goda matsvampar', value: 'goda' },
  { label: 'Kg matsvampar', value: 'kg' },
]

const selectedMatsvampVariant = ref<'standard' | 'goda' | 'kg'>('standard')

const matsvampDescription = computed(() => {
  if (selectedMatsvampVariant.value === 'goda') {
    return 'Mängden av alla goda matsvampar i förhållande till förekomsten i äldre skog/före avverkning (%).';
  }
  if (selectedMatsvampVariant.value === 'kg') {
    return 'Färskvikten av alla matsvampar (kg/ha) under en säsong i förhållande till förekomsten i äldre skog/före avverkning. Medel- samt min-maxvärde.';
  }
  return 'Mängden av alla matsvampar i marken förhållande till förekomsten i äldre skog/före avverkning (%).';
})

const matsvampMaxY = computed(() => selectedMatsvampVariant.value === 'kg' ? 55 : 28)

const selectedArtkategori = ref<string[]>([...defaultGrupperArtkategori]);

const compareArtkategoriOptions = [
  { label: 'Atheliales', value: 'atheliales' },
  { label: 'Boletales', value: 'boletales' },
  { label: 'Cantharellales', value: 'cantharellales' },
  { label: 'Spindlingar', value: 'spindlingar' },
  { label: 'Russulales', value: 'russulales' },
  { label: 'Thelephorales', value: 'thelephorales' },
  { label: 'Sporsäckssvampar', value: 'ascomycota' },
]

const selectedCompareArtkategori = ref(compareArtkategoriOptions[0].value)

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
