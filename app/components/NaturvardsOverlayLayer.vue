<script setup lang="ts">
import { computed } from 'vue'
import { useOverlayRegistry } from '~/composables/useOverlayRegistry'

type NaturvardsPoint = {
  id: string
  x: number
  y: number
  removed?: boolean
}

const props = defineProps<{
  framework: string | null | undefined
  startskog: string | null | undefined
  timeLabel: string | null | undefined
  visible: boolean
}>()

const overlayRegistry = useOverlayRegistry()

const normalizeFramework = (value: string | null | undefined) => {
  if (!value) return null
  const lower = value.toLowerCase()
  if (lower === 'ingenatgard') return 'naturskydd'
  return lower
}

const normalizeTimeLabel = (value: string | null | undefined) => {
  if (!value) return null
  const s = value.toString().trim().toLowerCase()
  if (s.includes('innan') || s.includes('före') || s.includes('fore')) return 'innan'
  if (s.includes('efter')) return 'efter'
  const num = s.replace(/[^0-9]/g, '')
  if (num) return `${num} år`
  return value
}

const normalizedFramework = computed(() => normalizeFramework(props.framework))
const normalizedTime = computed(() => normalizeTimeLabel(props.timeLabel))

const overlayContext = computed(() => ({
  framework: normalizedFramework.value,
  startskog: props.startskog ?? null,
  time: normalizedTime.value,
}))

const rawPoints = computed<NaturvardsPoint[]>(() => {
  if (!props.visible) return []
  if (!overlayContext.value.framework || !overlayContext.value.startskog || !overlayContext.value.time) {
    return []
  }
  return overlayRegistry.filterAll(overlayContext.value).naturvardsarter ?? []
})

const points = computed(() => {
  const list = rawPoints.value
  const hasMyc71 = list.some((point) => point.id === 'myc-7.1' && !point.removed)
  if (!hasMyc71) return list
  return list.filter((point) => point.id !== 'myc-7')
})

const sortedPoints = computed(() => {
  const priority = (point: NaturvardsPoint) => {
    if (point.id === 'myc-7') return 1
    if (point.id === 'myc-7.1') return 2
    return 0
  }
  return [...points.value].sort((a, b) => priority(a) - priority(b))
})

const SVG_WITH_X = new Set(['myc-2', 'myc-3', 'myc-4', 'myc-5', 'myc-8', 'myc-9'])

const svgSrcForPoint = (point: NaturvardsPoint) => {
  const suffix = point.removed && SVG_WITH_X.has(point.id) ? '-x' : ''
  return `/svg/${point.id}${suffix}.svg`
}
</script>

<template>
  <div v-if="visible" class="absolute inset-0 pointer-events-none z-30">
    <img v-for="point in sortedPoints" :key="`${point.id}-${point.removed ? 'x' : 'on'}`"
      :src="svgSrcForPoint(point)" :alt="point.id" class="absolute inset-0 w-full h-full object-cover" />
  </div>
</template>
