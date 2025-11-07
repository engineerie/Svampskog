<template>
  <div :class="['relative', fullscreenLayout ? ' gap-4' : 'grid md:grid-cols-5 gap-8']">

    <!-- <client-only> -->
    <div v-if="isClient" :id="viewerId"
      :class="['openseadragon-viewer ui-zoom-exempt col-span-3 relative overflow-hidden', fullscreenLayout ? '' : 'rounded-sm']"
      ref="viewerContainer" @mousedown.capture="handleActivate" @mousemove="updateMousePosition"
      @click="handleRetentionClick($event)">
      <!-- <div v-if="!(layoutMode === 'slider' && comparisonMode) && fullscreenLayout"
        class="absolute bottom-0 left-1/2 transform -translate-x-1/2 m-2 z-10 text-center">
        <div>
          <UBadge size="lg" class="backdrop-blur-xl bg-neutral-400/10 text-neutral-100 mb-0.5 z-50">{{
            frameworkLabel }}
          </UBadge>
        </div>
        <UBadge size="lg" class="backdrop-blur-xl bg-neutral-400/10 text-neutral-100 z-50">{{ timeLabel }}
        </UBadge>
      </div> -->

      <!-- Display viewport coordinates for marker placement -->
      <div class="absolute top-90 right-0 m-2 p-1 bg-black bg-opacity-50 text-white text-xs z-50">
        X: {{ mousePos.x.toFixed(4) }}, Y: {{ mousePos.y.toFixed(4) }}
      </div>
      <!-- Simple, predictable tooltip anchored in viewer pixels (no Popper/UPopover) -->
      <div class="absolute z-[60] pointer-events-none" v-show="naturvardTooltipOpen && naturvardTooltip"
        :style="naturvardTooltip ? { left: naturvardTooltip.left + 'px', top: naturvardTooltip.top + 'px' } : {}">
        <div class="rounded-md border border-[#f9f6f3] bg-white px-3 py-1 text-xs text-neutral-700 shadow">
          {{ naturvardTooltip && naturvardTooltip.message }}
        </div>
      </div>
      <div v-if="naturvardCounter" class="absolute top-3 left-3 z-50 pointer-events-none">
        <div
          class="inline-flex items-center gap-2 rounded-full border border-[#f9f6f3] bg-white/95 px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm">
          <span class="uppercase tracking-wide text-[10px] text-neutral-400">Naturvård</span>
          <span class="text-sm font-semibold text-neutral-900">{{ naturvardCounter.total }}</span>
          <span v-if="naturvardCounter.gained" class="text-emerald-600 font-semibold">+{{ naturvardCounter.gained
            }}</span>
          <span v-if="naturvardCounter.lost" class="text-red-500 font-semibold">-{{ naturvardCounter.lost }}</span>
        </div>
      </div>
      <!-- <div class="osd-opacity-slider-container bg-neutral-800 flex items-center p-1.5 gap-1 rounded-lg m-2" :style="{
      position: 'absolute',
      top: '0px',
      zIndex: 10,
      ...(sliderPosition === 'left' ? { left: '40px' } : { right: '0px' })
    }">
      <UIcon name="i-hugeicons-tree-06" class="size-5 text-neutral-100" />
      <input id="osdOverlayOpacity" type="range" min="0" max="1" step="0.01" :value="overlayOpacityLocal"
        @input="handleSliderInput" class="accent-neutral-100 h-[5px] w-20 " />
    </div> -->

      <!-- Popover trigger for Kontinuerligt rottäcke (Blädning @ efter) -->
      <UPopover class="hover:cursor-pointer" :open-delay="500" :close-delay="300">
        <!-- Trigger element positioned over the rectangle -->
        <div
          :style="rottackePopover.visible
            ? rottackePopoverStyle
            : { position: 'absolute', top: '-99999px', left: '-99999px', width: '1px', height: '1px', pointerEvents: 'none' }"
          class="absolute z-[10000]" tabindex="0" role="button" aria-label="Kontinuerligt rottäcke"></div>
        <template #content>
          <div class="p-3 max-w-xs">
            I princip är hela området täckt av rötter där svampar kan överleva
          </div>
        </template>
      </UPopover>

    </div>
    <!-- </client-only> -->
    <!-- section to reactivate for not fullscreen mode + set viewer to gird-span-3 -->
    <div class="col-span-2">

      <div
        :class="['pointer-events-none bottom-0  z-10', (layoutMode === 'slider' && comparisonMode) ? 'w-full' : 'w-full']"
        :style="{
          zIndex: 10,
          ...(sliderPosition === 'left'
            ? { left: '0px', paddingRight: (layoutMode === 'slider' && comparisonMode) ? '0px' : '0px' }
            : { right: '0px', paddingLeft: (layoutMode === 'slider' && comparisonMode) ? '0px' : '0px' }
          )
        }">
        <div class="w-full ">
          <!-- <div :class="['w-full flex', (sliderPosition === 'left') ? '' : 'justify-end']">

          <div class="overflow-hidden mt-1 px-2 text-sm text-neutral-200 w-full backdrop-blur-2xl flex rounded-t-lg border-t border-neutral-800/60 ">
            <div class="flex items-center p-1.5 bg-neutral-700/10 border-r border-neutral-500 border-dashed">
              <UIcon name="i-fluent-shape-organic-48-filled" class="text-gray-300 mr-1" />
              <span>Total mycelmängd: {{ svampMycelValue }} %</span>
            </div>
            <div class="flex items-center p-1.5 ">
              <UIcon name="i-fluent-shape-organic-48-filled" class="text-warning-500 mr-1" />
              <span>Matsvamp av total: {{ matsvampMycelValue }}%</span>
            </div>
            <div class="flex items-center p-1.5 ">
              <UIcon name="i-fluent-shape-organic-48-filled" class="text-error-500 mr-1" />
              <span>Naturvårdsarter av total: {{ rodlistadeMycelValue }}%</span>
            </div>
          </div>
        </div> -->


          <div v-if="!fullscreenLayout" :class="['flex w-full', (sliderPosition === 'left') ? '' : 'justify-end']">

            <div class="w-full text-md  relative group pointer-events-auto">




              <div v-if="!isPanelMinimized">
                <h1 class="text-3xl mt-2 font-medium">{{ frameworkLabel }}</h1>
                <h1 class="text-md text-neutral-500 mb-4">{{ timeLabel }}</h1>
                <p class=" mb-6" v-if="timelineInfo"> {{ timelineInfo.skog }}</p>
                <p class=" " v-if="timelineInfo">
                <div class="font-bold mb-1.5 text-lg">Påverkan på mykorrizasvamp</div> {{
                  timelineInfo.svamp }}
                </p>
                <div class="overflow-hidden mt-1 px-2  w-full flex">
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount, onActivated, nextTick, createApp, unref } from "vue";
import debounce from 'lodash/debounce';
import { useRoute } from "vue-router";
import AnnotationPopup from "./AnnotationPopup.vue";
import AnnotationMarker from "./AnnotationMarker.vue";
import { useSelectedAnnotationStore } from "~/stores/selectedAnnotationStore";
import { useOverlayStore } from "~/stores/overlayStore";
// import { useAsyncData } from '#app'
// import { queryCollection } from '#content/server'
import timelineData from "public/timeline.json";
import { usePanelStore } from '~/stores/panelStore';
import { useViewerStore } from '~/stores/viewerStore';
import { DEFAULT_NATURVARD_TIMES } from '~/composables/useOverlayRegistry';
const retentionOverlayIds = [];

function isVisibleForStartskog(tree, activeStartskog) {
  if (!activeStartskog) return true;
  if (!tree) return false;

  const entry = tree.startskog;
  const exclusive = tree.startskogExclusive === true;

  if (Array.isArray(entry)) {
    return entry.includes(activeStartskog);
  }

  if (typeof entry === 'string') {
    if (entry === 'all') return true;

    if (!exclusive && tree.framework === 'trakthygge') {
      if (entry === 'naturskog' || entry === 'produktionsskog_') {
        return activeStartskog === 'naturskog' || activeStartskog === 'produktionsskog_';
      }
    }

    return entry === activeStartskog;
  }

  return true;
}

