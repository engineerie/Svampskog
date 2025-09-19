<template>
  <div v-if="isMobile"
    :class="[' block relative overflow-scroll -mx-4 w-screen', geography && forestType && standAge && vegetationType ? 'h-14' : 'h-0']">
    <div
      :class="['pt-0.5 top-16 z-20 w-screen inset-0 bg-neutral-50 dark:bg-neutral-950  dark:border-neutral-800 transition-height', mobileCollapsed ? 'h-14' : 'h-14']">
      <UModal :overlay="true" title="Välj miljö" :ui="{ body: 'p-0', title: 'text-2xl' }">
        <div class="flex justify-between w-full mx-auto max-w-full ">
          <div class="flex gap-2 p-2 overflow-scroll">
            <UBadge v-for="category in categories" :key="category.key" size="xl" variant="outline" color="neutral"
              class=" text-lg" truncate :label="getLabel(category.key) || category.defaultLabel">
            </UBadge>
          </div>
        </div>
        <template #body>
          <div class=" w-full max-w-full p-4">
            <!-- Use enabledOptions for USelect items as well -->
            <USelect size="xl" v-for="category in categories" :key="category.key" :items="enabledOptions[category.key]"
              v-model="envStore[category.key]" :placeholder="category.defaultLabel" class=" w-full my-1 text-lg"
              variant="outline">
              <template #item="{ item }">
                <div class="flex flex-col">
                  <div class="text-lg font-medium">{{ item.label }}</div>
                  <div v-if="item.description" class="text-sm text-neutral-500">
                    {{ item.description }}
                  </div>
                </div>
              </template>
            </USelect>
            <div class="grid grid-cols-2 gap-2 mt-1 mb-2">
              <UButton label="DNA-data" size="xl" trailing :icon="restrictionEnabled ? 'mdi:lock' : 'mdi:lock-open'"
                @click="toggleRestriction" variant="subtle" :color="restrictionEnabled ? 'secondary' : 'neutral'" />

              <UModal fullscreen title="Kombinationer" class="w-full" :ui="{ title: 'text-2xl' }">
                <UButton label="Kombinationer" size="xl" shape="full" trailing icon="mdi:apps" color="neutral"
                  variant="outline" />
                <template #body>
                  <UButton size="xl" trailing :icon="restrictionEnabled ? 'mdi:lock' : 'mdi:lock-open'"
                    @click="toggleRestriction" shape="full" class="transition-all shrink-0 mb-2 w-full" variant="soft"
                    :color="restrictionEnabled ? 'secondary' : 'neutral'">
                    {{ restrictionEnabled ? "Begränsar till där det finns DNA-data" : "Inkluderar alla miljöer" }}
                  </UButton>
                  <div class="grid gap-2 ">
                    <UCard v-for="category in categories" :key="category.key" variant="soft">
                      <div v-for="option in enabledOptions[category.key]" :key="option.value"
                        class="flex justify-between mb-2 text-neutral-500 items-center">
                        <label :for="`${category.key}-${option.value}`"
                          :class="{ 'opacity-40 cursor-not-allowed': option.disabled, 'cursor-pointer': !option.disabled }"
                          class="text-lg">
                          {{ option.label }}
                        </label>
                        <UCheckbox :id="`${category.key}-${option.value}`" color="primary"
                          :model-value="envStore[category.key] === option.value"
                          @update:model-value="() => { if (!option.disabled) selectOption(category.key, option.value) }"
                          :disabled="option.disabled" />
                      </div>
                    </UCard>
                  </div>
                </template>
              </UModal>
            </div>
            <Transition name="fade" mode="out-in">
              <SpatialForest class="rounded overflow-hidden border border-neutral-200 h-fit" />
            </Transition>
          </div>
        </template>
      </UModal>
    </div>
  </div>

  <div v-if="!isMobile" class="md:pt-4 pt-2 block">
    <div ref="contentRef" class="original-content w-full">
      <!-- Parameter Popover Grid -->

      <div class="grid grid-cols-12 md:gap-4 gap-2 mb-4 ">
        <UCard
          :class="[' relative h-full col-span-9 items-center ring-0', geography && forestType && standAge && vegetationType ? 'col-span-9' : 'col-span-12']">
          <div class="flex ">
            <div v-for="category in categories" :key="category.key" class="flex md:justify-center w-full m-3 mb-8">
              <UPopover :content="{
                align: 'start',
                side: 'bottom',
              }">
                <div class="w-full">
                  <transition name="slide-up" mode="out-in">
                    <div :key="getLabel(category.key)"
                      class="flex items-center md:justify-center cursor-pointer hover:bg-neutral-50 py-4 rounded-xl w-full">
                      <div class="md:text-center">
                        <h1 class="text-neutral-500">{{ category.title }}</h1>
                        <h1 class="md:text-2xl font-medium">
                          {{ getLabel(category.key) || category.defaultLabel }}
                        </h1>
                      </div>
                    </div>
                  </transition>
                </div>
                <template #content>
                  <div class="px-2 py-1 min-w-60 max-w-96">
                    <!-- Use enabledOptions so that restriction applies here -->
                    <div v-for="option in enabledOptions[category.key]" :key="option.value">
                      <UPopover :open-delay="300" mode="hover" v-if="imageMap[option.value]" :content="{
                        align: 'start',
                        side: 'left',
                        sideOffset: 1
                      }">
                        <div class="hover:bg-neutral-50 p-3 rounded-sm overflow-hidden my-1 cursor-pointer" :class="{
                          'bg-neutral-100': option.value === envStore[category.key],
                          'opacity-40 cursor-not-allowed': option.disabled
                        }" @click="() => { if (!option.disabled) selectOption(category.key, option.value) }">
                          <h1 class="text-md font-semibold text-neutral-900">
                            {{ option.label }}
                          </h1>
                          <p class="text-sm text-neutral-500 font-light">
                            {{ option.description || '' }}
                          </p>
                        </div>
                        <template #content>
                          <NuxtImg :src="imageMap[option.value]" class="rounded-sm max-w-xs max-h-52 object-cover"
                            width="300" height="180" format="webp" quality="80" />
                        </template>
                      </UPopover>

                      <div v-else :key="option.value" class="hover:bg-neutral-50 p-3 rounded-md my-1 cursor-pointer"
                        :class="{
                          'bg-neutral-100': option.value === envStore[category.key],
                          'opacity-40 cursor-not-allowed': option.disabled
                        }" @click="() => { if (!option.disabled) selectOption(category.key, option.value) }">
                        <h1 class="text-md font-semibold text-neutral-900">
                          {{ option.label }}
                        </h1>
                        <p class="text-sm text-neutral-500 font-light">
                          {{ option.description || '' }}
                        </p>
                      </div>
                    </div>
                  </div>
                </template>
              </UPopover>
            </div>
          </div>

          <div class="absolute bottom-3 right-3 flex justify-end gap-2">
            <UButton trailing :icon="restrictionEnabled ? 'mdi:lock' : 'mdi:lock-open'" @click="toggleRestriction"
              shape="full" class="transition-all" variant="ghost" :color="restrictionEnabled ? 'secondary' : 'neutral'">
              {{ restrictionEnabled ? "Markinventeringsdata" : "Markinventeringsdata" }}
            </UButton>
            <UButton trailing icon="mdi:apps" @click="toggleHeight" color="neutral" variant="ghost">
              {{ listBoxRowVisible ? "Dölj kombinationer" : "Visa kombinationer" }}
            </UButton>
          </div>
        </UCard>
        <div class="col-span-3 flex w-full justify-end" v-if="geography && forestType && standAge && vegetationType">
          <Transition name="fade" mode="out-in">
            <SpatialForest class="rounded-xl overflow-hidden border border-neutral-200 h-fit" />
          </Transition>
        </div>
      </div>

      <!-- Combination view (checkboxes) -->
      <div :style="{ height: listBoxRowVisible ? '290px' : '0px' }"
        class="overflow-hidden transition-height ease-in-out duration-500">
        <Transition name="fade">
          <div v-show="listBoxRowVisible">
            <div class="p-0.5 grid md:grid-cols-4 gap-2 md:gap-5">

              <UCard v-for="category in categories" :key="category.key" variant="soft">
                <div v-for="option in enabledOptions[category.key]" :key="option.value"
                  class="flex justify-between mb-2 text-neutral-600 dark:text-neutral-300 items-center">
                  <label :for="`${category.key}-${option.value}`" :class="{
                    'opacity-40 cursor-not-allowed': option.disabled,
                    'cursor-pointer': !option.disabled
                  }" class="text-md">
                    {{ option.label }}
                  </label>
                  <UCheckbox :id="`${category.key}-${option.value}`" color="primary"
                    :model-value="envStore[category.key] === option.value"
                    @update:model-value="() => { if (!option.disabled) selectOption(category.key, option.value) }"
                    :disabled="option.disabled" />
                </div>
              </UCard>
            </div>
          </div>
        </Transition>
      </div>

      <EnvImgInfo v-if="showImgInfo && geography && forestType && standAge && vegetationType"
        class="hidden md:grid mb-4" :geography="geography" :forestType="forestType" :standAge="standAge"
        :vegetationType="vegetationType" />

    </div>


    <!-- Sticky header that folds down from behind the AppHeader -->
    <transition name="fold-down">
      <div v-if="isSticky"
        class="hidden md:block fixed top-0 pt-16 z-20 bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800 left-0 right-0">
        <div class="flex space-x-4 w-full mx-auto max-w-7xl p-2">
          <!-- Use enabledOptions for USelect items as well -->
          <USelect v-for="category in categories" :key="category.key" :items="enabledOptions[category.key]"
            v-model="envStore[category.key]" :placeholder="category.defaultLabel" class="flex-1" append-to-body />
          <UButton trailing :icon="restrictionEnabled ? 'mdi:lock' : 'mdi:lock-open'" @click="toggleRestriction"
            shape="full" class="transition-all" variant="ghost" :color="restrictionEnabled ? 'secondary' : 'neutral'">
            {{ restrictionEnabled ? "Markinventeringsdata" : "Markinventeringsdata" }}
          </UButton>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import {
  useEnvParamsStore,
  geographyOptions,
  forestTypeOptions,
  standAgeOptions,
  vegetationTypeOptions,
  imageMap
} from '~/stores/envParamsStore'

