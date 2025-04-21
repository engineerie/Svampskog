<template>
  <div class="relative">


  <client-only>
    <div v-if="isClient" :id="viewerId" class="openseadragon-viewer relative rounded-xl overflow-hidden" ref="viewerContainer"
    :style="{ backgroundColor: backgroundColor }" @mousedown.capture="handleActivate" @mousemove="updateMousePosition">
    <div v-if="!(layoutMode === 'slider' && comparisonMode)" class="absolute top-0 m-2 z-10" :style="{
      ...(sliderPosition === 'left' ? { right: '0px', textAlign: 'right' } : { left: '0px' })
    }">
      <div>
        <UBadge class="bg-neutral-800 text-neutral-100 mb-0.5">{{ frameworkLabel }}</UBadge>
      </div>
      <UBadge class="bg-neutral-800 text-neutral-100">{{ timeLabel }}</UBadge>
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
  </client-only>
  <div class="osd-opacity-slider-container bg-neutral-800 flex items-center p-1.5 gap-1 rounded-lg m-2" :style="{
      position: 'absolute',
      top: '0px',
      zIndex: 10,
      ...(sliderPosition === 'left' ? { left: '40px' } : { right: '0px' })
    }">
      <UIcon name="i-hugeicons-tree-06" class="size-5 text-neutral-100" />
      <input id="osdOverlayOpacity" type="range" min="0" max="1" step="0.01" :value="overlayOpacityLocal"
        @input="handleSliderInput" class="accent-neutral-100 h-[5px] w-20 " />
    </div>
    <div
      :class="['absolute pointer-events-none bottom-0 m-2 z-10', (layoutMode === 'slider' && comparisonMode) ? 'w-1/2' : '']"
      :style="{
        zIndex: 10,
        ...(sliderPosition === 'left'
          ? { left: '0px', paddingRight: (layoutMode === 'slider' && comparisonMode) ? '20px' : '0px' }
          : { right: '0px', paddingLeft: (layoutMode === 'slider' && comparisonMode) ? '20px' : '0px' }
        )
      }">
      <div>
        <div :class="['w-full flex', (sliderPosition === 'left') ? '' : 'justify-end']">

          <div class=" rounded-md overflow-hidden mt-1 text-sm text-neutral-200 w-fit ">
            <div class="flex items-center p-1 bg-neutral-700/60 border-b border-neutral-500 border-dashed">
              <UIcon name="i-fluent-shape-organic-48-filled" class="text-gray-300 mr-1" />
              <span>Total mycelmängd: {{ svampMycelValue }} %</span>
            </div>
            <div class="flex items-center p-1 bg-neutral-900/80">
              <UIcon name="i-fluent-shape-organic-48-filled" class="text-warning-500 mr-1" />
              <span>Matsvamp av total: {{ matsvampMycelValue }}%</span>
            </div>
            <div class="flex items-center p-1 bg-neutral-900/80">
              <UIcon name="i-fluent-shape-organic-48-filled" class="text-error-500 mr-1" />
              <span>Naturvårdsarter av total: {{ rodlistadeMycelValue }}%</span>
            </div>
          </div>
        </div>


        <div :class="['w-full flex', (sliderPosition === 'left') ? '' : 'justify-end']">

          <div class=" mt-1 text-md text-neutral-200 relative group w-fit pointer-events-auto">



            <div v-if="!isPanelMinimized">
              <UButton @click="togglePanelMinimized" icon="i-heroicons-x-mark"
                class="bg-neutral-700 hover:bg-neutral-600 m-1 opacity-0 group-hover:opacity-100 absolute right-0 top-0 transition-all"
                size="sm" color="neutral" variant="solid" />
              <p class="p-2 bg-neutral-800/80 rounded-t-md" v-if="timelineInfo">Skog: {{ timelineInfo.skog }}</p>
              <p class="p-2 bg-neutral-900/80 rounded-b-md" v-if="timelineInfo">Svamp: {{ timelineInfo.svamp }}</p>
            </div>
            <div v-else class="hover:cursor-pointer p-2 bg-neutral-900/80 rounded-md" @click="togglePanelMinimized">
              <span>Visa text</span>
            </div>
          </div>

        </div>
      </div>

    </div>
</div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount, onActivated, nextTick, createApp } from "vue";

