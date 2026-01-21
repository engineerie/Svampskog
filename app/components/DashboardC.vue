<template>
  <div class="bg-muted">


    <!-- <USlideover :class="['transition-all', !isPinned ? 'm-1 rounded overflow-hidden' : 'm-0 rounded-none']"
    v-model:open="showSlideover" :overlay="false" :dismissible="!isPinned" side="right" :modal="!isPinned" :ui="{
      wrapper: 'md:p-2',
      content: 'md:rounded-sm ring-1 ring-neutral-200 bg-white w-[24rem] max-w-full flex flex-col'
    }">
    <template #content="{ close }">
      <div class="relative flex flex-col h-full">
        <div class="absolute flex items-center justify-between gap-2 p-3 z-10">
          <div class="flex items-center gap-2" v-if="!isMobile">
            <UButton icon="codicon:pinned" color="neutral" variant="soft" :ui="{ rounded: 'rounded-full' }" size="lg"
              class="rounded-full" :class="isPinned ? 'text-primary-500' : 'text-neutral-700'" @click="togglePinned" />
          </div>
          <UButton icon="heroicons:x-mark" color="neutral" variant="soft" :ui="{ rounded: 'rounded-full' }" size="lg"
            class="rounded-full" @click="() => { close(); showSlideover = false }" />
        </div>
        <div class="flex-1 overflow-y-auto pb-6">
          <SpeciesInfo v-if="speciesStore.selectedSpecies" :species="speciesStore.selectedSpecies"
            :source="speciesStore.sourceComponent" />
        </div>
      </div>
    </template>
</USlideover> -->
    <MySlideover v-model="showSlideover" :pinned="isPinned" @update:pinned="(val) => (isPinned = val)">
      <SpeciesInfo :species="speciesStore.selectedSpecies" :source="speciesStore.sourceComponent" />
    </MySlideover>
    <UContainer>
      <transition name="fade">
        <EnvironmentSelector v-if="hasAllParams" />
      </transition>
    </UContainer>
    <div class="flex flex-col min-h-screen ">
      <UContainer class="w-full px-0 ">
        <transition name="fade" mode="out-in">
          <NormalView class="block sm:border border-muted/50 bg-white sm:rounded-xl sm:shadow mb-4"
            :active-view="activeKnowledgeView" @enlarge="handleFullScreen" @close-view="handleCloseFullScreen" />
        </transition>
      </UContainer>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import NormalView from "./NormalView.vue";

import { useEnvParamsStore } from "~/stores/envParamsStore";

import { useSpeciesStore } from "~/stores/speciesStore";
import { useMediaQuery } from '@vueuse/core'
const isMobile = useMediaQuery('(max-width: 767px)')

const route = useRoute();

const showSlideover = ref(false);
const isPinned = ref(false);

const togglePinned = () => {
  isPinned.value = !isPinned.value
};

const speciesStore = useSpeciesStore();
const envParamsStore = useEnvParamsStore();

// Open the slideover automatically when a species is selected
watch(
  () => speciesStore.selectedSpecies,
  (newVal) => {
    if (newVal) {
      showSlideover.value = true;
    }
  }
);

// Clear selection when the slide-over is closed
watch(showSlideover, (isOpen) => {
  if (!isOpen) {
    speciesStore.clearSelection();
  }
});

// Track which detailed view should be shown inside NormalView
const activeKnowledgeView = ref(null);

// A computed property to check if all required environment parameters are provided
const hasAllParams = computed(() => {
  return envParamsStore.geography &&
    envParamsStore.forestType &&
    envParamsStore.standAge &&
    envParamsStore.vegetationType;
});

// Handlers for toggling full-screen view states
const handleFullScreen = (componentName) => {
  activeKnowledgeView.value = componentName;
};

const handleCloseFullScreen = () => {
  activeKnowledgeView.value = null;
};

// Optional: handle the Esc key to clear a species selection or close modals
const handleKeydown = (event) => {
  if (event.key === "Escape" && speciesStore.selectedSpecies) {
    speciesStore.clearSelection();
  }
};

function normalizeParam(param) {
  if (Array.isArray(param)) {
    return param[0] ?? null
  }
  return typeof param === 'string' && param.length > 0 ? param : null
}

function applyRouteParams(params) {
  const normalized = {
    geography: normalizeParam(params.geography),
    forestType: normalizeParam(params.forestType),
    standAge: normalizeParam(params.standAge),
    vegetationType: normalizeParam(params.vegetationType),
  }

  if (
    normalized.geography &&
    normalized.forestType &&
    normalized.standAge &&
    normalized.vegetationType
  ) {
    envParamsStore.setParams(normalized)
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);

  // Initialize the environment parameters store from the current route, if all params exist
  applyRouteParams(route.params)
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});

// Watch for changes in route parameters to update the environment parameters store
watch(
  () => route.params,
  (newParams) => {
    applyRouteParams(newParams)
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
      // if (window.location.pathname !== newPath) {
      //   window.history.replaceState(null, '', newPath);
      // }
    } else {
      // if (window.location.pathname !== '/') {
      //   window.history.replaceState(null, '', '/');
      // }
    }
  },
  { deep: true }
);

watch(activeKnowledgeView, () => {
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
