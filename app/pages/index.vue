<script setup lang="ts">
import { computed, ref } from 'vue'

const { data: page } = await useAsyncData('index', () => queryCollection('index').first())
const { data: forestryPage } = await useAsyncData('landing-skogsskotsel', () => queryCollection('skogsskotsel').first())

const trakthyggeHover = ref(false)
const trakthyggeImage = '/images/metoder/kalhygge.png'
const trakthyggePoints = [
  { age: -7, value: 100 },
  { age: 0, value: 100 },
  { age: 0.1, value: 5 },
  { age: 10, value: 15 },
  { age: 20, value: 60 },
  { age: 30, value: 120 },
  { age: 40, value: 123 },
  { age: 50, value: 121 },
  { age: 60, value: 120 },
  { age: 70, value: 115 },
  { age: 80, value: 112 },
  { age: 90, value: 110 },
  { age: 100, value: 110 },
]

const trakthyggePath = computed(() => {
  const minAge = -7
  const maxAge = 100
  const maxVal = 130
  const width = 420
  const height = 250
  const topPad = 12
  const bottomPad = 16
  const leftPad = 0
  const rightPad = 0
  const usableHeight = height - topPad - bottomPad
  const usableWidth = width - leftPad - rightPad
  const normalizeX = (age: number) => leftPad + ((age - minAge) / (maxAge - minAge)) * usableWidth
  const normalizeY = (val: number) => height - bottomPad - (Math.max(val, 0) / maxVal) * usableHeight
  const pts = trakthyggePoints.map(p => ({
    x: normalizeX(p.age),
    y: normalizeY(p.value),
    age: p.age,
  }))

  if (!pts.length) return ''

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))
  const toStr = (p: { x: number; y: number }) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`
  let d = `M ${toStr(pts[0])}`

  const tension = 0.1

  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1]
    const p1 = pts[i]
    const isSharpDrop = p0.age === 0 && p1.age === 0.1
    if (isSharpDrop) {
      d += ` L ${toStr(p1)}`
      continue
    }

    const pPrev = pts[i - 2] ?? p0
    const pNext = pts[i + 1] ?? p1

    const cp1x = p0.x + (p1.x - pPrev.x) * tension
    const cp1yRaw = p0.y + (p1.y - pPrev.y) * tension
    const cp2x = p1.x - (pNext.x - p0.x) * tension
    const cp2yRaw = p1.y - (pNext.y - p0.y) * tension

    const minY = Math.min(p0.y, p1.y)
    const maxY = Math.max(p0.y, p1.y)
    const cp1y = clamp(cp1yRaw, minY, maxY)
    const cp2y = clamp(cp2yRaw, minY, maxY)

    d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${toStr(p1)}`
  }

  return d
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

<style scoped>
@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}

.trak-line {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: drawLine 1.8s ease forwards;
}

.grid-fade {
  opacity: 0;
  animation: fadeGrid 0.6s ease forwards;
}

.trak-area {
  opacity: 0.75;
}

@keyframes fadeGrid {
  from {
    opacity: 0;
  }

  to {
    opacity: 0.4;
  }
}
</style>

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
          <p class="max-w-3xl mx-auto text-lg text-neutral-700 sm:leading-8 leading-7">
            {{ heroDescriptionParts.before }}
            <UPopover :ui="{ content: 'ring-muted/50' }">
              <span class="text-primary font-semibold cursor-help">mykorrhizasvampar</span>
              <!-- <UBadge label="mykorrhizasvampar" color="neutral" variant="outline" class="cursor-pointer" size="xl" /> -->
              <template #content>
                <div class="p-4 max-w-xs">
                  <span class="font-semibold ">Mykorrhizasvampar är svampar som lever i symbios med träd. </span>
                  <span class="text-muted">Symbiosen innebär att svamparna får sin energi från träden och i utbyte
                    sköter
                    de om trädens
                    näringsförsörjning.</span>
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
        <div class="relative inline-block">
          <NuxtImg :src="trakthyggeImage" alt="Trakthygge" height="450" width="750"
            class="rounded-xl ring ring-muted/50 shadow-lg transition-all duration-500 w-full max-w-none overflow-hidden"
            :class="trakthyggeHover ? 'opacity-50' : 'opacity-100'" @mouseenter="trakthyggeHover = true"
            @mouseleave="trakthyggeHover = false" />
          <svg v-if="trakthyggeHover" class="absolute inset-0 w-full h-full pointer-events-none rounded-xl"
            viewBox="0 0 420 250" fill="none">
            <defs>
              <linearGradient id="trak-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="##cbd5e1" stop-opacity="1" />
                <stop offset="100%" stop-color="#5a3f34" stop-opacity="0.1" />
              </linearGradient>
              <mask id="trak-reveal">
                <rect x="0" y="0" height="250" width="0" fill="white">
                  <animate attributeName="width" from="0" to="420" dur="1.8s" begin="0.5s" fill="freeze" />
                </rect>
              </mask>
            </defs>
            <path v-if="trakthyggePath" :d="trakthyggePath + ' L 420 250 L 0 250 Z'" fill="url(#trak-gradient)"
              class="trak-area" mask="url(#trak-reveal)" />
            <path v-if="trakthyggePath" :d="trakthyggePath" opacity="1" stroke="#5a3f34" stroke-width="2"
              stroke-linejoin="round" stroke-linecap="round" fill="none" mask="url(#trak-reveal)" />
          </svg>
        </div>
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
