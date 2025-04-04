<template>
    <div class="my-chart-container">
        <VisXYContainer :data="chartData" :height="800" :yDomain="[0]">
            <template v-if="chartType === 'line'">
                <VisLine :color="computedLineColors" :x="xAccessor" :y="yAccessors" :interpolateMissingData="true"
                    :lineWidth="3" />
            </template>
            <template v-else-if="chartType === 'bar'">
                <VisGroupedBar :color="computedLineColors" :x="xAccessor" :y="yAccessors" :groupPadding="0.5" />
            </template>
            <VisAxis type="x" label="Ålder" />
            <VisAxis type="y" label="Klassning" />
            <VisTooltip />
            <VisCrosshair />
        </VisXYContainer>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VisXYContainer, VisLine, VisAxis, VisCrosshair, VisGroupedBar, VisTooltip } from '@unovis/vue'
import rawData from 'public/SvamparSkogsbruk.json'
import totalSvamparData from 'public/TotalSvamparSkogsbruk.json'

interface Props {
    selectedFrameworks: string[],
    selectedArtkategori: string,
    chartType: string
}

const props = withDefaults(defineProps<Props>(), {
    selectedFrameworks: () => [],
});
// Filter data for a given framework based on the selected artkategori.
// If artkategori is 'total', use totalSvamparData; otherwise use rawData.
function filterDataForFramework(framework: string) {
    if (props.selectedArtkategori.toLowerCase() === 'total') {
        return (totalSvamparData as any[]).filter(d =>
            d.artkategori?.toLowerCase() === props.selectedArtkategori.toLowerCase() &&
            d.frameworks?.toLowerCase() === framework.toLowerCase()
        ).map(d => ({
            age: d["ålder"],
            klassning: +d["klassning"]
        }))
    } else {
        return (rawData as any[]).filter(d =>
            d.artkategori?.toLowerCase() === props.selectedArtkategori.toLowerCase() &&
            d.frameworks?.toLowerCase() === framework.toLowerCase()
        ).map(d => ({
            age: d["ålder"],
            klassning: +d["klassning"]
        }))
    }
}

// Merge data for all selected frameworks.
// Each data point is keyed by 'age' and holds a property per framework.
const mergedData = computed(() => {
    const dataMap = new Map<number, any>()
    props.selectedFrameworks.forEach(framework => {
        const series = filterDataForFramework(framework)
        series.forEach(item => {
            const existing = dataMap.get(item.age) || { age: item.age }
            existing[framework] = item.klassning
            dataMap.set(item.age, existing)
        })
    })
    return Array.from(dataMap.values()).sort((a, b) => a.age - b.age)
})

// x accessor: age property
const xAccessor = (d: any) => d.age

// y accessors: one accessor per selected framework.
const yAccessors = computed(() => {
    return props.selectedFrameworks.map(framework => {
        return (d: any) => d[framework]
    })
})

// Map each framework to a color.
const frameworkColorMapping: Record<string, string> = {
    naturskydd: "#808080",
    blädning: "#ef4444",
    trakthygge: "#3b82f6",
    "skärmträd": "#eab308",
    luckhuggning: "#10b981"
}

// Computed colors: if multiple frameworks, return an array of colors.
const computedLineColors = computed(() => {
    const frameworks = props.selectedFrameworks!; // non-null assertion
    if (frameworks.length > 1) {
        return frameworks.map(f => frameworkColorMapping[f.toLowerCase()] || "#000000");
    } else if (frameworks.length === 1) {
        return frameworkColorMapping[frameworks[0].toLowerCase()] || "#000000";
    } else {
        return "#000000";
    }
});

// Final chart data to pass to Unovis
const chartData = computed(() => mergedData.value)
</script>

<style scoped>
.my-chart-container {
    margin: 1rem 0;
}
</style>