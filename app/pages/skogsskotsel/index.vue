<template>
    <div class="flex-1 transition-all" :class="selectedMethod.id ? 'bg-neutral-50' : ''" v-if="page">



        <Transition name="fold-down">
            <div v-if="isMobile && showMobileStickySelect"
                class="fixed top-18 inset-x-3 z-50 pointer-events-auto origin-top">
                <USelect size="xl" :items="frameworkOptions" v-model="selectedFrameworkIndex"
                    :placeholder="selectedMethod.title || 'Välj metod'" append-to-body variant="outline"
                    class="ring-muted w-full shadow rounded-full"
                    :ui="{ content: 'min-w-fit rounded-lg z-50', viewport: 'text-center' }" />
            </div>
        </Transition>


        <Transition name="fade">
            <UContainer v-if="!selectedMethod.id" class="w-full px-0">
                <UPageHero :ui="{ container: 'py-20 pb-16 lg:py-24', title: 'sm:text-7xl', headline: 'text-neutral' }"
                    :title="page.hero.title" :description="page.hero.description" :orientation="page.hero.orientation"
                    class="">



                </UPageHero>
            </UContainer>
        </Transition>

        <UContainer v-if="!isMobile"
            class="w-full flex flex-col sm:flex-row  justify-between py-4 gap-3 sm:gap-6 overflow-x-auto transition-all overflow-visible"
            :class="[selectedMethod.id ? 'mt-0 flex-row' : 'mt-8 flex-col']">
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
                delay: 0.7 + 0.05 * (method.index ?? 0)
            }">
                <div @click="selectedId = method.id" :class="[
                    'shrink-0 lg:shrink sm:w-58 lg:w-full bg-white transition-all hover:opacity-100 border border-muted/50 overflow-hidden rounded-lg h-fit shadow-lg hover:shadow-md relative cursor-pointer',
                    !selectedId ? 'opacity-100' : (selectedId === method.id ? 'opacity-100 ring-primary/40 shadow-lg' : 'opacity-50')
                ]">

                    <UBadge v-if="method.type && !selectedMethod.id" class="absolute top-2 left-2" :label="method.type"
                        color="neutral" variant="subtle" />
                    <NuxtImg v-if="!selectedMethod.id" :src="method.image" width="300" height="160"
                        class=" w-full h-full" />
                    <h1 class="text-lg p-2 px-3 font-medium text-nowrap ">{{ method.title }}</h1>
                </div>
            </Motion>
        </UContainer>

        <div v-else-if="selectedMethod.id" class="p-4">
            <USelect size="xl" :items="frameworkOptions" v-model="selectedFrameworkIndex"
                :placeholder="selectedMethod.title || 'Välj metod'" append-to-body variant="outline"
                class="ring-muted w-full shadow rounded-full"
                :ui="{ content: 'min-w-fit rounded-lg z-50', viewport: 'text-center' }" />
        </div>

        <Motion v-else class="relative" :initial="{
            transform: 'translateX(10px)',
            opacity: 0,
            filter: 'blur(5px)'

        }" :animate="{
            transform: 'translateX(0px)',
            opacity: 1,
            filter: 'blur(0px)'
        }" :transition="{
            duration: 0.5,
            delay: 0.2
        }">
            <UCarousel v-slot="{ item }" :items="methods" loop :speed="4" :ui="{ item: 'basis-3/5 md:basis-1/3 p-2' }">

                <div @click="selectedId = item.id" :class="[
                    'shrink-0 bg-white transition-all hover:opacity-100 border border-muted/50 overflow-hidden rounded-lg h-fit shadow hover:shadow-md relative cursor-pointer',
                    !selectedId ? 'opacity-100' : (selectedId === item.id ? 'opacity-100 ring-primary/40 shadow-lg' : 'opacity-50')
                ]">
                    <UBadge v-if="item.type && !selectedMethod.id" class="absolute top-2 left-2" :label="item.type"
                        color="neutral" variant="subtle" />
                    <NuxtImg v-if="!selectedMethod.id" :src="item.image" width="300" height="160"
                        class="w-full h-full" />
                    <h1 class="text-lg p-2 px-3 font-medium text-nowrap ">{{ item.title }}</h1>
                </div>

            </UCarousel>
        </Motion>



        <!-- <div class="w-full bg-neutral-50 border-t border-muted"> -->


        <UContainer class="w-full pt-2 px-1 sm:px-6 " v-if="selectedMethod.id">
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
                delay: 0.5
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
                            <div class="flex flex-col gap-6 min-w-0 max-w-full">
                                <h1 class="text-4xl font-medium">{{ selectedMethod.title }}</h1>
                                <NuxtImg :src="selectedMethod.image" width="420" height="250"
                                    class="rounded-lg ring ring-muted/50" />
                                <UCard class="ring-muted/50" variant="outline" :ui="{ body: 'py-1 sm:py-1' }">
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
                            </div>
                            <!-- <div class="space-y-6"> -->


                            <!-- <UPageCard title="Tailwind CSS"
                                    description="Nuxt UI integrates with latest Tailwind CSS v4, bringing significant improvements."
                                    icon="i-material-symbols:interactive-space" /> -->
                            <!-- </div> -->

                            <div v-if="timelineItems.length" class="flex flex-col gap-4 min-w-0 max-w-full">

                                <!-- <UCard variant="subtle" :ui="{ body: 'p-2 sm:p-2' }"> -->
                                <div class="flex">
                                    <span class="text-xs text-muted">Har skogen varit kalavverkad tidigare?</span>
                                    <!-- <UTooltip text="Har skogen varit kallavverkad tidigare?">
                                        <UIcon name="i-heroicons-question-mark-circle" />
                                    </UTooltip> -->


                                </div>
                                <UTabs :items="startskogTabs" v-model="selectedStartskogTab"
                                    @change="handleStartskogTabChange" variant="pill" size="lg" class="w-full -my-3"
                                    :ui="{ list: 'grid grid-cols-2 gap-1 p-1', trigger: ' data-[state=active]:text-neutral-900 px-4 py-2 text-sm font-medium', indicator: 'bg-white' }" />
                                <!-- </UCard> -->

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
                                <div class="w-full max-w-full min-w-0 overflow-x-auto overflow-y-visible">
                                    <div class="flex flex-nowrap whitespace-nowrap gap-2 w-full my-1">
                                        <UButton v-for="(item, index) in timelineItems" :key="`timeline-thumb-${index}`"
                                            color="neutral"
                                            class="ring-muted/50 flex-none shrink-0 justify-center whitespace-nowrap"
                                            variant="outline"
                                            :class="index === activeTimelineIndex ? 'border-neutral-900 bg-neutral-900 hover:bg-neutral-900 text-white opacity-100 ring-0 shadow' : 'border-transparent opacity-60 hover:opacity-100'"
                                            type="button" @click="selectTimelineSlide(index)"
                                            :label="formatTimelineButtonLabel(item.tid)" />
                                    </div>
                                </div>

                                <UCard
                                    class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 ring-muted/50">
                                    <div class="space-y-2">
                                        <!-- <p class="text-xs uppercase tracking-wide text-muted">Tidslinje</p> -->
                                        <h3 class="text-xl font-semibold text-neutral-900">{{
                                            formatTimelineCurrentLabel(timelineItems[activeTimelineIndex]?.tid) }}
                                        </h3>
                                        <p class="text-sm text-muted">
                                            {{ timelineItems[activeTimelineIndex]?.skog }}
                                        </p>
                                        <p class="text-sm">{{ timelineItems[activeTimelineIndex]?.svamp }}</p>
                                    </div>

                                </UCard>

                            </div>

                            <div class="flex flex-col gap-1 min-w-0 max-w-full">


                                <UCard :ui="{ body: 'p-1 sm:p-1 sm:pb-3' }" class="ring-muted/50 h-fit">
                                    <ForestryChartMain :parentSelectedFrameworks=[selectedMethod.id]
                                        :currentStartskog="selectedStartskogTab"
                                        :currentTimeValue="currentTimelineTime" />
                                </UCard>
                                <UModal v-model:open="modelOpen" fullscreen>
                                    <template #content>
                                        <Model @close="modelOpen = false" />
                                    </template>
                                </UModal>
                                <div class="grid sm:grid-cols-1">
                                    <div></div>
                                    <UPageCard title="Öppna modell i helskärm"
                                        description="I helskärm går det att jämföra olika metoder och visa fler lager med mer information. "
                                        icon="i-material-symbols:interactive-space" class="mt-6 cursor-pointer"
                                        color="neutral" variant="subtle" orientation="vertical"
                                        @click="openModelWithCurrentFramework">
                                        <!-- <div class="flex justify-center">
                                            <NuxtImg src="images/modell.png" height="150" />
                                        </div> -->
                                    </UPageCard>
                                </div>
                            </div>













                        </div>




                        <!-- <template #right>
                                    <UAlert v-if="selectedMethod.type" color="neutral" variant="subtle"
                                        description="Hyggesfritt skogsbruk innebär att det kontinuerligt finns ett trädtäcke i skogen."
                                        class="h-fit mx-4 mb-4" />
                                </template> -->
                    </UPage>
                </div>
            </Motion>


        </UContainer>
        <!-- <div class="bg-muted border-t border-muted mt-18">
           
        </div> -->

        <UContainer>
            <UModal>
                <UPageCard title="test" description="tejhtekht eklrjl" class="w-fit" />

                <template #content>
                    <SCarousel :section="page.carousel" />
                </template>
            </UModal>
        </UContainer>

    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import type { TabsItem } from '@nuxt/ui'
