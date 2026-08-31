<template>
  <figure class="w-full" aria-labelledby="biomass-activity-chart-title"
    aria-describedby="biomass-activity-chart-description">
    <figcaption id="biomass-activity-chart-title" class="sr-only">
      Biomassa och aktivitet för träd och svamp i en skog
    </figcaption>

    <div class="mb-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-neutral-700">
      <div v-for="item in legendItems" :key="item.label" class="flex items-center gap-2">
        <span class="size-3 rounded-sm" :style="{ backgroundColor: item.color }" aria-hidden="true" />
        <span>{{ item.label }}</span>
      </div>
    </div>

    <ClientOnly>
      <VisXYContainer :data="chartData" :height="300" :padding="{ top: 8, right: 16, bottom: 8, left: 8 }"
        :xDomain="[-0.5, 1.5]" :yDomain="[0, 100]">
        <VisGroupedBar :x="xAccessor" :y="yAccessors" :color="colors" :groupPadding="0.25" />
        <VisAxis type="x" :tickValues="xTickValues" :tickFormat="formatXTick" :gridLine="false" :domainLine="false" />
        <VisAxis type="y" :tickValues="yTickValues" :tickFormat="formatPercent" :domainLine="false" />
      </VisXYContainer>
    </ClientOnly>

    <p id="biomass-activity-chart-description" class="mt-3 text-sm text-neutral-600">
      Diagrammet visar i ungefärligt drag hur stor andel av biomassan och energiomsättningen (aktiviteten) i en skog
      som träd och svampar svarar för.
    </p>
  </figure>
</template>

<script setup lang="ts">
import { VisAxis, VisGroupedBar, VisXYContainer } from '@unovis/vue'

type ChartDatum = {
  category: number
  biomassa: number
  aktivitet: number
}

const colors = ['#c3a283', '#8e51ff']

const legendItems = [
  { label: 'Biomassa', color: colors[0] },
  { label: 'Aktivitet', color: colors[1] }
]

const chartData: ChartDatum[] = [
  { category: 0, biomassa: 95, aktivitet: 50 },
  { category: 1, biomassa: 1, aktivitet: 20 }
]

const categoryLabels = ['Träd', 'Svamp']
const xTickValues = [0, 1]
const yTickValues = [0, 20, 40, 60, 80, 100]

const xAccessor = (datum: ChartDatum) => datum.category
const yAccessors = [
  (datum: ChartDatum) => datum.biomassa,
  (datum: ChartDatum) => datum.aktivitet
]

const formatXTick = (value: number | Date) => categoryLabels[Number(value)] ?? ''
const formatPercent = (value: number | Date) => `${Number(value)} %`
</script>
