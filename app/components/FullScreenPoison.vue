<template>
  <div>
    <!-- Header with title, filters and view toggle -->
    <div class="flex justify-between">
      <div class="flex gap-4 ml-4">
        <!-- <UIcon
          name="hugeicons:danger"
          class="h-10 w-10 text-poison-500 ml-4"
        /> -->
        <h1 class="text-neutral-800 dark:text-neutral-300 text-3xl">
          Giftsvampar
        </h1>
        <UTabs
      v-model="activeTab"
      :items="items"
      variant="link"
      color="neutral"
    />
    <div class="flex gap-4 items-end pb-2">
 
    </div>
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
      <!-- TABLE VIEW -->
      <transition name="fade" mode="out-in" class="min-h-[550px]">

      <div v-if="isTableView">
          <SpeciesTable :is-normal-view="isNormalView" dataType="edibledata" dataTypeFolder="edible" grupp="Svamp-grupp" mat="Nyasvamp-boken" obs="Rank giftsvamp" obsLabel="Antal fynd" :filterPoison="true"  :column-visibility-overrides="{ 'mark': false }" 
          />
      </div>
      <div v-else>
        <SpeciesGrid :is-normal-view="isNormalView" dataType="edibledata" dataTypeFolder="edible" :filterPoison="true"/>
      </div>
      </transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useTabsStore } from '~/stores/tabsStore';

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
const activeTab = computed({
  get: () => tabsStore.getActiveTab("FullscreenPoison"),
  set: (val) => tabsStore.setActiveTab("FullscreenPoison", val),
});
const isTableView = computed(() => activeTab.value === "table");

const props = defineProps({ isNormalView: Boolean });

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