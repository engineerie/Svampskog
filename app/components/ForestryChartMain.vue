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
      <USelect v-if="selectedChart === 'grupper' && isFrameworkCompareMode" v-model="selectedCompareArtkategori"
        :items="compareArtkategoriOptions" size="sm" class="w-56"
        placeholder="Välj svampgrupp" />
      <!-- <UButton color="neutral" variant="subtle"
                            :icon="chartType === 'area' ? 'i-carbon-chart-column' : 'i-carbon-chart-line-smooth'"
                            @click="ToggleChartType" /> -->
    </div>

    <div>

      <div v-if="selectedChart === 'skogsskole'">
        <!-- <h1 class="text-3xl font-semibold leading-loose">Total mängd mykorrhizasvamp</h1> -->
        <!-- <div class="mt-2">
                      <UButton size="sm" @click="showDesc2 = !showDesc2">
                        {{ showDesc2 ? 'Dölj beskrivning' : 'Visa beskrivning' }}
                      </UButton>
                    </div> -->
        <p v-if="showDesc2" class="text-base/7 ">
          Vid trakthyggesbruk minskar mängden mykorrhizasvamp nästan till noll direkt efter avverkning. I takt med att
          träden växer upp etableras ett nytt svampsamhälle. När träden är mellan 40-70 år, är
          fotosyntesen som mest effektiv — vilket kan leda till att mängden mykorrhiza blir större än innan
          avverkningen. Överhållen skärm följer ett
          liknande mönster, men eftersom marken aldrig blir helt kal minskar svampmängden inte lika mycket. Blädning
          och luckhuggning innebär återkommande mindre ingrepp, där svampmängden sjunker något ungefär vart trettionde
          år men i övrigt hålls relativt stabil över tid.
        </p>
        <!-- <div class="controls w-full flex my-2">
                        <USelect class="min-w-32  " v-model="selectedFrameworks" :items="frameworkOptions" multiple
                            label="Select Frameworks" />
                        <USelect class="min-w-32" v-model="selectedArtkategori" :items="artkategoriOptions"
                            label="Select Artkategori" />
                        <USelect class="min-w-32" v-model="chartType" :items="chartTypeOptions" label="Chart Type" />
                        
                    </div> -->
        <ForestryChartDisplay
          :selectedFrameworks="props.parentSelectedFrameworks ?? ['naturskydd', 'trakthygge', 'luckhuggning', 'blädning', 'skärmträd']"
          :selectedArtkategori="['total']" :chartType="chartType" :maxYValue="130"
          :currentTimeValue="props.currentTimeValue" />

        <!-- <p class="text-sm text-neutral-500 my-1.5">
                             Vid trakthyggesbruk minskar mängden mykorrhizasvamp nästan till noll direkt efter avverkning. I takt med att
                        träden växer upp etableras ett nytt svampsamhälle. När träden är mellan 40-70 år, är
                        fotosyntesen som mest effektiv — vilket kan leda till att mängden mykorrhiza blir större än innan
                        avverkningen. Överhållen skärm följer ett
                        liknande mönster, men eftersom marken aldrig blir helt kal minskar svampmängden inte lika mycket. Blädning
                        och luckhuggning innebär återkommande mindre ingrepp, där svampmängden sjunker något ungefär vart trettionde
                        år men i övrigt hålls relativt stabil över tid.
                        </p> -->
      </div>
      <div v-if="selectedChart === 'rodlistade'">
        <!-- <h1 class="text-3xl leading-loose font-semibold">Rödlistade och signalarter</h1> -->
        <!-- <div class="mt-2">
                      <UButton size="sm" @click="showDesc3 = !showDesc3">
                        {{ showDesc3 ? 'Dölj beskrivning' : 'Visa beskrivning' }}
                      </UButton>
                    </div> -->
        <p v-if="showDesc3" class="text-base/7 ">
          Praesent elementum ut lacus a pharetra. Sed a malesuada mauris. Morbi et convallis libero. Aliquam
          vestibulum, felis eu fringilla elementum, nibh nunc tincidunt ex, quis vulputate nunc erat eu quam.
          Phasellus rutrum bibendum lacinia. Fusce aliquam aliquet lectus, eget gravida purus lobortis id. Curabitur
          viverra quam a risus sagittis maximus.
        </p>
        <!-- <div class="controls w-full flex my-2">
                        <USelect class="min-w-32" v-model="selectedStartskog3" :items="[
                            { label: 'Äldre skog som inte varit kalavverkad tidigare', value: 'naturskog' },
                            { label: 'Tidigare kalavverkad skog', value: 'produktionsskog_' }
                        ]" label="Välj startskog" />
                    </div> -->
        <ForestryChartDisplay
          :selectedFrameworks="props.parentSelectedFrameworks ?? ['naturskydd', 'trakthygge', 'luckhuggning', 'blädning', 'skärmträd']"
          :selectedArtkategori="['rödlistade + signalarter']" :chartType="chartType"
          :selectedStartskog="props.currentStartskog" :redColor="true" :maxYValue="0.65"
          :currentTimeValue="props.currentTimeValue" />
      </div>
      <div v-if="selectedChart === 'matsvampar'">
        <!-- <h1 class="text-3xl leading-loose font-semibold">Matsvampar</h1> -->
        <!-- <div class="mt-2">
                      <UButton size="sm" @click="showDesc4 = !showDesc4">
                        {{ showDesc4 ? 'Dölj beskrivning' : 'Visa beskrivning' }}
                      </UButton>
                    </div> -->
        <p v-if="showDesc4" class="text-base/7 ">
          Praesent elementum ut lacus a pharetra. Sed a malesuada mauris. Morbi et convallis libero. Aliquam
          vestibulum, felis eu fringilla elementum, nibh nunc tincidunt ex, quis vulputate nunc erat eu quam.
          Phasellus rutrum bibendum lacinia. Fusce aliquam aliquet lectus, eget gravida purus lobortis id. Curabitur
          viverra quam a risus sagittis maximus.
        </p>
        <!-- <div class="controls w-full flex my-2">
                        <USelect class="min-w-32" v-model="selectedStartskog2" :items="[
                            { label: 'Äldre skog som inte varit kalavverkad tidigare', value: 'naturskog' },
                            { label: 'Tidigare kalavverkad skog', value: 'produktionsskog_' }
                        ]" label="Välj startskog" />
                    </div> -->
        <ForestryChartDisplay
          :selectedFrameworks="props.parentSelectedFrameworks ?? ['naturskydd', 'trakthygge', 'luckhuggning', 'blädning', 'skärmträd']"
          :selectedArtkategori="['matsvamp']" :chartType="chartType" :selectedStartskog="props.currentStartskog"
          :yellowColor="true" :maxYValue="28" :currentTimeValue="props.currentTimeValue" />
      </div>
      <div v-if="selectedChart === 'grupper'">
        <!-- <h1 class="text-3xl leading-loose font-semibold">Olika svampgrupper</h1> -->
        <!-- <div class="mt-2">
                      <UButton size="sm" @click="showDesc5 = !showDesc5">
                        {{ showDesc5 ? 'Dölj beskrivning' : 'Visa beskrivning' }}
                      </UButton>
                    </div> -->
        <p v-if="showDesc5" class="text-base/7 ">
          Praesent elementum ut lacus a pharetra. Sed a malesuada mauris. Morbi et convallis
          libero. Aliquam vestibulum, felis eu fringilla elementum, nibh nunc tincidunt ex, quis vulputate nunc erat
          eu quam. Phasellus rutrum bibendum lacinia. Fusce aliquam aliquet lectus, eget gravida purus lobortis id.
          Curabitur viverra quam a risus sagittis maximus.
        </p>
        <!-- <div class="controls w-full flex my-2">
                        <USelect class="min-w-32" v-model="selectedStartskog" :items="[
                            { label: 'Äldre skog som inte varit kalavverkad tidigare', value: 'naturskog' },
                            { label: 'Tidigare kalavverkad skog', value: 'produktionsskog_' }
                        ]" label="Välj startskog" />
                        <USelect class="min-w-32" v-model="selectedSingleFramework" :items="frameworkOptions"
                            label="Välj skötselmetod" />
                    </div> -->
        <ForestryChartDisplay :selectedFrameworks="props.parentSelectedFrameworks ?? [selectedSingleFramework]"
          :selectedArtkategori="isFrameworkCompareMode ? [selectedCompareArtkategori] : selectedArtkategori"
          :frameworkComparisonMode="isFrameworkCompareMode"
          :chartType="chartType" :singleFrameworkSelection="true"
          :selectedStartskog="props.currentStartskog" :maxYValue="100" :currentTimeValue="props.currentTimeValue" />
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
}
const props = defineProps<Props>()

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
const selectedChart = ref(chartOptions[0].value)
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

