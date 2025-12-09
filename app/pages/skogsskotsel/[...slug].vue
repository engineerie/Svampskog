<script setup lang="ts">
import { computed, ref, watch, provide } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import type { TabsItem } from '@nuxt/ui'
import { useOnboardingStore } from '~/stores/onboardingStore'

definePageMeta({
  layout: 'skogsskotselcontent',
  collection: 'forestryFrameworks'
})

const route = useRoute()
const isMobile = useMediaQuery('(max-width: 767px)')
const onboardingStore = useOnboardingStore()

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('forestryFrameworks').path(route.path).first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const frameworkId = computed(() => page.value?.frameworkId ?? '')

useSeoMeta({
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description
})

defineOgImageComponent('Saas')

const startskogOptions = [
  { label: 'Inte kalavverkad', value: 'naturskog' },
  { label: 'Kalavverkad', value: 'produktionsskog_' },
]

const startskogTabs = startskogOptions.map(option => ({
  label: option.label,
  value: option.value,
  icon: option.value === 'naturskog' ? 'i-material-symbols-light-forest-rounded' : 'i-ph-farm'
})) as TabsItem[]

const selectedStartskogTab = ref(startskogTabs[onboardingStore.selectedStartskog ?? 0]?.value || startskogTabs[0].value)
const currentTimelineTime = ref<string | undefined>(undefined)

watch(() => onboardingStore.selectedStartskog, (val) => {
  const option = startskogOptions[val ?? 0]
  if (option && option.value !== selectedStartskogTab.value) {
    selectedStartskogTab.value = option.value
  }
}, { immediate: true })

watch(selectedStartskogTab, (val) => {
  const idx = startskogOptions.findIndex(opt => opt.value === val)
  if (idx !== -1) {
    onboardingStore.selectedStartskog = idx
  }
})

provide('skogsskotselFramework', {
  id: frameworkId,
  title: computed(() => page.value?.title ?? ''),
  startskog: selectedStartskogTab,
  timelineTime: currentTimelineTime,
})
</script>

<template>
  <UPage v-if="page">
    <UPageHeader v-if="!isMobile" :title="page.heroTitle || page.title"
      :description="page.heroDescription || page.description" />

    <UPageBody>
      <div class="space-y-6">
        <NuxtImg :src="page.image" :alt="page.title" width="800" height="420"
          class="rounded-xl ring ring-muted/40 w-full" loading="lazy" decoding="async" />
        <ContentRenderer :value="page" />
      </div>
    </UPageBody>

    <template v-if="page?.body?.toc?.links?.length" #right>
      <UContentToc :links="page.body.toc.links" title="På den här sidan" />
    </template>
  </UPage>
</template>
