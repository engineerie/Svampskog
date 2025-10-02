<template>
  <div>
    <UCard variant="ghost" class="rounded-none sm:rounded-lg">
      <!-- Header with title, filters and view toggle -->
      <div class="md:flex justify-between items-start ">
        <div class="w-full flex justify-between items-start ">
          <div>
            <div @click="$emit('enlarge')"
              class="group cursor-pointer dark:text-neutral-300 text-4xl md:text-3xl font-medium flex items-center">
              <UIcon name="icon-park-solid:knife-fork" class="mr-2" />
              <h1>
                Matsvampar
              </h1>
              <UIcon name="i-lucide-arrow-right"
                class="size-6 font-medium text-neutral transition-all opacity-0 group-hover:translate-x-1 group-hover:opacity-100" />
            </div>
            <h2 class="text-md text-neutral-500 md:mb-2">{{ edibleCount }} arter</h2>
          </div>
          <UButton color="neutral" variant="soft" size="xl" @click="$emit('enlarge')"
            :class="isNormalView ? 'hidden' : 'md:hidden'" :icon="isNormalView ? '' : 'i-heroicons-x-mark-solid'"
            class="rounded-full" />
        </div>
        <div class="md:flex gap-1 items-center  hidden">
          <UTabs v-if="!useMobileLayout" class="flex mt-2" v-model="activeTab" :items="items" variant="pill"
            color="neutral" size="md" :ui="{
              list: 'bg-transparent',
              indicator: 'bg-white dark:bg-black border border-neutral-300/80 dark:border-neutral-300/30',
              trigger: 'data-[state=active]:text-neutral-700 dark:data-[state=active]:text-neutral-100/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral'
            }" />
          <!-- <UButton :label="isNormalView ? 'Visa mer' : 'Tillbaka till översikt'" color="neutral" variant="outline"
            size="sm" @click="$emit('enlarge')" class="hidden md:flex ring-muted/60" /> -->
        </div>
        <!-- <div class="flex gap-2 items-end mb-2">
       
      </div> -->
      </div>
      <!-- TABLE VIEW -->
      <transition name="fade" mode="out-in" class="md:min-h-[260px]">
        <div v-if="isTableView">
          <SpeciesTable @enlarge="emit('enlarge')" :is-normal-view="isNormalView" dataType="edibledata"
            dataTypeFolder="edible" grupp="Svamp-grupp" mat="Nyasvamp-boken" obs="Rank matsvamp" obsLabel="Sannolikhet"
            :filterEdible="true" :column-visibility-overrides="{ 'mark': false, 'Nyasvamp-boken': false }" />
        </div>
        <div v-else>
          <SpeciesGrid :is-normal-view="isNormalView" dataType="edibledata" dataTypeFolder="edible"
            :filterEdible="true" />
        </div>
      </transition>
    </UCard>
  </div>

</template>

<script setup>
import { ref, computed, watch, defineEmits } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { useTabsStore } from '~/stores/tabsStore';
import { useEnvParamsStore } from '~/stores/envParamsStore';

const envStore = useEnvParamsStore();
const edibleCount = ref(0);

async function fetchCount(folder, type, countRef, filterKey = null) {
  const params = [envStore.geography, envStore.forestType, envStore.standAge, envStore.vegetationType]
  if (params.some(param => !param)) {
    countRef.value = 0
    return
  }
  const filename = `${type}-${envStore.geography}-${envStore.forestType}-${envStore.standAge}-${envStore.vegetationType}.json`;
  try {
    const res = await fetch(`/${folder}/${filename}`);
    if (!res.ok) throw new Error('Network response was not ok');
    const arr = await res.json();
    countRef.value = filterKey
      ? arr.filter(row => row[filterKey] === 'x').length
      : arr.length;
  } catch (err) {
    console.error('Failed to fetch edible count', err);
    countRef.value = 0;
  }
}

watch(
  () => [envStore.geography, envStore.forestType, envStore.standAge, envStore.vegetationType],
  () => fetchCount('edible', 'edibledata', edibleCount, 'Nyasvamp-boken'),
  { immediate: true }
);

const emit = defineEmits(['enlarge']);


const items = [
  {
    label: "Galleri",
    icon: "i-heroicons-squares-2x2",
    value: "grid",
  },
  {
    label: "Tabell",
    icon: "material-symbols:table-outline",
    value: "table",
  },
];

const tabsStore = useTabsStore();
const props = defineProps({ isNormalView: Boolean });

// detect mobile screens (< md)
const isSmallScreen = useMediaQuery('(max-width: 767px)');
// Treat desktop normal view as mobile layout
const useMobileLayout = computed(() => isSmallScreen.value || props.isNormalView);

const activeTab = computed({
  get: () => useMobileLayout.value ? 'table' : tabsStore.getActiveTab("FullscreenEdible"),
  set: (val) => {
    if (!useMobileLayout.value) {
      tabsStore.setActiveTab("FullscreenEdible", val);
    }
  }
});
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
