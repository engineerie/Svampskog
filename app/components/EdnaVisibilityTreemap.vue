<template>
  <section class="w-full">
    <!-- <div class="my-5">
      <h2 class="text-lg font-semibold text-neutral-900">Mykorrhizasvamparnas synlighet</h2>

    </div> -->



    <div class="my-4">
      <div class="flex w-full justify-between items-center gap-2">


        <p class=" text-sm text-neutral-700">
          <span class="font-medium text-neutral-900">Aktuell miljö:</span> {{ currentEnvironmentLabel }}
        </p>
        <UPopover class="hidden md:block" :content="{ align: 'end', side: 'bottom' }">
          <UButton label="Byt miljö" color="neutral" variant="outline" class="ring-muted/50" />

          <template #content>
            <div class="grid w-96 gap-3 p-4 sm:grid-cols-2">
              <label v-for="selector in selectors" :key="selector.key" class="space-y-1.5">
                <span class="text-xs font-medium text-neutral-600">{{ selector.label }}</span>
                <USelect v-model="selection[selector.key]" :items="selector.items" class="w-full" value-key="value"
                  label-key="label" variant="outline" />
              </label>
            </div>
          </template>
        </UPopover>

        <UDrawer class="md:hidden" title="Byt miljö" :ui="{ title: 'text-xl' }">
          <UButton label="Byt miljö" color="neutral" variant="outline" class="ring-muted/50" />

          <template #body>
            <div class="grid gap-4">
              <label v-for="selector in selectors" :key="selector.key" class="space-y-1.5">
                <span class="text-sm font-medium text-neutral-700">{{ selector.label }}</span>
                <USelect v-model="selection[selector.key]" :items="selector.items" class="w-full" size="xl"
                  value-key="value" label-key="label" variant="outline" />
              </label>
            </div>
          </template>
        </UDrawer>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-600">
        <div class="flex flex-wrap items-center gap-1">
          <span>Urvalet baseras på {{ sampleCount || '…' }} provtagna skogar.</span>
          <span v-if="sampleCount > 0 && sampleCount < 10"
            class="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 font-medium text-amber-700"
            role="status">
            <UIcon name="i-lucide-triangle-alert" class="size-4 shrink-0 text-amber-500" aria-hidden="true" />
            Lågt antal prover
          </span>
        </div>


      </div>
    </div>
    <div class="my-4 flex justify-end">
      <UTabs v-model="chartMode" :items="chartModeTabs" size="sm" :ui="{
        root: '',
        list: 'flex-nowrap gap-2 bg-transparent',
        indicator: 'bg-white border border-muted/50 shadow',
        trigger: 'data-[state=active]:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
      }" aria-label="Välj diagramtyp" />
    </div>
    <div v-if="pending && !chartData.length" class="flex h-96 items-center justify-center text-sm text-neutral-500">
      Laddar eDNA-data…
    </div>

    <div v-else-if="errorMessage && !chartData.length"
      class="flex h-96 items-center justify-center text-sm text-red-600">
      {{ errorMessage }}
    </div>

    <figure v-else-if="chartData.length" aria-labelledby="edna-visibility-chart-title">
      <figcaption id="edna-visibility-chart-title" class="sr-only">
        {{ chartData.length }} svamparter grupperade efter synlighet som {{ chartModeLabel }}
      </figcaption>

      <ClientOnly>
        <div v-if="chartMode === 'donut'">
          <div class="flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-10">
            <div class="w-full max-w-80" :style="donutLabelColors">
              <VisSingleContainer :data="donutData" :height="320">
                <VisDonut :id="donutIdAccessor" :value="donutValueAccessor" :color="donutColorAccessor" :radius="128"
                  :arc-width="54" :pad-angle="0.025" :corner-radius="4" :central-label="formatCount(chartData.length)"
                  central-sub-label="arter totalt" />
              </VisSingleContainer>
            </div>

            <div class="w-full max-w-sm text-sm text-neutral-700">
              <div class="grid gap-3" aria-label="Färgförklaring">
                <div v-for="item in legendItems" :key="item.label" class="flex items-center gap-3">
                  <span class="size-3 shrink-0 rounded-sm" :style="{ backgroundColor: item.color }"
                    aria-hidden="true" />
                  <span class="min-w-0 flex-1">{{ item.label }}</span>
                  <strong class="tabular-nums text-neutral-900">
                    {{ item.count }} {{ item.count === 1 ? 'art' : 'arter' }}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          <div class="w-full">
            <VisXYContainer :data="groupedBarData" :height="160" :padding="{ top: 12, right: 12, bottom: 8, left: 8 }">
              <VisStackedBar :x="barIndexAccessor" :y="valueAccessor" :color="speciesColorAccessor"
                :bar-padding="0.1" />
              <VisAxis type="y" label="Antal skogar" :grid-line="false" />
              <VisTooltip :triggers="speciesBarTooltipTriggers" :follow-cursor="true" />
            </VisXYContainer>
          </div>

          <div class="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm text-neutral-600" aria-label="Färgförklaring">
            <div v-for="item in legendItems" :key="item.label" class="flex items-center gap-2">
              <span class="size-3 shrink-0 rounded-sm" :style="{ backgroundColor: item.color }" aria-hidden="true" />
              <span>{{ item.label }} ({{ item.count }} {{ item.count === 1 ? 'art' : 'arter' }})</span>
            </div>
          </div>

          <p class="mt-3 text-sm text-neutral-500">
            Håll pekaren över en stapel för mer information om arten.
          </p>
        </div>

      </ClientOnly>
    </figure>

    <div v-else class="flex h-96 items-center justify-center text-sm text-neutral-500">
      Inga arter hittades för den valda miljön.
    </div>
    <div class="my-5">
      <!-- <h2 class="text-lg font-semibold text-neutral-900">Mykorrhizasvamparnas synlighet</h2> -->
      <p class="mt-1 max-w-2xl text-sm text-neutral-600">
        Diagrammet visar vilka mykorrhizasvampar som har fruktkroppar som syns och vilka som har små och ofta dolda
        fruktkroppar som är svåra att upptäcka. Underlaget bygger på de svampar som identifierats med eDNA-analyser av
        markprover från Markinventeringen.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { StackedBar } from '@unovis/ts'
