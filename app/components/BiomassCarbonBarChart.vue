<template>
  <figure class="w-full" aria-labelledby="biomass-carbon-donut-title">
    <figcaption id="biomass-carbon-donut-title" class="mb-3 text-sm font-medium text-neutral-700">
      Biomassa per organismgrupp (Gt C)
    </figcaption>

    <div class="flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-10">
      <div class="w-full max-w-80" :style="donutLabelColors">
        <ClientOnly>
          <VisSingleContainer :data="chartData" :height="320">
            <VisDonut
              :value="valueAccessor"
              :color="colorAccessor"
              :radius="128"
              :arc-width="54"
              :pad-angle="0.015"
              :corner-radius="3"
              :central-label="formatValue(totalBiomass)"
              central-sub-label="Gt C totalt"
            />
          </VisSingleContainer>
        </ClientOnly>

      </div>

      <div class="grid w-full max-w-sm gap-3 text-sm text-neutral-700">
        <div v-for="item in chartData" :key="item.name" class="flex items-center gap-3">
          <span class="size-3 shrink-0 rounded-sm" :style="{ backgroundColor: item.color }" aria-hidden="true" />
          <span class="min-w-0 flex-1">{{ item.name }}</span>
          <strong class="tabular-nums text-neutral-900">{{ formatValue(item.value) }} Gt C</strong>
        </div>
      </div>
    </div>
  </figure>
</template>

<script setup lang="ts">
import { VisDonut, VisSingleContainer } from '@unovis/vue'

type BiomassDatum = {
  name: string
  value: number
  color: string
}

const chartData: BiomassDatum[] = [
  { name: 'Virus', value: 0.06, color: '#38bdf8' },
  { name: 'Arkéer', value: 1, color: '#f59e0b' },
  { name: 'Djur', value: 2, color: '#ef4444' },
  { name: 'Protister', value: 4, color: '#ec4899' },
  { name: 'Bakterier', value: 9, color: '#14b8a6' },
  { name: 'Svampar', value: 12, color: '#8e51ff' },
  {
    name: 'Växter (exklusive ved)',
    value: 150,
    color: '#65a30d'
  }
]

const valueAccessor = (datum: BiomassDatum) => datum.value
const colorAccessor = (datum: BiomassDatum) => datum.color
const formatValue = (value: number) => value.toLocaleString('sv-SE', { maximumFractionDigits: 2 })
const totalBiomass = chartData.reduce((sum, datum) => sum + datum.value, 0)

const donutLabelColors = {
  '--vis-donut-central-label-text-color': '#171717',
  '--vis-donut-central-sub-label-text-color': '#737373'
}
</script>
