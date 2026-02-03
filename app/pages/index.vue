<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const { data: page } = await useAsyncData('index', () => queryCollection('index').first())
const { data: skotselMethodIndex } = await useAsyncData(
  'landing-skogsskotsel-metoder',
  () => queryCollection('skotselmetodSections').where('section', '=', 'om_metoden').all()
)

type StackCard = { image: string; title?: string }

const stackImages = ref<StackCard[]>([])
let rotateTimer: number | null = null
const currentImageIndex = ref(0)
const currentImage = computed(() => stackImages.value[currentImageIndex.value] ?? null)
const progressKey = ref(0)
const imageSectionRef = ref<HTMLElement | null>(null)
const isImageInView = ref(false)

const buildStack = () => {
  const docs = (skotselMethodIndex.value as any[]) || []
  const imgs = docs.map(doc => {
    const base = (doc.image || '').split('/').pop() || ''
    const name = base.replace(/\.[^.]+$/, '')
    const webPath = name ? `/images/metoder/web/${name}_1000.webp` : doc.image
    return {
      image: webPath,
      title: doc.methodTitle ?? doc.title
    }
  })
  stackImages.value = imgs.length ? [...imgs] : []
  currentImageIndex.value = 2
  if (stackImages.value.length && isImageInView.value) {
    restartProgress()
  }
}

watch(skotselMethodIndex, buildStack, { immediate: true })

const restartProgress = () => {
  progressKey.value += 1
}

const cycleStack = () => {
  if (stackImages.value.length <= 1) return
  currentImageIndex.value = (currentImageIndex.value + 1) % stackImages.value.length
  restartProgress()
}

const startTimer = () => {
  if (rotateTimer || !isImageInView.value) return
  restartProgress()
  rotateTimer = window.setInterval(cycleStack, 15000)
}

const stopTimer = () => {
  if (!rotateTimer) return
  window.clearInterval(rotateTimer)
  rotateTimer = null
}

useIntersectionObserver(imageSectionRef, ([entry]) => {
  const visible = entry?.isIntersecting ?? false
  if (visible && !isImageInView.value) {
    isImageInView.value = true
    startTimer()
  } else if (!visible && isImageInView.value) {
    isImageInView.value = false
    stopTimer()
  }
}, { threshold: 0.4 })

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})

useSeoMeta({
  titleTemplate: '',
  title: page.value?.title,
  ogTitle: page.value?.title,
  description: page.value?.description,
  ogDescription: page.value?.description
})

const heroDescriptionParts = computed(() => {
  const desc = page.value?.hero?.description || ''
  const needle = 'mykorrhizasvampar'
  const idx = desc.toLowerCase().indexOf(needle)
  if (idx === -1) return { before: desc, after: '' }
  return {
    before: desc.slice(0, idx),
    after: desc.slice(idx + needle.length),
  }
})
</script>

<template>
  <div v-if="page">
    <div class="bg-neutral-50 border-b border-neutral-100">
      <UPageHero :ui="{
        container: 'py-12',
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
          <p class="max-w-3xl mx-auto text-lg text-neutral-700 sm:leading-8 leading-7">
            {{ heroDescriptionParts.before }}
            <UPopover :ui="{ content: 'ring-muted/50' }">
              <span class="text-primary font-semibold cursor-help">mykorrhizasvampar</span>
              <!-- <UBadge label="mykorrhizasvampar" color="neutral" variant="outline" class="cursor-pointer" size="xl" /> -->
              <template #content>
                <div v-if="page.hero.mykorrhiza" class="p-4 max-w-xs">
                  <span class="font-semibold">{{ page.hero.mykorrhiza.title }}</span>
                  <span class="text-muted ml-1">{{ page.hero.mykorrhiza.body }}</span>
                </div>
              </template>
            </UPopover>
            {{ heroDescriptionParts.after }}
          </p>
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
        <div v-if="stackImages.length" ref="imageSectionRef"
          class="relative w-full max-w-3xl ml-auto flex flex-col items-center group">
          <div class="relative w-full" style="padding-top: 60%">
            <Transition name="fade-slow" mode="out-in" appear>
              <img :key="currentImageIndex" :src="currentImage?.image"
                class="rounded-xl ring ring-muted/50 shadow-lg w-full h-full object-cover absolute inset-0" />
            </Transition>
          </div>
          <div v-if="stackImages.length" class="mt-3 w-full flex justify-end px-4">
            <div class="w-full max-w-3xl ml-auto bg-gray-200 dark:bg-gray-700 h-0.5 rounded overflow-hidden">
              <div :key="progressKey" class="h-1 bg-primary-500 rounded"
                :class="isImageInView ? 'animate-progress' : ''">
              </div>
            </div>
          </div>
          <div v-if="currentImage?.title"
            class="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">

            <UBadge variant="outline" color="neutral" :label="currentImage.title" class="ring-muted/50" />
          </div>
        </div>


      </UPageSection>
    </Motion>
    <Motion :initial="{ opacity: 0, transform: 'translateY(20px)' }"
      :while-in-view="{ opacity: 1, transform: 'translateY(0)' }" :in-view-options="{ once: true }"
      :transition="{ duration: 0.6, delay: 0.3 }">
      <div class="w-full bg-neutral-50 border-y border-muted/50">


        <UPageSection v-if="page.press" :title="page.press.title" :description="page.press.description"
          :ui="{ container: '', title: 'text-start lg:text-center', description: 'text-start lg:text-center text-pretty' }">
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
      </div>
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

.fade-slow-enter-active,
.fade-slow-leave-active {
  transition: opacity 0.8s ease-in-out;
}

.fade-slow-enter-from,
.fade-slow-leave-to {
  opacity: 0;
}

@keyframes progressAnimation {
  from {
    width: 0%;
  }

  to {
    width: 100%;
  }
}

.animate-progress {
  width: 100%;
  animation: progressAnimation 15s linear forwards;
}
</style>
