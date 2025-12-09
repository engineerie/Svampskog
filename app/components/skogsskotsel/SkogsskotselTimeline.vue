<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import type { TabsItem } from '@nuxt/ui'
import { useOnboardingStore } from '~/stores/onboardingStore'

const props = defineProps<{
  frameworkId?: string
}>()

const frameworkContext = inject<{
  id: Ref<string>
  startskog: Ref<string>
  timelineTime: Ref<string | undefined>
}>('skogsskotselFramework', null)

const onboardingStore = useOnboardingStore()

const frameworkId = computed(() => props.frameworkId || frameworkContext?.id?.value || '')
const startskog = frameworkContext?.startskog ?? ref('naturskog')
const timelineTime = frameworkContext?.timelineTime ?? ref<string | undefined>(undefined)
const startskogModel = computed({
  get: () => startskog.value,
  set: (val: string) => {
    startskog.value = val
  }
})

const HistorikInfoOpen = ref(false)
const treeFade = ref(1)
const timelineCarousel = ref<any>(null)
const activeTimelineIndex = ref(0)

const startskogOptions = [
  { label: 'Inte kalavverkad', value: 'naturskog' },
  { label: 'Kalavverkad', value: 'produktionsskog_' },
]

const startskogTabs = startskogOptions.map(option => ({
  label: option.label,
  value: option.value,
  icon: option.value === 'naturskog' ? 'i-material-symbols-light-forest-rounded' : 'i-ph-farm'
})) as TabsItem[]

watch(startskog, (val) => {
  const idx = startskogOptions.findIndex(opt => opt.value === val)
  if (idx !== -1) {
    onboardingStore.selectedStartskog = idx
  }
})

const normalizeTimelineStartskog = (value: string) => {
  const lower = value?.toLowerCase?.() ?? ''
  if (lower === 'intekalavverkad') return 'naturskog'
  if (lower === 'produktionsskog') return 'produktionsskog_'
  return value
}

const normalizeTimelineAtgard = (value: string) => {
  const lower = value?.toLowerCase?.() ?? ''
  if (lower === 'ingenatgard') return 'naturskydd'
  return value
}

const normalizeTimeToken = (t: string | number) => {
  const s = String(t).trim().toLowerCase()
  if (s.includes('efter')) return 'efter'
  if (s.includes('innan')) return 'före'
  if (s.includes('före') || s.includes('fore')) return 'före'
  const nums = s.replace(/[^0-9]/g, '')
  return nums || s
}

const makeThumbSrc = (atgard: string, tid: string | number, startskog: string, visibility: 'visa_visa' | 'visa_dölj' = 'visa_visa') => {
  const slug = (v: string) => v
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_åäö]+/g, '_')
    .replace(/_+/g, '_')

  const fileName = `${slug(atgard)}_${normalizeTimeToken(String(tid))}_${visibility}_${slug(startskog)}.webp`
  return `/images/thumbnails/${fileName}`
}

const { data: forestryTimeline } = await useAsyncData('forestry-timeline-skogsskotsel', () =>
  queryCollection('forestryTimelines').first()
)

interface TimelineDisplayItem {
  tid: string
  skog: string
  svamp: string
  thumb: string
  thumbHidden: string
}

const timelineItems = computed<TimelineDisplayItem[]>(() => {
  const list = forestryTimeline.value?.entries ?? []
  const method = frameworkId.value
  const canonicalMethod = normalizeTimelineAtgard(method)
  return list
    .map((entry) => ({
      ...entry,
      startskog: normalizeTimelineStartskog(entry.startskog),
      atgard: normalizeTimelineAtgard(entry.atgard)
    }))
    .filter((entry) => entry.startskog === normalizeTimelineStartskog(startskog.value) && entry.atgard === canonicalMethod)
    .map((entry) => ({
      tid: entry.tid,
      skog: entry.skog,
      svamp: entry.svamp,
      thumb: makeThumbSrc(entry.atgard, entry.tid, entry.startskog, 'visa_visa'),
      thumbHidden: makeThumbSrc(entry.atgard, entry.tid, entry.startskog, 'visa_dölj')
    }))
})

function handleTimelinePrev() {
  timelineCarousel.value?.emblaApi?.scrollPrev?.()
}

function handleTimelineNext() {
  timelineCarousel.value?.emblaApi?.scrollNext?.()
}

function handleTimelineSelect(index: number) {
  activeTimelineIndex.value = index
}

function selectTimelineSlide(index: number) {
  activeTimelineIndex.value = index
  timelineCarousel.value?.emblaApi?.scrollTo?.(index)
}

watch(timelineItems, (items) => {
  activeTimelineIndex.value = 0
  timelineTime.value = mapTimelineTidToChartValue(items[0]?.tid)
  if (items.length && process.client) {
    requestAnimationFrame(() => {
      timelineCarousel.value?.emblaApi?.scrollTo?.(0)
    })
  }
})

const mapTimelineTidToChartValue = (tid?: string) => {
  if (!tid) return undefined
  const token = normalizeTimeToken(tid)
  if (token === 'före') return 'före'
  if (token === 'efter') return 'efter'
  const num = Number(token)
  if (!Number.isNaN(num)) return String(num)
  return undefined
}

watch(activeTimelineIndex, () => {
  const currentTid = timelineItems.value[activeTimelineIndex.value]?.tid
  timelineTime.value = mapTimelineTidToChartValue(currentTid)
})