// --- Mobile/desktop detection ---
const isMobile = useMediaQuery('(max-width: 767px)')

// Control whether the desktop image info is shown
const showImgInfo = ref(false)

const props = defineProps<{ initialMobileCollapsed?: boolean }>();


const envStore = useEnvParamsStore()

const geography = computed(() => envStore.geography)
const forestType = computed(() => envStore.forestType)
const standAge = computed(() => envStore.standAge)
const vegetationType = computed(() => envStore.vegetationType)

// For the original UI content and sticky header trigger
const contentRef = ref<HTMLElement | null>(null)
const isSticky = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (contentRef.value) {
    observer = new IntersectionObserver(
      ([entry]) => {
        // When the original content is no longer visible, show the sticky header
        isSticky.value = !(entry?.isIntersecting ?? true)
      },
      { threshold: 0 }
    )
    observer.observe(contentRef.value)
  }
})

onBeforeUnmount(() => {
  if (observer && contentRef.value) {
    observer.unobserve(contentRef.value)
  }
})

// --- Environment Selector Data & Methods ---

interface Category {
  key: 'geography' | 'forestType' | 'standAge' | 'vegetationType'
  title: string
  defaultLabel: string
  icon: string
  options: { value: string; label: string; description?: string }[]
}

const categories: Category[] = [
  {
    key: 'geography',
    title: 'Var i Sverige',
    defaultLabel: 'Välj plats',
    icon: 'material-symbols:location-on-outline',
    options: geographyOptions
  },
  {
    key: 'forestType',
    title: 'Skogstyp',
    defaultLabel: 'Välj skogstyp',
    icon: 'lucide:trees',
    options: forestTypeOptions
  },
  {
    key: 'standAge',
    title: 'Skogsålder',
    defaultLabel: 'Välj ålder',
    icon: 'carbon:crop-growth',
    options: standAgeOptions
  },
  {
    key: 'vegetationType',
    title: 'Fältskikt',
    defaultLabel: 'Välj fältskikt',
    icon: 'fluent-emoji-high-contrast:herb',
    options: vegetationTypeOptions
  }
]

