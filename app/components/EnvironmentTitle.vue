<template>
  <div class="relative pt-8">
    <div class="grid grid-cols-4 gap-5 mb-2">
      <!-- GEOGRAPHY -->
      <div class="flex justify-center w-full">
        <UPopover mode="hover">
          <div>
            <transition name="slide-up" mode="out-in">
              <div :key="geographyLabel" class="flex items-center justify-center cursor-pointer">
                <div class="my-2 w-14 h-14 rounded-lg text-fuchsia-500 flex justify-center items-center">
                  <Icon name="material-symbols:location-on-outline" class="h-8 w-8" />
                </div>
                <div>
                  <h1 class="text-neutral-500">Var i Sverige</h1>
                  <h1 class="text-neutral-800 text-2xl">
                    {{ geographyLabel }}
                  </h1>
                </div>
              </div>
            </transition>
          </div>

          <template #content>
            <div class="p-2 min-w-60 max-w-96">
              <div v-for="option in enabledGeographyOptions" class="hover:bg-gray-100 p-3 rounded-md my-1" :class="[
                option.disabled
                  ? 'opacity-50 cursor-not-allowed '
                  : 'cursor-pointer ',
                option.value === currentSelectedValueFor('geography')
                  ? 'bg-primary-50 hover:bg-primary-50 ring-1 ring-primary-100'
                  : 'ring-0',
              ]" @click="
                  () => {
                    if (!option.disabled) selectGeography(option);
                    open = false;
                  }
                ">
                <h1 class="text-sm font-bold text-neutral-900">
                  {{ option.label }}
                </h1>
                <p class="text-sm text-neutral-400 font-light">
                  {{ option.description }}
                </p>
              </div>
            </div>
          </template>
        </UPopover>
      </div>

      <!-- FOREST TYPE -->
      <div class="flex justify-center">
        <UPopover mode="hover">
          <div>
            <transition name="slide-up" mode="out-in">
              <div :key="forestTypeLabel" class="flex items-center justify-center cursor-pointer">
                <div class="my-2 w-14 h-14 rounded-lg text-green-500 flex justify-center items-center">
                  <Icon name="lucide:trees" class="h-8 w-8" />
                </div>
                <div>
                  <h1 class="text-neutral-500">Skogstyp</h1>
                  <h1 class="text-neutral-800 text-2xl">
                    {{ forestTypeLabel }}
                  </h1>
                </div>
              </div>
            </transition>
          </div>


          <template #content>
            <div class="p-2 min-w-60 max-w-96">
              <div v-for="option in enabledForestTypes" class="hover:bg-gray-100 p-3 rounded-md my-1" :class="[
                option.disabled
                  ? 'opacity-50 cursor-not-allowed '
                  : 'cursor-pointer ',
                option.value === currentSelectedValueFor('forestType')
                  ? 'bg-primary-50 hover:bg-primary-50 ring-1 ring-primary-100'
                  : 'ring-0',
              ]" @click="
                  () => {
                    if (!option.disabled) selectForestType(option);

                  }
                ">
                <h1 class="text-sm font-bold text-neutral-900">
                  {{ option.label }}
                </h1>
                <p class="text-sm text-neutral-400 font-light">
                  {{ option.description }}
                </p>
              </div>
            </div>
          </template>
        </UPopover>
      </div>

      <!-- STAND AGE -->
      <div class="flex justify-center">
        <UPopover mode="hover">
          <div>

            <transition name="slide-up" mode="out-in">
              <div :key="standAgeLabel" class="flex items-center justify-center cursor-pointer">
                <div class="my-2 w-14 h-14 rounded-lg text-violet-500 flex justify-center items-center">
                  <Icon name="carbon:crop-growth" class="h-8 w-8" />
                </div>
                <div>
                  <h1 size="md" weight="light" class="text-neutral-500">
                    Skogsålder
                  </h1>
                  <h1 class="text-neutral-800 text-2xl">
                    {{ standAgeLabel }}
                  </h1>
                </div>
              </div>
            </transition>
          </div>
          <template #content>
            <div class="p-2 min-w-60 max-w-96">
              <div v-for="option in enabledStandAges" class="hover:bg-gray-100 p-3 rounded-md my-1" :class="[
                option.disabled
                  ? 'opacity-50 cursor-not-allowed '
                  : 'cursor-pointer ',
                option.value === currentSelectedValueFor('standAge')
                  ? 'bg-primary-50 hover:bg-primary-50 ring-1 ring-primary-100'
                  : 'ring-0',
              ]" @click="
                  () => {
                    if (!option.disabled) selectStandAge(option);

                  }
                ">
                <h1 class="text-sm font-bold text-neutral-900">
                  {{ option.label }}
                </h1>
                <p class="text-sm text-neutral-400 font-light">
                  {{ option.description }}
                </p>
              </div>
            </div>
          </template>
        </UPopover>
      </div>

      <!-- VEGETATION TYPE -->
      <div class="flex justify-center">
        <UPopover mode="hover">
          <div>
            <transition name="slide-up" mode="out-in">
              <div :key="vegetationTypeLabel" class="flex items-center justify-center cursor-pointer">
                <div class="my-2 w-14 h-14 rounded-lg text-teal-500 flex justify-center items-center">
                  <Icon name="fluent-emoji-high-contrast:herb" class="h-8 w-8" />
                </div>
                <div>
                  <h1 size="md" weight="light" class="text-neutral-500">
                    Fältskikt
                  </h1>
                  <h1 class="text-neutral-800 text-2xl">
                    {{ vegetationTypeLabel }}
                  </h1>
                </div>
              </div>
            </transition>
          </div>


          <template #content>
            <div class="p-2 min-w-60 max-w-96">
              <div v-for="option in enabledVegetationTypes" class="hover:bg-gray-100 p-3 rounded-md my-1" :class="[
                option.disabled
                  ? 'opacity-50 cursor-not-allowed '
                  : 'cursor-pointer ',
                option.value === currentSelectedValueFor('vegetationType')
                  ? 'bg-primary-50 hover:bg-primary-50 ring-1 ring-primary-100'
                  : 'ring-0',
              ]" @click="
                  () => {
                    if (!option.disabled) selectVegetationType(option);

                  }
                ">
                <h1 class="text-sm font-bold text-neutral-900">
                  {{ option.label }}
                </h1>
                <p class="text-sm text-neutral-400 font-light">
                  {{ option.description }}
                </p>
              </div>
            </div>
          </template>
        </UPopover>
      </div>
    </div>
  </div>

  <!-- ListBoxRowHorizontal container with height transition -->
  <div :style="{ height: listBoxRowHeight }" class="overflow-visible transition-height ease-in-out duration-500">
    <Transition name="fade">
      <ListBoxRowHorizontal ref="listBoxRef" class="overflow-visible z-50" v-show="listBoxRowVisible" />
    </Transition>
  </div>

  <!-- Toggle button -->
  <div class="flex justify-end gap-2 mb-2">
    <UButton trailing :icon="restrictionEnabled ? 'mdi:lock' : 'mdi:lock-open'" @click="toggleRestriction" shape="full"
      class="transition-all" variant="soft" :color="restrictionEnabled ? 'secondary' : 'neutral'">
      {{ restrictionEnabled ? "Markinventeringsdata" : "Markinventeringsdata" }}
    </UButton>
    <UButton trailing :icon="listBoxRowVisible ? 'mdi:chevron-up' : 'mdi:chevron-down'" @click="toggleHeight"
      color="neutral" variant="soft">
      {{ listBoxRowVisible ? "Dölj kombinationsvy" : "Visa kombinationsvy" }}
    </UButton>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import ListBoxRowHorizontal from "./ListBoxRowHorizontal.vue";

