<template>
  <div class="grid grid-cols-12 sm:gap-4">
    <div class="col-span-12  sm:col-span-5 sm:flex">
      <div class="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
        <SpatialForest />
        <div class="flex absolute bottom-0 justify-between w-full p-2 items-end">
          <h1 class="text-neutral-400 text-xs ">
            Figuren visar hur mycelutbredningar kan se ut.
          </h1>
        </div>
        <!-- Clicking this icon opens the modal -->
        <UModal>
          <Icon name="heroicons:question-mark-circle"
            class="size-6 text-neutral-400 absolute bottom-2 right-2 hover:text-primary-500 cursor-pointer transition-all" />
          <template #content>
            <UCard>
              <!-- <template #header>
                <div class="flex justify-between items-center">
                  <h1 size="xl" weight="light">Skogsbild</h1>
                  <Icon @click="isForestModalOpen = false" name="heroicons:x-mark" class="size-5 cursor-pointer" />
                </div>
              </template> -->

              <div class="">
                <div class="rounded-xl overflow-hidden">
                  <SpatialForest />
                </div>
                <div class="mt-2 sm:mt-4 text-md text-neutral-500">
                  Bilden visar förenklat hur mycel av olika arter och individer bildar ett komplext lapptäcke i
                  skogsmark. Olika arter
                  har olika färger. Storlekar visar utbredningen av olika mycel, ofta någon kvadratmeter stora. På
                  rötterna av äldre
                  träd växer 50 - 100 olika arter och i uppvuxen skog i storleksordningen 200 olika arter. </div>
              </div>
            </UCard>
          </template>

        </UModal>

      </div>
    </div>
    <div class="col-span-12  sm:col-span-7 ">

      <!-- <SpeciesRichness class="col-span-4"/> -->


      <EnvInfo/>

    </div>
  </div>

  <!-- Modal for SpatialForest -->

</template>

<script setup>
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
