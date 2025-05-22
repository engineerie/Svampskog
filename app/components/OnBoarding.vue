<template>
  <div class="mt-14">
    <div class="hidden">
      <NuxtImg src="/images/hyggesfritt.png" class="object-cover" alt="Inte kalavverkad" height="250" width="450"
        format="webp" />
      <NuxtImg src="/images/kalhygge.png" class="object-cover" alt="Kalavverkad" height="250" width="450"
        format="webp" />
      <NuxtImg src="/images/hyggesfritt.png" class="object-cover" alt="Inte kalavverkad" width="300" height="180"
        format="webp" />
      <NuxtImg src="/images/kalhygge.png" class="object-cover" alt="Kalavverkad" width="300" height="180"
        format="webp" />
      <NuxtImg width="300" height="180" src="/images/ingen_åtgärd.png" class="h-full rounded-t-xl overflow-hidden"
        alt="Inga åtgärder" format="webp" />
      <NuxtImg width="300" height="180" src="/images/kalhygge.png" class="h-full rounded-t-xl overflow-hidden"
        alt="Trakthyggesbruk" format="webp" />
      <NuxtImg width="300" height="180" src="/images/luckhuggning.png" class="h-full rounded-t-xl overflow-hidden"
        alt="Luckhuggning" format="webp" />
      <NuxtImg width="300" height="180" src="/images/skärm.png" class="h-full rounded-t-xl overflow-hidden"
        alt="Överhållen skärm" format="webp" />
      <NuxtImg width="300" height="180" src="/images/blädning.png" class="h-full rounded-t-xl overflow-hidden"
        alt="Blädning" format="webp" />
    </div>

    <!-- Updated Stepper (Circles and Labels separated) -->
    <div class="mb-3 w-[35rem] mx-auto">
      <!-- Circles and line -->
      <div class="px-6">
        <div class="relative" style="height: 3rem">
          <!-- Background line -->
          <div class="absolute top-1/2 h-1 bg-gray-200 z-[-1]" :style="{ left: lineLeft, right: lineLeft }"></div>
          <!-- Animated progress line -->
          <div class="absolute top-1/2 h-1 bg-neutral-500 transition-all duration-50 z-[-1]"
            :style="{ left: lineLeft, width: progressWidth }"></div>
          <!-- Circles container -->
          <div class="flex items-center h-full z-10">
            <div v-for="(step, index) in onboardingStepsDisplay" :key="index" class="flex-1 flex justify-center">
              <div class="size-14 flex items-center justify-center rounded-full border-2 transition-all" :class="[
                circleClasses(index),
                {
                  'cursor-not-allowed border-opacity-20 bg-neutral-200 text-opacity-20':
                    !isStepEnabled(index),
                },
              ]" @click="isStepEnabled(index) && onboardingStepClicked(index)">
                <Icon :name="step.icon" class="size-8" :class="{ 'text-gray-300': !isStepEnabled(index) }" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Labels row -->
      <div class="flex mt-2 px-6">
        <div v-for="(step, index) in onboardingStepsDisplay" :key="index"
          class="flex-1 text-center text-sm text-neutral-500 relative"
          :class="{ 'text-neutral-500': index <= currentStep }">
          <div>{{ step.label }}</div>
          <!-- Display badges for selections in historik and skogsskötsel -->
          <div v-if="index === 0 && onboardingStore.selectedStartskog !== null"
            class="absolute left-1/2 top-full mt-1 transform -translate-x-1/2 w-full">
            <UBadge color="secondary" variant="subtle">
              {{ startskogOptions[onboardingStore.selectedStartskog] }}
            </UBadge>
          </div>
          <!-- Display badge for skogsskötsel -->
          <div v-if="index === 1 && onboardingStore.selectedFramework !== null"
            class="absolute left-1/2 top-full mt-1 transform -translate-x-1/2">
            <UBadge variant="subtle">
              {{ frameworkOptions[onboardingStore.selectedFramework] }}
            </UBadge>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- Right side (full width) -->
      <div class="col-span-12">
        <div class="rounded-2xl">
          <transition name="fade" mode="out-in">
            <!-- Step 0: Information -->
            <!-- <div v-if="currentStep === 0">
              

          
              <div class="flex gap-2 w-full justify-center mt-20">
                <UButton size="lg" color="neutral" variant="subtle" trailing icon="heroicons:arrow-right"
                  @click="nextStep" :disabled="!isStepEnabled(1)" label="Välj historik" />
              </div>
            </div> -->

            <!-- Step 1: Välj historik -->
            <div v-if="currentStep === 0">
              <h1 class="mb-12 mt-20 text-center text-2xl text-neutral-800">
                Har skogen varit kalavverkad tidigare eller inte?
              </h1>

              <!-- Custom selection options for historik -->
              <div class="mb-6">
                <div class="mx-auto mb-8 grid max-w-2xl gap-6 sm:grid-cols-2">
                  <!-- Option 0: Inte kalavverkad -->
                  <div
                    class="cursor-pointer group border border-neutral-300 rounded-xl overflow-hidden hover:shadow transition-all "
                    :class="optionCardClass(onboardingStore.selectedStartskog, 0)"
                    @click="onboardingStore.selectedStartskog = 0">
                    <div class="relative">
                      <NuxtImg src="/images/hyggesfritt.png" class="object-cover" alt="Inte kalavverkad" height="250"
                        width="450" format="webp" />
                    </div>
                    <div class="p-3">
                      <h1 class="text-muted-800 text-xl font-medium mb-1">
                        Inte kalavverkad
                      </h1>
                      <h1 class="text-muted-400">
                        Skogen har oftast skogsbrukats, men inte varit
                        kalavverkad.
                      </h1>
                    </div>
                  </div>
                  <!-- Option 1: Kalavverkad -->
                  <div
                    class="cursor-pointer group border border-neutral-300 rounded-xl overflow-hidden hover:shadow transition-all "
                    :class="optionCardClass(onboardingStore.selectedStartskog, 1)"
                    @click="onboardingStore.selectedStartskog = 1">
                    <div class="relative">
                      <NuxtImg src="/images/kalhygge.png" class="object-cover" alt="Kalavverkad" height="250"
                        width="450" format="webp" />
                    </div>
                    <div class="p-3">
                      <h1 class="text-muted-800 text-xl font-medium mb-1">
                        Kalavverkad
                      </h1>
                      <h1 size="md" weight="medium" class="text-muted-400">
                        Skogen har varit kalavverkad eller är etablerad på
                        tidigare trädlös mark.
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Navigation buttons for Step 1 -->
              <div class="flex gap-2 w-full justify-center mt-6">
                <!-- Previous Button -->
                <!-- <UButton size="lg" color="neutral" variant="subtle" icon="heroicons:arrow-left" @click="prevStep"
                  :disabled="currentStep === 0" label="Information" /> -->

                <UButton trailing size="lg" color="neutral" variant="subtle" :ui="{ rounded: 'rounded-full' }"
                  icon="heroicons:arrow-right" @click="nextStep" :disabled="!isStepEnabled(2)"
                  label="Välj skogsskötsel" />
              </div>
            </div>

            <!-- Step 2: Välj skogsskötsel -->
            <div v-else-if="currentStep === 1">
              <h1 class="mb-6 mt-20 text-center text-neutral-800 text-2xl">
                Vilken skogsskötsel planeras?
              </h1>

              <div class="w-full flex justify-center">
                <UTabs v-model="activeTab" :tabs="tabs" />
              </div>
              <div v-if="activeTab === 'komigang'">
                <!-- Custom selection options for management method -->
                <div class="mb-6">
                  <div class="mx-auto mb-8 grid max-w-7xl sm:grid-cols-5">
                    <div class="col-start-3 col-span-3 text-neutral-500 text-sm flex justify-center pb-2">
                      Hyggesfria metoder
                    </div>
                    <!-- Option 0: Inga åtgärder (naturskydd) -->
                    <div class="col-span-2 grid grid-cols-2 gap-6 p-4">
                      <div
                        class="cursor-pointer group border border-neutral-300 rounded-xl overflow-hidden transition-all bg-white"
                        :class="optionCardClass(onboardingStore.selectedFramework, 0)
                          " @click="onboardingStore.selectedFramework = 0">
                        <div class="relative">
                          <NuxtImg width="300" height="180" src="/images/ingen_åtgärd.png"
                            class="h-full overflow-hidden" alt="Inga åtgärder" format="webp" />
                        </div>
                        <div class="flex items-center gap-1 p-2">
                          <!-- <Icon name="pepicons-pop:tree-circle" class="size-5 text-green-400" /> -->
                          <h1 size="md" weight="medium" class="text-muted-600">
                            Inga åtgärder
                          </h1>
                        </div>
                      </div>
                      <!-- Option 1: Trakthyggesbruk -->
                      <div
                        class="cursor-pointer group border border-neutral-300  rounded-xl overflow-hidden  transition-all bg-white"
                        :class="optionCardClass(onboardingStore.selectedFramework, 1)
                          " @click="onboardingStore.selectedFramework = 1">
                        <div class="relative">
                          <NuxtImg width="300" height="180" src="/images/kalhygge.png" class="h-full overflow-hidden"
                            alt="Trakthyggesbruk" format="webp" />
                        </div>
                        <div class="flex items-center gap-1 p-2">
                          <!-- <Icon name="material-symbols:resize" class="size-5 text-violet-400" /> -->
                          <h1 size="md" weight="medium" class="text-muted-600">
                            Trakthyggesbruk
                          </h1>
                        </div>
                      </div>
                    </div>

                    <div class="col-span-3 grid grid-cols-3 bg-neutral-200 gap-6 p-4 rounded-xl">
                      <!-- Option 2: Luckhuggning -->
                      <div
                        class="cursor-pointer group border border-neutral-300 rounded-xl overflow-hidden  transition-all bg-white"
                        :class="optionCardClass(onboardingStore.selectedFramework, 2)
                          " @click="onboardingStore.selectedFramework = 2">
                        <div class="relative">
                          <NuxtImg width="300" height="180" src="/images/luckhuggning.png"
                            class="h-full overflow-hidden" alt="Luckhuggning" format="webp" />
                        </div>
                        <div class="flex items-center gap-1 p-2">
                          <!-- <Icon name="pixelarticons:chess" class="size-5 text-sky-400" /> -->
                          <h1 size="md" weight="medium" class="text-muted-600">
                            Luckhuggning
                          </h1>
                        </div>
                      </div>

                      <!-- Option 3: Överhållen skärm -->
                      <div
                        class="cursor-pointer group border border-neutral-300  rounded-xl overflow-hidden transition-all bg-white"
                        :class="optionCardClass(onboardingStore.selectedFramework, 3)
                          " @click="onboardingStore.selectedFramework = 3">
                        <div class="relative">
                          <NuxtImg width="300" height="180" src="/images/skärm.png"
                            class="h-full overflow-hidden" alt="Överhållen skärm" format="webp" />
                        </div>
                        <div class="flex items-center gap-1 p-2">
                          <!-- <Icon name="catppuccin:redwood" class="size-5 text-orange-400" /> -->
                          <h1 size="md" weight="medium" class="text-muted-600">
                            Överhållen skärm
                          </h1>
                        </div>
                      </div>

                      <!-- Option 4: Blädning -->
                      <div
                        class="cursor-pointer group border border-neutral-300 rounded-xl overflow-hidden transition-all bg-white"
                        :class="optionCardClass(onboardingStore.selectedFramework, 4)
                          " @click="onboardingStore.selectedFramework = 4">
                        <div class="relative">
                          <NuxtImg width="300" height="180" src="/images/blädning.png" class="h-full overflow-hidden"
                            alt="Blädning" format="webp" />
                        </div>
                        <div class="flex items-center gap-1 p-2">
                          <!-- <Icon name="tabler:christmas-tree-off" class="size-5 text-teal-400" /> -->
                          <h1 size="md" weight="medium" class="text-muted-600">
                            Blädning
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Tab: Skogsskötsel information -->
              <div v-else-if="activeTab === 'skogsskolsel'" class="rounded-2xl w-full flex justify-center">
                <div class="space-y-6 max-w-7xl">
                  <!-- Loop over each forest type in the JSON -->
                  <div v-for="(forestData, index) in allForestryData" :key="index">
                    <div v-if="forestData.methods.length > 0">
                      <!-- Loop over each method for the forest type -->
                      <div v-for="(method, mIndex) in forestData.methods" :key="mIndex"
                        class="p-4 border rounded-lg transition-shadow mb-4 grid grid-cols-4 gap-4 bg-neutral-50">
                        <!-- Image from the JSON -->
                        <div class="bg-gray-200 h-full rounded-lg flex items-center justify-center overflow-hidden">
                          <div class="w-full h-full flex items-center justify-center bg-white shadow dark:bg-gray-700">
                            <NuxtImg :src="method.image" alt="Framework image" class="object-cover w-full h-full"
                              width="300" height="180" format="webp" />
                          </div>
                        </div>
                        <div class="col-span-3">
                          <div class="flex items-center gap-4">
                            <span class="font-bold text-lg">
                              {{ methodLabels[method.key] || method.title }}
                            </span>
                          </div>
                          <p class="mt-2 text-neutral-600">
                            {{ method.description }}
                          </p>
                          <p class="mt-2 text-neutral-600">
                            <span class="font-bold">Påverkan på mykorrhizasvampar:</span>
                            <span>{{ method.impact }}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Navigation buttons for Step 2 -->
              <div class="flex gap-2 w-full justify-center mt-6">
                <!-- Previous Button -->
                <!-- <UButton size="lg" color="neutral" variant="subtle" icon="heroicons:arrow-left" @click="prevStep"
                  :disabled="currentStep === 0" label="Historik" /> -->

                <!-- <UButton trailing size="lg" color="white" :ui="{ rounded: 'rounded-full' }" icon="heroicons:arrow-right"
                @click="nextStep" :disabled="!isStepEnabled(3)" label="Gå till modell" /> -->

                <UButton trailing size="lg" color="neutral" variant="subtle" icon="heroicons:arrow-right"
                  @click="$emit('go-to-model')" :disabled="!isStepEnabled(3)" label="Gå till modell" />
              </div>
            </div>


            <!-- <div v-else-if="currentStep === 3">
              <div class="mb-6">
                <h1 class="mb-6 text-center text-neutral-800 text-2xl">
                  Klar att fortsätta till modell?
                </h1>
                <div class="grid grid-cols-6 gap-6">
                  <div class="col-start-3">
                    <h1 size="md" weight="light" class="text-center text-neutral-400 mb-2">
                      Skogens historik
                    </h1>
                    <div class="rounded-xl overflow-hidden border border-neutral-300 bg-white shadow">
                      <div class="relative">
                        <NuxtImg :src="onboardingStore.selectedStartskog === 0
                          ? '/images/hyggesfritt.png'
                          : '/images/kalhygge.png'
                          " class="w-full overflow-hidden object-cover" alt="Historik val" width="300" height="180"
                          format="webp" />
                      </div>
                      <div class="flex items-center gap-1 p-2">
                        <h1 size="md" weight="medium" class="text-muted-600">
                          {{
                            startskogOptions[onboardingStore.selectedStartskog]
                          }}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h1 size="md" weight="light" class="text-center text-neutral-400 mb-2">
                      Planerad skogsskötsel
                    </h1>
                    <div class="rounded-xl overflow-hidden border border-neutral-300 bg-white shadow">
                      <div class="relative">
                        <NuxtImg :src="frameworkImage()" class="w-full overflow-hidden object-cover"
                          alt="Skogsskötsel val" height="180" width="300" />
                      </div>
                      <div class="flex items-center gap-1 p-2">
                        <h1 class="text-muted-600">
                          {{
                            frameworkOptions[onboardingStore.selectedFramework]
                          }}
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-center">
                <UButton trailing size="lg" color="primary" :ui="{ rounded: 'rounded-full' }"
                  icon="heroicons:arrow-right" @click="goToModell" label="Gå till modell" />
              </div>
            </div> -->
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useOnboardingStore } from "~/stores/onboardingStore";
import frameworkDescriptions from "public/frameworkDescriptions.json";
import { useRouter } from "vue-router";

