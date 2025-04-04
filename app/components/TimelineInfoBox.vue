<template>
  <div class="relative">
    <!-- CASE A: Single view -->
    <section v-if="!isCompare && !isFrameworkCompareMode">
      <TimelineInfoCard
        v-if="mainTimelineData"
        :framework="currentFramework"
        :timeLabel="currentTimeLabel"
        :data="mainTimelineData"
        :currentStartskog="currentStartskog"
        @open-info="$emit('open-info')"
      />
      <div v-else>
        <p>Välj en tid och åtgärd för att se info</p>
      </div>
    </section>

    <!-- CASE B: Compare mode => Before/After -->
    <section v-else-if="isCompare" class="grid grid-cols-2 gap-2">
      <!-- Before box -->
      <TimelineInfoCard
        :framework="currentFramework"
        timeLabel="Före avverkning"
        :data="beforeData"
        :currentStartskog="currentStartskog"
        emptyMessage="Ingen data för 'innan'"
        @open-info="showModal = true"
      />
      <!-- After box -->
      <TimelineInfoCard
        :framework="currentFramework"
        :timeLabel="currentTimeLabel"
        :data="mainTimelineData"
        :currentStartskog="currentStartskog"
        containerClasses=""
        :emptyMessage="`Ingen data för ${currentTime}`"
      />
    </section>

    <!-- CASE C: Framework compare mode => two frameworks -->
    <section v-else-if="isFrameworkCompareMode" class="grid grid-cols-2 gap-2">
      <!-- Box #1: currentFramework -->
      <TimelineInfoCard
        :framework="currentFramework"
        :timeLabel="currentTimeLabel"
        :data="mainTimelineData"
        :currentStartskog="currentStartskog"
        :emptyMessage="`Ingen data för ${currentFramework.label} / ${currentTime}`"
        @open-info="showModal = true"
      />
      <!-- Box #2: compareFramework -->
      <TimelineInfoCard
        :framework="compareFramework"
        :timeLabel="currentTimeLabel"
        :data="compareTimelineData"
        :currentStartskog="compareStartskog"
        :emptyMessage="`Ingen data för ${compareFramework.label} / ${compareTime}`"
        @open-info="showModal2 = true"
      />
    </section>

    <!-- Otherwise -->
    <section v-else>
      <p>Okänt läge...</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import TimelineInfoCard from "./TimelineInfoCard.vue";
import timelineData from "public/timeline.json";

// Define Props
const props = defineProps({
  currentFramework: {
    type: Object,
    default: null,
  },
  currentTime: { type: String, default: "" },
  currentStartskog: {
    type: Object,
    default: null,
  },
  currentTimeLabel: { type: String, default: "" },
  isCompare: { type: Boolean, default: false },
  isFrameworkCompareMode: { type: Boolean, default: false },
  compareFramework: {
    type: Object,
    default: null,
  },
  compareTime: { type: String, default: "" },
  compareStartskog: {
    type: Object,
    default: null,
  },
});

const showModal = ref(false);
const showModal2 = ref(false);

const mainTimelineData = computed(() => {
  if (
    !props.currentFramework?.value ||
    !props.currentTime ||
    !props.currentStartskog?.value
  ) {
    return undefined; // return undefined instead of null
  }
  return (
    timelineData.find(
      (item) =>
        item.atgard === props.currentFramework.value &&
        item.tid === props.currentTime &&
        item.startskog === props.currentStartskog.value
    ) || undefined
  );
});

const beforeData = computed(() => {
  if (!props.currentFramework?.value || !props.currentStartskog?.value) {
    return undefined;
  }
  return (
    timelineData.find(
      (item) =>
        item.atgard === props.currentFramework.value &&
        item.tid === "innan" &&
        item.startskog === props.currentStartskog.value
    ) || undefined
  );
});

const compareTimelineData = computed(() => {
  if (!props.compareFramework?.value || !props.compareStartskog?.value) {
    return undefined;
  }
  const theTime = props.compareTime || props.currentTime;
  return (
    timelineData.find(
      (item) =>
        item.atgard === props.compareFramework.value &&
        item.tid === theTime &&
        item.startskog === props.compareStartskog.value
    ) || undefined
  );
});
</script>

<style scoped>
/* Additional styling if needed */
</style>
