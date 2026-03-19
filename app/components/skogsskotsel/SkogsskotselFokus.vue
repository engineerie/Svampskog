<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { useOnboardingStore } from '~/stores/onboardingStore'

const props = defineProps<{
  frameworkId?: string
  title?: string
}>()

const frameworkContext = inject<{
  id: Ref<string>
  title: ComputedRef<string>
}>('skogsskotselFramework', null)

const frameworkId = computed(() => props.frameworkId || frameworkContext?.id?.value || '')
const frameworkTitle = computed(() => props.title || frameworkContext?.title?.value || '')

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

const normalizedFrameworkKey = (value: string | null | undefined) =>
  (resolveFrameworkKey(value) || '')
    .trim()
    .normalize('NFD')
    .replace(/\p{Diacritic}+/gu, '')
    .toLowerCase()

const { data: overlayTextData } = await useAsyncData('overlay-texts-skogs', () => queryCollection('overlayTexts').all())

const overlayTextMap = computed<Record<string, { title: string; description: string; image?: string; doc?: any }>>(() => {
  const docs = (overlayTextData.value as any[]) || []
  const map: Record<string, { title: string; description: string; image?: string; doc?: any }> = {}
  docs.forEach((doc: any) => {
    const key = doc?.key
    if (!key) return
    map[key] = {
      title: doc.title ?? key,
      description: doc.description ?? '',
      image: doc.image,
      doc,
    }
  })
  return map
})

const markerDefinitions = [
  { key: 'retention', icon: 'i-pepicons-pop-tree-circle' },
  { key: 'kanteffekt', icon: 'i-healthicons-square-medium-negative' },
  { key: 'rottacke', icon: 'i-game-icons-tree-roots' },
  { key: 'rottackeSkarmtrad', icon: 'i-game-icons-tree-roots' },
  { key: 'rottackeBladning', icon: 'i-game-icons-tree-roots' },
  { key: 'seedTree', icon: 'i-teenyicons-redwoodjs-outline' },
  { key: 'smaplantor', icon: 'i-pepicons-pop-seedling-circle' },
  { key: 'hogstubbar', icon: 'i-roentgen-wood' },
  { key: 'naturvardsarter', icon: 'i-material-symbols-award-star-outline' },
  { key: 'tradplantor', icon: 'i-hugeicons-plant-02' },
]

const markerCards = computed(() => {
  const currentMethod = resolveFrameworkKey(frameworkId.value)
  const allowedByMethod: Record<string, string[] | 'all'> = {
    naturvardsarter: 'all',
    retention: ['trakthygge', 'luckhuggning', 'skärmträd', 'skarmtrad', 'blädning', 'bladning'],
    kanteffekt: ['trakthygge', 'luckhuggning', 'skärmträd', 'skarmtrad'],
    tradplantor: ['trakthygge'],
    smaplantor: ['trakthygge'],
    hogstubbar: ['trakthygge'],
    rottackeBladning: ['blädning', 'bladning'],
    rottackeSkarmtrad: ['skärmträd', 'skarmtrad'],
    seedTree: ['skärmträd', 'skarmtrad'],
  }

  return markerDefinitions
    .filter(def => {
      const allow = allowedByMethod[def.key] ?? []
      if (allow === 'all') return true
      return allow.includes(currentMethod)
    })
    .map(def => {
      const copy = overlayTextMap.value[def.key] ?? { title: def.key, description: '' }
      return {
        ...def,
        title: copy.title,
        description: copy.description,
        image: copy.image,
        doc: copy.doc,
      }
    })
})

const modelOpen = ref(false)
const onboardingStore = useOnboardingStore()

const frameworkIndexMap: Record<string, number> = {
  naturskydd: 0,
  trakthygge: 1,
  luckhuggning: 2,
  skarmtrad: 3,
  'skärmträd': 3,
  bladning: 4,
  'blädning': 4,
}

const normalizeFrameworkId = (value: string) =>
  (value || '')
    .trim()
    .normalize('NFD')
    .replace(/\p{Diacritic}+/gu, '')
    .toLowerCase()

function openModelWithCurrentFramework() {
  const normalized = normalizedFrameworkKey(frameworkId.value)
  const index = frameworkIndexMap[normalized]
  if (typeof index === 'number') {
    onboardingStore.selectedFramework = index
  }
  modelOpen.value = true
}
</script>

<template>
  <div class="flex flex-col gap-1 min-w-0 max-w-full">
    <UCard variant="soft" class="mt-3 flex flex-col gap-5 ring-muted/50" :ui="{ body: 'sm:p-4 text-base' }">
      <h1 class="font-semibold mb-3">Fokusområden i {{ frameworkTitle }}</h1>
      <UAccordion :ui="{
        root: '', item: 'border-none px-4 ring ring-muted/50 rounded-lg bg-white my-2', trigger: 'text-base font-medium',
        body: 'text-md/7 text-neutral-800 px-2'
      }" :items="markerCards.map(card => ({ ...card, label: card.title, content: card.description }))" multiple />
      <UPageCard title="Öppna modell i helskärm" :ui="{ description: 'text-neutral-100' }"
        description="I helskärm kan du jämföra metoder och se fokusområden markerade i bilden."
        icon="i-material-symbols:interactive-space" class="mt-6 cursor-pointer ring-muted/50 shadow" color="neutral"
        variant="solid" orientation="vertical" @click="openModelWithCurrentFramework">
      </UPageCard>
    </UCard>
    <UModal v-model:open="modelOpen" fullscreen>
      <template #content>
        <Model @close="modelOpen = false" />
      </template>
    </UModal>
  </div>
</template>
