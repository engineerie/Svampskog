<template>
  <div class="overflow-visible">
    <div class="grid grid-cols-4 gap-5 overflow-visible">
      <!-- ==================== GEOGRAPHY COLUMN ==================== -->
      <div
        class="p-6 pl-10 pb-4 backdrop-blur-3xl rounded-xl bg-white bg-opacity-40 dark:bg-neutral-900 dark:bg-opacity-60 border-[1px] dark:border-neutral-800 border-stone-200/50 h-fit"
      >
        <div>
          <div
            v-for="option in enabledGeographyOptions"
     
            class="flex justify-between mb-2 text-neutral-500"
  
          >
            <label
              :for="'geography-' + option.value"
              :class="{
                'opacity-40 cursor-not-allowed': option.disabled,
                'cursor-pointer': !option.disabled,
              }"
              class="text-sm"

            >
              {{ option.label }}
            </label>
            <UCheckbox
              :id="'geography-' + option.value"
              color="primary"
              :model-value="selectedOptions.geography === option.value"
              @update:model-value="
                () => updateSelection(option.value, 'geography')
              "
              :disabled="option.disabled"

            />
          </div>
        </div>
      </div>

      <!-- ==================== FOREST TYPE COLUMN ==================== -->
      <div
        class="p-6 pl-10 pb-4 backdrop-blur-3xl rounded-xl bg-white bg-opacity-40 dark:bg-neutral-900 dark:bg-opacity-60 border-[1px] dark:border-neutral-800 border-stone-200/50 h-fit"
      >
        <div>
          <div
            v-for="option in enabledForestTypes"
        
            class="flex justify-between mb-2 text-neutral-500"
  
          >
            <label
              :for="'forestType-' + option.value"
              :class="{
                'opacity-40 cursor-not-allowed': option.disabled,
                'cursor-pointer': !option.disabled,
              }"
              class="text-sm"

            >
              {{ option.label }}
            </label>
            <UCheckbox
              size="lg"
              :id="'forestType-' + option.value"
              color="primary"
              :model-value="selectedOptions.forestType === option.value"
              @update:model-value="
                () => updateSelection(option.value, 'forestType')
              "
              :disabled="option.disabled"
   
            />
          </div>
        </div>
      </div>

      <!-- ==================== STAND AGE COLUMN ==================== -->
      <div
        class="p-6 pl-10 pb-4 backdrop-blur-3xl rounded-xl bg-white bg-opacity-40 dark:bg-neutral-900 dark:bg-opacity-60 border-[1px] dark:border-neutral-800 border-stone-200/50 h-fit"
      >
        <div>
          <div
            v-for="option in enabledStandAges"
      
            class="flex justify-between mb-2 text-neutral-500"
          >
            <label
              :for="'standAge-' + option.value"
              :class="{
                'opacity-40 cursor-not-allowed': option.disabled,
                'cursor-pointer': !option.disabled,
              }"
              class="text-sm"
            >
              {{ option.label }}
            </label>
            <UCheckbox
              :id="'standAge-' + option.value"
              color="primary"
              :model-value="selectedOptions.standAge === option.value"
              @update:model-value="
                () => updateSelection(option.value, 'standAge')
              "
            />
          </div>
        </div>
      </div>

      <!-- ==================== VEGETATION TYPE COLUMN ==================== -->
      <div
        class="p-6 pl-10 pb-4 backdrop-blur-3xl rounded-xl bg-white bg-opacity-40 dark:bg-neutral-900 dark:bg-opacity-60 border-[1px] dark:border-neutral-800 border-stone-200/50 h-fit"
      >
        <div>
          <div
            v-for="option in enabledVegetationTypes"
           
            class="flex justify-between mb-2 text-neutral-500"
          >
            <label
              :for="'vegetationType-' + option.value"
              :class="{
                'opacity-40 cursor-not-allowed': option.disabled,
                'cursor-pointer': !option.disabled,
              }"
              class="text-sm"
            >
              {{ option.label }}
            </label>
            <UCheckbox
              :id="'vegetationType-' + option.value"
              color="primary"
              :model-value="selectedOptions.vegetationType === option.value"
              @update:model-value="
                () => updateSelection(option.value, 'vegetationType')
              "
              :disabled="option.disabled"
            
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const restrictionEnabled = ref(false);
const setRestriction = (enabled) => {
  restrictionEnabled.value = enabled;
};

const router = useRouter();
const route = useRoute();


const props = defineProps({
  geographyFromMap: String,
});

// --- Selected Options State ---
const selectedOptions = ref({
  geography: null,
  forestType: null,
  standAge: null,
  vegetationType: null,
});

// --- Valid Combinations from JSON ---
const validCombinations = ref([]);
onMounted(async () => {
  const response = await fetch("/validCombinations.json");
  validCombinations.value = await response.json();

  // Initialize from route params if present
  selectedOptions.value.geography = route.params.geography || null;
  selectedOptions.value.forestType = route.params.forestType || null;
  selectedOptions.value.standAge = route.params.standAge || null;
  selectedOptions.value.vegetationType = route.params.vegetationType || null;
});

