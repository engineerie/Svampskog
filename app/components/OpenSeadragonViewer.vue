<template>
  <div class="relative">


  <!-- <client-only> -->
    <div v-if="isClient" :id="viewerId" class="openseadragon-viewer relative rounded-lg overflow-hidden" ref="viewerContainer"
    :style="{ backgroundColor: backgroundColor }" @mousedown.capture="handleActivate" @mousemove="updateMousePosition">
    <div v-if="!(layoutMode === 'slider' && comparisonMode)" class="absolute top-0 m-2 z-10" :style="{
      ...(sliderPosition === 'left' ? { right: '0px', textAlign: 'right' } : { left: '0px' })
    }">
      <div>
        <UBadge size="lg" class="backdrop-blur-xl bg-neutral-100/10 text-neutral-100 mb-0.5">{{ frameworkLabel }}</UBadge>
      </div>
      <UBadge size="lg" class="backdrop-blur-xl bg-neutral-100/10 text-neutral-100">{{ timeLabel }}</UBadge>
    </div>
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

   
   
  </div>
  <!-- </client-only> -->
    <div
      :class="['absolute pointer-events-none bottom-0 z-10', (layoutMode === 'slider' && comparisonMode) ? 'w-1/2' : 'w-full']"
      :style="{
        zIndex: 10,
        ...(sliderPosition === 'left'
          ? { left: '0px', paddingRight: (layoutMode === 'slider' && comparisonMode) ? '0px' : '0px' }
          : { right: '0px', paddingLeft: (layoutMode === 'slider' && comparisonMode) ? '0px' : '0px' }
        )
      }">
      <div class="w-full">
        <div :class="['w-full flex', (sliderPosition === 'left') ? '' : 'justify-end']">

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
        </div>


        <div :class="['flex w-full', (sliderPosition === 'left') ? '' : 'justify-end']">

          <div class="w-full text-lg text-neutral-100 relative group pointer-events-auto p-4 backdrop-blur-2xl border-t border-neutral-800/50">



            <div v-if="!isPanelMinimized">
              <!-- <UButton @click="togglePanelMinimized" icon="i-heroicons-x-mark"
                class="bg-neutral-100 hover:bg-neutral-600 m-1 opacity-0 group-hover:opacity-100 absolute right-0 top-0 transition-all"
                size="sm" color="neutral" variant="solid" /> -->
                
                  <p class=" mb-3" v-if="timelineInfo"><span class="font-bold ">Skog:</span>  {{ timelineInfo.skog }}</p>
                  <p class=" " v-if="timelineInfo"><span class="font-bold ">Svamp:</span> {{ timelineInfo.svamp }}</p>
              
             
            </div>
            <!-- <div v-else class="hover:cursor-pointer p-2 bg-neutral-900/80 rounded-md w-fit" @click="togglePanelMinimized">
              <span>Visa text</span>
            </div> -->
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




export default {
  name: "OpenSeadragonViewer",
  emits: ["annotationClicked", "viewportChanged", "opened"],
  props: {
    currentFramework: { type: Object, required: true },
    currentTime: { type: String, required: true },
    currentStartskog: { type: Object, required: true },

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
      default: "#262626",
    },
    annotations: {
      type: Array,
      default: () => [],
    },
    overlayDziUrl: {
      type: String,
      default: null,
    },
    // overlayOpacity prop removed
  },
  setup(props, { emit, expose }) {
    const route = useRoute();
    const viewerStore = useViewerStore();

    const viewer = ref(null);
    const isClient = ref(false);
    const viewerContainer = ref(null);
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

    const overlayStore = useOverlayStore();

    watch(() => overlayStore.staticOverlayVisible, (visible) => {
      if (!viewer.value || !osdLib) return;
      const staticOverlayId = viewerId.value + "-static-overlay";
      let staticOverlay = document.getElementById(staticOverlayId);
      if (visible) {
        if (!staticOverlay) {
          staticOverlay = document.createElement("div");
          staticOverlay.id = staticOverlayId;
          staticOverlay.className = "highlight";
          staticOverlay.style.zIndex = "5000";
          staticOverlay.style.pointerEvents = "none";
          viewer.value.addOverlay({
            element: staticOverlay,
            location: new osdLib.Rect(0.2675, 0.1393, 0.465, 0.275) // adjusted dimensions & location
          });
        }
      } else {
        if (staticOverlay) {
          viewer.value.removeOverlay(staticOverlayId);
        }
      }
    });


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
      // Attach scale bar plugin
      viewer.value.scalebar({
        type: osdLib.ScalebarType.MAP,
        pixelsPerMeter: 10, // adjust to your image's real-world scale
        minWidth: '75px',
        location: osdLib.ScalebarLocation.TOP_LEFT,
        color: 'white',
        fontColor: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        barThickness: 2
      });
      // Prevent OpenSeadragon from clearing overlays on open, so static overlay stays mounted
      viewer.value.clearOverlays = () => {};

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
        snapshotImg.style.zIndex = "2";
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
        updateOverlays();

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
          // After the viewer is initialized, if the store says the overlay should be visible, add it.
          if (overlayStore.staticOverlayVisible && viewer.value && osdLib) {
            const staticOverlayId = viewerId.value + "-static-overlay";
            let staticOverlay = document.getElementById(staticOverlayId);
            if (!staticOverlay) {
              staticOverlay = document.createElement("div");
              staticOverlay.id = staticOverlayId;
              staticOverlay.className = "highlight";
              staticOverlay.style.zIndex = "5";
              staticOverlay.style.pointerEvents = "none";
              viewer.value.addOverlay({
                element: staticOverlay,
                location: new osdLib.Rect(0.2675, 0.1393, 0.465, 0.275)
              });
            }
          }
          // --- Background preloading logic ---
          // Only preload if this viewer is not in comparison mode (avoid duplicate preloads)
          // if (!props.comparisonMode) {
          //   try {
          //     // Compose the framework and time labels as in main app
          //     const framework = props.currentFramework.value.toLowerCase();
          //     const startskogValue = props.currentStartskog.value;
          //     const treeVisibility = 'dölj';
          //     const fungiVisibility = 'visa'; // assume fungi visible
          //     const timeLabels = ['före', 'efter', '20', '50', '80'];
          //     if (framework === 'skärmträd') timeLabels.splice(2, 0, '10');
          //     const urls = timeLabels.map(label =>
          //       `/images/DZI_Images/${framework}_${label}_${fungiVisibility}_${treeVisibility}_${startskogValue}_v2.dzi`
          //     );
          //     preloadTilesWithBackgroundViewer(urls);
          //   } catch (e) {
          //     // ignore
          //   }
          // }
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


    // Emit an activation event.
    // function handleActivate() {
    //   emit("activated", viewerId.value);
    // }

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
