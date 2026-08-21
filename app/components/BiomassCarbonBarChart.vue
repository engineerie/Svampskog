<template>
  <figure class="w-full" aria-labelledby="biomass-carbon-treemap-title">
    <figcaption id="biomass-carbon-treemap-title" class="mb-3 text-sm font-medium text-neutral-700">
      Biomassa per organismgrupp (Gt C)
    </figcaption>

    <div class="mb-6 flex flex-wrap gap-x-8 gap-y-3 text-xs text-neutral-600">
      <div v-for="item in chartData" :key="item.name" class="mr-2 flex items-center gap-2 last:mr-0">
        <span class="size-2.5 shrink-0 rounded-sm" :style="{ backgroundColor: item.color }" aria-hidden="true" />
        <span>{{ item.name }}: {{ formatValue(item.value) }} Gt C</span>
      </div>
    </div>

    <ClientOnly>
      <VisSingleContainer :data="chartData" :height="360">
        <VisTreemap
          :id="idAccessor"
          :value="valueAccessor"
          :layers="treemapLayers"
          :tileColor="tileColor"
          :tileLabel="tileLabel"
          :tilePadding="3"
          :tileBorderRadius="4"
          :labelOffsetX="8"
          :labelOffsetY="8"
          :enableLightnessVariance="false"
          :enableTileLabelFontSizeVariation="true"
          :tileShowHtmlTooltip="true"
        />
      </VisSingleContainer>
    </ClientOnly>
  </figure>
</template>

<script setup lang="ts">
import type { TreemapNode } from '@unovis/ts'
import { VisSingleContainer, VisTreemap } from '@unovis/vue'

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

const treemapLayers = [(datum: BiomassDatum) => datum.name]
const idAccessor = (datum: BiomassDatum) => datum.name
const valueAccessor = (datum: BiomassDatum) => datum.value
const formatValue = (value: number) => value.toLocaleString('sv-SE', { maximumFractionDigits: 2 })

const tileColor = (node: TreemapNode<BiomassDatum>) => node.data.datum?.color ?? '#94a3b8'
const tileLabel = (node: TreemapNode<BiomassDatum>) => {
  const datum = node.data.datum
  return datum ? `${datum.name}\n${formatValue(datum.value)} Gt C` : ''
}
</script>
