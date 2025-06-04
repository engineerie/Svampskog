<template>


    
        
  <div class=" ">
    
    <!-- Header / List View -->
   
    <div class="md:flex justify-between ">
    
      <div class="md:flex gap-4">
      
        

        <div class="flex justify-between md:mt-0 mt-1 mb-1 md:mb-2">
                  <h1 @click="$emit('enlarge')" class="text-2xl md:text-3xl  ">Alla mykorrhizasvampar</h1>
                 
                  <UButton
      color="neutral"
      variant="soft"
        size="lg"
        @click="$emit('enlarge')"
        :class="isNormalView ? 'hidden' : 'md:hidden'"
        :icon="isNormalView ? '' : 'i-heroicons-arrow-uturn-left-solid'"
        trailing
        
      />
        </div>

        <div class="flex justify-between">
  


  <!-- <UBadge
    
    icon="solar:dna-linear"
    size="md"
    color="secondary"
    variant="subtle"
    label="Enligt DNA från markprover"
    class="h-fit md:hidden mb-2 mr-2"
  />    -->
  <UBadge
    :icon="sampleEnvCount < 10 ? 'i-cuida-warning-outline' : undefined"
    size="md"
    :color="sampleEnvCount < 10 ? 'warning' : 'secondary'"
    variant="subtle"
    class="h-fit flex md:hidden"
  >
    {{ sampleEnvCount < 10 ? 'Få prov: ' + sampleEnvCount + ' skogar' : 'Baserat på ' + sampleEnvCount + ' skogar' }}
  </UBadge>

<UModal fullscreen title="Diagram" :ui="{
  body: 'pt-0',
}">
    <!-- trigger button -->
    <UButton
      class="md:hidden ml-2 "
      :class="isNormalView ? 'hidden' : ''"
      variant="soft"
      icon="material-symbols:bar-chart"
      size="lg"
      label="Diagram"
      trailing
    />
    <!-- modal body -->
    <template #body >
      <EnvironmentSelector :initialMobileCollapsed="true" />

      <BarChart
  :chartData="data"
  :chartWidth="chartWidth"
  :geography="geographyValue"
  :forestType="forestTypeValue"
  :standAge="standAgeValue"
  :vegetationType="vegetationTypeValue"
  :matsvampFilter="matsvampFilter"
  :giftsvampFilter="giftsvampFilter"
  :gruppFilter="gruppFilter"
  :groupKey="grupp"
  :statusFilter="statusFilter"
  :search-term="modalSearchTerm"
  @update:searchTerm="modalSearchTerm = $event"
/>
<SpeciesTable
  class="mt-2"
  @enlarge="emit('enlarge')"
  @update:matsvampFilter="matsvampFilter = $event"
  @update:giftsvampFilter="giftsvampFilter = $event"
  @update:gruppFilter="gruppFilter = $event"
  @update:statusFilter="statusFilter = $event"
  @update:searchTerm="modalSearchTerm = $event"
  :isNormalView="isNormalView"
  :column-visibility-overrides="columnVisibilityOverrides"
  :search-term="modalSearchTerm"
/>
    </template>
  </UModal>
</div>
        <div class=" justify-between hidden">
                  <UTabs v-model="activeTab" :items="items" class="w-full" color="neutral" variant="link" :unmount-on-hide="false" />
        </div>
       
      </div>
      <div class="flex gap-3 items-center pb-2">
        <UBadge
          v-if="!isNormalView" 
          icon="solar:dna-linear"
          size="lg"
          color="secondary"
          variant="subtle"
          label="Enligt DNA från markinventeringens provytor"
          class="h-fit hidden md:flex"
        />   
       
        <UBadge
          :icon="sampleEnvCount < 10 ? 'i-cuida-warning-outline' : undefined"
          size="lg"
          :color="sampleEnvCount < 10 ? 'warning' : 'secondary'"
          variant="subtle"
          class="h-fit hidden md:flex"
        >
          {{ sampleEnvCount < 10 ? 'Lågt provantal: ' + sampleEnvCount + ' skogar' : 'Baserat på ' + sampleEnvCount + ' skogar' }}
        </UBadge>
        <UButton
        class="hidden md:flex h-fit"
        color="neutral"
        variant="ghost"
          size="lg"
          :icon="isNormalView ? 'material-symbols:open-in-full' : 'material-symbols:close-fullscreen'"
          @click="$emit('enlarge')"
        />
      </div>
    </div>

    <!-- FullScreenEdna (if spatialForest tab is active) -->
    <!-- <FullScreenEdna v-if="activeTab === 'spatialForest'" :isNormalView="isNormalView" /> -->
    <transition name="fade" mode="out-in" class="md:min-h-[550px] min-h-full">
<div v-if="activeTab === 'spatialForest'" class="">
  <!-- <UButton
        class="md:hidden block absolute bottom-0 right-0"
        color="primary"
        variant="ghost"
        label="Visa alla"
        size="xl"
        
          @click="$emit('enlarge')"
        /> -->
      <SpeciesTable @enlarge="emit('enlarge')" :isNormalView="isNormalView" :column-visibility-overrides="columnVisibilityOverrides" />
</div>
    
    <div
      v-else-if="activeTab === 'columnChart'"
      class="p-2"
    >
    <BarChart
  :chartData="data"
  :chartWidth="chartWidth"
  :geography="geographyValue"
  :forestType="forestTypeValue"
  :standAge="standAgeValue"
  :vegetationType="vegetationTypeValue"
  :matsvampFilter="matsvampFilter"
  :giftsvampFilter="giftsvampFilter"
  :gruppFilter="gruppFilter"
  :groupKey="grupp"
  :statusFilter="statusFilter"
  :search-term="modalSearchTerm"
  @update:searchTerm="modalSearchTerm = $event"
/>
<SpeciesTable
  class="mt-2"
  @enlarge="emit('enlarge')"
  @update:matsvampFilter="matsvampFilter = $event"
  @update:giftsvampFilter="giftsvampFilter = $event"
  @update:gruppFilter="gruppFilter = $event"
  @update:statusFilter="statusFilter = $event"
  @update:searchTerm="modalSearchTerm = $event"
  :isNormalView="isNormalView"
  :column-visibility-overrides="columnVisibilityOverrides"
  :search-term="modalSearchTerm"
/>
    </div>
  </transition>

  </div>

</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useMediaQuery } from '@vueuse/core';
import { useEnvParamsStore } from "~/stores/envParamsStore";
import { storeToRefs } from "pinia";
import { useTabsStore } from '~/stores/tabsStore';

const matsvampFilter = ref(false);
const giftsvampFilter = ref(false);
const gruppFilter = ref<string[]>([]);
const statusFilter = ref<string[]>([]);



const modalSearchTerm = ref('');

const { isNormalView } = defineProps<{ isNormalView: boolean }>();
const emit = defineEmits<{ (e: "enlarge"): void }>();

const tabsStore = useTabsStore();
const activeTab = computed({
  get: () => isSmallScreen.value ? 'spatialForest' : tabsStore.getActiveTab("EdnaComponent"),
  set: (val) => {
    if (!isSmallScreen.value) {
      tabsStore.setActiveTab("EdnaComponent", val);
    }
  }
});

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

// hide image column on small (mobile) screens
const isSmallScreen = useMediaQuery('(max-width: 767px)');
const columnVisibilityOverrides = computed(() => ({
  mark: false,
  ...(isSmallScreen.value ? { images: false } : {})
}));

// Fetch data when environment store values change.
async function fetchData(geog: string, forest: string, age: string, veg: string) {
  const filename = `edna-${geog}-${forest}-${age}-${veg}.json`;
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
