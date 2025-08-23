<template>
<div :class="['relative', fullscreenLayout ? ' gap-4' : 'grid md:grid-cols-5 gap-8']">

  <!-- <client-only> -->
    <div v-if="isClient" :id="viewerId" :class="['openseadragon-viewer col-span-3 relative overflow-hidden', fullscreenLayout ? '' : 'rounded-sm']" ref="viewerContainer"
    :style="{ backgroundColor: backgroundColor }" @mousedown.capture="handleActivate" @mousemove="updateMousePosition" @click="handleRetentionClick($event)">
    <div v-if="!(layoutMode === 'slider' && comparisonMode) && fullscreenLayout" class="absolute top-0 left-1/2 transform -translate-x-1/2 m-2 z-10 text-center">
      <div>
        <UBadge size="lg" class="backdrop-blur-xl bg-neutral-400/70 text-neutral-100 mb-0.5 z-50">{{ frameworkLabel }}</UBadge>
      </div>
      <UBadge size="lg" class="backdrop-blur-xl bg-neutral-400/70 text-neutral-100 z-50">{{ timeLabel }}</UBadge>
    </div>

    <!-- Display viewport coordinates for marker placement -->
    <div class="absolute top-32 right-0 m-2 p-1 bg-black bg-opacity-50 text-white text-xs z-50">
      X: {{ mousePos.x.toFixed(4) }}, Y: {{ mousePos.y.toFixed(4) }}
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
                  <p class=" mb-6" v-if="timelineInfo">  {{ timelineInfo.skog }}</p>
                  <p class=" " v-if="timelineInfo"><div class="font-bold mb-1.5 text-lg">Påverkan på mykorrizasvamp</div> {{ timelineInfo.svamp }}</p>
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
import { ref, computed, watch, onMounted, onBeforeUnmount, onActivated, nextTick, createApp } from "vue";
import debounce from 'lodash/debounce';
import { useRoute } from "vue-router";
import AnnotationPopup from "./AnnotationPopup.vue";
import AnnotationMarker from "./AnnotationMarker.vue";
import { useSelectedAnnotationStore } from "~/stores/selectedAnnotationStore";
import { useOverlayStore } from "~/stores/overlayStore";
import timelineData from "public/timeline.json";
import { usePanelStore } from '~/stores/panelStore';
import svamparData from "public/SvamparSkogsbruk.json";
import totalSvamparData from "public/TotalSvamparSkogsbruk.json";
import { useViewerStore } from '~/stores/viewerStore';
const retentionOverlayIds = [];