// Toggle combination view and restriction state
const listBoxRowVisible = ref(false)
const restrictionEnabled = ref(true)

const mobileCollapsed = ref(props.initialMobileCollapsed ?? false)

function toggleHeight(): void {
  listBoxRowVisible.value = !listBoxRowVisible.value
}

function toggleRestriction(): void {
  restrictionEnabled.value = !restrictionEnabled.value
}

// Update the store when a select option is clicked
function selectOption(
  categoryKey: Category['key'],
  optionValue: string
): void {
  envStore.$patch({ [categoryKey]: optionValue })
}

// Helper functions for display
function getLabel(categoryKey: Category['key']): string {
  switch (categoryKey) {
    case 'geography':
      return envStore.geographyLabel
    case 'forestType':
      return envStore.forestTypeLabel
    case 'standAge':
      return envStore.standAgeLabel
    case 'vegetationType':
      return envStore.vegetationTypeLabel
    default:
      return ''
  }
}

// Compute enabled options for all UI parts (checkboxes, Popover, USelect)
// When restrictionEnabled is true, options are marked disabled based on valid combinations.
const enabledOptions = computed(() => ({
  geography: geographyOptions.map((option) => ({
    ...option,
    disabled:
      restrictionEnabled.value &&
        (envStore.forestType ||
          envStore.standAge ||
          envStore.vegetationType)
        ? !validCombinations.value.some((comb) =>
          (!envStore.forestType || comb.forest === envStore.forestType) &&
          (!envStore.standAge || comb.age === envStore.standAge) &&
          (!envStore.vegetationType || comb.veg === envStore.vegetationType) &&
          comb.geo === option.value
        )
        : false
  })),
  forestType: forestTypeOptions.map((option) => ({
    ...option,
    disabled:
      restrictionEnabled.value &&
        (envStore.geography ||
          envStore.standAge ||
          envStore.vegetationType)
        ? !validCombinations.value.some((comb) =>
          (!envStore.geography || comb.geo === envStore.geography) &&
          (!envStore.standAge || comb.age === envStore.standAge) &&
          (!envStore.vegetationType || comb.veg === envStore.vegetationType) &&
          comb.forest === option.value
        )
        : false
  })),
  standAge: standAgeOptions.map((option) => ({
    ...option,
    disabled:
      restrictionEnabled.value &&
        (envStore.geography ||
          envStore.forestType ||
          envStore.vegetationType)
        ? !validCombinations.value.some((comb) =>
          (!envStore.geography || comb.geo === envStore.geography) &&
          (!envStore.forestType || comb.forest === envStore.forestType) &&
          (!envStore.vegetationType || comb.veg === envStore.vegetationType) &&
          comb.age === option.value
        )
        : false
  })),
  vegetationType: vegetationTypeOptions.map((option) => ({
    ...option,
    disabled:
      restrictionEnabled.value &&
        (envStore.geography || envStore.forestType || envStore.standAge)
        ? !validCombinations.value.some((comb) =>
          (!envStore.geography || comb.geo === envStore.geography) &&
          (!envStore.forestType || comb.forest === envStore.forestType) &&
          (!envStore.standAge || comb.age === envStore.standAge) &&
          comb.veg === option.value
        )
        : false
  }))
}))

