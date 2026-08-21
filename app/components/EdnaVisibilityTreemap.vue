<template>
  <section class="w-full">
    <div class="my-5">
      <h2 class="text-lg font-semibold text-neutral-900">Mykorrhizasvamparnas synlighet</h2>
      <p class="mt-1 max-w-2xl text-sm text-neutral-600">
        Diagrammet visar vilka mykorrhizasvampar som är väl synliga och vilka som är svåra att upptäcka. Underlaget
        bygger på eDNA-analyser av markprover från Markinventeringen.
      </p>
    </div>

    <div class="my-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label v-for="selector in selectors" :key="selector.key" class="space-y-1.5">
        <span class="text-xs font-medium text-neutral-600">{{ selector.label }}</span>
        <USelect v-model="selection[selector.key]" :items="selector.items" class="w-full" value-key="value"
          label-key="label" variant="outline" />
      </label>
    </div>

    <div class="my-4 flex flex-wrap gap-x-8 gap-y-3 text-sm text-neutral-600">
      <div v-for="item in legendItems" :key="item.label" class="flex items-center gap-2">
        <span class="size-3 shrink-0 rounded-sm" :style="{ backgroundColor: item.color }" aria-hidden="true" />
        <span>{{ item.label }} ({{ item.count }} {{ item.count === 1 ? 'art' : 'arter' }})</span>
      </div>
    </div>

    <div v-if="pending && !chartData.length" class="flex h-96 items-center justify-center text-sm text-neutral-500">
      Laddar eDNA-data…
    </div>

    <div v-else-if="errorMessage && !chartData.length"
      class="flex h-96 items-center justify-center text-sm text-red-600">
      {{ errorMessage }}
    </div>

    <figure v-else-if="chartData.length" aria-labelledby="edna-visibility-treemap-title">
      <figcaption id="edna-visibility-treemap-title" class="sr-only">
        {{ chartData.length }} svamparter grupperade efter synlighet
      </figcaption>

      <ClientOnly>
        <div ref="treemapWrapper" class="relative" @click="selectedSpecies = null">
          <div v-if="pending"
            class="pointer-events-none absolute right-3 top-3 z-20 rounded-full bg-white/90 px-3 py-1.5 text-xs text-neutral-600 shadow-sm ring ring-neutral-200">
            Uppdaterar…
          </div>
          <div v-else-if="errorMessage"
            class="pointer-events-none absolute right-3 top-3 z-20 rounded-full bg-red-50/95 px-3 py-1.5 text-xs text-red-700 shadow-sm ring ring-red-200">
            {{ errorMessage }}
          </div>

          <VisSingleContainer :data="chartData" :height="420">
            <VisTreemap :id="idAccessor" :value="valueAccessor" :layers="treemapLayers" :tileColor="tileColor"
              :tileLabel="tileLabel" :tilePadding="3" :tileBorderRadius="4" :labelOffsetX="7" :labelOffsetY="7"
              :labelInternalNodes="false" :enableLightnessVariance="false" :enableTileLabelFontSizeVariation="false"
              :tileShowHtmlTooltip="false" :showTileClickAffordance="true" :events="treemapEvents" />
          </VisSingleContainer>

          <div v-if="selectedSpecies"
            class="pointer-events-none absolute z-20 max-w-64 rounded-lg bg-white px-3 py-2 text-sm shadow-lg ring ring-neutral-200"
            :style="tooltipStyle" role="tooltip">
            <div class="flex items-start gap-2.5">
              <img :src="mushroomGroupIcon(selectedSpecies)" :alt="`${mushroomGroup(selectedSpecies)}-ikon`"
                class="size-8 shrink-0 object-contain">
              <div class="min-w-0">
                <strong class="block text-neutral-900">{{ speciesName(selectedSpecies) }}</strong>
                <em v-if="selectedSpecies.Scientificname" class="block text-xs text-neutral-500">
                  {{ selectedSpecies.Scientificname }}
                </em>
                <span class="mt-1 block text-xs text-neutral-600">
                  Påträffad i {{ valueAccessor(selectedSpecies) }} av {{ totalSampleCount(selectedSpecies) }} prover
                </span>
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>
    </figure>

    <div v-else class="flex h-96 items-center justify-center text-sm text-neutral-500">
      Inga arter hittades för den valda miljön.
    </div>
  </section>
</template>

<script setup lang="ts">
import { Treemap, type TreemapNode } from '@unovis/ts'
import { VisSingleContainer, VisTreemap, VisTreemapSelectors } from '@unovis/vue'
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import validCombinationsData from '~/data/validCombinations.json'
import {
  forestTypeOptions,
  geographyOptions,
  standAgeOptions,
  vegetationTypeOptions
} from '~/stores/envParamsStore'

type SelectionKey = 'geography' | 'forestType' | 'standAge' | 'vegetationType'

type EdnaCombination = {
  geo: string
  forest: string
  age: string
  veg: string
}

