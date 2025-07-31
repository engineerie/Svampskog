<template>
  <!-- Preload all images so they are included in static prerender -->
  <div class="hidden">
    <NuxtImg v-for="(src, key) in imageMap" :key="key" :src="src" width="300" height="180" format="webp" quality="80"
      preload />
  </div>
<div :class="['block md:hidden relative transition-height ', mobileCollapsed ? 'h-11' : 'h-31']">
  <div :class="[' z-20 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 fixed left-0 right-0 transition-height', mobileCollapsed ? 'h-12' : 'h-32']">
    <Transition name="fade" mode="out-in">
      <div v-if="!mobileCollapsed" class="grid grid-cols-2 gap-2 w-full mx-auto max-w-full p-2">
        <!-- Use enabledOptions for USelect items as well -->
        <USelect v-for="category in categories" :key="category.key" :items="enabledOptions[category.key]"
          v-model="envStore[category.key]" :placeholder="category.defaultLabel" class="flex-1" append-to-body variant="soft"/>
          <div class="flex gap-2">
<UButton trailing :icon="restrictionEnabled ? 'mdi:lock' : 'mdi:lock-open'" @click="toggleRestriction"
          shape="full" class="transition-all shrink-0" variant="soft" :color="restrictionEnabled ? 'secondary' : 'neutral'">
          {{ restrictionEnabled ? "DNA-data" : "DNA-data" }}
        </UButton>
        <UModal fullscreen title="Kombinationer" class="w-full">
          <UButton shape="full" trailing icon="mdi:apps" variant="soft">
            Kombinationer
          </UButton>
          <template #body>
            <UButton trailing :icon="restrictionEnabled ? 'mdi:lock' : 'mdi:lock-open'" @click="toggleRestriction"
          shape="full" class="transition-all shrink-0 mb-2" variant="soft" :color="restrictionEnabled ? 'secondary' : 'neutral'">
          {{ restrictionEnabled ? "Begränsar val till där det finns DNA-data" : "DNA-data" }}
        </UButton>
            <div class="grid gap-2 ">
              <UCard v-for="category in categories" :key="category.key" variant="soft">
                <div v-for="option in enabledOptions[category.key]" :key="option.value"
                  class="flex justify-between mb-2 text-neutral-500">
                  <label :for="`${category.key}-${option.value}`"
                    :class="{ 'opacity-40 cursor-not-allowed': option.disabled, 'cursor-pointer': !option.disabled }"
                    class="text-sm">
                    {{ option.label }}
                  </label>
                  <UCheckbox
                    :id="`${category.key}-${option.value}`"
                    color="primary"
                    :model-value="envStore[category.key] === option.value"
                    @update:model-value="() => { if (!option.disabled) selectOption(category.key, option.value) }"
                    :disabled="option.disabled"
                  />
                </div>
              </UCard>
            </div>
          </template>
        </UModal>
          </div>
        
        <div class="flex justify-end">
           <UButton @click="toggleMobileCollapsed" trailing icon=""
          shape="full" class="transition-all" variant="soft" color="neutral">
          Dölj
        </UButton>
        </div>
       
      </div>
      <div v-else class="flex justify-between w-full mx-auto max-w-full ">
        <div class="flex gap-1 p-2 overflow-scroll" @click="toggleMobileCollapsed">
          <UBadge
            v-for="category in categories"
            :key="category.key"
            size="xl"
            variant="soft"
            color="neutral"
            class=" "
            truncate
            :label="getLabel(category.key) || category.defaultLabel"
          >
            <!-- {{ getLabel(category.key) || category.defaultLabel }} -->
          </UBadge>
        </div>
        <!-- <div class="flex justify-end">
          <UButton @click="toggleMobileCollapsed" trailing icon="mdi:chevron-down"
            shape="full" class="transition-all" variant="soft" color="neutral">
            Visa
          </UButton>
        </div> -->
      </div>
    </Transition>
  </div>
