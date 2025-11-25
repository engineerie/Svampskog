<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useMediaQuery } from '@vueuse/core'

const { data: page } = await useAsyncData('index', () => queryCollection('index').first())
const { data: forestryPage } = await useAsyncData('landing-skogsskotsel', () => queryCollection('skogsskotsel').first())

type StackCard = { image: string; title?: string }

const stackImages = ref<StackCard[]>([])
let rotateTimer: number | null = null

const buildStack = () => {
  const imgs =
    forestryPage.value?.methods?.slice(0, 5).map(method => ({
      image: method.image,
      title: method.title
    })) ?? []
  stackImages.value = imgs.length ? [...imgs].reverse() : []
}

watch(forestryPage, buildStack, { immediate: true })

const hoveredStackIndex = ref<number | null>(null)
const fadingKey = ref<string | null>(null)
let isCycling = false
const isDesktop = useMediaQuery('(min-width: 768px)')
const cardVars = computed(() => {
  const layers = Math.max(stackImages.value.length - 1, 0)
  return {
    '--card-w': isDesktop.value ? 'clamp(220px, 30vw, 380px)' : 'clamp(200px, 70vw, 260px)',
    '--card-h': 'calc(var(--card-w) * 0.6)',
    '--offset-x': isDesktop.value ? 'calc(var(--card-w) * 0.1)' : 'calc(var(--card-w) * 0.08)',
    '--offset-y': isDesktop.value ? 'calc(var(--card-w) * 0.075)' : 'calc(var(--card-w) * 0.06)',
    height: `calc(var(--card-h) + ${layers} * var(--offset-y) + 12px)`
  } as Record<string, string>
})

const cycleStack = () => {
  if (stackImages.value.length <= 1 || isCycling) return
  isCycling = true
  const frontIndex = stackImages.value.length - 1
  fadingKey.value = stackImages.value[frontIndex]?.image ?? null

  window.setTimeout(() => {
    const item = stackImages.value.pop()
    if (item) {
      stackImages.value.unshift(item)
    }
  }, 500)

  window.setTimeout(() => {
    fadingKey.value = null
    isCycling = false
  }, 1100)
}

onMounted(() => {
  rotateTimer = window.setInterval(cycleStack, 15000)
})

onUnmounted(() => {
  if (rotateTimer) {
    window.clearInterval(rotateTimer)
  }
})

const cardHoverStyles = (index: number) => {
  const baseX = `calc(var(--offset-x) * ${index})`
  const baseY = `calc(var(--offset-y) * ${index})`
  const isHovered = hoveredStackIndex.value === index
  const isDimmed = hoveredStackIndex.value !== null && hoveredStackIndex.value !== index
  const isFading = fadingKey.value === stackImages.value[index]?.image

  return {
    transform: `translate(${baseX}, ${baseY}) translateY(${isHovered ? '-12px' : '0'}) `,
    filter: isDimmed ? 'brightness(0.55)' : 'none',
    opacity: isFading ? 0 : 1,
    zIndex: index + 1,
    transition: 'transform 650ms ease, opacity 650ms ease, filter 650ms ease, box-shadow 650ms ease',
    boxShadow: isHovered ? '0 12px 32px rgba(0,0,0,0.18)' : '0 6px 16px rgba(0,0,0,0.10)'
  }
}

useSeoMeta({
  titleTemplate: '',
  title: page.value?.title,
  ogTitle: page.value?.title,
  description: page.value?.description,
  ogDescription: page.value?.description
})

</script>

