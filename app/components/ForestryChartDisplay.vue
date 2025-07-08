<template>
    <div class="relative">
        <!-- <div class="absolute right-0 top-0 z-40">
            <UButton color="neutral" variant="subtle"
                :icon="chartType === 'line' ? 'i-carbon-chart-column' : 'i-carbon-chart-line-smooth'"
                @click="ToggleChartType" />
        </div> -->

        <div class="">
            <VisBulletLegend :items="legendItems" :onLegendItemClick="updateLegendItem" labelFontSize="small"
                bulletSize="0.7rem" class="p-3 pb-0"/>
            <VisXYContainer :data="chartData" :height="250" :margin="margin" :yDomain="[0, props.maxYValue || undefined]" >
                <template v-if="chartType === 'line'">
                    <VisLine :color="computedLineColors" :x="xAccessor" :y="yAccessors" :interpolateMissingData="true"
                        :lineWidth="3" />
                </template>
                <template v-else-if="chartType === 'bar'">
                    <VisGroupedBar :color="computedLineColors" :x="xAccessor" :y="yAccessors" :groupPadding="0.5"
                        :groupMaxWidth="35" />
                </template>
                <VisAxis type="x"  />
                <VisAxis type="y"  />
                <!-- <VisTooltip />
            <VisCrosshair /> -->
            </VisXYContainer>
        </div>
    </div>

</template>

<script setup lang="ts">

import { computed, ref } from 'vue'
import { VisXYContainer, VisLine, VisAxis, VisCrosshair, VisGroupedBar, VisTooltip, VisBulletLegend } from '@unovis/vue'
import type { BulletLegendItemInterface } from '@unovis/ts'
import rawData from 'public/SvamparSkogsbruk.json'
import totalSvamparData from 'public/TotalSvamparSkogsbruk.json'
import { capitalize } from 'lodash-es'

const chartType = ref('line')

const margin = { left: 10, right: 10, top:10, bottom: 10 }

function ToggleChartType() {
    chartType.value = chartType.value === 'line' ? 'bar' : 'line';
}

const inactiveArtkategoriKeys = ref<Set<string>>(new Set());
const inactiveFrameworkKeys = ref<Set<string>>(new Set());

interface Props {
    selectedFrameworks: string[],
    selectedArtkategori: string[],
    // chartType: string,
    singleFrameworkSelection?: boolean,
    selectedStartskog?: string, // <-- Add this
    redColor?: boolean,
    yellowColor?: boolean,
    maxYValue?: number // <-- Add this
}

const props = withDefaults(defineProps<Props>(), {
    selectedFrameworks: () => [],
    singleFrameworkSelection: false,
    redColor: false,
    yellowColor: false
});

const frameworkColorMapping = computed(() => {
    if (props.redColor) {
        return {
            naturskydd: "#808080",
            trakthygge: "#7f1d1d",
            "skärmträd": "#b91c1c",
            luckhuggning: "#f87171",
            blädning: "#fca5a5",
        };
    } else if (props.yellowColor) {
        return {
            naturskydd: "#808080",
            trakthygge: "#713f12",
            "skärmträd": "#a16207",
            luckhuggning: "#eab308",
            blädning: "#fde047",
        };
    } else {
        return {
            naturskydd: "#808080",
            trakthygge: "#a855f7",
            luckhuggning: "#3b82f6",
            "skärmträd": "#eab308",
            blädning: "#22c55e",
        };
    }
});

const artkategoriColorMapping: Record<string, string> = {
    "skinnsvampar": "#8B5CF6",
    "spindelskivlingar": "#EC4899",
    "kremlor och riskor": "#0EA5E9",
    "övriga svampar": "#14B8A6",
    "matsvamp": "#F97316",
    "rödlistade + signalarter": "#EF4444",
    "total": "#64748B"
};

type LegendItem = BulletLegendItemInterface & {
    key: string;
    label: string;
    color: string;
    inactive: boolean;
};

function mapFrameworkLabel(label: string): string {
    const lower = label.toLowerCase();
    if (lower === "naturskydd") {
        return "Ingen åtgärd";
    } else if (lower === "trakthygge") {
        return "Trakhyggesbruk";
    } else if (lower === "skärmträd") {
        return "Överhållen skärm";
    } else {
        return capitalize(label);
    }
}

