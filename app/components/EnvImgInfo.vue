<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12  sm:col-span-4 sm:flex">
      <div class="relative rounded-2xl overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50">
        <SpatialForest />
        <div class="flex absolute bottom-0 justify-between w-full p-2 items-end">
          <h1 class="text-neutral-400 text-xs ">
            Figuren visar hur mycelutbredningar kan se ut.
          </h1>
        </div>
        <!-- Clicking this icon opens the modal -->
        <UModal :fullscreen="isSmallScreen" title="Mycelutbredning">
          <Icon name="heroicons:question-mark-circle"
            class="size-6 text-neutral-400 absolute bottom-2 right-2 hover:text-primary-500 cursor-pointer transition-all" />
          <template #body>
      
         
                <div class="rounded-xl overflow-hidden">
                  <SpatialForest />
                </div>
                <div class="mt-2 sm:mt-4 text-md text-neutral-500">
                  Bilden visar förenklat hur mycel av olika arter och individer bildar ett komplext lapptäcke i
                  skogsmark. Olika arter
                  har olika färger. Storlekar visar utbredningen av olika mycel, ofta någon kvadratmeter stora. På
                  rötterna av äldre
                  träd växer 50 - 100 olika arter och i uppvuxen skog i storleksordningen 200 olika arter. </div>
              
          </template>

        </UModal>

      </div>
    </div>
    <div class="col-span-12  sm:col-span-8">

      <!-- <SpeciesRichness class="col-span-4"/> -->


      <EnvInfo />

    </div>
  </div>

  <!-- Modal for SpatialForest -->

</template>

<script setup>
import { useMediaQuery } from '@vueuse/core'

const isSmallScreen = useMediaQuery('(max-width: 767px)')

// import { ref } from "vue";

// Create a reactive variable to control the modal's visibility
// const isForestModalOpen = ref(false);

// // Function to open a modal based on type
// function openModal(type) {
//   if (type === "ForestImg") {
//     isForestModalOpen.value = true;
//   }
// }
</script>
