<template>
  <div class="custom-area" ref="rootEl" :style="{ '--vis-area-stroke-color': parentStrokeColor }">
    <ClientOnly>
      <VisBulletLegend v-if="isMounted && chartReady && legendItems.length" :items="legendItems"
        :onLegendItemClick="handleLegendItemClick" class="mx-4 flex flex-wrap gap-2" />
      <VisXYContainer v-if="isMounted && chartReady" :data="chartData.length ? chartData : [emptyDataPoint]"
        :height="120" :margin="margin" :xDomain="xDomain" :yDomain="yDomain">
        <template v-if="props.chartType === 'area' && props.singleFrameworkSelection && !props.frameworkComparisonMode">
          <VisArea :x="xAccessor" :y="stackedYAccessors" :color="stackedColors" :interpolateMissingData="true"
            :baseline="stackedBaseline" />
          <VisCrosshair v-if="hasActiveSeries" :template="crosshairTemplate" />
          <VisTooltip v-if="hasActiveSeries" :horizontalShift="30" />
        </template>
        <template
          v-else-if="props.chartType === 'area' && props.singleFrameworkSelection && props.frameworkComparisonMode">
          <VisArea v-for="fw in activeFrameworks" :key="fw.key + '-compare-area'" :x="xAccessor" :y="(d: any) => {
            const key = stackedCategories[0] || props.selectedArtkategori[0]?.toLowerCase();
            const namespace = fw.key + '__compare';
            const value = d?.[namespace]?.[key];
            const num = Number(value);
            return Number.isFinite(num) ? (isKgMatsvamp ? (2 * num) - (num / 20) : num) : NaN;
          }" :baseline="compareBaselineForFramework(fw.key)" :color="() => fw.colorArea || fw.color"
            :interpolateMissingData="true" :zIndex="1" />
          <VisCrosshair v-if="hasActiveSeries" :template="crosshairTemplate" />
          <VisTooltip v-if="hasActiveSeries" :horizontalShift="30" />
        </template>
        <template v-else-if="props.chartType === 'area'">
          <VisArea v-for="fw in activeFrameworks" :key="fw.key + '-area'" :x="xAccessor" :y="(d: any) => {
            const v = Number(d?.[fw.key]);
            return Number.isFinite(v) ? (isKgMatsvamp ? (2 * v) - (v / 20) : v) : NaN;
          }" :baseline="baselineForFramework(fw.key)" :color="() => (fw.colorArea || fw.color)"
            :interpolateMissingData="true" :zIndex="1" />

          <VisCrosshair v-if="hasActiveSeries" :template="crosshairTemplate" />
          <template v-if="isKgMatsvamp">
            <VisLine v-for="fw in activeFrameworks" :key="fw.key + '-line-overlay'" :x="xAccessor" :y="(d: any) => {
              const v = Number(d?.[fw.key]);
              return Number.isFinite(v) ? v : NaN;
            }" :color="() => (fw.colorLine || fw.color)" :dashArray="[4, 4]" />
          </template>
          <VisTooltip v-if="hasActiveSeries" :horizontalShift="30" />
          <VisPlotline v-if="hasActiveSeries" :value="currentTimeValue" color="rgba(220, 114, 0, 1)" axis="x"
            labelOrientation="vertical" :zIndex="20" />
        </template>
        <template v-else-if="props.chartType === 'bar'">
          <VisGroupedBar :color="computedLineColors" :x="xAccessor" :y="yAccessors" :groupPadding="0.5"
            :groupMaxWidth="20" />
        </template>
        <VisAxis tickTextFontSize="12px" :gridLine="true" type="x" :tickValues="[0, 10, 20, 30, 40, 50, 60, 70, 80, 90]"
          :tickFormat="(val: number) => {
            if (val === 10) return ''
            if (val === 30) return ''
            if (val === 40) return ''
            if (val === 60) return ''
            if (val === 70) return ''
            if (val === 90) return ''
            return val
          }" />
        <VisAxis tickTextFontSize="12px" type="y" />
      </VisXYContainer>
    </ClientOnly>
  </div>


</template>

<script setup lang="ts">

