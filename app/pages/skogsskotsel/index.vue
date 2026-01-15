<template>
    <div class="flex-1 transition-all" :class="selectedMethod.id ? '' : ''" v-if="page">






        <UContainer v-if="!selectedMethod.id" class="w-full px-0">
            <UPageHero :ui="{ container: 'py-20 pb-16 lg:py-24', title: 'sm:text-7xl', headline: 'text-neutral' }"
                :title="page.hero.title" :description="page.hero.description" :orientation="page.hero.orientation"
                class="">
            </UPageHero>
        </UContainer>
        <UContainer v-if="!isMobile"
            class="w-full flex flex-col sm:flex-row  justify-between py-4 gap-3 sm:gap-6 overflow-x-auto transition-all overflow-visible"
            :class="[selectedMethod.id ? 'mt-0 flex-row' : 'mt-8 flex-col']">
            <Motion v-for="method in methods" :key="method.id" class="relative" :initial="{
                scale: 1,
                transform: 'translateY(10px)',
                opacity: 0,
            }" :animate="{
                scale: 1,
                transform: 'translateY(0px)',
                opacity: 1,
            }" :transition="{
                duration: 0.3,
                delay: 0.5 + 0.05 * (method.index ?? 0)
            }">

                <div v-if="!selectedMethod.id" @click="goToMethod(method.id)" :class="[
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
                </div>
            </Motion>
        </UContainer>



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
            <UCarousel v-if="!selectedMethod.id" v-slot="{ item }" :items="methods" loop :speed="4"
                :ui="{ item: 'basis-3/5 md:basis-1/3 p-2' }" class="mobile-carousel">

                <div @click="goToMethod(item.id)" :class="[
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
                    <!-- <template v-else>
                        <div class="flex items-center gap-3 p-3">
                            <img v-if="selectedId === item.id" :src="methodImage(item, 'thumb')" :alt="item.title"
                                width="64" height="64" class="w-16 h-16 rounded-md object-cover ring-1 ring-muted/50"
                                loading="lazy" decoding="async" />
                            <h1 class="text-lg font-medium text-nowrap">{{ item.title }}</h1>
                        </div>
                    </template> -->
                </div>

            </UCarousel>
        </Motion>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useAsyncData, navigateTo } from '#app'

definePageMeta({
    scrollToTop: false,
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
const { data: methodsData } = await useAsyncData('skotselmetoder', () => queryCollection('skotselmetoder').first())
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
    icon?: string
}

const methods = computed<Method[]>(() => methodsData.value?.methods ?? [])
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
