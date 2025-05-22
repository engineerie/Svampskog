<script setup lang="ts">
import { computed } from 'vue'
import { VisXYContainer, VisLine, VisAxis, VisCrosshair, VisGroupedBar, VisTooltip } from '@unovis/vue'
import rawData from 'public/SvamparSkogsbruk.json'
import totalSvamparData from 'public/TotalSvamparSkogsbruk.json'
import { capitalize } from 'lodash-es'

// Define the props for the component.
interface Props {
    species: string,            // e.g., "matsvamp", "rödlistade + signalarter", or "total"
    selectedFramework: string,    // for the first series
    selectedStartskog?: string,    // for the first series; not needed for total data
    isComparison: boolean,        // whether to show two lines
    secondFramework?: string,
    chartType?: string,   // 'line' or 'bar'
    dataSource?: string   // "svampar" (default) or "total"
}

const props = withDefaults(defineProps<Props>(), {
    chartType: 'line',
    selectedStartskog: ''

})

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
    // Determine the original color based on species.
    let originalColor = "";
    if (speciesLower.includes("rödlistade")) {
        originalColor = "#ef4444";
    } else if (speciesLower.includes("matsvamp")) {
        originalColor = "#eab308";
    } else {
        originalColor = "#ef4444"; // fallback color
    }

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
    if (props.dataSource === 'total') {
        // For total data, ignore startskog filtering.
        return (totalSvamparData as any[]).filter(d =>
            d.artkategori?.toLowerCase() === speciesLower &&
            d.frameworks?.toLowerCase() === frameworkLower
        ).map(d => ({
            age: d["ålder"],
            klassning: +d["klassning"]
        }))
    } else {
        const startskogLower = startskog?.toLowerCase() || ''
        return (rawData as any[]).filter(d =>
            d.artkategori?.toLowerCase() === speciesLower &&
            d.startskog?.toLowerCase() === startskogLower &&
            d.frameworks?.toLowerCase() === frameworkLower
        ).map(d => ({
            age: d["ålder"],
            klassning: +d["klassning"]
        }))
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
    let selectedColor = "";
    const speciesLower = props.species.toLowerCase();
    if (speciesLower.includes("rödlistade")) {
        selectedColor = "#ef4444"; // red for rödlistade
    } else if (speciesLower.includes("matsvamp")) {
        selectedColor = "#eab308"; // yellow for matsvamp
    } else if (speciesLower === "total") {
        selectedColor = "#9ca3af"; // gray for total svamp
    } else {
        selectedColor = "#000000"; // fallback color
    }

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