import {
  VisAxis,
  VisDonut,
  VisSingleContainer,
  VisStackedBar,
  VisTooltip,
  VisXYContainer,
} from '@unovis/vue'
import { computed, onMounted, reactive, ref, watch } from 'vue'
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
const chartMode = ref<'donut' | 'bar'>('donut')
const chartModeTabs = [
  { label: 'Cirkeldiagram', value: 'donut', icon: 'i-lucide-chart-pie' },
  { label: 'Stapeldiagram', value: 'bar', icon: 'fluent:data-bar-vertical-20-regular' }
]
const chartModeLabel = computed(() => ({
  donut: 'donutdiagram',
  bar: 'stapeldiagram'
})[chartMode.value])
const pending = ref(true)
const errorMessage = ref('')
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
  'Svampar som syns': '#a37153'
}

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
type VisibilityDonutDatum = {
  id: string
  value: number
  color: string
}

const donutData = computed<VisibilityDonutDatum[]>(() => legendItems.value
  .filter(item => item.count > 0)
  .map(item => ({ id: item.label, value: item.count, color: item.color })))
const visibilityGroupOrder = Object.keys(visibilityColors)
const donutIdAccessor = (datum: VisibilityDonutDatum) => datum.id
const donutValueAccessor = (datum: VisibilityDonutDatum) => datum.value
const donutColorAccessor = (datum: VisibilityDonutDatum) => datum.color
const formatCount = (value: number) => value.toLocaleString('sv-SE')
const donutLabelColors = {
  '--vis-donut-central-label-text-color': '#171717',
  '--vis-donut-central-sub-label-text-color': '#737373'
}
type BarSpeciesDatum = EdnaSpecies & { barPosition: number }
const groupedBarData = computed<BarSpeciesDatum[]>(() => {
  let groupIndex = 0
  let previousGroup = ''

  return [...chartData.value]
    .sort((a, b) => {
      const groupDifference = visibilityGroupOrder.indexOf(visibilityGroup(a))
        - visibilityGroupOrder.indexOf(visibilityGroup(b))
      return groupDifference || valueAccessor(b) - valueAccessor(a)
    })
    .map((species, index) => {
      const group = visibilityGroup(species)
      if (index > 0 && group !== previousGroup) groupIndex += 1
      previousGroup = group
      return { ...species, barPosition: index + groupIndex * 2 }
    })
})
const barIndexAccessor = (datum: BarSpeciesDatum) => datum.barPosition
const speciesColorAccessor = (datum: EdnaSpecies) => visibilityColors[visibilityGroup(datum)]
const sampleCount = computed(() => Number(chartData.value[0]?.sample_env_count) || 0)

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
const currentEnvironmentLabel = computed(() => selectors.value
  .map(selector => selector.items.find(option => option.value === selection[selector.key])?.label)
  .filter((label): label is string => Boolean(label))
  .join(' · '))

