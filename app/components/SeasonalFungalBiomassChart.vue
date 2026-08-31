<template>
  <figure class="w-full" aria-labelledby="seasonal-fungal-biomass-title">
    <figcaption id="seasonal-fungal-biomass-title" class="sr-only">
      Mycelets och fruktkropparnas biomassa under en femårsperiod
    </figcaption>

    <div class="mb-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-neutral-700">
      <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
        <div v-for="item in legendItems" :key="item.label" class="flex items-center gap-2">
          <span class="size-3 rounded-sm" :style="{ backgroundColor: item.color }" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-2" aria-label="Årstider">
        <div v-for="season in seasonLegendItems" :key="season.label"
          class="flex items-center gap-1.5 rounded-md px-2 py-1" :style="{ backgroundColor: season.color }">
          <span aria-hidden="true">{{ season.icon }}</span>
          <span>{{ season.label }}</span>
        </div>
      </div>
    </div>

    <ClientOnly>
      <VisXYContainer :data="chartData" :height="320" :xDomain="[0, displayedYearCount]" :yDomain="[0, 240]">
        <VisPlotband v-for="band in seasonBands" :key="band.key" axis="x" :from="band.from" :to="band.to"
          :color="band.color" :duration="0" :labelText="band.icon" labelPosition="top-inside" :labelOffsetY="8"
          :labelSize="14" />
        <VisArea :x="xAccessor" :y="yAccessors" :color="colors" curveType="basis" />
        <VisAxis type="x" label="Tid (år)" :tickValues="xTickValues" :tickFormat="hideTickLabel" :tickLine="false"
          :gridLine="true" />
        <VisAxis type="y" label="Biomassa" :tickValues="yTickValues" :tickFormat="hideTickLabel" :gridLine="false" />
      </VisXYContainer>
    </ClientOnly>

    <p class="mt-3 text-sm text-neutral-600">
      Diagrammet illustrerar hur mycelets biomassa i skogsmarken är relativt konstant under ett år och mellan år, medan
      fruktkropparna uppträder som korta sensommar-höst-toppar som varierar mellan åren. Sett över tid utgör mycelet
      omkring 95 procent och fruktkropparna omkring 5 procent av den samlade biomassan.
    </p>
  </figure>
</template>

<script setup lang="ts">
import { VisArea, VisAxis, VisPlotband, VisXYContainer } from '@unovis/vue'

type BiomassDatum = {
  time: number
  mycelium: number
  fruitingBodies: number
}

const colors = ['rgba(209, 187, 160, 0.6)', '#f59e0b']
const legendItems = [
  { label: 'Mycel', color: colors[0] },
  { label: 'Fruktkroppar', color: colors[1] }
]

const seasonLegendItems = [
  { label: 'Vinter', icon: '❄️', color: 'rgba(96, 165, 250, 0.10)' },
  { label: 'Vår', icon: '🌱', color: 'rgba(34, 197, 94, 0.09)' },
  { label: 'Sommar', icon: '☀️', color: 'rgba(250, 204, 21, 0.11)' },
  { label: 'Höst', icon: '🍂', color: 'rgba(249, 115, 22, 0.10)' }
]

const seasonRanges = [
  { season: 'Vinter', from: 0, to: 2 / 12 },
  { season: 'Vår', from: 2 / 12, to: 5 / 12 },
  { season: 'Sommar', from: 5 / 12, to: 8 / 12 },
  { season: 'Höst', from: 8 / 12, to: 11 / 12 },
  { season: 'Vinter', from: 11 / 12, to: 1, hideIcon: true }
]

const seasonBands = Array.from({ length: 10 }, (_, year) => seasonRanges.map((range, index) => {
  const season = seasonLegendItems.find(item => item.label === range.season)!
  return {
    key: `${year}-${range.season}-${index}`,
    from: year + range.from,
    to: year + range.to,
    color: season.color,
    icon: range.hideIcon ? undefined : season.icon
  }
})).flat()

const myceliumBiomass = 95
const displayedYearCount = 5
const fruitingSpikeStart = 0.60
const fruitingSpikePeak = 0.68
const fruitingSpikeEnd = 0.76
const fruitingCurveAnchorGap = 0.04

// Annual fruiting-body shares vary between 1% and 10%, with an
// arithmetic mean of exactly 5% across the ten-year period.
const annualFruitingShares = [4, 6, 2, 8, 1, 5, 10, 3, 7, 4]
const spikeDuration = fruitingSpikeEnd - fruitingSpikeStart

const chartData: BiomassDatum[] = annualFruitingShares.flatMap((share, year) => {
  // Solve F / (95 + F) = share / 100, then convert the desired
  // annual fruiting area F to the height of the seasonal triangle.
  const fruitingArea = (myceliumBiomass * share) / (100 - share)
  const spikeHeight = (2 * fruitingArea) / spikeDuration

  return [
    { time: year, mycelium: myceliumBiomass, fruitingBodies: 0 },
    {
      time: year + fruitingSpikeStart - fruitingCurveAnchorGap,
      mycelium: myceliumBiomass,
      fruitingBodies: 0
    },
    { time: year + fruitingSpikeStart, mycelium: myceliumBiomass, fruitingBodies: 0 },
    { time: year + fruitingSpikePeak, mycelium: myceliumBiomass, fruitingBodies: spikeHeight },
    { time: year + fruitingSpikeEnd, mycelium: myceliumBiomass, fruitingBodies: 0 },
    {
      time: year + fruitingSpikeEnd + fruitingCurveAnchorGap,
      mycelium: myceliumBiomass,
      fruitingBodies: 0
    }
  ]
})

chartData.push({ time: 10, mycelium: myceliumBiomass, fruitingBodies: 0 })

const xTickValues = Array.from({ length: displayedYearCount + 1 }, (_, year) => year)
const yTickValues = [0, 50, 100, 150, 200]

const xAccessor = (datum: BiomassDatum) => datum.time
const yAccessors = [
  (datum: BiomassDatum) => datum.mycelium,
  (datum: BiomassDatum) => datum.fruitingBodies
]

const hideTickLabel = () => ''
</script>
