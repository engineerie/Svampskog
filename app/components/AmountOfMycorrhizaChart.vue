<template>
  <figure class="w-full" aria-labelledby="amount-of-mycorrhiza-title">
    <figcaption class="mb-4">
      <h2 id="amount-of-mycorrhiza-title" class="text-lg font-semibold text-neutral-900">
        Artrika släkten av mykorrhizasvampar
      </h2>
      <p class="mt-1 max-w-2xl text-sm text-neutral-600">
        Rutornas storlek visar hur många svenska arter som finns i respektive släkte.
      </p>
    </figcaption>

    <ClientOnly>
      <VisSingleContainer :data="chartData" :height="500">
        <VisTooltip :triggers="tooltipTriggers" :follow-cursor="true" />
        <VisTreemap
          :id="idAccessor"
          :value="valueAccessor"
          :layers="treemapLayers"
          :tile-color="tileColor"
          :tile-label="tileLabel"
          :tile-padding="3"
          :tile-border-radius="5"
          :label-offset-x="8"
          :label-offset-y="8"
          :label-internal-nodes="false"
          :enable-lightness-variance="false"
          :enable-tile-label-font-size-variation="true"
          :tile-show-html-tooltip="false"
        />
      </VisSingleContainer>
    </ClientOnly>
  </figure>
</template>

<script setup lang="ts">
import { Treemap, type TreemapNode } from '@unovis/ts'
import { VisSingleContainer, VisTooltip, VisTreemap } from '@unovis/vue'

type GenusDatum = {
  genus: string
  speciesCount: number
  swedishName: string
  note?: string
  color: string
}

const colors = [
  '#6d28d9', '#7640db', '#8051dc', '#8961dc', '#9270dc',
  '#9b7fdc', '#a48ddd', '#ad9bdd', '#b6a9dd', '#bfb7dd',
  '#8e51ff', '#9965f5', '#a478eb', '#af8be1', '#ba9ed7',
  '#c3a283', '#c9ad94', '#cfb8a5', '#d5c3b6', '#d1bba0'
]

const rawData = [
  ['Cortinarius', 487, 'Spindelskivlingar', ''],
  ['Inocybe', 192, 'Trådingar (trådskivlingar)', ''],
  ['Russula', 180, 'Kremlor', ''],
  ['Lactarius', 99, 'Riskor', ''],
  ['Tricholoma', 77, 'Musseroner', ''],
  ['Hebeloma', 64, 'Fränskivlingar', ''],
  ['Hygrophorus', 50, 'Skogsvaxskivlingar', ''],
  ['Amanita', 47, 'Flugsvampar', ''],
  ['Ramaria', 39, 'Fingersvampar', ''],
  ['Entoloma', 33, 'Rödskivlingar', ''],
  ['Tomentella', 29, 'Filtskinn', 'Skinnartad fruktkropp'],
  ['Hydnellum', 28, 'Korktaggsvampar', ''],
  ['Naucoria', 24, 'Skrälingar', ''],
  ['Leccinum', 20, 'Strävsoppar', ''],
  ['Otidea', 20, 'Haröron', ''],
  ['Suillus', 20, 'Slemsoppar', ''],
  ['Elaphomyces', 18, 'Hjorttryfflar', 'Tryffel'],
  ['Mallocybe', 16, 'Trådingar', ''],
  ['Polyozellus', 16, 'Tomentelloid svamp', 'Skinnartad fruktkropp'],
  ['Laccaria', 14, 'Laxskivlingar', '']
] as const

const chartData: GenusDatum[] = rawData.map(([genus, speciesCount, swedishName, note], index) => ({
  genus,
  speciesCount,
  swedishName,
  note: note || undefined,
  color: colors[index] ?? '#8e51ff'
}))

const treemapLayers = [(datum: GenusDatum) => datum.genus]
const idAccessor = (datum: GenusDatum) => datum.genus
const valueAccessor = (datum: GenusDatum) => datum.speciesCount

function tileColor(node: TreemapNode<GenusDatum>) {
  return node.data.datum?.color ?? '#d4d4d4'
}

function tileLabel(node: TreemapNode<GenusDatum>) {
  const datum = node.data.datum
  if (!datum) return ''
  return `${datum.swedishName}\n${datum.speciesCount} arter`
}

function tooltipContent(node: TreemapNode<GenusDatum>) {
  const datum = node.data.datum
  if (!datum) return null

  return `
    <div style="max-width: 270px">
      <div style="font-size: 14px; font-weight: 600">${datum.swedishName}</div>
      <div style="font-size: 12px; color: #737373; margin-top: 1px"><em>${datum.genus}</em></div>
      <div style="font-size: 12px; margin-top: 7px">${datum.speciesCount} arter</div>
      ${datum.note ? `<div style="font-size: 12px; color: #525252; margin-top: 4px">${datum.note}</div>` : ''}
    </div>
  `
}

const tooltipTriggers = {
  [Treemap.selectors.tile]: tooltipContent
}
</script>