// Options for frameworks
const frameworkOptions = [
  { label: 'Naturskydd', value: 'naturskydd' },
  { label: 'Blädning', value: 'blädning' },
  { label: 'Trakthygge', value: 'trakthygge' },
  { label: 'Skärmträd', value: 'skärmträd' },
  { label: 'Luckhuggning', value: 'luckhuggning' }
]

// Options for artkategorier
const artkategoriOptions = [
  { label: 'Skinnsvampar', value: 'skinnsvampar' },
  { label: 'Spindelskivlingar', value: 'spindelskivlingar' },
  { label: 'Kremlor och riskor', value: 'kremlor och riskor' },
  { label: 'Övriga svampar', value: 'övriga svampar' },
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

// Reactive selections:
// Default: all frameworks selected
const selectedFrameworks = ref(frameworkOptions.map(opt => opt.value))
// Default: first artkategori option selected
const selectedArtkategori = ref<string[]>([
  'skinnsvampar',
  'kremlor och riskor',
  'spindelskivlingar',
  'övriga svampar'
]);

const compareArtkategoriOptions = [
  { label: 'Skinnsvampar', value: 'skinnsvampar' },
  { label: 'Spindelskivlingar', value: 'spindelskivlingar' },
  { label: 'Kremlor och riskor', value: 'kremlor och riskor' },
  { label: 'Övriga svampar', value: 'övriga svampar' },
]

const selectedCompareArtkategori = ref(compareArtkategoriOptions[0].value)

watch([selectedChart, isFrameworkCompareMode], ([chart, compare]) => {
  if (!(chart === 'grupper' && compare)) {
    selectedCompareArtkategori.value = compareArtkategoriOptions[0].value
  }
})

watch(() => props.parentSelectedFrameworks?.length, () => {
  if (selectedChart.value === 'grupper' && isFrameworkCompareMode.value) {
    selectedCompareArtkategori.value = compareArtkategoriOptions[0].value
  }
})


// Color mapping for artkategorier
const artkategoriColorMapping: Record<string, string> = {
  "skinnsvampar": "#8B5CF6",
  "spindelskivlingar": "#EC4899",
  "kremlor och riskor": "#0EA5E9",
  "övriga svampar": "#14B8A6",
  "matsvamp": "#eab308",
  "rödlistade + signalarter": "#14B8A6",
  "total": "#808080"
}

// If exactly one framework is active (and we're not in singleFrameworkSelection),
// color that framework by selected artkategori: total / matsvamp / rödlistade + signalarter
// const legendOrder = ["naturskydd", "trakthygge", "skärmträd", "luckhuggning", "blädning"];

// const activeFrameworkKeys = computed(() => {
//   const selectedKeys = legendOrder.filter(key => props.selectedFrameworks.map(f => f.toLowerCase()).includes(key))
//   return selectedKeys.filter(key => !inactiveFrameworkKeys.value.has(key))
// })

// const singleFrameworkOverrideColor = computed<string | null>(() => {
//   if (props.singleFrameworkSelection) return null
//   if (activeFrameworkKeys.value.length !== 1) return null
//   const primaryCat = (props.selectedArtkategori?.[0] || '').toLowerCase()
//   if (primaryCat === 'total') return '#808080'
//   if (primaryCat === 'matsvamp') return '#eab308'
//   if (primaryCat === 'rödlistade + signalarter') return '#14B8A6'
//   return null
// })

// Tooltip formatting function
// const tooltipFormat = (d: any) => {
//     return `Time: ${chartX(d)} år, Value: ${chartLine2(d)}`
// }

</script>

<style scoped>
.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
</style>
