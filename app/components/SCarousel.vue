<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, reactive, ref, useSlots, watch } from 'vue'
import { Motion } from 'motion-v'
import { useEventListener, useScrollLock } from '@vueuse/core'

interface CarouselItem {
  title?: string
  image?: string
  img?: string
  description?: string
  [key: string]: unknown
}

interface CarouselSection {
  title?: string
  description?: string
  items: CarouselItem[]
}

const props = defineProps<{
  section?: CarouselSection | null
  items?: CarouselItem[] | null
  title?: string
  description?: string
}>()

type Frame = {
  top: number
  left: number
  width: number
  height: number
}

const slides = computed<CarouselItem[]>(() => props.items ?? props.section?.items ?? [])
const slots = useSlots()
const hasCardSlot = computed(() => Boolean(slots.card))
const hasDetailsSlot = computed(() => Boolean(slots.details))
const hasHeaderSlot = computed(() => Boolean(slots.header))
const headingTitle = computed(() => props.section?.title ?? props.title ?? null)
const headingDescription = computed(() => props.section?.description ?? props.description ?? null)
const hasHeading = computed(() => Boolean(headingTitle.value || headingDescription.value || hasHeaderSlot.value))
const activeIndex = ref<number | null>(null)
const overlayVisible = ref(false)
const transition = { duration: 0.25, easing: 'easeInOut' as const }
const scrollLock = useScrollLock(process.client ? document.body : null)

const overlayState = reactive({
  initial: null as Frame | null,
  frame: null as Frame | null,
  source: null as HTMLElement | null,
  showBackdrop: false,
  showDetails: false,
  closing: false,
})

const slideRefs = ref<(HTMLElement | null)[]>([])
const carouselRef = ref<any>(null)

watch(slides, () => {
  slideRefs.value = []
})

const overlayInitial = computed(() => overlayState.initial)
const overlayAnimate = computed(() => overlayState.frame)
const backdropVisible = computed(() => overlayState.showBackdrop)
const detailsVisible = computed(() => overlayState.showDetails)
const overlayClosing = computed(() => overlayState.closing)
const currentItem = computed<CarouselItem | null>(() =>
  activeIndex.value === null ? null : slides.value[activeIndex.value] ?? null
)

function resolveImage(item: CarouselItem | null) {
  if (!item) {
    return ''
  }
  return (item.image ?? item.img ?? '') as string
}

function resolveDescription(item: CarouselItem | null) {
  if (!item) {
    return ''
  }
  return (item.description ?? '') as string
}

function cardImageClasses(item: CarouselItem | null) {
  const classes = ['w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]']
  const noBorder = typeof item?.['noBorder'] === 'boolean' ? (item?.['noBorder'] as boolean) : false
  if (!noBorder) {
    classes.push('ring ring-neutral-200 shadow')
  }
  return classes
}

function computeExpanded(rect: DOMRect) {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const padding = Math.min(0, Math.max(32, viewportWidth * 0.05))
  const aspect = rect.height / rect.width || 1

  let targetWidth = Math.min(viewportWidth - padding * 2, 800)
  let targetHeight = viewportHeight

  // if (targetHeight > viewportHeight - padding * 2) {
  //   targetHeight = viewportHeight - padding * 2
  //   targetWidth = targetHeight / aspect
  // }

  const left = (viewportWidth - targetWidth) / 2
  const top = 42

  return {
    top,
    left,
    width: targetWidth,
    height: targetHeight,
    // borderRadius: '32px'
  }
}

async function openCard(index: number, event: MouseEvent | KeyboardEvent) {
  if (overlayVisible.value || !slides.value[index]) {
    return
  }

  const target = event.currentTarget as HTMLElement | null
  if (!target) {
    return
  }

  const rect = target.getBoundingClientRect()
  overlayState.source = target
  overlayState.initial = {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  }
  overlayState.frame = { ...overlayState.initial }
  overlayState.showBackdrop = false
  overlayState.showDetails = false
  overlayState.closing = false
  activeIndex.value = index
  overlayVisible.value = true
  await nextTick()
  carouselRef.value?.emblaApi?.scrollTo(index)
  requestAnimationFrame(() => {
    overlayState.showBackdrop = true
    overlayState.frame = computeExpanded(rect)
    window.setTimeout(() => {
      if (overlayVisible.value && activeIndex.value === index) {
        overlayState.showDetails = true
      }
    }, transition.duration * 1000 * 0.6)
  })
}

