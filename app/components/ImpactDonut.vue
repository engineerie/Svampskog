<template>
    <div class="flex flex-col items-center gap-2">
        <VisSingleContainer :height="120">
            <VisDonut :data="chartData" :value="valueAccessor" :color="colorAccessor"
                :angleRange="DONUT_HALF_ANGLE_RANGE_TOP" :cornerRadius="5" :arcWidth="20" :padAngle="0.01"
                :showBackground="false" />
        </VisSingleContainer>
        <div class="text-center">
            <p class="text-xs uppercase tracking-wide text-neutral-500">Övergripande påverkan</p>
            <p class="text-lg font-semibold" :class="toneClass">{{ label }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VisSingleContainer, VisDonut } from '@unovis/vue'
import { DONUT_HALF_ANGLE_RANGE_TOP } from '@unovis/ts'

type Tone = 'low' | 'medium' | 'high'

const props = withDefaults(
    defineProps<{
        value: number
        label: string
        tone: Tone
    }>(),
    {
        value: 0,
        label: '',
        tone: 'medium'
    }
)

const clampedValue = computed(() => Math.max(0, Math.min(100, props.value)))
const remainderValue = computed(() => Math.max(0, 100 - clampedValue.value))

const chartData = computed(() => [
    { key: 'impact', value: clampedValue.value },
    { key: 'rest', value: remainderValue.value }
])

const valueAccessor = (d: { value: number }) => d.value
const colorAccessor = (d: { key: string }) => {
    if (d.key === 'rest') return 'rgba(115, 115, 115, 0.3)'
    if (props.tone === 'low') return '#10b981'
    if (props.tone === 'high') return '#f43f5e'
    return '#f59e0b'
}

const toneClass = computed(() => {
    if (props.tone === 'low') return 'text-emerald-500'
    if (props.tone === 'high') return 'text-rose-500'
    return 'text-amber-500'
})
</script>
