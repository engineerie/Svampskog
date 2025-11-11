<template>
    <div class=" flex-1" v-if="page">
        <UContainer class="w-full px-0">
            <UPageHero :ui="{ container: 'py-12 lg:py-24', title: 'sm:text-7xl', headline: 'text-neutral' }"
                :title="page.hero.title" :description="page.hero.description" :orientation="page.hero.orientation"
                class="">
                <!-- <NuxtImg :src="page.hero.src" width="700" format="webp" alt="Illustration"
                    class="rounded ring ring-neutral-300 " /> -->
                <!-- <template v-if="page?.hero?.links?.[0]" #links>
                    <UChip color="warning" size="2xl">
                        <UButton :label="page.hero.links[0].label" :size="page.hero.links[0].size"
                            :color="page.hero.links[0].color" :icon="page.hero.links[0].icon"
                            @click="modelOpen = true" />
                    </UChip>
                    <UModal v-model:open="modelOpen" fullscreen>
                        <template #content>
                            <Model @close="modelOpen = false" />
                        </template>
</UModal>
</template> -->
            </UPageHero>
        </UContainer>

        <UContainer class="w-full flex justify-between py-4 gap-6 overflow-scroll lg:overflow-hidden">
            <Motion v-for="method in methods" :key="method.id" class="relative" :initial="{
                scale: 1,
                transform: 'translateY(10px)',
                opacity: 0,
                // filter: 'blur(20px)'

            }" :animate="{
                scale: 1,
                transform: 'translateY(0px)',
                opacity: 1,
                // filter: 'blur(0px)'
            }" :transition="{
                duration: 0.3,
                delay: 0.3 + 0.05 * (method.index ?? 0)
            }">
                <div @click="selectedId = method.id" :class="[
                    'shrink-0 lg:shrink w-58 lg:w-full bg-white transition-all hover:opacity-100 border border-muted/50 overflow-hidden rounded h-fit shadow hover:shadow-md relative cursor-pointer',
                    selectedId === method.id ? 'opacity-100' : 'opacity-30'
                ]">

                    <UBadge v-if="method.type" class="absolute top-2 left-2" :label="method.type" color="neutral"
                        variant="subtle" />
                    <NuxtImg :src="method.image" width="300" height="160" class=" w-full h-full" />
                    <h1 class="text-lg p-2 px-3 font-medium">{{ method.title }}</h1>
                </div>
            </Motion>
        </UContainer>

        <!-- <div class="w-full bg-neutral-50 border-t border-muted"> -->


        <UContainer class="w-full pt-2 px-1 sm:px-6 ">
            <Motion class="flex justify-center w-full" :initial="{
                opacity: 0,
                transform: 'translateY(10px)'
                // filter: 'blur(20px)'
            }" :animate="{
                opacity: 1,
                transform: 'translateY(0px)'
                // filter: 'blur(0px)'
            }" :transition="{
                duration: 0.5,
                delay: 1
            }">
                <div class="w-full  rounded-xl relative overflow-hidden">
                    <!-- <div class="absolute top-0 right-0 p-3 flex gap-4">
                        <h1 class="text-lg font-medium">{{ selectedMethod.title }}</h1>
                        <UBadge v-if="selectedMethod.type" :label="selectedMethod.type" color="neutral" variant="subtle"
                            size="lg" />
                    </div> -->
                    <UPage class="p-3 pt-0 sm:pt-3">
                        <!-- <template #left>
                                    <div></div>
                                </template> -->
                        <div class="grid gap-3 sm:gap-6 lg:grid-cols-3">
                            <UCard class="h-fit" variant="soft" :ui="{ body: 'py-1 sm:py-1' }">
                                <UAccordion :items="accordionItems" :unmount-on-hide="false"
                                    :default-value="['description']" :ui="{
                                        trigger: 'text-base font-medium',
                                        body: 'text-md/7 text-neutral-800'
                                    }">
                                    <template #body="{ item }">
                                        <MDC :value="item.content" unwrap="p" />
                                    </template>
                                </UAccordion>
                            </UCard>
                            <div class="space-y-6">
                                <!-- <NuxtImg v-if="!isMobile" :src="selectedMethod.image" width="400" height="250"
                                    class="rounded ring ring-muted/50" /> -->

                                <UCard variant="soft" :ui="{ body: 'p-1 sm:p-3' }" class="ring-muted/50 bg-stone-50">
                                    <ForestryChartMain :parentSelectedFrameworks=[selectedMethod.id]
                                        currentStartskog="naturskog" :currentTimeValue="currentTimelineTime" />
                                </UCard>
                                <!-- <UPageCard title="Tailwind CSS"
                                    description="Nuxt UI integrates with latest Tailwind CSS v4, bringing significant improvements."
                                    icon="i-material-symbols:interactive-space" /> -->
                            </div>

                            <div v-if="timelineItems.length" class="space-y-4">

                                <UCarousel ref="timelineCarousel" v-slot="{ item }" :items="timelineItems"
                                    :prev="{ onClick: handleTimelinePrev }" :next="{ onClick: handleTimelineNext }"
                                    class="w-full bg-neutral-950 overflow-hidden rounded-lg ring-muted/50 " fade
                                    @select="handleTimelineSelect">

                                    <NuxtImg :src="item.thumb" :alt="`Foto ${item.tid}`" width="960" height="540"
                                        class="w-full aspect-video object-cover" />
                                    <!-- <div
                                            class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent text-white p-4 space-y-1">
                                            <p class="text-sm font-semibold">{{ item.tid }}</p>
                                            <p class="text-xs uppercase tracking-wide text-white/70">{{ item.skog }}</p>
                                            <p class="text-sm">{{ item.svamp }}</p>
                                        </div> -->

                                </UCarousel>
                                <div class="flex w-full gap-2">
                                    <UButton v-for="(item, index) in timelineItems" :key="`timeline-thumb-${index}`"
                                        color="neutral" class="ring-muted/50 w-full flex justify-center"
                                        variant="outline"
                                        :class="index === activeTimelineIndex ? 'border-neutral-900 opacity-100 shadow' : 'border-transparent opacity-60 hover:opacity-100'"
                                        type="button" @click="selectTimelineSlide(index)"
                                        :label="formatTimelineButtonLabel(item.tid)" />
                                </div>
                                <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                                    <div class="space-y-2">
                                        <!-- <p class="text-xs uppercase tracking-wide text-muted">Tidslinje</p> -->
                                        <h3 class="text-xl font-semibold text-neutral-900">{{
                                            formatTimelineCurrentLabel(timelineItems[activeTimelineIndex]?.tid) }}
                                        </h3>
                                        <p class="text-sm text-muted" v-if="timelineItems[activeTimelineIndex]">
                                            {{
                                                timelineItems[activeTimelineIndex].skog }}
                                        </p>
                                        <p class="text-sm">{{ timelineItems[activeTimelineIndex].svamp }}</p>
                                    </div>

                                </div>

                            </div>















                        </div>
                        <UModal v-model:open="modelOpen" fullscreen>
                            <template #content>
                                <Model @close="modelOpen = false" />
                            </template>
                        </UModal>
                        <UPageCard reverse title="Öppna modell i helskärm"
                            description="I helskärm går det att jämföra olika metoder och visa fler lager med mer information. "
                            icon="i-material-symbols:interactive-space" class="mt-6 sm:mt-12 cursor-pointer"
                            variant="soft" orientation="horizontal" @click="openModelWithCurrentFramework">
                            <div class="flex justify-center">
                                <NuxtImg src="images/modell.png" height="150" />
                            </div>
                        </UPageCard>


                        <!-- <template #right>
                                    <UAlert v-if="selectedMethod.type" color="neutral" variant="subtle"
                                        description="Hyggesfritt skogsbruk innebär att det kontinuerligt finns ett trädtäcke i skogen."
                                        class="h-fit mx-4 mb-4" />
                                </template> -->
                    </UPage>
                </div>
            </Motion>


        </UContainer>
        <div class="bg-muted border-t border-muted mt-18">
            <SCarousel :section="page.carousel" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, watchEffect } from 'vue'