function closeCard() {
  if (!overlayVisible.value) {
    return
  }
  overlayState.showDetails = false
  overlayState.closing = true
  overlayState.showBackdrop = false

  const rect = overlayState.source?.getBoundingClientRect()
  overlayState.frame = rect
    ? {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    }
    : overlayState.initial
  window.setTimeout(() => {
    overlayVisible.value = false
    activeIndex.value = null
    overlayState.initial = null
    overlayState.frame = null
    overlayState.source = null
    overlayState.showDetails = false
    overlayState.showBackdrop = false
    overlayState.closing = false
  }, transition.duration * 1000)
}

watch(overlayVisible, (isOpen) => {
  if (!process.client) {
    return
  }
  scrollLock.value = isOpen
  if (!isOpen) {
    overlayState.showBackdrop = false
    overlayState.showDetails = false
    overlayState.closing = false
  }
})

if (process.client) {
  useEventListener(window, 'keydown', (event) => {
    if (event.key === 'Escape') {
      closeCard()
    }
  })
}

onBeforeUnmount(() => {
  scrollLock.value = false
})

function setSlideRef(el: HTMLElement | null, index: number) {
  if (el) {
    slideRefs.value[index] = el
  }
}

function updateOverlayForIndex(index: number, animateFrame = false) {
  const el = slideRefs.value[index]
  if (!el) {
    return
  }
  const rect = el.getBoundingClientRect()
  overlayState.source = el
  overlayState.initial = {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  }
  if (animateFrame) {
    overlayState.frame = computeExpanded(rect)
  }
}

const hasMultipleSlides = computed(() => slides.value.length > 1)

function resolveAdjacentLabel(prefix: string, offset: number) {
  if (!hasMultipleSlides.value || activeIndex.value === null) {
    return null
  }
  const list = slides.value
  if (!list.length) {
    return null
  }
  const index = (activeIndex.value + offset + list.length) % list.length
  const title = list[index]?.title
  return title ? `${prefix}: ${title}` : prefix
}

const prevLabel = computed(() => resolveAdjacentLabel('Föregående', -1))
const nextLabel = computed(() => resolveAdjacentLabel('Nästa', 1))

function goToIndex(targetIndex: number) {
  const list = slides.value
  if (!list.length) {
    return
  }
  const nextIndex = (targetIndex + list.length) % list.length
  if (activeIndex.value === nextIndex) {
    return
  }
  overlayState.showDetails = false
  activeIndex.value = nextIndex
  nextTick(() => {
    carouselRef.value?.emblaApi?.scrollTo(nextIndex)
    requestAnimationFrame(() => {
      updateOverlayForIndex(nextIndex, true)
      overlayState.showDetails = true
    })
  })
}

function goNext() {
  if (activeIndex.value === null) {
    return
  }
  goToIndex(activeIndex.value + 1)
}

function goPrev() {
  if (activeIndex.value === null) {
    return
  }
  goToIndex(activeIndex.value - 1)
}
</script>

