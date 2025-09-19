<template>
  <UCard variant="outline" class="rounded-none sm:rounded-lg">
    <!-- Header with title, filters, and view toggle -->
    <div class="md:flex justify-between items-start">
      <div class="md:flex gap-4">
        <div class="w-full flex justify-between items-start">
          <div>
            <h1 @click="$emit('enlarge')"
              class="text-teal-500 dark:text-neutral-300 text-4xl font-bold md:font-medium md:text-3xl">

              Naturvårdsarter
            </h1>
            <h2 class="text-md text-neutral-500 md:mb-2">{{ redlistCount }} arter</h2>

          </div>

          <UButton color="neutral" variant="soft" size="xl" @click="$emit('enlarge')"
            :class="isNormalView ? 'hidden' : 'md:hidden'" :icon="isNormalView ? '' : 'i-heroicons-x-mark-solid'"
            trailing class="rounded-full" />



        </div>


      </div>
      <div class="md:flex gap-4 items-center  hidden">
        <UBadge v-if="!isNormalView" icon="lineicons:mushroom-1" size="lg" color="tertiary" variant="subtle"
          label="Enligt samlad kunskap, främst var fruktkroppar förekommer" class="h-fit hidden md:flex " />
        <UTabs v-if="!useMobileLayout" class="flex mt-2" v-model="activeTab" :items="items" variant="pill"
          color="neutral" size="md" :ui="{
            indicator: 'bg-white dark:bg-black border border-neutral-300/80 dark:border-neutral-300/30',
            trigger: 'data-[state=active]:text-neutral-700 dark:data-[state=active]:text-neutral-100/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral'
          }" />

        <UButton :label="isNormalView ? 'Visa mer' : 'Tillbaka till översikt'" color="neutral" variant="outline"
          size="md" @click="$emit('enlarge')" class="hidden md:flex " />
      </div>
    </div>
    <!-- Table vs. grid view -->
    <transition name="fade" mode="out-in" class="md:min-h-[260px]">
      <div v-if="isTableView">
        <SpeciesTable @enlarge="emit('enlarge')" :is-normal-view="isNormalView" dataType="redlisted"
          dataTypeFolder="redlisted" grupp="Svamp-grupp" mat="Nyasvamp-boken" obs="RankRed" obsLabel="Sannolikhet"
          :column-visibility-overrides="{ 'Nyasvamp-boken': false }" />
      </div>
      <div v-else>
        <SpeciesGrid :is-normal-view="isNormalView" dataType="redlisted" dataTypeFolder="redlisted" />
      </div>
    </transition>
  </UCard>
</template>

<script setup>
import { ref, computed, watch, defineEmits } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { useTabsStore } from "~/stores/tabsStore";
import { useEnvParamsStore } from '~/stores/envParamsStore';

const envStore = useEnvParamsStore();
const redlistCount = ref(0);

async function fetchCount(folder, type, countRef, filterKey = null) {
  const filename = `${type}-${envStore.geography}-${envStore.forestType}-${envStore.standAge}-${envStore.vegetationType}.json`;
  try {
    const res = await fetch(`/${folder}/${filename}`);
    if (!res.ok) throw new Error('Network response was not ok');
    const arr = await res.json();
    countRef.value = filterKey ? arr.filter(row => row[filterKey] === 'x').length : arr.length;
  } catch (err) {
    console.error('Failed to fetch count for', type, err);
    countRef.value = 0;
  }
}

// Refresh count when environment parameters change
watch(
  () => [envStore.geography, envStore.forestType, envStore.standAge, envStore.vegetationType],
  () => fetchCount('redlisted', 'redlisted', redlistCount),
  { immediate: true }
);

const emit = defineEmits(['enlarge']);

// Define the items for the tabs.
const items = [
  {
    label: "",
    icon: "i-heroicons-squares-2x2",
    value: "grid",
  },
  {
    label: "",
    icon: "material-symbols:table-outline",
    value: "table",
  },
];

// Import props if needed.
const props = defineProps({ isNormalView: Boolean });

// detect mobile screens (< md)
const isSmallScreen = useMediaQuery('(max-width: 767px)');
// Treat desktop normal view as mobile layout
const useMobileLayout = computed(() => isSmallScreen.value || props.isNormalView);

// Set up the store.
const tabsStore = useTabsStore();

// Bind the active tab for this component to the store.
const activeTab = computed({
  get: () => useMobileLayout.value ? 'table' : tabsStore.getActiveTab("FullscreenEdible"),
  set: (val) => {
    if (!useMobileLayout.value) {
      tabsStore.setActiveTab("FullscreenEdible", val);
    }
  }
});

// Compute if the table view should be active.
const isTableView = computed(() => activeTab.value === "table");
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