import { useMediaQuery } from '@vueuse/core'
import { useOnboardingStore } from '~/stores/onboardingStore'

const isMobile = useMediaQuery('(max-width: 767px)')
const showMobileStickySelect = ref(false)
let __scrollHandler: (() => void) | null = null
const evaluateStickySelect = () => {
    if (typeof window === 'undefined') return
    if (!isMobile.value) {
        showMobileStickySelect.value = false
        return
    }
    const threshold = window.innerHeight * 0.5
    showMobileStickySelect.value = window.scrollY > threshold
}
onMounted(() => {
    if (typeof window === 'undefined') return
    evaluateStickySelect()
    __scrollHandler = () => evaluateStickySelect()
    window.addEventListener('scroll', __scrollHandler, { passive: true })
})
onBeforeUnmount(() => {
    if (__scrollHandler && typeof window !== 'undefined') {
        window.removeEventListener('scroll', __scrollHandler)
    }
    __scrollHandler = null
})
watch(isMobile, () => {
    if (isMobile.value) {
        evaluateStickySelect()
    } else {
        showMobileStickySelect.value = false
    }
})

const modelOpen = ref(false)
const MODAL_SCROLL_CLASS = 'modal-no-scrollbar'

const updateScrollState = (open: boolean) => {
    if (!process.client) return
    const root = document.documentElement
    if (open) {
        root.classList.add(MODAL_SCROLL_CLASS)
    } else {
        root.classList.remove(MODAL_SCROLL_CLASS)
    }
}