<template>
  <section v-if="slides.length" class="py-16 sm:py-20">
    <div class="px-0 mx-auto overflow-hidden">

      <UContainer v-if="hasHeading" class="mb-8 sm:mb-10 px-6">
        <slot v-if="hasHeaderSlot" name="header" :title="headingTitle" :description="headingDescription" />
        <template v-else>
          <h2 v-if="headingTitle" class="text-3xl font-semibold sm:text-4xl text-neutral-900">
            {{ headingTitle }}
          </h2>
          <p v-if="headingDescription" class="mt-2 text-neutral-600 max-w-2xl">
            {{ headingDescription }}
          </p>
        </template>
      </UContainer>
      <UContainer class="overflow-visible">


        <UCarousel v-if="slides.length" ref="carouselRef" :items="slides" arrows class="pb-6 mb-12"
          :ui="{ viewport: 'overflow-visible', container: '', item: 'basis-8/9 sm:basis-[350px]', controls: 'mt-12 flex justify-center', arrows: 'flex gap-4', prev: '!static !transform-none ring-0', next: '!static !transform-none ring-0' }"
          v-slot="{ item, index }">
          <button
            class="group relative w-full focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-primary transition-opacity"
            :aria-expanded="activeIndex === index" @click="openCard(index, $event)"
            @keyup.enter.prevent="openCard(index, $event)" @keyup.space.prevent="openCard(index, $event)"
            :ref="el => setSlideRef(el as HTMLElement | null, index)">
            <div
              class="relative overflow-hidden rounded border border-muted/50 bg-white group-hover:bg-neutral-50 cursor-pointer h-full"
              :class="activeIndex === index && (backdropVisible || overlayClosing) ? 'opacity-0 pointer-events-none delay-25' : 'opacity-100'">
              <slot v-if="hasCardSlot" name="card" :item="item" :index="index" :active="activeIndex === index" />
              <template v-else>
                <div class="">
                  <div class="relative overflow-hidden" v-if="resolveImage(item)">
                    <NuxtImg :src="resolveImage(item)" :alt="item.title || ''" fit="cover" width="500" height="300"
                      :class="cardImageClasses(item)" loading="lazy" decoding="async" />
                  </div>
                  <div class="p-4 space-y-2">
                    <h3 v-if="item.title" class="text-xl font-semibold text-neutral-900 text-start">
                      {{ item.title }}
                    </h3>
                  </div>
                </div>
              </template>
            </div>
          </button>
        </UCarousel>
      </UContainer>
    </div>

    <Teleport to="body">
      <div v-if="overlayVisible && overlayInitial && overlayAnimate"
        class="fixed inset-0 z-20 flex items-center justify-center">
        <Motion class="absolute inset-0 bg-white" :initial="{ opacity: 0 }"
          :animate="{ opacity: backdropVisible ? 1 : 0 }" :transition="{ duration: 0.2, ease: 'easeInOut' }"
          @click="closeCard" />
        <Motion
          class="bg-white overflow-y-auto rounded-xl border border-muted/50 fixed will-change-transform shadow-xl overlay-scrollbar"
          :initial="overlayInitial" :animate="overlayAnimate" :transition="transition" @click.stop>
          <div class="h-full w-full bg-white absolute">
            <div :class="detailsVisible ? 'p-0' : 'p-0'" class="transition-all">
              <NuxtImg v-if="currentItem && resolveImage(currentItem)" fit="cover" width="1000" height="600"
                :src="resolveImage(currentItem)" :alt="currentItem?.title ?? ''" class="w-full" loading="eager"
                decoding="async" />
              <div v-if="currentItem" class="pointer-events-none pb-18"
                :class="backdropVisible ? 'p-4 py-8 sm:p-10 sm:mx-auto sm:max-w-2xl' : 'mx-0 p-4 w-full'">
                <slot v-if="hasDetailsSlot" name="details" :item="currentItem" :index="activeIndex" />
                <template v-else>
                  <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                    <div class="transition-all ">
                      <h3 v-if="currentItem?.title" class="font-semibold text-neutral-900 transition-opacity"
                        :class="backdropVisible ? 'text-4xl mb-4 sm:text-5xl sm:mb-8 opacity-100 delay-75' : 'opacity-0 text-lg mb-0'">
                        {{ currentItem.title }}
                      </h3>
                      <MDC v-if="resolveDescription(currentItem)" :value="resolveDescription(currentItem)"
                        class="mt-2 max-w-2xl sm:text-lg text-neutral-500 transition-opacity duration-100"
                        :class="backdropVisible ? 'opacity-100 delay-100' : 'opacity-0'" />
                      <div v-if="currentItem.img2" class="flex justify-center my-18"
                        :class="backdropVisible ? 'opacity-100 delay-100' : 'opacity-0'">
                        <NuxtImg :src="currentItem.img2" class="rounded ring ring-muted/50" />
                      </div>
                    </div>
                  </div>
                  <USeparator class="my-8" />
                </template>
                <div v-if="hasMultipleSlides"
                  class="pointer-events-auto flex flex-row sm:items-center justify-center gap-3 sm:gap-2 pb-6 my-12"
                  :class="backdropVisible ? 'opacity-100 transition-opacity duration-300' : 'opacity-0'">
                  <UButton v-if="prevLabel" icon="i-heroicons-chevron-left" variant="soft" color="neutral"
                    class="justify-start whitespace-normal rounded-full" @click="goPrev" aria-label="Föregående"
                    size="xl" />
                  <UButton v-if="nextLabel" icon="i-heroicons-chevron-right" variant="soft" color="neutral"
                    class="justify-end text-left whitespace-normal rounded-full" trailing @click="goNext"
                    aria-label="Nästa" size="xl" />
                </div>
              </div>

            </div>
          </div>
          <UButton :class="backdropVisible ? 'opacity-100' : 'opacity-0'" aria-label="Stäng kort"
            class="fixed right-4 top-4 shadow hover:bg-white rounded-full md:m-0 transition-all" color="neutral"
            variant="soft" icon="heroicons:x-mark" size="xl" @click="closeCard" />
        </Motion>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.overlay-scrollbar {
  scrollbar-width: none;
}

.overlay-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