// Load valid combinations from JSON for restrictions
const validCombinations = ref<any[]>([])
onMounted(async () => {
  const response = await fetch('/validCombinations.json')
  validCombinations.value = await response.json()
})


watch(
  () => [
    envStore.geography,
    envStore.forestType,
    envStore.standAge,
    envStore.vegetationType
  ],
  () => {
    if (
      envStore.geography !== '' &&
      envStore.forestType !== '' &&
      envStore.standAge !== '' &&
      envStore.vegetationType !== ''
    ) {
      const newPath = `/mykorrhizasvampar/${encodeURIComponent(
        envStore.geography
      )}/${encodeURIComponent(envStore.forestType)}/${encodeURIComponent(
        envStore.standAge
      )}/${encodeURIComponent(envStore.vegetationType)}`
      if (window.location.pathname !== newPath) {
        window.history.replaceState(null, '', newPath)
      }
    }
  },
  { deep: true }
)
</script>

<style scoped>
/* Transition for height changes (combination view) */
.transition-height {
  transition: height 0.5s ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
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

/* Fold-down transition effect */
.fold-down-enter-active,
.fold-down-leave-active {
  transition: transform 0.3s ease;
}

.fold-down-enter-from,
.fold-down-leave-to {
  transform: translateY(-100%);
}

.fold-down-enter-to,
.fold-down-leave-from {
  transform: translateY(0);
}
</style>