export default {
  name: "OpenSeadragonViewer",
  emits: ["annotationClicked", "viewportChanged", "opened"],
  props: {
    currentFramework: { type: Object, required: true },
    currentTime: { type: String, required: true },
    currentStartskog: { type: Object, required: true },
    retentionVisible: { type: Boolean, default: false },

    fullscreenLayout: {
      type: Boolean,
      default: false
    },
    comparisonMode: {
      type: Boolean,
      default: false,
    },
    frameworkLabel: {
      type: String,
      default: "",
    },
    timeLabel: {
      type: String,
      default: "",
    },
    layoutMode: {
      type: String,
      default: "slider", // "slider" by default, or "sideBySide" for comparison mode
    },
    globalOpacity: {
      type: Number,
      default: undefined,
    },
    sliderPosition: {
      type: String,
      default: "left", // default position is left
    },
    dziUrl: {
      type: String,
      required: true,
    },
    allowPan: {
      type: Boolean,
      default: true,
    },
    // backgroundColor: {
    //   type: String,
    //   default: "#f9f6f3",
    // },
    annotations: {
      type: Array,
      default: () => [],
    },
    overlayDziUrl: {
      type: String,
      default: null,
    },
    kanteffektVisible: { type: Boolean, default: false },
    omkringliggandeSkogVisible: { type: Boolean, default: false },
    oldKanteffektVisible: { type: Boolean, default: true },
    rottackeSkarmtradVisible: { type: Boolean, default: false },
    rottackeBladningVisible: { type: Boolean, default: false },
    seedTreeVisible: { type: Boolean, default: false },
    // Dev flag to enable saving clicks to a general store
    devSaveClicks: { type: Boolean, default: false },
    showOverlayLabels: { type: Boolean, default: true },
    showNaturvardCounter: { type: Boolean, default: false },
    smaplantorVisible: { type: Boolean, default: false },
    hogstubbarVisible: { type: Boolean, default: false },
    naturvardsarterVisible: { type: Boolean, default: false },
    tradplantorVisible: { type: Boolean, default: false },
    retentionPoints: {
      type: Array,
      default: () => [],
    },
    seedTreePoints: {
      type: Array,
      default: () => [],
    },
    smaplantorPoints: {
      type: Array,
      default: () => [],
    },
    hogstubbarPoints: {
      type: Array,
      default: () => [],
    },
    naturvardsarterPoints: {
      type: Array,
      default: () => [],
    },
    kanteffektFeatures: {
      type: Array,
      default: () => [],
    },

  },
  setup(props, { emit, expose }) {

    const frameworkValue = computed(() => {
      const raw = unref(props.currentFramework);
      if (raw == null) return null;
      if (typeof raw === "string") return raw;
      if (typeof raw === "object") {
        if (
          Object.prototype.hasOwnProperty.call(raw, "value") &&
          typeof raw.value === "string"
        ) {
          return raw.value;
        }
        if (
          Object.prototype.hasOwnProperty.call(raw, "framework") &&
          typeof raw.framework === "string"
        ) {
          return raw.framework;
        }
      }
      return null;
    });

    const startskogValue = computed(() => {
      const raw = unref(props.currentStartskog);
      if (raw == null) return null;
      if (typeof raw === "string") return raw;
      if (typeof raw === "object") {
        if (
          Object.prototype.hasOwnProperty.call(raw, "value") &&
          typeof raw.value === "string"
        ) {
          return raw.value;
        }
      }
      return null;
    });

    // Overlay dataset points are provided via props from the parent component.
    const retentionPoints = computed(() =>
      Array.isArray(props.retentionPoints) ? props.retentionPoints : [],
    );
    const seedTreePoints = computed(() =>
      Array.isArray(props.seedTreePoints) ? props.seedTreePoints : [],
    );
    const smaplantorPoints = computed(() =>
      Array.isArray(props.smaplantorPoints) ? props.smaplantorPoints : [],
    );
    const hogstubbarPoints = computed(() =>
      Array.isArray(props.hogstubbarPoints) ? props.hogstubbarPoints : [],
    );
    const naturvardPoints = computed(() =>
      Array.isArray(props.naturvardsarterPoints) ? props.naturvardsarterPoints : [],
    );
    const naturvardCounter = computed(() => {
      if (!props.showNaturvardCounter || !props.naturvardsarterVisible) return null;
      const points = naturvardPoints.value;
      if (!Array.isArray(points)) return null;

      const activeFramework = frameworkValue.value;
      const activeStartskog = startskogValue.value;
      const currentTimeLabel = props.currentTime;
      if (!currentTimeLabel) {
        return { total: 0, gained: 0, lost: 0 };
      }

      const normalizeId = (id) => {
        if (!id) return null;
        return id === 'myc-7.1' ? 'myc-7' : id;
      };

      const matchesContextBase = (point) => {
        if (!point) return false;
        if (activeFramework && !valueMatches(point.framework, activeFramework)) return false;
        if (activeStartskog && point.startskog && point.startskog !== activeStartskog) return false;
        return true;
      };

      const matchesContext = (point, timeLabel) => {
        if (!matchesContextBase(point)) return false;
        if (timeLabel) {
          if (!point.time) return false;
          return timeMatches(point.time, timeLabel);
        }
        return true;
      };

      const buildSetForTime = (timeLabel) => {
        const set = new Set();
        points.forEach((point) => {
          if (!matchesContext(point, timeLabel)) return;
          if (point.removed) return;
          const normalized = normalizeId(point.id);
          if (normalized) set.add(normalized);
        });
        return set;
      };

      const availableTimes = (() => {
        const unique = new Map();
        points.forEach((point) => {
          if (!matchesContextBase(point)) return;
          const timeValue = typeof point.time === 'string' ? point.time : null;
          if (!timeValue) return;
          const key = timeValue.toLowerCase();
          if (!unique.has(key)) {
            unique.set(key, timeValue);
          }
        });
        const times = Array.from(unique.values());
        const ensureCurrent = () => {
          const existing = times.some((t) => t.toLowerCase() === currentTimeLabel.toLowerCase());
          if (!existing) times.push(currentTimeLabel);
        };
        ensureCurrent();
        const indexFor = (time) => {
          const idx = DEFAULT_NATURVARD_TIMES.findIndex(
            (label) => label.toLowerCase() === time.toLowerCase(),
          );
          return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
        };
        times.sort((a, b) => indexFor(a) - indexFor(b));
        return times;
      })();

      const currentLower = currentTimeLabel.toLowerCase();
      const currentIndex = availableTimes.findIndex(
        (time) => time.toLowerCase() === currentLower,
      );
      const previousTime =
        currentIndex > 0 ? availableTimes[currentIndex - 1] : null;

      const currentIds = buildSetForTime(currentTimeLabel);
      const previousIds = previousTime ? buildSetForTime(previousTime) : new Set();

      let lost = 0;
      let gained = 0;

      previousIds.forEach((id) => {
        if (!currentIds.has(id)) lost += 1;
      });
      currentIds.forEach((id) => {
        if (!previousIds.has(id)) gained += 1;
      });

      if (!previousTime) {
        lost = 0;
        gained = 0;
      }

      return {
        total: currentIds.size,
        gained,
        lost,
      };
    });
    const kanteffektFeatures = computed(() =>
      Array.isArray(props.kanteffektFeatures) ? props.kanteffektFeatures : [],
    );


    // Småplantor points (content dataset)
    const matsvampDataset = ref([]);
    const signalRodlistadeDataset = ref([]);
    const totalSvamparDataset = ref([]);

    useAsyncData('matsvamp-skogsbruk', () => queryCollection('matsvampSkogsbruk').first()).then(({ data }) => {
      const value = data.value
      matsvampDataset.value = Array.isArray(value?.entries) ? value.entries : []
    })

    useAsyncData('signal-rodlistade-skogsbruk', () => queryCollection('signalRodlistadeSkogsbruk').first()).then(({ data }) => {
      const value = data.value
      signalRodlistadeDataset.value = Array.isArray(value?.entries) ? value.entries : []
    })

    useAsyncData('total-svampar-skogsbruk', () => queryCollection('totalSvamparSkogsbruk').first()).then(({ data }) => {
      const value = data.value
      totalSvamparDataset.value = Array.isArray(value?.entries) ? value.entries : []
    })


    // General saved clicks (developer capture)
    const localSavedClicks = ref([]);

    onMounted(async () => {
      try {
        const res = await fetch('/api/savedclicks');
        const json = await res.json();
        localSavedClicks.value = json.clicks || [];
      } catch (e) {
        console.error('Failed fetching saved clicks:', e);
      }
    });

    const route = useRoute();
    const viewerStore = useViewerStore();

    const viewer = ref(null);
    const isClient = ref(false);
    const viewerContainer = ref(null);
    const naturvardHitboxes = ref([]);
    const naturvardTooltip = ref(null);
    const naturvardTooltipOpen = ref(false);
    // Click-based tooltip handlers
    let naturvardClickHandler = null;
    let outsideClickHandler = null;
    // Popover state for Kontinuerligt rottäcke (Blädning @ efter)
    const rottackePopover = ref({ visible: false, top: 0, left: 0, width: 0, height: 0 });
    const rottackePopoverStyle = computed(() => ({
      position: 'absolute',
      top: rottackePopover.value.top + 'px',
      left: rottackePopover.value.left + 'px',
      width: rottackePopover.value.width + 'px',
      height: rottackePopover.value.height + 'px'
    }));
    // Helper: does a data time value match the current time? Supports string or array and 'alla'
    const timeMatches = (val, current) => {
      if (val === 'alla') return true;
      if (Array.isArray(val)) return val.includes('alla') || val.includes(current);
      return val === current;
    };
    // Generic matcher: accepts string or array (with optional 'alla')
    const valueMatches = (val, current) => {
      if (val === 'alla') return true;
      if (Array.isArray(val)) return val.includes('alla') || val.includes(current);
      return val === current;
    };
    // ————————————— Canvas‐based overlay (replaces all DOM overlays) —————————————
    const overlayCanvas = document.createElement('canvas');
    overlayCanvas.setAttribute('willReadFrequently', 'true');
    let overlayCtx = null;
    let resizeObserver = null;

    function initCanvasOverlay() {
      overlayCanvas.style.position = 'absolute';
      overlayCanvas.style.top = '0';
      overlayCanvas.style.left = '0';
      overlayCanvas.style.width = '100%';
      overlayCanvas.style.height = '100%';
      overlayCanvas.style.pointerEvents = 'none';
      overlayCanvas.style.zIndex = '10';
      viewerContainer.value.appendChild(overlayCanvas);
      overlayCanvas.width = viewerContainer.value.clientWidth;
      overlayCanvas.height = viewerContainer.value.clientHeight;
      overlayCtx = overlayCanvas.getContext('2d');
      // Observe container size changes
      if (resizeObserver) resizeObserver.disconnect();
      resizeObserver = new ResizeObserver(resizeCanvas);
      resizeObserver.observe(viewerContainer.value);
      try {
        viewer.value?.addHandler?.('animation', () => { drawAllOverlays(); });
        viewer.value?.addHandler?.('animation-finish', () => { drawAllOverlays(); });
        viewer.value?.addHandler?.('viewport-change', () => { drawAllOverlays(); });
      } catch (e) {
        // ignore if not available yet
      }
    }
    // Canvas helper: draw Material Symbols award star (centered at (x,y) with radius r)
    // Foreground (detailed) path (teal)
    const AWARD_STAR_PATH_D = "M9.075 16.25L12 14.475l2.925 1.775l-.775-3.325l2.6-2.25l-3.425-.275L12 7.25l-1.325 3.15l-3.425.275l2.6 2.25zM12 23.3L8.65 20H4v-4.65L.7 12L4 8.65V4h4.65L12 .7L15.35 4H20v4.65L23.3 12L20 15.35V20h-4.65zm0-2.8l2.5-2.5H18v-3.5l2.5-2.5L18 9.5V6h-3.5L12 3.5L9.5 6H6v3.5L3.5 12L6 14.5V18h3.5zm0-8.5";
    // Background (simplified outer) path (white) — from your snippet (no inner holes)
    const AWARD_STAR_BG_PATH_D = "M9.075 16.25L12 14.475l2.925 1.775l-.775-3.325l2.6-2.25l-3.425-.275L12 7.25l-1.325 3.15l-3.425.275l2.6 2.25zM12 23.3L8.65 20H4v-4.65L.7 12L4 8.65V4h4.65L12 .7L15.35 4H20v4.65L23.3 12L20 15.35V20h-4.65z";

    function drawAwardStar(ctx, x, y, r) {
      ctx.save();

      // The SVG viewBox is 24x24; scale so width ≈ 2r
      const s = (r * 2.5) / 24;
      ctx.translate(x, y);
      ctx.scale(s, s);
      // center the 24x24 paths on the origin
      ctx.translate(-12, -12);

      // 1) White background icon (outer contour only)
      const bgPath = new Path2D(AWARD_STAR_BG_PATH_D);
      ctx.fillStyle = 'rgb(20,184,166)';
      ctx.fill(bgPath, 'nonzero');

      // 2) Foreground detailed teal icon on top
      const fgPath = new Path2D(AWARD_STAR_PATH_D);
      ctx.fillStyle = 'white';
      ctx.fill(fgPath, 'evenodd');

      ctx.restore();
    }

    const SAW_BLADE_PATH_D = "m9.8 17l-3.9-5.4L20 2l2 3v3h-3v3h-3v3h-3v3m-3.3 1.7l-.5 2.8l-1.6 1.2c-.9.6-2.1.4-2.8-.5l-3.5-4.9c-.6-.9-.4-2.1.5-2.8l3.3-2.3zM4.6 15L3 16.1L6.5 21l1.6-1.2z"
    const RANDOM_LINE_PATH_D = "M5.874 5.89A8.13 8.13 0 0 0 4 11.1a.9.9 0 0 0 .9.9H12m4 0h3.1a.9.9 0 0 0 .9-.9C20 6.626 16.418 3 12 3c-1.43 0-2.774.38-3.936 1.047M10 12v7a2 2 0 1 0 4 0v-5M3 3l18 18";
    const DUST_STORM_PATH_D = "M8 11a1 1 0 1 1 0-2a1 1 0 0 1 0 2m0 2.5a3.5 3.5 0 1 0 0-7a3.5 3.5 0 0 0 0 7M22.999 7c-4.301 0-7.833 3.407-7.998 7.702a1.25 1.25 0 0 0 2.498.096A5.51 5.51 0 0 1 23 9.5a5.501 5.501 0 0 1 .001 11H5.25a1.25 1.25 0 1 0 0 2.5H23a8 8 0 1 0-.001-16m14.988 11.5a6.035 6.035 0 0 0-5.854 4.562l-.096.385a1.25 1.25 0 0 0 2.426.606l.096-.384A3.535 3.535 0 0 1 37.987 21a3.51 3.51 0 0 1 3.513 3.5A3.5 3.5 0 0 1 38 28H5.25a1.25 1.25 0 1 0 0 2.5H30c1.642 0 3 1.368 3 3.04c0 1.628-1.323 2.96-2.922 2.96a2.92 2.92 0 0 1-2.613-1.615l-.097-.194a1.25 1.25 0 1 0-2.236 1.118l.097.194A5.42 5.42 0 0 0 30.079 39c3.009 0 5.421-2.481 5.421-5.46a5.54 5.54 0 0 0-.908-3.04H38a6 6 0 0 0 6-6c0-3.318-2.704-6-6.013-6M19 39a1 1 0 1 0-2 0a1 1 0 0 0 2 0m2.5 0a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0M40 12a1 1 0 1 0-2 0a1 1 0 0 0 2 0m2.5 0a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0";

    const FLUENT_DUST_PATH_D = "M5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2H6a1 1 0 0 1-1-1m5 0a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2h-9a1 1 0 0 1-1-1M3 9a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1m12 0a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1M5 14a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1m5 0a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2h-9a1 1 0 0 1-1-1m-7 5a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1m12 0a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1";

    function drawSvgIcon(ctx, pathD, x, y, size, color, baseSize = 24, flipX = false, rotation = 0) {
      if (typeof Path2D === 'undefined') return;
      const path = new Path2D(pathD);
      ctx.save();
      ctx.translate(x, y);
      if (rotation) {
        ctx.rotate(rotation);
      }
      const scale = size / baseSize;
      ctx.scale(scale, scale);
      if (flipX) {
        ctx.scale(-1, 1);
      }
      ctx.translate(-baseSize / 2, -baseSize / 2);
      ctx.fillStyle = color;
      ctx.fill(path);
      ctx.restore();
    }

    const MOVE_ARROW_PATH_D = "M5 6.41L6.41 5L17 15.59V9h2v10H9v-2h6.59z";

    function drawSvgStrokeIcon(ctx, pathD, x, y, size, color, baseSize = 24) {
      if (typeof Path2D === 'undefined') return;
      const path = new Path2D(pathD);
      ctx.save();
      ctx.translate(x, y);
      const scale = size / baseSize;
      ctx.scale(scale, scale);
      ctx.translate(-baseSize / 2, -baseSize / 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke(path);
      ctx.restore();
    }

    function drawBadgeCircle(ctx, x, y, r) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(15, 23, 42, 0.25)';
      ctx.shadowBlur = Math.max(4, r * 0.6);
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = Math.max(1, r * 0.25);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.lineWidth = Math.max(1, r * 0.05);
      ctx.strokeStyle = '#f9f6f3';
      ctx.stroke();
      ctx.restore();
    }

    function resizeCanvas() {
      overlayCanvas.width = viewerContainer.value.clientWidth;
      overlayCanvas.height = viewerContainer.value.clientHeight;
      drawAllOverlays();
    }

    // build a tiny 8×8 diagonal stripe pattern off‐screen (45°)
    const patternCanvas = document.createElement('canvas');
    patternCanvas.setAttribute('willReadFrequently', 'true');
    patternCanvas.width = patternCanvas.height = 8;
    const pctx = patternCanvas.getContext('2d');
    // fill background with semi-transparent white
    pctx.fillStyle = 'rgba(255,255,255,0.3)';
    pctx.fillRect(0, 0, 8, 8);
    // draw a diagonal gray stripe
    pctx.strokeStyle = 'rgba(115,115,115,0.3)';
    pctx.lineWidth = 4;
    pctx.beginPath();
    pctx.moveTo(0, 8);
    pctx.lineTo(8, 0);
    pctx.stroke();

    function drawAllOverlays() {
      if (!viewer.value || !overlayCtx) return;
      const stripePattern = overlayCtx.createPattern(patternCanvas, 'repeat');
      overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      // Reset popover each draw; will enable if conditions are met
      rottackePopover.value.visible = false;
      // Retention circles
      if (props.retentionVisible) {
        const sizeNorm = 0.03;
        const treesArr = retentionPoints.value;
        const activeFramework = frameworkValue.value;
        const activeStartskog = startskogValue.value;
        treesArr.forEach(tree => {
          if (!tree) return;
          if (activeFramework && tree.framework !== activeFramework) return;
          if (!timeMatches(tree.time, props.currentTime)) return;
          if (!isVisibleForStartskog(tree, activeStartskog)) return;
          const pt = new osdLib.Point(tree.x, tree.y);
          const pixel = viewer.value.viewport.pixelFromPoint(pt, true);
          const normalizedRadius = sizeNorm / 2;
          const pixelRight = viewer.value.viewport.pixelFromPoint(new osdLib.Point(tree.x + normalizedRadius, tree.y), true);
          const radius = Math.abs(pixelRight.x - pixel.x);
          const grad = overlayCtx.createRadialGradient(
            pixel.x, pixel.y, 0,
            pixel.x, pixel.y, radius
          );
          grad.addColorStop(0, 'rgba(255,255,255,0.55)');
          grad.addColorStop(1, 'rgba(255,255,255,0.85)');

          overlayCtx.save();
          overlayCtx.beginPath();
          overlayCtx.arc(pixel.x, pixel.y, radius, 0, 2 * Math.PI);
          overlayCtx.closePath();
          overlayCtx.fillStyle = grad;
          overlayCtx.fill();
          overlayCtx.restore();
          overlayCtx.beginPath();
          overlayCtx.arc(pixel.x, pixel.y, radius, 0, 2 * Math.PI);
          overlayCtx.strokeStyle = 'rgba(255,255,255,0)';
          overlayCtx.lineWidth = 2;
          overlayCtx.stroke();
        });
      }
      // Trädplantor — borderless rectangle with world-anchored dotted rows (trakthygge, 20 år)
      if (
        props.tradplantorVisible &&
        frameworkValue.value === 'trakthygge' &&
        props.currentTime === '20 år'
      ) {
        // Static overlay bounds in image-normalized coordinates
        const x0 = 0.2671, y0 = 0.1383;
        const x1 = 0.7312, y1 = 0.4152;

        const tlPix = viewer.value.viewport.pixelFromPoint(new osdLib.Point(x0, y0), true);
        const brPix = viewer.value.viewport.pixelFromPoint(new osdLib.Point(x1, y1), true);
        const left = Math.min(tlPix.x, brPix.x);
        const right = Math.max(tlPix.x, brPix.x);
        const top = Math.min(tlPix.y, brPix.y);
        const bottom = Math.max(tlPix.y, brPix.y);

        overlayCtx.save();
        overlayCtx.beginPath();
        overlayCtx.rect(left, top, right - left, bottom - top);
        overlayCtx.clip();

        const widthN = Math.abs(x1 - x0);
        const heightN = Math.abs(y1 - y0);

        const spacingNorm = 0.013; // world-space spacing between dots (denser grid)
        const cols = Math.max(1, Math.round(widthN / spacingNorm));
        const rows = Math.max(1, Math.round(heightN / spacingNorm));

        const dx = widthN / cols;
        const dy = heightN / rows;
        const dotNorm = Math.min(dx, dy) * 0.1;

        overlayCtx.beginPath();
        for (let r = 0; r < rows; r++) {
          const yN = y0 + (r + 0.5) * dy;
          for (let c = 0; c < cols; c++) {
            const xN = x0 + (c + 0.5) * dx;
            const pix = viewer.value.viewport.pixelFromPoint(new osdLib.Point(xN, yN), true);
            const pixelRight = viewer.value.viewport.pixelFromPoint(new osdLib.Point(xN + dotNorm, yN), true);
            const radius = Math.abs(pixelRight.x - pix.x);
            if (!isFinite(radius) || radius <= 0.2) continue;
            overlayCtx.moveTo(pix.x + radius, pix.y);
            overlayCtx.arc(pix.x, pix.y, radius, 0, Math.PI * 2);
          }
        }
        overlayCtx.fillStyle = 'rgba(255,255,255,0.85)';
        overlayCtx.fill();
        overlayCtx.restore();
      }
      // Småplantor — very small WHITE circles (same size as saved clicks)
      if (props.smaplantorVisible && smaplantorPoints.value.length) {
        const arr = smaplantorPoints.value;
        const activeFramework = frameworkValue.value;
        const activeStartskog = startskogValue.value;
        arr.forEach(p => {
          if (!p) return;
          if (activeFramework && p.framework && p.framework !== activeFramework) return;
          if (!isVisibleForStartskog(p, activeStartskog)) return;
          if (p.time && !timeMatches(p.time, props.currentTime)) return;

          const pt = new osdLib.Point(p.x, p.y);
          const pixel = viewer.value.viewport.pixelFromPoint(pt, true);
          const normalizedRadius = 0.0005; // same as saved clicks
          const pixelRight = viewer.value.viewport.pixelFromPoint(new osdLib.Point(p.x + normalizedRadius, p.y), true);
          const radius = Math.abs(pixelRight.x - pixel.x);

          overlayCtx.save();
          overlayCtx.beginPath();
          overlayCtx.arc(pixel.x, pixel.y, radius, 0, 2 * Math.PI);
          overlayCtx.fillStyle = 'rgba(255, 255, 255, 0.95)'; // white fill
          overlayCtx.fill();
          overlayCtx.lineWidth = 1;
          overlayCtx.strokeStyle = 'rgba(255,255,255,1)'; // white outline
          overlayCtx.stroke();
          overlayCtx.restore();
        });
      }

      // Högstubbar — very small BLACK circles
      if (props.hogstubbarVisible && hogstubbarPoints.value.length) {
        const arr = hogstubbarPoints.value;
        const activeFramework = frameworkValue.value;
        const activeStartskog = startskogValue.value;
        arr.forEach(p => {
          if (!p) return;
          if (activeFramework && p.framework && p.framework !== activeFramework) return;
          if (!isVisibleForStartskog(p, activeStartskog)) return;
          if (p.time && !timeMatches(p.time, props.currentTime)) return;

          const pt = new osdLib.Point(p.x, p.y);
          const pixel = viewer.value.viewport.pixelFromPoint(pt, true);
          const normalizedRadius = 0.003; // match småplantor/saved clicks size
          const pixelRight = viewer.value.viewport.pixelFromPoint(new osdLib.Point(p.x + normalizedRadius, p.y), true);
          const radius = Math.abs(pixelRight.x - pixel.x);

          overlayCtx.save();
          overlayCtx.beginPath();
          overlayCtx.arc(pixel.x, pixel.y, radius, 0, 2 * Math.PI);
          overlayCtx.fillStyle = 'rgba(0, 0, 0, 0.55)'; // black fill
          overlayCtx.fill();
          overlayCtx.lineWidth = 2;
          overlayCtx.strokeStyle = 'rgba(255,255,255,0.6)'; // black outline
          overlayCtx.stroke();
          overlayCtx.restore();
        });
      }

      // Seed trees (Fröträd) — same look as retention trees, but from seedTrees.json
      if (props.seedTreeVisible) {
        const sizeNorm = 0.03; // same radius as retention
        const seedArr = seedTreePoints.value;
        const activeFramework = frameworkValue.value;
        const activeStartskog = startskogValue.value;
        seedArr.forEach(tree => {
          if (activeFramework && tree.framework !== activeFramework) return;
          if (!timeMatches(tree.time, props.currentTime)) return;
          if (!isVisibleForStartskog(tree, activeStartskog)) return;

          const pt = new osdLib.Point(tree.x, tree.y);
          const pixel = viewer.value.viewport.pixelFromPoint(pt, true);

          const normalizedRadius = sizeNorm / 2;
          const pixelRight = viewer.value.viewport.pixelFromPoint(
            new osdLib.Point(tree.x + normalizedRadius, tree.y),
            true
          );
          const radius = Math.abs(pixelRight.x - pixel.x);

          // Same radial fade as retention (center 1.0 → edge 0.85 currently)
          const grad = overlayCtx.createRadialGradient(pixel.x, pixel.y, 0, pixel.x, pixel.y, radius);
          grad.addColorStop(0, 'rgba(255,255,255,0.55)');
          grad.addColorStop(1, 'rgba(255,255,255,0.85)');

          overlayCtx.save();
          overlayCtx.beginPath();
          overlayCtx.arc(pixel.x, pixel.y, radius, 0, Math.PI * 2);
          overlayCtx.closePath();
          overlayCtx.fillStyle = grad;
          overlayCtx.fill();
          overlayCtx.restore();

          // Outline (same as retention)
          overlayCtx.beginPath();
          overlayCtx.arc(pixel.x, pixel.y, radius, 0, Math.PI * 2);
          overlayCtx.strokeStyle = 'rgba(255,255,255,0)'; // matches your retention outline
          overlayCtx.lineWidth = 2;
          overlayCtx.stroke();
        });
      }

      // Compute active kanteffekt features
      const activeFramework = frameworkValue.value;
      const activeKanteffekt = kanteffektFeatures.value.filter(f =>
        (!activeFramework || f.framework === activeFramework) &&
        (Array.isArray(f.start)
          ? f.start.includes(props.currentTime)
          : f.start === props.currentTime)
      );

      // Kanteffekt polygon overlays
      // Allow Omkringliggande skog to render outer border even when Kanteffekt stripes are hidden
      if (props.kanteffektVisible || props.omkringliggandeSkogVisible) {
        activeKanteffekt
          .filter(f => f.shape === 'polygon')
          .forEach(f => {
            // --- Alpha logic for trakthygge polygons (current vs old) ---
            // Default fully visible
            let baseAlpha = 1;
            // For trakthygge, treat "efter" and "20 år" as current (1),
            // and "50 år"/"80 år" as old (0.5)
            if (f.framework === 'trakthygge') {
              const map = { 'efter': 1, '20 år': 1, '50 år': 0.5, '80 år': 0.5 };
              baseAlpha = map[props.currentTime] ?? 0.5;
            }

            if (f.framework === 'skärmträd') {
              const map = { '10 år': 1, '20 år': 1, '50 år': 0.45, '80 år': 0.45 };
              baseAlpha = map[props.currentTime] ?? 0.5;
            }

            // If this is an "old" kanteffekt and the toggle is off, skip drawing entirely
            if (!props.oldKanteffektVisible && baseAlpha === 0.5) {
              return;
            }

            const alpha = baseAlpha;

            // Use hardcoded coordinates for now (replace with f.outer/f.inner if present)
            const outer = [
              [0.7312, 0.1383], [0.7312, 0.4152], [0.2672, 0.4152], [0.2671, 0.1383]
            ].map(([x, y]) => viewer.value.viewport.pixelFromPoint(new osdLib.Point(x, y), true));
            const inner = [
              [0.7190, 0.1448], [0.5799, 0.1448], [0.5799, 0.1528],
              [0.2800, 0.1528], [0.2800, 0.4030], [0.7190, 0.4030]
            ].map(([x, y]) => viewer.value.viewport.pixelFromPoint(new osdLib.Point(x, y), true));

            if (props.kanteffektVisible) {
              // Draw kanteffekt polygon with 45° stripes
              overlayCtx.save();
              // Create clipping path for polygon with hole
              overlayCtx.beginPath();
              outer.forEach((p, i) => i === 0 ? overlayCtx.moveTo(p.x, p.y) : overlayCtx.lineTo(p.x, p.y));
              overlayCtx.closePath();
              overlayCtx.moveTo(inner[0].x, inner[0].y);
              inner.forEach((p, i) => overlayCtx.lineTo(p.x, p.y));
              overlayCtx.closePath();
              overlayCtx.clip('evenodd');

              // Apply alpha for fill stripes
              overlayCtx.globalAlpha = alpha;

              // Draw diagonal stripes
              overlayCtx.translate(0, 0);
              overlayCtx.rotate(-45 * Math.PI / 180);
              const stripeWidth = 4; // px
              // Use the diagonal of the canvas to cover the entire polygon
              const w = overlayCanvas.width;
              const h = overlayCanvas.height;
              const diag = Math.hypot(w, h);
              const count = Math.ceil((diag + stripeWidth * 2) / (stripeWidth * 2));
              for (let i = -count; i <= count; i++) {
                const x = i * stripeWidth * 2;
                // white stripe
                overlayCtx.fillStyle = 'rgba(255,255,255,1)';
                overlayCtx.fillRect(x, -diag, stripeWidth, diag * 2);
                // gray stripe
                overlayCtx.fillStyle = 'rgba(115,115,115,0.5)';
                overlayCtx.fillRect(x + stripeWidth, -diag, stripeWidth, diag * 2);
              }
              overlayCtx.restore();

              // Draw polygon outline with the same alpha
              overlayCtx.save();
              overlayCtx.globalAlpha = alpha;
              overlayCtx.beginPath();
              outer.forEach((p, i) => i === 0 ? overlayCtx.moveTo(p.x, p.y) : overlayCtx.lineTo(p.x, p.y));
              overlayCtx.closePath();
              overlayCtx.moveTo(inner[0].x, inner[0].y);
              inner.forEach((p, i) => overlayCtx.lineTo(p.x, p.y));
              overlayCtx.closePath();
              overlayCtx.strokeStyle = 'rgba(255,255,255,0.8)';
              overlayCtx.lineWidth = 1;
              overlayCtx.stroke();
              overlayCtx.restore();
            }

            // Omkringliggande skog: draw an outward-only ring hugging the outer boundary (present time only)
            // Use an offscreen canvas to avoid erasing previously drawn kanteffekt stripes/outline
            if (props.omkringliggandeSkogVisible && baseAlpha === 1) {
              const ringCanvas = document.createElement('canvas');
              ringCanvas.width = overlayCanvas.width;
              ringCanvas.height = overlayCanvas.height;
              const ringCtx = ringCanvas.getContext('2d');
              const zoom = viewer.value?.viewport?.getZoom?.(true) || 1;
              ringCtx.save();
              // Thick stroke of the outer polygon
              ringCtx.beginPath();
              outer.forEach((p, i) => i === 0 ? ringCtx.moveTo(p.x, p.y) : ringCtx.lineTo(p.x, p.y));
              ringCtx.closePath();
              ringCtx.strokeStyle = 'rgba(255,255,255,0.2)';
              ringCtx.lineWidth = 200 * zoom;
              ringCtx.lineJoin = 'round';
              ringCtx.lineCap = 'round';
              ringCtx.stroke();
              // Cut away the inner half so it only expands outward
              ringCtx.globalCompositeOperation = 'destination-out';
              ringCtx.fillStyle = 'rgba(0,0,0,1)';
              ringCtx.beginPath();
              outer.forEach((p, i) => i === 0 ? ringCtx.moveTo(p.x, p.y) : ringCtx.lineTo(p.x, p.y));
              ringCtx.closePath();
              ringCtx.fill();
              ringCtx.restore();
              // Composite onto main overlay
              overlayCtx.drawImage(ringCanvas, 0, 0);
            }
          });
      }

      // Draw squareHole overlays for luckhuggning
      // Allow Omkringliggande skog to render independently of Kanteffekt toggle
      if (props.kanteffektVisible || props.omkringliggandeSkogVisible) {
        activeKanteffekt
          .filter(f => f.shape === 'squareHole')
          .forEach(f => {
            const halfNorm = f.size / 2;
            const holeHalfNorm = f.holeSize / 2;
            // Coordinates in pixels
            const centerPt = new osdLib.Point(f.x, f.y);
            const centerPixel = viewer.value.viewport.pixelFromPoint(centerPt, true);
            const pixelRight = viewer.value.viewport.pixelFromPoint(new osdLib.Point(f.x + halfNorm, f.y), true);
            const halfSide = Math.abs(pixelRight.x - centerPixel.x);
            const side = halfSide * 2;
            const pixelHoleRight = viewer.value.viewport.pixelFromPoint(new osdLib.Point(f.x + holeHalfNorm, f.y), true);
            const holeHalfSide = Math.abs(pixelHoleRight.x - centerPixel.x);
            // ---- Opacity per lucka & time ----
            let luckaNum = null;
            const m = typeof f.id === 'string' ? f.id.match(/ke-luckh-(\d+)/) : null;
            if (m) luckaNum = parseInt(m[1], 10);

            const efterGroup = [2, 4, 8, 11, 14];
            const fiftyGroup = [1, 3, 7, 10, 13];
            const eightyGroup = [5, 6, 9, 12, 15];

            const time = props.currentTime;

            // Default to “old” value so we can decide to skip it if needed
            let alpha = 0.5;

            // Compute base alpha from the group + time
            if (luckaNum != null) {
              let baseAlpha = 0.5;

              if (efterGroup.includes(luckaNum)) {
                const map = { 'efter': 1, '20 år': 1, '50 år': 0.5, '80 år': 0.5 };
                baseAlpha = map[time] ?? 0.5;
              } else if (fiftyGroup.includes(luckaNum)) {
                const map = { '50 år': 1, '80 år': 0.5 };
                baseAlpha = map[time] ?? 0.5;
              } else if (eightyGroup.includes(luckaNum)) {
                const map = { '80 år': 1 };
                baseAlpha = map[time] ?? 0.5;
              }

              // If it would have been shown as “old” (0.5) and the checkbox is off,
              // skip drawing this lucka entirely for better performance.
              if (!props.oldKanteffektVisible && baseAlpha === 0.5) {
                return; // skip this squareHole lucka
              }

              alpha = baseAlpha;
            }

            // Draw Kanteffekt stripes+outline only when Kanteffekt is visible
            if (props.kanteffektVisible) {
              // Clip path: outer rect minus inner hole (ring style)
              overlayCtx.save();
              overlayCtx.globalAlpha = alpha;
              overlayCtx.beginPath();
              overlayCtx.rect(centerPixel.x - halfSide, centerPixel.y - halfSide, side, side);
              overlayCtx.rect(centerPixel.x - holeHalfSide, centerPixel.y - holeHalfSide, holeHalfSide * 2, holeHalfSide * 2);
              overlayCtx.clip('evenodd');
              // Draw stripes
              overlayCtx.translate(centerPixel.x, centerPixel.y);
              overlayCtx.rotate(-45 * Math.PI / 180);
              const stripeWidth = 4;
              const diagRect = Math.hypot(side, side);
              const count = Math.ceil((diagRect + stripeWidth * 2) / (stripeWidth * 2));
              for (let i = -count; i <= count; i++) {
                const x = i * stripeWidth * 2;
                overlayCtx.fillStyle = 'rgba(255,255,255,1)';
                overlayCtx.fillRect(x, -diagRect, stripeWidth, diagRect * 2);
                overlayCtx.fillStyle = 'rgba(115,115,115,0.8)';
                overlayCtx.fillRect(x + stripeWidth, -diagRect, stripeWidth, diagRect * 2);
              }
              overlayCtx.restore();
              // Draw outer square outline
              overlayCtx.save();
              overlayCtx.globalAlpha = alpha;
              overlayCtx.beginPath();
              overlayCtx.rect(centerPixel.x - halfSide, centerPixel.y - halfSide, side, side);
              overlayCtx.strokeStyle = 'rgba(255,255,255,1)';
              overlayCtx.lineWidth = 1;
              overlayCtx.stroke();
              overlayCtx.restore();
            }

            // Omkringliggande skog: outward-only ring for the outer square (offscreen to preserve kanteffekt)
            // Present time only (do not show traces from previous times)
            if (props.omkringliggandeSkogVisible && alpha === 1) {
              const ringCanvas = document.createElement('canvas');
              ringCanvas.width = overlayCanvas.width;
              ringCanvas.height = overlayCanvas.height;
              const ringCtx = ringCanvas.getContext('2d');
              const zoom = viewer.value?.viewport?.getZoom?.(true) || 1;
              ringCtx.save();
              ringCtx.strokeStyle = 'rgba(255,255,255,0.2)';
              ringCtx.lineWidth = 200 * zoom;
              ringCtx.lineJoin = 'round';
              ringCtx.lineCap = 'round';
              ringCtx.beginPath();
              ringCtx.rect(centerPixel.x - halfSide, centerPixel.y - halfSide, side, side);
              ringCtx.stroke();
              // Carve out inner area (remove inner half so thickness is outward-only)
              ringCtx.globalCompositeOperation = 'destination-out';
              ringCtx.fillStyle = 'rgba(0,0,0,1)';
              ringCtx.fillRect(centerPixel.x - halfSide, centerPixel.y - halfSide, side, side);
              // Also cut the ring wherever it overlaps any other visible (present-time) lucka's outer area
              try {
                activeKanteffekt
                  .filter(g => g.shape === 'squareHole')
                  .forEach(g => {
                    // Determine if this patch is visible in the current view
                    let visible2 = true;
                    let luckaNum2 = null;
                    const m2 = typeof g.id === 'string' ? g.id.match(/ke-luckh-(\d+)/) : null;
                    if (m2) luckaNum2 = parseInt(m2[1], 10);
                    if (luckaNum2 != null) {
                      const efterGroup2 = [2, 4, 8, 11, 14];
                      const fiftyGroup2 = [1, 3, 7, 10, 13];
                      const eightyGroup2 = [5, 6, 9, 12, 15];
                      const t2 = props.currentTime;
                      let baseAlpha2 = 0.5;
                      if (efterGroup2.includes(luckaNum2)) {
                        const map2 = { 'efter': 1, '20 år': 1, '50 år': 0.5, '80 år': 0.5 };
                        baseAlpha2 = map2[t2] ?? 0.5;
                      } else if (fiftyGroup2.includes(luckaNum2)) {
                        const map2 = { '50 år': 1, '80 år': 0.5 };
                        baseAlpha2 = map2[t2] ?? 0.5;
                      } else if (eightyGroup2.includes(luckaNum2)) {
                        const map2 = { '80 år': 1 };
                        baseAlpha2 = map2[t2] ?? 0.5;
                      }
                      // Only consider present-time patches for cutting
                      if (baseAlpha2 !== 1) visible2 = false;
                    }
                    if (!visible2) return;
                    const halfNorm2 = g.size / 2;
                    const centerPt2 = new osdLib.Point(g.x, g.y);
                    const centerPixel2 = viewer.value.viewport.pixelFromPoint(centerPt2, true);
                    const pixelRight2 = viewer.value.viewport.pixelFromPoint(new osdLib.Point(g.x + halfNorm2, g.y), true);
                    const halfSide2 = Math.abs(pixelRight2.x - centerPixel2.x);
                    const side2 = halfSide2 * 2;
                    ringCtx.fillRect(centerPixel2.x - halfSide2, centerPixel2.y - halfSide2, side2, side2);
                  });
              } catch { }
              ringCtx.restore();
              overlayCtx.drawImage(ringCanvas, 0, 0);
            }

            // ---- Corner label: harvest year per start set ----
            // Decide label from group membership
            let harvestLabel = null;
            if (luckaNum != null) {
              if (efterGroup.includes(luckaNum)) {
                harvestLabel = '';
              } else if (fiftyGroup.includes(luckaNum)) {
                harvestLabel = '';
              } else if (eightyGroup.includes(luckaNum)) {
                harvestLabel = '';
              }
            }
            if (harvestLabel) {
              // Font size relative to square size (clamped smaller)
              const fontPx = Math.max(9, Math.min(14, side * 0.12));
              // Top-left corner of outer square with small padding
              const left = centerPixel.x - halfSide;
              const top = centerPixel.y - halfSide;
              const padX = Math.max(3, fontPx * 0.3);
              const padY = Math.max(2, fontPx * 0.2);

              overlayCtx.save();
              overlayCtx.globalAlpha = 1; // Always readable
              overlayCtx.font = `${fontPx}px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`;
              overlayCtx.textAlign = 'left';
              overlayCtx.textBaseline = 'top';

              // Measure text to size the background box
              const metrics = overlayCtx.measureText(harvestLabel);
              const textW = metrics.width;
              const textH = fontPx * 1.2; // approximate line height

              // Draw black background box
              const boxX = left + padX;
              const boxY = top + padY;
              const boxW = textW + padX * 2;
              const boxH = textH + padY * 2;
              overlayCtx.fillStyle = 'rgba(0,0,0,0.85)';
              overlayCtx.fillRect(boxX - padX, boxY - padY, boxW, boxH);

              // Draw white text
              overlayCtx.fillStyle = 'white';
              overlayCtx.fillText(harvestLabel, boxX, boxY);

              overlayCtx.restore();
            }

            // reset alpha for safety
            overlayCtx.globalAlpha = 1;
          });
      }
      // Kontinuerligt rottäcke rectangle overlay (same dimensions as static overlay)
      if (props.rottackeSkarmtradVisible || props.rottackeBladningVisible) {
        const fw = frameworkValue.value;
        const t = props.currentTime;

        const isSkarmtrad = fw === 'skärmträd' || fw === 'skarmtrad';
        const isBladning = fw === 'blädning' || fw === 'bladning';

        const showForSkarmtrad = props.rottackeSkarmtradVisible && isSkarmtrad && (t === 'efter');
        const showForBladning = props.rottackeBladningVisible && isBladning && (t === 'efter' || t === '20 år' || t === '50 år' || t === '80 år');

        if (showForSkarmtrad || showForBladning) {
          // Same normalized rect as the static overlay
          const norm = { x: 0.2675, y: 0.1393, width: 0.465, height: 0.275 };

          const p1 = viewer.value.viewport.pixelFromPoint(new osdLib.Point(norm.x, norm.y), true);
          const p2 = viewer.value.viewport.pixelFromPoint(new osdLib.Point(norm.x + norm.width, norm.y + norm.height), true);
          const w = p2.x - p1.x;
          const h = p2.y - p1.y;

          // Set popover for Blädning at 'efter' only
          if (props.rottackeBladningVisible && isBladning && t === 'efter') {
            rottackePopover.value = {
              visible: true,
              top: Math.min(p1.y, p2.y),
              left: Math.min(p1.x, p2.x),
              width: Math.abs(w),
              height: Math.abs(h)
            };
          }

          // Clip to rectangle and draw standard 45° stripes
          overlayCtx.save();
          overlayCtx.beginPath();
          overlayCtx.rect(p1.x, p1.y, w, h);
          overlayCtx.clip();

          overlayCtx.translate(p1.x + w / 2, p1.y + h / 2);
          overlayCtx.rotate(-45 * Math.PI / 180);
          const stripeWidth = 4; // px
          const diag = Math.hypot(w, h);
          const count = Math.ceil((diag + stripeWidth * 2) / (stripeWidth * 2));
          for (let i = -count; i <= count; i++) {
            const x = i * stripeWidth * 2;
            // white stripe
            overlayCtx.fillStyle = 'rgba(255,255,255,0.7)';
            overlayCtx.fillRect(x, -diag, stripeWidth, diag * 2);
            // gray stripe
            overlayCtx.fillStyle = 'rgba(115,115,115,0.5)';
            overlayCtx.fillRect(x + stripeWidth, -diag, stripeWidth, diag * 2);
          }
          overlayCtx.restore();

          // Outline for clarity (same vibe as others)
          overlayCtx.save();
          overlayCtx.strokeStyle = 'rgba(255,255,255,0.8)';
          overlayCtx.lineWidth = 2;
          overlayCtx.strokeRect(p1.x, p1.y, w, h);
          overlayCtx.restore();
        }
      }

      // Clean up previously-added Naturvård DOM overlays; we'll rebuild them each draw
      if (viewer.value && naturvardDomOverlayIds.length) {
        naturvardDomOverlayIds.forEach((id) => {
          try { viewer.value.removeOverlay(id); } catch { }
        });
        naturvardDomOverlayIds = [];
      }

      // Naturvårdsarter — draw award-star icon last so it stays on top of other overlays
      if (props.naturvardsarterVisible && naturvardPoints.value.length) {
        const arr = naturvardPoints.value;
        const activeFramework = frameworkValue.value;
        const activeStartskog = startskogValue.value;

        const sortedPoints = [...arr].sort((a, b) => {
          const priority = (point) => {
            if (!point?.id) return 0;
            if (point.id === 'myc-7') return 1;
            if (point.id === 'myc-7.1') return 2;
            return 0;
          };
          return priority(a) - priority(b);
        });

        // Special rule support: if myc-7.1 is visible, suppress tooltip for myc-7
        const hasMyc71Visible = sortedPoints.some((q) => {
          if (!q) return false;
          if (q.id !== 'myc-7.1') return false;
          if (activeFramework && !valueMatches(q.framework, activeFramework)) return false;
          if (activeStartskog && q.startskog && q.startskog !== activeStartskog) return false;
          if (q.time && !timeMatches(q.time, props.currentTime)) return false;
          if (q.removed) return false; // removed is not visible for this rule
          return true;
        });

        const hitboxes = [];

        sortedPoints.forEach((p) => {
          if (!p) return;
          if (activeFramework && !valueMatches(p.framework, activeFramework)) return;
          if (activeStartskog && p.startskog && p.startskog !== activeStartskog) return;
          if (p.time && !timeMatches(p.time, props.currentTime)) return;

          const pt = new osdLib.Point(p.x, p.y);
          const pixel = viewer.value.viewport.pixelFromPoint(pt, true);
          const normalizedRadius = 0.008;
          const pixelRight = viewer.value.viewport.pixelFromPoint(new osdLib.Point(p.x + normalizedRadius, p.y), true);
          const radius = Math.abs(pixelRight.x - pixel.x);
          const isRemoved = !!p.removed;
          const isMovementSource = p.id === 'myc-7';
          const isMovementTarget = p.id === 'myc-7.1';

          let tooltipMessage = 'Naturvårdsart som fanns i beståndet från början';
          let hoverX = pixel.x;
          let hoverY = pixel.y;
          let hoverRadius = Math.max(radius * 1.6, 18);

          if (isRemoved) {
            overlayCtx.save();
            overlayCtx.globalAlpha = isMovementSource ? 0.4 : 0.5;
            drawAwardStar(overlayCtx, pixel.x, pixel.y, radius);
            overlayCtx.restore();

            if (!isMovementSource) {
              const crossRadius = radius * 1.2;
              overlayCtx.save();
              overlayCtx.strokeStyle = 'rgba(239,68,68,0.9)';
              overlayCtx.lineWidth = Math.max(1, radius * 0.25);
              overlayCtx.beginPath();
              overlayCtx.moveTo(pixel.x - crossRadius, pixel.y - crossRadius);
              overlayCtx.lineTo(pixel.x + crossRadius, pixel.y + crossRadius);
              overlayCtx.moveTo(pixel.x - crossRadius, pixel.y + crossRadius);
              overlayCtx.lineTo(pixel.x + crossRadius, pixel.y - crossRadius);
              overlayCtx.stroke();
              overlayCtx.restore();

              const iconRadius = radius * 0.7;
              const offset = radius * 0.9;
              const iconX = pixel.x + offset;
              const iconY = pixel.y - offset;

              drawBadgeCircle(overlayCtx, iconX, iconY, iconRadius);

              const iconSize = iconRadius * 1.5;
              if (p.id === 'myc-2') {
                drawSvgStrokeIcon(overlayCtx, RANDOM_LINE_PATH_D, iconX, iconY, iconSize, '#5a3f34');
              } else {
                drawSvgIcon(overlayCtx, SAW_BLADE_PATH_D, iconX, iconY, iconSize, '#5a3f34');
              }

              tooltipMessage = p.id === 'myc-2'
                ? 'Naturvårdsart som dött av ålder eller blivit utkonkurerad av annan art'
                : 'Naturvårdsart som försvann vid avverkning';
              hoverX = iconX;
              hoverY = iconY;
              hoverRadius = Math.max(iconRadius * 1.6, hoverRadius);
            }
          } else {
            drawAwardStar(overlayCtx, pixel.x, pixel.y, radius);

            if (isMovementTarget) {
              const iconRadius = radius * 0.7;
              const offset = radius * 0.9;
              const iconX = pixel.x + offset;
              const iconY = pixel.y - offset;

              drawBadgeCircle(overlayCtx, iconX, iconY, iconRadius);

              const iconSize = iconRadius * 1.5;
              drawSvgIcon(overlayCtx, MOVE_ARROW_PATH_D, iconX, iconY, iconSize, '#5a3f34');

              tooltipMessage = 'Arten har förflyttat sig själv';
              hoverX = iconX;
              hoverY = iconY;
              hoverRadius = Math.max(iconRadius * 1.6, hoverRadius);
            } else if (p.id === 'myc-11' || p.id === 'myc-12') {
              const iconRadius = radius * 0.7;
              const offset = radius * 0.9;
              const baseX = pixel.x + offset;
              const iconY = pixel.y - offset;
              const iconSize = iconRadius * 1.3;

              if (p.id === 'myc-11') {
                const spacing = iconRadius * 1.3;
                const firstX = baseX - spacing / 2;
                const secondX = baseX + spacing / 1.5;
                drawBadgeCircle(overlayCtx, firstX, iconY, iconRadius);
                drawSvgIcon(overlayCtx, FLUENT_DUST_PATH_D, firstX, iconY, iconSize, '#5a3f34', 24);


                drawBadgeCircle(overlayCtx, secondX, iconY, iconRadius);
                drawSvgIcon(overlayCtx, MOVE_ARROW_PATH_D, secondX, iconY, iconSize, '#5a3f34', 24, false, Math.PI);


                tooltipMessage = 'Naturvårdsart som etablerats med spridda sporer';
                hoverX = baseX;
                hoverY = iconY;
                hoverRadius = Math.max(iconRadius * 2.2, hoverRadius);
              } else {
                drawBadgeCircle(overlayCtx, baseX, iconY, iconRadius);
                drawSvgIcon(overlayCtx, DUST_STORM_PATH_D, baseX, iconY, iconSize, '#5a3f34', 48, true);

                tooltipMessage = 'Naturvårdsart som etablerats med spridda sporer';
                hoverX = baseX;
                hoverY = iconY;
                hoverRadius = Math.max(iconRadius * 1.6, hoverRadius);
              }
            }
          }

          if (props.showOverlayLabels && p.id) {
            overlayCtx.save();
            overlayCtx.font = `${Math.max(6, radius * 1.1).toFixed(0)}px "Segoe UI", system-ui, sans-serif`;
            if (isRemoved) {
              overlayCtx.fillStyle = 'rgba(239, 68, 68, 0.9)';
              overlayCtx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
            } else {
              overlayCtx.fillStyle = 'rgba(17, 24, 39, 0.85)';
              overlayCtx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            }
            overlayCtx.lineWidth = Math.max(1, radius * 0.15);
            const labelX = pixel.x + radius * -1;
            const labelY = pixel.y - radius * 1.4;
            overlayCtx.strokeText(p.id, labelX, labelY);
            overlayCtx.fillText(p.id, labelX, labelY);
            overlayCtx.restore();
          }

          // Center the trigger on the main award star, not the auxiliary icon.
          // Expand the radius to also cover the optional top-right icon when present.
          let captureRadius = Math.max(radius * 1.6, 18);
          // If there's an icon rendered in the top-right corner, include it in the capture radius
          if ((isRemoved && !isMovementSource) || isMovementTarget || p.id === 'myc-11' || p.id === 'myc-12') {
            const iconRadius = radius * 0.7;
            const offset = radius * 0.9; // icon is placed at (+offset, -offset)
            const distCenterToIcon = Math.hypot(offset, offset);
            captureRadius = Math.max(captureRadius, distCenterToIcon + iconRadius);
          }

          // Special rule: when myc-7.1 is visible, do NOT show tooltip for myc-7
          if (p.id === 'myc-7' && hasMyc71Visible) {
            return; // skip adding hitbox for myc-7
          }

          // Create an OSD DOM overlay so we can apply CSS cursor:pointer via className
          try {
            // Center in viewport coordinates at the star’s image position
            const anchorVp = viewer.value.viewport.imageToViewportCoordinates(p.x, p.y);
            // Convert our pixel capture radius to viewport-space width/height
            const deltaVp = viewer.value.viewport.deltaPointsFromPixels(new osdLib.Point(captureRadius * 2, captureRadius * 2), true);
            const rect = new osdLib.Rect(
              anchorVp.x - deltaVp.x / 2,
              anchorVp.y - deltaVp.y / 2,
              Math.max(deltaVp.x, 1e-8),
              Math.max(deltaVp.y, 1e-8)
            );

            const el = document.createElement('div');
            el.className = 'clickable-overlay';
            const overlayId = `nv-click-${p.id}-${Math.round(pixel.x)}-${Math.round(pixel.y)}`;
            el.id = overlayId;

            // Use viewport rect directly
            viewer.value.addOverlay({ element: el, location: rect, id: overlayId });
            naturvardDomOverlayIds.push(overlayId);
          } catch { }

          hitboxes.push({
            x: pixel.x,          // CENTER on main overlay
            y: pixel.y,
            radius: captureRadius,
            message: tooltipMessage,
            worldX: p.x,         // NEW: anchor in world/image-normalized coordinates
            worldY: p.y
          });
        });

        naturvardHitboxes.value = hitboxes;
        if (!hitboxes.length) {
          naturvardTooltip.value = null;
          naturvardTooltipOpen.value = false;
        }
      } else {
        naturvardHitboxes.value = [];
        naturvardTooltip.value = null;
        naturvardTooltipOpen.value = false;
        if (viewer.value && naturvardDomOverlayIds.length) {
          naturvardDomOverlayIds.forEach((id) => {
            try { viewer.value.removeOverlay(id); } catch { }
          });
          naturvardDomOverlayIds = [];
        }
      }

      // Keep Naturvård tooltip following the overlay during pan/zoom
      if (naturvardTooltipOpen.value && naturvardTooltip.value && naturvardTooltip.value.anchorWorldX != null) {
        try {
          const pt = new osdLib.Point(naturvardTooltip.value.anchorWorldX, naturvardTooltip.value.anchorWorldY);
          const pix = viewer.value.viewport.pixelFromPoint(pt, true);
          const containerWidth = viewerContainer.value.clientWidth;
          const containerHeight = viewerContainer.value.clientHeight;
          const offX = naturvardTooltip.value.offsetX ?? 12;
          const offY = naturvardTooltip.value.offsetY ?? -28;
          const left = Math.min(Math.max(pix.x + offX, 0), containerWidth - 10);
          const top = Math.min(Math.max(pix.y + offY, 0), containerHeight - 10);
          naturvardTooltip.value = { ...naturvardTooltip.value, left, top };
        } catch { }
      }

      // Static rectangle overlay
      if (overlayStore.staticOverlayVisible) {
        // Normalized rectangle coords
        const norm = { x: 0.2675, y: 0.1393, width: 0.465, height: 0.275 };
        const p1 = viewer.value.viewport.pixelFromPoint(new osdLib.Point(norm.x, norm.y), true);
        const p2 = viewer.value.viewport.pixelFromPoint(new osdLib.Point(norm.x + norm.width, norm.y + norm.height), true);
        const w = p2.x - p1.x;
        const h = p2.y - p1.y;
        overlayCtx.strokeStyle = 'white';
        overlayCtx.lineWidth = 2;
        overlayCtx.strokeRect(p1.x, p1.y, w, h);
      }
      // Saved clicks — small circles (dev)
      if (localSavedClicks.value.length) {
        const activeFramework = frameworkValue.value;
        const activeStartskog = startskogValue.value;
        localSavedClicks.value.forEach(c => {
          // Filter by current context if present on the click
          if (activeFramework && c.framework && c.framework !== activeFramework) return;
          if (activeStartskog && c.startskog && c.startskog !== activeStartskog) return;
          if (c.time && !timeMatches(c.time, props.currentTime)) return;

          const pt = new osdLib.Point(c.x, c.y);
          const pixel = viewer.value.viewport.pixelFromPoint(pt, true);
          const normalizedRadius = 0.0005; // smaller marker
          const pixelRight = viewer.value.viewport.pixelFromPoint(new osdLib.Point(c.x + normalizedRadius, c.y), true);
          const radius = Math.abs(pixelRight.x - pixel.x);

          overlayCtx.save();
          overlayCtx.beginPath();
          overlayCtx.arc(pixel.x, pixel.y, radius, 0, 2 * Math.PI);
          overlayCtx.fillStyle = 'rgba(255, 255, 255, 0.95)'; // yellow-ish
          overlayCtx.fill();
          overlayCtx.lineWidth = 1;
          overlayCtx.strokeStyle = 'rgba(255, 255, 255, 1)';   // amber-ish
          overlayCtx.stroke();
          overlayCtx.restore();
        });
      }
    }





    // Insert overlayStore declaration before the watchers
    const overlayStore = useOverlayStore();

    // Redraw overlays immediately when visibility toggles
    watch(() => props.retentionVisible, () => {
      if (overlayCtx) drawAllOverlays();
    });
    watch(() => props.kanteffektVisible, () => {
      if (overlayCtx) drawAllOverlays();
    });
    watch(() => overlayStore.staticOverlayVisible, () => {
      if (overlayCtx) drawAllOverlays();
    });
    watch(() => props.omkringliggandeSkogVisible, () => {
      if (overlayCtx) drawAllOverlays();
    });
    watch(() => props.oldKanteffektVisible, () => {
      if (overlayCtx) drawAllOverlays();
    });
    watch(() => props.currentTime, () => {
      if (overlayCtx) drawAllOverlays();
    });
    watch(() => props.currentFramework, () => {
      if (overlayCtx) drawAllOverlays();
    });
    watch(frameworkValue, () => {
      if (overlayCtx) drawAllOverlays();
    });
    watch(() => props.rottackeSkarmtradVisible, () => {
      if (overlayCtx) drawAllOverlays();
    });
    watch(() => props.rottackeBladningVisible, () => {
      if (overlayCtx) drawAllOverlays();
    });
    watch(() => props.seedTreeVisible, () => {
      if (overlayCtx) drawAllOverlays();
    });
    // Redraw on dev flag toggle
    watch(() => props.devSaveClicks, () => {
      if (overlayCtx) drawAllOverlays();
    });
    watch(() => props.showOverlayLabels, () => {
      if (overlayCtx) drawAllOverlays();
    });
    watch(() => props.smaplantorVisible, () => {
      if (overlayCtx) drawAllOverlays();
    });
    watch(() => props.hogstubbarVisible, () => {
      if (overlayCtx) drawAllOverlays();
    });
    watch(() => props.naturvardsarterVisible, () => {
      if (overlayCtx) drawAllOverlays();
    });
    watch(() => props.naturvardsarterVisible, (visible) => {
      if (!visible) {
        naturvardTooltip.value = null;
        naturvardHitboxes.value = [];
        naturvardTooltipOpen.value = false;
      }
    });
    watch(() => props.tradplantorVisible, () => {
      if (overlayCtx) drawAllOverlays();
    });
    watch(startskogValue, () => {
      if (overlayCtx) drawAllOverlays();
    });

    watch(() => props.retentionPoints, () => {
      if (overlayCtx) drawAllOverlays();
    }, { deep: true });
    watch(() => props.seedTreePoints, () => {
      if (overlayCtx) drawAllOverlays();
    }, { deep: true });
    watch(() => props.smaplantorPoints, () => {
      if (overlayCtx) drawAllOverlays();
    }, { deep: true });
    watch(() => props.hogstubbarPoints, () => {
      if (overlayCtx) drawAllOverlays();
    }, { deep: true });
    watch(() => props.naturvardsarterPoints, () => {
      if (overlayCtx) drawAllOverlays();
    }, { deep: true });
    watch(() => props.kanteffektFeatures, () => {
      if (overlayCtx) drawAllOverlays();
    }, { deep: true });

    if (import.meta.dev) {
      watch(
        [
          retentionPoints,
          seedTreePoints,
          smaplantorPoints,
          hogstubbarPoints,
          naturvardPoints,
          kanteffektFeatures,
        ],
        ([ret, seed, small, stub, natur, kante]) => {
          console.log('[OSD] overlay datasets', {
            retention: ret?.length ?? 0,
            seed: seed?.length ?? 0,
            smaplantor: small?.length ?? 0,
            hogstubbar: stub?.length ?? 0,
            naturvardsarter: natur?.length ?? 0,
            kanteffekt: kante?.length ?? 0,
          });
        },
        { immediate: true },
      );
    }



    const viewerId = computed(
      () => "openseadragon-viewer-" + Math.random().toString(36).substr(2, 9)
    );
    let osdLib = null;
    let unmounted = false;
    const currentTile = ref(null);
    const overlayImage = ref(null);
    function refreshOverlayTile(tileSource) {
      if (!viewer.value) return;
      if (overlayImage.value) {
        viewer.value.world.removeItem(overlayImage.value);
        overlayImage.value.destroy();
        overlayImage.value = null;
      }
      if (!tileSource) return;
      viewer.value.addTiledImage({
        tileSource,
        crossOriginPolicy: 'Anonymous',
        ajaxWithCredentials: false,
        opacity: overlayOpacityLocal.value,
        success: event => {
          overlayImage.value = event.item;
        }
      });
    }

    // Track annotation overlays as { id, app } objects for teardown
    let annotationOverlayApps = [];

    // Track DOM overlays created for Naturvård clickable areas (className passed to OSD)
    let naturvardDomOverlayIds = [];
    // Track MouseTracker instances and animation handler for cleanup
    let mouseTrackers = [];
    let animationHandler;












    // Fully tear down an existing viewer instance
    function destroyViewer() {
      if (!viewer.value) return;
      if (animationHandler) {
        viewer.value.removeHandler('animation', animationHandler);
        animationHandler = null;
      }
      mouseTrackers.forEach(tracker => tracker.destroy());
      mouseTrackers = [];
      annotationOverlayApps.forEach(({ id, app }) => {
        app.unmount();
        viewer.value.removeOverlay(id);
      });
      annotationOverlayApps = [];
      viewerContainer.value
        .querySelectorAll('.osd-snapshot')
        .forEach(el => el.remove());
      // Force GPU memory to be released for WebGL contexts
      const canvas = viewerContainer.value.querySelector('canvas');
      if (canvas) {
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          const ext = gl.getExtension('WEBGL_lose_context');
          if (ext) ext.loseContext();
        }
      }
      // Disconnect ResizeObserver
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
      // remove our overlay canvas
      window.removeEventListener('resize', resizeCanvas);
      if (overlayCanvas.parentNode) overlayCanvas.parentNode.removeChild(overlayCanvas);
      viewer.value.clearOverlays();
      naturvardDomOverlayIds = [];
      viewer.value.destroy();
      viewer.value = null;
      currentTile.value = null;
      overlayImage.value = null;
    }

    function handleNaturvardClick(event) {
      if (!viewerContainer.value) return;
      if (!props.naturvardsarterVisible || naturvardHitboxes.value.length === 0) {
        naturvardTooltip.value = null;
        naturvardTooltipOpen.value = false;
        return;
      }
      const rect = viewerContainer.value.getBoundingClientRect();
      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;

      let matched = null;
      for (const hit of naturvardHitboxes.value) {
        const dx = pointerX - hit.x;
        const dy = pointerY - hit.y;
        if (dx * dx + dy * dy <= hit.radius * hit.radius) {
          matched = hit;
          break;
        }
      }

      if (matched) {
        const containerWidth = viewerContainer.value.clientWidth;
        const containerHeight = viewerContainer.value.clientHeight;
        // Compute current pixel position from anchor world coords
        const pt = new osdLib.Point(matched.worldX ?? 0, matched.worldY ?? 0);
        const pix = viewer.value.viewport.pixelFromPoint(pt, true);
        const offsetX = 12; // same visual offset as before
        const offsetY = -28;
        const left = Math.min(Math.max(pix.x + offsetX, 0), containerWidth - 10);
        const top = Math.min(Math.max(pix.y + offsetY, 0), containerHeight - 10);
        naturvardTooltip.value = {
          message: matched.message,
          left,
          top,
          anchorWorldX: matched.worldX ?? null,
          anchorWorldY: matched.worldY ?? null,
          offsetX,
          offsetY,
        };
        naturvardTooltipOpen.value = true;
      } else {
        naturvardTooltipOpen.value = false;
        nextTick(() => { naturvardTooltip.value = null; });
      }
    }

    function handleNaturvardCursor(event) {
      if (!viewerContainer.value) return;
      if (!props.naturvardsarterVisible || naturvardHitboxes.value.length === 0) {
        viewerContainer.value.style.cursor = 'default';
        return;
      }
      const rect = viewerContainer.value.getBoundingClientRect();
      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;

      let hovering = false;
      for (const hit of naturvardHitboxes.value) {
        const dx = pointerX - hit.x;
        const dy = pointerY - hit.y;
        if (dx * dx + dy * dy <= hit.radius * hit.radius) {
          hovering = true;
          break;
        }
      }
      viewerContainer.value.style.cursor = hovering ? 'pointer' : 'default';
    }

    function attachClickHandlers() {
      if (!viewerContainer.value) return;
      if (!naturvardClickHandler) {
        naturvardClickHandler = (event) => handleNaturvardClick(event);
        // capture so we run before OSD’s internal handlers
        viewerContainer.value.addEventListener('click', naturvardClickHandler, { capture: true, passive: true });
        viewerContainer.value.addEventListener('mousemove', handleNaturvardCursor, { passive: true });
      }
      if (!outsideClickHandler) {
        outsideClickHandler = (event) => {
          const el = viewerContainer.value;
          if (!el) return;
          if (!el.contains(event.target)) {
            naturvardTooltipOpen.value = false;
            nextTick(() => { naturvardTooltip.value = null; });
          }
        };
        // capture to catch outside clicks reliably
        document.addEventListener('click', outsideClickHandler, true);
      }
    }

    function detachClickHandlers() {
      if (viewerContainer.value && naturvardClickHandler) {
        viewerContainer.value.removeEventListener('click', naturvardClickHandler, { capture: true });
      }
      if (viewerContainer.value) {
        viewerContainer.value.removeEventListener('mousemove', handleNaturvardCursor);
        viewerContainer.value.style.cursor = 'default';
      }
      if (outsideClickHandler) {
        document.removeEventListener('click', outsideClickHandler, true);
      }
      naturvardClickHandler = null;
      outsideClickHandler = null;
      naturvardTooltip.value = null;
      naturvardTooltipOpen.value = false;
    }

    // Legacy shims: map old hover API to new click-based API
    function attachHoverHandlers() {
      attachClickHandlers();
    }
    function detachHoverHandlers() {
      detachClickHandlers();
    }

    // Debounced tile transition
    const doTileTransition = debounce(newUrl => transitionToNewTile(newUrl), 100);
    watch(() => props.dziUrl, (newUrl, oldUrl) => {
      if (viewer.value && newUrl !== oldUrl) {
        doTileTransition(newUrl);
      }
    });

    watch(() => props.overlayDziUrl, (newUrl, oldUrl) => {
      if (!viewer.value || newUrl === oldUrl) return;
      refreshOverlayTile(newUrl);
    });

    const panelStore = usePanelStore();
    const isPanelMinimized = computed(() => panelStore.isPanelMinimized);

    function togglePanelMinimized() {
      panelStore.togglePanel();
    }

    const numericTime = computed(() => {
      let result;
      const lowerTime = props.currentTime.toLowerCase();
      if (lowerTime.includes("innan")) {
        result = 0;
      } else if (lowerTime.includes("efter")) {
        result = 1;
      } else {
        result = parseInt(props.currentTime);
      }
      console.log("currentTime:", props.currentTime, "numericTime:", result);
      return result;
    });
    const adjustedSvamparTime = computed(() => {
      // For SvamparSkogsbruk.json, change 0 to -2
      return numericTime.value === 0 ? -2 : numericTime.value;
    });

    const adjustedTotalSvamparTime = computed(() => {
      // For TotalSvamparSkogsbruk.json, change 0 to -4
      return numericTime.value === 0 ? -4 : numericTime.value;
    });

    const svampMycelValue = computed(() => {
      const fw = frameworkValue.value;
      if (!fw) return 'N/A';
      const match = totalSvamparDataset.value.find(item =>
        item.artkategori === "total" &&
        item.frameworks === fw &&
        Number(item.ålder) === adjustedTotalSvamparTime.value
      );
      return match ? match.klassning : 'N/A';
    });

    const matsvampMycelValue = computed(() => {
      const fw = frameworkValue.value;
      const skog = startskogValue.value;
      if (!fw || !skog) return 'N/A';
      const match = matsvampDataset.value.find(item =>
        item.artkategori === "matsvamp" &&
        item.startskog === skog &&
        item.frameworks === fw &&
        Number(item.ålder) === adjustedSvamparTime.value
      );
      return match ? match.klassning : 'N/A';
    });

    const rodlistadeMycelValue = computed(() => {
      const fw = frameworkValue.value;
      const skog = startskogValue.value;
      if (!fw || !skog) return 'N/A';
      const match = signalRodlistadeDataset.value.find(item =>
        item.artkategori === "rödlistade + signalarter" &&
        item.startskog === skog &&
        item.frameworks === fw &&
        Number(item.ålder) === adjustedSvamparTime.value
      );
      return match ? match.klassning : 'N/A';
    });


    const timelineInfo = computed(() => {
      const fw = frameworkValue.value;
      const skog = startskogValue.value;
      if (!fw || !props.currentTime || !skog) {
        return null;
      }
      return timelineData.find(item =>
        item.atgard === fw &&
        item.tid === props.currentTime &&
        item.startskog === skog
      );
    });

    // Reactive variable for viewport coordinates (for marker placement)
    const mousePos = ref({ x: 0, y: 0 });
    function updateMousePosition(e) {
      if (!viewerContainer.value || !viewer.value || !osdLib) return;
      const rect = viewerContainer.value.getBoundingClientRect();
      const containerX = e.clientX - rect.left;
      const containerY = e.clientY - rect.top;
      const pixelPoint = new osdLib.Point(containerX, containerY);
      const viewportPoint = viewer.value.viewport.pointFromPixel(pixelPoint);
      mousePos.value.x = viewportPoint.x;
      mousePos.value.y = viewportPoint.y;
    }

    // Save any click to general store when dev flag is ON
    function handleRetentionClick(event) {
      // Only active when developer switch is on
      if (!props.devSaveClicks) return;
      if (!viewerContainer.value || !viewer.value || !osdLib) return;

      const rect = viewerContainer.value.getBoundingClientRect();
      const containerX = event.clientX - rect.left;
      const containerY = event.clientY - rect.top;
      const pixelPoint = new osdLib.Point(containerX, containerY);
      const viewportPoint = viewer.value.viewport.pointFromPixel(pixelPoint);

      const isAllClick = event.metaKey || event.ctrlKey;
      const isBothSkogClick = event.metaKey || event.shiftKey;
      const timeValue = isAllClick ? 'alla' : props.currentTime;
      const skog = isBothSkogClick ? ['naturskog', 'produktionsskog_'] : startskogValue.value;
      const fw = frameworkValue.value;

      if (!fw || !skog) return;

      const click = {
        framework: fw,
        time: timeValue,
        startskog: skog,
        x: viewportPoint.x,
        y: viewportPoint.y,
        id: `click-${Date.now()}`
      };

      // Save to general saved clicks file via API
      fetch('/api/savedclicks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(click)
      }).catch(err => console.error('Failed saving click:', err));

      // Update local state for immediate feedback
      localSavedClicks.value.push(click);
    }








    const selectedAnnotationStore = useSelectedAnnotationStore();

    // When the selected annotation changes, update the overlays.
    watch(
      () => selectedAnnotationStore.selectedAnnotation,
      () => {
        if (viewer.value) {
          updateOverlays();
        }
      }
    );





    // Create marker overlays.
    function updateOverlays() {
      if (!viewer.value || !osdLib) return;

      // Destroy any existing MouseTracker instances before clearing overlays
      mouseTrackers.forEach(tracker => tracker.destroy());
      mouseTrackers = [];

      // Remove previously added annotation overlays and unmount their Vue apps.
      annotationOverlayApps.forEach(({ id, app }) => {
        app.unmount();
        viewer.value.removeOverlay(id);
      });
      annotationOverlayApps = [];

      // Now add marker overlays from annotations.
      props.annotations.forEach((annotation) => {
        if (!annotation.position) return;

        const markerContainer = document.createElement("div");
        // Set the z-index for the marker container based on whether it is active
        const selectedAnnotation = selectedAnnotationStore.selectedAnnotation;
        if (selectedAnnotation && selectedAnnotation.id === annotation.id) {
          markerContainer.style.zIndex = "6";
        } else {
          markerContainer.style.zIndex = "5";
        }

        // Mount the AnnotationMarker component for this annotation.
        const markerApp = createApp(AnnotationMarker, { annotation });
        markerApp.mount(markerContainer);

        const tracker = new osdLib.MouseTracker({
          element: markerContainer,
          clickHandler: () => {
            emit("annotationClicked", annotation);
          },
        });
        mouseTrackers.push(tracker);
        // Assign a unique ID for each marker overlay.
        const markerId = "annotation-" + annotation.id;
        markerContainer.id = markerId;
        viewer.value.addOverlay({
          element: markerContainer,
          location: new osdLib.Point(annotation.position.x, annotation.position.y),
          placement: "BOTTOM",
          className: 'clickable-overlay',
          checkResize: false,
          id: p.id
        });
        annotationOverlayApps.push({ id: markerId, app: markerApp });
      });
    }



    // Method to show the popup overlay.
    function showPopup(annotation) {
      if (!viewer.value || !osdLib) return;
      const popupId = `popup-${annotation.id}`;
      const popupContainer = document.createElement("div");
      popupContainer.id = popupId;
      popupContainer.style.pointerEvents = "auto";
      viewer.value.addOverlay({
        element: popupContainer,
        location: new osdLib.Point(annotation.position.x, annotation.position.y),
        className: 'clickable-overlay',
        id: p.id,
        placement: "BOTTOM",
        checkResize: false,
      });
      const app = createApp(AnnotationPopup, { annotation });
      app.mount(popupContainer);
      annotationOverlayApps.push({ id: popupId, app });
    }

    // Initialize the viewer.
    async function initViewer() {
      if (typeof window === "undefined") return;
      if (viewer.value) return;
      // if (route.name !== "skogsskotsel/modell") return;
      const containerEl = viewerContainer.value;
      if (!containerEl) return;

      const osdModule = await import("openseadragon");
      const osd = osdModule.default || osdModule;
      osdLib = osd;
      // Ensure Scalebar plugin attaches to this OpenSeadragon instance
      window.OpenSeadragon = osdLib;
      await import('~/assets/js/openseadragon-scalebar.js');

      // Viewer initialization options
      const viewerOptions = {
        element: containerEl,
        crossOriginPolicy: 'Anonymous',
        ajaxWithCredentials: false,
        showNavigationControl: false,
        imageLoaderLimit: 4,
        maxImageCacheCount: 50,
        visibilityRatio: 1,
        homeFillsViewer: true,
        minZoomLevel: 1,
        wrapHorizontal: false,
        wrapVertical: false,
        constrainDuringPan: true,
        panHorizontal: true,
        panVertical: true,
        homeFillsViewer: true,
        animationTime: 0.5,
        // degrees: 90,
        defaultZoomLevel: props.layoutMode === "sideBySide" ? null : 1.2,
        gestureSettingsMouse: {
          scrollToZoom: true,
          clickToZoom: false,
          dblClickToZoom: true,
          clickTodrag: false,
          pinchToZoom: false,
        },
        drawer: 'canvas',
      };

      viewer.value = osd(viewerOptions);
      // initialize canvas overlay on top of tiles
      initCanvasOverlay();
      drawAllOverlays();
      viewer.value.addHandler('animation', drawAllOverlays);
      viewer.value.addHandler('open', drawAllOverlays);
      // Ensure hover listeners are active immediately
      attachClickHandlers();
      // window.addEventListener('resize', resizeCanvas); // REMOVE: now handled by ResizeObserver

      // Attach scale bar plugin
      viewer.value.scalebar({
        type: osdLib.ScalebarType.MAP,
        pixelsPerMeter: 12, // adjust to your image's real-world scale
        minWidth: '75px',
        location: osdLib.ScalebarLocation.BOTTOM_LEFT,
        color: 'white',
        fontColor: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        barThickness: 2
      });

      // restore last zoom & pan
      if (viewerStore.center) {
        const { x, y } = viewerStore.center;
        viewer.value.viewport.zoomTo(viewerStore.zoom);
        viewer.value.viewport.panTo(new osdLib.Point(x, y));
        viewer.value.viewport.applyConstraints();
      }

      // Store animation handler for cleanup
      animationHandler = () => {
        const zoom = viewer.value.viewport.getZoom();
        const center = viewer.value.viewport.getCenter();
        viewerStore.setViewport(zoom, { x: center.x, y: center.y });
        emit('viewportChanged', { zoom, center });
      };
      viewer.value.addHandler('animation', animationHandler);

      transitionToNewTile(props.dziUrl);
    }


    // Snapshot-based crossfade for tile transitions
    function transitionToNewTile(newUrl) {
      if (!viewer.value || !newUrl) return;

      // Remove any leftover snapshots before creating a new one
      const existingSnapshots = viewerContainer.value.querySelectorAll('.osd-snapshot');
      existingSnapshots.forEach(el => viewerContainer.value.removeChild(el));

      const zoom = viewer.value.viewport.getZoom();
      const center = viewer.value.viewport.getCenter();

      // Try to capture a snapshot from the current canvas
      let snapshotUrl = null;
      try {
        const canvas = viewer.value.drawer.canvas;
        snapshotUrl = canvas.toDataURL("image/png");
      } catch (e) {
        console.warn("Snapshot capture failed:", e);
      }

      let snapshotImg = null;
      if (snapshotUrl) {
        snapshotImg = document.createElement("img");
        snapshotImg.classList.add('osd-snapshot');
        snapshotImg.src = snapshotUrl;
        snapshotImg.style.position = "absolute";
        snapshotImg.style.top = "0";
        snapshotImg.style.left = "0";
        snapshotImg.style.width = "100%";
        snapshotImg.style.height = "100%";
        snapshotImg.style.objectFit = "cover";
        snapshotImg.style.zIndex = "0";
        snapshotImg.style.opacity = "1";
        snapshotImg.style.transition = "opacity 0.5s ease";
        viewerContainer.value.appendChild(snapshotImg);
      }

      viewer.value.open({
        tileSource: newUrl,
        crossOriginPolicy: 'Anonymous',
        ajaxWithCredentials: false,
      });

      viewer.value.addOnceHandler('open', () => {
        viewer.value.viewport.zoomTo(zoom, null, true);
        viewer.value.viewport.panTo(center, true);
        viewer.value.viewport.applyConstraints();

        emit('opened');

        refreshOverlayTile(props.overlayDziUrl);

        // Fade out and remove the snapshot overlay
        if (snapshotImg) {
          setTimeout(() => {
            snapshotImg.style.opacity = "0";
            setTimeout(() => {
              if (viewerContainer.value.contains(snapshotImg)) {
                viewerContainer.value.removeChild(snapshotImg);
              }
            }, 500);
          }, 50);
        }
      });
    }

    const overlayOpacityLocal = ref(props.globalOpacity !== undefined ? props.globalOpacity : 1);

    watch(() => props.naturvardsarterVisible, (visible) => {
      if (visible) {
        attachClickHandlers();
      } else {
        detachClickHandlers();
        naturvardTooltip.value = null;
        naturvardHitboxes.value = [];
        naturvardTooltipOpen.value = false;
        if (viewerContainer.value) viewerContainer.value.style.cursor = 'default'; // add this

      }
    });

    watch(
      () => props.globalOpacity,
      (newVal) => {
        if (newVal !== undefined) {
          overlayOpacityLocal.value = newVal;
          if (viewer.value && props.overlayDziUrl) {
            const itemCount = viewer.value.world.getItemCount();
            for (let i = 0; i < itemCount; i++) {
              const tile = viewer.value.world.getItemAt(i);
              let tileSourceUrl = '';
              if (tile.source.tilesUrl) {
                tileSourceUrl = tile.source.tilesUrl.slice(0, -7) + '.dzi';
              } else if (tile.source.url) {
                tileSourceUrl = tile.source.url;
              }
              if (tileSourceUrl === props.overlayDziUrl) {
                if (typeof tile.setOpacity === 'function') {
                  tile.setOpacity(newVal);
                }
                if (tile.tiles && tile.tiles.length) {
                  tile.tiles.forEach(tileObj => {
                    if (tileObj.elmt) {
                      tileObj.elmt.style.opacity = newVal;
                    }
                  });
                }
              }
            }
            viewer.value.forceRedraw();
          }
        }
      },
      { immediate: true }
    );

    // Updated handleSliderInput function
    function handleSliderInput(event) {
      const newOpacity = parseFloat(event.target.value);
      overlayOpacityLocal.value = newOpacity;
      if (viewer.value && props.overlayDziUrl) {
        const itemCount = viewer.value.world.getItemCount();
        // Iterate through all tiles to find the overlay tile by matching its source URL
        for (let i = 0; i < itemCount; i++) {
          const tile = viewer.value.world.getItemAt(i);
          let tileSourceUrl = '';
          if (tile.source.tilesUrl) {
            // Convert tilesUrl to .dzi URL
            tileSourceUrl = tile.source.tilesUrl.slice(0, -7) + '.dzi';
          } else if (tile.source.url) {
            tileSourceUrl = tile.source.url;
          }
          if (tileSourceUrl === props.overlayDziUrl) {
            if (typeof tile.setOpacity === 'function') {
              tile.setOpacity(newOpacity);
            }
            // Optionally update tile elements if available
            if (tile.tiles && tile.tiles.length) {
              tile.tiles.forEach(tileObj => {
                if (tileObj.elmt) {
                  tileObj.elmt.style.opacity = newOpacity;
                }
              });
            }
          }
        }
        viewer.value.forceRedraw();
        // Toggle base layer visibility: hide when overlay at 100%, show otherwise
        if (currentTile.value && typeof currentTile.value.setOpacity === 'function') {
          currentTile.value.setOpacity(newOpacity >= 1 ? 0 : 1);
        }
        // Redraw base layer change
        viewer.value.forceRedraw();
      }
      // If globalOpacity prop is defined, emit the update to parent.
      if (props.globalOpacity !== undefined) {
        emit('update:globalOpacity', newOpacity);
      }
    }

    // Removed watcher for full re-init on framework or startskog changes

    // Watch for changes in annotations.
    watch(
      () => props.annotations,
      () => {
        updateOverlays();
      },
      { immediate: true }
    );

    onBeforeUnmount(() => {
      detachClickHandlers();
      destroyViewer();
      unmounted = true;
    });
    // onActivated(() => {
    //   if (props.dziUrl && viewer.value) {
    //     transitionToNewTile(props.dziUrl);
    //   }
    // });
    // Also, in the onMounted() hook, after initializing the viewer, check the current overlay state:
    // --- Background DZI preloading function ---
    // async function preloadTilesWithBackgroundViewer(dziUrls = []) {
    //   // Only run on client
    //   if (typeof window === "undefined") return;
    //   const backgroundEl = document.createElement('div');
    //   backgroundEl.style.position = 'absolute';
    //   backgroundEl.style.width = '1px';
    //   backgroundEl.style.height = '1px';
    //   backgroundEl.style.overflow = 'hidden';
    //   backgroundEl.style.pointerEvents = 'none';
    //   backgroundEl.style.opacity = 0;
    //   document.body.appendChild(backgroundEl);

    //   const osdModule = await import("openseadragon");
    //   const osd = osdModule.default || osdModule;
    //   const preloadViewer = osd({
    //     element: backgroundEl,
    //     crossOriginPolicy: 'Anonymous',
    //     ajaxWithCredentials: false,
    //     showNavigationControl: false,
    //     visibilityRatio: 1,
    //     animationTime: 0.1,
    //     gestureSettingsMouse: {
    //       scrollToZoom: false,
    //       clickToZoom: false,
    //       dblClickToZoom: false,
    //       clickTodrag: false,
    //       pinchToZoom: false,
    //     },
    //   });

    //   for (const url of dziUrls) {
    //     console.log('Opening background DZI for preload:', url);
    //     await new Promise((resolve) => {
    //       preloadViewer.addOnceHandler('open', () => {
    //         console.log('Opened:', url);
    //         preloadViewer.viewport.goHome();
    //         preloadViewer.viewport.zoomTo(preloadViewer.viewport.getMaxZoom());

    //         const p = preloadViewer.viewport;
    //         const osdPoint = osd.Point;

    //         setTimeout(() => p.panTo(new osdPoint(0, 0)), 100);     // Top-left
    //         setTimeout(() => p.panTo(new osdPoint(1, 0)), 300);     // Top-right
    //         setTimeout(() => p.panTo(new osdPoint(0, 1)), 500);     // Bottom-left
    //         setTimeout(() => p.panTo(new osdPoint(1, 1)), 700);     // Bottom-right
    //         setTimeout(() => p.panTo(p.getCenter()), 900);          // Center
    //         setTimeout(() => {
    //           console.log('Completed tile pan preload for:', url);
    //           resolve();
    //         }, 1200); // Allow time for all tile requests
    //       });

    //       preloadViewer.open({
    //         tileSource: url,
    //         crossOriginPolicy: 'Anonymous',
    //         ajaxWithCredentials: false,
    //       });
    //     });
    //   }

    //   preloadViewer.destroy();
    //   document.body.removeChild(backgroundEl);
    // }

    onMounted(() => {
      if (typeof window === "undefined") return;
      isClient.value = true;
      nextTick(() => {
        attachHoverHandlers();
        initViewer().then(() => {
          // (Removed DOM static overlay block)
        });
      });
    });

    // -----------------------
    // Methods for zoom control.
    function zoomIn(factor = 1.2) {
      if (!viewer.value) return;
      const currentZoom = viewer.value.viewport.getZoom();
      const newZoom = currentZoom * factor;
      viewer.value.viewport.zoomTo(newZoom);
      viewer.value.viewport.applyConstraints();
      viewer.value.forceRedraw();
      return newZoom;
    }

    function zoomOut(factor = 1.2) {
      if (!viewer.value) return;
      const currentZoom = viewer.value.viewport.getZoom();
      const newZoom = currentZoom / factor;
      viewer.value.viewport.zoomTo(newZoom);
      viewer.value.viewport.applyConstraints();
      viewer.value.forceRedraw();
      return newZoom;
    }

    function getZoom() {
      return viewer.value ? viewer.value.viewport.getZoom() : null;
    }

    function getCenter() {
      return viewer.value ? viewer.value.viewport.getCenter() : null;
    }

    function setZoomAndCenter(zoom, center) {
      if (!viewer.value) return;
      viewer.value.viewport.zoomTo(zoom);
      // Animate the pan smoothly.
      viewer.value.viewport.panTo(center);
      viewer.value.viewport.applyConstraints();
      viewer.value.forceRedraw();
    }

    // Expose a method to attach event handlers (for syncing).
    function addSyncHandler(eventType, handler) {
      if (viewer.value) {
        viewer.value.addHandler(eventType, handler);
      }
    }

    // Expose the necessary methods.
    expose({
      showPopup,
      zoomIn,
      zoomOut,
      getZoom,
      getCenter,
      setZoomAndCenter,
      addSyncHandler,
    });

    // Re-create or tear down the viewer when the tab is hidden or shown
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        destroyViewer();
      } else {
        initViewer();
      }
    });

    return {
      isClient,
      viewerContainer,
      viewerId,
      mousePos,
      updateMousePosition,
      handleRetentionClick,
      handleSliderInput,
      overlayOpacityLocal,
      timelineInfo,
      isPanelMinimized,
      togglePanelMinimized,
      svampMycelValue,
      matsvampMycelValue,
      rodlistadeMycelValue,
      rottackePopover,
      rottackePopoverStyle,
      naturvardTooltip,
      naturvardTooltipOpen,
      naturvardCounter,
    };
  },
};
</script>

<style scoped>
.openseadragon-viewer {
  width: 100%;
  height: 100%;
  background-color: #f9f6f3;
  background-image: linear-gradient(#1a110e 1px, transparent 1px), linear-gradient(to right, #1a110e 1px, #0b0706 1px);
  background-size: 20px 20px;
}

:deep(.highlight) {
  outline: 2px solid white;
}

.osd-natur-icon {
  pointer-events: none;
  user-select: none;
  display: inline-block;
}

/* Applies to OpenSeadragon HTML overlays added with className */
.clickable-overlay {
  cursor: pointer;
  background: transparent;
  /* invisible box over the star hit area */
}

/* Optional: outline for debugging; uses outline so it doesn't shift the overlay like border would */
.clickable-overlay:hover {
  outline: 2px solid rgba(90, 63, 52, 0.35);
  outline-offset: 2px;
}
</style>
