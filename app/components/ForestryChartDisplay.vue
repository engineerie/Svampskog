<template>
  <div class="custom-area" ref="rootEl" :style="{ '--vis-area-stroke-color': parentStrokeColor }">
    <ClientOnly>
      <VisXYContainer v-if="isMounted && chartReady" :data="chartData" :height="200" :margin="margin" :xDomain="xDomain"
        :yDomain="yDomain">
        <template v-if="props.chartType === 'area' && props.singleFrameworkSelection">
          <VisArea :x="xAccessor" :y="stackedYAccessors" :color="stackedColors" :interpolateMissingData="true" />
          <VisCrosshair :template="crosshairTemplate" />
          <VisTooltip :horizontalShift="30" />
        </template>
        <template v-else-if="props.chartType === 'area'">
          <VisArea v-for="fw in activeFrameworks" :key="fw.key + '-area'" :x="xAccessor" :y="(d: any) => {
            const v = Number(d?.[fw.key])
            return Number.isFinite(v) ? v : NaN
          }" :color="() => (fw.colorArea || fw.color)" :interpolateMissingData="true" />
          <VisCrosshair :template="crosshairTemplate" />
          <VisTooltip :horizontalShift="30" />
        </template>
        <template v-else-if="props.chartType === 'bar'">
          <VisGroupedBar :color="computedLineColors" :x="xAccessor" :y="yAccessors" :groupPadding="0.5"
            :groupMaxWidth="20" />
        </template>
        <VisAxis :gridLine="true" type="x" :tickValues="[-5, 0, 1, 10, 20, 30, 40, 50, 60, 70, 80, 90]" :tickFormat="(val: number) => {
          if (val === -5) return 'före'
          if (val === 0) return ''
          if (val === 10) return ''
          if (val === 30) return ''
          if (val === 40) return ''
          if (val === 60) return ''
          if (val === 70) return ''
          if (val === 90) return ''
          return val + ' år'
        }" />
        <VisAxis type="y" />
      </VisXYContainer>
    </ClientOnly>
  </div>


</template>

<script setup lang="ts">

import { computed, ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { VisXYContainer, VisAxis, VisLine, VisArea, VisGroupedBar, VisBulletLegend, VisBrush, VisCrosshair, VisTooltip } from '@unovis/vue'
import type { BulletLegendItemInterface } from '@unovis/ts'
import { capitalize } from 'lodash-es'
import { useAsyncData } from '#app'

const { data: svamparDataDoc } = await useAsyncData('svampar-skogsbruk', () =>
  queryCollection('svamparSkogsbruk').first()
)

const { data: totalSvamparDataDoc } = await useAsyncData('total-svampar-skogsbruk', () =>
  queryCollection('totalSvamparSkogsbruk').first()
)

const dataset = computed(() => Array.isArray(svamparDataDoc.value?.entries) ? svamparDataDoc.value.entries : [])
const totalDataset = computed(() => Array.isArray(totalSvamparDataDoc.value?.entries) ? totalSvamparDataDoc.value.entries : [])


const yDomain = computed<[number, number] | undefined>(() => {
  const max = Number(props.maxYValue)
  return Number.isFinite(max) ? [0, max] : undefined
})

const xDomain = computed<[number, number]>(() => {
  const xs = chartData.value
    .map(d => Number(d?.age))
    .filter(v => Number.isFinite(v)) as number[]
  if (!xs.length) return [0, 1]
  return [Math.min(...xs), Math.max(...xs)]
})

const chartKey = computed(() => {
  return [
    (props.selectedFrameworks || []).join(','),
    props.selectedStartskog || '',
    props.chartType || '',
    props.singleFrameworkSelection ? 'S' : 'M',
    props.currentTimeValue || ''
  ].join('|')
})

const chartReady = computed(() => Array.isArray(chartData.value) && chartData.value.length > 0)

const stackedCategories = computed<string[]>(() => {
  if (!props.singleFrameworkSelection) return []
  return (props.selectedArtkategori || [])
    .map(a => (a || '').toLowerCase())
    .filter(a => !inactiveArtkategoriKeys.value.has(a))
})

const parentStrokeColor = computed(() => {
  if (activeFrameworks.value.length === 1) {
    return activeFrameworks.value[0].color;
  }
  return '#000000'; // fallback or neutral if multiple
});

const margin = { left: 10, right: 10, top: 10, bottom: 10 }

const rootEl = ref<HTMLElement | null>(null)
const isMounted = ref(false)
let __ro: ResizeObserver | null = null

onMounted(async () => {
  await nextTick()
  isMounted.value = true
  // Nudge Safari to paint after real layout
  requestAnimationFrame(() => {
    void rootEl.value?.offsetWidth
  })
  if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
    __ro = new ResizeObserver(() => {
      // Read size to trigger a fresh paint when container changes
      void rootEl.value?.offsetWidth
    })
    if (rootEl.value) __ro.observe(rootEl.value)
  }
})

