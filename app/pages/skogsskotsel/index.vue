<template>
    <div class="flex-1 transition-all" :class="selectedMethod.id ? '' : ''" v-if="page">






        <UContainer v-if="!selectedMethod.id" class="w-full px-0">
            <div class=" pb-0">
                <NuxtImg v-if="isMobile" src="/images/Landing/Stock Photo 563535222.jpeg"
                    class=" shadow ring ring-muted/50 w-full aspect-video object-cover " />
            </div>
            <UPageHero :ui="{ container: ' ', title: 'sm:text-7xl' }" :title="page.hero.title"
                :description="page.hero.description" :orientation="isMobile ? 'horizontal' : 'horizontal'" class=""
                :headline="isMobile ? 'Skogsskötsel' : ''">
                <NuxtImg src="/images/Landing/Stock Photo 563535222.jpeg"
                    class="rounded-lg lg:rounded-xl shadow ring ring-muted/50 w-full aspect-video object-cover"
                    width="1000" format="webp" quality="80" />
            </UPageHero>
            <!-- <UPageHeader :title="page.hero.title" :description="page.hero.description" headline="Skogsskötsel"
                :ui="{ title: 'text-4xl' }" /> -->


        </UContainer>

        <!-- <UContainer class="w-full py-2">
            <div class="lg:flex w-full justify-start">
                <UTabs v-model="indexTab" :items="indexTabItems" size="lg" :ui="{
                    root: '',
                    list: 'flex-nowrap gap-2 bg-transparent',
                    indicator: 'bg-white border border-muted/50 shadow',
                    trigger: 'data-[state=active]:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                }" class="lg:w-fit" />
            </div>

        </UContainer> -->
        <div class="bg-muted border-y border-muted/50">




            <UContainer v-if="indexTab === 'methods'" class="relative w-full overflow-visible px-0">
                <!-- <Motion :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :transition="{ duration: 0.35, delay: 0.1 }">
                <div
                    class="pointer-events-none absolute left-1.5 top-4 bottom-4 w-0.5 rounded-full bg-linear-to-b from-emerald-500 via-amber-400 to-rose-500 lg:hidden" />

            </Motion> -->
                <UPageSection :ui="{ title: 'text-start', description: 'text-start' }" title="Välj skötselmetod"
                    description="Jämför skötselmetoder utifrån deras påverkan. På metodsidan finns en tidslinje och diagram som hjälper dig att tolka resultaten.">

                    <div class="w-full flex flex-col lg:flex-row justify-between sm:gap-4 transition-all"
                        :class="[selectedMethod.id ? 'mt-0 flex-row' : ' flex-col gap-4']">
                        <Motion v-for="(method, idx) in methods" :key="method.id" class="relative" :initial="{
                            scale: 1,
                            transform: 'translateY(10px)',
                            opacity: 0,
                        }" :animate="{
                            scale: 1,
                            transform: 'translateY(0px)',
                            opacity: 1,
                        }" :transition="{
                            duration: 0.3,
                            delay: 0.2 + 0.05 * (method.index ?? 0)
                        }">
                            <div v-if="!selectedMethod.id" @click="goToMethod(method.id)" :class="[
                                'shrink-0 lg:shrink w-full shadow hover:shadow-lg p-2 lg:p-0 bg-white ring ring-muted/30 rounded-xl transition-all group border-muted/50 h-fit  relative cursor-pointer overflow-visible',

                            ]">

                                <template v-if="!selectedMethod.id">
                                    <div class="flex lg:block  ">
                                        <img :src="methodImage(method, 'card')" :alt="method.title" width="300"
                                            height="160"
                                            class="h-18 w-26 object-cover rounded-sm lg:rounded-lg lg:rounded-b-none ring ring-muted/50 transition-all lg:w-full lg:h-full"
                                            loading="lazy" decoding="async" />
                                        <div :class="[
                                            'mx-4 lg:mx-0 lg:px-4 lg:py-3   w-full ',
                                            idx < methods.length - 1 ? ' border-muted/30  lg:border-b-0 ' : ''
                                        ]">
                                            <h1 class="text-lg lg:text-lg font-medium text-neutral-800 text-nowrap ">{{
                                                method.title
                                                }}</h1>
                                            <p class="text-muted text-sm mb-1">{{ method.shortdescription }}</p>
                                            <div class="flex flex-wrap items-center gap-1 lg:pt-2 lg:pb-1">

                                                <UBadge v-if="method.impactLabel"
                                                    :color="method.impactColor || 'warning'" variant="soft" size="sm">{{
                                                        method.impactLabel }} påverkan</UBadge>
                                                <UBadge v-if="method.type" :label="method.type" color="neutral"
                                                    variant="soft" size="sm" />
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </Motion>
                    </div>
                </UPageSection>
                <!-- <Motion :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :transition="{ duration: 0.35, delay: 0.1 }">

                <div class="hidden lg:block w-full mt-4">
                    <div class="h-0.5 w-full rounded-full bg-linear-to-r from-emerald-500 via-amber-400 to-rose-500" />
                </div>
            </Motion> -->
            </UContainer>
        </div>
        <UContainer class="w-full py-4">
            <UPageSection title="Kom igång med skogsskötsel"
                description="En kort video som visar hur du väljer skötselmetod, jämför påverkan och tolkar tidslinje och diagram på metodsidan.">
                <div
                    class=" border-muted/60 rounded-xl bg-muted/20 min-h-64 flex items-center justify-center overflow-hidden">
                    <NuxtImg src="/images/Landing/Screenshot 2026-03-03 at 10.23.02.png" class="w-full" />
                </div>
            </UPageSection>
        </UContainer>
        <UContainer>
            <UPageSection title="Tidslinjer och diagram"
                :ui="{ title: 'text-start lg:text-center', description: 'text-start lg:text-center', container: 'pb-0 sm:pb-0 lg:pb-0' }"
                description="Jämför olika skötselmetoder och deras påverkan med illustrerade tidslinjer och diagram." />

            <UPageSection orientation="horizontal" :reverse="isMobile ? true : false" headline="Tidslinje"
                :ui="{ title: 'text-2xl sm:text-3xl lg:text-4xl' }" title="Avverkningens faser i bild och text"
                description="Tidslinjen är illustrerad och annoterad för att överskådligt visa vad som händer vid olika avverkningsfaser. Bilder och markörer visar också hur miljöhänsyn, som hänsynsträd och kanteffekter, påverkar mykorrhizans överlevnad."
                :features="[{ title: 'Underlag', description: 'Forskning om mykorrhizasvampars förekomster vid olika former av skogsskötsel, miljöhänsyn och skogsålder.' }, { description: 'Förekomsten av olika svampar i skogsmark som dokumenterats i DNA-analyser från Markinventeringen mellan 2014–2021.' }]">

                <!-- <NuxtImg src="/images/Carousel/TraktBlad.png" class="w-full rounded-lg mb-2 ring ring-muted/50 shadow"
                    width="1000" height="600" /> -->

                <div class="w-full rounded-xl mb-2 ring ring-muted/50 shadow overflow-hidden bg-neutral-200 aspect-3/2">
                    <CustomImageComparisonSlider class="w-full h-full" :use-method-labels="true"
                        framework-label="Trakthyggesbruk" framework-label2="Blädning">
                        <template #first>
                            <NuxtImg src="/images/thumbnails/trakthygge_efter_visa_visa_naturskog.webp"
                                class="w-full h-full object-cover" width="960" height="680" />
                        </template>
                        <template #second>
                            <NuxtImg src="/images/thumbnails/blädning_efter_visa_visa_naturskog.webp"
                                class="w-full h-full object-cover" width="960" height="680" />
                        </template>
                    </CustomImageComparisonSlider>
                </div>
            </UPageSection>

            <UPageSection orientation="horizontal" :reverse="true" headline="Diagram" :ui="{ title: 'lg:text-4xl' }"
                title="Mykorrhizans minskning och återhämtning"
                description="Diagrammen visar hur mängden mykorrhiza minskar efter olika ingrepp och hur svampgrupper återhämtar sig. Diagram presenteras för den totala mängden, för olika svampgrupper, matsvampar och naturvårdsarter."
                :features="[{ title: 'Underlag', description: 'Markinventeringens DNA-analyser av svamparters förekomst i mark vid olika skogsåldrar.' }, { description: 'Värdena vägs mot den relativa skogstillväxten jämfört med orörd skog. Trädtillväxten är ett ungefärligt mått på trädens fotosyntes och ger en ungefärlig bild av hur mycket mykorrhizasvamp som kan finnas.' }, { description: 'Diagrammen över matsvampar som redovisas i kg/ha bygger på fältundersökningar.' }]">
                <UCard variant="soft" class="w-full ring ring-muted/30 shadow-sm rounded-xl">
                    <ForestryChartMain selectedChart="skogsskole" :parentSelectedFrameworks="['trakthygge', 'blädning']"
                        currentStartskog="naturskog" :showControls="true" class="py-2" />
                </UCard>
            </UPageSection>
        </UContainer>
        <div class="bg-muted border-y border-muted/50">
            <UContainer>
                <KnowledgeSelectionSection title="Mer om svampar och skogsskötsel"
                    :ui="{ title: 'text-start', description: 'text-start' }"
                    description="Utvalda kunskapsidor som ger mer bakgrund till svampar och skogsskötsel."
                    :indices="[1]" :limit="3" />
            </UContainer>
        </div>


        <!-- <UContainer class="flex gap-2">
            <UModal :fullscreen="isMobile ? true : false" :title="faktaDoc?.title ?? ''"
                :description="faktaDoc?.description ?? ''" :ui="{
                    header: 'shrink-0',
                }">
                <UButton icon="i-heroicons-book-open" color="neutral" variant="outline" label="Fakta i korthet"
                    class="sm:w-fit h-fit  ring-muted/50 hover:opacity-85 hover:cursor-pointer" />
                <template #body>
                    <ContentRenderer v-if="faktaDoc" :value="faktaDoc" />
                </template>
            </UModal>
            <UModal :fullscreen="isMobile ? true : false" :title="underlagDoc?.title"
                :description="underlagDoc?.description" :ui="{
                    header: 'shrink-0',
                }">
                <UButton icon="i-heroicons-document-magnifying-glass" color="neutral" variant="outline" label="Underlag"
                    class="sm:w-fit h-fit  ring-muted/50 hover:opacity-85 hover:cursor-pointer" />
                <template #body>
                    <ContentRenderer v-if="underlagDoc" :value="underlagDoc" />
                </template>
            </UModal>
        </UContainer> -->

    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useAsyncData, navigateTo } from '#app'