// Watch for changes in selectedOptions and update the route accordingly.
watch(
  selectedOptions,
  () => {
    const { geography, forestType, standAge, vegetationType } =
      selectedOptions.value;
    if (geography && forestType && standAge && vegetationType) {
      const newPath = generateParams();
      if (newPath && newPath !== route.fullPath) {
        router.push(newPath);
      }
    }
  },
  { deep: true }
);

const generateParams = () => {
  if (
    !selectedOptions.value.geography ||
    !selectedOptions.value.forestType ||
    !selectedOptions.value.standAge ||
    !selectedOptions.value.vegetationType
  ) {
    return "";
  }
  const path = [
    encodeURIComponent(selectedOptions.value.geography),
    encodeURIComponent(selectedOptions.value.forestType),
    encodeURIComponent(selectedOptions.value.standAge),
    encodeURIComponent(selectedOptions.value.vegetationType),
  ].join("/");
  return `/mykorrhizasvampar/${path}`;
};

// --- Options Arrays ---
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
    description: "Skogens medelålder är mellan 1 och 40 år",
  },
  {
    value: "41-90",
    label: "41-90 år",
    description: "Skogens medelålder är mellan 41 och 90 år",
  },
  {
    value: "91",
    label: "91 år och äldre",
    description: "Skogens medelålder är äldre än 90 år",
  },
  {
    value: "allaåldrar",
    label: "Alla åldrar",
    description: "Inkluderar skogar med alla trädmedelåldrar",
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

// --- VALID COMBINATIONS: Compute Enabled Options Based on JSON ---
const enabledGeographyOptions = computed(() => {
  return geographyOptions.map((option) => ({
    ...option,
    disabled:
      restrictionEnabled.value &&
      (selectedOptions.value.forestType ||
        selectedOptions.value.standAge ||
        selectedOptions.value.vegetationType)
        ? !validCombinations.value.some(
            (comb) =>
              (!selectedOptions.value.forestType ||
                comb.forest === selectedOptions.value.forestType) &&
              (!selectedOptions.value.standAge ||
                comb.age === selectedOptions.value.standAge) &&
              (!selectedOptions.value.vegetationType ||
                comb.veg === selectedOptions.value.vegetationType) &&
              comb.geo === option.value
          )
        : false,
  }));
});

const enabledForestTypes = computed(() => {
  return forestTypeOptions.map((option) => ({
    ...option,
    disabled:
      restrictionEnabled.value &&
      (selectedOptions.value.geography ||
        selectedOptions.value.standAge ||
        selectedOptions.value.vegetationType)
        ? !validCombinations.value.some(
            (comb) =>
              (!selectedOptions.value.geography ||
                comb.geo === selectedOptions.value.geography) &&
              (!selectedOptions.value.standAge ||
                comb.age === selectedOptions.value.standAge) &&
              (!selectedOptions.value.vegetationType ||
                comb.veg === selectedOptions.value.vegetationType) &&
              comb.forest === option.value
          )
        : false,
  }));
});

const enabledStandAges = computed(() => {
  return standAgeOptions.map((option) => ({
    ...option,
    disabled:
      restrictionEnabled.value &&
      (selectedOptions.value.geography ||
        selectedOptions.value.forestType ||
        selectedOptions.value.vegetationType)
        ? !validCombinations.value.some(
            (comb) =>
              (!selectedOptions.value.geography ||
                comb.geo === selectedOptions.value.geography) &&
              (!selectedOptions.value.forestType ||
                comb.forest === selectedOptions.value.forestType) &&
              (!selectedOptions.value.vegetationType ||
                comb.veg === selectedOptions.value.vegetationType) &&
              comb.age === option.value
          )
        : false,
  }));
});

const enabledVegetationTypes = computed(() => {
  return vegetationTypeOptions.map((option) => ({
    ...option,
    disabled:
      restrictionEnabled.value &&
      (selectedOptions.value.geography ||
        selectedOptions.value.forestType ||
        selectedOptions.value.standAge)
        ? !validCombinations.value.some(
            (comb) =>
              (!selectedOptions.value.geography ||
                comb.geo === selectedOptions.value.geography) &&
              (!selectedOptions.value.forestType ||
                comb.forest === selectedOptions.value.forestType) &&
              (!selectedOptions.value.standAge ||
                comb.age === selectedOptions.value.standAge) &&
              comb.veg === option.value
          )
        : false,
  }));
});

// --- Update Selection Function ---
function updateSelection(value, category) {
  selectedOptions.value[category] =
    selectedOptions.value[category] === value ? null : value;
}

// --- Reset Selections ---
function resetSelections() {
  selectedOptions.value = {
    geography: null,
    forestType: null,
    standAge: null,
    vegetationType: null,
  };
}

// Expose properties and functions for parent components.
defineExpose({
  selectedOptions,
  resetSelections,
  setRestriction,
  updateSelection,
  enabledGeographyOptions,
  enabledForestTypes,
  enabledStandAges,
  enabledVegetationTypes,
});
</script>

<style scoped>
.disabled-text {
  color: #a3a3a3;
}
.relative {
  position: relative;
}
/* Transition styles */
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