onBeforeUnmount(() => {
  if (__ro) { __ro.disconnect(); __ro = null }
})

const inactiveArtkategoriKeys = ref<Set<string>>(new Set());
const inactiveFrameworkKeys = ref<Set<string>>(new Set());



interface Props {
  selectedFrameworks: string[],
  selectedArtkategori: string[],
  chartType: string,
  currentTimeValue?: string
  singleFrameworkSelection?: boolean,
  selectedStartskog?: string, // <-- Add this
  redColor?: boolean,
  yellowColor?: boolean,
  maxYValue?: number // <-- Add this
}

const props = withDefaults(defineProps<Props>(), {
  selectedFrameworks: () => [],
  singleFrameworkSelection: false,
  redColor: false,
  yellowColor: false
});

const frameworkColorMapping = computed(() => {
  if (props.redColor) {
    return {
      naturskydd: "#808080",
      trakthygge: "#7f1d1d",
      "skärmträd": "#b91c1c",
      luckhuggning: "#f87171",
      blädning: "#fca5a5",
    };
  } else if (props.yellowColor) {
    return {
      naturskydd: "#808080",
      trakthygge: "#713f12",
      "skärmträd": "#a16207",
      luckhuggning: "#eab308",
      blädning: "#fde047",
    };
  } else {
    return {
      naturskydd: "#808080",
      trakthygge: "#a855f7",
      luckhuggning: "#3b82f6",
      "skärmträd": "#eab308",
      blädning: "#22c55e",
    };
  }
});

