<template>
   <MySlideover
      v-model="showSlideover"
      :pinned="isPinned"
      @update:pinned="(val) => (isPinned = val)"
    >
      <SpeciesInfo
        :species="speciesStore.selectedSpecies"
        :source="speciesStore.sourceComponent"
      />
    </MySlideover>
   <div >
       <div class="flex justify-between items-center w-full">
        <!-- <UButton label="Välj miljö" class="h-fit"/>
        <UTabs
     v-model="activeTab"
     :items="items"
     variant="link"
     color="neutral"
     class="py-1 w-fit"
   /> -->
   <div class="flex items-center w-full my-2 gap-2">
  
  
 
     <UButton
       v-if="items.length"
       :label="items[3].label"
       :color="activeTab === items[3].value ? 'primary' : 'neutral'"
       variant="ghost"
       size="sm"
       @click="activeTab = items[3].value"
     />
     <div class="flex gap-2">
       <UButton
         v-for="item in items.slice(0, 3)"
         :key="item.value"
         :label="item.label"
         :color="activeTab === item.value ? 'primary' : 'neutral'"
         variant="ghost"
         size="sm"
         @click="activeTab = item.value"
       />
     </div>
   </div>
       </div>
       
       <UPage
         v-if="activeTab === 'komigang'"
       >
       <UPageHeader
       headline="Svampar"
    title="Guide"
    description="Information om hur du kan använda verktyget."
  />
      

         <div class="mt-4">
           <ul class="space-y-4">
             <li class="">
               Välj skogsmiljö genom att ange

               <Icon
                 name="material-symbols:location-on-outline"
                 class="size-5 text-fuchsia-500 -mb-1"
               />
               Var i Sverige (för närvarande begränsat till norr och söder),

               <Icon name="lucide:trees" class="size-5 text-green-500 -mb-1" />
               Skogstyp (vilka träd som dominerar),

               <Icon
                 name="carbon:crop-growth"
                 class="size-5 text-violet-500 -mb-1"
               />
               Beståndsålder (trädens ålder) och

               <Icon
                 name="fluent-emoji-high-contrast:herb"
                 class="size-5 text-teal-500 -mb-1"
               />
               Fältskikt (vilken vegetation som växer på marken).
             </li>
             <li>
               Klicka på respektive kategori för att göra dina val, eller
               använd knappen
               <div
                 class="inline-flex mx-1 items-center rounded-full ring-1 ring-neutral-200 w-fit text-sm py-1 pl-4 pr-3 gap-1 bg-neutral-50 text-neutral-950"
               >
                 <span>Visa kombinationsvy</span>
                 <Icon name="mdi:chevron-down" class="size-5" />
               </div>
               för att se alla alternativ som radioknappar.
               <!-- <UAlert
                 class="my-2"
                 icon="i-heroicons-information-circle"
                 color="warning"
                 variant="subtle"
                 title="Det är nödvändigt att göra val i alla kategorier."
               /> -->
             </li>
             <li class="">
               Du kan också klicka på
               <div
                 class="inline-flex mx-1 items-center rounded-full ring-1 ring-neutral-200 w-fit text-sm py-1 pl-4 pr-3 gap-1 bg-neutral-50 text-neutral-950"
               >
                 <span>Markinventeringsdata</span>
                 <Icon name="mdi:lock-open" class="size-4" />
               </div>
               för att begränsa urvalet till miljöer där det finns data från
               markinventeringen.
               <!-- <UAlert
                 class="my-2"
                 icon="i-heroicons-light-bulb"
                 color="success"
                 variant="subtle"
                 title="Om val är inaktiverade kan det hjälpa att avvmarkera redan gjorda val."
               /> -->
             </li>
           </ul>
         </div>
       </UPage>

       <div
         v-else-if="activeTab === 'miljo'"
        
       >
       <UPageHeader
       headline="Svampar"
    title="Miljöinformation"
    description="Definitationer och bilder på de olika miljöerna."
  />
         <div class="space-y-6 mt-4">
           <div>
             <h1 size="lg" weight="light" class="mb-2">Var i Sverige</h1>
             <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
               <div
                 v-for="option in geographyOptions"
                 class="cursor-pointer rounded-xl overflow-hidden border border-neutral-200"
                 @click="openModal(option)"
               >
                 <div
                   class="bg-gray-200 h-40 rounded-lg flex items-center justify-center"
                 >
                   <div
                     class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700"
                   >
                     <Icon
                       name="material-symbols:photo"
                       class="w-8 h-8 text-neutral-500"
                     />
                   </div>
                 </div>
                 <div class="p-2 text-md font-medium text-neutral-600">
                   {{ option.label }}
                 </div>
               </div>
             </div>
           </div>
           <div>
             <h1 size="lg" weight="light" class="mb-2">Skogstyp</h1>
             <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
               <div
                 v-for="option in forestTypeOptions"
                 class="cursor-pointer rounded-xl overflow-hidden border border-neutral-200"
                 @click="openModal(option)"
               >
                 <div
                   class="bg-gray-200 h-40 rounded-lg flex items-center justify-center"
                 >
                   <div
                     class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700"
                   >
                     <Icon
                       name="material-symbols:photo"
                       class="w-8 h-8 text-neutral-500"
                     />
                   </div>
                 </div>
                 <div class="p-2 text-md font-medium text-neutral-600">
                   {{ option.label }}
                 </div>
               </div>
             </div>
           </div>
           <div>
             <h1 size="lg" weight="light" class="mb-2">Beståndsålder</h1>
             <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
               <div
                 v-for="option in standAgeOptions"
                 class="cursor-pointer rounded-xl overflow-hidden border border-neutral-200"
                 @click="openModal(option)"
               >
                 <div
                   class="bg-gray-200 h-40 rounded-lg flex items-center justify-center"
                 >
                   <div
                     class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700"
                   >
                     <Icon
                       name="material-symbols:photo"
                       class="w-8 h-8 text-neutral-500"
                     />
                   </div>
                 </div>
                 <div class="p-2 text-md font-medium text-neutral-600">
                   {{ option.label }}
                 </div>
               </div>
             </div>
           </div>
           <div>
             <h1 size="lg" weight="light" class="mb-2">Fältskikt</h1>
             <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
               <div
                 v-for="option in vegetationTypeOptions"
                 class="cursor-pointer rounded-xl overflow-hidden border border-neutral-200"
                 @click="openModal(option)"
               >
                 <div
                   class="bg-gray-200 h-40 rounded-lg flex items-center justify-center"
                 >
                   <div
                     class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700"
                   >
                     <Icon
                       name="material-symbols:photo"
                       class="w-8 h-8 text-neutral-500"
                     />
                   </div>
                 </div>
                 <div class="p-2 text-md font-medium text-neutral-600">
                   {{ option.label }}
                 </div>
               </div>
             </div>
           </div>
         </div>
     
       </div>

       <div
         v-else-if="activeTab === 'dataunderlag'"
        
       >
       <UPageHeader
       headline="Svampar"
    title="Dataunderlag"
    description="Information om var dataunderlaget kommer ifrån."
  />
         <div
           class="grid grid-cols-1 md:grid-cols-2 md:gap-32 gap-16 mx-6 mt-12"
         >
           <LandingDNA />
           <LandingSamladKunskap />
         </div>
       </div>
       <div  v-else-if="activeTab === 'dashboard'">
    <EnvironmentSelector />
   
      <transition name="fade" mode="out-in">
        <component
          :is="activeComponent"
          @close="handleCloseFullScreen"
          @enlarge="handleFullScreen"
        />
      </transition>
   
  </div>
     </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import MySlideover from "./MySlideover.vue";
