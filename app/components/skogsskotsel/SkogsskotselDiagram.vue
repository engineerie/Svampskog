<script setup lang="ts">
import { computed } from 'vue'
import type { Ref } from 'vue'

const props = defineProps<{
  frameworkId?: string
  startskog?: string
  time?: string
}>()

const frameworkContext = inject<{
  id: Ref<string>
  startskog: Ref<string>
  timelineTime: Ref<string | undefined>
}>('skogsskotselFramework', null)

const frameworkId = computed(() => props.frameworkId || frameworkContext?.id?.value || '')
const startskogValue = computed(() => props.startskog || frameworkContext?.startskog?.value || 'naturskog')
const timeValue = computed(() => props.time || frameworkContext?.timelineTime?.value)

const resolveFrameworkKey = (value: string | null | undefined) => {
  const normalized = (value || '')
    .trim()
    .normalize('NFD')
    .replace(/\p{Diacritic}+/gu, '')
    .toLowerCase()
  if (normalized === 'ingenatgard') return 'naturskydd'
  if (normalized === 'skarmtrad') return 'skärmträd'
  if (normalized === 'bladning') return 'blädning'
  return value || ''
}

const chartFrameworkId = computed(() => resolveFrameworkKey(frameworkId.value))
</script>

<template>
  <UCard variant="soft" :ui="{ body: 'p-1 sm:p-1 sm:pb-3' }" class="ring-muted/50 h-fit bg-white/80">
    <ForestryChartMain :parentSelectedFrameworks="[chartFrameworkId]" :currentStartskog="startskogValue"
      :currentTimeValue="timeValue" />
  </UCard>
</template>
