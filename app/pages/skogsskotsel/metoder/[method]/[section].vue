<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import type { ButtonProps } from '@nuxt/ui'

const route = useRoute()
const contentPath = computed(() => String(route.path || ''))

const { data: methodDoc } = await useAsyncData(
  () => `skogsskotsel-metod-${contentPath.value}`,
  () => queryCollection('skotselmetodSections').path(contentPath.value).first(),
  { watch: [contentPath] }
)

if (!methodDoc.value) {
  throw createError({ statusCode: 404, statusMessage: 'Method section not found' })
}

const methodId = computed(() => methodDoc.value?.methodId || '')
const { data: methodImpactDoc } = await useAsyncData(
  () => `skogsskotsel-metod-impact-${methodId.value}`,
  async () => {
    if (!methodId.value) return null
    return queryCollection('skotselmetodSections')
      .where('methodId', '=', methodId.value)
      .where('section', '=', 'paverkan_pa_svamp')
      .first()
  },
  { watch: [methodId] }
)

const impactValue = computed(() => Number(methodImpactDoc.value?.impactValue ?? 0))
const impactTone = computed(() => methodImpactDoc.value?.impactTone || 'medium')
const impactLabel = computed(() => methodImpactDoc.value?.impactLabel || '')
const impactColor = computed(() => {
  if (impactTone.value === 'low') return 'success'
  if (impactTone.value === 'high') return 'error'
  return 'warning'
})

const onboardingStore = useOnboardingStore()
const startskogOptions = [
  { label: 'Inte tidigare kalavverkad', value: 'naturskog' },
  { label: 'Tidigare kalavverkad', value: 'produktionsskog_' }
]
const selectedStartskogTab = ref(
  startskogOptions[onboardingStore.selectedStartskog ?? 1]?.value || startskogOptions[1].value
)

const normalizeTimelineStartskog = (value: string) => {
  const lower = value?.toLowerCase?.() ?? ''
  if (lower === 'intekalavverkad') return 'naturskog'
  if (lower === 'produktionsskog') return 'produktionsskog_'
  return value
}