import { computed, ref, onMounted, onBeforeUnmount, nextTick, reactive } from 'vue'
import { VisXYContainer, VisAxis, VisLine, VisArea, VisGroupedBar, VisBulletLegend, VisBrush, VisCrosshair, VisTooltip, VisPlotline } from '@unovis/vue'
import type { BulletLegendItemInterface } from '@unovis/ts'
import { capitalize } from 'lodash-es'
import { useAsyncData } from '#app'

const { data: svamparDataDoc } = await useAsyncData('svampar-skogsbruk', () =>
  queryCollection('svamparSkogsbruk').first()
)

const { data: matsvampDataDoc } = await useAsyncData('matsvamp-skogsbruk', () =>
  queryCollection('matsvampSkogsbruk').first()
)

const { data: godaMatsvampDataDoc } = await useAsyncData('goda-matsvampar-skogsbruk', () =>
  queryCollection('godaMatsvamparSkogsbruk').first()
)
const { data: kgMatsvampDataDoc } = await useAsyncData('kg-matsvamp-skogsbruk', () =>
  queryCollection('kgMatsvampSkogsbruk').first()
)

const { data: signalRodlistadeDataDoc } = await useAsyncData('signal-rodlistade-skogsbruk', () =>
  queryCollection('signalRodlistadeSkogsbruk').first()
)

const { data: athelialesDataDoc } = await useAsyncData('atheliales-skogsbruk', () =>
  queryCollection('athelialesSkogsbruk').first()
)

const { data: boletalesDataDoc } = await useAsyncData('boletales-skogsbruk', () =>
  queryCollection('boletalesSkogsbruk').first()
)

const { data: cantharellalesDataDoc } = await useAsyncData('cantharellales-skogsbruk', () =>
  queryCollection('cantharellalesSkogsbruk').first()
)

const { data: spindlingarDataDoc } = await useAsyncData('spindlingar-skogsbruk', () =>
  queryCollection('spindlingarSkogsbruk').first()
)

const { data: russulalesDataDoc } = await useAsyncData('russulales-skogsbruk', () =>
  queryCollection('russulalesSkogsbruk').first()
)

const { data: thelephoralesDataDoc } = await useAsyncData('thelephorales-skogsbruk', () =>
  queryCollection('thelephoralesSkogsbruk').first()
)
const { data: ascomycotaDataDoc } = await useAsyncData('ascomycota-skogsbruk', () =>
  queryCollection('ascomycotaSkogsbruk').first()
)

const { data: totalSvamparDataDoc } = await useAsyncData('total-svampar-skogsbruk', () =>
  queryCollection('totalSvamparSkogsbruk').first()
)

const dataset = computed(() => Array.isArray(svamparDataDoc.value?.entries) ? svamparDataDoc.value.entries : [])
const matsvampDataset = computed(() => Array.isArray(matsvampDataDoc.value?.entries) ? matsvampDataDoc.value.entries : [])
const godaMatsvampDataset = computed(() => Array.isArray(godaMatsvampDataDoc.value?.entries) ? godaMatsvampDataDoc.value.entries : [])
const kgMatsvampDataset = computed(() => Array.isArray(kgMatsvampDataDoc.value?.entries) ? kgMatsvampDataDoc.value.entries : [])
const signalRodlistadeDataset = computed(() => Array.isArray(signalRodlistadeDataDoc.value?.entries) ? signalRodlistadeDataDoc.value.entries : [])
const combinedRodlistadeDataset = computed(() => {
  const extra = Array.isArray(signalRodlistadeDataset.value) ? signalRodlistadeDataset.value : []
  const base = Array.isArray(dataset.value)
    ? dataset.value.filter(d => d.artkategori?.toLowerCase() === 'rödlistade + signalarter' && (d.startskog?.toLowerCase() || '') !== 'naturskog')
    : []
  return [...extra, ...base]
})
const athelialesDataset = computed(() => Array.isArray(athelialesDataDoc.value?.entries) ? athelialesDataDoc.value.entries : [])
const boletalesDataset = computed(() => Array.isArray(boletalesDataDoc.value?.entries) ? boletalesDataDoc.value.entries : [])
const cantharellalesDataset = computed(() => Array.isArray(cantharellalesDataDoc.value?.entries) ? cantharellalesDataDoc.value.entries : [])
const spindlingarDataset = computed(() => Array.isArray(spindlingarDataDoc.value?.entries) ? spindlingarDataDoc.value.entries : [])
const russulalesDataset = computed(() => Array.isArray(russulalesDataDoc.value?.entries) ? russulalesDataDoc.value.entries : [])
const thelephoralesDataset = computed(() => Array.isArray(thelephoralesDataDoc.value?.entries) ? thelephoralesDataDoc.value.entries : [])
const ascomycotaDataset = computed(() => Array.isArray(ascomycotaDataDoc.value?.entries) ? ascomycotaDataDoc.value.entries : [])
const totalDataset = computed(() => Array.isArray(totalSvamparDataDoc.value?.entries) ? totalSvamparDataDoc.value.entries : [])


