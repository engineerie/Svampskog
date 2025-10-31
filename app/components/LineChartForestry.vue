<script setup lang="ts">
import { computed } from 'vue'
import { VisXYContainer, VisLine, VisAxis, VisCrosshair, VisGroupedBar, VisTooltip } from '@unovis/vue'
import { useAsyncData } from '#app'
const { data: matsvampDataDoc } = await useAsyncData('matsvamp-skogsbruk', () =>
    queryCollection('matsvampSkogsbruk').first()
)
const { data: godaMatsvampDataDoc } = await useAsyncData('goda-matsvampar-skogsbruk', () =>
    queryCollection('godaMatsvamparSkogsbruk').first()
)
const { data: signalRodlistadeDataDoc } = await useAsyncData('signal-rodlistade-skogsbruk', () =>
    queryCollection('signalRodlistadeSkogsbruk').first()
)
const { data: athelialesDataDoc } = await useAsyncData('atheliales-skogsbruk', () =>
    queryCollection('athelialesSkogsbruk').first()
)
const { data: boletalesDataDoc } = await useAsyncData('boletales-skogsbruk', () =>
    queryCollection('boletalesSkogsbruk').first()
)
const { data: cantharellalesDataDoc } = await useAsyncData('cantharellales-skogsbruk', () =>
    queryCollection('cantharellalesSkogsbruk').first()
)
const { data: spindlingarDataDoc } = await useAsyncData('spindlingar-skogsbruk', () =>
    queryCollection('spindlingarSkogsbruk').first()
)
const { data: russulalesDataDoc } = await useAsyncData('russulales-skogsbruk', () =>
    queryCollection('russulalesSkogsbruk').first()
)
const { data: thelephoralesDataDoc } = await useAsyncData('thelephorales-skogsbruk', () =>
    queryCollection('thelephoralesSkogsbruk').first()
)
const { data: totalSvamparDataDoc } = await useAsyncData('total-svampar-skogsbruk', () =>
    queryCollection('totalSvamparSkogsbruk').first()
)
const matsvampDataset = computed(() => Array.isArray(matsvampDataDoc.value?.entries) ? matsvampDataDoc.value.entries : [])
const godaMatsvampDataset = computed(() => Array.isArray(godaMatsvampDataDoc.value?.entries) ? godaMatsvampDataDoc.value.entries : [])
const signalRodlistadeDataset = computed(() => Array.isArray(signalRodlistadeDataDoc.value?.entries) ? signalRodlistadeDataDoc.value.entries : [])
const athelialesDataset = computed(() => Array.isArray(athelialesDataDoc.value?.entries) ? athelialesDataDoc.value.entries : [])
const boletalesDataset = computed(() => Array.isArray(boletalesDataDoc.value?.entries) ? boletalesDataDoc.value.entries : [])
const cantharellalesDataset = computed(() => Array.isArray(cantharellalesDataDoc.value?.entries) ? cantharellalesDataDoc.value.entries : [])
const spindlingarDataset = computed(() => Array.isArray(spindlingarDataDoc.value?.entries) ? spindlingarDataDoc.value.entries : [])
const russulalesDataset = computed(() => Array.isArray(russulalesDataDoc.value?.entries) ? russulalesDataDoc.value.entries : [])
const thelephoralesDataset = computed(() => Array.isArray(thelephoralesDataDoc.value?.entries) ? thelephoralesDataDoc.value.entries : [])
const totalSvamparDataset = computed(() => Array.isArray(totalSvamparDataDoc.value?.entries) ? totalSvamparDataDoc.value.entries : [])
import { capitalize } from 'lodash-es'

const speciesColorMap: Record<string, string> = {
    'atheliales': '#8B5CF6',
    'boletales': '#EC4899',
    'cantharellales': '#0EA5E9',
    'spindlingar': '#F97316',
    'russulales': '#22C55E',
    'thelephorales': '#A855F7',
    'matsvamp': '#eab308',
    'rödlistade + signalarter': '#5eead4',
    'goda matsvampar': '#eab308'
}

// Define the props for the component.
interface Props {
    species: string,            // e.g., "matsvamp", "rödlistade + signalarter", or "total"
    selectedFramework: string,    // for the first series
    selectedStartskog?: string,    // for the first series; not needed for total data
    isComparison: boolean,        // whether to show two lines
    secondFramework?: string,
    chartType?: string,   // 'line' or 'bar'
    dataSource?: string,   // "svampar" (default) or "total"
    matsvampVariant?: 'standard' | 'goda'
}