const methodImage = (method: any, variant: 'thumb' | 'card' | 'detail') => {
    const src = method?.image ?? '';
    const base = src.split('/').pop()?.split('.')[0] ?? '';
    const size = variant === 'thumb'
        ? '64'
        : variant === 'detail'
            ? '800x400'
            : '300x160';
    return base ? `/images/metoder/web/${base}_${size}.webp` : src;
};

const isMobile = useMediaQuery('(max-width: 767px)')
const showMobileStickySelect = ref(false)
const indexTab = ref<'methods' | 'video'>('methods')
const indexTabItems = [
    { label: 'Välj metod', value: 'methods', icon: 'i-lucide-list-check' },
    { label: 'Instruktion', value: 'video', icon: 'i-lucide-clapperboard' }
]
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

const { data: page } = await useAsyncData('skogsskotsel', () => queryCollection('skogsskotsel').first())
const { data: skogsskotselInfo } = await useAsyncData('skogsskotsel-info', () =>
    queryCollection('skogsskotselInfo').all()
)
const { data: methodIndexDocs } = await useAsyncData(
    'skotselmetod-index',
    () => queryCollection('skotselmetodSections').where('section', '=', 'om_metoden').all()
)
const { data: methodImpactDocs } = await useAsyncData(
    'skotselmetod-impact-index',
    () => queryCollection('skotselmetodSections').where('section', '=', 'paverkan_pa_svamp').all()
)
if (!page.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Page not found',
        fatal: true
    })
}
const faktaDoc = computed(() => (skogsskotselInfo.value ?? []).find(doc => doc.key === 'fakta') ?? null)
const underlagDoc = computed(() => (skogsskotselInfo.value ?? []).find(doc => doc.key === 'underlag') ?? null)
interface Method {
    index?: number
    id: string
    title: string
    image: string
    shortdescription: string
    type?: string
    icon?: string
    impactLabel?: string
    impactTone?: 'low' | 'medium' | 'high'
    impactColor?: string
}

