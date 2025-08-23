<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps<{
  modelValue?: number
  showToolbar?: boolean
  mode?: 'layout' | 'ui'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const min = 0.75
const max = 2
const step = 0.1

function clamp(v: number) { return Math.min(max, Math.max(min, +v.toFixed(2))) }

const scale = ref(typeof props.modelValue === 'number' ? clamp(props.modelValue) : 1)

watch(() => props.modelValue, (v) => {
  if (typeof v === 'number') scale.value = clamp(v)
})
watch(scale, (v) => emit('update:modelValue', v))

function zoomIn()  { scale.value = clamp(scale.value + step) }
function zoomOut() { scale.value = clamp(scale.value - step) }
function reset()   { scale.value = 1 }

const percent = computed(() => Math.round(scale.value * 100))

// Optional: support Cmd/Ctrl + and - and 0 inside this component
function onKey(e: KeyboardEvent) {
  const meta = e.ctrlKey || e.metaKey
  if (!meta) return
  if (e.key === '=' || e.key === '+') { e.preventDefault(); zoomIn() }
  if (e.key === '-') { e.preventDefault(); zoomOut() }
  if (e.key === '0') { e.preventDefault(); reset() }
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
<section :class="['modelc', (props.mode ?? 'layout') === 'ui' ? 'ui-mode' : 'layout-mode']">
  <header v-if="props.showToolbar !== false" class="toolbar">
      <button type="button" @click="zoomOut" aria-label="Zoom out">−</button>
      <span class="label" aria-live="polite">{{ percent }}%</span>
      <button type="button" @click="zoomIn" aria-label="Zoom in">+</button>
      <button type="button" @click="reset" aria-label="Reset zoom">Reset</button>
    </header>

    <!--
      The outer "frame" reserves the *unscaled* size so scrollbars/layout stay sane.
      We set a CSS var with the current scale and let CSS pick zoom vs transform.
    -->
    <div
      class="zoom-frame"
      :style="{
        // used by both strategies
        '--scale': String(scale),
      }"
    >
      <!-- Your ModelC content goes here -->
      <div class="zoom-content">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Base frame */
.zoom-frame {
  inline-size: 100%;
  block-size: auto;
  overflow: auto;
}

/* ---- Layout (content scaling) mode: mimic container zoom ---- */
.layout-mode .zoom-frame { inline-size: 100%; }

@supports (zoom: 1.1) {
  .layout-mode .zoom-content { zoom: var(--scale, 1); }
}

@supports not (zoom: 1.1) {
  .layout-mode .zoom-frame { inline-size: calc(100% / var(--scale, 1)); }
  .layout-mode .zoom-content {
    transform: scale(var(--scale, 1));
    transform-origin: top left;
  }
}

/* ---- UI mode: scale UI like browser zoom (but allow opt-out) ---- */
.ui-mode .zoom-frame { inline-size: 100%; }

/* Prefer native zoom (Chromium/Safari) */
@supports (zoom: 1.1) {
  .ui-mode .zoom-content { zoom: var(--scale, 1); }
  /* Children marked as exempt: cancel the parent's zoom */
  .ui-mode .zoom-content :deep(.ui-zoom-exempt) { zoom: calc(1 / var(--scale, 1)); }
  /* Reapply zoom inside an exempt container to get back to UI scale */
.ui-mode .zoom-content :deep(.ui-zoom-reapply) { zoom: var(--scale, 1); }
}

/* Fallback for Firefox: transform scale + size compensation */
@supports not (zoom: 1.1) {
  .ui-mode .zoom-frame { inline-size: calc(100% / var(--scale, 1)); }
  .ui-mode .zoom-content {
    transform: scale(var(--scale, 1));
    transform-origin: top left;
  }
  /* Exempt: inverse transform + width compensation */
  .ui-mode .zoom-content :deep(.ui-zoom-exempt) {
    transform: scale(calc(1 / var(--scale, 1))) !important;
    transform-origin: top left !important;
    inline-size: calc(100% * var(--scale, 1)) !important;
  }
  /* Reapply inside exempt for Firefox fallback */
.ui-mode .zoom-content :deep(.ui-zoom-reapply) {
  transform: scale(var(--scale, 1)) !important;
  transform-origin: top left !important;
  inline-size: calc(100% / var(--scale, 1)) !important;
}
}
</style>