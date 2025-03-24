<!-- MySlideover.vue -->
<template>
  <!-- Slide-in from right transition -->
  <transition name="slide-in-right">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex pointer-events-none m-2 group"
    >
      <div
        v-if="!localPinned"
        class="fixed inset-0 pointer-events-auto"
        @click="emit('update:modelValue', false)"
      ></div>
      <div
        ref="panelRef"
        class="ml-auto bg-white shadow-lg z-50 relative pointer-events-auto rounded-xl ring-1 ring-neutral-200 transition-all overflow-hidden"
        :class="[localPinned ? '-m-1' : '', expanded ? 'w-[744px]' : 'w-96']"
        @click.stop
      >
        <!-- <div>
            <slot name="header" />
          </div> -->

        <div class="absolute top-4 right-4 items-end gap-2 z-10 flex">
          <UButton
            class="shadow hover:opacity-100"
            color="white"
            :ui="{ rounded: 'rounded-full' }"
            @click="togglePinned"
            icon="codicon:pinned"
            :class="
              localPinned
                ? 'text-primary-500 opacity-100'
                : 'text-neutral-700 opacity-90'
            "
          />
          <UButton
            class="shadow opacity-90 hover:opacity-100"
            color="white"
            :ui="{ rounded: 'rounded-full' }"
            icon="heroicons:x-mark"
            @click="emit('update:modelValue', false)"
          />
        </div>

        <div class="h-full relative overflow-auto pb-16">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  /**
   * Open/closed state
   */
  modelValue: {
    type: Boolean,
    default: false,
  },
  /**
   * Pinned state => determines if overlay is shown
   */
  pinned: {
    type: Boolean,
    default: true,
  },

  expanded: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue", "update:pinned"]);

/**
 * localPinned mirrors the parent's pinned prop
 */
const localPinned = ref(props.pinned);

watch(
  () => props.pinned,
  (val) => {
    localPinned.value = val;
  }
);

/**
 * Toggle pinned <-> unpinned
 */
function togglePinned() {
  localPinned.value = !localPinned.value;
  // Let the parent know pinned changed
  emit("update:pinned", localPinned.value);
}
</script>

<style scoped>
/* Simple transition for sliding in from the right */
.slide-in-right-enter-active,
.slide-in-right-leave-active {
  transition: transform 0.5s ease;
}
.slide-in-right-enter-from,
.slide-in-right-leave-to {
  transform: translateX(100%);
}
</style>