watch(modelOpen, (open) => updateScrollState(open))
onBeforeUnmount(() => updateScrollState(false))

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
const frameworkOptions = computed(() =>
    methods.value.map((method, index) => ({
        label: method.title,
        value: index
    }))
)

const emptyMethod: Method = {
    id: '',
    title: '',
    image: '',
    shortdescription: '',
    description: '',
    descriptionsvamp: ''
}
const selectedId = ref<string | null>(null)

const hasScrolledOnFirstSelect = ref(false)

watch(selectedId, async (newVal, oldVal) => {
    // Only on the first transition from no selection -> some selection
    if (newVal && !oldVal && !hasScrolledOnFirstSelect.value) {
        hasScrolledOnFirstSelect.value = true
        await nextTick()
        if (process.client) {
            window.scrollTo({ top: 0 })
        }
    }
})

const selectedMethod = computed<Method>(() => {
    const list = methods.value
    if (!list.length) {
        return emptyMethod
    }
    if (!selectedId.value) return emptyMethod
    return list.find(method => method.id === selectedId.value) ?? emptyMethod
})
const selectedFrameworkIndex = computed<number | null>({
    get() {
        if (!selectedId.value) return null
        const idx = methods.value.findIndex(method => method.id === selectedId.value)
        return idx >= 0 ? idx : null
    },
    set(value) {
        if (typeof value === 'number' && methods.value[value]) {
            selectedId.value = methods.value[value].id
        }
    }
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


const startskogOptions = [
    { label: 'Inte kalavverkad', value: 'naturskog' },
    { label: 'Kalavverkad', value: 'produktionsskog_' },
]

const startskogTabs = startskogOptions.map(option => ({
    label: option.label,
    value: option.value,
    icon: option.value === 'naturskog' ? 'i-material-symbols-light-forest-rounded' : 'i-ph-farm'
}))

const selectedStartskogTab = ref(startskogTabs[onboardingStore.selectedStartskog ?? 0]?.value || startskogTabs[0].value)

watch(() => onboardingStore.selectedStartskog, (val) => {
    const option = startskogOptions[val ?? 0]
    if (option && option.value !== selectedStartskogTab.value) {
        selectedStartskogTab.value = option.value
    }
}, { immediate: true })

function handleStartskogTabChange(value: string) {
    selectedStartskogTab.value = value
    const index = startskogOptions.findIndex(option => option.value === value)
    if (index !== -1) {
        onboardingStore.selectedStartskog = index
    }
}

const selectedStartskogLabel = computed(() => startskogOptions.find(opt => opt.value === selectedStartskogTab.value)?.label ?? '')

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
        .filter((entry) => entry.startskog === normalizeTimelineStartskog(selectedStartskogTab.value) && entry.atgard === canonicalMethod)
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fold-down-enter-active,
.fold-down-leave-active {
    transition: all 0.2s ease;
    transform-origin: top;
}

.fold-down-enter-from,
.fold-down-leave-to {
    transform: scaleY(0.8) translateY(-8px);
    opacity: 0;
}
</style>
