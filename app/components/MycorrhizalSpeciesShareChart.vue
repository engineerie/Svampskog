<template>
  <figure class="w-full" aria-labelledby="mycorrhizal-species-share-title">
    <figcaption class="mb-4">
      <h2 id="mycorrhizal-species-share-title" class="text-lg font-semibold text-neutral-900">
        Andel svampar som bildar mykorrhiza
      </h2>
      <p class="mt-1 max-w-3xl text-sm text-neutral-600">
        Andel av de kända svamparterna i Sverige och de beskrivna svamparterna i världen.
      </p>
    </figcaption>

    <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap gap-4 text-sm text-neutral-700" aria-label="Färgförklaring">
        <div v-for="item in legend" :key="item.label" class="flex items-center gap-2">
          <span class="size-3 rounded-sm" :style="{ backgroundColor: item.color }" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </div>
      </div>

      <UTabs v-model="chartMode" :items="modeTabs" size="sm" :ui="{
        root: '',
        list: 'flex-nowrap gap-2 bg-transparent',
        indicator: 'bg-white border border-muted/50 shadow',
        trigger: 'data-[state=active]:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
      }" aria-label="Välj mellan antal och procent" />
    </div>

    <ClientOnly>
      <VisXYContainer :data="chartData" :height="230" :padding="{ top: 14, right: 20, bottom: 10, left: 8 }"
        :x-domain="xDomain" :y-domain="[-0.5, chartData.length - 0.5]" :y-direction="Direction.South">
        <VisTooltip :triggers="tooltipTriggers" :follow-cursor="true" />
        <VisStackedBar :x="rowAccessor" :y="valueAccessors" :color="colors" :orientation="Orientation.Horizontal"
          :bar-padding="0.58" :bar-max-width="32" :rounded-corners="3" />
        <VisXYLabels v-if="!showActualValues" :x="highlightLabelX" :y="rowAccessor" :label="mycorrhizalLabel"
          color="#8e51ff" background-color="#8e51ff" :label-font-size="11" :clustering="false" />
        <VisAxis type="x" :label="showActualValues ? 'Antal arter' : 'Andel av alla arter'" :tick-values="xTickValues"
          :tick-format="formatXAxis" :grid-line="true" :domain-line="false" />
        <VisAxis type="y" :tick-values="yTickValues" :tick-format="formatRegion" :grid-line="false"
          :domain-line="false" />
      </VisXYContainer>
    </ClientOnly>

    <dl class="mb-8 grid max-w-2xl gap-2 text-sm text-neutral-600 sm:grid-cols-2">
      <!-- <div v-for="datum in chartData" :key="datum.region">
        <dt class="font-medium text-neutral-800">{{ datum.region }}</dt>
        <dd>{{ formatCount(datum.mycorrhizal) }} av {{ formatCount(datum.total) }} arter</dd>
      </div> -->
    </dl>
  </figure>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Direction, Orientation, StackedBar } from '@unovis/ts'
import { VisAxis, VisStackedBar, VisTooltip, VisXYContainer, VisXYLabels } from '@unovis/vue'

type ShareDatum = {
  row: number
  region: string
  total: number
  mycorrhizal: number
  mycorrhizalShare: number
  otherShare: number
}

const chartData: ShareDatum[] = [
  {
    row: 0,
    region: 'Sverige',
    total: 15_000,
    mycorrhizal: 2_000,
    mycorrhizalShare: 2_000 / 15_000 * 100,
    otherShare: 13_000 / 15_000 * 100
  },
  {
    row: 1,
    region: 'Världen',
    total: 165_000,
    mycorrhizal: 20_000,
    mycorrhizalShare: 20_000 / 165_000 * 100,
    otherShare: 145_000 / 165_000 * 100
  }
]

const legend = [
  { label: 'Mykorrhizasvampar', color: '#8e51ff' },
  { label: 'Övriga svampar', color: '#e3e0dc' }
]

const colors = legend.map(item => item.color)
const modeTabs = [
  { label: 'Antal', value: 'count' },
  { label: 'Procent', value: 'percent' }
]
const chartMode = ref<'count' | 'percent'>('count')
const showActualValues = computed(() => chartMode.value === 'count')
const rowAccessor = (datum: ShareDatum) => datum.row
const shareAccessors = [
  (datum: ShareDatum) => datum.mycorrhizalShare,
  (datum: ShareDatum) => datum.otherShare
]
const countAccessors = [
  (datum: ShareDatum) => datum.mycorrhizal,
  (datum: ShareDatum) => datum.total - datum.mycorrhizal
]
const valueAccessors = computed(() => showActualValues.value ? countAccessors : shareAccessors)
const xDomain = computed<[number, number]>(() => showActualValues.value ? [0, 175_000] : [0, 100])
const xTickValues = computed(() => showActualValues.value
  ? [0, 50_000, 100_000, 150_000]
  : [0, 25, 50, 75, 100])
const highlightLabelX = (datum: ShareDatum) => showActualValues.value
  ? datum.mycorrhizal + 3_000
  : datum.mycorrhizalShare / 2
const mycorrhizalLabel = (datum: ShareDatum) => showActualValues.value
  ? formatCount(datum.mycorrhizal)
  : `${datum.mycorrhizalShare.toLocaleString('sv-SE', { maximumFractionDigits: 1 })} %`
const yTickValues = chartData.map(datum => datum.row)

function formatXAxis(value: number) {
  if (!showActualValues.value) return `${value} %`
  return value === 0 ? '0' : `${value / 1_000} 000`
}

function formatRegion(row: number) {
  const datum = chartData[row]
  if (!datum) return ''
  return `${datum.region === 'Sverige' ? '🇸🇪' : '🌍'} ${datum.region}`
}

function formatCount(value: number) {
  return value.toLocaleString('sv-SE')
}

function tooltipContent(datum: ShareDatum, index: number) {
  const isMycorrhizal = index % 2 === 0
  const count = isMycorrhizal ? datum.mycorrhizal : datum.total - datum.mycorrhizal
  const share = isMycorrhizal ? datum.mycorrhizalShare : datum.otherShare
  const label = isMycorrhizal ? 'Mykorrhizasvampar' : 'Övriga svampar'

  return `
    <div style="max-width: 260px">
      <div style="font-size: 14px; font-weight: 600">${datum.region}</div>
      <div style="font-size: 12px; color: #737373; margin-top: 3px">${label}</div>
      <div style="font-size: 13px; font-weight: 600; margin-top: 7px">
        ${formatCount(count)} arter (${share.toLocaleString('sv-SE', { maximumFractionDigits: 1 })} %)
      </div>
    </div>
  `
}

const tooltipTriggers = {
  [StackedBar.selectors.bar]: tooltipContent
}
</script>
