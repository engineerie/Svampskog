<template>
  <div>
    <!-- Header / List View -->
    <div class="flex justify-between">
      <div class="flex gap-4">
        <h1 class="text-3xl ml-4">Alla mykorrhizasvampar</h1>
        <UTabs v-model="activeTab" :items="items" color="neutral" variant="link" />
       
      </div>
      <div class="flex gap-4 items-end pb-2">
        <UBadge
          v-if="!isNormalView"
          icon="solar:dna-linear"
          size="lg"
          color="secondary"
          variant="subtle"
          label="Enligt DNA från markinventeringens provytor"
          class="h-fit"
        />
        <div class="w-32">
          <h1 class="text-neutral-400 text-xs">
            Baserat på {{ sampleEnvCount }} skogar
          </h1>
          <UProgress
            :indicator="false"
            v-model="sampleEnvCount"
            :max="100"
            size="xl"
          />
        </div>
        <UButton
        color="neutral"
        variant="ghost"
          size="lg"
          :icon="isNormalView ? 'material-symbols:open-in-full' : 'material-symbols:close-fullscreen'"
          @click="$emit('enlarge')"
        />
      </div>
    </div>

    <!-- FullScreenEdna (if spatialForest tab is active) -->
    <FullScreenEdna v-if="activeTab === 'spatialForest'" :isNormalView="isNormalView" />

    <!-- Column Chart View -->
    <div
      v-if="activeTab === 'columnChart'"
      class="p-2"
    >
      <!-- Legend omitted for brevity -->
      <BarChart
        :chartData="data"
        :chartWidth="chartWidth"
        :geography="geographyValue"
        :forestType="forestTypeValue"
        :standAge="standAgeValue"
        :vegetationType="vegetationTypeValue"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useEnvParamsStore } from "~/stores/envParamsStore";
import { storeToRefs } from "pinia";


// Component props and emitted events.
const props = defineProps<{ isNormalView: boolean }>();
const emit = defineEmits<{ (e: "enlarge"): void }>();

// Tabs config.
const activeTab = ref<"columnChart" | "spatialForest">("columnChart");
const items = [
  { label: "Diagram", icon: "material-symbols:bar-chart", value: "columnChart" },
  { label: "Tabell", icon: "material-symbols:table-outline", value: "spatialForest" },
];

// Use the environment store.
const envStore = useEnvParamsStore();
const { geography, forestType, standAge, vegetationType } = storeToRefs(envStore);

// Expose store values as computed (for passing down to BarChart).
const geographyValue = computed(() => geography.value);
const forestTypeValue = computed(() => forestType.value);
const standAgeValue = computed(() => standAge.value);
const vegetationTypeValue = computed(() => vegetationType.value);

// Data for chart fetched based on environment.
const data = ref<any[]>([]);
const sampleEnvCount = computed(() =>
  data.value.length > 0 ? data.value[0].sample_env_count || 0 : 0
);
const chartWidth = ref("100%");

// Fetch data when environment store values change.
async function fetchData(geog: string, forest: string, age: string, veg: string) {
  const filename = `data-${geog}-${forest}-${age}-${veg}.json`;
  try {
    const response = await fetch(`/edna/${filename}`);
    if (!response.ok) throw new Error(`Failed to fetch ${filename}`);
    const jsonData = await response.json();
    jsonData.sort((a: any, b: any) => b.sample_plot_count - a.sample_plot_count);
    data.value = jsonData;
  } catch (error) {
    console.error("Error fetching data:", error);
    data.value = [];
  }
}

// When store values change, fetch new data.
watch(
  () => [geography.value, forestType.value, standAge.value, vegetationType.value],
  ([geog, forest, age, veg]) => {
    if (geog && forest && age && veg) {
      fetchData(geog, forest, age, veg);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
/* Add your styles */
</style>