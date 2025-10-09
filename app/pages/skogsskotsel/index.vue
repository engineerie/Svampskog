<template>
    <div class=" flex-1" v-if="page">
        <UContainer class="w-full px-0">
            <UPageHero :ui="{ container: 'py-12 lg:py-24', title: 'sm:text-7xl', headline: 'text-neutral' }"
                :title="page.hero.title" :description="page.hero.description" :orientation="page.hero.orientation"
                class="">
                <!-- <NuxtImg :src="page.hero.src" width="700" format="webp" alt="Illustration"
                    class="rounded ring ring-neutral-300 " /> -->
                <template v-if="page?.hero?.links?.[0]" #links>
                    <UModal fullscreen>
                        <UChip color="warning" size="2xl">
                            <UButton :label="page.hero.links[0].label" :size="page.hero.links[0].size"
                                :color="page.hero.links[0].color" :icon="page.hero.links[0].icon" />
                        </UChip>
                        <template #content>
                            <!-- <UAlert title="Denna funktion lanseras i November." color="warning"
                                icon="i-fluent-emoji-high-contrast-construction" /> -->
                            <Model />
                        </template>
                    </UModal>
                </template>
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


        <UContainer class="w-full pt-2 px-0 sm:px-6 ">
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
                <div class="w-full ring ring-muted/50 rounded relative overflow-hidden shadow">
                    <!-- <div class="absolute top-0 right-0 p-3 flex gap-4">
                        <h1 class="text-lg font-medium">{{ selectedMethod.title }}</h1>
                        <UBadge v-if="selectedMethod.type" :label="selectedMethod.type" color="neutral" variant="subtle"
                            size="lg" />
                    </div> -->
                    <UTabs :ui="{ list: 'p-2 justify-center sm:justify-start', root: '' }" :items="tabs" color="primary"
                        size="md" class="w-full" variant="link">
                        <template #text>
                            <UPage class="pt-4 sm:p-6 ">
                                <!-- <template #left>
                                    <div></div>
                                </template> -->
                                <div class="sm:grid grid-cols-2">
                                    <div class="px-6 sm:px-12 sm:border-r border-muted/50">
                                        <h1 class="my-4  text-3xl sm:text-4xl font-medium text-neutral-900">{{
                                            selectedMethod.title
                                            }}
                                        </h1>
                                        <MDC class="text-lg text-neutral-800  mb-8"
                                            :value="selectedMethod.description" />

                                    </div>
                                    <div class="px-6 sm:px-12">
                                        <h1 class="my-4 text-2xl font-medium text-neutral-900">Påverkan på
                                            mykorrhizasvampar
                                        </h1>
                                        <MDC class="text-lg text-neutral-800"
                                            :value="selectedMethod.descriptionsvamp" />
                                    </div>
                                </div>

                                <!-- <template #right>
                                    <UAlert v-if="selectedMethod.type" color="neutral" variant="subtle"
                                        description="Hyggesfritt skogsbruk innebär att det kontinuerligt finns ett trädtäcke i skogen."
                                        class="h-fit mx-4 mb-4" />
                                </template> -->
                            </UPage>
                        </template>
                        <template #diagram>
                            <!-- <UAlert title="Denna funktion lanseras i November." color="warning"
                                icon="i-fluent-emoji-high-contrast-construction" /> -->
                            <!-- <h1
                                class="text-3xl tracking-tight lg:text-5xl font-medium text-neutral-900 my-4 mx-2 lg:mt-8 mb-2">
                                {{
                                    selectedMethod.title
                                }}
                            </h1> -->
                            <ForestryChartMain :parentSelectedFrameworks=[selectedMethod.id]
                                currentStartskog="naturskog" />
                        </template>
                        <template #timeline>
                            <div class="p-6 pb-2">
                                <UTimeline :items="timelineItems" size="3xs"
                                    :ui="{ indicator: 'bg-neutral-200/50 ', separator: 'bg-neutral-200/50', description: 'p-0 mt-2 text-default' }">
                                    <template #title="{ item }">
                                        <span class="font-semibold">{{ item.tid }}</span>
                                    </template>
                                    <template #description="{ item }" :key="item.tid">
                                        <div class=" lg:flex gap-4 space-y-2 lg:space-y-0">
                                            <img :src="item.thumb" class="w-80 h-fit rounded" />
                                            <div class="w-full px-6 border border-muted/50 bg-muted/50 rounded h-fit">
                                                <MDC :value="item.skog" />
                                            </div>
                                            <div class="w-full bg-white px-6 border border-muted/50 rounded h-fit">
                                                <MDC :value="item.svamp" />
                                            </div>

                                        </div>
                                    </template>
                                </UTimeline>
                            </div>

                            <!-- <h1
                                class="text-3xl tracking-tight lg:text-5xl font-medium text-neutral-900 my-4 mx-2 lg:my-8 mb-2">
                                {{ selectedMethod.title }}
                            </h1> -->

                        </template>
                    </UTabs>
                </div>
            </Motion>


        </UContainer>
        <div class="bg-muted border-t border-muted mt-18">
            <SCarousel :section="page.carousel" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import type { TabsItem } from '@nuxt/ui'

const { data: page } = await useAsyncData('skogsskotsel', () => queryCollection('skogsskotsel').first())
if (!page.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Page not found',
        fatal: true
    })
}

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

const tabs = ref<TabsItem[]>([

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
    {
        label: 'Text',
        icon: 'i-heroicons-book-open',
        slot: 'text' as const
    },
])

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
const selectedId = ref<string>('')

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
</script>