const emit = defineEmits(['go-to-model']);

// Create a computed property to transform your JSON structure
const allForestryData = computed(() => {
  return Object.entries(frameworkDescriptions).map(
    ([forestType, methodsObj]) => {
      const methods = Object.entries(methodsObj).map(
        ([methodKey, methodData]) => ({ key: methodKey, ...methodData })
      );
      return { forestType, methods };
    }
  );
});

// Mapping for startskog selections
const startskogOptions = ["Inte kalavverkad", "Kalavverkad"];

// Mapping for framework selections
const frameworkOptions = [
  "Inga åtgärder",
  "Trakthyggesbruk",
  "Luckhuggning",
  "Överhållen skärm",
  "Blädning",
];

// Map to override the JSON titles with your desired labels
const methodLabels = {
  naturskydd: "Inga åtgärder",
  trakthygge: "Trakthyggesbruk",
  luckhuggning: "Luckhuggning",
  skärmträd: "Överhållen skärm",
  blädning: "Blädning",
};

const onboardingStepsDisplay = [
  // { label: "Information", icon: "heroicons:information-circle" },
  { label: "Välj historik", icon: "iconamoon:history-light" },
  { label: "Välj skogsskötsel", icon: "mdi:saw-blade" },
  // { label: "Gå till modell", icon: "heroicons:arrow-right" },
];