const yDomain = computed<[number, number] | undefined>(() => {
  // If we're not in an area chart or not in Kg matsvamp, keep the existing behavior
  const fixedMax = Number(props.maxYValue);
  const isArea = props.chartType === 'area';
  if (!isArea || !isKgMatsvamp.value) {
    return Number.isFinite(fixedMax) ? [0, fixedMax] : undefined;
  }

  // Compute dynamic bounds that include the baseline (v/20) and the transformed top ((2*v) - (v/20))
  const data = Array.isArray((chartData as any).value) ? (chartData as any).value : [];
  if (!data.length) return Number.isFinite(fixedMax) ? [0, fixedMax] : undefined;

  let maxY = -Infinity;

  const topVal = (v: number) => (2 * v) - (v / 20);
  // We keep the axis starting at 0 for readability
  const lowerBound = 0;

  if (props.singleFrameworkSelection) {
    if (props.frameworkComparisonMode) {
      const cat = (stackedCategories as any).value[0] || (props.selectedArtkategori?.[0] || '').toLowerCase();
      const keys = (activeFrameworkKeys as any).value || [];
      for (const row of data) {
        for (const key of keys) {
          const bucket = row?.[`${key}__compare`];
          const val = Number(bucket?.[cat]);
          if (!Number.isFinite(val)) continue;
          const top = topVal(val);
          if (Number.isFinite(top)) maxY = Math.max(maxY, top);
        }
      }
    } else {
      const cats: string[] = (stackedCategories as any).value.length
        ? (stackedCategories as any).value
        : (props.selectedArtkategori || []).map(a => (a || '').toLowerCase());
      for (const row of data) {
        for (const c of cats) {
          const v = Number(row?.[c]);
          if (!Number.isFinite(v)) continue;
          const top = topVal(v);
          if (Number.isFinite(top)) maxY = Math.max(maxY, top);
        }
      }
    }
  } else {
    const keys = (activeFrameworkKeys as any).value || [];
    for (const row of data) {
      for (const key of keys) {
        const v = Number(row?.[key]);
        if (!Number.isFinite(v)) continue;
        const top = topVal(v);
        if (Number.isFinite(top)) maxY = Math.max(maxY, top);
      }
    }
  }

  if (!Number.isFinite(maxY)) {
    return Number.isFinite(fixedMax) ? [0, fixedMax] : undefined;
  }

  // Respect an explicit maxYValue if provided, ensuring we never clip the area top
  const upperBound = Number.isFinite(fixedMax) ? Math.max(fixedMax, maxY) : maxY;
  return [lowerBound, upperBound];
})

const baseChartData = computed(() => {
  if (props.singleFrameworkSelection && props.chartType === 'area') {
    return mergedData.value;
  }
  return resampledMergedData.value;
});