type SelectOption = {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

type EdnaSpecies = {
  SpeciesCode?: string
  Scientificname?: string
  Commonname?: string
  sample_plot_count?: number | string
  sample_env_count?: number | string
  synlighet?: number | string | null
  'Svamp-grupp-släkte'?: string | null
  'Svamp-grupp'?: string | null
}

const selection = reactive<Record<SelectionKey, string>>({
  geography: 'Söder',
  forestType: 'Tallskog',
  standAge: '41-90',
  vegetationType: 'Örter_grupp'
})

const chartData = ref<EdnaSpecies[]>([])
const pending = ref(true)
const errorMessage = ref('')
const treemapWrapper = ref<HTMLElement | null>(null)
const selectedSpecies = ref<EdnaSpecies | null>(null)
const tooltipPosition = reactive({ left: 0, top: 0 })
const validCombinations = validCombinationsData as EdnaCombination[]

const combinationKeyBySelection: Record<SelectionKey, keyof EdnaCombination> = {
  geography: 'geo',
  forestType: 'forest',
  standAge: 'age',
  vegetationType: 'veg'
}

const baseOptions: Record<SelectionKey, SelectOption[]> = {
  geography: geographyOptions,
  forestType: forestTypeOptions,
  standAge: standAgeOptions,
  vegetationType: vegetationTypeOptions
}

const visibilityColors: Record<string, string> = {
  'Svampar som är svåra att se': '#d1bba0',
  'Svampar som syns': '#a37153',
  'Synlighet saknas': '#d4d4d4'
}

const speciesTileColor = '#f8f5f1'

const mushroomGroupIconFiles: Record<string, string> = {
  ovrigt: 'ovrigt.webp',
  hattsvamp: 'hattsvamp.png',
  kantarell: 'kantarell.webp',
  sopp: 'sopp.png',
  taggsvamp: 'taggsvamp.png',
  fingersvamp: 'fingersvamp.webp',
  tryffel: 'tryffel.webp',
  skinnsvamp: 'skinnsvamp.webp',
  skinnsvampar: 'skinnsvamp.webp',
  skalsvamp: 'skalsvamp.webp'
}

const legendItems = computed(() => Object.entries(visibilityColors).map(([label, color]) => ({
  label,
  color,
  count: chartData.value.filter(datum => visibilityGroup(datum) === label).length
})))

function optionIsAvailable(key: SelectionKey, value: string) {
  return validCombinations.some((combination) =>
    (Object.keys(selection) as SelectionKey[]).every((selectionKey) => {
      const combinationKey = combinationKeyBySelection[selectionKey]
      return combination[combinationKey] === (selectionKey === key ? value : selection[selectionKey])
    })
  )
}

function optionsFor(key: SelectionKey) {
  return baseOptions[key].map(option => ({
    ...option,
    disabled: !optionIsAvailable(key, option.value)
  }))
}

const selectors = computed(() => [
  { key: 'geography' as const, label: 'Geografi', items: optionsFor('geography') },
  { key: 'forestType' as const, label: 'Skogstyp', items: optionsFor('forestType') },
  { key: 'standAge' as const, label: 'Beståndsålder', items: optionsFor('standAge') },
  { key: 'vegetationType' as const, label: 'Vegetationstyp', items: optionsFor('vegetationType') }
])

function visibilityGroup(datum: EdnaSpecies) {
  if (datum.synlighet === 1 || datum.synlighet === '1') return 'Svampar som syns'
  if (datum.synlighet === 0 || datum.synlighet === '0') return 'Svampar som är svåra att se'
  return 'Synlighet saknas'
}

function speciesName(datum: EdnaSpecies) {
  return datum.Commonname?.trim() || datum.Scientificname?.trim() || 'Okänd art'
}

function speciesKey(datum: EdnaSpecies) {
  return datum.SpeciesCode?.trim() || datum.Scientificname?.trim() || speciesName(datum)
}

const treemapLayers = [
  (datum: EdnaSpecies) => visibilityGroup(datum),
  (datum: EdnaSpecies) => speciesKey(datum)
]

const idAccessor = (datum: EdnaSpecies) => speciesKey(datum)
const valueAccessor = (datum: EdnaSpecies) => Number(datum.sample_plot_count) || 0
const totalSampleCount = (datum: EdnaSpecies) => Number(datum.sample_env_count) || 0

function normalizeKey(value: string) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}+/gu, '')
}

function mushroomGroup(datum: EdnaSpecies) {
  return datum['Svamp-grupp-släkte'] || datum['Svamp-grupp'] || 'övrigt'
}

function mushroomGroupIcon(datum: EdnaSpecies) {
  const filename = mushroomGroupIconFiles[normalizeKey(mushroomGroup(datum))] || 'default-icon.png'
  return `/images/svampgrupp/${filename}`
}

function tileColor(node: TreemapNode<EdnaSpecies>) {
  if (node.depth === 1) {
    return visibilityColors[String(node.data.key || '')] || '#d4d4d4'
  }
  return speciesTileColor
}

