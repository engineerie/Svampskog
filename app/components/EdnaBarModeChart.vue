<template>
  <VisXYContainer :data="data" :width="width" :height="height">
    <VisPlotband
      v-if="plotBandRange"
      axis="x"
      :from="plotBandRange.from"
      :to="plotBandRange.to"
      color="rgba(234, 179, 8, 0.15)"
      :z-index="5"
    />
    <VisPlotband
      v-if="selectedPlotBandRange"
      axis="x"
      :from="selectedPlotBandRange.from"
      :to="selectedPlotBandRange.to"
      color="rgba(177, 131, 94, 0.28)"
      :z-index="6"
    />
    <VisStackedBar
      :data="data"
      :x="xAccessor"
      :y="yAccessor"
      :color="barColorAccessor"
      :bar-padding="0.1"
      :events="barEvents"
    />
    <VisAxis v-if="showYAxis" type="y" label="Antal skogar" :grid-line="false" />
    <VisTooltip v-if="showTooltip && hasData" :triggers="triggers" :follow-cursor="true" />
    <VisCrosshair v-if="showTooltip && hasData" :color="barColorAccessor" :template="tooltipTemplate" />
  </VisXYContainer>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { VisXYContainer, VisStackedBar, VisAxis, VisTooltip, VisCrosshair, VisPlotband } from '@unovis/vue'

defineProps({
  data: { type: Array as PropType<any[]>, default: () => [] },
  width: { type: [String, Number], default: 320 },
  height: { type: Number, default: 150 },
  plotBandRange: {
    type: Object as PropType<{ from: number, to: number } | null>,
    default: null
  },
  selectedPlotBandRange: {
    type: Object as PropType<{ from: number, to: number } | null>,
    default: null
  },
  xAccessor: { type: Function as PropType<(d: any, i: number) => any>, required: true },
  yAccessor: { type: Function as PropType<(d: any) => any>, required: true },
  barColorAccessor: { type: Function as PropType<(d: any) => string>, required: true },
  showYAxis: { type: Boolean, default: true },
  showTooltip: { type: Boolean, default: true },
  hasData: { type: Boolean, default: false },
  triggers: { type: Object as PropType<Record<string, any>>, required: true },
  tooltipTemplate: { type: Function as PropType<(d: any) => string>, required: true },
  barEvents: { type: Object as PropType<Record<string, any>>, required: true }
})
</script>
