<template>
  <div v-if="layoutMode === 'slider'" ref="container" class="relative w-full h-full overflow-hidden select-none">
    <!-- Labels -->
    <!-- <div class="absolute inset-x-0 top-2 px-3 flex justify-between z-30 pointer-events-none">
      <div class="flex flex-col gap-1">
        <UBadge v-if="frameworkLabel" size="md" color="neutral" variant="solid" class="pointer-events-auto">
          {{ frameworkLabel }}
        </UBadge>
        <UBadge v-if="timeLabel" size="sm" color="neutral" variant="subtle" class="pointer-events-auto">
          {{ timeLabel }}
        </UBadge>
      </div>
      <div class="flex flex-col gap-1 items-end">
        <UBadge v-if="frameworkLabel2" size="md" color="neutral" variant="solid" class="pointer-events-auto">
          {{ frameworkLabel2 }}
        </UBadge>
        <UBadge v-if="timeLabel2" size="sm" color="neutral" variant="subtle" class="pointer-events-auto">
          {{ timeLabel2 }}
        </UBadge>
      </div>
    </div> -->
    <!-- "After" slot: full background -->
    <div class="absolute inset-0" style="z-index:0">
      <slot name="second" />
    </div>
    <!-- "Before" slot: rendered with a clip-path and higher z-index -->
    <div class="absolute inset-0 overflow-hidden" :style="{
      clipPath: 'inset(0 calc(100% - ' + sliderPercent * 100 + '%) 0 0)',
      zIndex: 10,
    }">
      <slot name="first" />
    </div>
    <!-- Draggable slider handle -->
    <div class="absolute top-0 flex items-center justify-center h-full w-10 cursor-ew-resize" :style="{
      left: sliderPercent * 100 + '%',
      transform: 'translateX(-50%)',
      zIndex: 20,
    }" @mousedown="startDrag" @touchstart="startDrag">
      <div class="flex h-full relative">
        <div class="absolute text-end  right-3 top-2">
          <!-- <UBadge v-if="!isMobile" size="md"
            class="backdrop-blur-xl bg-neutral-100/0 text-neutral-100 h-fit whitespace-nowrap mb-0.5">{{
              frameworkLabel }}</UBadge> -->
          <UBadge size="md" class="backdrop-blur-xl bg-neutral-950/50 text-neutral-100 h-fit whitespace-nowrap">{{
            primaryTimeLabel }}</UBadge>
        </div>

        <div class="h-full w-1.5 bg-neutral-50/90 backdrop-blur-md inset-shadow-sm inset-shadow-neutral-300"></div>
        <div class="absolute top-2 left-3">
          <!-- <UBadge v-if="!isMobile" size="md"
            class="backdrop-blur-xl bg-neutral-100/0 text-neutral-100 h-fit whitespace-nowrap mb-0.5">{{
              frameworkLabel2 }}</UBadge> -->
          <UBadge size="md" class="backdrop-blur-xl bg-neutral-950/50 text-neutral-100 h-fit whitespace-nowrap">{{
            secondaryTimeLabel }}</UBadge>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="layoutMode === 'sideBySide'" class="flex w-full h-full gap-1">
    <!-- In side-by-side mode, the images are simply rendered in two equal containers -->
    <div class="w-1/2 h-full">
      <slot name="first" />
    </div>
    <div class="w-1/2 h-full">
      <slot name="second" />
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import { useMediaQuery } from '@vueuse/core'
const isMobile = useMediaQuery('(max-width: 767px)')


// Accept a prop for layout mode.
const props = defineProps({
  frameworkLabel: {
    type: String,
    default: "",
  },
  timeLabel: {
    type: String,
    default: "",
  },
  frameworkLabel2: {
    type: String,
    default: "",
  },
  timeLabel2: {
    type: String,
    default: "",
  },
  useMethodLabels: {
    type: Boolean,
    default: false,
  },
  layoutMode: {
    type: String,
    default: "slider"  // default if nothing is passed
  }
});

// Initialize internal layout mode with the prop value.
const layoutMode = ref(props.layoutMode);
const primaryTimeLabel = computed(() => (props.useMethodLabels ? props.frameworkLabel : props.timeLabel));
const secondaryTimeLabel = computed(() => (props.useMethodLabels ? props.frameworkLabel2 : props.timeLabel2));

// Watch for prop changes to update internal state.
watch(() => props.layoutMode, (newVal) => {
  if (newVal === "slider" || newVal === "side-by-side" || newVal === "sideBySide") {
    layoutMode.value = newVal;
  }
});

// Your existing code...
const container = ref(null);
const sliderPercent = ref(0.5);
let dragging = false;

function updateSliderPercent(e) {
  if (!container.value) return;
  const rect = container.value.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  let percent = (clientX - rect.left) / rect.width;
  percent = Math.max(0, Math.min(percent, 1));
  sliderPercent.value = percent;
}

function startDrag(e) {
  if (layoutMode.value !== "slider") return;
  dragging = true;
  updateSliderPercent(e);
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", stopDrag);
  window.addEventListener("touchmove", onDrag);
  window.addEventListener("touchend", stopDrag);
}

function onDrag(e) {
  if (!dragging) return;
  updateSliderPercent(e);
}

function stopDrag() {
  dragging = false;
  window.removeEventListener("mousemove", onDrag);
  window.removeEventListener("mouseup", stopDrag);
  window.removeEventListener("touchmove", onDrag);
  window.removeEventListener("touchend", stopDrag);
}

// Expose both toggle and set functions.
function toggleLayoutMode() {
  layoutMode.value = layoutMode.value === "slider" ? "sideBySide" : "slider";
}
function setLayoutMode(newMode) {
  if (newMode === "slider" || newMode === "sideBySide") {
    layoutMode.value = newMode;
  }
}

defineExpose({
  toggleLayoutMode,
  setLayoutMode,
});

onMounted(() => {
  sliderPercent.value = 0.5;
});
</script>
