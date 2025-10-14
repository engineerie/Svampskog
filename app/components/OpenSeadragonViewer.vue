<template>
  <div :class="['relative', fullscreenLayout ? ' gap-4' : 'grid md:grid-cols-5 gap-8']">

    <!-- <client-only> -->
    <div v-if="isClient" :id="viewerId"
      :class="['openseadragon-viewer ui-zoom-exempt col-span-3 relative overflow-hidden', fullscreenLayout ? '' : 'rounded-sm']"
      ref="viewerContainer" :style="{ backgroundColor: backgroundColor }" @mousedown.capture="handleActivate"
      @mousemove="updateMousePosition" @click="handleRetentionClick($event)">
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
      <!-- <div class="absolute top-32 right-0 m-2 p-1 bg-black bg-opacity-50 text-white text-xs z-50">
      X: {{ mousePos.x.toFixed(4) }}, Y: {{ mousePos.y.toFixed(4) }}
    </div> -->
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
const retentionOverlayIds = [];

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
    backgroundColor: {
      type: String,
      default: "#544336",
    },
    annotations: {
      type: Array,
      default: () => [],
    },
    overlayDziUrl: {
      type: String,
      default: null,
    },
    kanteffektVisible: { type: Boolean, default: false },
    oldKanteffektVisible: { type: Boolean, default: true },
    rottackeVisible: { type: Boolean, default: false },
    seedTreeVisible: { type: Boolean, default: false },
    // Dev flag to enable saving clicks to a general store
    devSaveClicks: { type: Boolean, default: false },
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
    const kanteffektFeatures = computed(() =>
      Array.isArray(props.kanteffektFeatures) ? props.kanteffektFeatures : [],
    );


    // Småplantor points (content dataset)
    const svamparDataset = ref([]);
    const totalSvamparDataset = ref([]);

    useAsyncData('svampar-skogsbruk', () => queryCollection('svamparSkogsbruk').first()).then(({ data }) => {
      const value = data.value
      svamparDataset.value = Array.isArray(value?.entries) ? value.entries : []
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
          if (activeStartskog && tree.startskog !== activeStartskog) return;
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

        // Clip to the exact rectangle in pixel space (no border)
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

        // Grid in WORLD (image-normalized) space so dots stay locked when zooming
        const widthN = Math.abs(x1 - x0);
        const heightN = Math.abs(y1 - y0);
        const cols = 100; // adjust density here
        const rows = Math.max(1, Math.round(cols * (heightN / widthN)));

        const dx = widthN / cols;
        const dy = heightN / rows;

        const dotR = 3; // constant pixel radius

        overlayCtx.beginPath();
        for (let r = 0; r < rows; r++) {
          const yN = y0 + (r + 0.5) * dy;
          for (let c = 0; c < cols; c++) {
            const xN = x0 + (c + 0.5) * dx;
            const pix = viewer.value.viewport.pixelFromPoint(new osdLib.Point(xN, yN), true);
            overlayCtx.moveTo(pix.x + dotR, pix.y);
            overlayCtx.arc(pix.x, pix.y, dotR, 0, Math.PI * 2);
          }
        }
        overlayCtx.fillStyle = 'rgba(255,255,255,0.85)';
        overlayCtx.fill();
        overlayCtx.restore();
      }
      // Naturvårdsarter — draw award-star icon via canvas (same behavior as original stars)
      if (props.naturvardsarterVisible && naturvardPoints.value.length) {
        const arr = naturvardPoints.value;
        const activeFramework = frameworkValue.value;
        const activeStartskog = startskogValue.value;

        arr.forEach(p => {
          if (!p) return;
          if (activeFramework && !valueMatches(p.framework, activeFramework)) return;
          if (activeStartskog && p.startskog && p.startskog !== activeStartskog) return;
          if (p.time && !timeMatches(p.time, props.currentTime)) return;

          const pt = new osdLib.Point(p.x, p.y);
          const pixel = viewer.value.viewport.pixelFromPoint(pt, true);
          // Keep the same normalized sizing approach as the original stars
          const normalizedRadius = 0.012; // tweak if you want larger/smaller
          const pixelRight = viewer.value.viewport.pixelFromPoint(new osdLib.Point(p.x + normalizedRadius, p.y), true);
          const radius = Math.abs(pixelRight.x - pixel.x);

          drawAwardStar(overlayCtx, pixel.x, pixel.y, radius);
        });
      }


      // Småplantor — very small WHITE circles (same size as saved clicks)
      if (props.smaplantorVisible && smaplantorPoints.value.length) {
        const arr = smaplantorPoints.value;
        const activeFramework = frameworkValue.value;
        const activeStartskog = startskogValue.value;
        arr.forEach(p => {
          if (!p) return;
          if (activeFramework && p.framework && p.framework !== activeFramework) return;
          if (activeStartskog && p.startskog && p.startskog !== activeStartskog) return;
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
          if (activeStartskog && p.startskog && p.startskog !== activeStartskog) return;
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
          if (activeStartskog && tree.startskog !== activeStartskog) return;

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
      if (props.kanteffektVisible) {
        activeKanteffekt
          .filter(f => f.shape === 'polygon')
          .forEach(f => {
            // --- Alpha logic for trakthygge polygons (current vs old) ---
            // Default fully visible
            let baseAlpha = 1;
            // For trakthygge, treat "efter" and "20 år" as current (1),
            // and "50 år"/"80 år" as old (0.5)
            if (f.framework === 'trakthygge') {
              const map = { 'efter': 1, '20 år': 0.5, '50 år': 0.5, '80 år': 0.5 };
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
          });
      }

      // Draw squareHole overlays for luckhuggning
      if (props.kanteffektVisible) {
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
      if (props.rottackeVisible) {
        const fw = frameworkValue.value;
        const t = props.currentTime;

        const isSkarmtrad = fw === 'skärmträd' || fw === 'skarmtrad';
        const isBladning = fw === 'blädning' || fw === 'bladning';

        const showForSkarmtrad = isSkarmtrad && (t === 'efter');
        const showForBladning = isBladning && (t === 'efter' || t === '20 år' || t === '50 år' || t === '80 år');

        if (showForSkarmtrad || showForBladning) {
          // Same normalized rect as the static overlay
          const norm = { x: 0.2675, y: 0.1393, width: 0.465, height: 0.275 };

          const p1 = viewer.value.viewport.pixelFromPoint(new osdLib.Point(norm.x, norm.y), true);
          const p2 = viewer.value.viewport.pixelFromPoint(new osdLib.Point(norm.x + norm.width, norm.y + norm.height), true);
          const w = p2.x - p1.x;
          const h = p2.y - p1.y;

          // Set popover for Blädning at 'efter' only
          if (isBladning && t === 'efter') {
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
    watch(() => props.rottackeVisible, () => {
      if (overlayCtx) drawAllOverlays();
    });
    watch(() => props.seedTreeVisible, () => {
      if (overlayCtx) drawAllOverlays();
    });
    // Redraw on dev flag toggle
    watch(() => props.devSaveClicks, () => {
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
      viewer.value.destroy();
      viewer.value = null;
      currentTile.value = null;
      overlayImage.value = null;
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
      const match = svamparDataset.value.find(item =>
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
      const match = svamparDataset.value.find(item =>
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
      const timeValue = isAllClick ? 'alla' : props.currentTime;
      const fw = frameworkValue.value;
      const skog = startskogValue.value;
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
          checkResize: false,
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
        wrapVertical: true,
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
      // window.addEventListener('resize', resizeCanvas); // REMOVE: now handled by ResizeObserver

      // Attach scale bar plugin
      viewer.value.scalebar({
        type: osdLib.ScalebarType.MAP,
        pixelsPerMeter: 10, // adjust to your image's real-world scale
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
      rottackePopoverStyle
    };
  },
};
</script>

<style scoped>
.openseadragon-viewer {
  width: 100%;
  height: 100%;
  background: #d50000;
}

:deep(.highlight) {
  outline: 2px solid white;
}

.osd-natur-icon {
  pointer-events: none;
  user-select: none;
  display: inline-block;
}
</style>
