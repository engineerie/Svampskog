<template>
    <div class="flex flex-col items-center gap-3">
        <div class="w-full space-y-2">
            <UProgress :model-value="clampedValue" :max="100" :color="progressColor" size="xl" :indeterminate="false" />
            <UProgress v-if="hasComparison" :model-value="clampedComparisonValue" :max="100"
                :color="comparisonProgressColor" size="xl" :indeterminate="false" />
        </div>

    </div>
    <div class="text-left mt-2">
        <p class="text-xs uppercase tracking-wide text-neutral-500">Övergripande påverkan</p>
        <p class="text-lg font-semibold" :class="toneClass">{{ label }}</p>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Tone = 'low' | 'medium' | 'high'

const props = withDefaults(
    defineProps<{
        value: number
        label: string
        tone: Tone
        comparisonValue?: number | null
        comparisonTone?: Tone | null
    }>(),
    {
        value: 0,
        label: '',
        tone: 'medium',
        comparisonValue: null,
        comparisonTone: null
    }
)

const clampedValue = computed(() => Math.max(0, Math.min(100, props.value)))
const hasComparison = computed(() => props.comparisonValue !== null && props.comparisonValue !== undefined)
const clampedComparisonValue = computed(() =>
    hasComparison.value ? Math.max(0, Math.min(100, Number(props.comparisonValue))) : 0
)

const comparisonTone = computed<Tone>(() => props.comparisonTone || props.tone)
const progressColor = computed(() => {
    if (props.tone === 'low') return 'success'
    if (props.tone === 'high') return 'error'
    return 'warning'
})
const comparisonProgressColor = computed(() => {
    if (comparisonTone.value === 'low') return 'success'
    if (comparisonTone.value === 'high') return 'error'
    return 'warning'
})

const toneClass = computed(() => {
    if (props.tone === 'low') return 'text-emerald-500'
    if (props.tone === 'high') return 'text-rose-500'
    return 'text-amber-500'
})
</script>
