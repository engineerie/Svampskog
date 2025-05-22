<template>
    <div class="timeline-container">
      <UButton
        @click="toggleStartskog"
        :label="`Historik: ${displayStartskog}`"
        class="mb-4"
        color="secondary"
        variant="subtle"
      />
      <div class="flex flex-col space-y-4">
        <div v-for="entry in sortedEntries" :key="entry.tid" class="flex items-start">
          <div class="flex-none w-18">
            <UBadge variant="subtle" color="time" size="lg" >{{ formatTid(entry.tid) }}</UBadge>
          </div>
          <div class="flex-1">
            <p><span class="font-bold">Skog:</span> {{ entry.skog }}</p>
            <p><span class="font-bold">Svamp:</span> {{ entry.svamp }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import timelineData from 'public/timeline.json';
  
  // Expect prop `framework` matching the `atgard` values in timeline.json
  const props = defineProps({
    framework: { type: String, required: true }
  });
  
  // Gather available startskog options for this framework
  const startskogOptions = computed(() =>
    Array.from(
      new Set(
        timelineData
          .filter(i => i.atgard === props.framework)
          .map(i => i.startskog)
      )
    )
  );
  
  // Active selection & toggle logic
  const activeStartskog = ref(startskogOptions.value[0] || '');
  function toggleStartskog() {
    const opts = startskogOptions.value;
    const idx = opts.indexOf(activeStartskog.value);
    activeStartskog.value = opts[(idx + 1) % opts.length];
  }
  
  // Filter for current framework + startskog
  const entries = computed(() =>
    timelineData.filter(
      i => i.atgard === props.framework && i.startskog === activeStartskog.value
    )
  );
  
  // Desired display order of tidslabels
  const timeOrder = ['innan', 'efter', '10 år', '20 år', '50 år', '80 år'];
  const sortedEntries = computed(() =>
    entries.value.slice().sort((a, b) => timeOrder.indexOf(a.tid) - timeOrder.indexOf(b.tid))
  );

  // Map raw startskog keys to display labels
const displayStartskog = computed(() => {
  if (activeStartskog.value === 'naturskog') return 'Inte kalavverkad';
  if (activeStartskog.value === 'produktionsskog_') return 'Kalavverkad';
  return activeStartskog.value;
});
  
  // Nicely format the tid strings
  function formatTid(tid) {
    if (tid === 'innan') return 'Innan';
    if (tid === 'efter') return 'Efter';
    if (tid === '10 år') return '10 år';
    if (tid === '20 år') return '20 år';
    if (tid === '50 år') return '50 år';
    if (tid === '80 år') return '+80 år';
    return tid; // e.g. '10 år', '20 år', etc.
  }
  </script>