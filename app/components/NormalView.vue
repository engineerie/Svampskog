<template>
  <div class="grid grid-cols-12 ">
    <div class="col-span-12">
      <EnvImgInfo
        :geography="geography"
        :forestType="forestType"
        :standAge="standAge"
        :vegetationType="vegetationType"
      />
    </div>

    <div class="col-span-12">
      <div class="flex justify-end mb-2 sticky top-28 pt-2 z-10">
    <div  class="bg-white dark:bg-black rounded-xl">
          <UBadge
            size="lg"
            color="secondary"
            variant="subtle"
            icon="solar:dna-linear"
            label="Enligt DNA från markinventeringens provytor"
           class="h-full"
            />

    </div>
      
      </div>
      <!-- <USeparator class="mt-2 mb-6"/> -->

  

      <!-- Main content -->

        <EdnaComponent
          :isNormalView="true"
          @enlarge="emitEnlarge('FullScreenEdna')"
        />

   
    </div>


    <div class="col-span-12 ">
      <div class="flex justify-end  mb-2 sticky top-28 pt-2 z-10     ">
       
        <div  class="bg-white dark:bg-black rounded-xl z-10">
          <UBadge
            size="lg"
            color="tertiary"
            variant="subtle"
           icon="lineicons:mushroom-1"
           label="Enligt samlad kunskap, främst var fruktkroppar förekommer"
              class="h-full"
           />
      
     </div>
        
        <!-- <div class="flex items-center">
          <Icon
            name="heroicons:information-circle"
            class="size-6 text-neutral-400 hover:text-primary-500 cursor-pointer transition-all -ml-0 my-2 mr-3"
          />
        </div> -->
      </div>
      <!-- <USeparator /> -->

      <!-- <div
        class="rounded-3xl p-[1.5px] bg-gradient-to-tr from-amber-500 to-95%"
      >
        <div
          class="bg-white overflow-hidden rounded-tr-none rounded-[calc(1.5rem-1px)]"
        > -->
      <div
        class="col-span-12 grid grid-cols-12 rounded-2xl gap-y-10 "
      >
        <div class="col-span-12 flex flex-col">
          <RedlistedComponent
          :isNormalView="true"
          @enlarge="emitEnlarge('RedlistedComponent')"
        />
          <!-- <FullScreenRedlisted
            :geography="geography"
            :forestType="forestType"
            :standAge="standAge"
            :vegetationType="vegetationType"
            :isNormalView="true"
            @enlarge="emitEnlarge('FullScreenRedlisted')"
            :key="route.fullPath"
          /> -->
        </div>
        <div class="col-span-12 flex flex-col h-full">
          <FullScreenEdible
            :geography="geography"
            :forestType="forestType"
            :standAge="standAge"
            :vegetationType="vegetationType"
            :isNormalView="true"
            @enlarge="emitEnlarge('FullScreenEdible')"
            :key="route.fullPath"
          />
        </div>
        <div class="col-span-12 flex flex-col">
          <FullScreenPoison
            :geography="geography"
            :forestType="forestType"
            :standAge="standAge"
            :vegetationType="vegetationType"
            :isNormalView="true"
            @enlarge="emitEnlarge('FullScreenPoison')"
            :key="route.fullPath"
          />
        </div>
      </div>
      <!-- </div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import EdnaComponent from "./EdnaComponent.vue";
import { useRoute } from "vue-router";
import EnvImgInfo from "./EnvImgInfo.vue";
const route = useRoute();

// Define props
const props = defineProps({
  geography: String,
  forestType: String,
  standAge: String,
  vegetationType: String,
  isNormalView: Boolean,
});

console.log("isNormalView in parent:", props.isNormalView); // Log to check the prop value in the parent component

// Define emits
const emit = defineEmits(["enlarge"]);

const emitEnlarge = (componentName) => {
  emit("enlarge", componentName);
};
</script>

<style scoped>
.rounded-tab {
  --r: 0.8em;
  border-inline: var(--r) solid #0000;
  border-radius: calc(2 * var(--r)) calc(2 * var(--r)) 0 0 / var(--r);
  mask: radial-gradient(var(--r) at var(--r) 0, #0000 98%, #000 101%)
      calc(-1 * var(--r)) 100%/100% var(--r) repeat-x,
    conic-gradient(#000 0 0) padding-box;
}
.rounded-tab.left {
  border-left-width: 0;
  border-top-left-radius: var(--r);
}
.rounded-tab.right {
  border-right-width: 0;
  border-top-right-radius: var(--r);
}
</style>
