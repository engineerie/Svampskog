<template>
    <div>
        <UPageHeader headline="Skogsskötsel" title="Svampdata"
            description="Utforska data för svampgrupper vid olika skogsåldrar och skogsbrukssätt." />
        <h1 class="text-2xl font-bold mt-10">Samband mellan mykorrhizasvamp och träd</h1>
        <p class="text-base/7 ">Mykorrhizasvampar lever i symbios med träd och är helt beroende av socker som
            transporteras från trädens
            rötter. Diagrammet visar hur mängden mykorrhizasvamp i marken följer mängden socker som träden producerar,
            vilket i sin tur styrs av trädtillväxten.</p>
        <div class="w-full flex justify-end mt-2">
            <UButton color="neutral" variant="subtle"
                :icon="TreeChartLine ? 'i-carbon-chart-column' : 'i-carbon-chart-line-smooth'"
                @click="ToggleTreeChartType" />
        </div>
        <div class="relative mt-10 mb-28">
            <TreeGrowthChart :chartType="TreeChartLine" />
        </div>
        <h1 class="text-2xl font-bold mt-10">Mängd mykorrhizasvamp vid olika skogsskötsel</h1>
        <p class="text-base/7 ">
            Vid trakthyggesbruk minskar mängden mykorrhizasvamp nästan till noll direkt efter avverkning. I takt med att
            träden växer upp etableras ett nytt svampsamhälle. När träden är mellan 40-70 år, är
            fotosyntesen som mest effektiv — vilket kan leda till att mängden mykorrhiza blir större än innan
            avverkningen. Överhållen skärm följer ett
            liknande mönster, men eftersom marken aldrig blir helt kal minskar svampmängden inte lika mycket. Blädning
            och luckhuggning innebär återkommande mindre ingrepp, där svampmängden sjunker något ungefär vart trettionde
            år men i övrigt hålls relativt stabil över tid.
        </p>
        <div class="controls w-full flex justify-end">
            <!-- <USelect class="min-w-32  " v-model="selectedFrameworks" :items="frameworkOptions" multiple
                label="Select Frameworks" /> -->
            <!-- <USelect class="min-w-32" v-model="selectedArtkategori" :items="artkategoriOptions"
                label="Select Artkategori" /> -->
            <!-- <USelect class="min-w-32" v-model="chartType" :items="chartTypeOptions" label="Chart Type" /> -->
            <!-- <UButton color="neutral" variant="subtle"
                :icon="chartType === 'line' ? 'i-carbon-chart-column' : 'i-carbon-chart-line-smooth'"
                @click="ToggleChartType" /> -->
        </div>
        <ForestryChartDisplay
            :selectedFrameworks="['naturskydd', 'trakthygge', 'luckhuggning', 'blädning', 'skärmträd']"
            :selectedArtkategori="['total']" :chartType="chartType" :maxYValue="130" class=" mb-28" />
        <h1 class="text-2xl font-bold mt-10">Rödlistade och signalarter</h1>
        <p class="text-base/7 ">
            Praesent elementum ut lacus a pharetra. Sed a malesuada mauris. Morbi et convallis libero. Aliquam
            vestibulum, felis eu fringilla elementum, nibh nunc tincidunt ex, quis vulputate nunc erat eu quam.
            Phasellus rutrum bibendum lacinia. Fusce aliquam aliquet lectus, eget gravida purus lobortis id. Curabitur
            viverra quam a risus sagittis maximus.


        </p>
        <div class="controls w-full flex justify-end">
            <!-- <USelect class="min-w-32  " v-model="selectedFrameworks" :items="frameworkOptions" multiple
                label="Select Frameworks" /> -->
            <!-- <USelect class="min-w-32" v-model="selectedArtkategori" :items="artkategoriOptions"
                label="Select Artkategori" /> -->
            <!-- <USelect class="min-w-32" v-model="chartType" :items="chartTypeOptions" label="Chart Type" /> -->
            <USelect class="min-w-32" v-model="selectedStartskog3" :items="[
                { label: 'Äldre skog som inte varit kalavverkad tidigare', value: 'naturskog' },
                { label: 'Tidigare kalavverkad skog', value: 'produktionsskog_' }
            ]" label="Välj startskog" />
            <!-- <UButton color="neutral" variant="subtle"
                :icon="chartType === 'line' ? 'i-carbon-chart-column' : 'i-carbon-chart-line-smooth'"
                @click="ToggleChartType" /> -->
        </div>
        <ForestryChartDisplay
            :selectedFrameworks="['naturskydd', 'trakthygge', 'luckhuggning', 'blädning', 'skärmträd']"
            :selectedArtkategori="['rödlistade + signalarter']" :chartType="chartType"
            :selectedStartskog="selectedStartskog3" :redColor="true" :maxYValue="0.65" class=" mb-28" />
        <h1 class="text-2xl font-bold mt-10">Matsvampar</h1>
        <p class="text-base/7 ">
            Praesent elementum ut lacus a pharetra. Sed a malesuada mauris. Morbi et convallis libero. Aliquam
            vestibulum, felis eu fringilla elementum, nibh nunc tincidunt ex, quis vulputate nunc erat eu quam.
            Phasellus rutrum bibendum lacinia. Fusce aliquam aliquet lectus, eget gravida purus lobortis id. Curabitur
            viverra quam a risus sagittis maximus.


        </p>
        <div class="controls w-full flex justify-end">
            <!-- <USelect class="min-w-32  " v-model="selectedFrameworks" :items="frameworkOptions" multiple
                label="Select Frameworks" /> -->
            <!-- <USelect class="min-w-32" v-model="selectedArtkategori" :items="artkategoriOptions"
                label="Select Artkategori" /> -->
            <!-- <USelect class="min-w-32" v-model="chartType" :items="chartTypeOptions" label="Chart Type" /> -->
            <USelect class="min-w-32" v-model="selectedStartskog2" :items="[
                { label: 'Äldre skog som inte varit kalavverkad tidigare', value: 'naturskog' },
                { label: 'Tidigare kalavverkad skog', value: 'produktionsskog_' }
            ]" label="Välj startskog" />
            <!-- <UButton color="neutral" variant="subtle"
                :icon="chartType === 'line' ? 'i-carbon-chart-column' : 'i-carbon-chart-line-smooth'"
                @click="ToggleChartType" /> -->
        </div>
        <ForestryChartDisplay
            :selectedFrameworks="['naturskydd', 'trakthygge', 'luckhuggning', 'blädning', 'skärmträd']"
            :selectedArtkategori="['matsvamp']" :chartType="chartType" :selectedStartskog="selectedStartskog2"
            :yellowColor="true" :maxYValue="28" class=" mb-28" />
        <h1 class="text-2xl font-bold mt-10">Olika svampgrupper</h1>
        <p class="text-base/7 ">Praesent elementum ut lacus a pharetra. Sed a malesuada mauris. Morbi et convallis
            libero. Aliquam vestibulum, felis eu fringilla elementum, nibh nunc tincidunt ex, quis vulputate nunc erat
            eu quam. Phasellus rutrum bibendum lacinia. Fusce aliquam aliquet lectus, eget gravida purus lobortis id.
            Curabitur viverra quam a risus sagittis maximus.

        </p>
        <div class="controls w-full flex justify-end">
            <!-- <USelect class="min-w-32  " v-model="selectedFrameworks" :items="frameworkOptions" multiple
                label="Select Frameworks" /> -->
            <!-- <USelect class="min-w-32" v-model="selectedArtkategori" :items="artkategoriOptions"
                label="Select Artkategori" multiple /> -->
            <USelect class="min-w-32" v-model="selectedStartskog" :items="[
                { label: 'Äldre skog som inte varit kalavverkad tidigare', value: 'naturskog' },
                { label: 'Tidigare kalavverkad skog', value: 'produktionsskog_' }
            ]" label="Välj startskog" />
            <USelect class="min-w-32" v-model="selectedSingleFramework" :items="frameworkOptions"
                label="Välj skötselmetod" />
            <!-- <USelect class="min-w-32" v-model="chartType" :items="chartTypeOptions" label="Chart Type" /> -->
            <!-- <UButton color="neutral" variant="subtle"
                :icon="chartType === 'line' ? 'i-carbon-chart-column' : 'i-carbon-chart-line-smooth'"
                @click="ToggleChartType2" /> -->
        </div>
        <ForestryChartDisplay :selectedFrameworks="[selectedSingleFramework]" :selectedArtkategori="selectedArtkategori"
            :chartType="chartType" :singleFrameworkSelection="true" :selectedStartskog="selectedStartskog"
            :maxYValue="45" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedStartskog = ref('naturskog');
