<template>
  <div class="custom-area" ref="rootEl" :style="{ '--vis-area-stroke-color': 'none' }">
    <ClientOnly>
      <VisBulletLegend v-if="isMounted && chartReady && legendItems.length" :items="legendItems"
        :onLegendItemClick="handleLegendItemClick" class="mx-4 flex flex-wrap gap-2" />
      <VisXYContainer v-if="isMounted && chartReady" :data="chartData.length ? chartData : [emptyDataPoint]"
        :height="120" :margin="margin" :xDomain="xDomain" :yDomain="yDomain">
        <template v-if="props.chartType === 'area' && props.singleFrameworkSelection && !props.frameworkComparisonMode">
          <VisArea :duration=1 :x="xAccessor" :y="stackedYAccessors" :color="stackedColors"
            :interpolateMissingData="true" :baseline="stackedBaseline" />
          <!-- <VisLine v-for="cfg in stackedLineConfigs" :key="cfg.key + '-stack-line'" :x="xAccessor" :y="cfg.accessor"
            :color="() => cfg.color" :duration=1 /> -->
          <!-- <VisCrosshair v-if="hasActiveSeries" :template="crosshairTemplate" />
          <VisTooltip v-if="hasActiveSeries" :horizontalShift="30" /> -->
          <VisPlotband :duration=1 v-if="hasActiveSeries && currentTimeX !== null" :key="plotbandRenderKey" axis="x"
            :from="-7" :to="currentTimeX" :color="'rgba(255, 255, 255, 0.4)'" :zIndex="20" />
          <VisPlotline :duration=1 v-if="hasActiveSeries" :value="currentTimeX" color="rgba(234,88,12,1)" axis="x"
            labelOrientation="vertical" :zIndex="20" :lineWidth="1" />
        </template>
        <template
          v-else-if="props.chartType === 'area' && props.singleFrameworkSelection && props.frameworkComparisonMode">
          <VisArea :duration=1 v-for="fw in activeFrameworks" :key="fw.key + '-compare-area'" :x="xAccessor"
            :y="(d: any) => getComparisonValue(d, fw.key, comparisonCategory)"
            :baseline="compareBaselineForFramework(fw.key)" :color="() => fw.colorArea || fw.color"
            :interpolateMissingData="true" :zIndex="1" />
          <VisLine v-for="fw in activeFrameworks" :key="fw.key + '-compare-line'" :x="xAccessor"
            :y="(d: any) => getComparisonValue(d, fw.key, comparisonCategory)"
            :color="() => (hexToRgba(fw.colorLine || fw.color, 0.4))" :duration=1 />
          <VisPlotband :duration=1 v-if="hasActiveSeries && currentTimeX !== null" :key="plotbandRenderKey" axis="x"
            :from="-7" :to="currentTimeX" :color="'rgba(255, 255, 255, 0.4)'" :zIndex="20" />
          <VisPlotline :duration=1 v-if="hasActiveSeries" :value="currentTimeX" color="rgba(234,88,12,1)" axis="x"
            labelOrientation="vertical" :zIndex="20" :lineWidth="1" />

          <!-- <VisCrosshair v-if="hasActiveSeries" :template="crosshairTemplate" />
          <VisTooltip v-if="hasActiveSeries" :horizontalShift="30" /> -->
        </template>
        <template v-else-if="props.chartType === 'area'">
          <VisArea :duration=1 v-for="fw in activeFrameworks" :key="fw.key + '-area'" :x="xAccessor"
            :y="(d: any) => getFrameworkValue(d, fw.key)" :baseline="baselineForFramework(fw.key)"
            :color="() => (fw.colorArea || fw.color)" :interpolateMissingData="true" :zIndex="1" />

          <!-- <VisCrosshair v-if="hasActiveSeries" :template="crosshairTemplate" /> -->
          <VisLine v-for="fw in activeFrameworks" :key="fw.key + '-line'" :x="xAccessor"
            :y="(d: any) => getFrameworkValue(d, fw.key)" :color="() => (hexToRgba(fw.colorLine || fw.color, 0.4))"
            :duration=1 />
          <!-- <VisTooltip v-if="hasActiveSeries" :horizontalShift="30" /> -->
          <VisPlotband :duration=1 v-if="hasActiveSeries && currentTimeX !== null" :key="plotbandRenderKey" axis="x"
            :from="-7" :to="currentTimeX" :color="'rgba(255, 255, 255, 0.4)'" :zIndex="20" />
          <VisPlotline :duration=1 v-if="hasActiveSeries" :value="currentTimeX" color="rgba(234,88,12,1)" axis="x"
            labelOrientation="vertical" :zIndex="20" :lineWidth="1" />
        </template>
        <template v-else-if="props.chartType === 'bar'">
          <VisGroupedBar :color="computedLineColors" :x="xAccessor" :y="yAccessors" :groupPadding="0.5"
            :groupMaxWidth="20" />
        </template>
        <VisPlotline :duration="1" v-for="band in plotBands" :key="band.id" axis="x" :value="band.value"
          :color="`rgba(69,10,10, 0.5)`" :lineStyle="[2, 3]" :label="band.labelText" :labelColor="band.labelColor"
          :zIndex="100" :lineWidth="1" />
        <VisAxis tickTextFontSize="12px" :gridLine="true" type="x" :tickValues="[0, 10, 20, 30, 40, 50, 60, 70, 80, 90]"
          :tickFormat="(val: number) => {
            if (val === 0) return '0 år'
            if (val === 10) return ''
            if (val === 20) return '20 år'
            if (val === 30) return ''
            if (val === 40) return ''
            if (val === 50) return '50 år'
            if (val === 60) return ''
            if (val === 70) return ''
            if (val === 80) return '80 år'
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
import { VisXYContainer, VisAxis, VisLine, VisArea, VisGroupedBar, VisBulletLegend, VisBrush, VisCrosshair, VisTooltip, VisPlotline, VisPlotband } from '@unovis/vue'
import type { BulletLegendItemInterface } from '@unovis/ts'
import { PlotbandLabelPosition } from '@unovis/ts'
import { capitalize } from 'lodash-es'
import { useAsyncData } from '#app'

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

