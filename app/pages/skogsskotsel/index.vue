<template>
    <div class="flex-1 transition-all" :class="selectedMethod.id ? '' : ''" v-if="page">






        <UContainer v-if="!selectedMethod.id" class="w-full px-0">
            <div class=" pb-0">
                <NuxtImg v-if="isMobile" src="/images/Landing/Stock Photo 563535222.jpeg"
                    class=" shadow ring ring-muted/50 w-full aspect-video object-cover " />
            </div>
            <UPageHero :ui="{ container: 'pt-0 py-12 pb-6 lg:py-24 lg:pb-6', title: 'sm:text-7xl' }"
                :title="page.hero.title" :description="page.hero.description"
                :orientation="isMobile ? 'horizontal' : 'vertical'" class="" :headline="isMobile ? 'Skogsskötsel' : ''">
            </UPageHero>
            <!-- <UPageHeader :title="page.hero.title" :description="page.hero.description" headline="Skogsskötsel"
                :ui="{ title: 'text-4xl' }" /> -->

        </UContainer>

        <UContainer class="w-full py-2">
            <div class="lg:flex w-full justify-center">
                <UTabs v-model="indexTab" :items="indexTabItems" size="lg" :ui="{
                    root: '',
                    list: 'flex-nowrap gap-2 bg-transparent',
                    indicator: 'bg-white border border-muted/50 shadow',
                    trigger: 'data-[state=active]:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                }" class="lg:w-fit" />
            </div>

        </UContainer>
        <UContainer v-if="indexTab === 'methods'"
            class="w-full flex flex-col lg:flex-row justify-between py-4 sm:py-8  sm:gap-7 overflow-x-auto transition-all overflow-visible"
            :class="[selectedMethod.id ? 'mt-0 flex-row' : ' flex-col gap-3']">
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
                    'shrink-0 lg:shrink w-full transition-all group border-muted/50 lg:p-0 rounded-md bg-muted lg:bg-transparent p-2.5 h-fit  relative cursor-pointer',
                    !selectedId ? 'opacity-100' : (selectedId === method.id ? 'opacity-100 ring-primary/40 shadow-lg' : 'opacity-50')
                ]">

                    <template v-if="!selectedMethod.id">
                        <div class="flex lg:block ">
                            <img :src="methodImage(method, 'card')" :alt="method.title" width="300" height="160"
                                class="h-18 w-26 object-cover rounded-sm lg:rounded-lg ring ring-muted/50 hover:ring-neutral-200 shadow group-hover:shadow-lg transition-all lg:w-full lg:h-full"
                                loading="lazy" decoding="async" />
                            <div :class="[
                                'mx-4 lg:mx-0 lg:p-2  w-full',
                                idx < methods.length - 1 ? ' border-muted/30  lg:border-b-0 lg:pb-0 lg:mb-0' : ''
                            ]">
                                <h1 class="text-lg lg:text-lg font-medium text-neutral-800 text-nowrap ">{{ method.title
                                }}</h1>
                                <p class="text-muted text-sm mb-1">{{ method.shortdescription }}</p>
                                <UBadge v-if="method.type" :label="method.type" color="primary" variant="soft"
                                    size="sm" />
                            </div>
                        </div>
                    </template>
                </div>
            </Motion>
        </UContainer>
        <UContainer v-if="indexTab === 'video'" class="w-full py-4">
            <div
                class="border border-dashed border-muted/60 rounded-xl bg-muted/20 min-h-64 flex items-center justify-center">
                <p class="text-muted">Introduktionsvideo kommer här</p>
            </div>
        </UContainer>

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

definePageMeta({
    scrollToTop: true,
    pageTransition: false,
    key: () => 'skogsskotsel-index',
})

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