import type { TabsItem } from '@nuxt/ui'
import { useMediaQuery } from '@vueuse/core'
import { useOnboardingStore } from '~/stores/onboardingStore'

const isMobile = useMediaQuery('(max-width: 767px)')

const modelOpen = ref(false)
const onboardingStore = useOnboardingStore()

const { data: page } = await useAsyncData('skogsskotsel', () => queryCollection('skogsskotsel').first())
if (!page.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Page not found',
        fatal: true
    })
}
interface Method {
    index?: number
    id: string
    title: string
    image: string
    shortdescription: string
    description: string
    descriptionsvamp: string
    type?: string
}

const methods = computed<Method[]>(() => page.value?.methods ?? [])

const emptyMethod: Method = {
    id: '',
    title: '',
    image: '',
    shortdescription: '',
    description: '',
    descriptionsvamp: ''
}
const selectedId = ref<string>('trakthygge')

watchEffect(() => {
    const first = methods.value[0]
    if (first && !selectedId.value) {
        selectedId.value = first.id
    }
})

const selectedMethod = computed<Method>(() => {
    const list = methods.value
    if (!list.length) {
        return emptyMethod
    }
    return list.find(method => method.id === selectedId.value) ?? list[0]
})

interface TimelineEntry {
    startskog: string
    atgard: string
    tid: string
    skog: string
    svamp: string
}