const matsvampDataset = computed(() => Array.isArray(matsvampDataDoc.value?.entries) ? matsvampDataDoc.value.entries : [])
const godaMatsvampDataset = computed(() => Array.isArray(godaMatsvampDataDoc.value?.entries) ? godaMatsvampDataDoc.value.entries : [])
const kgMatsvampDataset = computed(() => Array.isArray(kgMatsvampDataDoc.value?.entries) ? kgMatsvampDataDoc.value.entries : [])
const signalRodlistadeDataset = computed(() => Array.isArray(signalRodlistadeDataDoc.value?.entries) ? signalRodlistadeDataDoc.value.entries : [])
const combinedRodlistadeDataset = computed(() => Array.isArray(signalRodlistadeDataset.value) ? signalRodlistadeDataset.value : [])
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
  if (props.chartType === 'bar') {
    return mergedData.value;
  }
  if (props.singleFrameworkSelection && props.frameworkComparisonMode) {
    return comparisonInterpolatedData.value;
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

const margin = { left: 10, right: 10, top: 10, bottom: 10 }

const rootEl = ref<HTMLElement | null>(null)
const isMounted = ref(false)
let __ro: ResizeObserver | null = null
const chartSize = reactive({ width: 0, height: 0 })

function updateChartSize() {
  if (!rootEl.value) {
    chartSize.width = 0
    chartSize.height = 0
    return
  }
  const bounds = rootEl.value.getBoundingClientRect()
  chartSize.width = bounds.width
  chartSize.height = bounds.height
}

onMounted(async () => {
  await nextTick()
  isMounted.value = true
  updateChartSize()
  requestAnimationFrame(() => {
    updateChartSize()
  })
  if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
    __ro = new ResizeObserver(() => {
      updateChartSize()
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

const transformValue = (value: number) => (isKgMatsvamp.value ? (2 * value) - (value / 20) : value);

const getFrameworkValue = (row: any, frameworkKey: string) => {
  const num = Number(row?.[frameworkKey]);
  return Number.isFinite(num) ? transformValue(num) : NaN;
};

const getCategoryValue = (row: any, category: string) => {
  const num = Number(row?.[category]);
  return Number.isFinite(num) ? transformValue(num) : NaN;
};

const getComparisonValue = (row: any, frameworkKey: string, category: string) => {
  const namespace = frameworkKey + '__compare';
  const num = Number(row?.[namespace]?.[category]);
  return Number.isFinite(num) ? transformValue(num) : NaN;
};

// --- Baseline helpers for area charts ---
const baselineForFramework = (fwKey: string) => (d: any, _i: number) => {
  if (!isKgMatsvamp.value) return 0;
  const v = Number(d?.[fwKey]);
  return Number.isFinite(v) ? v / 20 : NaN;
};

const compareBaselineForFramework = (fwKey: string) => (d: any, _i: number) => {
  if (!isKgMatsvamp.value) return 0;
  const key = comparisonCategory.value;
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

const currentTimeX = computed<number | null>(() => {
  const val = props.currentTimeValue;
  if (!val) return null;
  const map: Record<string, number> = {
    'före': -5,
    'efter': 1,
    '10': 10,
    '20': 20,
    '50': 50,
    '80': 80,
  };
  if (val in map) return map[val];
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
});

const plotbandRenderKey = computed(() => {
  const fw = (props.selectedFrameworks || []).map(f => f.toLowerCase()).join(',');
  const art = (props.selectedArtkategori || []).map(a => a.toLowerCase()).join(',');
  return `${fw}|${art}|${props.currentTimeValue || ''}`;
});

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
  "kg matsvamp": "#eab308",
  "rödlistade + signalarter": "#14b8a6",
  "total": "#64748b"
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
  'atheliales': 'Skinnsvampar (Atheliales)',
  'boletales': 'Soppar i vid bemärkelse (Boletales)',
  'cantharellales': 'Kantarellsläktingar (Cantharellales)',
  'spindlingar': 'Spindelskivlingar (Cortinarius)',
  'russulales': 'Kremlor & riskor (Russulales)',
  'thelephorales': 'Skinn- & taggsvampar (Theleophorales)',
  'ascomycota': 'Sporsäckssvampar (Ascomycota)',
  'matsvamp': 'Matsvampar',
  'goda matsvampar': 'Goda matsvampar',
  'rödlistade + signalarter': 'Rödlistade + signalarter',
  'total': 'Total'
};

const frameworkAnnotations: Record<string, Array<{ age: number; text: string }>> = {
  trakthygge: [
    { age: 0, text: 'Avverkning' },
  ],
  luckhuggning: [
    { age: 30, text: 'Avverkning 3 luckor' },
    { age: 60, text: 'Avverkning 3 luckor' },
    { age: 90, text: 'Avverkning 3 luckor' },
  ],
  blädning: [
    { age: 30, text: 'Avverkning 30% av träden' },
    { age: 60, text: 'Avverkning 30% av träden' },
    { age: 90, text: 'Avverkning 30% av träden' },
  ],
  skärmträd: [
    { age: 0, text: 'Förberedande avverkning' },
    { age: 10, text: 'Fröträdsställning' },
    { age: 20, text: 'Avverkning av fröträden' },
  ],
};

const selectedArtCategories = computed(() =>
  (props.selectedArtkategori || []).map(a => (a || '').toLowerCase())
);

function normalizeArtKey(category: string): string {
  const key = (category || '').toLowerCase();
  if (key === 'kg matsvampar') return 'kg matsvamp';
  return key;
}

function getArtColor(category: string | undefined): string {
  if (!category) return artkategoriColorMapping['total'] || '#64748b';
  const key = normalizeArtKey(category);
  return artkategoriColorMapping[key] || artkategoriColorMapping['total'] || '#64748b';
}

const primaryArtCategory = computed(() => {
  if (props.singleFrameworkSelection && !props.frameworkComparisonMode) {
    return stackedCategories.value[0] || selectedArtCategories.value[0] || 'total';
  }
  return selectedArtCategories.value[0] || 'total';
});

const primaryArtColor = computed(() => getArtColor(primaryArtCategory.value));


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

// Canonical, sorted union of ages across active frameworks (integers + original float stops)
const allAges = computed<number[]>(() => {
  const seriesList = Object.values(originalSeriesMap.value)
  if (!seriesList.length) return []

  let minAge = Infinity
  let maxAge = -Infinity
  const ages = new Set<number>()

  for (const series of seriesList) {
    for (const point of series) {
      const age = Number(point.age)
      if (!Number.isFinite(age)) continue
      ages.add(age)
      if (age < minAge) minAge = age
      if (age > maxAge) maxAge = age
    }
  }

  if (!Number.isFinite(minAge) || !Number.isFinite(maxAge)) return []

  for (let a = Math.floor(minAge); a <= Math.ceil(maxAge) + 1e-9; a += 1) {
    ages.add(Number(a.toFixed(6)))
  }

  return Array.from(ages).sort((a, b) => a - b)
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
    if (props.singleFrameworkSelection && !props.frameworkComparisonMode) {
      const categories = stackedCategories.value.length
        ? stackedCategories.value
        : (props.selectedArtkategori || []).map(a => (a || '').toLowerCase()).filter(Boolean)
      const categorySeries = categorySeriesMap.value
      for (const cat of categories) {
        const series = categorySeries[cat] || []
        const v = interpolateValue(series, age)
        if (typeof v === 'number' && Number.isFinite(v)) row[cat] = v
      }
    } else {
      for (const key of activeFrameworkKeys.value) {
        const series = originalSeriesMap.value[key] || []
        const v = interpolateValue(series, age)
        if (typeof v === 'number' && Number.isFinite(v)) row[key] = v
      }
    }
    rows.push(row)
  }
  return rows
})

const categorySeriesMap = computed<Record<string, Array<{ age: number; value: number }>>>(() => {
  if (!(props.singleFrameworkSelection && !props.frameworkComparisonMode)) return {}
  const result: Record<string, Array<{ age: number; value: number }>> = {}
  const categories = stackedCategories.value.length
    ? stackedCategories.value
    : (props.selectedArtkategori || []).map(a => (a || '').toLowerCase()).filter(Boolean)
  const rows = Array.isArray(mergedData.value) ? mergedData.value : []
  for (const row of rows) {
    const age = Number(row?.age)
    if (!Number.isFinite(age)) continue
    for (const cat of categories) {
      const val = Number(row?.[cat])
      if (!Number.isFinite(val)) continue
        ; (result[cat] = result[cat] || []).push({ age, value: val })
    }
  }
  for (const cat of Object.keys(result)) {
    result[cat].sort((a, b) => a.age - b.age)
  }
  return result
})

const comparisonCategory = computed(() => stackedCategories.value[0] || (props.selectedArtkategori?.[0]?.toLowerCase() || ''))

const comparisonInterpolatedData = computed(() => {
  if (!(props.singleFrameworkSelection && props.frameworkComparisonMode && props.chartType === 'area')) {
    return [] as Array<Record<string, any>>
  }
  const category = comparisonCategory.value
  if (!category) return []
  const inactive = inactiveFrameworkKeys.value
  const frameworks = legendOrder.filter(key =>
    props.selectedFrameworks.map(f => f.toLowerCase()).includes(key) && !inactive.has(key)
  )
  const rows: Array<Record<string, any>> = []
  for (const age of allAges.value) {
    const row: Record<string, any> = { age }
    let hasValue = false
    for (const fw of frameworks) {
      const series = originalSeriesMap.value[fw] || []
      const v = interpolateValue(series, age)
      if (typeof v === 'number' && Number.isFinite(v)) {
        const namespace = fw + '__compare'
        const bucket = row[namespace] || {}
        bucket[category] = v
        row[namespace] = bucket
        hasValue = true
      }
    }
    if (hasValue) rows.push(row)
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

const legendItems = computed<LegendItem[]>(() => {
  if (props.singleFrameworkSelection) {
    if (props.frameworkComparisonMode) {
      const frameworks = legendOrder.filter(key =>
        props.selectedFrameworks.map(f => f.toLowerCase()).includes(key)
      );
      const baseColor = primaryArtColor.value;
      const alpha = 0.5;
      return frameworks.map(key => {
        const label = mapFrameworkLabel(key);
        const inactive = inactiveFrameworkKeys.value.has(key);
        return {
          key,
          name: label,
          label,
          color: baseColor,
          colorArea: hexToRgba(baseColor, alpha),
          colorLine: baseColor,
          inactive,
        };
      });
    }

    const fromProps = (props.selectedArtkategori || [])
      .map(a => (a || '').toLowerCase())
      .filter(Boolean)
    const baseList = fromProps.length
      ? fromProps
      : stackedCategories.value.concat(Array.from(inactiveArtkategoriKeys.value))
    const selectedSet = new Set(baseList)
    const ordered = artkategoriLegendOrder.filter(key => selectedSet.has(key))
    const extras = Array.from(selectedSet).filter(key => !artkategoriLegendOrder.includes(key)).sort()
    const categories = ordered.concat(extras)
    return categories.map(key => {
      const color = getArtColor(key);
      const label = formatArtLabel(key);
      return {
        key,
        name: label,
        label,
        color,
        colorArea: hexToRgba(color, 0.5),
        colorLine: color,
        inactive: inactiveArtkategoriKeys.value.has(key),
      };
    });
  }

  const frameworks = legendOrder.filter(key =>
    props.selectedFrameworks.map(f => f.toLowerCase()).includes(key)
  );
  const baseColor = primaryArtColor.value;
  const alpha = 0.5;
  return frameworks.map(key => {
    const label = mapFrameworkLabel(key);
    const inactive = inactiveFrameworkKeys.value.has(key);
    return {
      key,
      name: label,
      label,
      color: baseColor,
      colorArea: hexToRgba(baseColor, alpha),
      colorLine: baseColor,
      inactive,
    };
  });
});

const activeFrameworks = computed(() => {
  if (props.singleFrameworkSelection && !props.frameworkComparisonMode) {
    return [];
  }
  return legendItems.value.filter(item => !item.inactive);
});

const plotBandLabelPosition = PlotbandLabelPosition.TopOutside;

const visibleFrameworkKeys = computed<string[]>(() => {
  if (props.singleFrameworkSelection) {
    if (props.frameworkComparisonMode) {
      return activeFrameworks.value.map(item => item.key);
    }
    const selected = (props.selectedFrameworks || [])
      .map(f => (f || '').toLowerCase())
      .filter(key => legendOrder.includes(key))
      .filter(key => !inactiveFrameworkKeys.value.has(key));
    if (selected.length) return selected;
    return activeFrameworkKeys.value;
  }
  return activeFrameworks.value.map(item => item.key);
});


function getChartRowByAge(age: number): Record<string, any> | undefined {
  const rows = Array.isArray(chartData.value) ? chartData.value : [];
  if (!rows.length) return undefined;
  const direct = rows.find(row => Math.abs(Number(row?.age) - age) < 1e-6);
  if (direct) return direct;
  let closestRow: Record<string, any> | undefined;
  let minDiff = Infinity;
  for (const row of rows) {
    const diff = Math.abs(Number(row?.age) - age);
    if (!Number.isFinite(diff)) continue;
    if (diff < minDiff) {
      minDiff = diff;
      closestRow = row;
    }
  }
  return minDiff < 1e-3 ? closestRow : undefined;
}

function getFrameworkDisplayValueAtAge(frameworkKey: string, age: number): number | undefined {
  const row = getChartRowByAge(age);
  if (row) {
    if (!props.singleFrameworkSelection) {
      const raw = Number(row[frameworkKey]);
      if (Number.isFinite(raw)) return transformValue(raw);
    } else if (props.frameworkComparisonMode) {
      const category = stackedCategories.value[0] || props.selectedArtkategori[0]?.toLowerCase();
      if (category) {
        const raw = Number(row?.[`${frameworkKey}__compare`]?.[category]);
        if (Number.isFinite(raw)) return transformValue(raw);
      }
    } else {
      const categories = stackedCategories.value.length
        ? stackedCategories.value
        : (props.selectedArtkategori || []).map(a => (a || '').toLowerCase()).filter(Boolean);
      if (categories.length) {
        let sum = 0;
        let hasValues = false;
        for (const cat of categories) {
          const raw = Number(row[cat]);
          if (!Number.isFinite(raw)) continue;
          sum += transformValue(raw);
          hasValues = true;
        }
        if (hasValues) return sum;
      }
    }
  }

  const series = originalSeriesMap.value[frameworkKey] || [];
  if (!series.length) return undefined;
  const raw = interpolateValue(series, age);
  if (typeof raw !== 'number' || !Number.isFinite(raw)) return undefined;
  return transformValue(raw);
}

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
  return [];
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
      return activeFrameworks.value.map(fw => hexToRgba(fw.colorLine || fw.color, 0.7) || '#000000');
    }
    const categories = stackedCategories.value.length ? stackedCategories.value : props.selectedArtkategori.map(a => a.toLowerCase());
    return categories
      .filter(cat => !inactiveArtkategoriKeys.value.has(cat))
      .map(cat => getArtColor(cat));
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
  return stackedCategories.value.map(cat => (d: any) => getCategoryValue(d, cat))
})

// Colors aligned with the stacked series order
const stackedColors = computed<string[] | ((...args: any[]) => string)>(() => {
  if (!props.singleFrameworkSelection || props.frameworkComparisonMode) return []
  return stackedCategories.value.map(cat => getArtColor(cat))

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

const plotBands = computed(() => {
  if (!chartReady.value) return [];
  const frameworks = visibleFrameworkKeys.value;
  if (!frameworks.length) return [];
  const [xMin, xMax] = xDomain.value;
  if (!Number.isFinite(xMin) || !Number.isFinite(xMax) || xMin === xMax) return [];
  const bands: Array<{ id: string; value: number; color: string; labelText: string; labelColor: string }> = [];
  const getColorForFramework = (fwKey: string) => {
    const legend = legendItems.value.find(item => item.key === fwKey);
    const base = legend?.colorLine || legend?.colorArea || legend?.color || primaryArtColor.value || '#64748b';
    return base;
  };
  const getLabelColor = (fwKey: string) => {
    const legend = legendItems.value.find(item => item.key === fwKey);
    return legend?.colorLine || legend?.color || primaryArtColor.value || '#1f2937';
  };
  frameworks.forEach(fw => {
    const defs = frameworkAnnotations[fw];
    if (!defs?.length) return;
    const color = getColorForFramework(fw);
    const labelColor = getLabelColor(fw);
    defs.forEach((def, idx2) => {
      const age = Number(def.age);
      if (!Number.isFinite(age)) return;
      if (age < xMin || age > xMax) return;
      bands.push({
        id: `${fw}-${age}-${idx2}`,
        value: age,
        color,
        labelText: def.text,
        labelColor,
      });
    });
  });
  return bands;
});

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
          color: fw.color || '#999',
          category
        };
      });
    } else {
      series = props.selectedArtkategori.map(art => {
        const key = art.toLowerCase();
        return {
          key,
          label: formatArtLabel(key),
          color: getArtColor(key)
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

  // If we're hovering near one of the plotline/annotations, show its label too
  const plotlineTolerance = 0.6; // adjust if your x spacing is denser/sparser
  const nearbyPlotline = plotBands.value.find(pb => Math.abs(Number(pb.value) - Number(age)) < plotlineTolerance);
  const plotlineRow = nearbyPlotline
    ? `<div style="margin-top:4px;font-size:0.7rem;opacity:0.8;display:flex;gap:0.35rem;align-items:center;">
         <span style="display:inline-block;width:6px;height:6px;border-radius:9999px;background:${nearbyPlotline.color};"></span>
         <span>${nearbyPlotline.labelText}</span>
       </div>`
    : '';

  return `
    <div style="min-width:120px">
      <div style="font-weight:600;margin-bottom:4px">${xLabel}</div>
      ${rows}
      ${plotlineRow}
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

  position: relative;
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
