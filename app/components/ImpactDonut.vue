<template>
    <div class="flex flex-col items-center gap-4">
        <div class="w-full grid gap-4">
            <div class="flex justify-center rounded-xl space-y-4">
                <!-- <h1 class="text-lg font-semibold">Påverkan</h1> -->
                <div class="size-30 relative ">
                    <div class="absolute" :style="{
                        '--vis-donut-central-label-text-color': impactColor,
                        '--vis-donut-central-sub-label-text-color': '#b1835e'
                    }">
                        <VisSingleContainer :height="120" :width="120" class="donut-background">
                            <VisDonut :data="comparisonDonutData" :value="donutValue" :color="comparisonDonutColor"
                                :radius="50" :arcWidth="5" :centralLabel="label"
                                :centralSubLabel="comparisonImpactLabel || 'Påverkan'" />

                        </VisSingleContainer>
                    </div>
                    <div class="absolute ">
                        <VisSingleContainer :height="120" :width="120" class="donut-background">
                            <VisDonut :data="primaryDonutData" :value="donutValue" :color="primaryDonutColor"
                                :radius="60" :arcWidth="10" />
                        </VisSingleContainer>
                    </div>

                </div>



            </div>


        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VisSingleContainer, VisDonut } from '@unovis/vue'

type Tone = 'low' | 'medium' | 'high'

const props = withDefaults(
    defineProps<{
        value: number
        label: string
        tone: Tone
        methodLabel?: string | null
        comparisonValue?: number | null
        comparisonTone?: Tone | null
        comparisonLabel?: string | null
        comparisonImpactLabel?: string | null
    }>(),
    {
        value: 0,
        label: '',
        tone: 'medium',
        methodLabel: null,
        comparisonValue: null,
        comparisonTone: null,
        comparisonLabel: null,
        comparisonImpactLabel: null
    }
)

const clampedValue = computed(() => {
    const v = Number(props.value)
    if (!Number.isFinite(v)) return 0
    return Math.max(0, Math.min(100, v))
})
const hasComparison = computed(() => props.comparisonValue !== null && props.comparisonValue !== undefined)
const clampedComparisonValue = computed(() => {
    if (!hasComparison.value) return 0
    const v = Number(props.comparisonValue)
    if (!Number.isFinite(v)) return 0
    return Math.max(0, Math.min(100, v))
})



const donutValue = (d: { value: number }) => {
    const v = Number(d.value)
    return Number.isFinite(v) ? v : 0
}
const donutStartAngle = 4

const primaryDonutData = computed(() => ([
    { id: 'impact', value: clampedValue.value },
    { id: 'rest', value: Math.max(0, 100 - clampedValue.value) }
]))

const comparisonDonutData = computed(() => ([
    { id: 'impact', value: clampedComparisonValue.value },
    { id: 'rest', value: Math.max(0, 100 - clampedComparisonValue.value) }
]))

const mixColor = (from: [number, number, number], to: [number, number, number], t: number) => {
    const clamp = Math.max(0, Math.min(1, t))
    const r = Math.round(from[0] + (to[0] - from[0]) * clamp)
    const g = Math.round(from[1] + (to[1] - from[1]) * clamp)
    const b = Math.round(from[2] + (to[2] - from[2]) * clamp)
    return `rgb(${r}, ${g}, ${b})`
}

const heatmapColor = (t: number) => {
    const clamp = Math.max(0, Math.min(1, t))
    const green: [number, number, number] = [34, 197, 94] // tailwind green-500
    const yellow: [number, number, number] = [250, 204, 21] // tailwind yellow-400
    const red: [number, number, number] = [239, 68, 68] // tailwind red-500
    if (clamp <= 0.5) {
        return mixColor(green, yellow, clamp / 0.5)
    }
    return mixColor(yellow, red, (clamp - 0.5) / 0.5)
}

const impactColor = computed(() => heatmapColor(clampedValue.value / 100))
const comparisonImpactColor = computed(() => heatmapColor(clampedComparisonValue.value / 100))

const primaryDonutColor = (d: { id: string }) => {
    if (d.id === 'rest') return '#f2ece2'
    return impactColor.value
}

const comparisonDonutColor = (d: { id: string }) => {
    if (d.id === 'rest') return '#f2ece2'
    return '#c3a283'
}

</script>

<style scoped>
.donut-rotate {
    transform: rotate(110deg);
}

.donut-background {
    --vis-donut-background-color: #e3d6c5;
}
</style>