function formatTimelineButtonLabel(tid?: string) {
  if (!tid) return ''
  return tid.charAt(0).toUpperCase() + tid.slice(1)
}

function formatTimelineCurrentLabel(tid?: string) {
  if (!tid) return ''
  const token = normalizeTimeToken(tid)
  if (token === 'före') return 'Innan avverkning'
  if (token === 'efter') return 'Efter avverkning'
  const num = Number(token)
  if (!Number.isNaN(num)) {
    return `${num} år efter avverkning`
  }
  return tid.charAt(0).toUpperCase() + tid.slice(1)
}
</script>

<template>
  <div v-if="timelineItems.length" class="flex flex-col gap-4 min-w-0 max-w-full">
    <div class="flex w-full justify-between items-center">
      <span class="text-md">Har skogen varit kalavverkad tidigare?</span>
      <UIcon name="i-heroicons-question-mark-circle" class="size-5 cursor-pointer" @click="HistorikInfoOpen = !HistorikInfoOpen" />
    </div>
    <div v-if="HistorikInfoOpen" class="text-sm text-muted mt-1">
      Tidigare kalavverkning påverkar vilka mykorrhizasvampar som finns. Framförallt är naturvårdssvampar
      vanligare i skogar som inte har kalavverkats.
    </div>

    <UTabs :items="startskogTabs" v-model="startskogModel" variant="link" size="lg" class="w-full -mb-3 -mt-2 transition-all"
      :ui="{ list: 'grid grid-cols-2 gap-1 p-1', trigger: ' data-[state=active]:text-neutral-900 px-4 py-2 text-sm font-medium' }" />

    <UCarousel ref="timelineCarousel" v-slot="{ item }" :items="timelineItems" :prev="{ onClick: handleTimelinePrev }"
      :next="{ onClick: handleTimelineNext }" class="w-full bg-neutral-950 overflow-hidden rounded-lg ring-muted/50 " fade
      @select="handleTimelineSelect">

      <div class="relative w-full aspect-video">
        <img :src="item.thumbHidden" :alt="`Foto ${item.tid}`" width="960" height="540" class="w-full h-full object-cover absolute inset-0" />
        <img :src="item.thumb" :alt="`Foto ${item.tid}`" width="960" height="540"
          class="w-full h-full object-cover absolute inset-0 transition-opacity duration-700" :style="{ opacity: treeFade }" />
      </div>
    </UCarousel>

    <div class="flex items-center gap-2 text-xs text-neutral-500">
      <UPopover>
        <div class="flex cursor-help ">
          <UIcon name="i-fluent-shape-organic-16-filled" class="size-6 text-gray-300 z-20" />
          <UIcon name="i-fluent-shape-organic-16-filled" class="size-6 -ml-4 text-signal-400 z-10" />
          <UIcon name="i-fluent-shape-organic-16-filled" class="size-6 -ml-4 text-yellow-400" />
        </div>
        <template #content>
          <div class="flex flex-col gap-2 p-4">
            <div class="flex w-full">
              <UIcon name="i-fluent-shape-organic-16-filled" class="size-6 text-gray-300 z-20" />
              <UIcon name="i-fluent-shape-organic-16-filled" class="size-6 -ml-4 text-gray-400 z-10" />
              <UIcon name="i-fluent-shape-organic-16-filled" class="size-6 -ml-4 mr-4 text-gray-500" />
              <h1 class="font-medium">Mykorrhizasvampar</h1>
            </div>
            <div class="flex w-full justify-between">
              <UIcon name="i-fluent-shape-organic-16-filled" class="size-6 text-signal-400" />
              <h1 class="font-medium">Naturvårdssvampar</h1>
            </div>
            <div class="flex w-full justify-between">
              <UIcon name="i-fluent-shape-organic-16-filled" class="size-6 text-yellow-400" />
              <h1 class="font-medium">Matsvampar</h1>
            </div>
          </div>
        </template>
      </UPopover>
      <USlider v-model="treeFade" :min="0" :max="1" :step="0.05" class="flex-1" color="neutral" />
      <UIcon name="i-mingcute-tree-fill" class="size-7 text-primary" />
    </div>

    <div class="w-full max-w-full min-w-0 overflow-x-auto overflow-y-visible">
      <div class="flex flex-nowrap whitespace-nowrap gap-2 w-full my-1">
        <UButton v-for="(item, index) in timelineItems" :key="`timeline-thumb-${index}`" color="neutral"
          class="ring-muted/50 flex-none shrink-0 justify-center whitespace-nowrap" variant="outline"
          :class="index === activeTimelineIndex ? 'border-neutral-900 bg-neutral-900 hover:bg-neutral-900 text-white opacity-100 ring-0 shadow' : 'border-transparent opacity-60 hover:opacity-100'"
          type="button" @click="selectTimelineSlide(index)" :label="formatTimelineButtonLabel(item.tid)" />
      </div>
    </div>

    <UCard variant="soft" class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 ring-muted/50">
      <div class="space-y-2">
        <h3 class="text-xl font-semibold text-neutral-900">
          {{ formatTimelineCurrentLabel(timelineItems[activeTimelineIndex]?.tid) }}
        </h3>
        <p class="text-md text-muted">
          {{ timelineItems[activeTimelineIndex]?.skog }}
        </p>
        <p class="text-md">{{ timelineItems[activeTimelineIndex]?.svamp }}</p>
      </div>
    </UCard>
  </div>
</template>
