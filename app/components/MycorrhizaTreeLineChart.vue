<template>
  <figure class="w-full" aria-labelledby="mycorrhiza-tree-chart-title">
    <figcaption id="mycorrhiza-tree-chart-title" class="sr-only">
      Linjärt samband mellan mängden träd och mängden mykorrhiza
    </figcaption>

    <ClientOnly>
      <VisXYContainer
        :data="chartData"
        :height="300"
        :padding="{ top: 20, right: 24, bottom: 8, left: 8 }"
        :xDomain="[0, 100]"
        :yDomain="[0, 100]"
      >
        <VisLine
          :x="xAccessor"
          :y="yAccessor"
          :color="() => lineColor"
          :curveType="CurveType.Linear"
          :lineWidth="3"
        />
        <VisAxis
          type="x"
          label="Mängd träd"
          :tickValues="treeTickValues"
          :tickFormat="formatTreeAmount"
          tickTextFontSize="18px"
          :tickLine="false"
          :gridLine="false"
        />
        <VisAxis
          type="y"
          label="Mängd mykorrhiza"
          :tickValues="mushroomTickValues"
          :tickFormat="formatMycorrhizaAmount"
          tickTextFontSize="18px"
          :tickTextWidth="22"
          tickTextSeparator=" "
          :tickLine="false"
          :gridLine="false"
        />
      </VisXYContainer>
    </ClientOnly>
  </figure>
</template>

<script setup lang="ts">
import { CurveType } from '@unovis/ts'
import { VisAxis, VisLine, VisXYContainer } from '@unovis/vue'

type ChartDatum = {
  trees: number
  mycorrhiza: number
}

const lineColor = '#ef4444'
const treeTickValues = [5, 95]
const mushroomTickValues = [5, 95]

const chartData: ChartDatum[] = [
  { trees: 0, mycorrhiza: 0 },
  { trees: 100, mycorrhiza: 100 }
]

const xAccessor = (datum: ChartDatum) => datum.trees
const yAccessor = (datum: ChartDatum) => datum.mycorrhiza
const formatTreeAmount = (value: number | Date) => Number(value) < 50 ? '🌳' : '🌳🌳🌳'
const formatMycorrhizaAmount = (value: number | Date) => Number(value) < 50 ? '🍄' : '🍄 🍄 🍄'
</script>
