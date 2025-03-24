<template>
  <div>
    <EnvironmentSelector />
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
      <transition name="fade" mode="out-in">
        <component
          :is="activeComponent"
          @close="handleCloseFullScreen"
          @enlarge="handleFullScreen"
        />
      </transition>
   
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import MySlideover from "./MySlideover.vue";
import FullScreenPoison from "./FullScreenPoison.vue";
import FullScreenEdible from "./FullScreenEdible.vue";
import FullScreenRedlisted from "./FullScreenRedlisted.vue";
import NormalView from "./NormalView.vue"; // Component for the normal view
import StartView from "./StartView.vue"; // Component for the normal view

import { useEnvParamsStore } from "~/stores/envParamsStore";

import { useSpeciesStore } from "~/stores/speciesStore";
import EdnaComponent from "./EdnaComponent.vue";

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
    case "FullScreenRedlisted":
      return FullScreenRedlisted;
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