function visibilityGroup(datum: EdnaSpecies) {
  if (datum.synlighet === 1 || datum.synlighet === '1') return 'Svampar som syns'
  if (datum.synlighet === 0 || datum.synlighet === '0') return 'Svampar som är svåra att se'
  return 'Synlighet saknas'
}

function speciesName(datum: EdnaSpecies) {
  return datum.Commonname?.trim() || datum.Scientificname?.trim() || 'Okänd art'
}

const valueAccessor = (datum: EdnaSpecies) => Number(datum.sample_plot_count) || 0
const totalSampleCount = (datum: EdnaSpecies) => Number(datum.sample_env_count) || 0

function resolveSpeciesDatum(payload: unknown): EdnaSpecies | null {
  if (Array.isArray(payload)) {
    for (const item of payload) {
      const species = resolveSpeciesDatum(item)
      if (species) return species
    }
    return null
  }
  if (!payload || typeof payload !== 'object') return null
  const candidate = payload as EdnaSpecies & { datum?: EdnaSpecies, data?: EdnaSpecies, original?: EdnaSpecies }
  if (candidate.Commonname || candidate.Scientificname) return candidate
  if (candidate.datum?.Commonname || candidate.datum?.Scientificname) return candidate.datum
  if (candidate.data?.Commonname || candidate.data?.Scientificname) return candidate.data
  if (candidate.original?.Commonname || candidate.original?.Scientificname) return candidate.original
  return null
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function speciesBarTooltip(payload: unknown) {
  const species = resolveSpeciesDatum(payload)
  if (!species) return ''
  const commonName = escapeHtml(speciesName(species))
  const scientificName = escapeHtml(species.Scientificname?.trim() || '')
  const groupIcon = escapeHtml(mushroomGroupIcon(species))
  return `
    <div style="display: flex; align-items: flex-start; gap: 10px; max-width: 280px">
      <img src="${groupIcon}" alt="" style="width: 34px; height: 34px; flex-shrink: 0; object-fit: contain" />
      <div>
        <div style="font-size: 14px; font-weight: 600">${commonName}</div>
        ${scientificName ? `<div style="font-size: 12px; color: #737373"><em>${scientificName}</em></div>` : ''}
        <div style="font-size: 12px; margin-top: 6px">Påträffad i ${valueAccessor(species)} av ${totalSampleCount(species)} prover</div>
      </div>
    </div>
  `
}

const speciesBarTooltipTriggers = {
  [StackedBar.selectors.bar]: speciesBarTooltip
}

function normalizeKey(value: string) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}+/gu, '')
}

function mushroomGroup(datum: EdnaSpecies) {
  return datum['Svamp-grupp-släkte'] || datum['Svamp-grupp'] || 'övrigt'
}

function mushroomGroupIconPath(group: string) {
  const filename = mushroomGroupIconFiles[normalizeKey(group)] || 'default-icon.png'
  return `/images/svampgrupp/${filename}`
}

function mushroomGroupIcon(datum: EdnaSpecies) {
  return mushroomGroupIconPath(mushroomGroup(datum))
}

let requestId = 0

async function loadChartData() {
  const currentRequestId = ++requestId
  pending.value = true
  errorMessage.value = ''
  const filename = `edna-${selection.geography}-${selection.forestType}-${selection.standAge}-${selection.vegetationType}.json`

  try {
    const rows = await $fetch<EdnaSpecies[]>(`/edna/${filename}`)
    if (currentRequestId !== requestId) return

    chartData.value = rows
      .filter(row => valueAccessor(row) > 0 && visibilityGroup(row) !== 'Synlighet saknas')
      .sort((a, b) => valueAccessor(b) - valueAccessor(a) || speciesName(a).localeCompare(speciesName(b), 'sv'))
  } catch {
    if (currentRequestId !== requestId) return
    errorMessage.value = 'Det gick inte att läsa eDNA-data för den valda miljön.'
  } finally {
    if (currentRequestId === requestId) pending.value = false
  }
}

onMounted(loadChartData)

watch(
  () => [selection.geography, selection.forestType, selection.standAge, selection.vegetationType],
  loadChartData
)

</script>
