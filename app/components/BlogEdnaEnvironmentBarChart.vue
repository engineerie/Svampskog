<template>
  <figure class="w-full" aria-labelledby="blog-edna-chart-title">
    <div class="mb-5">
      <h2 id="blog-edna-chart-title" class="text-lg font-semibold text-neutral-900">
        Mykorrhizasvampar i norra Sveriges tallskogar
      </h2>
      <p class="mt-1 max-w-3xl text-sm text-neutral-600">
        Diagrammet omfattar tallskogar i alla åldrar med lingon- och fattigristyper i fältskiktet. Varje stapel
        motsvarar en art och höjden visar i hur många av de undersökta skogarna arten hittades.
      </p>
    </div>



    <div class="mt-6">
      <div class="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <p class="text-sm font-medium text-neutral-800">
          {{ chartData.length.toLocaleString('sv-SE') }} arter
        </p>
        <p v-if="sampleCount" class="text-xs text-neutral-500">
          Baserat på {{ sampleCount.toLocaleString('sv-SE') }} skogar
        </p>
      </div>

      <div ref="chartHost" class="w-full min-w-0 overflow-hidden">
        <ClientOnly>
          <VisXYContainer v-if="chartData.length" :data="chartData" :width="chartWidth" :height="200">
            <VisStackedBar :x="xAccessor" :y="yAccessor" :color="colorAccessor" :bar-padding="0.1"
              :rounded-corners="2" />
            <VisAnnotations :items="annotationItems" />
            <VisAxis type="y" label="Förekomst" :grid-line="false" />
          </VisXYContainer>
          <p v-if="chartData.length" class="mt-1 text-center text-sm font-medium text-[var(--vis-axis-label-color)]">
            Arter
          </p>

          <div v-else-if="isLoading" class="flex h-64 items-center justify-center">
            <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin text-neutral-400" />
          </div>

          <p v-else class="flex h-64 items-center justify-center text-sm text-neutral-500">
            Det finns inga eDNA-data för den valda miljön.
          </p>
        </ClientOnly>
      </div>
    </div>
    <UCarousel v-slot="{ item: image }" :items="images" arrows dots
      class="mt-5 pb-7 md:hidden" aria-label="Bilder av svampsamhälle och vanliga arter"
      :ui="{ item: 'basis-full', prev: 'start-2', next: 'end-2' }">
      <figure class="min-w-0">
        <div class="overflow-hidden rounded-lg ring-1 ring-muted/50">
          <NuxtImg :src="image.src" :alt="image.alt" class="aspect-16/10 size-full object-cover" width="805"
            height="505" />
        </div>
        <figcaption class="mt-2 text-sm font-medium text-neutral-700">
          {{ image.caption }}
        </figcaption>
      </figure>
    </UCarousel>

    <div class="mt-5 hidden gap-4 md:grid md:grid-cols-3">
      <figure v-for="image in images" :key="image.src" class="min-w-0">
        <div class="overflow-hidden rounded-lg ring-1 ring-muted/50">
          <NuxtImg :src="image.src" :alt="image.alt" class="aspect-16/10 size-full object-cover" width="805"
            height="505" />
        </div>
        <figcaption class="mt-2 text-sm font-medium text-neutral-700">
          {{ image.caption }}
        </figcaption>
      </figure>
    </div>
  </figure>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useElementSize } from '@vueuse/core'
import { VisAnnotations, VisAxis, VisStackedBar, VisXYContainer } from '@unovis/vue'

type RawSpeciesDatum = {
  Scientificname?: string
  Commonname?: string
  sample_plot_count: number
  sample_env_count?: number
  [key: string]: unknown
}
type SpeciesDatum = RawSpeciesDatum & { fillColor: string }

const environment = {
  geography: 'Norr',
  forestType: 'Tallskog',
  standAge: 'allaåldrar',
  vegetationType: 'Lingon_grupp'
} as const

const chartData = ref<SpeciesDatum[]>([])
const isLoading = ref(false)
const chartHost = ref<HTMLElement | null>(null)
const { width: hostWidth } = useElementSize(chartHost)

