<template>
  <figure class="w-full" aria-labelledby="species-counts-title">


    <div class="mb-4 flex flex-wrap gap-2" role="group" aria-label="Välj värden som visas i diagrammet">
      <UButton v-for="item in series" :key="item.key" color="neutral" variant="outline" size="sm"
        class="gap-2 rounded-full transition-colors" :class="isSeriesActive(item.key)
          ? 'bg-white text-neutral-800'
          : 'bg-neutral-100 text-neutral-400 opacity-60'" :aria-pressed="isSeriesActive(item.key)"
        @click="toggleSeries(item.key)">
        <span class="size-3 rounded-sm transition-opacity"
          :class="isSeriesActive(item.key) ? 'opacity-100' : 'opacity-30'" :style="{ backgroundColor: item.color }"
          aria-hidden="true" />
        <span>{{ item.label }}</span>
      </UButton>
    </div>

    <ClientOnly>
      <div class="species-counts-chart" @click="handleAxisClick">
        <VisXYContainer :data="chartData" :height="430" :padding="{ top: 10, right: 24, bottom: 8, left: 8 }"
          :x-domain="xDomain" :y-domain="[-0.5, chartData.length - 0.5]" :y-direction="Direction.South">
          <VisTooltip :triggers="tooltipTriggers" :follow-cursor="true" />
          <VisGroupedBar :x="rowAccessor" :y="valueAccessors" :color="barColors" :orientation="Orientation.Horizontal"
            :group-padding="0.28" :bar-padding="0.08" :group-max-width="62" :bar-min-height="0" :rounded-corners="3" />
          <VisAxis type="x" label="Antal arter" :tick-format="formatAxisValue" :grid-line="true" :domain-line="false" />
          <VisAxis type="y" :tick-values="yTickValues" :tick-format="formatGroup" :grid-line="false"
            :domain-line="false" />
        </VisXYContainer>
      </div>
    </ClientOnly>
    <figcaption class="my-4">
      <!-- <h2 id="species-counts-title" class="text-lg font-semibold text-neutral-900">
        Antal svampar, djur och växter i Sverige och världen
      </h2> -->
      <p class="mt-1 max-w-3xl text-sm text-neutral-600">
        Diagrammet visar antal svampar, djur och växter i Sverige och världen. Klicka på värdena för att anpassa skalan.
      </p>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Direction, GroupedBar, Orientation } from '@unovis/ts'
import { VisAxis, VisGroupedBar, VisTooltip, VisXYContainer } from '@unovis/vue'

type SpeciesDatum = {
  key: GroupKey
  icon: string
  row: number
  group: string
  sweden: number
  describedWorldwide: number
  estimatedWorldwide: number
  estimatedLabel: string
}

type SeriesKey = 'sweden' | 'describedWorldwide' | 'estimatedWorldwide'
type GroupKey = 'fungi' | 'vertebrates' | 'invertebrates' | 'plants'

const chartData: SpeciesDatum[] = [
  {
    key: 'fungi',
    icon: '🍄',
    row: 0,
    group: 'Svampar (inkl. lavar)',
    sweden: 15_000,
    describedWorldwide: 160_000,
    estimatedWorldwide: 5_000_000,
    estimatedLabel: '2-5 miljoner'
  },
  {
    key: 'vertebrates',
    icon: '🦌',
    row: 1,
    group: 'Ryggradsdjur',
    sweden: 500,
    describedWorldwide: 75_000,
    estimatedWorldwide: 80_500,
    estimatedLabel: '80 500'
  },
  {
    key: 'invertebrates',
    icon: '🐞',
    row: 2,
    group: 'Ryggradslösa djur',
    sweden: 40_000,
    describedWorldwide: 1_500_000,
    estimatedWorldwide: 8_500_000,
    estimatedLabel: '8,5 miljoner'
  },
  {
    key: 'plants',
    icon: '🌿',
    row: 3,
    group: 'Växter',
    sweden: 2_000,
    describedWorldwide: 425_000,
    estimatedWorldwide: 450_000,
    estimatedLabel: '450 000'
  }
]

