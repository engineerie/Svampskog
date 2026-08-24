<template>
  <figure class="w-full" aria-labelledby="amount-of-mycorrhiza-bar-title">
    <!-- <figcaption class="mb-4">
      <h2 id="amount-of-mycorrhiza-bar-title" class="text-lg font-semibold text-neutral-900">
        Artrika grupper av mykorrhizasvampar i Sverige
      </h2>
      <p class="mt-1 max-w-2xl text-sm text-neutral-600">
        Staplarnas längd visar hur många svenska arter som finns i respektive släkte.
      </p>
    </figcaption> -->

    <ClientOnly>
      <VisXYContainer :data="chartData" :height="520" :padding="{ top: 8, right: 24, bottom: 8, left: 8 }"
        :x-domain="[0, 520]" :y-domain="[-0.5, chartData.length - 0.5]" :y-direction="Direction.South">
        <VisTooltip :triggers="tooltipTriggers" :follow-cursor="true" />
        <VisGroupedBar :x="rowAccessor" :y="countAccessor" :color="barColor" :orientation="Orientation.Horizontal"
          :group-padding="0.22" :group-max-width="24" :rounded-corners="4" />
        <VisXYLabels :x="countLabelX" :y="rowAccessor" :label="countLabel" color="#525252"
          background-color="transparent" :label-font-size="11" :clustering="false" />
        <VisAxis type="x" label="Antal arter" :tick-values="xTickValues" :grid-line="true" :domain-line="false" />
        <VisAxis type="y" :tick-values="yTickValues" :tick-format="formatFungusGroup" :grid-line="false"
          :domain-line="false" />
      </VisXYContainer>
    </ClientOnly>
  </figure>
</template>

<script setup lang="ts">
import { Direction, GroupedBar, Orientation } from '@unovis/ts'
import { VisAxis, VisGroupedBar, VisTooltip, VisXYContainer, VisXYLabels } from '@unovis/vue'

type FungusGroupDatum = {
  row: number
  scientificNames: string
  speciesCount: number
  fungusGroup: string
  includesOthers?: boolean
}

const rawData = [
  ['Spindelskivlingar', 'Cortinarius', 500, false],
  ['Soppar', 'Leccinum, Suillus, Boletus', 250, true],
  ['Trådskivlingar', 'Inocybe', 200, false],
  ['Kremlor', 'Russula', 150, false],
  ['Riskor', 'Lactarius', 100, false],
  ['Tryfflar', 'Elaphomyces, Tuber, Hymenogaster', 100, true],
  ['Skinnsvampar', 'Piloderma, Polyzellus, Thelephora', 75, true],
  ['Musseroner', 'Tricholoma', 60, false],
  ['Taggsvampar', 'Hydnellum, Phellodon, Hydnum', 50, true],
  ['Fränskivlingar', 'Hebeloma', 40, false],
  ['Skogsvaxingar', 'Hygrophorus', 40, false],
  ['Flugsvampar', 'Amanita', 30, false],
  ['Kantareller och trumpetsvampar', 'Chantarellus och Craterellus', 15, false]
] as const

const chartData: FungusGroupDatum[] = rawData.map(([fungusGroup, scientificNames, speciesCount, includesOthers], row) => ({
  row,
  scientificNames,
  speciesCount,
  fungusGroup,
  includesOthers
}))

const xTickValues = [0, 100, 200, 300, 400, 500]
const yTickValues = chartData.map(datum => datum.row)
const rowAccessor = (datum: FungusGroupDatum) => datum.row
const countAccessor = (datum: FungusGroupDatum) => datum.speciesCount
const countLabelX = (datum: FungusGroupDatum) => datum.speciesCount + 10
const countLabel = (datum: FungusGroupDatum) => datum.speciesCount.toLocaleString('sv-SE')
const barColor = '#8e51ff'

function formatFungusGroup(row: number) {
  return chartData[row]?.fungusGroup ?? ''
}

function tooltipContent(datum: FungusGroupDatum) {
  return `
    <div style="max-width: 270px">
      <div style="font-size: 14px; font-weight: 600">${datum.fungusGroup}</div>
      <div style="font-size: 12px; color: #737373; margin-top: 1px"><em>${datum.scientificNames}</em>${datum.includesOthers ? ' m fl' : ''}</div>
      <div style="font-size: 12px; margin-top: 7px">${datum.speciesCount} arter</div>
    </div>
  `
}

const tooltipTriggers = {
  [GroupedBar.selectors.bar]: tooltipContent
}
</script>