const legendOrder = ["naturskydd", "trakthygge", "skärmträd", "luckhuggning", "blädning"];

const legendItems = computed<LegendItem[]>(() => {
    if (props.singleFrameworkSelection) {
        return props.selectedArtkategori.map(art => {
            const key = art.toLowerCase();
            return {
                key,
                name: capitalize(art),
                label: capitalize(art),
                color: artkategoriColorMapping[key] || "#000000",
                inactive: inactiveArtkategoriKeys.value.has(key),
            };
        });
    } else {
        return legendOrder
            .filter(key => props.selectedFrameworks.map(f => f.toLowerCase()).includes(key))
            .map(f => ({
                key: f,
                name: mapFrameworkLabel(f),
                label: mapFrameworkLabel(f),
                color: frameworkColorMapping.value[f] || "#000000",
                inactive: inactiveFrameworkKeys.value.has(f),
            }));
    }
});

const activeFrameworks = computed(() => {
    if (props.singleFrameworkSelection) return [];

    return legendItems.value.filter(item => !item.inactive);
});

function filterDataForFramework(framework: string) {
    const selected = props.selectedArtkategori.map(s => s.toLowerCase());

    const source = selected.includes('total') ? totalSvamparData : rawData;

    return (source as any[]).filter(d =>
        selected.includes(d.artkategori?.toLowerCase()) &&
        d.frameworks?.toLowerCase() === framework.toLowerCase() &&
        d.startskog?.toLowerCase() === props.selectedStartskog?.toLowerCase()
    ).map(d => ({
        age: d["ålder"],
        klassning: +d["klassning"]
    }));
}


const mergedData = computed(() => {
    const dataMap = new Map<number, any>();

    if (props.singleFrameworkSelection) {
        const framework = props.selectedFrameworks[0];
        props.selectedArtkategori.forEach(artkategori => {
            const selected = artkategori.toLowerCase();
            const source = selected === 'total' ? totalSvamparData : rawData;
            const series = (source as any[]).filter(d =>
                d.artkategori?.toLowerCase() === selected &&
                d.frameworks?.toLowerCase() === framework &&
                d.startskog?.toLowerCase() === props.selectedStartskog?.toLowerCase()
            ).map(d => ({
                age: d["ålder"],
                klassning: +d["klassning"]
            }));

            series.forEach(item => {
                const existing = dataMap.get(item.age) || { age: item.age };
                existing[selected] = item.klassning;
                dataMap.set(item.age, existing);
            });
        });
    } else {
        activeFrameworks.value.forEach(framework => {
            const series = filterDataForFramework(framework.key);
            series.forEach(item => {
                const existing = dataMap.get(item.age) || { age: item.age };
                existing[framework.key] = item.klassning;
                dataMap.set(item.age, existing);
            });
        });
    }

    return Array.from(dataMap.values()).sort((a, b) => a.age - b.age);
});

const xAccessor = (d: any) => d.age

const yAccessors = computed(() => {
    if (props.singleFrameworkSelection) {
        return props.selectedArtkategori
            .filter(art => !inactiveArtkategoriKeys.value.has(art.toLowerCase()))
            .map(art => (d: any) => d[art.toLowerCase()]);
    } else {
        return activeFrameworks.value.map(item => {
            return (d: any) => d[item.key];
        });
    }
});

const computedLineColors = computed(() => {
    if (props.singleFrameworkSelection) {
        return legendItems.value
            .filter(item => !item.inactive)
            .map(item => item.color || "#000000");
    } else {
        return activeFrameworks.value.map(f => f.color || "#000000");
    }
});

function updateLegendItem(d: BulletLegendItemInterface) {
    const key = d.name?.toLowerCase();
    if (!key) return;

    if (props.singleFrameworkSelection) {
        const current = new Set(inactiveArtkategoriKeys.value);
        current.has(key) ? current.delete(key) : current.add(key);
        inactiveArtkategoriKeys.value = current;
    } else {
        const frameworkKey = legendOrder.find(f => mapFrameworkLabel(f).toLowerCase() === key);
        if (!frameworkKey) return;

        const current = new Set(inactiveFrameworkKeys.value);
        current.has(frameworkKey) ? current.delete(frameworkKey) : current.add(frameworkKey);
        inactiveFrameworkKeys.value = current;
    }
}

const chartData = computed(() => mergedData.value)
</script>

