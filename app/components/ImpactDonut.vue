<template>
    <div class="flex flex-col items-center gap-3">
        <div class="w-full space-y-2">
            <div class="rounded-lg space-y-1 p-4 ring-muted/50">
                <p v-if="hasComparison && methodLabel" class="text-xs font-medium text-neutral-600">
                    {{ methodLabel }}
                </p>
                <UProgress :model-value="clampedValue" :max="100" :color="progressColor" size="xl"
                    :indeterminate="false" />
                <p class="text-lg font-medium" :class="toneClass">
                    {{ label }}
                </p>
            </div>
            <div v-if="hasComparison"
                class=" bg-neutral-50 rounded-lg space-y-1 p-4 outline-dashed outline-2 outline-neutral-200">
                <p v-if="comparisonLabel" class="text-xs font-medium text-neutral-600">
                    {{ comparisonLabel }}
                </p>
                <UProgress :model-value="clampedComparisonValue" :max="100" :color="comparisonProgressColor" size="xl"
                    :indeterminate="false" />
                <p v-if="comparisonImpactLabel" class="text-lg font-medium" :class="comparisonToneClass">
                    {{ comparisonImpactLabel }}
                </p>
            </div>
        </div>

    </div>
    <!-- <div v-if="!hasComparison" class="text-left mt-2">
        <p class="text-lg font-semibold" :class="toneClass">{{ label }}</p>
    </div> -->
</template>

<script setup lang="ts">
import { computed } from 'vue'

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
const comparisonToneClass = computed(() => {
    if (comparisonTone.value === 'low') return 'text-emerald-500'
    if (comparisonTone.value === 'high') return 'text-rose-500'
    return 'text-amber-500'
})
</script>