const props = withDefaults(defineProps<Props>(), {
    chartType: 'line',
    selectedStartskog: '',
    matsvampVariant: 'standard'

})

const matsvampVariant = computed(() => props.matsvampVariant === 'goda' ? 'goda' : 'standard')

const chartData = computed(() => {
    if (props.chartType === 'bar') {
        return mergedData.value.filter(d => d.age !== 0)
    }
    return mergedData.value
})

// Determine the line color based on species.
const computedLineColors = computed(() => {
    const speciesLower = props.species.toLowerCase();
    if (speciesLower === "total") {
        if (props.isComparison && props.secondFramework && props.secondFramework !== props.selectedFramework) {
            return ["#22c55e", "#3b82f6"]; // gray for the main total line and blue for the comparison
        }
        return "#22c55e"; // gray color for total svamp instance when not comparing
    }
    const originalColor = speciesColorMap[speciesLower] || "#ef4444";

    // If in comparison mode and a second framework is provided, return an array of colors.
    if (props.isComparison && props.secondFramework && props.secondFramework !== props.selectedFramework) {
        return [originalColor, "#3b82f6"];
    } else {
        return originalColor;
    }
});

// Filter the raw data for a given species, framework, and optionally startskog.
function filterData(framework: string, startskog: string) {
    const speciesLower = props.species?.toLowerCase() || ''
    const frameworkLower = framework?.toLowerCase() || ''
    const selectedStartskogLower = props.selectedStartskog ? props.selectedStartskog.toLowerCase() : null
    if (props.dataSource === 'total' || speciesLower === 'total') {
        // For total data, ignore startskog filtering.
        return (totalSvamparDataset.value as any[]).filter(d =>
            d.artkategori?.toLowerCase() === speciesLower &&
            d.frameworks?.toLowerCase() === frameworkLower
        ).map(d => ({
            age: d["ålder"],
            klassning: +d["klassning"]
        }))
    } else {
        if (speciesLower === 'matsvamp') {
            const matsvampKey = matsvampVariant.value === 'goda' ? 'goda matsvampar' : 'matsvamp';
            const source = matsvampVariant.value === 'goda' ? godaMatsvampDataset.value : matsvampDataset.value
            return (source as any[]).filter(d =>
                d.artkategori?.toLowerCase() === matsvampKey &&
                (!selectedStartskogLower || (d.startskog?.toLowerCase() ?? selectedStartskogLower) === selectedStartskogLower) &&
                d.frameworks?.toLowerCase() === frameworkLower
            ).map(d => ({
                age: d["ålder"],
                klassning: +d["klassning"]
            }))
        }
        const perSpeciesDataset: Record<string, any[]> = {
            'atheliales': Array.isArray(athelialesDataset.value) ? athelialesDataset.value : [],
            'boletales': Array.isArray(boletalesDataset.value) ? boletalesDataset.value : [],
            'cantharellales': Array.isArray(cantharellalesDataset.value) ? cantharellalesDataset.value : [],
            'spindlingar': Array.isArray(spindlingarDataset.value) ? spindlingarDataset.value : [],
            'russulales': Array.isArray(russulalesDataset.value) ? russulalesDataset.value : [],
            'thelephorales': Array.isArray(thelephoralesDataset.value) ? thelephoralesDataset.value : [],
            'goda matsvampar': Array.isArray(godaMatsvampDataset.value) ? godaMatsvampDataset.value : [],
        }
        if (speciesLower in perSpeciesDataset) {
            const source = perSpeciesDataset[speciesLower];
            return source.filter(d =>
                d.artkategori?.toLowerCase() === speciesLower &&
                (!selectedStartskogLower || (d.startskog?.toLowerCase() ?? selectedStartskogLower) === selectedStartskogLower) &&
                d.frameworks?.toLowerCase() === frameworkLower
            ).map(d => ({
                age: d["ålder"],
                klassning: +d["klassning"]
            }))
        }
        if (speciesLower === 'rödlistade + signalarter') {
            const source = Array.isArray(signalRodlistadeDataset.value) ? signalRodlistadeDataset.value : []
            return source.filter(d =>
                d.artkategori?.toLowerCase() === 'rödlistade + signalarter' &&
                (!selectedStartskogLower || (d.startskog?.toLowerCase() ?? selectedStartskogLower) === selectedStartskogLower) &&
                d.frameworks?.toLowerCase() === frameworkLower
            ).map(d => ({
                age: d["ålder"],
                klassning: +d["klassning"]
            }))
        }
        return []
    }
}