export default {
  name: "OpenSeadragonViewer",
emits: ["annotationClicked", "viewportChanged", "opened", "retentionTreeAdded"],
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
      default: "#f5f5f5",
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
  
    // overlayOpacity prop removed
  },
  setup(props, { emit, expose }) {

    const kanteffektOverlayIds = [];
    
const localTrees = ref([])
onMounted(async () => {
  try {
    const res = await fetch('/api/retentionTrees')
    const json = await res.json()
    localTrees.value = json.trees
  } catch (e) {
    console.error('Failed fetching retentionTrees:', e)
  }
})

// fetch kanteffekt overlays
onMounted(async () => {
  try {
    const res = await fetch('/api/kanteffekt');
    const json = await res.json();
    // API should return { features: [...] }
    localKanteffekt.value = json.features || [];
  } catch (e) {
    console.error('Failed fetching kanteffekt features:', e);
  }
});

// kanteffekt overlays
const localKanteffekt = ref([]);
    const route = useRoute();
    const viewerStore = useViewerStore();

    const viewer = ref(null);
    const isClient = ref(false);
    const viewerContainer = ref(null);
    // ————————————— Canvas‐based overlay (replaces all DOM overlays) —————————————
    const overlayCanvas = document.createElement('canvas');
    let overlayCtx = null;
    let resizeObserver = null;

    function initCanvasOverlay() {
      overlayCanvas.style.position      = 'absolute';
      overlayCanvas.style.top           = '0';
      overlayCanvas.style.left          = '0';
      overlayCanvas.style.width         = '100%';
      overlayCanvas.style.height        = '100%';
      overlayCanvas.style.pointerEvents = 'none';
      overlayCanvas.style.zIndex        = '9999';
      viewerContainer.value.appendChild(overlayCanvas);
      overlayCanvas.width  = viewerContainer.value.clientWidth;
      overlayCanvas.height = viewerContainer.value.clientHeight;
      overlayCtx = overlayCanvas.getContext('2d');
      // Observe container size changes
      if (resizeObserver) resizeObserver.disconnect();
      resizeObserver = new ResizeObserver(resizeCanvas);
      resizeObserver.observe(viewerContainer.value);
    }

    function resizeCanvas() {
      overlayCanvas.width  = viewerContainer.value.clientWidth;
      overlayCanvas.height = viewerContainer.value.clientHeight;
      drawAllOverlays();
    }

    // build a tiny 8×8 diagonal stripe pattern off‐screen (45°)
    const patternCanvas = document.createElement('canvas');
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

      // Retention circles
      if (props.retentionVisible) {
        const sizeNorm = 0.03;
        localTrees.value.forEach(tree => {
          if (tree.framework !== props.currentFramework.value) return;
          if (tree.time !== props.currentTime && tree.time !== 'alla') return;
          if (tree.startskog !== props.currentStartskog.value) return;
          const pt    = new osdLib.Point(tree.x, tree.y);
          const pixel = viewer.value.viewport.pixelFromPoint(pt, true);
          const normalizedRadius = sizeNorm / 2;
          const pixelRight = viewer.value.viewport.pixelFromPoint(new osdLib.Point(tree.x + normalizedRadius, tree.y), true);
          const radius = Math.abs(pixelRight.x - pixel.x);
          // Draw retention circle with 45° stripes
          overlayCtx.save();
          // Clip to circle
          overlayCtx.beginPath();
          overlayCtx.arc(pixel.x, pixel.y, radius, 0, 2*Math.PI);
          overlayCtx.clip();
          // Draw diagonal stripes at constant pixel width
          overlayCtx.translate(pixel.x, pixel.y);
          overlayCtx.rotate(-45 * Math.PI / 180);
          const stripeWidth = 4; // px
          const lineCount = Math.ceil((radius * 2 + stripeWidth*2) / (stripeWidth * 2));
          for (let i = -lineCount; i <= lineCount; i++) {
            const x = i * stripeWidth * 2;
            // white stripe
            overlayCtx.fillStyle = 'rgba(255,255,255,0.7)';
            overlayCtx.fillRect(x, -radius*2, stripeWidth, radius*4);
            // gray stripe
            overlayCtx.fillStyle = 'rgba(115,115,115,0.5)';
            overlayCtx.fillRect(x + stripeWidth, -radius*2, stripeWidth, radius*4);
          }
          overlayCtx.restore();
          // Draw circle outline
          overlayCtx.beginPath();
          overlayCtx.arc(pixel.x, pixel.y, radius, 0, 2*Math.PI);
          overlayCtx.strokeStyle = 'rgba(255,255,255,0.2)';
          overlayCtx.lineWidth   = 2;
          overlayCtx.stroke();
        });
      }

      // Compute active kanteffekt features
      const activeKanteffekt = localKanteffekt.value.filter(f =>
  f.framework === props.currentFramework.value &&
  (Array.isArray(f.start)
    ? f.start.includes(props.currentTime)
    : f.start === props.currentTime)
);

      // Kanteffekt polygon overlays
      if (props.kanteffektVisible) {
        activeKanteffekt
          .filter(f => f.shape === 'polygon')
          .forEach(f => {
  const halfNorm = f.size / 2;
  const holeHalfNorm = f.holeSize / 2;

  // Coordinates in pixels
  const centerPt = new osdLib.Point(f.x, f.y);
  const centerPixel = viewer.value.viewport.pixelFromPoint(centerPt, true);

  const pixelRight = viewer.value.viewport.pixelFromPoint(new osdLib.Point(f.x + halfNorm, f.y), true);
  const halfSide = Math.abs(pixelRight.x - centerPixel.x);
  const sidePx = halfSide * 2;

  const pixelHoleRight = viewer.value.viewport.pixelFromPoint(new osdLib.Point(f.x + holeHalfNorm, f.y), true);
  const holeHalfSide = Math.abs(pixelHoleRight.x - centerPixel.x);

  // Figure out which sides to draw for the current time
  const sidesSpec = (f.sides && (f.sides[props.currentTime] ?? f.sides.default)) ?? 'full';
  const sidesArray = (sidesSpec === 'full' || sidesSpec === 'fullsquare')
    ? ['up','down','left','right']
    : Array.isArray(sidesSpec) ? sidesSpec : [sidesSpec];

  // Helper to stripe-fill any rectangular band (clip then draw stripes)
  function fillBandRect(x, y, w, h) {
    overlayCtx.save();
    overlayCtx.beginPath();
    overlayCtx.rect(x, y, w, h);
    overlayCtx.clip();

    // Draw diagonal stripes
    overlayCtx.translate(x + w / 2, y + h / 2);
    overlayCtx.rotate(-45 * Math.PI / 180);
    const stripeWidth = 4;
    const diag = Math.hypot(w, h);
    const count = Math.ceil((diag + stripeWidth * 2) / (stripeWidth * 2));
    for (let i = -count; i <= count; i++) {
      const sx = i * stripeWidth * 2;
      overlayCtx.fillStyle = 'rgba(255,255,255,0.7)';
      overlayCtx.fillRect(sx, -diag, stripeWidth, diag * 2);
      overlayCtx.fillStyle = 'rgba(115,115,115,0.5)';
      overlayCtx.fillRect(sx + stripeWidth, -diag, stripeWidth, diag * 2);
    }
    overlayCtx.restore();
  }

  // Pixel coords of outer and inner squares
  const left   = centerPixel.x - halfSide;
  const right  = centerPixel.x + halfSide;
  const top    = centerPixel.y - halfSide;
  const bottom = centerPixel.y + halfSide;

  const iLeft   = centerPixel.x - holeHalfSide;
  const iRight  = centerPixel.x + holeHalfSide;
  const iTop    = centerPixel.y - holeHalfSide;
  const iBottom = centerPixel.y + holeHalfSide;

  // Draw each requested side as a rectangular band between outer and inner square
  if (sidesArray.includes('up')) {
    fillBandRect(left, top, sidePx, iTop - top);
  }
  if (sidesArray.includes('down')) {
    fillBandRect(left, iBottom, sidePx, bottom - iBottom);
  }
  if (sidesArray.includes('left')) {
    fillBandRect(left, top, iLeft - left, sidePx);
  }
  if (sidesArray.includes('right')) {
    fillBandRect(iRight, top, right - iRight, sidePx);
  }

  // Draw outlines for the sides that are present
  overlayCtx.beginPath();
  overlayCtx.strokeStyle = 'rgba(255,255,255,0.8)';
  overlayCtx.lineWidth = 1;

  if (sidesArray.includes('up')) {
    overlayCtx.moveTo(left, top);
    overlayCtx.lineTo(right, top);
  }
  if (sidesArray.includes('down')) {
    overlayCtx.moveTo(left, bottom);
    overlayCtx.lineTo(right, bottom);
  }
  if (sidesArray.includes('left')) {
    overlayCtx.moveTo(left, top);
    overlayCtx.lineTo(left, bottom);
  }
  if (sidesArray.includes('right')) {
    overlayCtx.moveTo(right, top);
    overlayCtx.lineTo(right, bottom);
  }
  overlayCtx.stroke();
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
            const sidePx = halfSide * 2;

            const pixelHoleRight = viewer.value.viewport.pixelFromPoint(new osdLib.Point(f.x + holeHalfNorm, f.y), true);
            const holeHalfSide = Math.abs(pixelHoleRight.x - centerPixel.x);

            // Figure out which sides to draw for the current time
            const sidesSpec = (f.sides && (f.sides[props.currentTime] ?? f.sides.default)) ?? 'full';
            const sidesArray = (sidesSpec === 'full' || sidesSpec === 'fullsquare')
              ? ['up','down','left','right']
              : Array.isArray(sidesSpec) ? sidesSpec : [sidesSpec];

            // Helper to stripe-fill any rectangular band (clip then draw stripes)
            function fillBandRect(x, y, w, h) {
              overlayCtx.save();
              overlayCtx.beginPath();
              overlayCtx.rect(x, y, w, h);
              overlayCtx.clip();

              // Draw diagonal stripes
              overlayCtx.translate(x + w / 2, y + h / 2);
              overlayCtx.rotate(-45 * Math.PI / 180);
              const stripeWidth = 4;
              const diag = Math.hypot(w, h);
              const count = Math.ceil((diag + stripeWidth * 2) / (stripeWidth * 2));
              for (let i = -count; i <= count; i++) {
                const sx = i * stripeWidth * 2;
                overlayCtx.fillStyle = 'rgba(255,255,255,0.7)';
                overlayCtx.fillRect(sx, -diag, stripeWidth, diag * 2);
                overlayCtx.fillStyle = 'rgba(115,115,115,0.5)';
                overlayCtx.fillRect(sx + stripeWidth, -diag, stripeWidth, diag * 2);
              }
              overlayCtx.restore();
            }

            // Pixel coords of outer and inner squares
            const left   = centerPixel.x - halfSide;
            const right  = centerPixel.x + halfSide;
            const top    = centerPixel.y - halfSide;
            const bottom = centerPixel.y + halfSide;

            const iLeft   = centerPixel.x - holeHalfSide;
            const iRight  = centerPixel.x + holeHalfSide;
            const iTop    = centerPixel.y - holeHalfSide;
            const iBottom = centerPixel.y + holeHalfSide;

            // Draw each requested side as a rectangular band between outer and inner square
            if (sidesArray.includes('up')) {
              fillBandRect(left, top, sidePx, iTop - top);
            }
            if (sidesArray.includes('down')) {
              fillBandRect(left, iBottom, sidePx, bottom - iBottom);
            }
            if (sidesArray.includes('left')) {
              fillBandRect(left, top, iLeft - left, sidePx);
            }
            if (sidesArray.includes('right')) {
              fillBandRect(iRight, top, right - iRight, sidePx);
            }

            // Draw outlines only for the sides that exist
            overlayCtx.beginPath();
            overlayCtx.strokeStyle = 'rgba(255,255,255,0.8)';
            overlayCtx.lineWidth = 1;

            if (sidesArray.includes('up')) {
              overlayCtx.moveTo(left, top);
              overlayCtx.lineTo(right, top);
            }
            if (sidesArray.includes('down')) {
              overlayCtx.moveTo(left, bottom);
              overlayCtx.lineTo(right, bottom);
            }
            if (sidesArray.includes('left')) {
              overlayCtx.moveTo(left, top);
              overlayCtx.lineTo(left, bottom);
            }
            if (sidesArray.includes('right')) {
              overlayCtx.moveTo(right, top);
              overlayCtx.lineTo(right, bottom);
            }
            overlayCtx.stroke();
          });
      }

      // Static rectangle overlay
      if (overlayStore.staticOverlayVisible) {
        // Normalized rectangle coords
        const norm = { x: 0.2675, y: 0.1393, width: 0.465, height: 0.275 };
        const p1 = viewer.value.viewport.pixelFromPoint(new osdLib.Point(norm.x,              norm.y),              true);
        const p2 = viewer.value.viewport.pixelFromPoint(new osdLib.Point(norm.x + norm.width, norm.y + norm.height), true);
        const w  = p2.x - p1.x;
        const h  = p2.y - p1.y;
        overlayCtx.strokeStyle = 'white';
        overlayCtx.lineWidth   = 2;
        overlayCtx.strokeRect(p1.x, p1.y, w, h);
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

const viewerId = computed(
      () => "openseadragon-viewer-" + Math.random().toString(36).substr(2, 9)
    );
    let osdLib = null;
    let unmounted = false;
    const currentTile = ref(null);
    const overlayImage = ref(null);

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
      const match = totalSvamparData.find(item =>
        item.artkategori === "total" &&
        item.frameworks === props.currentFramework.value &&
        Number(item.ålder) === adjustedTotalSvamparTime.value
      );
      return match ? match.klassning : 'N/A';
    });

    const matsvampMycelValue = computed(() => {
      const match = svamparData.find(item =>
        item.artkategori === "matsvamp" &&
        item.startskog === props.currentStartskog.value &&
        item.frameworks === props.currentFramework.value &&
        Number(item.ålder) === adjustedSvamparTime.value
      );
      return match ? match.klassning : 'N/A';
    });

    const rodlistadeMycelValue = computed(() => {
      const match = svamparData.find(item =>
        item.artkategori === "rödlistade + signalarter" &&
        item.startskog === props.currentStartskog.value &&
        item.frameworks === props.currentFramework.value &&
        Number(item.ålder) === adjustedSvamparTime.value
      );
      return match ? match.klassning : 'N/A';
    });


    const timelineInfo = computed(() => {
      if (!props.currentFramework?.value || !props.currentTime || !props.currentStartskog?.value) {
        return null;
      }
      return timelineData.find(item =>
        item.atgard === props.currentFramework.value &&
        item.tid === props.currentTime &&
        item.startskog === props.currentStartskog.value
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

    // On click, if retentionVisible, copy current coords and metadata to json
function handleRetentionClick(event) {
  
  if (!props.retentionVisible) return

// Deletion on Shift+click of an existing circle (catch any nested target)
// Deletion: Shift+click on existing circle removes it
if (event.shiftKey) {
  const circleEl = event.target instanceof Element
    ? event.target.closest('[id^="retention-"]')
    : null;
  if (circleEl) {
    const treeId = circleEl.id.replace('retention-', '');
    event.stopPropagation();
    fetch('/api/retentionTrees', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: treeId }),
    })
    .then(res => {
      if (res.ok) {
        localTrees.value = localTrees.value.filter(t => t.id !== treeId);
      }
    })
    .catch(err => console.error('Failed deleting tree:', err));
    return;
  }
}

const isAllClick = event.metaKey || event.ctrlKey;
  const timeValue = isAllClick ? 'alla' : props.currentTime;
  const tree = {
    framework: props.currentFramework.value,
    time: timeValue,
    startskog: props.currentStartskog.value,
    x:   mousePos.value.x,
    y:   mousePos.value.y,
  }

 

  fetch('/api/retentionTrees', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tree),
  })
  .then(res => res.json())
 .then(json => {
  console.log('Tree saved:', json.tree)
  emit('retentionTreeAdded', json.tree)
  localTrees.value.push(json.tree)
})
  .catch(err => {
    console.error('Failed to save tree:', err)
  })
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
      if (route.name !== "skogsskotsel-skotselmetoder") return;
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
        // crossOriginPolicy: 'Anonymous',
        // ajaxWithCredentials: false,
        showNavigationControl: false,
        maxImageCacheCount: 50,       
        visibilityRatio: 1,
        minZoomLevel: 1,
        constrainDuringPan: true,
        panHorizontal: true,
        panVertical: true,
        homeFillsViewer: true,
        animationTime: 0.5,
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
      viewer.value.addHandler('open',      drawAllOverlays);
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
        const zoom   = viewer.value.viewport.getZoom();
        const center = viewer.value.viewport.getCenter();
        viewerStore.setViewport(zoom, { x: center.x, y: center.y });
        emit('viewportChanged', { zoom, center });
      };
      viewer.value.addHandler('animation', animationHandler);

      transitionToNewTile(props.dziUrl);
    }


    // Snapshot-based crossfade for tile transitions
    function transitionToNewTile(newUrl) {
      
      if (!viewer.value) return;

      

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
        // crossOriginPolicy: 'Anonymous',
        // ajaxWithCredentials: false,
      });

      viewer.value.addOnceHandler('open', () => {
        viewer.value.viewport.zoomTo(zoom, null, true);
        viewer.value.viewport.panTo(center, true);
        viewer.value.viewport.applyConstraints();

        emit('opened');

        if (props.overlayDziUrl) {
          if (overlayImage.value) {
            viewer.value.world.removeItem(overlayImage.value);
            overlayImage.value.destroy();
            overlayImage.value = null;
          }

          viewer.value.addTiledImage({
            tileSource: props.overlayDziUrl,
            // crossOriginPolicy: 'Anonymous',
            // ajaxWithCredentials: false,
            opacity: overlayOpacityLocal.value,
            success: event => {
              overlayImage.value = event.item;
            }
          });
        }

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
</style>
