<template>
  <UCard variant="ghost" class="rounded-none sm:rounded-none border-muted/50">
    <!-- Header with title, filters and view toggle -->
    <div class="md:flex justify-between items-start">
      <div class="md:flex gap-4">
        <div class="w-full flex justify-between items-start">

          <div>

            <h1 @click="$emit('enlarge')"
              class="text-lime-500 dark:text-neutral-300 text-4xl font-bold md:font-medium md:text-3xl cursor-default ">
              Giftsvampar
            </h1>
            <h2 class="text-md text-neutral-500 md:mb-2">{{ poisonCount }} arter</h2>
          </div>

          <UButton color="neutral" variant="soft" size="xl" @click="$emit('enlarge')"
            :class="isNormalView ? 'hidden' : 'md:hidden'" :icon="isNormalView ? '' : 'i-heroicons-x-mark-solid'"
            trailing class="rounded-full" />


        </div>


      </div>
      <div class="md:flex gap-4 items-center  hidden">
        <UBadge v-if="!isNormalView" icon="lineicons:mushroom-1" size="lg" color="tertiary" variant="subtle"
          label="Enligt samlad kunskap, främst var fruktkroppar förekommer" class="h-fit hidden md:flex" />
        <UTabs v-if="!useMobileLayout" class="flex mt-2" v-model="activeTab" :items="items" variant="pill"
          color="neutral" size="md" :ui="{
            indicator: 'bg-white dark:bg-black border border-neutral-300/80 dark:border-neutral-300/30',
            trigger: 'data-[state=active]:text-neutral-700 dark:data-[state=active]:text-neutral-100/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral'
          }" />
        <UButton :label="isNormalView ? 'Visa mer' : 'Tillbaka till översikt'" color="neutral" variant="outline"
          size="sm" @click="$emit('enlarge')" class="hidden md:flex ring-muted/60" />
      </div>
    </div>
    <!-- TABLE VIEW -->
    <transition name="fade" mode="out-in" class="md:min-h-[260px]">

      <div v-if="isTableView">
        <SpeciesTable @enlarge="emit('enlarge')" :is-normal-view="isNormalView" dataType="edibledata"
          dataTypeFolder="edible" grupp="Svamp-grupp" mat="Nyasvamp-boken" obs="Rank giftsvamp" obsLabel="Sannolikhet"
          :filterPoison="true" :column-visibility-overrides="{ 'mark': false, 'Nyasvamp-boken': false }" />
      </div>
      <div v-else>
        <SpeciesGrid :is-normal-view="isNormalView" dataType="edibledata" dataTypeFolder="edible"
          :filterPoison="true" />
      </div>
    </transition>
  </UCard>
</template>

<script setup>
import { ref, computed, watch, defineEmits } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { useTabsStore } from '~/stores/tabsStore';
import { useEnvParamsStore } from '~/stores/envParamsStore';

const envStore = useEnvParamsStore();
const poisonCount = ref(0);

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
  } catch {
    countRef.value = 0;
  }
}

watch(
  () => [envStore.geography, envStore.forestType, envStore.standAge, envStore.vegetationType],
  () => fetchCount('edible', 'edibledata', poisonCount, 'Giftsvamp'),
  { immediate: true }
);

const emit = defineEmits(['enlarge']);

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