interface TimelineDoc {
    id: string
    entries: TimelineEntry[]
}

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
    if (s.includes('innan')) return 'fore'
    if (s.includes('före') || s.includes('fore')) return 'fore'
    const nums = s.replace(/[^0-9]/g, '')
    return nums || s
}

const makeThumbSrc = (atgard: string, tid: string | number, startskog: string) => {
    const slug = (v: string) => v
        .trim()
        .normalize('NFD')
        .replace(/å/gi, 'a')
        .replace(/ä/gi, 'a')
        .replace(/ö/gi, 'o')
        .replace(/\p{Diacritic}+/gu, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '')

    const fileName = `${slug(atgard)}_${normalizeTimeToken(String(tid))}_visa_visa_${slug(startskog)}.webp`
    return `/images/thumbnails/${fileName}`
}

const { data: forestryTimeline } = await useAsyncData<TimelineDoc | null>('forestry-timeline-skogsskotsel', () =>
    queryCollection('forestryTimelines').first()
)

interface TimelineDisplayItem {
    tid: string
    skog: string
    svamp: string
    thumb: string
}

const timelineItems = computed<TimelineDisplayItem[]>(() => {
    const list = forestryTimeline.value?.entries ?? []
    const method = selectedMethod.value.id
    const canonicalMethod = normalizeTimelineAtgard(method)
    return list
        .map((entry) => ({
            ...entry,
            startskog: normalizeTimelineStartskog(entry.startskog),
            atgard: normalizeTimelineAtgard(entry.atgard)
        }))
        .filter((entry) => entry.startskog === 'naturskog' && entry.atgard === canonicalMethod)
        .map((entry) => ({
            tid: entry.tid,
            skog: entry.skog,
            svamp: entry.svamp,
            thumb: makeThumbSrc(entry.atgard, entry.tid, entry.startskog)
        }))
})

const timelineCarousel = ref<any>(null)
const activeTimelineIndex = ref(0)

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
    if (items.length) {
        requestAnimationFrame(() => {
            timelineCarousel.value?.emblaApi?.scrollTo?.(0)
        })
    }
})

const mapTimelineTidToChartValue = (tid?: string) => {
    if (!tid) return undefined
    const token = normalizeTimeToken(tid)
    if (!token) return undefined
    if (token === 'fore') return 'före'
    if (token === 'efter') return 'efter'
    const num = Number(token)
    if (!Number.isNaN(num)) return String(num)
    return undefined
}

const currentTimelineTime = computed(() => mapTimelineTidToChartValue(timelineItems.value[activeTimelineIndex.value]?.tid))

function formatTimelineButtonLabel(tid?: string) {
    if (!tid) return ''
    return tid.charAt(0).toUpperCase() + tid.slice(1)
}

function formatTimelineCurrentLabel(tid?: string) {
    if (!tid) return ''
    const token = normalizeTimeToken(tid)
    if (token === 'fore') return 'Innan avverkning'
    if (token === 'efter') return 'Efter avverkning'
    const num = Number(token)
    if (!Number.isNaN(num)) {
        return `${num} år efter avverkning`
    }
    return tid.charAt(0).toUpperCase() + tid.slice(1)
}

const tabs = ref<TabsItem[]>([
    {
        label: 'Intro',
        icon: 'i-heroicons-book-open',
        slot: 'text' as const
    },

    {
        label: 'Diagram',
        icon: 'i-heroicons-presentation-chart-line',
        slot: 'diagram' as const
    },
    {
        label: 'Tidslinje',
        icon: 'i-heroicons-list-bullet',
        slot: 'timeline' as const
    },

])

const expandedCard = ref<'description' | 'svamp' | ''>('description')

// Accordion items for the selected method
const accordionItems = computed(() => [
    {
        label: `Om ${(selectedMethod.value.title || '').toLowerCase()}`,
        icon: 'i-hugeicons-tree-06',
        value: 'description',
        content: selectedMethod.value.description || ''
    },
    {
        label: 'Påverkan på mykorrhizasvampar',
        icon: 'i-hugeicons-mushroom',
        value: 'svamp',
        content: selectedMethod.value.descriptionsvamp || ''
    }
])

function toggleCard(key: 'description' | 'svamp') {
    expandedCard.value = expandedCard.value === key ? '' : key
}

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
    const normalized = normalizeFrameworkId(selectedMethod.value.id)
    const index = frameworkIndexMap[normalized]
    if (typeof index === 'number') {
        onboardingStore.selectedFramework = index
    }
    modelOpen.value = true
}
</script>
