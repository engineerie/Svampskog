<template>
  <div>
    <!-- Header with title, filters, and view toggle -->
    <div class="md:flex justify-between">
      <div class="md:flex gap-4">
        <div class="w-full flex justify-between">
  <h1         @click="$emit('enlarge')"
   class="text-teal-500 text-2xl md:text-3xl">
          Naturvårdsarter
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
        class="hidden md:flex"
          v-model="activeTab"
          :items="items"
          variant="link"
          color="neutral"
        />
      </div>
      <div class="flex gap-2 items-center mb-2">
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
          class="hidden md:flex"        />
      </div>
    </div>
    <!-- Table vs. grid view -->
    <transition name="fade" mode="out-in" class="md:min-h-[260px]">
    <div v-if="isTableView">
      <SpeciesTable
      @enlarge="emit('enlarge')"
        :is-normal-view="isNormalView"
        dataType="redlisted"
        dataTypeFolder="redlisted"
        grupp="Svamp-grupp"
        mat="Nyasvamp-boken"
        obs="RankRed"
        obsLabel="Antal fynd"
        :column-visibility-overrides="{ 'Nyasvamp-boken': false }"
      />
    </div>
    <div v-else>
      <SpeciesGrid :is-normal-view="isNormalView" dataType="redlisted" dataTypeFolder="redlisted" />
    </div>
  </transition>
  </div>
</template>

<script setup>
import { computed, defineEmits } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { useTabsStore } from "~/stores/tabsStore";

const emit = defineEmits(['enlarge']);

// Define the items for the tabs.
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

// Import props if needed.
const props = defineProps({ isNormalView: Boolean });

// detect mobile screens (< md)
const isSmallScreen = useMediaQuery('(max-width: 767px)');

// Set up the store.
const tabsStore = useTabsStore();

// Bind the active tab for this component to the store.
const activeTab = computed({
  get: () => isSmallScreen.value ? 'table' : tabsStore.getActiveTab("RedlistedComponent"),
  set: (val) => {
    if (!isSmallScreen.value) {
      tabsStore.setActiveTab("RedlistedComponent", val);
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