import FullScreenPoison from "./FullScreenPoison.vue";
import FullScreenEdible from "./FullScreenEdible.vue";
import RedlistedComponent from "./RedlistedComponent.vue";
import NormalView from "./NormalView.vue"; // Component for the normal view
import StartView from "./StartView.vue"; // Component for the normal view

import { useEnvParamsStore } from "~/stores/envParamsStore";

import { useSpeciesStore } from "~/stores/speciesStore";
import EdnaComponent from "./EdnaComponent.vue";


const activeTab = ref("dashboard");

const items = [
  { label: "Guide", value: "komigang" },
  { label: "Miljöinformation", value: "miljo" },
  { label: "Dataunderlag", value: "dataunderlag" },
  { label: "Svampar", value: "dashboard" },
];

const speciesStore = useSpeciesStore();
const envParamsStore = useEnvParamsStore();

const route = useRoute();

const showSlideover = ref(false);
const isPinned = ref(true);

// Toggle the slideover panel (e.g. for SpeciesInfo)
// function toggleSlideover() {
//   showSlideover.value = !showSlideover.value;
// }

// Open the slideover automatically when a species is selected
watch(
  () => speciesStore.selectedSpecies,
  (newVal) => {
    if (newVal) {
      showSlideover.value = true;
    }
  }
);