const xDomain = computed<[number, number]>(() => {
  const xs = baseChartData.value
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

const chartReady = computed(() => Array.isArray(baseChartData.value) && baseChartData.value.length > 0)

const stackedCategories = computed<string[]>(() => {
  if (!props.singleFrameworkSelection) return []
  if (props.frameworkComparisonMode) {
    // when comparing frameworks we only allow a single artkategori at a time
    const selected = props.selectedArtkategori?.[0]
    return selected ? [selected.toLowerCase()] : []
  }
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
  frameworkComparisonMode?: boolean,
  selectedStartskog?: string, // <-- Add this
  redColor?: boolean,
  yellowColor?: boolean,
  maxYValue?: number, // <-- Add this
  matsvampVariant?: 'standard' | 'goda' | 'kg'
}

const props = withDefaults(defineProps<Props>(), {
  selectedFrameworks: () => [],
  singleFrameworkSelection: false,
  frameworkComparisonMode: false,
  redColor: false,
  yellowColor: false,
  matsvampVariant: 'standard'
});

const matsvampVariant = computed(() => props.matsvampVariant === 'goda' ? 'goda' : (props.matsvampVariant === 'kg' ? 'kg' : 'standard'))
const matsvampVariantArtKey = computed(() =>
  matsvampVariant.value === 'goda'
    ? 'goda matsvampar'
    : (matsvampVariant.value === 'kg' ? 'kg matsvamp' : 'matsvamp')
)

const isKgMatsvamp = computed(() => {
  const selected = (props.selectedArtkategori || []).map(a => (a || '').toLowerCase());
  return selected.includes('matsvamp') && matsvampVariant.value === 'kg';
});

// --- Baseline helpers for area charts ---
const baselineForFramework = (fwKey: string) => (d: any, _i: number) => {
  if (!isKgMatsvamp.value) return 0;
  const v = Number(d?.[fwKey]);
  return Number.isFinite(v) ? v / 20 : NaN;
};

const compareBaselineForFramework = (fwKey: string) => (d: any, _i: number) => {
  if (!isKgMatsvamp.value) return 0;
  const key = stackedCategories.value[0] || props.selectedArtkategori[0]?.toLowerCase();
  const namespace = fwKey + '__compare';
  const value = d?.[namespace]?.[key];
  const num = Number(value);
  return Number.isFinite(num) ? num / 20 : NaN;
};

const stackedBaseline = (d: any, _i: number) => {
  if (!isKgMatsvamp.value) return 0;
  const firstCat = stackedCategories.value[0] || props.selectedArtkategori[0]?.toLowerCase();
  const num = Number(d?.[firstCat]);
  return Number.isFinite(num) ? num / 20 : NaN;
};

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
  "atheliales": "#8B5CF6",
  "boletales": "#EC4899",
  "cantharellales": "#0EA5E9",
  "spindlingar": "#F97316",
  "russulales": "#22C55E",
  "thelephorales": "#A855F7",
  "ascomycota": "#DC2626",
  "matsvamp": "#eab308",
  "goda matsvampar": "#eab308",
  "rödlistade + signalarter": "#5eead4",
  "total": "#808080"
};
const artkategoriLegendOrder = [
  'atheliales',
  'boletales',
  'cantharellales',
  'spindlingar',
  'russulales',
  'thelephorales',
  'ascomycota',
  'matsvamp',
  'goda matsvampar',
  'rödlistade + signalarter',
  'total'
];
const artkategoriLabelMap: Record<string, string> = {
  'atheliales': 'Skinnsvampar',
  'boletales': 'Soppar',
  'cantharellales': 'Kantarellsvampar',
  'spindlingar': 'Spindelskivlingar',
  'russulales': 'Kremlor & riskor',
  'thelephorales': 'Tagg- och tomentelloida svampar',
  'ascomycota': 'Sporsäckssvampar',
  'matsvamp': 'Matsvampar',
  'goda matsvampar': 'Goda matsvampar',
  'rödlistade + signalarter': 'Rödlistade + signalarter',
  'total': 'Total'
};

const formatArtLabel = (key: string) => {
  if (key === 'matsvamp' && matsvampVariant.value === 'goda') return 'Goda matsvampar';
  if (key === 'matsvamp' && matsvampVariant.value === 'kg') return 'Kg matsvampar';
  return artkategoriLabelMap[key] || capitalize(key);
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
const allFrameworkKeys = computed(() => (props.selectedFrameworks || []).map(f => f.toLowerCase()));

// If exactly one framework is active (and we're not in singleFrameworkSelection),
// color that framework by selected artkategori: total / matsvamp / rödlistade + signalarter
const activeFrameworkKeys = computed(() => {
  return allFrameworkKeys.value.filter(key => legendOrder.includes(key) && !inactiveFrameworkKeys.value.has(key))
})

const originalSeriesMap = computed<Record<string, Array<{ age: number; value: number }>>>(() => {
  const out: Record<string, Array<{ age: number; value: number }>> = {}
  for (const key of allFrameworkKeys.value) {
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
    if (props.frameworkComparisonMode) {
      const items = (props.selectedFrameworks || []).map(fw => {
        const key = fw.toLowerCase();
        const color = frameworkColorMapping.value[key] || '#000000';
        return {
          key,
          name: mapFrameworkLabel(key),
          label: mapFrameworkLabel(key),
          color,
          colorArea: hexToRgba(color, 0.4),
          colorLine: color,
          inactive: inactiveFrameworkKeys.value.has(key),
        };
      });
      return items;
    }
    const selected = props.selectedArtkategori.map(art => art.toLowerCase());
    const ordered = artkategoriLegendOrder.filter(key => selected.includes(key));
    return ordered.map(key => {
      return {
        key,
        name: formatArtLabel(key),
        label: formatArtLabel(key),
        color: artkategoriColorMapping[key] || "#000000",
        inactive: inactiveArtkategoriKeys.value.has(key),
      };
    });
  } else {
    const keys = activeFrameworkKeys.value
    // Base color used when only one framework is shown (depends on selected artkategori)
    const primaryCat = (props.selectedArtkategori?.[0] || '').toLowerCase()
    const singleColor = artkategoriColorMapping[primaryCat] || null

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

    const orderedKeys = legendOrder.filter(key =>
      props.selectedFrameworks.map(f => f.toLowerCase()).includes(key)
    );
    return orderedKeys.map(f => ({
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
  if (props.singleFrameworkSelection) {
    if (!props.frameworkComparisonMode) return [];
    return legendItems.value
      .filter(item => !inactiveFrameworkKeys.value.has(item.key));
  }
  return legendItems.value.filter(item => !item.inactive);
});

function resolveDatasetForCategory(category: string) {
  if (category === 'total') {
    return totalDataset.value;
  }
  if (category === 'matsvamp') {
    if (matsvampVariant.value === 'goda') return godaMatsvampDataset.value;
    if (matsvampVariant.value === 'kg') return kgMatsvampDataset.value;
    return matsvampDataset.value;
  }
  if (category === 'goda matsvampar') {
    return godaMatsvampDataset.value;
  }
  if (category === 'rödlistade + signalarter') {
    return combinedRodlistadeDataset.value;
  }
  if (category === 'atheliales') {
    return athelialesDataset.value;
  }
  if (category === 'boletales') {
    return boletalesDataset.value;
  }
  if (category === 'cantharellales') {
    return cantharellalesDataset.value;
  }
  if (category === 'spindlingar') {
    return spindlingarDataset.value;
  }
  if (category === 'russulales') {
    return russulalesDataset.value;
  }
  if (category === 'thelephorales') {
    return thelephoralesDataset.value;
  }
  if (category === 'ascomycota') {
    return ascomycotaDataset.value;
  }
  return dataset.value;
}

function resolveArtkategoriKey(category: string) {
  const lower = category.toLowerCase();
  if (lower === 'matsvamp') return matsvampVariantArtKey.value;
  return lower;
}

function filterDataForFramework(framework: string) {
  const selected = props.selectedArtkategori.map(s => s.toLowerCase());

  const selectedStartskog = props.selectedStartskog ? props.selectedStartskog.toLowerCase() : null;

  const rows: { age: number; klassning: number }[] = [];

  selected.forEach(category => {
    const sourceCategoryKey = resolveArtkategoriKey(category);
    const source = resolveDatasetForCategory(category);
    (source as any[] || []).forEach(d => {
      if (d.artkategori?.toLowerCase() !== sourceCategoryKey) return;
      if (d.frameworks?.toLowerCase() !== framework.toLowerCase()) return;
      if (selectedStartskog && (d.startskog?.toLowerCase() ?? selectedStartskog) !== selectedStartskog) return;
      rows.push({
        age: d["ålder"],
        klassning: +d["klassning"]
      });
    });
  });

  return rows;
}


const mergedData = computed(() => {
  const dataMap = new Map<number, any>();

  if (props.singleFrameworkSelection) {
    const frameworks = props.frameworkComparisonMode
      ? (props.selectedFrameworks || []).map(f => f.toLowerCase()).slice(0, 2)
      : [props.selectedFrameworks[0]?.toLowerCase()].filter(Boolean);

    props.selectedArtkategori.forEach(artkategori => {
      const selected = artkategori.toLowerCase();
      const source = resolveDatasetForCategory(selected);
      const selectedStartskog = props.selectedStartskog ? props.selectedStartskog.toLowerCase() : null;
      const artKey = resolveArtkategoriKey(selected);

      frameworks.forEach(framework => {
        const series = ((source as any[]) || []).filter(d => {
          const matchesCategory = d.artkategori?.toLowerCase() === artKey;
          const matchesFramework = d.frameworks?.toLowerCase() === framework;
          const matchesStartskog = !selectedStartskog || (d.startskog?.toLowerCase() ?? selectedStartskog) === selectedStartskog;
          return matchesCategory && matchesFramework && matchesStartskog;
        }).map(d => ({
          age: d["ålder"],
          klassning: +d["klassning"]
        }));

        series.forEach(item => {
          const existing = dataMap.get(item.age) || { age: item.age };
          if (props.frameworkComparisonMode) {
            const namespace = `${framework}__compare`;
            const bucket = existing[namespace] || {};
            bucket[selected] = item.klassning;
            existing[namespace] = bucket;
          } else {
            existing[selected] = item.klassning;
          }
          dataMap.set(item.age, existing);
        });
      });
    });
  } else {
    allFrameworkKeys.value.forEach(frameworkKey => {
      const series = filterDataForFramework(frameworkKey);
      series.forEach(item => {
        const existing = dataMap.get(item.age) || { age: item.age };
        existing[frameworkKey] = item.klassning;
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
    if (props.frameworkComparisonMode) {
      const category = stackedCategories.value[0] || props.selectedArtkategori[0]?.toLowerCase();
      return activeFrameworks.value.map(fw => {
        const key = fw.key;
        return (d: any) => {
          const bucket = d?.[`${key}__compare`];
          const value = bucket?.[category];
          return Number.isFinite(Number(value)) ? Number(value) : NaN;
        };
      });
    }
    const categories = stackedCategories.value.length ? stackedCategories.value : props.selectedArtkategori.map(a => a.toLowerCase());
    return categories
      .filter(art => !inactiveArtkategoriKeys.value.has(art))
      .map(art => (d: any) => d[art]);
  }
  return activeFrameworks.value.map(item => {
    return (d: any) => d[item.key];
  });
});

const computedLineColors = computed(() => {
  if (props.singleFrameworkSelection) {
    if (props.frameworkComparisonMode) {
      return activeFrameworks.value.map(fw => fw.colorLine || fw.color || '#000000');
    }
    const categories = stackedCategories.value.length ? stackedCategories.value : props.selectedArtkategori.map(a => a.toLowerCase());
    return categories
      .filter(cat => !inactiveArtkategoriKeys.value.has(cat))
      .map(cat => artkategoriColorMapping[cat] || '#000000');
  } else {
    return activeFrameworks.value.map(f => f.color || "#000000");
  }
});

function handleLegendItemClick(item: LegendItem) {
  const key = (item.key || item.name || '').toLowerCase();
  if (!key) return;

  if (props.singleFrameworkSelection) {
    if (props.frameworkComparisonMode) {
      const next = new Set(inactiveFrameworkKeys.value);
      next.has(key) ? next.delete(key) : next.add(key);
      inactiveFrameworkKeys.value = next;
    } else {
      const next = new Set(inactiveArtkategoriKeys.value);
      next.has(key) ? next.delete(key) : next.add(key);
      inactiveArtkategoriKeys.value = next;
    }
  } else {
    const frameworkKey = legendOrder.find(f => f === key) || legendOrder.find(f => mapFrameworkLabel(f).toLowerCase() === key);
    if (!frameworkKey) return;
    const next = new Set(inactiveFrameworkKeys.value);
    next.has(frameworkKey) ? next.delete(frameworkKey) : next.add(frameworkKey);
    inactiveFrameworkKeys.value = next;
  }
}

// Unovis stacked areas require an array of y accessors (one per series)
const stackedYAccessors = computed<((d: any) => number)[]>(() => {
  if (!props.singleFrameworkSelection || props.frameworkComparisonMode) return []
  return stackedCategories.value.map(cat => (d: any) => {
    const v = Number(d?.[cat])
    if (!Number.isFinite(v)) return NaN
    return isKgMatsvamp.value ? (2 * v) - (v / 20) : v
  })
})

// Colors aligned with the stacked series order
const stackedColors = computed<string[] | ((...args: any[]) => string)>(() => {
  if (!props.singleFrameworkSelection || props.frameworkComparisonMode) return []
  return stackedCategories.value.map(cat => artkategoriColorMapping[cat] || '#999')
})

const emptyDataPoint = reactive({ age: 0 })

function hasAnyValue(row: Record<string, any>): boolean {
  if (!row) return false
  const keys = Object.keys(row).filter(k => k !== 'age' && k !== '__markerY')
  return keys.some(key => {
    const value = row[key]
    if (value && typeof value === 'object') {
      return Object.values(value).some(v => Number.isFinite(Number(v)))
    }
    return Number.isFinite(Number(value))
  })
}

const activeSeriesCount = computed(() => {
  if (props.singleFrameworkSelection) {
    if (props.frameworkComparisonMode) {
      return activeFrameworks.value.length;
    }
    return stackedCategories.value.length;
  }
  return activeFrameworks.value.length;
});

const hasActiveSeries = computed(() => activeSeriesCount.value > 0);

const chartData = computed(() => {
  const data = baseChartData.value;
  if (!activeSeriesCount.value) {
    if (props.frameworkComparisonMode && props.singleFrameworkSelection && data.length) {
      return data.map(row => {
        const clone = { age: row.age };
        for (const fw of props.selectedFrameworks || []) {
          const key = fw.toLowerCase();
          clone[`${key}__compare`] = { [stackedCategories.value[0] || props.selectedArtkategori[0]?.toLowerCase() || '']: NaN };
        }
        return clone;
      });
    }
    return data.length ? data : [emptyDataPoint];
  }
  return data.filter(row => hasAnyValue(row));
})

// Crosshair tooltip template — shows X label + value(s) for the visible series
const crosshairTemplate = (d: any): string => {
  if (!d) return ''
  const age = d.age
  if (!Number.isFinite(Number(age))) return ''
  const formatAge = (x: number) => (Number.isInteger(x) ? `${x}` : `${x}`.replace('.5', ',5'))
  const xLabel = age === -5 ? 'före' : (age === 1 ? '1 år' : `${formatAge(age)} år`)

  // Decide which series to show: frameworks (default) or artkategorier (singleFrameworkSelection)
  let series: Array<{ key: string; label: string; color: string; category?: string }>;
  if (props.singleFrameworkSelection) {
    if (props.frameworkComparisonMode) {
      const category = stackedCategories.value[0] || props.selectedArtkategori[0]?.toLowerCase();
      series = activeFrameworks.value.map(fw => {
        const key = fw.key;
        return {
          key: `${key}__compare`,
          label: mapFrameworkLabel(key),
          color: fw.color || frameworkColorMapping.value[key] || '#999',
          category
        };
      });
    } else {
      series = props.selectedArtkategori.map(art => {
        const key = art.toLowerCase();
        return {
          key,
          label: formatArtLabel(key),
          color: artkategoriColorMapping[key] || '#999'
        };
      });
    }
  } else {
    series = activeFrameworks.value.map(fw => ({
      key: fw.key,
      label: mapFrameworkLabel(fw.key),
      color: fw.color || '#999'
    }));
  }

  // Build rows only for series that have a value at this X
  const rows = series
    .map(s => {
      const v = (props.singleFrameworkSelection && props.frameworkComparisonMode)
        ? d?.[s.key]?.[s.category as string]
        : d[s.key]
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
  --vis-area-fill-opacity: 0.7;
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
