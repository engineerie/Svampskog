<template>
    <div>
      <!-- Header with title, filters and view toggle -->
      <div class="flex justify-between">
        <div class="flex gap-4 ml-4">
          <!-- <UIcon
            name="material-symbols:award-star-outline"
            class="h-10 w-10 text-signal-500 ml-4"
          /> -->
          <h1 class="text-neutral-800 dark:text-neutral-300 text-3xl">
            Naturvårdsarter
          </h1>
          <UTabs
        v-model="activeTab"
        :items="items"
        variant="link"
        color="neutral"
      />
      <div class="flex gap-4 items-end pb-2">
        <UBadge
          v-if="!isNormalView"
          icon="lineicons:mushroom-1"
          size="lg"
          color="tertiary"
          variant="subtle"
          label="Enligt samlad kunskap, främst var fruktkroppar förekommer"
          class="h-fit"
        />
      </div>
        </div>
        <div class="flex gap-2 items-end mb-2">
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
        <div v-if="isTableView">
            <SpeciesTable :is-normal-view="isNormalView" dataType="redlisted" dataTypeFolder="redlisted" grupp="Svamp-grupp" mat="Nyasvamp-boken" obs="RankRed" obsLabel="Antal fynd"   :column-visibility-overrides="{ 'Nyasvamp-boken': false }" 
            />
        </div>
        <div v-else>
          <SpeciesGrid :is-normal-view="isNormalView" dataType="redlisted" dataTypeFolder="redlisted"/>
        </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed} from "vue";

  
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
  

  const activeTab = ref("grid");
  const isTableView = computed(() => activeTab.value === "table");
  
  const props = defineProps({ isNormalView: Boolean });
 
  </script>
  

  