const currentStep = ref(0);

// Progress line calculations.
const lineLeft = computed(
  () => `${100 / (onboardingStepsDisplay.length * 2)}%`
);
const totalLineWidth = computed(
  () => 100 - 100 / onboardingStepsDisplay.length
);
const progressWidth = computed(() => {
  if (onboardingStepsDisplay.length <= 1) return "0%";
  return (
    (currentStep.value / (onboardingStepsDisplay.length - 1)) *
    totalLineWidth.value +
    "%"
  );
});

function circleClasses(index) {
  return index <= currentStep.value
    ? "border-neutral-500 bg-neutral-500 text-neutral-50"
    : "border-gray-300 bg-white text-neutral-500";
}

function nextStep() {
  if (currentStep.value < onboardingStepsDisplay.length - 1) {
    currentStep.value++;
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
}

const router = useRouter();
function goToModell() {
  router.push("/skogsskotsel/modell");
}

function onboardingStepClicked(index) {
  // For step 3, check that required selections have been made.

  currentStep.value = index;
}

function isStepEnabled(index) {
  if (index === 0) return true;
  if (index === 1) return true;
  if (index === 2) return onboardingStore.selectedStartskog !== null;
  if (index === 3)
    return (
      onboardingStore.selectedStartskog !== null &&
      onboardingStore.selectedFramework !== null
    );
  return false;
}

function optionCardClass(selectedValue, optionValue) {
  return selectedValue === optionValue
    ? "border-primary-500 ring ring-primary-500 rounded-xl"
    : "ring-none hover:shadow";
}

const activeTab = ref("komigang");
const tabs = [
  { label: "Gör val", value: "komigang" },
  { label: "Skogsskötsel information", value: "skogsskolsel" },
];

const onboardingStore = useOnboardingStore();

// Helper function to return the image path for the selected framework.
function frameworkImage() {
  const index = onboardingStore.selectedFramework;
  switch (index) {
    case 0:
      return "/images/ingen_åtgärd.png";
    case 1:
      return "/images/kalhygge.png";
    case 2:
      return "/images/luckhuggning.png";
    case 3:
      return "/images/skärm.png";
    case 4:
      return "/images/blädning.png";
    default:
      return "";
  }
}
</script>

<style scoped>
.transition-height {
  transition: height 0.5s ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-in-out;
}

.fade-enter-from,
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