// Series for the first framework.
const series1Data = computed(() => {
    const data1 = filterData(props.selectedFramework, props.selectedStartskog)
    // Map each data point with a 'y1' property.
    return data1.map(d => ({ age: d.age, y1: d.klassning }))
})

// Series for the second framework (only if in comparison mode and frameworks differ).
const series2Data = computed(() => {
    if (!props.isComparison || !props.secondFramework || props.secondFramework === props.selectedFramework)
        return []
    const data2 = filterData(props.secondFramework, props.selectedStartskog)
    // Map each data point with a 'y2' property.
    return data2.map(d => ({ age: d.age, y2: d.klassning }))
})

// Merge the two series based on 'age'.
// In compare mode, merge series1Data and series2Data; otherwise, use series1Data.
const mergedData = computed(() => {
    if (props.isComparison && series2Data.value.length > 0) {
        const dataMap = new Map<number, any>()
        // Add all data points from series1Data.
        series1Data.value.forEach(item => {
            dataMap.set(item.age, { age: item.age, y1: item.y1 })
        })
        // Merge in data from series2Data.
        series2Data.value.forEach(item => {
            const existing = dataMap.get(item.age) || { age: item.age }
            existing.y2 = item.y2
            dataMap.set(item.age, existing)
        })
        // Return the merged data sorted by age.
        return Array.from(dataMap.values()).sort((a, b) => a.age - b.age)
    } else {
        return series1Data.value
    }
})

// Define the x accessor.
const xAccessor = (d: any) => d.age

// Define y accessors: in compare mode (with data for second framework) use two accessors, otherwise one.
const yAccessors = computed(() => {
    if (props.isComparison && series2Data.value.length > 0) {
        return [
            (d: any) => d.y1,
            (d: any) => d.y2
        ]
    } else {
        return [(d: any) => d.y1]
    }
})

function tooltipTemplate(d: any): string {
    if (!d) return '';

    // Helper function to map framework labels.
    function mapFrameworkLabel(label: string): string {
        const lower = label.toLowerCase();
        if (lower === "naturskydd") {
            return "Ingen åtgärd";
        } else if (lower === "skärmträd") {
            return "Överhållen skärm";
        } else {
            return capitalize(label);
        }
    }

    // Determine the color for the primary framework based on species.
    const speciesLower = props.species.toLowerCase();
    let selectedColor = speciesLower === "total"
        ? "#22c55e"
        : (speciesColorMap[speciesLower] || "#000000");

    // Blue color for the second framework.
    const secondColor = "#3b82f6";

    if (!props.isComparison) {
        return `<div class="text-sm">
              <div>${d.age} år</div>
              <div>
                <span style="color: ${selectedColor}">${mapFrameworkLabel(props.selectedFramework)}: ${d.y1}%</span>
              </div>
            </div>`;
    } else {
        return `<div class="text-sm">
              <div>${d.age} år</div>
              <div>
                <span style="color: ${selectedColor}">${mapFrameworkLabel(props.selectedFramework)}: ${d.y1}%</span>
              </div>
              <div>
                <span style="color: ${secondColor}">${props.secondFramework ? mapFrameworkLabel(props.secondFramework) : ''}: ${d.y2}%</span>
              </div>
            </div>`;
    }
}
</script>

<template>
    <div class="my-chart-container">
        <VisXYContainer :data="chartData" :height="170" :yDomain="[0]">
            <template v-if="props.chartType === 'line'">
                <VisLine :color="computedLineColors" :x="xAccessor" :y="yAccessors" :interpolateMissingData="true"
                    :lineWidth="3" />
            </template>
            <template v-else-if="props.chartType === 'bar'">
                <VisGroupedBar :color="computedLineColors" :x="xAccessor" :y="yAccessors" :groupPadding="0.5" />
            </template>
            <VisAxis type="x" label="Ålder" :tickValues="[0, 1, 20, 50, 80]" />
            <VisAxis type="y" label="Mycel %" />
            <VisTooltip />
            <VisCrosshair :template="tooltipTemplate" />
        </VisXYContainer>
    </div>

</template>


<style scoped>
.my-chart-container {
    --vis-line-gapfill-stroke-width: 3;
    --vis-line-gapfill-stroke-dasharray: 0;
    --vis-line-gapfill-stroke-opacity: 1;
    --vis-tooltip-background-color: #171717ea;
    --vis-tooltip-text-color: #e5e9f7;
    --vis-tooltip-border-color: var(--vis-color-grey);
}
</style>
