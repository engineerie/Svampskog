<template>
  <figure class="w-full" aria-labelledby="mycorrhizal-tree-baseline-title">
    <figcaption id="mycorrhizal-tree-baseline-title" class="sr-only">
      Sambandet mellan den relativa mängden träd och mykorrhiza över tid
    </figcaption>

    <label class="mb-4 block max-w-xs space-y-1.5">
      <span class="text-xs font-medium text-neutral-600">Skogsskötselmetod</span>
      <USelect
        v-model="selectedMethod"
        :items="methodOptions"
        value-key="value"
        label-key="label"
        class="w-full"
        variant="outline"
      />
    </label>

    <ClientOnly>
      <VisBulletLegend :items="legendItems" class="mb-4 flex justify-center gap-6" />

      <VisXYContainer
        :data="chartData"
        :height="380"
        :xDomain="[-7, 100]"
        :yDomain="[-150, 150]"
      >
        <VisArea
          :x="xAccessor"
          :y="treeAccessor"
          :baseline="baselineAccessor"
          :color="() => treeColor"
          :line="true"
          :lineColor="() => treeLineColor"
          :lineWidth="2"
          :curveType="CurveType.MonotoneX"
        />
        <VisArea
          :x="xAccessor"
          :y="mycorrhizaAccessor"
          :baseline="baselineAccessor"
          :color="() => mycorrhizaColor"
          :line="true"
          :lineColor="() => mycorrhizaLineColor"
          :lineWidth="2"
          :curveType="CurveType.MonotoneX"
        />

        <VisPlotline axis="y" :value="0" color="#737373" :lineWidth="1" :duration="0" />
        <VisPlotline
          v-for="intervention in interventions"
          :key="`${selectedMethod}-${intervention.year}`"
          axis="x"
          :value="intervention.year"
          color="#737373"
          :lineWidth="1"
          :lineStyle="[4, 4]"
          :labelText="intervention.label"
          labelPosition="top-right"
          labelOrientation="vertical"
          :labelOffsetX="8"
          :labelOffsetY="8"
          :labelSize="11"
        />

        <VisAxis
          type="x"
          label="År efter åtgärd"
          :tickValues="xTickValues"
          :tickFormat="formatYear"
          :gridLine="false"
        />
        <VisAxis
          type="y"
          label="Relativ mängd (%)"
          :tickValues="yTickValues"
          :tickFormat="formatMultiplier"
          :gridLine="false"
        />
      </VisXYContainer>
    </ClientOnly>

    <p class="mt-3 text-sm text-neutral-600">
      Diagrammet använder samma data för mängden mykorrhizasvamp som skogsskötselsidorna. Träd och mykorrhiza visas speglade för att illustrera det proportionella sambandet: när trädens relativa mängd förändras följer mykorrhizan med i motsvarande grad.
    </p>
  </figure>
</template>

<script setup lang="ts">
import { CurveType, type BulletLegendItemInterface } from '@unovis/ts'
import { VisArea, VisAxis, VisBulletLegend, VisPlotline, VisXYContainer } from '@unovis/vue'
import { computed, ref } from 'vue'

type RelationshipDatum = {
  year: number
  relativeAmount: number
}

type ForestryRow = {
  startskog?: string
  metod?: string
  'ålder'?: number | string
  'Mängd mykorrhiza'?: number | string
}

const treeColor = '#8DC812'
const treeLineColor = '#1F7718'
const mycorrhizaColor = '#F7E5B1'
const mycorrhizaLineColor = '#F5010A'

const legendItems: BulletLegendItemInterface[] = [
  { name: 'Träd', color: treeColor },
  { name: 'Mykorrhiza', color: mycorrhizaColor }
]

const methodOptions = [
  { label: 'Trakthyggesbruk', value: 'trakthygge' },
  { label: 'Blädning', value: 'blädning' },
  { label: 'Luckhuggning', value: 'luckhuggning' },
  { label: 'Överhållen skärm', value: 'skärm' },
  { label: 'Ingen åtgärd', value: 'ingen åtgärd' }
]

const selectedMethod = ref('trakthygge')
const selectedStartForest = 'produktionsskog_'

const { data: forestryData } = await useAsyncData('mycorrhizal-tree-baseline-data', () =>
  queryCollection('skogsbrukSvampar').first()
)

function toNumber(value: number | string | undefined) {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value.replace(',', '.'))
  return Number.NaN
}

const chartData = computed<RelationshipDatum[]>(() => {
  const rows = Array.isArray(forestryData.value?.entries)
    ? forestryData.value.entries as ForestryRow[]
    : []

  return rows
    .filter(row => row.startskog === selectedStartForest && row.metod === selectedMethod.value)
    .map(row => ({
      year: toNumber(row['ålder']),
      relativeAmount: toNumber(row['Mängd mykorrhiza'])
    }))
    .filter(row => Number.isFinite(row.year) && Number.isFinite(row.relativeAmount))
    .sort((a, b) => a.year - b.year)
})

function interventionLabel(method: string, year: number) {
  if (method === 'trakthygge') return 'Avverkning'
  if (method === 'blädning') return 'Avverkning'
  if (method === 'luckhuggning') return 'Avverkning'
  if (method === 'skärm' && year === 0) return 'Förberedande avverkning'
  if (method === 'skärm' && year === 10) return 'Utglesning av skärmen'
  if (method === 'skärm' && year === 20) return 'Avveckling av skärmen'
  return 'Åtgärd'
}

const interventions = computed(() => chartData.value.flatMap((row, index) => {
  const next = chartData.value[index + 1]
  if (!next) return []

  const isImmediateDrop = next.year > row.year
    && next.year - row.year <= 0.11
    && next.relativeAmount < row.relativeAmount

  return isImmediateDrop
    ? [{ year: row.year, label: interventionLabel(selectedMethod.value, row.year) }]
    : []
}))

const xTickValues = [-7, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
const yTickValues = [-150, -100, -50, 0, 50, 100, 150]

const xAccessor = (datum: RelationshipDatum) => datum.year
const treeAccessor = (datum: RelationshipDatum) => datum.relativeAmount
const mycorrhizaAccessor = (datum: RelationshipDatum) => -datum.relativeAmount
const baselineAccessor = () => 0
const formatMultiplier = (value: number | Date) => `${Math.abs(Number(value))} %`
const formatYear = (value: number | Date) => Number(value) < 0 ? 'Före' : String(Number(value))
</script>
