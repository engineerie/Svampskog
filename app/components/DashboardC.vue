<template>
    <div class="hidden">
    <NuxtImg v-for="(src, key) in imageMap" :key="key" :src="src" width="600" height="420" quality="80" format="webp" preload />
  </div>
  <div class="hidden">
    <NuxtImg v-for="(src, key) in imageMap" :key="key" :src="src" width="300" height="180" format="webp" quality="80"
      preload />
  </div>
  <MySlideover v-model="showSlideover" :pinned="isPinned" @update:pinned="(val) => (isPinned = val)">
    <SpeciesInfo :species="speciesStore.selectedSpecies" :source="speciesStore.sourceComponent" />
  </MySlideover>

  <UContainer>
    <UMain>
          <EnvironmentSelector class="fixed top-16 left-0 right-0" />
      <transition name="fade" mode="out-in">
        <component
          :is="activeComponent"
          @close="handleCloseFullScreen"
          @enlarge="handleFullScreen"
          class="block"
        />
      </transition>
    </UMain>
</UContainer>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import MySlideover from "./MySlideover.vue";
import FullScreenPoison from "./FullScreenPoison.vue";
import FullScreenEdible from "./FullScreenEdible.vue";
import RedlistedComponent from "./RedlistedComponent.vue";
import NormalView from "./NormalView.vue"; 
import StartView from "./StartView.vue"; 

import { useEnvParamsStore } from "~/stores/envParamsStore";

import { useSpeciesStore } from "~/stores/speciesStore";
import EdnaComponent from "./EdnaComponent.vue";
import { imageMap } from '~/stores/envParamsStore'
const route = useRoute();

const speciesStore = useSpeciesStore();
const envParamsStore = useEnvParamsStore();


const showSlideover = ref(false);
const isPinned = ref(true);


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
