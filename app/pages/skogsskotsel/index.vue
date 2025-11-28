<template>
    <div class="flex-1 transition-all" :class="selectedMethod.id ? 'bg-neutral-50' : ''" v-if="page">



        <Transition name="fold-down">
            <div v-if="isMobile && showMobileStickySelect"
                class="fixed top-18 inset-x-3 z-50 pointer-events-auto origin-top">
                <USelect size="xl" :items="frameworkOptions" v-model="selectedFrameworkIndex"
                    :placeholder="selectedMethod.title || 'Välj metod'" append-to-body variant="outline"
                    class="ring-muted w-full shadow rounded-lg"
                    :ui="{ content: 'min-w-fit rounded-lg z-50', viewport: 'text-center' }" />
            </div>
        </Transition>


        <!-- <Transition name="fade"> -->
        <UContainer v-if="!selectedMethod.id" class="w-full px-0">
            <UPageHero :ui="{ container: 'py-20 pb-16 lg:py-24', title: 'sm:text-7xl', headline: 'text-neutral' }"
                :title="page.hero.title" :description="page.hero.description" :orientation="page.hero.orientation"
                class="">



            </UPageHero>
        </UContainer>
        <!-- </Transition> -->

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
                delay: 0.5 + 0.05 * (method.index ?? 0)
            }">

                <div @click="selectedId = method.id" :class="[
                    'shrink-0 lg:shrink sm:w-58 lg:w-full bg-white transition-all hover:opacity-100 border border-muted/50 overflow-hidden rounded-lg h-fit shadow-lg hover:shadow-md relative cursor-pointer',
                    !selectedId ? 'opacity-100' : (selectedId === method.id ? 'opacity-100 ring-primary/40 shadow-lg' : 'opacity-50')
                ]">

                    <template v-if="!selectedMethod.id">
                        <UBadge v-if="method.type" class="absolute top-2 left-2" :label="method.type" color="neutral"
                            variant="subtle" />
                        <img :src="methodImage(method, 'card')" :alt="method.title" width="300" height="160"
                            class=" w-full h-full" loading="lazy" decoding="async" />
                        <h1 class="text-lg p-2 px-3 font-medium text-nowrap ">{{ method.title }}</h1>
                    </template>
                    <template v-else>
                        <div class="flex items-center gap-3 p-1 pr-3">
                            <img :src="methodImage(method, 'thumb')" :alt="method.title" width="64" height="64"
                                class="size-12 rounded-md object-cover ring-1 ring-muted/50" loading="lazy"
                                decoding="async" />
                            <h1 class="text-lg font-medium text-nowrap">{{ method.title }}</h1>
                        </div>
                    </template>
                </div>
            </Motion>
        </UContainer>

        <div v-else-if="selectedMethod.id" class="p-4">
            <USelect size="xl" :items="frameworkOptions" v-model="selectedFrameworkIndex"
                :placeholder="selectedMethod.title || 'Välj metod'" append-to-body variant="outline"
                class="ring-muted w-full shadow rounded-lg"
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
            <UCarousel v-slot="{ item }" :items="methods" loop :speed="4" :ui="{ item: 'basis-3/5 md:basis-1/3 p-2' }"
                class="mobile-carousel">

                <div @click="selectedId = item.id" :class="[
                    'shrink-0 bg-white transition-all hover:opacity-100 border border-muted/50 overflow-hidden rounded-lg h-fit shadow hover:shadow-md relative cursor-pointer mb-4',
                    !selectedId ? 'opacity-100' : (selectedId === item.id ? 'opacity-100 ring-primary/40 shadow-lg' : 'opacity-50')
                ]">
                    <template v-if="!selectedMethod.id">
                        <UBadge v-if="item.type" class="absolute top-2 left-2" :label="item.type" color="neutral"
                            variant="subtle" />
                        <img :src="methodImage(item, 'card')" :alt="item.title" width="300" height="160"
                            class="w-full h-full" loading="lazy" decoding="async" />
                        <h1 class="text-lg p-2 px-3 font-medium text-nowrap ">{{ item.title }}</h1>
                    </template>
                    <template v-else>
                        <div class="flex items-center gap-3 p-3">
                            <img v-if="selectedId === item.id" :src="methodImage(item, 'thumb')" :alt="item.title"
                                width="64" height="64" class="w-16 h-16 rounded-md object-cover ring-1 ring-muted/50"
                                loading="lazy" decoding="async" />
                            <h1 class="text-lg font-medium text-nowrap">{{ item.title }}</h1>
                        </div>
                    </template>
                </div>

            </UCarousel>
        </Motion>



        <!-- <div class="w-full bg-neutral-50 border-t border-muted"> -->


        <UContainer class="w-full pt-2 px-1 sm:px-6 " v-if="selectedMethod.id">
            <Motion class="flex justify-center w-full" :initial="{
                opacity: 0,
                // transform: 'translateY(10px)',

                // filter: 'blur(20px)'
            }" :animate="{
                opacity: 1,
                // transform: 'translateY(0px)',

                // filter: 'blur(0px)'
            }" :transition="{
                duration: 0.5,
                delay: 0.3,
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
                            <div class="flex flex-col gap-6 min-w-0 max-w-full mb-2">
                                <h1 class="text-4xl font-medium text-neutral-800">{{ selectedMethod.title }}</h1>
                                <Transition name="fade" mode="out-in">
                                    <img :src="methodImage(selectedMethod, 'detail')"
                                        :alt="`Bild för ${selectedMethod.title}`" width="420" height="250"
                                        class="rounded-lg ring ring-muted/50" loading="lazy" decoding="async" />
                                </Transition>

                                <UAccordion :items="accordionItems" :unmount-on-hide="false"
                                    :default-value="['description']" :ui="{
                                        root: '', item: 'border-none px-4 py-1 ring ring-muted/50 rounded-lg bg-white mb-2 text-md', trigger: 'text-base font-medium',
                                        body: 'text-md/7 text-neutral-800 px-2'
                                    }">
                                    <template #body="{ item }">
                                        <MDC :value="item.content" unwrap="p" />
                                    </template>
                                </UAccordion>

                            </div>
                            <!-- <div class="space-y-6"> -->


                            <!-- <UPageCard title="Tailwind CSS"
                                    description="Nuxt UI integrates with latest Tailwind CSS v4, bringing significant improvements."
                                    icon="i-material-symbols:interactive-space" /> -->
                            <!-- </div> -->

                            <div v-if="timelineItems.length" class="flex flex-col gap-4 min-w-0 max-w-full">

                                <!-- <UCard variant="subtle" :ui="{ body: 'p-2 sm:p-2' }"> -->
                                <div class=" ">
                                    <div class="flex w-full justify-between items-center">
                                        <span class="text-md">Har skogen varit kalavverkad tidigare?</span>
                                        <UIcon name="i-heroicons-question-mark-circle" class="size-5 cursor-pointer"
                                            @click="toggleHistorikOpen" />
                                    </div>
                                    <div v-if="HistorikInfoOpen" class="text-sm text-muted mt-1">
                                        Tidigare kalavverkning påverkar vilka mykorrhizasvampar som finns. Framförallt
                                        är
                                        naturvårdssvampar
                                        vanligare i skogar som inte har kalavverkats.
                                    </div>
                                </div>

                                <UTabs :items="startskogTabs" v-model="selectedStartskogTab"
                                    @change="handleStartskogTabChange" variant="pill" size="lg"
                                    class="w-full -mb-3 -mt-2 transition-all "
                                    :ui="{ list: 'grid grid-cols-2 gap-1 p-1', trigger: ' data-[state=active]:text-neutral-900 px-4 py-2 text-sm font-medium', indicator: 'bg-white' }" />
                                <!-- </UCard> -->

                                <UCarousel ref="timelineCarousel" v-slot="{ item }" :items="timelineItems"
                                    :prev="{ onClick: handleTimelinePrev }" :next="{ onClick: handleTimelineNext }"
                                    class="w-full bg-neutral-950 overflow-hidden rounded-lg ring-muted/50 " fade
                                    @select="handleTimelineSelect">

                                    <div class="relative w-full aspect-video">
                                        <img :src="item.thumbHidden" :alt="`Foto ${item.tid}`" width="960" height="540"
                                            class="w-full h-full object-cover absolute inset-0" />
                                        <img :src="item.thumb" :alt="`Foto ${item.tid}`" width="960" height="540"
                                            class="w-full h-full object-cover absolute inset-0 transition-opacity duration-700"
                                            :style="{ opacity: treeFade }" />
                                    </div>
                                    <!-- <div
                                            class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent text-white p-4 space-y-1">
                                            <p class="text-sm font-semibold">{{ item.tid }}</p>
                                            <p class="text-xs uppercase tracking-wide text-white/70">{{ item.skog }}</p>
                                            <p class="text-sm">{{ item.svamp }}</p>
                                        </div> -->

                                </UCarousel>
                                <div class="flex items-center gap-2 text-xs text-neutral-500">
                                    <UPopover>
                                        <div class="flex cursor-help ">
                                            <UIcon name="i-fluent-shape-organic-16-filled"
                                                class="size-6 text-gray-300 z-20" />
                                            <UIcon name="i-fluent-shape-organic-16-filled"
                                                class="size-6 -ml-4 text-signal-400 z-10" />
                                            <UIcon name="i-fluent-shape-organic-16-filled"
                                                class="size-6 -ml-4 text-yellow-400" />
                                        </div>
                                        <template #content>
                                            <div class="flex flex-col gap-2 p-4">
                                                <div class="flex w-full">
                                                    <UIcon name="i-fluent-shape-organic-16-filled"
                                                        class="size-6 text-gray-300 z-20" />
                                                    <UIcon name="i-fluent-shape-organic-16-filled"
                                                        class="size-6 -ml-4 text-gray-400 z-10" />
                                                    <UIcon name="i-fluent-shape-organic-16-filled"
                                                        class="size-6 -ml-4 mr-4 text-gray-500" />
                                                    <h1 class="font-medium">Mykorrhizasvampar</h1>
                                                </div>
                                                <div class="flex w-full justify-between">
                                                    <UIcon name="i-fluent-shape-organic-16-filled"
                                                        class="size-6 text-signal-400" />

                                                    <h1 class="font-medium">Naturvårdssvampar</h1>
                                                </div>
                                                <div class="flex w-full justify-between">
                                                    <UIcon name="i-fluent-shape-organic-16-filled"
                                                        class="size-6 text-yellow-400" />

                                                    <h1 class="font-medium">Matsvampar</h1>
                                                </div>

                                            </div>
                                        </template>
                                    </UPopover>
                                    <USlider v-model="treeFade" :min="0" :max="1" :step="0.05" class="flex-1"
                                        color="neutral" />
                                    <UIcon name="i-mingcute-tree-fill" class="size-7 text-primary" />
                                </div>

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
                                        <p class="text-md text-muted">
                                            {{ timelineItems[activeTimelineIndex]?.skog }}
                                        </p>
                                        <p class="text-md">{{ timelineItems[activeTimelineIndex]?.svamp }}</p>
                                    </div>

                                </UCard>

                            </div>

                            <div class="flex flex-col gap-1 min-w-0 max-w-full">


                                <UCard variant="soft" :ui="{ body: 'p-1 sm:p-1 sm:pb-3' }"
                                    class="ring-muted/50 h-fit bg-white/80">
                                    <ForestryChartMain :parentSelectedFrameworks=[selectedMethod.id]
                                        :currentStartskog="selectedStartskogTab"
                                        :currentTimeValue="currentTimelineTime" />
                                </UCard>
                                <UCard variant="soft" class="mt-3 flex flex-col gap-5 ring-muted/50"
                                    :ui="{ body: 'sm:p-4 text-base' }">
                                    <h1 class="font-semibold mb-3">Fokusområden i {{ selectedMethod.title }}</h1>
                                    <!-- <p class="text-muted text-sm">I helskärm är fokusområden även markerade i bilden.
                                    </p> -->
                                    <UAccordion :ui="{
                                        root: '', item: 'border-none px-4 ring ring-muted/50 rounded-lg bg-white my-2', trigger: 'text-base font-medium',
                                        body: 'text-md/7 text-neutral-800 px-2'
                                    }" :items="markerCards.map(card => ({ ...card, label: card.title, content: card.description }))"
                                        multiple />
                                    <UPageCard title="Öppna modell i helskärm" :ui="{ description: 'text-neutral-100' }"
                                        description="I helskärm kan du jämföra metoder och se fokusområden markerade i bilden."
                                        icon="i-material-symbols:interactive-space"
                                        class="mt-6 cursor-pointer ring-muted/50 shadow" color="neutral" variant="solid"
                                        orientation="vertical" @click="openModelWithCurrentFramework">
                                        <!-- <div class="flex justify-center">
                                            <NuxtImg src="images/modell.png" height="150" />
                                        </div> -->
                                    </UPageCard>
                                </UCard>
                                <UModal v-model:open="modelOpen" fullscreen>
                                    <template #content>
                                        <Model @close="modelOpen = false" />
                                    </template>
                                </UModal>

                            </div>













                        </div>




                    </UPage>
                </div>
            </Motion>


        </UContainer>
        <Motion :initial="{
            opacity: 0,
            transform: 'translatex(-10px)'
            // filter: 'blur(20px)'
        }" :animate="{
            opacity: 1,
            transform: 'translateY(0px)'
            // filter: 'blur(0px)'
        }" :transition="{
            duration: 0.5,
            delay: 0.8
        }">

            <UContainer>
                <USeparator class="my-6" v-if="isMobile" />

                <div
                    class="mb-4 flex flex-col sm:flex-row gap-1.5 p-1 rounded-lg ring ring-muted/50 sm:w-fit bg-muted/30">
                    <UModal :fullscreen="isMobile ? true : false" :title="page.ecologyintro?.title ?? ''"
                        :description="page.ecologyintro?.description ?? ''" :ui="{
                            header: 'shrink-0',
                        }">
                        <UAlert icon="i-heroicons-book-open" color="neutral" variant="outline"
                            title="Mykorrhiza & skogsbruk i korthet"
                            class="sm:w-fit shadow ring-muted/50 hover:opacity-85 hover:cursor-pointer" />
                        <template #body>
                            <EcologyIntro :section="page.ecologyintro" />
                        </template>
                    </UModal>
                    <UModal :fullscreen="isMobile ? true : false" :title="page.underlag"
                        :description="page.underlagdescription" :ui="{
                            header: 'shrink-0',
                        }">
                        <UAlert icon="i-heroicons-document-magnifying-glass" color="neutral" variant="outline"
                            :title="page.underlag"
                            class="sm:w-fit shadow ring-muted/50 hover:opacity-85 hover:cursor-pointer" />
                        <template #body>
                            <UnderlagContent :underlag="page.underlag" :underlagbild="page.underlagbild"
                                :sections="page.underlagSections" />
                        </template>
                    </UModal>
                </div>
            </UContainer>
        </Motion>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import type { TabsItem } from '@nuxt/ui'