</div>
      
  <div class="md:pt-8 pt-2 hidden md:block">
    <!-- Original EnvironmentSelector content -->
    <div ref="contentRef" class="original-content">
      <!-- Parameter Popover Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 md:gap-5 gap-2 mb-2">
        <div v-for="category in categories" :key="category.key" class="flex md:justify-center w-full">
          <UPopover >
            <div>
              <transition name="slide-up" mode="out-in">
                <div :key="getLabel(category.key)" class="flex items-center md:justify-center cursor-pointer">
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
                    side: 'right',
                    sideOffset: 1
                  }">
                    <div class="hover:bg-neutral-50 p-3 rounded-md my-1 cursor-pointer" :class="{
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
                      <NuxtImg :src="imageMap[option.value]" class="rounded-md max-w-xs max-h-52 object-cover"
                        width="300" height="180" format="webp" quality="80" />
                    </template>
                  </UPopover>

                  <div v-else :key="option.value" class="hover:bg-neutral-50 p-3 rounded-md my-1 cursor-pointer" :class="{
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

      <!-- Toggle Buttons for Lock & Kombinationsvy -->
      <div class="flex justify-end gap-2 mb-2">

        <UButton trailing :icon="restrictionEnabled ? 'mdi:lock' : 'mdi:lock-open'" @click="toggleRestriction"
          shape="full" class="transition-all" variant="ghost" :color="restrictionEnabled ? 'secondary' : 'neutral'">
          {{ restrictionEnabled ? "Markinventeringsdata" : "Markinventeringsdata" }}
        </UButton>
        <UButton trailing :icon="listBoxRowVisible ? 'mdi:chevron-up' : 'mdi:chevron-down'" @click="toggleHeight"
          color="neutral" variant="ghost">
          {{ listBoxRowVisible ? "Kombinationsvy" : "Kombinationsvy" }}
        </UButton>
      </div>

      <!-- Combination view (checkboxes) -->
      <div :style="{ height: listBoxRowVisible ? '260px' : '0px' }"
        class="overflow-hidden transition-height ease-in-out duration-500">
        <Transition name="fade">
          <div v-show="listBoxRowVisible">
            <div class="grid md:grid-cols-4 gap-2 md:gap-5">

              <UCard v-for="category in categories" :key="category.key" variant="soft">
                <div v-for="option in enabledOptions[category.key]" :key="option.value"
                  class="flex justify-between mb-2 text-neutral-600 dark:text-neutral-300">
                  <label :for="`${category.key}-${option.value}`" :class="{
                    'opacity-40 cursor-not-allowed': option.disabled,
                    'cursor-pointer': !option.disabled
                  }" class="text-sm">
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
      <div v-if="isSticky" class="hidden md:block fixed top-0 pt-16 z-20 bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800 left-0 right-0">
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
import { useRouter } from 'vue-router'
import {
  useEnvParamsStore,
  geographyOptions,
  forestTypeOptions,
  standAgeOptions,
  vegetationTypeOptions,
  imageMap
} from '~/stores/envParamsStore'

const props = defineProps<{ initialMobileCollapsed?: boolean }>();


const envStore = useEnvParamsStore()

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

function toggleMobileCollapsed(): void {
  mobileCollapsed.value = !mobileCollapsed.value
}

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

const collapsedSummary = computed(() => {
  return categories
    .map(category => {
      const label = getLabel(category.key) || category.defaultLabel;
      return label.length > 6 ? label.slice(0, 6) : label;
    })
    .join(' / ');
});

function iconColor(categoryKey: Category['key']): string {
  switch (categoryKey) {
    case 'geography':
      return 'text-fuchsia-500'
    case 'forestType':
      return 'text-green-500'
    case 'standAge':
      return 'text-violet-500'
    case 'vegetationType':
      return 'text-teal-500'
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

// Optionally watch selections and update the URL (as in your original logic)
const router = useRouter()
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