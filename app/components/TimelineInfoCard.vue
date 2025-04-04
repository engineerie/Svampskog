<template>
  <div :class="['rounded-lg bg-neutral-50 shadow-sm p-4', containerClasses]">
    <div v-if="data">


      <!-- Info rows -->
      <div class="gap-2 mb-2">
        <!-- <div class="size-5">
          <Icon name="lucide:trees" class="w-5 h-5 icon text-primary-500" />
        </div> -->
        <h1 class="text-neutral-400 text-sm font-semibold">
          Vad händer med skogen
        </h1>
        <h1 class="text-neutral-700">
          {{ data.skog }}
        </h1>
      </div>
      <div class="gap-2 mb-2">
        <div class="flex">
          <!-- <Icon
            name="fluent:shape-organic-24-filled"
            class="size-4 icon text-primary-500"
          /> -->
          <h1 class="text-neutral-400 text-sm font-semibold">
            Vad händer med svampen
          </h1>
        </div>
        <h1 size="sm" weight="thin" class="text-neutral-700">
          {{ data.svamp }}
        </h1>
      </div>
    </div>
    <div v-else>
      <p>{{ emptyMessage || "Ingen data" }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  framework: { type: Object, required: true },
  timeLabel: { type: String, default: "" },
  data: { type: Object, default: null },
  currentStartskog: { type: Object, required: true },
  emptyMessage: { type: String, default: "" },
  containerClasses: { type: String, default: "" },
});
</script>
