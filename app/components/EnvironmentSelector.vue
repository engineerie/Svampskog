<template>
  <div>
    <div v-if="isMobile"
      :class="[' block relative overflow-scroll -mx-4 w-screen', geography && forestType && standAge && vegetationType ? 'h-14' : 'h-0']">
      <div
        :class="['pt-0.5 top-16 z-20 w-screen inset-0 bg-neutral-50 dark:bg-neutral-950 border-b border-muted dark:border-neutral-800 transition-height', mobileCollapsed ? 'h-14' : 'h-14']">
        <UDrawer fullscreen :overlay="true" :ui="{ body: 'p-0', title: 'text-2xl', content: 'bg-neutral-50' }">
          <div class="flex justify-between w-full mx-auto max-w-full ">
            <div class="flex gap-2 p-2 overflow-scroll ">
              <UBadge v-for="category in categories" :key="category.key" size="xl" variant="outline" color="neutral"
                class="ring-muted text-lg" truncate :label="getLabel(category.key) || category.defaultLabel">
              </UBadge>
            </div>
          </div>
          <template #body>
            <div class=" w-full max-w-full">
              <!-- Use enabledOptions for USelect items as well -->
              <USelect size="xl" v-for="category in categories" :key="category.key"
                :items="enabledOptions[category.key]" v-model="envStore[category.key]"
                :placeholder="category.defaultLabel" class=" w-full my-1 text-lg ring-muted" variant="outline">
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

                <UDrawer nested fullscreen class="w-full" :ui="{ title: 'text-2xl', content: 'bg-neutral-50' }">
                  <UButton label="Kombinationer" size="xl" shape="full" trailing icon="mdi:apps" color="neutral"
                    variant="outline" class="ring-muted" />
                  <template #body>
                    <UButton size="xl" trailing :icon="restrictionEnabled ? 'mdi:lock' : 'mdi:lock-open'"
                      @click="toggleRestriction" shape="full" class="transition-all shrink-0 mb-2 w-full" variant="soft"
                      :color="restrictionEnabled ? 'secondary' : 'neutral'">
                      {{ restrictionEnabled ? "Begränsar till där det finns DNA-data" : "Inkluderar alla miljöer" }}
                    </UButton>
                    <div class="grid gap-2 ">
                      <UCard v-for="category in categories" :key="category.key" variant="outline" class="ring-muted/50">
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
                </UDrawer>
                <!-- <UModal fullscreen title="Miljööversikt"
                  :ui="{ content: 'overflow-y-scroll px-0', body: 'p-0', title: 'text-2xl' }" class=" col-span-2">
                  <UButton size="xl" label="Alla miljöer" trailing icon="i-hugeicons-tree-06" color="neutral"
                    variant="subtle" />
                  <template #body>
                    <Miljoer />
                  </template>
                </UModal> -->
              </div>
              <Transition name="fade" mode="out-in">
                <SpatialForest class="overflow-hidden h-fit" />
              </Transition>
            </div>
          </template>
        </UDrawer>
      </div>
    </div>

    <div v-if="!isMobile" class="md:pt-4 pt-2 block">
      <div ref="contentRef" class="original-content w-full">
        <!-- Parameter Popover Grid -->

        <div class="grid grid-cols-12 gap-2 mb-4 min-h-44">
          <UCard
            :class="[' relative h-full col-span-9 items-center ring-0 bg-transparent transition-all', geography && forestType && standAge && vegetationType ? 'col-span-9' : 'col-span-12']">
            <div class="flex transition-all">
              <div v-for="category in categories" :key="category.key" class="flex md:justify-center w-full m-3">
                <UPopover :ui="{ content: 'max-h-96 overflow-y-auto bar-chart-container' }" :content="{
                  align: 'start',
                  side: 'bottom',
                }">
                  <div class="w-full">
                    <transition name="slide-up" mode="out-in">
                      <div :key="getLabel(category.key)"
                        class="flex items-center md:justify-center cursor-pointer ring ring-muted/50 shadow bg-white hover:bg-neutral-100/70 py-4 rounded-md w-full">
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
                    <div class="px-2 py-1 min-w-60 max-w-110">
                      <!-- Use enabledOptions so that restriction applies here -->
                      <div v-for="option in enabledOptions[category.key]" :key="option.value">

                        <div v-if="imageMap[option.value]"
                          class="hover:bg-neutral-50 p-3 w-full justify-between flex items-center gap-4 rounded-sm overflow-hidden my-1 cursor-pointer"
                          :class="{
                            'bg-neutral-100': option.value === envStore[category.key],
                            'opacity-40 cursor-not-allowed': option.disabled
                          }" @click="() => { if (!option.disabled) selectOption(category.key, option.value) }">

                          <div>
                            <h1 class="text-md font-semibold text-neutral-900">
                              {{ option.label }}
                            </h1>
                            <p class="text-sm text-neutral-500 font-light">
                              {{ option.description || '' }}
                            </p>
                          </div>
                          <UPopover :open-delay="500" mode="hover" :content="{
                            align: 'start',
                            side: 'right',
                            sideOffset: 8
                          }" :ui="{ content: 'ring-muted/50' }">
                            <img v-if="imageMap[option.value]" :src="imageMap[option.value]"
                              :alt="`${option.label} miljö`"
                              class="rounded-md w-12 h-12 object-cover ring ring-muted/50" width="300" height="180"
                              loading="lazy" decoding="async" />

                            <template #content>
                              <img :src="imageMap[option.value]" :alt="`${option.label} miljö`"
                                class="rounded-md max-w-xs max-h-52 object-cover" width="300" height="180"
                                loading="lazy" decoding="async" />
                            </template>
                          </UPopover>
                        </div>


                        <div v-else :key="option.value"
                          class="hover:bg-neutral-50 p-3 w-full justify-between  flex gap-4 items-center rounded-md my-1 cursor-pointer"
                          :class="{
                            'bg-neutral-100': option.value === envStore[category.key],
                            'opacity-40 cursor-not-allowed': option.disabled
                          }" @click="() => { if (!option.disabled) selectOption(category.key, option.value) }">

                          <div>
                            <h1 class="text-md font-semibold text-neutral-900">
                              {{ option.label }}
                            </h1>
                            <p class="text-sm text-neutral-500 font-light">
                              {{ option.description || '' }}
                            </p>
                          </div>
                          <div v-if="category.key === 'forestType'"
                            class="size-12 flex justify-center items-center bg-muted rounded-md">
                            <UIcon name="i-heroicons-photo" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </UPopover>
              </div>
            </div>

            <div class="absolute bottom-0 right-3 flex justify-end gap-2">
              <UButton trailing :icon="restrictionEnabled ? 'mdi:lock' : 'mdi:lock-open'" @click="toggleRestriction"
                shape="full" class="transition-all bg-white"
                :class="restrictionEnabled ? 'ring-secondary-200/60' : 'ring-muted/60'" variant="outline"
                :color="restrictionEnabled ? 'secondary' : 'neutral'">
                {{ restrictionEnabled ? "Markinventeringsdata" : "Markinventeringsdata" }}
              </UButton>
              <UButton trailing icon="mdi:apps" @click="toggleHeight" class="ring-muted/60" color="neutral"
                variant="outline">
                {{ listBoxRowVisible ? "Dölj kombinationer" : "Visa kombinationer" }}
              </UButton>
              <!-- <UModal title="Miljööversikt" :ui="{ content: 'max-w-[83rem]', body: 'sm:p-0', title: 'text-2xl' }">
                <UButton class="ring-muted/60" label="Alla miljöer" trailing icon="i-hugeicons-tree-06" color="neutral"
                  variant="outline" />
                <template #body>
                  <Miljoer />
                </template>
              </UModal> -->
            </div>
          </UCard>
          <div class="col-span-3 flex w-full justify-end" v-if="geography && forestType && standAge && vegetationType">
            <Transition name="fade" mode="out-in">
              <SpatialForest />
            </Transition>
          </div>
        </div>

        <!-- Combination view (checkboxes) -->
        <div :style="{ height: listBoxRowVisible ? '290px' : '0px' }"
          class="overflow-hidden transition-height ease-in-out duration-500">
          <Transition name="fade">
            <div v-show="listBoxRowVisible">
              <div class="p-0.5 grid md:grid-cols-4 gap-2 md:gap-5">

                <UCard v-for="category in categories" :key="category.key" variant="outline" class="ring-muted/50">
                  <div v-for="option in enabledOptions[category.key]" :key="option.value"
                    class="flex justify-between mb-2 text-neutral-600 dark:text-neutral-300 items-center ">
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
      </div>


      <!-- Sticky header that folds down from behind the AppHeader -->
      <transition name="fold-down">
        <UContainer v-if="isSticky"
          class="shadow hidden md:block fixed top-0 pt-16 z-20 bg-neutral-50 dark:bg-black border-b border-x rounded border-neutral-200 dark:border-neutral-800 left-0 right-0">
          <div class="flex space-x-4 w-full mx-auto max-w-7xl py-3">
            <!-- Use enabledOptions for USelect items as well -->
            <USelect v-for="category in categories" :key="category.key" :items="enabledOptions[category.key]"
              v-model="envStore[category.key]" :placeholder="category.defaultLabel" class="flex-1 ring-muted/80"
              append-to-body />
            <UButton trailing :icon="restrictionEnabled ? 'mdi:lock' : 'mdi:lock-open'" @click="toggleRestriction"
              shape="full" class="transition-all" variant="ghost" :color="restrictionEnabled ? 'secondary' : 'neutral'">
              {{ restrictionEnabled ? "Markinventeringsdata" : "Markinventeringsdata" }}
            </UButton>
          </div>
        </UContainer>
      </transition>
    </div>
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


// watch(
//   () => [
//     envStore.geography,
//     envStore.forestType,
//     envStore.standAge,
//     envStore.vegetationType
//   ],
//   () => {
//     if (
//       envStore.geography !== '' &&
//       envStore.forestType !== '' &&
//       envStore.standAge !== '' &&
//       envStore.vegetationType !== ''
//     ) {
//       const newPath = `/mykorrhizasvampar/${encodeURIComponent(
//         envStore.geography
//       )}/${encodeURIComponent(envStore.forestType)}/${encodeURIComponent(
//         envStore.standAge
//       )}/${encodeURIComponent(envStore.vegetationType)}`
//       // if (window.location.pathname !== newPath) {
//       //   window.history.replaceState(null, '', newPath)
//       // }
//     }
//   },
//   { deep: true }
// )
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

:global(.bar-chart-container) {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

:global(.bar-chart-container::-webkit-scrollbar) {
  display: none;
  /* Chrome, Safari, Opera */
}
</style>
