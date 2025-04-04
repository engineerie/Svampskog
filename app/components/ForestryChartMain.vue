<template>
    <div>
        <UPageHeader headline="Skogsskötsel" title="Diagram" description="Utforska hur olika " />
        <div class="relative">
            <TreeGrowthChart :chartType="TreeChartLine" />
        </div>
        <!-- <UButton label="toggle chart type" @click="ToggleTreeChartType" /> -->
        <!-- <div class="controls">
            <USelect class="min-w-32  " v-model="selectedFrameworks" :items="frameworkOptions" multiple
                label="Select Frameworks" />
            <USelect class="min-w-32" v-model="selectedArtkategori" :items="artkategoriOptions"
                label="Select Artkategori" />
            <USelect class="min-w-32" v-model="chartType" :items="chartTypeOptions" label="Chart Type" />
        </div>
        <ForestryChartDisplay :selectedFrameworks="selectedFrameworks" :selectedArtkategori="selectedArtkategori"
            :chartType="chartType" /> -->
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const TreeChartLine = ref(true)

function ToggleTreeChartType() {
    TreeChartLine.value = !TreeChartLine.value;
}

// Options for frameworks
const frameworkOptions = [
    { label: 'Naturskydd', value: 'naturskydd' },
    { label: 'Blädning', value: 'blädning' },
    { label: 'Trakthygge', value: 'trakthygge' },
    { label: 'Skärmträd', value: 'skärmträd' },
    { label: 'Luckhuggning', value: 'luckhuggning' }
]

// Options for artkategorier
const artkategoriOptions = [
    { label: 'Skinnsvampar', value: 'skinnsvampar' },
    { label: 'Spindelskivlingar', value: 'spindelskivlingar' },
    { label: 'Kremlor och riskor', value: 'kremlor och riskor' },
    { label: 'Övriga svampar', value: 'övriga svampar' },
    { label: 'matsvamp', value: 'matsvamp' },
    { label: 'rödlistade + signalarter', value: 'rödlistade + signalarter' },
    { label: 'total', value: 'total' }
]

// Options for chart type
const chartTypeOptions = [
    { label: 'Line Chart', value: 'line' },
    { label: 'Bar Chart', value: 'bar' }
]

// Reactive selections:
// Default: all frameworks selected
const selectedFrameworks = ref(frameworkOptions.map(opt => opt.value))
// Default: first artkategori option selected
const selectedArtkategori = ref(artkategoriOptions[0]?.value || '')// Default chart type: line chart
const chartType = ref('line')
</script>

<style scoped>
.controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}
</style>