const open = ref(false)

// Reference to the child component.
const listBoxRef = ref(null);

// --- Options Arrays (for fallback if child is not available) ---
const geographyOptions = [
  {
    value: "Norr",
    label: "Norra Sverige",
    description: "Norr om breddgrad 60°",
  },
  {
    value: "Söder",
    label: "Södra Sverige",
    description: "Söder om breddgrad 60°",
  },
];
const forestTypeOptions = [
  {
    value: "Granskog",
    label: "Granskog",
    description: "Minst 70% barrträd, och minst 70% av dessa är gran",
  },
  {
    value: "Tallskog",
    label: "Tallskog",
    description: "Minst 70% barrträd, och minst 70% av dessa är tall",
  },
  {
    value: "Barrblandskog",
    label: "Barrblandskog",
    description: "Minst 70% barrträd, men varken tall eller gran uppnår 70%",
  },
  {
    value: "Lövblandskog",
    label: "Blandskog",
    description: "31-69% lövträd eller barrträd",
  },
  {
    value: "EkBokskog",
    label: "Ek och Bokskog",
    description: "Minst 70% lövträd, och minst 70% av dessa är ek eller bok",
  },
  {
    value: "Lövskog",
    label: "Övrig lövskog",
    description: "Minst 70% lövträd",
  },
  {
    value: "Naturbete",
    label: "Trädklädd betesmark",
    description: "Trädbevuxna gräsmarker som används för betesdjur",
  },
];
const standAgeOptions = [
  {
    value: "1-40",
    label: "1-40 år",
    description: "Trädbeståndets medelålder är mellan 1 och 40 år",
  },
  {
    value: "41-90",
    label: "41-90 år",
    description: "Trädbeståndets medelålder är mellan 41 och 90 år",
  },
  {
    value: "91",
    label: "91 år och äldre",
    description: "Trädbeståndets medelålder är äldre än 90 år",
  },
  {
    value: "allaåldrar",
    label: "Alla åldrar",
    description: "Inkluderar trädbestånds med alla trädmedelåldrar",
  },
];
const vegetationTypeOptions = [
  {
    value: "Örter_grupp",
    label: "Örttyper",
    description:
      "Näringsrik mark med fältskikt som innehåller högörter, lågörter och bredbladiga gräs",
  },
  {
    value: "Blåbär_grupp",
    label: "Blåbärstyper",
    description: "Fältskikt som domineras av blåbär och smalbladiga gräs",
  },
  {
    value: "Lingon_grupp",
    label: "Lingon-fattigristyper",
    description:
      "Näringsfattig mark med fältskikt som domineras av lingon, kråkbär, ljung, eller andra fattigris",
  },
];

