<template>
  <div>
    <!-- Header with title, filters and view toggle -->
    <div class="md:flex justify-between">
      <div class="md:flex gap-4">
        <!-- <UIcon
          name="icon-park-solid:knife-fork"
          class="h-10 w-10 text-warning-500 ml-4"
        /> -->
        <div class="w-full flex justify-between">
 <h1 @click="$emit('enlarge')" class="text-yellow-500 dark:text-neutral-300 text-2xl md:text-3xl">
          Matsvampar
        </h1>
        <UButton
        :label="isNormalView ? '' : 'Gå tillbaka'"
      color="neutral"
      variant="soft"
        size="lg"
        @click="$emit('enlarge')"
        :class="isNormalView ? 'hidden' : 'md:hidden'"
        :icon="isNormalView ? '' : 'i-heroicons-arrow-uturn-left-solid'"
        trailing
      />

        </div>
       
        <UTabs
      v-model="activeTab"
      :items="items"
      variant="link"
      color="neutral"
      class="md:flex hidden"
    />
    
      </div>
      <div class="flex gap-2 items-center justify-end pb-2">
      <UBadge
        v-if="!isNormalView"
        icon="lineicons:mushroom-1"
        size="lg"
        color="tertiary"
        variant="subtle"
        label="Enligt samlad kunskap, främst var fruktkroppar förekommer"
        class="h-fit hidden md:flex"
      />
      <UButton
      color="neutral"
      variant="ghost"
        size="lg"
        :icon="isNormalView ? 'material-symbols:open-in-full' : 'material-symbols:close-fullscreen'"
        @click="$emit('enlarge')"
        class="hidden md:flex"  
      />
    </div>
      <!-- <div class="flex gap-2 items-end mb-2">
       
      </div> -->
    </div>
      <!-- TABLE VIEW -->
      <transition name="fade" mode="out-in" class="md:min-h-[260px]">

      <div v-if="isTableView">
          <SpeciesTable @enlarge="emit('enlarge')" :is-normal-view="isNormalView" dataType="edibledata" dataTypeFolder="edible" grupp="Svamp-grupp" mat="Nyasvamp-boken" obs="Rank matsvamp" obsLabel="Antal fynd" :filterEdible="true"  :column-visibility-overrides="{ 'mark': false }" 
          />
      </div>
      <div v-else>
        <SpeciesGrid :is-normal-view="isNormalView" dataType="edibledata" dataTypeFolder="edible" :filterEdible="true"/>
      </div>
      </transition>
  </div>
</template>

<script setup>
import { computed, defineEmits } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { useTabsStore } from '~/stores/tabsStore';

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

const activeTab = computed({
  get: () => isSmallScreen.value ? 'table' : tabsStore.getActiveTab("FullscreenEdible"),
  set: (val) => {
    if (!isSmallScreen.value) {
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