import { useRoute } from "vue-router";
import AnnotationPopup from "./AnnotationPopup.vue";
import AnnotationMarker from "./AnnotationMarker.vue";
import { useSelectedAnnotationStore } from "~/stores/selectedAnnotationStore";
import { useOverlayStore } from "~/stores/overlayStore";
import timelineData from "public/timeline.json";
import { usePanelStore } from '~/stores/panelStore';
import svamparData from "public/SvamparSkogsbruk.json";
import totalSvamparData from "public/TotalSvamparSkogsbruk.json";



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

    const viewer = ref(null);
    const isClient = ref(false);
    const viewerContainer = ref(null);
    const viewerId = computed(
      () => "openseadragon-viewer-" + Math.random().toString(36).substr(2, 9)
    );
    let osdLib = null;
    let unmounted = false;
    onBeforeUnmount(() => {
      unmounted = true;
    });
    const currentTile = ref(null);
    const overlayImage = ref(null);

    let annotationOverlayIds = [];

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
      // Get container coordinates
      const rect = viewerContainer.value.getBoundingClientRect();
      const containerX = e.clientX - rect.left;
      const containerY = e.clientY - rect.top;
      // Convert container pixel coordinates to viewport coordinates
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
          staticOverlay.style.zIndex = "5";
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

      // Remove previously added annotation overlays only.
      annotationOverlayIds.forEach((id) => {
        viewer.value.removeOverlay(id);
      });
      annotationOverlayIds = [];

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

        new osdLib.MouseTracker({
          element: markerContainer,
          clickHandler: () => {
            emit("annotationClicked", annotation);
          },
        });

        // Assign a unique ID for each marker overlay.
        const markerId = "annotation-" + annotation.id;
        markerContainer.id = markerId;
        viewer.value.addOverlay({
          element: markerContainer,
          location: new osdLib.Point(annotation.position.x, annotation.position.y),
          placement: "BOTTOM",
          checkResize: false,
        });
        annotationOverlayIds.push(markerId);
      });
    }

    // Method to show the popup overlay.
    function showPopup(annotation) {
      if (!viewer.value || !osdLib) return;
      const popupContainer = document.createElement("div");
      popupContainer.style.pointerEvents = "auto";
      const app = createApp(AnnotationPopup, { annotation });
      app.mount(popupContainer);
    }

    // Initialize the viewer.
    async function initViewer() {
  if (typeof window === "undefined") return;
  if (viewer.value) return;
  if (route.name !== "skogsskotsel") return;
  const containerEl = viewerContainer.value;
  if (!containerEl) return;

  const osdModule = await import("openseadragon");
  const osd = osdModule.default || osdModule;
  osdLib = osd;

  // Patch the image loader to force the crossOrigin attribute
  if (osdLib && osdLib.ImageLoader && osdLib.ImageLoader.prototype) {
    const originalCreateImage = osdLib.ImageLoader.prototype.createImage;
    osdLib.ImageLoader.prototype.createImage = function (tileUrl, success, error) {
      const img = originalCreateImage.apply(this, arguments);
      if (img) {
        img.crossOrigin = 'Anonymous';
      }
      return img;
    };
  }

  // Viewer initialization options
  const viewerOptions = {
    element: containerEl,
    crossOriginPolicy: 'Anonymous',
    ajaxWithCredentials: false,
    showNavigationControl: false,
    visibilityRatio: 1,
    minZoomLevel: 1,
    constrainDuringPan: true,
    panHorizontal: true,
    panVertical: true,
    homeFillsViewer: true,
    animationTime: 0.5,
    defaultZoomLevel: props.layoutMode === "sideBySide" ? null : 1.3,
    gestureSettingsMouse: {
      scrollToZoom: true,
      clickToZoom: false,
      dblClickToZoom: true,
      clickTodrag: false,
      pinchToZoom: false,
    },
  };

  viewer.value = osd(viewerOptions);

  viewer.value.addHandler("animation", () => {
    const zoom = viewer.value.viewport.getZoom();
    const center = viewer.value.viewport.getCenter();
    emit("viewportChanged", { zoom, center });
  });
  transitionToNewTile(props.dziUrl);
}

    function transitionToNewTile(newUrl) {
      if (!viewer.value) return;
      viewer.value.addTiledImage({
        tileSource: newUrl,
        success: function (newTiledImage) {
          if (currentTile.value) {
            viewer.value.world.removeItem(currentTile.value);
          }
          currentTile.value = newTiledImage;
          emit("opened");
          updateOverlays();
          // Remove any existing overlay image before adding a new one
          if (overlayImage.value) {
            viewer.value.world.removeItem(overlayImage.value);
            overlayImage.value = null;
          }
          // If an overlay DZI URL is provided, add it on top and store its reference
          if (props.overlayDziUrl) {
            viewer.value.addTiledImage({
              tileSource: props.overlayDziUrl,
              opacity: overlayOpacityLocal.value,
              // useCanvas: true, 
              success: function (overlayTiledImage) {
                overlayImage.value = overlayTiledImage;
              }
            });
          }
        },
      });
    }



    const overlayOpacityLocal = ref(1);

    watch(() => props.globalOpacity, (newVal) => {
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
            }
          }
          viewer.value.forceRedraw();
        }
      }
    }, );

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
      }
      // If globalOpacity prop is defined, emit the update to parent.
      if (props.globalOpacity !== undefined) {
        emit('update:globalOpacity', newOpacity);
      }
    }

    // Watch for changes in dziUrl.
    watch(
  () => props.dziUrl,
  async (newVal, oldVal) => {
    if (viewer.value && newVal !== oldVal) {
      // Destroy the current viewer before loading the new URL
      viewer.value.destroy();
      viewer.value = null;
      // Optionally clear current tile references
      currentTile.value = null;
      overlayImage.value = null;
      // Reinitialize the viewer with the new URL
      await initViewer();
    }
  }
);

    // Watch for changes in annotations.
    watch(
      () => props.annotations,
      () => {
        updateOverlays();
      },
      { immediate: true }
    );

    onBeforeUnmount(() => {
      if (viewer.value) {
        viewer.value.destroy();
        viewer.value = null;
      }
    });
    onActivated(() => {
      if (props.dziUrl && viewer.value) {
        transitionToNewTile(props.dziUrl);
      }
    });
    // Also, in the onMounted() hook, after initializing the viewer, check the current overlay state:
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
