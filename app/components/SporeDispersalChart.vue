<template>
  <figure class="w-full" aria-labelledby="spore-dispersal-chart-title">
    <figcaption id="spore-dispersal-chart-title" class="sr-only">
      Fördelningen av sporer över avstånd från fruktkroppen
    </figcaption>

    <ClientOnly>
      <VisXYContainer :data="chartData" :height="300" :xDomain="[0, 100]" :yDomain="[0, 30]">
        <VisArea :x="xAccessor" :y="yAccessor" :color="() => areaColor" :curveType="CurveType.MonotoneX" :opacity="0.65"
          :line="true" :lineColor="() => lineColor" :lineWidth="1.5" />
        <VisAxis type="x" label="📏 Avstånd från fruktkroppen" :tickValues="xTickValues" :tickFormat="formatDistance"
          :gridLine="false" />
        <VisAxis type="y" label="💨 Mängd sporer" :tickValues="noTicks" :tickLine="false" :gridLine="false" />
      </VisXYContainer>
    </ClientOnly>
  </figure>
</template>

<script setup lang="ts">
import { CurveType } from '@unovis/ts'
import { VisArea, VisAxis, VisXYContainer } from '@unovis/vue'

type ChartDatum = {
  distance: number
  spores: number
}

const lineColor = '#8e51ff'
const areaColor = '#cbb1ff'

// Exponential density where the integral from 0–10 m is 95% of the
// integral from 0–1000 m. The complete area therefore represents 100%.
const decayRate = -Math.log(0.05) / 10
const normalization = 1 - Math.exp(-decayRate * 1000)
const chartData: ChartDatum[] = Array.from({ length: 1001 }, (_, distance) => ({
  distance,
  spores: (100 * decayRate * Math.exp(-decayRate * distance)) / normalization
}))

const xTickValues = [0, 50, 100]
const noTicks: number[] = []

const xAccessor = (datum: ChartDatum) => datum.distance
const yAccessor = (datum: ChartDatum) => datum.spores
const formatDistance = (value: number | Date) => Number(value) === 1000 ? '1 km' : `${Number(value)} m`
</script>