function tileLabel(node: TreemapNode<EdnaSpecies>) {
  if (node.depth === 1) return ''

  const datum = node.data.datum
  if (!datum) return ''
  const tileWidth = Math.max(0, node.x1 - node.x0)
  const tileHeight = Math.max(0, node.y1 - node.y0)
  return tileWidth >= 18 && tileHeight >= 18 ? ' ' : ''
}

const tooltipStyle = computed(() => ({
  left: `${tooltipPosition.left}px`,
  top: `${tooltipPosition.top}px`,
  transform: 'translate(-50%, calc(-100% - 10px))'
}))

function showSpeciesTooltip(node: TreemapNode<EdnaSpecies>, event: MouseEvent) {
  event.stopPropagation()
  const datum = node.data.datum
  if (!datum) {
    selectedSpecies.value = null
    return
  }

  const bounds = treemapWrapper.value?.getBoundingClientRect()
  if (!bounds) return

  selectedSpecies.value = datum
  tooltipPosition.left = Math.max(90, Math.min(bounds.width - 90, event.clientX - bounds.left))
  tooltipPosition.top = Math.max(70, event.clientY - bounds.top)
}

function setTileHoverOpacity(node: TreemapNode<EdnaSpecies>, event: MouseEvent, opacity: number) {
  if (!node.data.datum) return
  const tile = event.currentTarget as SVGRectElement | null
  if (!tile) return
  tile.style.transition = 'opacity 150ms ease'
  tile.style.opacity = String(opacity)
}

const treemapEvents = {
  [Treemap.selectors.tile]: {
    click: showSpeciesTooltip,
    mouseenter: (node: TreemapNode<EdnaSpecies>, event: MouseEvent) => setTileHoverOpacity(node, event, 0.65),
    mouseleave: (node: TreemapNode<EdnaSpecies>, event: MouseEvent) => setTileHoverOpacity(node, event, 1)
  }
}

let iconSyncFrame = 0
let iconSyncTimer: ReturnType<typeof setTimeout> | null = null

function applyMushroomGroupIcons() {
  const root = treemapWrapper.value
  if (!root) return

  root.querySelectorAll('.edna-visibility-species-icon').forEach(element => element.remove())

  const tileGroups = Array.from(root.querySelectorAll(`.${VisTreemapSelectors.tileGroup}`)) as SVGGElement[]
  tileGroups.forEach((tileGroup) => {
    const node = (tileGroup as SVGGElement & { __data__?: TreemapNode<EdnaSpecies> }).__data__
    if (!node || node.depth !== 2) return

    const datum = node.data.datum
    const tileWidth = Math.max(0, node.x1 - node.x0)
    const tileHeight = Math.max(0, node.y1 - node.y0)
    if (!datum || tileWidth <= 2 || tileHeight <= 2) return

    const iconSize = Math.min(22, tileWidth - 2, tileHeight - 2)
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image')
    image.setAttribute('href', mushroomGroupIcon(datum))
    image.setAttribute('x', String(node.x0 + (tileWidth - iconSize) / 2))
    image.setAttribute('y', String(node.y0 + (tileHeight - iconSize) / 2))
    image.setAttribute('width', String(iconSize))
    image.setAttribute('height', String(iconSize))
    image.setAttribute('class', 'edna-visibility-species-icon')
    image.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    image.setAttribute('pointer-events', 'none')
    tileGroup.appendChild(image)
  })
}

async function scheduleIconSync() {
  await nextTick()
  if (iconSyncFrame) cancelAnimationFrame(iconSyncFrame)
  iconSyncFrame = requestAnimationFrame(applyMushroomGroupIcons)
  if (iconSyncTimer) clearTimeout(iconSyncTimer)
  iconSyncTimer = setTimeout(applyMushroomGroupIcons, 250)
}

let requestId = 0

async function loadChartData() {
  const currentRequestId = ++requestId
  pending.value = true
  errorMessage.value = ''
  selectedSpecies.value = null

  const filename = `edna-${selection.geography}-${selection.forestType}-${selection.standAge}-${selection.vegetationType}.json`

  try {
    const rows = await $fetch<EdnaSpecies[]>(`/edna/${filename}`)
    if (currentRequestId !== requestId) return

    chartData.value = rows
      .filter(row => valueAccessor(row) > 0)
      .sort((a, b) => valueAccessor(b) - valueAccessor(a) || speciesName(a).localeCompare(speciesName(b), 'sv'))
  } catch {
    if (currentRequestId !== requestId) return
    errorMessage.value = 'Det gick inte att läsa eDNA-data för den valda miljön.'
  } finally {
    if (currentRequestId === requestId) pending.value = false
  }
}

onMounted(loadChartData)

onBeforeUnmount(() => {
  if (iconSyncFrame) cancelAnimationFrame(iconSyncFrame)
  if (iconSyncTimer) clearTimeout(iconSyncTimer)
})

watch(
  () => [selection.geography, selection.forestType, selection.standAge, selection.vegetationType],
  loadChartData
)

watch(
  [chartData, pending],
  () => {
    if (!pending.value && chartData.value.length) scheduleIconSync()
  },
  { flush: 'post' }
)
</script>
