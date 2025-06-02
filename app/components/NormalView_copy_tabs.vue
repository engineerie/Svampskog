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

    <div class="col-span-12 pt-2">
      
      <UTabs :items="items" variant="link" class="gap-4 w-full"  
     
  >
        <template #edna="{ item }">
          <EdnaComponent
            class="mb-8"
            :isNormalView="true"
            @enlarge="emitEnlarge('FullScreenEdna')"
          />
        </template>
        <template #others="{ item }">
          <div class="grid grid-cols-12 rounded-2xl gap-y-10">
            <div class="col-span-12 flex flex-col">
              <RedlistedComponent
                :isNormalView="true"
                @enlarge="emitEnlarge('RedlistedComponent')"
              />
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
        </template>
      </UTabs>
    </div>

  </div>
</template>

<script setup>
import EdnaComponent from "./EdnaComponent.vue";
import { ref } from "vue";
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

// State to toggle Edna vs others
const EdnaVisible = ref(true);

console.log("isNormalView in parent:", props.isNormalView); // Log to check the prop value in the parent component

// Define emits
const emit = defineEmits(["enlarge"]);

const emitEnlarge = (componentName) => {
  emit("enlarge", componentName);
};

const items = [
  { label: 'Enligt DNA från markinventeringens provytor', icon: 'i-solar:dna-linear', slot: 'edna' },
  { label: 'Enligt samlad kunskap, främst var fruktkroppar förekommer', icon: 'i-lineicons:mushroom-1', slot: 'others' }
] 
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