const methods = computed<Method[]>(() => {
    const list = (methodIndexDocs.value as any[]) || []
    const impacts = (methodImpactDocs.value as any[]) || []
    const impactByMethod = new Map<string, any>()
    for (const doc of impacts) {
        if (doc?.methodId) impactByMethod.set(doc.methodId, doc)
    }
    return list
        .map(doc => ({
            index: doc.index,
            id: doc.methodId,
            title: doc.methodTitle ?? doc.title ?? doc.methodId,
            image: doc.image ?? '',
            shortdescription: doc.shortdescription ?? '',
            type: doc.type,
            icon: doc.icon,
            impactLabel: impactByMethod.get(doc.methodId)?.impactLabel ?? '',
            impactTone: impactByMethod.get(doc.methodId)?.impactTone ?? 'medium',
            impactColor: impactByMethod.get(doc.methodId)?.impactTone === 'low'
                ? 'success'
                : impactByMethod.get(doc.methodId)?.impactTone === 'high'
                    ? 'error'
                    : 'warning',
        }))
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
})
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
    shortdescription: ''
}
const selectedId = ref<string | null>(null)
const goToMethod = (id: string) => {
    selectedId.value = id
    navigateTo({ path: `/skogsskotsel/${id}` }, { replace: true, external: false, scroll: false })
}

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
            goToMethod(methods.value[value].id)
        }
    }
})
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