const route = useRoute();

// watch(
//   () => route.fullPath,
//   (newPath) => {
//     if (newPath === "/mykorrhizasvampar" && listBoxRef.value?.resetSelections) {
//       listBoxRef.value.resetSelections();
//     }
//   }
// );

const isDashboardStart = computed(() => route.path === "/mykorrhizasvampar");
const currentSelection = computed(() => {
  if (
    isDashboardStart.value &&
    listBoxRef.value &&
    listBoxRef.value.selectedOptions
  ) {
    return listBoxRef.value.selectedOptions;
  } else {
    return {
      geography: route.params.geography || "",
      forestType: route.params.forestType || "",
      standAge: route.params.standAge || "",
      vegetationType: route.params.vegetationType || "",
    };
  }
});

const geographyLabel = computed(() => {
  const value = decodeURIComponent(currentSelection.value.geography || "");
  const option = geographyOptions.find((o) => o.value === value);
  return option ? option.label : value || "Välj plats";
});
const forestTypeLabel = computed(() => {
  const value = decodeURIComponent(currentSelection.value.forestType || "");
  const option = forestTypeOptions.find((o) => o.value === value);
  return option ? option.label : value || "Välj skogstyp";
});
const standAgeLabel = computed(() => {
  const value = decodeURIComponent(currentSelection.value.standAge || "");
  const option = standAgeOptions.find((o) => o.value === value);
  return option ? option.label : value || "Välj ålder";
});
const vegetationTypeLabel = computed(() => {
  const value = decodeURIComponent(currentSelection.value.vegetationType || "");
  const option = vegetationTypeOptions.find((o) => o.value === value);
  return option ? option.label : value || "Välj fältskikt";
});

function currentSelectedValueFor(category) {
  return currentSelection.value[category];
}

function selectGeography(option) {
  if (listBoxRef.value && listBoxRef.value.updateSelection) {
    listBoxRef.value.updateSelection(option.value, "geography");
  }
}
function selectForestType(option) {
  if (listBoxRef.value && listBoxRef.value.updateSelection) {
    listBoxRef.value.updateSelection(option.value, "forestType");
  }
}
function selectStandAge(option) {
  if (listBoxRef.value && listBoxRef.value.updateSelection) {
    listBoxRef.value.updateSelection(option.value, "standAge");
  }
}
function selectVegetationType(option) {
  if (listBoxRef.value && listBoxRef.value.updateSelection) {
    listBoxRef.value.updateSelection(option.value, "vegetationType");
  }
}

const listBoxRowVisible = ref(false);
const listBoxRowHeight = ref("0px");
function toggleHeight() {
  listBoxRowVisible.value = !listBoxRowVisible.value;
  listBoxRowHeight.value = listBoxRowVisible.value ? "250px" : "0px";
}

const restrictionEnabled = ref(false);
function toggleRestriction() {
  restrictionEnabled.value = !restrictionEnabled.value;
  if (listBoxRef.value) {
    listBoxRef.value.setRestriction(restrictionEnabled.value);
  }
}

// Use the enabled options exposed by the child. If the child isn’t yet mounted, fall back to the raw arrays.
const enabledGeographyOptions = computed(() => {
  return listBoxRef.value
    ? listBoxRef.value.enabledGeographyOptions
    : geographyOptions;
});
const enabledForestTypes = computed(() => {
  return listBoxRef.value
    ? listBoxRef.value.enabledForestTypes
    : forestTypeOptions;
});
const enabledStandAges = computed(() => {
  return listBoxRef.value ? listBoxRef.value.enabledStandAges : standAgeOptions;
});
const enabledVegetationTypes = computed(() => {
  return listBoxRef.value
    ? listBoxRef.value.enabledVegetationTypes
    : vegetationTypeOptions;
});
</script>

<style scoped>
.transition-height {
  transition: height 0.5s ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
