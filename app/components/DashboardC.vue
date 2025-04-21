<template>
    <div class="hidden">
    <NuxtImg v-for="(src, key) in imageMap" :key="key" :src="src" width="600" height="420" quality="80" format="webp" preload />
  </div>
  <MySlideover v-model="showSlideover" :pinned="isPinned" @update:pinned="(val) => (isPinned = val)">
    <SpeciesInfo :species="speciesStore.selectedSpecies" :source="speciesStore.sourceComponent" />
  </MySlideover>

  <UContainer>
  <div>
    <div class="flex justify-between items-center w-full">
      <!-- <UButton label="Välj miljö" class="h-fit"/>
        <UTabs
     v-model="activeTab"
     :items="items"
     variant="link"
     color="neutral"
     class="py-1 w-fit"
   /> -->
  <!-- Buttons for medium and larger screens -->
  <div class="hidden sm:flex flex-wrap items-center w-full mt-2 gap-2">
    <UButton
    v-for="item in items"
    :key="item.value"
    :label="item.label"
    :color="activeTab === item.value ? 'primary' : 'neutral'"
    variant="ghost"
    size="sm"
    @click="activeTab = item.value"
  />
  </div>

  <!-- USelect for small screens with full width -->
  <div class="block sm:hidden mt-2 w-full">
    <USelect v-model="activeTab" :items="items" option-label="label" option-value="value" class="w-full" />
  </div>
    </div>

    <div v-if="activeTab === 'komigang'">
      <UPage>
 
 <template #left> <div></div></template>
 <template #right> <div><div class="text-neutral-500 mt-6 pr-4"> Ett öppet <NuxtLink class="text-primary-500" to="https://www.slu.se/fakulteter/s/samverkan/livslangt-larande/" target="blank">webbinarium</NuxtLink> om att använda Svampskog hålls den 23 april och fler tillfällen planeras till hösten.
 </div></div></template>
      <UPageHeader headline="Svampar" title="Manual" description="Information om hur du kan använda verktyget." />

     </UPage>
<UPage>


  <template #left> <div></div></template>
      <template #right> <div></div></template>

      <template>

</template>
      <ContentRenderer
        v-if="page"
        :value="page"
      />
</UPage>

     
    </div>

    <div v-else-if="activeTab === 'miljo'">
      <UPageHeader headline="Svampar" title="Miljöinformation"
        description="Definitationer och bilder på de olika miljöerna." />
      <Miljoinformation />

    </div>

    <div v-else-if="activeTab === 'dataunderlag'">
      <UPage>
 
 <template #left> <div></div></template>
 <template #right> <div></div></template>
      <UPageHeader headline="Svampar" title="Dokumentation"
      description="Information om innehållet och var det kommer ifrån." />
      </UPage>
<UPage>
 
  <template #left> <div><div class="text-neutral-500 mt-6">Text: Anders Dahlberg <br/> 9 april 2025</div></div></template>
  <template #right> <div></div></template>
  
      <div class="mt-6">
        <DokumentationSvampar />
        <!-- <LandingDNA />
        <LandingSamladKunskap /> -->
      </div>
</UPage>


    
    </div>
    <div v-else-if="activeTab === 'dashboard'">
    <UMain>
      <transition name="fade" mode="out-in">
        <div v-if="!showEnvironmentSelector" key="header-view">
          <UPage class="header-container">
            <template #left><div></div> </template>
            <template #right><div></div></template>
            <div>
              <UPageHeader
              headline="Svampar"
              title="Arter i olika miljöer"
              description="Här kan du söka på svenska skogsmiljöer för att se vilka mykorrhizasvampar som kan finnas i marken baserat på DNA-analyser av svampmycel i markprover samt vår samlade kunskap om var olika arters fruktkroppar förekommer."
              />
            <div class="mt-4">
              <UButton label="Välj miljö" @click="showEnvironmentSelector = true" />
            </div>
            </div>
            
          </UPage>
        </div>

        <div v-else key="selector-view">
          <EnvironmentSelector class="block" />
        </div>
      </transition>

      <transition name="fade" mode="out-in">
        <component
          :is="activeComponent"
          @close="handleCloseFullScreen"
          @enlarge="handleFullScreen"
          class="hidden sm:block"
        />
      </transition>
    </UMain>
  </div>
  </div>
</UContainer>
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
import { imageMap } from '~/stores/envParamsStore'
const route = useRoute();

// inside <script setup> before your useAsyncData call:
const allDocs = await queryCollection('mushroomInfo').all()
console.log('🍄 mushroomInfo docs:', allDocs)

// Fetch the manual markdown from the mushroomInfo collection
const { data: page } = await useAsyncData('manual-doc', () =>
  queryCollection('mushroomInfo')
       .path('/mushroom/manual')
    .first()
)


const activeTab = ref("dashboard");

const items = [
{ label: "Arter i olika miljöer", value: "dashboard" },
{ label: "Miljöinformation", value: "miljo" },
  { label: "Manual", value: "komigang" },
  { label: "Dokumentation", value: "dataunderlag" },
];

const speciesStore = useSpeciesStore();
const envParamsStore = useEnvParamsStore();


const showSlideover = ref(false);
const isPinned = ref(true);
const showEnvironmentSelector = ref(false);

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

watch(activeComponent, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

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

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.header-container {
  overflow: hidden;
}
</style>
