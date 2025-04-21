<template>
  <div>
    <!-- Header with title, filters, and view toggle -->
    <div class="flex justify-between">
      <div class="flex gap-4 ml-4">
        <h1 class="text-neutral-800 dark:text-neutral-300 text-3xl">
          Naturvårdsarter
        </h1>
        <UTabs
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
          class="h-fit"
        />
        <UButton
          color="neutral"
          variant="ghost"
          size="lg"
          :icon="isNormalView ? 'material-symbols:open-in-full' : 'material-symbols:close-fullscreen'"
          @click="$emit('enlarge')"
        />
      </div>
    </div>
    <!-- Table vs. grid view -->
    <transition name="fade" mode="out-in" class="min-h-[550px]">
    <div v-if="isTableView">
      <SpeciesTable
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
import { computed } from "vue";
import { useTabsStore } from "~/stores/tabsStore";

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

// Set up the store.
const tabsStore = useTabsStore();

// Bind the active tab for this component to the store.
const activeTab = computed({
  get: () => tabsStore.getActiveTab("RedlistedComponent"),
  set: (val) => tabsStore.setActiveTab("RedlistedComponent", val),
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