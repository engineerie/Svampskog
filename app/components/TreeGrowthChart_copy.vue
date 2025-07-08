<template>
    <div class="border border-neutral-200 rounded-md">

    <!-- Container for the left axis (% Mykorrhizasvamp) -->
    <VisXYContainer :data="treeGrowthData" :margin="margin" :autoMargin="false" width="100%" :height="200" 
        :xDomain="xDomain" >
        <template v-if="chartType === true">
            <VisLine :x="chartX" :y="chartLine1" :color="'#d4d4d4'" :lineWidth="3" />
        </template>
        <template v-if="chartType === false">
            <VisGroupedBar :x="chartX" :y="chartLine1" :color="'#d4d4d4'" :lineWidth="3" :barPadding="0.4" :gridLine="false" />
        </template>
        <VisAxis type="x" :numTicks="3" :tickFormat="xTicks" :gridLine="false" />
        <VisAxis type="y" :numTicks="2" :tickFormat="chartLine1Ticks" :tickTextWidth="60" :gridLine="false"  :tickTextColor="'#737373'"
            :labelColor="'#737373'"  />
    </VisXYContainer>

    <!-- Container for the right axis (Löpande trädtillväxt) -->
    <VisXYContainer :data="treeGrowthData" :yDomain="[0, 10]" :margin="margin" :autoMargin="false" :height="200"
        :style="containerStyle" :xDomain="xDomain">
        <template v-if="chartType === true">
            <VisLine :x="chartX" :y="chartLine2" :color="'#22c55e'" :lineWidth="3" />
        </template>
        <template v-if="chartType === false">
            <VisGroupedBar :x="chartX" :y="chartLine2" :color="'#22c55e'" :lineWidth="3" :barPadding="0.5" />
        </template>
        <VisAxis type="y" :numTicks="2"  position="right" :tickFormat="chartLine2Ticks" :gridLine="false" :tickTextColor="'#22c55e'"
            :labelColor="'#22c55e'" />
    </VisXYContainer>
        </div>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VisXYContainer, VisLine, VisAxis, VisArea, VisGroupedBar } from '@unovis/vue'

interface Props {
    chartType: boolean
}

const props = defineProps<Props>()

const margin = { left: 50, right: 40, top:20, bottom: 30 }
const containerStyle = { position: 'absolute', top: 0, left: 0, width: '100%', height: '40vh' }

// Define the static data.
const treeGrowthData = [
    { age: 1, line1: 2, line2: 0.5 },
    { age: 20, line1: 15, line2: 6 },
    { age: 50, line1: 23, line2: 9 },
    { age: 80, line1: 20, line2: 8 }
]

// Accessor for the x-axis.
const chartX = (d: any) => d.age
// Accessor for the left y-axis (% mykorrhizasvamp).
const chartLine1 = (d: any) => d.line1
// Accessor for the right y-axis (löpande trädtillväxt).
const chartLine2 = (d: any) => d.line2

// Tick format functions.
const xTicks = (x: number) => `${x} år`
const chartLine1Ticks = (y: number) => `${y}%`
const chartLine2Ticks = (y: number) => `${y}`

// Compute the xDomain based on the minimum and maximum 'age' in the data.
const xDomain = computed(() => {
    const ages = treeGrowthData.map(d => d.age)
    return [Math.min(...ages), Math.max(...ages)]
})
</script>

<style scoped>
/* Add any custom styles as needed */
</style>