const series: Array<{ key: SeriesKey, label: string, color: string }> = [
  { key: 'sweden', label: 'Kända arter i Sverige', color: '#f0b100' },
  { key: 'describedWorldwide', label: 'Beskrivna arter i världen', color: '#8e51ff' },
  { key: 'estimatedWorldwide', label: 'Uppskattat totalt i världen', color: '#4d7c0f' }
]

const activeKeys = ref<SeriesKey[]>(series.map(item => item.key))
const activeGroups = ref<GroupKey[]>(chartData.map(item => item.key))
const activeSeries = computed(() => series.filter(item => activeKeys.value.includes(item.key)))
const barColors = computed(() => activeSeries.value.map(item => item.color))
const rowAccessor = (datum: SpeciesDatum) => datum.row
const valueAccessors = computed(() => activeSeries.value.map(item => (datum: SpeciesDatum) => (
  activeGroups.value.includes(datum.key) ? datum[item.key] : 0
)))
const yTickValues = chartData.map(datum => datum.row)
const xDomain = computed<[number, number]>(() => {
  const enabledData = chartData.filter(datum => activeGroups.value.includes(datum.key))
  const maximum = Math.max(1, ...enabledData.flatMap(datum => activeSeries.value.map(item => datum[item.key])))
  return [0, maximum * 1.16]
})

let labelAnimationFrame: number | undefined

function isSeriesActive(key: SeriesKey) {
  return activeKeys.value.includes(key)
}

function toggleSeries(key: SeriesKey) {
  if (isSeriesActive(key)) {
    if (activeKeys.value.length === 1) return
    activeKeys.value = activeKeys.value.filter(activeKey => activeKey !== key)
  } else {
    activeKeys.value = [...activeKeys.value, key]
  }

  scheduleChartDecorations()
}

function toggleGroup(key: GroupKey) {
  activeGroups.value = activeGroups.value.includes(key)
    ? activeGroups.value.filter(activeKey => activeKey !== key)
    : [...activeGroups.value, key]

  scheduleChartDecorations()
}

function scheduleChartDecorations() {
  nextTick(() => {
    if (labelAnimationFrame !== undefined) cancelAnimationFrame(labelAnimationFrame)
    const startedAt = performance.now()

    const animate = () => {
      syncAxisTickStyles()
      syncValueLabels()
      if (performance.now() - startedAt < 700) {
        labelAnimationFrame = requestAnimationFrame(animate)
      } else {
        labelAnimationFrame = undefined
      }
    }

    labelAnimationFrame = requestAnimationFrame(animate)
  })
}

function syncAxisTickStyles() {
  document.querySelectorAll<SVGGElement>('.species-counts-chart .tick').forEach((tick) => {
    const row = (tick as SVGGElement & { __data__?: number }).__data__
    const datum = typeof row === 'number' ? chartData.find(item => item.row === row) : undefined
    const text = tick.querySelector<SVGTextElement>('text')
    const isGroupLabel = datum && text?.textContent?.includes(datum.group.split(' ')[0] ?? '')

    if (datum && text && isGroupLabel) {
      tick.classList.add('is-species-group')
      tick.classList.toggle('is-disabled-group', !activeGroups.value.includes(datum.key))
    }
  })
}