// A ref to track if a full-screen view is active
const activeFullScreenComponent = ref(null);

// A computed property to check if all required environment parameters are provided
const hasAllParams = computed(() => {
  return envParamsStore.geography &&
         envParamsStore.forestType &&
         envParamsStore.standAge &&
         envParamsStore.vegetationType;
});

// The active component is chosen based on the route parameters and any full-screen state:
// - If not all parameters are provided, we show StartView.
// - If all parameters are provided, we use the full-screen component if one is active,
//   or fall back to NormalView.
const activeComponent = computed(() => {
  if (!hasAllParams.value) {
    return StartView;
  }
  switch (activeFullScreenComponent.value) {
    case "FullScreenEdna":
      return EdnaComponent;
    case "FullScreenEdible":
      return FullScreenEdible;
    case "FullScreenPoison":
      return FullScreenPoison;
    case "RedlistedComponent":
      return RedlistedComponent;
    default:
      return NormalView;
  }
});

// Handlers for toggling full-screen view states
const handleFullScreen = (componentName) => {
  activeFullScreenComponent.value = componentName;
};

const handleCloseFullScreen = () => {
  activeFullScreenComponent.value = null;
};

// Optional: handle the Esc key to clear a species selection or close modals
const handleKeydown = (event) => {
  if (event.key === "Escape" && speciesStore.selectedSpecies) {
    speciesStore.clearSelection();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);

  // Initialize the environment parameters store from the current route
  envParamsStore.setParams({
    geography: route.params.geography,
    forestType: route.params.forestType,
    standAge: route.params.standAge,
    vegetationType: route.params.vegetationType,
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});

// Watch for changes in route parameters to update the environment parameters store
watch(
  () => route.params,
  (newParams) => {
    envParamsStore.setParams({
      geography: newParams.geography || '',
      forestType: newParams.forestType || '',
      standAge: newParams.standAge || '',
      vegetationType: newParams.vegetationType || '',
    });
  },
  { immediate: true }
);

// Watch for changes in environment parameters to update the URL
watch(
  () => [
    envParamsStore.geography,
    envParamsStore.forestType,
    envParamsStore.standAge,
    envParamsStore.vegetationType
  ],
  () => {
    if (
      envParamsStore.geography &&
      envParamsStore.forestType &&
      envParamsStore.standAge &&
      envParamsStore.vegetationType
    ) {
      const newPath = `/mykorrhizasvampar/${encodeURIComponent(envParamsStore.geography)}/${encodeURIComponent(envParamsStore.forestType)}/${encodeURIComponent(envParamsStore.standAge)}/${encodeURIComponent(envParamsStore.vegetationType)}`;
      if (window.location.pathname !== newPath) {
        window.history.replaceState(null, '', newPath);
      }
    } else {
      if (window.location.pathname !== '/') {
        window.history.replaceState(null, '', '/');
      }
    }
  },
  { deep: true }
);
</script>

<style scoped>
/* Fade transition for view changes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