<template>
  <div v-if="page">
    <div class="bg-neutral-50 border-b border-neutral-100">
      <UPageHero :ui="{
        container: '',
      }" :title="page.hero.title" :description="page.hero.description" :links="page.hero.links"
        orientation="horizontal">
        <template #headline v-if="page.hero.headline.label">
          <NuxtLink :to="page.hero.headline.to">
            <UBadge :icon="page.hero.headline.icon" :label="page.hero.headline.label" :color="page.hero.headline.color"
              variant="subtle" size="lg" trailing :ui="{ base: 'rounded-full' }" />
          </NuxtLink>
        </template>

        <template #title>
          <MDC :value="page.hero.title" class="*:leading-13 sm:*:leading-19 max-w-3xl mx-auto  " />
        </template>
        <template #description>
          <MDC :value="page.hero.description" class="*:leading-7  sm:*:leading-8 max-w-3xl mx-auto " />
        </template>
        <template #links>
          <UButton v-for="link in page.hero.links" :label="link.label" :icon="link.icon" :color="link.color"
            :variant="link.variant" :size="link.size" :to="link.to" :target="link.target" />
        </template>
        <Motion :initial="{
          opacity: 0,
          transform: 'translateY(10px)'
          // filter: 'blur(20px)'
        }" :animate="{
          opacity: 1,
          transform: 'translateY(0px)'
          // filter: 'blur(0px)'
        }" :transition="{
          duration: 0.5,
          delay: 0.2
        }">
          <NuxtImg src="/images/Landing/boleto_small.png" width="750" height="1050" quality="80" format="webp"
            class=" sm:-mt-90 -mb-32 -mt-10 sm:-mb-80" />
        </Motion>

      </UPageHero>
    </div>
    <!-- <div class="page-section ">
    </div> -->
    <Motion :initial="{ opacity: 0, transform: 'translateY(20px)' }"
      :while-in-view="{ opacity: 1, transform: 'translateY(0)' }" :in-view-options="{ once: true }"
      :transition="{ duration: 0.6, delay: 0.3 }">

      <UPageSection v-if="page?.sections?.[0]" :title="page.sections[0].title"
        :description="page.sections[0].description" :headline="page.sections[0].headline"
        :orientation="page.sections[0].orientation" :reverse="page.sections[0].reverse" :links="page.sections[0].links">
        <LandingSpeciesGrid :filterEdible="true" />
      </UPageSection>
    </Motion>
    <Motion :initial="{ opacity: 0, transform: 'translateY(20px)' }"
      :while-in-view="{ opacity: 1, transform: 'translateY(0)' }" :in-view-options="{ once: true }"
      :transition="{ duration: 0.6, delay: 0.3 }">
      <UPageSection v-if="page?.sections?.[1]" :title="page.sections[1].title"
        :description="page.sections[1].description" :headline="page.sections[1].headline"
        :orientation="page.sections[1].orientation" :links="page.sections[1].links">
        <div v-if="stackImages.length" class="pointer-events-none sm:pointer-events-auto relative w-full"
          :style="cardVars">
          <div v-for="(item, index) in stackImages" :key="item.image" class="absolute top-0 left-0 rounded-lg" :style="{
            ...cardHoverStyles(index),
            width: 'var(--card-w)',
            height: 'var(--card-h)'
          }" @mouseenter="hoveredStackIndex = index" @mouseleave="hoveredStackIndex = null">
            <Transition name="fade-delay" mode="out-in">
              <div v-if="hoveredStackIndex === index"
                class="absolute -top-10 left-0 bg-white text-neutral-900 px-3 py-1 rounded-lg text-sm font-medium pointer-events-none">
                {{ item.title }}
              </div>
            </Transition>
            <Motion v-if="isDesktop" class="shadow-lg rounded-lg ring ring-muted/50 overflow-hidden ">
              <NuxtImg :src="item.image" width="1000" height="600" format="webp" class="w-full h-full object-cover" />
            </Motion>
            <div v-else class="shadow-lg rounded-lg ring ring-muted/50 overflow-hidden w-full h-full">
              <NuxtImg :src="item.image" width="1000" height="600" format="webp" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        <NuxtImg v-else :src="page.sections[1].src" width="1000" type="webp"
          class="rounded-md border border-neutral-200" />
      </UPageSection>
    </Motion>
    <Motion :initial="{ opacity: 0, transform: 'translateY(20px)' }"
      :while-in-view="{ opacity: 1, transform: 'translateY(0)' }" :in-view-options="{ once: true }"
      :transition="{ duration: 0.6, delay: 0.3 }">
      <UPageSection v-if="page.press" :title="page.press.title" :description="page.press.description"
        :ui="{ container: 'bg-neutral-50 lg:rounded-2xl ring ring-neutral-100 py-12 sm:py-16 lg:py-20 my-4 sm:my-8 lg:my-10', title: 'text-start lg:text-center', description: 'text-start lg:text-center text-pretty' }">
        <UPageColumns>
          <Motion v-for="(article, index) in page.press.items" :key="index"
            :initial="{ opacity: 0, transform: 'translateY(20px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateY(0)' }" :in-view-options="{ once: true }"
            :transition="{ delay: 0.2 }">
            <UPageCard :title="article.title"
              class="rounded-xl ring-0 border border-muted/50 bg-white hover:bg-white shadow-md hover:shadow-lg"
              :description="article.description"
              :ui="{ description: 'before:content-[open-quote] after:content-[close-quote]', header: 'w-full' }"
              :to="article.url">
              <template #header>
                <div class="flex justify-between">
                  <UIcon v-if="article.icon" :name="article.icon" class="text-4xl" />
                  <UBadge v-if="article.badge" :label="article.badge.label" size="md"
                    :color="article.badge.color || 'neutral'" variant="subtle" class="h-fit" />
                </div>
                <h1 class="text-sm mt-2">{{ article.publicationDate }} | {{ article.publication }}</h1>
              </template>
            </UPageCard>
          </Motion>
        </UPageColumns>
      </UPageSection>
    </Motion>
    <Motion :initial="{ opacity: 0, transform: 'translateY(20px)' }"
      :while-in-view="{ opacity: 1, transform: 'translateY(0)' }" :in-view-options="{ once: true }"
      :transition="{ duration: 0.6, delay: 0.3 }">
      <UPageSection v-if="page.timeline" :title="page.timeline.title" :description="page.timeline.description"
        :ui="{ container: 'flex-col', title: 'text-start lg:text-center', description: 'text-start lg:text-center text-pretty' }">
        <UTimeline :default-value="2" :items="page.timeline.items" size="3xl" orientation="vertical" :ui="{
          root: 'lg:flex-row lg:w-full',
          item: 'lg:flex-col',
          container: 'lg:flex-row',
          separator: 'lg:h-0.5 lg:w-auto',
          wrapper: 'lg:pe-8.5 lg:mt-0 lg:pb-0'
        }" />
      </UPageSection>
    </Motion>
    <Motion :initial="{ opacity: 0, transform: 'translateY(20px)' }"
      :while-in-view="{ opacity: 1, transform: 'translateY(0)' }" :in-view-options="{ once: true }"
      :transition="{ duration: 0.6, delay: 0.3 }">
      <Finansiering>
        <template v-if="page.financing" #headline>
          <h1 class="text-lg text-center font-semibold text-neutral-900 my-12 sm:my-18">
            {{ page.financing.headline }}
          </h1>
        </template>
        <template v-if="page.financing" #logos>
          <NuxtImg v-for="(logo, index) in page.financing.logos" :key="index" :src="logo.src" :alt="logo.alt || ''"
            :height="logo.height" :width="logo.width" />
        </template>
        <template v-if="page.financing" #details>
          <li v-for="(note, index) in page.financing.notes" :key="index">
            {{ note }}
          </li>
        </template>
      </Finansiering>
    </Motion>
  </div>
</template>

<style>
.fade-delay-enter-active,
.fade-delay-leave-active {
  transition: opacity 0.25s ease 0.12s;
}

.fade-delay-enter-from,
.fade-delay-leave-to {
  opacity: 0;
}
</style>