function syncValueLabels() {
  const groups = document.querySelectorAll<SVGGElement>(
    `.species-counts-chart .${GroupedBar.selectors.barGroup}`
  )

  groups.forEach((group) => {
    const datum = (group as SVGGElement & { __data__?: SpeciesDatum }).__data__
    if (!datum || !activeGroups.value.includes(datum.key)) {
      group.querySelectorAll('.species-count-value').forEach(label => label.remove())
      return
    }

    const visibleSeries = new Set(activeSeries.value.map(item => item.key))
    group.querySelectorAll<SVGTextElement>('.species-count-value').forEach((label) => {
      if (!visibleSeries.has(label.dataset.series as SeriesKey)) label.remove()
    })

    group.querySelectorAll<SVGGraphicsElement>(`.${GroupedBar.selectors.bar}`).forEach((bar, index) => {
      const selectedSeries = activeSeries.value[index]
      if (!selectedSeries) return

      const value = datum[selectedSeries.key]
      if (value <= 0) return

      const bounds = bar.getBBox()
      let label = group.querySelector<SVGTextElement>(`.species-count-value[data-series="${selectedSeries.key}"]`)

      if (!label) {
        label = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        label.classList.add('species-count-value')
        label.dataset.series = selectedSeries.key
        label.setAttribute('dominant-baseline', 'middle')

        const forwardHover = (type: 'mouseover' | 'mousemove' | 'mouseout') => (event: MouseEvent) => {
          event.stopPropagation()
          bar.dispatchEvent(new MouseEvent(type, {
            bubbles: true,
            clientX: event.clientX,
            clientY: event.clientY
          }))
        }

        label.addEventListener('mouseenter', forwardHover('mouseover'))
        label.addEventListener('mousemove', forwardHover('mousemove'))
        label.addEventListener('mouseleave', forwardHover('mouseout'))
        group.appendChild(label)
      }

      label.setAttribute('x', `${bounds.x + bounds.width + 7}`)
      label.setAttribute('y', `${bounds.y + bounds.height / 2}`)
      label.textContent = formatAxisValue(value)
    })
  })
}

onMounted(scheduleChartDecorations)

onBeforeUnmount(() => {
  if (labelAnimationFrame !== undefined) cancelAnimationFrame(labelAnimationFrame)
})

function handleAxisClick(event: MouseEvent) {
  const target = event.target
  if (!(target instanceof Element)) return

  const tick = target.closest('.tick') as (Element & { __data__?: number }) | null
  const row = tick?.__data__
  const label = target.closest('text')?.textContent ?? ''
  const rowDatum = typeof row === 'number' ? chartData.find(item => item.row === row) : undefined
  const datum = rowDatum && label.includes(rowDatum.group.split(' ')[0] ?? '')
    ? rowDatum
    : chartData.find(item => label.includes(item.group) || label.includes(item.group.split(' ')[0] ?? ''))

  if (datum) toggleGroup(datum.key)
}

function formatGroup(row: number) {
  const datum = chartData[row]
  if (!datum) return ''
  return `${datum.icon} ${datum.group}`
}

function formatAxisValue(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString('sv-SE', { maximumFractionDigits: 1 })} milj.`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toLocaleString('sv-SE', { maximumFractionDigits: 0 })} 000`
  }
  return value.toLocaleString('sv-SE', { maximumFractionDigits: 0 })
}

function formatSpeciesCount(value: number) {
  return Math.round(value).toLocaleString('sv-SE')
}

function tooltipContent(datum: SpeciesDatum, index: number) {
  if (!activeGroups.value.includes(datum.key)) return null

  const selectedSeries = activeSeries.value[index % activeSeries.value.length]
  if (!selectedSeries) return null

  const value = selectedSeries.key === 'estimatedWorldwide'
    ? datum.estimatedLabel
    : formatSpeciesCount(datum[selectedSeries.key])

  return `
    <div style="max-width: 280px">
      <div style="font-size: 14px; font-weight: 600">${datum.group}</div>
      <div style="font-size: 12px; color: #737373; margin-top: 3px">${selectedSeries.label}</div>
      <div style="font-size: 13px; font-weight: 600; margin-top: 7px">${value} arter</div>
    </div>
  `
}

const tooltipTriggers = {
  [GroupedBar.selectors.bar]: tooltipContent
}
</script>

<style scoped>
.species-counts-chart :deep(.tick.is-species-group text) {
  cursor: pointer;
}

.species-counts-chart :deep(.tick.is-disabled-group text) {
  opacity: 0.5 !important;
}

.species-counts-chart :deep(.species-count-value) {
  fill: #525252;
  font-size: 11px;
  font-weight: 500;
  cursor: default;
  pointer-events: auto;
}
</style>
