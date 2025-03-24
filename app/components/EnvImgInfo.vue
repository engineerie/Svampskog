<template>
  <div
    class="grid grid-cols-12 gap-4"
  >
    <div class="col-span-5 flex">
      <div
        class="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700"
      >
        <SpatialForest />
        <div
          class="flex absolute bottom-0 justify-between w-full p-2 items-end"
        >
          <h1
           
          
            class="text-neutral-400 text-xs "
          >
            Figuren visar hur mycelutbredningar kan se ut.
          </h1>
        </div>
        <!-- Clicking this icon opens the modal -->
        <Icon
          @click="openModal('ForestImg')"
          name="heroicons:question-mark-circle"
          class="size-6 text-neutral-400 absolute bottom-2 right-2 hover:text-primary-500 cursor-pointer transition-all"
        />
      </div>
    </div>
    <div class="col-span-7 grid grid-cols-12 gap-4">
      
   <SpeciesRichness class="col-span-4"/>
   
   
        <EnvInfo class="col-span-8" />
   
    </div>
  </div>

  <!-- Modal for SpatialForest -->
  <!-- <UModal v-model="isForestModalOpen">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h1 size="xl" weight="light">Skogsbild</h1>
          <Icon
            @click="isForestModalOpen = false"
            name="heroicons:x-mark"
            class="size-5 cursor-pointer"
          />
        </div>
      </template>

      <div class="">
        <SpatialForest />
        <div class="mt-2 text-sm text-gray-600">
          More forest modal info goes here.
        </div>
      </div>
    </UCard>
  </UModal> -->
</template>

<script setup>
import { ref } from "vue";

// Create a reactive variable to control the modal's visibility
const isForestModalOpen = ref(false);

// Function to open a modal based on type
function openModal(type) {
  if (type === "ForestImg") {
    isForestModalOpen.value = true;
  }
}
</script>