const images = [
  {
    src: '/images/EDNA_bilder_skog/Norr_Tallskog_allaåldrar_Lingon_grupp.png',
    alt: 'Tallskog i norra Sverige med lingon-fattigristyp och träd i alla åldrar',
    caption: 'Svampsamhälle'
  },
  {
    src: '/images/Svampkunskap/7.SamhallenAvMykorrhizasvamp/Sandsopp.jpg',
    alt: 'Sandsopp',
    caption: 'Sandsopp'
  },
  {
    src: '/images/Svampkunskap/7.SamhallenAvMykorrhizasvamp/tegelkremla.jpg',
    alt: 'Tegelkremla',
    caption: 'Tegelkremla'
  }
]

const chartWidth = computed(() => Math.max(320, Math.floor(hostWidth.value || 0)))
const sampleCount = computed(() => Number(chartData.value[0]?.sample_env_count || 0))
const annotationItems = computed(() => {
  const maximum = Math.max(1, ...chartData.value.map(datum => Number(datum.sample_plot_count || 0)))
  const lastIndex = Math.max(1, chartData.value.length - 1)

  return [
    { commonName: 'sandsopp', label: 'Sandsopp', offsetX: 8, offsetY: 9 },
    { commonName: 'tegelkremla', label: 'Tegelkremla', offsetX: 10, offsetY: -14 }
  ].flatMap((annotation) => {
    const index = chartData.value.findIndex(
      datum => String(datum.Commonname || '').toLowerCase() === annotation.commonName
    )
    if (index < 0) return []

    const datum = chartData.value[index]
    if (!datum) return []
    const subjectX = index / lastIndex * 100
    const subjectY = (1 - Number(datum.sample_plot_count || 0) / maximum) * 100

    return [{
      x: `${Math.min(90, subjectX + annotation.offsetX)}%` as `${number}%`,
      y: `${Math.max(5, Math.min(90, subjectY + annotation.offsetY))}%` as `${number}%`,
      width: 90,
      content: {
        text: annotation.label,
        fontSize: 12,
        fontWeight: 600,
        color: '#525252'
      },
      subject: {
        x: `${subjectX}%` as `${number}%`,
        y: `${subjectY}%` as `${number}%`,
        radius: 3,
        fillColor: '#ffffff',
        strokeColor: '#525252',
        connectorLineColor: '#737373'
      }
    }]
  })
})
const xAccessor = (_datum: SpeciesDatum, index: number) => index
const yAccessor = (datum: SpeciesDatum) => Number(datum.sample_plot_count || 0)
const colorAccessor = (datum: SpeciesDatum) => datum.fillColor

function generateGrayColors(steps: number) {
  if (steps <= 0) return []
  return Array.from({ length: steps }, (_, index) => {
    const progress = steps === 1 ? 0 : index / (steps - 1)
    const channel = Math.round(82 + (212 - 82) * progress)
    return `rgb(${channel}, ${channel}, ${channel})`
  })
}

function generateRainbowColors(steps: number) {
  return Array.from({ length: steps }, (_, index) => {
    const progress = steps === 1 ? 0 : index / (steps - 1)
    return `hsl(${(45 + 300 * progress) % 360}, 70%, 50%)`
  })
}

let requestId = 0
async function loadChartData() {
  const currentRequest = ++requestId
  isLoading.value = true
  const { geography, forestType, standAge, vegetationType } = environment
  const filename = `edna-${geography}-${forestType}-${standAge}-${vegetationType}.json`

  try {
    const rows = await $fetch<RawSpeciesDatum[]>(`/edna/${filename}`)
    if (currentRequest !== requestId) return

    const sortedRows = [...rows].sort((a, b) => Number(b.sample_plot_count) - Number(a.sample_plot_count))
    const grayCount = Math.floor(sortedRows.length * 0.2)
    const colors = [
      ...generateGrayColors(grayCount),
      ...generateRainbowColors(sortedRows.length - grayCount)
    ]

    chartData.value = sortedRows.map((datum, index) => ({
      ...datum,
      fillColor: colors[index] || 'var(--ui-primary)'
    }))
  } catch {
    if (currentRequest === requestId) chartData.value = []
  } finally {
    if (currentRequest === requestId) isLoading.value = false
  }
}

onMounted(loadChartData)
</script>
