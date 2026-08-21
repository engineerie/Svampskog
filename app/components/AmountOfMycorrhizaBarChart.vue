<template>
  <figure class="w-full" aria-labelledby="amount-of-mycorrhiza-bar-title">
    <figcaption class="mb-4">
      <h2 id="amount-of-mycorrhiza-bar-title" class="text-lg font-semibold text-neutral-900">
        Artrika släkten av mykorrhizasvampar i Sverige
      </h2>
      <!-- <p class="mt-1 max-w-2xl text-sm text-neutral-600">
        Staplarnas längd visar hur många svenska arter som finns i respektive släkte.
      </p> -->
    </figcaption>

    <ClientOnly>
      <VisXYContainer :data="chartData" :height="720" :padding="{ top: 8, right: 24, bottom: 8, left: 8 }"
        :x-domain="[0, 520]" :y-domain="[-0.5, chartData.length - 0.5]" :y-direction="Direction.South">
        <VisTooltip :triggers="tooltipTriggers" :follow-cursor="true" />
        <VisGroupedBar :x="rowAccessor" :y="countAccessor" :color="barColor" :orientation="Orientation.Horizontal"
          :group-padding="0.22" :group-max-width="24" :rounded-corners="4" />
        <VisXYLabels :x="countLabelX" :y="rowAccessor" :label="countLabel" color="#525252"
          background-color="transparent" :label-font-size="11" :clustering="false" />
        <VisAxis type="x" label="Antal arter" :tick-values="xTickValues" :grid-line="true" :domain-line="false" />
        <VisAxis type="y" :tick-values="yTickValues" :tick-format="formatGenus" :grid-line="false"
          :domain-line="false" />
      </VisXYContainer>
    </ClientOnly>
  </figure>
</template>

<script setup lang="ts">
import { Direction, GroupedBar, Orientation } from '@unovis/ts'
import { VisAxis, VisGroupedBar, VisTooltip, VisXYContainer, VisXYLabels } from '@unovis/vue'

type GenusDatum = {
  row: number
  genus: string
  speciesCount: number
  swedishName: string
  note?: string
}

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

const chartData: GenusDatum[] = rawData.map(([genus, speciesCount, swedishName, note], row) => ({
  row,
  genus,
  speciesCount,
  swedishName,
  note: note || undefined
}))

const xTickValues = [0, 100, 200, 300, 400, 500]
const yTickValues = chartData.map(datum => datum.row)
const rowAccessor = (datum: GenusDatum) => datum.row
const countAccessor = (datum: GenusDatum) => datum.speciesCount
const countLabelX = (datum: GenusDatum) => datum.speciesCount + 10
const countLabel = (datum: GenusDatum) => datum.speciesCount.toLocaleString('sv-SE')
const barColor = '#8e51ff'

function formatGenus(row: number) {
  return chartData[row]?.swedishName ?? ''
}

function tooltipContent(datum: GenusDatum) {
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
  [GroupedBar.selectors.bar]: tooltipContent
}
</script>