const normalizeTimelineAtgard = (value: string) => {
  const lower = value?.toLowerCase?.() ?? ''
  if (lower === 'ingenatgard') return 'naturskydd'
  if (lower === 'skarmtrad') return 'skärmträd'
  if (lower === 'bladning') return 'blädning'
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

const mapTimelineTidToChartValue = (tid?: string) => {
  if (!tid) return undefined
  const token = normalizeTimeToken(tid)
  if (!token) return undefined
  if (token === 'före') return 'före'
  if (token === 'efter') return 'efter'
  const num = Number(token)
  if (!Number.isNaN(num)) return String(num)
  return undefined
}

const { data: forestryTimeline } = await useAsyncData('forestry-timeline-sections', () =>
  queryCollection('forestryTimelines').first()
)

const timelineItems = computed(() => {
  const entries = forestryTimeline.value?.entries ?? []
  const canonicalMethod = normalizeTimelineAtgard(methodId.value)
  return entries
    .map(entry => ({
      ...entry,
      startskog: normalizeTimelineStartskog(entry.startskog),
      atgard: normalizeTimelineAtgard(entry.atgard)
    }))
    .filter(entry =>
      entry.startskog === normalizeTimelineStartskog(selectedStartskogTab.value)
      && entry.atgard === canonicalMethod
    )
    .map(entry => ({
      tid: entry.tid,
      skog: entry.skog,
      svamp: entry.svamp
    }))
})

const currentTimelineTime = computed(() => mapTimelineTidToChartValue(timelineItems.value[0]?.tid))

const normalizeFrameworkId = (value: string) =>
  (value || '')
    .trim()
    .normalize('NFD')
    .replace(/\p{Diacritic}+/gu, '')
    .toLowerCase()

const resolveFrameworkKey = (value: string | null | undefined) => {
  const normalized = normalizeFrameworkId(value || '')
  if (normalized === 'ingenatgard') return 'naturskydd'
  if (normalized === 'skarmtrad') return 'skärmträd'
  if (normalized === 'bladning') return 'blädning'
  return value || ''
}

const chartFrameworks = computed(() => {
  const key = resolveFrameworkKey(methodId.value)
  return key ? [key] : undefined
})

const methodRootPath = computed(() => `/skogsskotsel/metoder/${route.params.method}`)

const { data: navigation } = await useAsyncData(
  'skotselmetod-navigation',
  () => queryCollectionNavigation('skotselmetodSections'),
  {
    watch: [methodRootPath],
    transform: (data) => {
      const root = data.find(item => item.path?.startsWith(methodRootPath.value))
      return root?.children?.length ? root.children : data
    }
  }
)

const headerLinks = computed<ButtonProps[]>(() =>
  methodId.value
    ? [
      {
        label: 'Till metoden',
        icon: 'i-heroicons-squares-2x2',
        to: `/skogsskotsel/${methodId.value}`
      }
    ]
    : []
)
</script>

<template>
  <UContainer>
    <UPage>
      <template #left>
        <UPageAside>
          <UContentNavigation :navigation="(navigation as ContentNavigationItem[])" />
        </UPageAside>
      </template>
      <template #right>
        <div></div>
      </template>

      <UPageHeader :headline="methodDoc?.methodTitle" :title="methodDoc?.sectionTitle || methodDoc?.title"
        :links="headerLinks" />
      <UPageBody>
        <div v-if="methodDoc?.section === 'om_metoden' && methodDoc?.image" class="flex justify-center w-full">
          <NuxtImg :src="methodDoc?.image" height="300" width="800" alt="Illustration" class="w-fit rounded-lg" />
        </div>
        <div v-if="methodDoc?.section === 'paverkan_pa_svamp' && methodImpactDoc" class="mt-6 space-y-2">
          <UProgress :model-value="impactValue" :max="100" :color="impactColor" size="md" :indeterminate="false" />
          <p v-if="impactLabel" class="text-lg font-medium"
            :class="impactTone === 'low' ? 'text-emerald-500' : impactTone === 'high' ? 'text-rose-500' : 'text-amber-500'">
            {{ impactLabel }}
          </p>
        </div>
        <div class="prose">
          <ContentRenderer v-if="methodDoc" :value="methodDoc" />
        </div>
        <div v-if="methodDoc?.section === 'matsvamp'" class="mt-6">
          <ForestryChartMain :selectedChart="'matsvampar'" :parentSelectedFrameworks="chartFrameworks"
            :currentStartskog="selectedStartskogTab" :currentTimeValue="currentTimelineTime" preserveFrameworkOrder
            :showControls="false" :showMatsvampSelector="true" class="pt-2" />
        </div>
        <div v-else-if="methodDoc?.section === 'mangd_mykorrhiza'" class="mt-6">
          <ForestryChartMain :selectedChart="'skogsskole'" :parentSelectedFrameworks="chartFrameworks"
            :currentStartskog="selectedStartskogTab" :currentTimeValue="currentTimelineTime" preserveFrameworkOrder
            :showControls="false" class="pt-2" />
        </div>
        <div v-else-if="methodDoc?.section === 'svampgrupper'" class="mt-6">
          <ForestryChartMain :selectedChart="'grupper'" :parentSelectedFrameworks="chartFrameworks"
            :currentStartskog="selectedStartskogTab" :currentTimeValue="currentTimelineTime" preserveFrameworkOrder
            :showControls="false" class="pt-2" />
        </div>
        <div v-else-if="methodDoc?.section === 'naturvardssvamp'" class="mt-6">
          <ForestryChartMain :selectedChart="'rodlistade'" :parentSelectedFrameworks="chartFrameworks"
            :currentStartskog="selectedStartskogTab" :currentTimeValue="currentTimelineTime" preserveFrameworkOrder
            :showControls="false" class="pt-2" />
        </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