function hexToRgba(hex: string, alpha = 1): string {
  const m = hex.replace('#', '')
  const s = m.length === 3 ? m.split('').map(c => c + c).join('') : m
  const bigint = parseInt(s, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const brushSelection = computed<[number, number]>(() => {
  const startMap: Record<string, number> = {
    'före': -5,
    'efter': 1,
    '10': 10,
    '20': 20,
    '50': 50,
    '80': 80,
  }
  const start = props.currentTimeValue ? (startMap[props.currentTimeValue] ?? xDomain.value[0]) : xDomain.value[0]
  return [start, xDomain.value[1]]
})

const artkategoriColorMapping: Record<string, string> = {
  "skinnsvampar": "#8B5CF6",
  "spindelskivlingar": "#EC4899",
  "kremlor och riskor": "#0EA5E9",
  "övriga svampar": "#5eead4",
  "matsvamp": "#eab308",
  "rödlistade + signalarter": "#5eead4",
  "total": "#808080"
};

type LegendItem = BulletLegendItemInterface & {
  key: string;
  label: string;
  color: string; // default color
  colorArea?: string; // fill color for VisArea
  colorLine?: string; // stroke color for VisLine
  lineDashArray?: number[]; // for VisLine (Unovis prop)
  isSecondary?: boolean;
  inactive: boolean;
};

function mapFrameworkLabel(label: string): string {
  const lower = label.toLowerCase();
  if (lower === "naturskydd") {
    return "Ingen åtgärd";
  } else if (lower === "trakthygge") {
    return "Trakhyggesbruk";
  } else if (lower === "skärmträd") {
    return "Överhållen skärm";
  } else {
    return capitalize(label);
  }
}

const legendOrder = ["naturskydd", "trakthygge", "skärmträd", "luckhuggning", "blädning"];

// If exactly one framework is active (and we're not in singleFrameworkSelection),
// color that framework by selected artkategori: total / matsvamp / rödlistade + signalarter
const activeFrameworkKeys = computed(() => {
  const passed = (props.selectedFrameworks || []).map(f => f.toLowerCase())
  return passed.filter(key => legendOrder.includes(key) && !inactiveFrameworkKeys.value.has(key))
})

const originalSeriesMap = computed<Record<string, Array<{ age: number; value: number }>>>(() => {
  const out: Record<string, Array<{ age: number; value: number }>> = {}
  for (const key of activeFrameworkKeys.value) {
    const s = filterDataForFramework(key).map(d => ({ age: Number(d.age), value: Number(d.klassning) }))
      .filter(p => Number.isFinite(p.age) && Number.isFinite(p.value))
      .sort((a, b) => a.age - b.age)
    out[key] = s
  }
  return out
})

// Canonical, sorted union of ages across active frameworks
const allAges = computed<number[]>(() => {
  const seriesList = Object.values(originalSeriesMap.value)
  if (!seriesList.length) return []
  const mins = seriesList.map(s => s.length ? s[0].age : Infinity)
  const maxs = seriesList.map(s => s.length ? s[s.length - 1].age : -Infinity)
  const minAge = Math.min(...mins)
  const maxAge = Math.max(...maxs)
  if (!Number.isFinite(minAge) || !Number.isFinite(maxAge)) return []
  const out: number[] = []
  const step = 1
  for (let a = minAge; a <= maxAge + 1e-9; a += step) {
    // round to nearest integer to avoid FP drift
    const r = Math.round(a)
    out.push(r)
  }
  return out
})

function interpolateValue(series: Array<{ age: number; value: number }>, x: number): number | undefined {
  // If exact match, return it
  const idx = series.findIndex(p => p.age === x)
  if (idx !== -1) return series[idx].value
  // Find neighbors
  let loIdx = -1, hiIdx = -1
  for (let i = 0; i < series.length; i++) {
    if (series[i].age < x) loIdx = i
    if (series[i].age > x) { hiIdx = i; break }
  }
  if (loIdx !== -1 && hiIdx !== -1) {
    const a = series[loIdx], b = series[hiIdx]
    const t = (x - a.age) / (b.age - a.age)
    return a.value + t * (b.value - a.value)
  }
  // Out of bounds: do not extrapolate (keep undefined)
  return undefined
}

// Resampled merged data: one row per age in allAges, each framework filled by interpolation
const resampledMergedData = computed(() => {
  const rows: any[] = []
  for (const age of allAges.value) {
    const row: any = { age }
    for (const key of activeFrameworkKeys.value) {
      const series = originalSeriesMap.value[key] || []
      const v = interpolateValue(series, age)
      if (typeof v === 'number' && Number.isFinite(v)) row[key] = v
    }
    rows.push(row)
  }
  return rows
})

// Build per-framework data arrays so each series has its own x ticks
// Shape: { [frameworkKey]: Array<{ age: number, value: number, __row: any }> }
const seriesDataMap = computed<Record<string, Array<{ age: number; value: number; __row: any }>>>(() => {
  const out: Record<string, Array<{ age: number; value: number; __row: any }>> = {}
  const rows = Array.isArray(mergedData.value) ? mergedData.value : []
  for (const key of activeFrameworkKeys.value) {
    out[key] = rows
      .filter(r => Number.isFinite(Number(r?.age)) && Number.isFinite(Number(r?.[key])))
      .map(r => ({ age: Number(r.age), value: Number(r[key]), __row: r }))
      .sort((a, b) => a.age - b.age)
  }
  return out
})

const singleFrameworkOverrideColor = computed<string | null>(() => {
  if (props.singleFrameworkSelection) return null
  if (activeFrameworkKeys.value.length !== 1) return null
  const primaryCat = (props.selectedArtkategori?.[0] || '').toLowerCase()
  if (primaryCat === 'total') return '#808080'
  if (primaryCat === 'matsvamp') return '#eab308'
  if (primaryCat === 'rödlistade + signalarter') return '#5eead4'
  return null
})

const legendItems = computed<LegendItem[]>(() => {
  if (props.singleFrameworkSelection) {
    return props.selectedArtkategori.map(art => {
      const key = art.toLowerCase();
      return {
        key,
        name: capitalize(art),
        label: capitalize(art),
        color: artkategoriColorMapping[key] || "#000000",
        inactive: inactiveArtkategoriKeys.value.has(key),
      };
    });
  } else {
    const keys = activeFrameworkKeys.value
    // Base color used when only one framework is shown (depends on selected artkategori)
    const primaryCat = (props.selectedArtkategori?.[0] || '').toLowerCase()
    const singleColor = primaryCat === 'total' ? '#808080'
      : primaryCat === 'matsvamp' ? '#eab308'
        : primaryCat === 'rödlistade + signalarter' ? '#5eead4'
          : null

    if (keys.length === 2) {
      const [k1, k2] = keys
      const base1 = singleColor || frameworkColorMapping.value[k1] || '#000000'
      const base2 = '#0a0a0a'
      return [
        {
          key: k1,
          name: mapFrameworkLabel(k1),
          label: mapFrameworkLabel(k1),
          color: base1,
          colorArea: hexToRgba(base1, 0.5), // faint area fill
          colorLine: hexToRgba(base1, 0.5),

          inactive: inactiveFrameworkKeys.value.has(k1),
          isSecondary: true,
        },
        {
          key: k2,
          name: mapFrameworkLabel(k2),
          label: mapFrameworkLabel(k2),
          color: base2,
          colorArea: hexToRgba(base2, 0.5), // faint area fill
          colorLine: hexToRgba(base2, 0.5),
          lineDashArray: [5],     // dashed line (same as your example)
          inactive: inactiveFrameworkKeys.value.has(k2),
          isSecondary: false,
        },

      ]
    }

    // Default behavior when not exactly two active frameworks
    return legendOrder
      .filter(key => props.selectedFrameworks.map(f => f.toLowerCase()).includes(key))
      .map(f => ({
        key: f,
        name: mapFrameworkLabel(f),
        label: mapFrameworkLabel(f),
        color: (singleFrameworkOverrideColor.value || frameworkColorMapping.value[f] || '#000000'),
        colorArea: (singleFrameworkOverrideColor.value || frameworkColorMapping.value[f] || '#000000'),
        colorLine: (singleFrameworkOverrideColor.value || frameworkColorMapping.value[f] || '#000000'),
        inactive: inactiveFrameworkKeys.value.has(f),
      }))
  }
});

const activeFrameworks = computed(() => {
  if (props.singleFrameworkSelection) return [];

  return legendItems.value.filter(item => !item.inactive);
});

function filterDataForFramework(framework: string) {
  const selected = props.selectedArtkategori.map(s => s.toLowerCase());

  const source = selected.includes('total') ? totalDataset.value : dataset.value;
  const selectedStartskog = props.selectedStartskog ? props.selectedStartskog.toLowerCase() : null;

  return (source as any[]).filter(d => {
    const matchesCategory = selected.includes(d.artkategori?.toLowerCase());
    const matchesFramework = d.frameworks?.toLowerCase() === framework.toLowerCase();
    const matchesStartskog = !selectedStartskog || (d.startskog?.toLowerCase() ?? selectedStartskog) === selectedStartskog;
    return matchesCategory && matchesFramework && matchesStartskog;
  }).map(d => ({
    age: d["ålder"],
    klassning: +d["klassning"]
  }));
}


const mergedData = computed(() => {
  const dataMap = new Map<number, any>();

  if (props.singleFrameworkSelection) {
    const framework = props.selectedFrameworks[0];
    props.selectedArtkategori.forEach(artkategori => {
      const selected = artkategori.toLowerCase();
      const source = selected === 'total' ? totalDataset.value : dataset.value;
      const selectedStartskog = props.selectedStartskog ? props.selectedStartskog.toLowerCase() : null;
      const series = (source as any[]).filter(d => {
        const matchesCategory = d.artkategori?.toLowerCase() === selected;
        const matchesFramework = d.frameworks?.toLowerCase() === framework;
        const matchesStartskog = !selectedStartskog || (d.startskog?.toLowerCase() ?? selectedStartskog) === selectedStartskog;
        return matchesCategory && matchesFramework && matchesStartskog;
      }).map(d => ({
        age: d["ålder"],
        klassning: +d["klassning"]
      }));

      series.forEach(item => {
        const existing = dataMap.get(item.age) || { age: item.age };
        existing[selected] = item.klassning;
        dataMap.set(item.age, existing);
      });
    });
  } else {
    activeFrameworks.value.forEach(framework => {
      const series = filterDataForFramework(framework.key);
      series.forEach(item => {
        const existing = dataMap.get(item.age) || { age: item.age };
        existing[framework.key] = item.klassning;
        dataMap.set(item.age, existing);
      });
    });
  }

  return Array.from(dataMap.values()).sort((a, b) => a.age - b.age);
});

const xAccessor = (d: any) => {
  const v = Number(d?.age)
  return Number.isFinite(v) ? v : undefined
}
const markerAccessor = (d: any) => d.__markerY

const yAccessors = computed(() => {
  if (props.singleFrameworkSelection) {
    return props.selectedArtkategori
      .filter(art => !inactiveArtkategoriKeys.value.has(art.toLowerCase()))
      .map(art => (d: any) => d[art.toLowerCase()]);
  } else {
    return activeFrameworks.value.map(item => {
      return (d: any) => d[item.key];
    });
  }
});

const computedLineColors = computed(() => {
  if (props.singleFrameworkSelection) {
    return legendItems.value
      .filter(item => !item.inactive)
      .map(item => item.color || "#000000");
  } else {
    return activeFrameworks.value.map(f => f.color || "#000000");
  }
});

function updateLegendItem(d: BulletLegendItemInterface) {
  const key = d.name?.toLowerCase();
  if (!key) return;

  if (props.singleFrameworkSelection) {
    const current = new Set(inactiveArtkategoriKeys.value);
    current.has(key) ? current.delete(key) : current.add(key);
    inactiveArtkategoriKeys.value = current;
  } else {
    const frameworkKey = legendOrder.find(f => mapFrameworkLabel(f).toLowerCase() === key);
    if (!frameworkKey) return;

    const current = new Set(inactiveFrameworkKeys.value);
    current.has(frameworkKey) ? current.delete(frameworkKey) : current.add(frameworkKey);
    inactiveFrameworkKeys.value = current;
  }
}

// Unovis stacked areas require an array of y accessors (one per series)
const stackedYAccessors = computed<((d: any) => number)[]>(() => {
  if (!props.singleFrameworkSelection) return []
  return stackedCategories.value.map(cat => (d: any) => Number(d?.[cat] ?? 0))
})

// Colors aligned with the stacked series order
const stackedColors = computed<string[] | ((...args: any[]) => string)>(() => {
  if (!props.singleFrameworkSelection) return []
  return stackedCategories.value.map(cat => artkategoriColorMapping[cat] || '#999')
})

const chartData = computed(() => {
  if (props.singleFrameworkSelection && props.chartType === 'area') {
    return [...mergedData.value]
  }
  return [...resampledMergedData.value]
})

// Crosshair tooltip template — shows X label + value(s) for the visible series
const crosshairTemplate = (d: any): string => {
  if (!d) return ''
  const age = d.age
  if (!Number.isFinite(Number(age))) return ''
  const formatAge = (x: number) => (Number.isInteger(x) ? `${x}` : `${x}`.replace('.5', ',5'))
  const xLabel = age === -5 ? 'före' : (age === 1 ? '1 år' : `${formatAge(age)} år`)

  // Decide which series to show: frameworks (default) or artkategorier (singleFrameworkSelection)
  const series = props.singleFrameworkSelection
    ? props.selectedArtkategori.map(art => ({
      key: art.toLowerCase(),
      label: capitalize(art),
      color: artkategoriColorMapping[art.toLowerCase()] || '#999'
    }))
    : activeFrameworks.value.map(fw => ({
      key: fw.key,
      label: mapFrameworkLabel(fw.key),
      color: fw.color || '#999'
    }))

  // Build rows only for series that have a value at this X
  const rows = series
    .map(s => {
      const v = d[s.key]
      if (v == null) return ''
      const formatted = typeof v === 'number' ? (v >= 10 ? Math.round(v).toString() : v.toFixed(2)) : String(v)
      return `
        <div style="display:flex;align-items:center;gap:0.5rem;line-height:1.2;">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${s.color};"></span>
          <span>${s.label}: <strong>${formatted}</strong></span>
        </div>`
    })
    .filter(Boolean)
    .join('')

  return `
    <div style="min-width:120px">
      <div style="font-weight:600;margin-bottom:4px">${xLabel}</div>
      ${rows}
    </div>`
}

</script>

<style>
.custom-area {
  --vis-area-fill-opacity: 0.5;
  --vis-area-hover-fill-opacity: 0.5;
  --vis-area-stroke-width: 0px;
  --vis-brush-handle-stroke-color: #ffffff00;
  --vis-axis-tick-color: #a3a3a37c;
  --vis-axis-grid-color: #a3a3a324;
  --vis-axis-tick-label-font-size: 18px;
  --vis-axis-tick-label-color: #a3a3a3;
  --vis-area-hover-stroke-width: 0px;

  --vis-tooltip-background-color: rgba(255, 255, 255, 0.95);
  --vis-tooltip-border-color: #e5e9f7;
  --vis-tooltip-text-color: #000;
  --vis-tooltip-shadow-color: rgba(172, 179, 184, 0.35);
  --vis-tooltip-backdrop-filter: none;
  --vis-tooltip-padding: 10px 15px;

  /* Ensure series visibly paint above overlays */
  --vis-line-stroke-width: 3px;
  --vis-line-stroke-opacity: 1;


}

/* Safari SVG layout nudges */
.custom-area {
  isolation: isolate;
}

.custom-area svg {
  display: block;
  width: 100%;
}
</style>