import { useMediaQuery } from '@vueuse/core'
import { useOnboardingStore } from '~/stores/onboardingStore'
import { useOverlayRegistry } from '~/composables/useOverlayRegistry'
import { useAsyncData } from '#app'

const HistorikInfoOpen = ref(false)

function toggleHistorikOpen() {
    HistorikInfoOpen.value = !HistorikInfoOpen.value
}

const open = ref(false)
const treeFade = ref(1)
const expandedMarker = ref<string | null>(null)
const methodImage = (method: any, variant: 'thumb' | 'card' | 'detail') => {
    const src = method?.image ?? '';
    const base = src.split('/').pop()?.split('.')[0] ?? '';
    const size = variant === 'thumb'
        ? '64'
        : variant === 'detail'
            ? '420x250'
            : '300x160';
    return base ? `/images/metoder/web/${base}_${size}.webp` : src;
};

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
    if (s.includes('innan')) return 'före'
    if (s.includes('före') || s.includes('fore')) return 'före'
    const nums = s.replace(/[^0-9]/g, '')
    return nums || s
}

const makeThumbSrc = (atgard: string, tid: string | number, startskog: string, visibility: 'visa_visa' | 'visa_dölj' = 'visa_visa') => {
    const slug = (v: string) => v
        .trim()
        .toLowerCase()
        // keep Swedish chars, collapse everything else to underscores
        .replace(/[^a-z0-9_åäö]+/g, '_')
        .replace(/_+/g, '_')

    const fileName = `${slug(atgard)}_${normalizeTimeToken(String(tid))}_${visibility}_${slug(startskog)}.webp`
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
    thumbHidden: string
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
            thumb: makeThumbSrc(entry.atgard, entry.tid, entry.startskog, 'visa_visa'),
            thumbHidden: makeThumbSrc(entry.atgard, entry.tid, entry.startskog, 'visa_dölj')
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
    if (token === 'före') return 'före'
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
    if (token === 'före') return 'Innan avverkning'
    if (token === 'efter') return 'Efter avverkning'
    const num = Number(token)
    if (!Number.isNaN(num)) {
        return `${num} år efter avverkning`
    }
    return tid.charAt(0).toUpperCase() + tid.slice(1)
}

const overlayRegistry = useOverlayRegistry()
const { data: overlayTextData } = await useAsyncData('overlay-texts-skogs', () => queryCollection('overlayTexts').first())

const overlayTextMap = computed<Record<string, { title: string; description: string }>>(() => {
    const value = overlayTextData.value as any
    const entries = Array.isArray(value)
        ? (value.find((item: any) => Array.isArray(item?.entries))?.entries ?? [])
        : value?.entries ?? []
    const map: Record<string, { title: string; description: string }> = {}
    entries.forEach((entry: any) => {
        const key = entry?.key
        if (!key) return
        map[key] = {
            title: entry.title ?? key,
            description: entry.description ?? '',
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
    const currentMethod = selectedMethod.value.id
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
            }
        })
})

function toggleMarkerCard(key: string) {
    expandedMarker.value = expandedMarker.value === key ? null : key
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
    transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.mobile-carousel {
    width: 100vw;
    margin-left: 50%;
    transform: translateX(-50%);
}

@media (min-width: 768px) {
    .mobile-carousel {
        width: auto;
        margin-left: 0;
        transform: none;
    }
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