const selectedStartskog2 = ref('naturskog');
const selectedStartskog3 = ref('naturskog');

const selectedSingleFramework = ref('trakthygge');

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
    { label: 'total', value: 'total' },
]
const chartType = ref('line')


function ToggleChartType() {
    chartType.value = chartType.value === 'line' ? 'bar' : 'line';
}

const chartType2 = ref('line')

function ToggleChartType2() {
    chartType2.value = chartType2.value === 'line' ? 'bar' : 'line';
}

// Reactive selections:
// Default: all frameworks selected
const selectedFrameworks = ref(frameworkOptions.map(opt => opt.value))
// Default: first artkategori option selected
const selectedArtkategori = ref<string[]>([
    'skinnsvampar',
    'kremlor och riskor',
    'spindelskivlingar',
    'övriga svampar'
]);


// Color mapping for artkategorier
const artkategoriColorMapping: Record<string, string> = {
    "skinnsvampar": "#8B5CF6",
    "spindelskivlingar": "#EC4899",
    "kremlor och riskor": "#0EA5E9",
    "övriga svampar": "#14B8A6",
    "matsvamp": "#F97316",
    "rödlistade + signalarter": "#EF4444",
    "total": "#64748B"
}

// Tooltip formatting function
// const tooltipFormat = (d: any) => {
//     return `Time: ${chartX(d)} år, Value: ${chartLine2(d)}`
// }

</script>

<style scoped>
.controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}
</style>