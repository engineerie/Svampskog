<template>
  <!-- MySlideover.vue -->
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
        <div class="absolute top-4 right-4 items-end gap-2 z-10 flex">
          <UButton
            class="shadow hover:bg-white"
            color="neutral"
            variant="subtle"
            :ui="{ rounded: 'rounded-full' }"
            @click="togglePinned"
            icon="codicon:pinned"
            :class="localPinned ? 'text-primary-500' : 'text-neutral-700'"
          />
          <UButton
            class="shadow hover:bg-white"
            color="neutral"
            variant="subtle"
            :ui="{ rounded: 'rounded-full' }"
            icon="heroicons:x-mark"
            @click="emit('update:modelValue', false)"
          />
        </div>

        <div class="h-full relative overflow-auto pb-16 no-scrollbar">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  pinned: { type: Boolean, default: true },
  expanded: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue", "update:pinned"]);

const localPinned = ref(props.pinned);

watch(
  () => props.pinned,
  (val) => {
    localPinned.value = val;
  }
);

function togglePinned() {
  localPinned.value = !localPinned.value;
  emit("update:pinned", localPinned.value);
}
</script>

<style scoped>
/* Hide scrollbars for the element with class "no-scrollbar" */

/* For WebKit browsers */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* For Firefox */
.no-scrollbar {
  scrollbar-width: none;
}

/* For IE, Edge */
.no-scrollbar {
  -ms-overflow-style: none;
}

/* Existing transition styles */
.slide-in-right-enter-active,
.slide-in-right-leave-active {
  transition: transform 0.5s ease;
}
.slide-in-right-enter-from,
.slide-in-right-leave-to {
  transform: translateX(100%);
}
</style>