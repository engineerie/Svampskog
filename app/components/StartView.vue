

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMediaQuery } from '@vueuse/core'
import {
  useEnvParamsStore,
  geographyOptions,
  forestTypeOptions,
  standAgeOptions,
  vegetationTypeOptions,
  imageMap
} from '~/stores/envParamsStore'

// Access the shared environment store
const envStore = useEnvParamsStore()

// Define the four categories and their options
const categories = [
  { key: 'geography', title: 'Var i Sverige', defaultLabel: 'Välj plats', options: geographyOptions },
  { key: 'forestType', title: 'Skogstyp', defaultLabel: 'Välj skogstyp', options: forestTypeOptions },
  { key: 'standAge', title: 'Skogsålder', defaultLabel: 'Välj ålder', options: standAgeOptions },
  { key: 'vegetationType', title: 'Fältskikt', defaultLabel: 'Välj fältskikt', options: vegetationTypeOptions }
]

// Toggle for DNA restriction
const restrictionEnabled = ref(true)
function toggleRestriction() {
  restrictionEnabled.value = !restrictionEnabled.value
}

// Toggle for collapsing badge bar (mobile)
const mobileCollapsed = ref(false)
function toggleMobileCollapsed() {
  mobileCollapsed.value = !mobileCollapsed.value
}

// Handle selection clicks
function selectOption(
  categoryKey: keyof typeof envStore,
  optionValue: string
) {
  envStore.$patch({ [categoryKey]: optionValue })
}

// Helper to display current label for a category
function getLabel(categoryKey: keyof typeof envStore): string {
  switch (categoryKey) {
    case 'geography': return envStore.geographyLabel
    case 'forestType': return envStore.forestTypeLabel
    case 'standAge': return envStore.standAgeLabel
    case 'vegetationType': return envStore.vegetationTypeLabel
    default: return ''
  }
}

// Compute which options should be disabled when restriction is on
const enabledOptions = computed(() => ({
  geography: geographyOptions.map(opt => ({
    ...opt,
    disabled: false // no cross-restriction in start view
  })),
  forestType: forestTypeOptions.map(opt => ({ ...opt, disabled: false })),
  standAge: standAgeOptions.map(opt => ({ ...opt, disabled: false })),
  vegetationType: vegetationTypeOptions.map(opt => ({ ...opt, disabled: false }))
}))

// --- Mobile/desktop detection ---
const isMobile = useMediaQuery('(max-width: 767px)')

// --- Navigation helpers ---
const router = useRouter()
function computePath() {
  return `/mykorrhizasvampar/${encodeURIComponent(envStore.geography)}/${encodeURIComponent(envStore.forestType)}/${encodeURIComponent(envStore.standAge)}/${encodeURIComponent(envStore.vegetationType)}`
}

function goToDna() {
  if (
    envStore.geography &&
    envStore.forestType &&
    envStore.standAge &&
    envStore.vegetationType
  ) {
    router.push(computePath())
  }
}

// Auto-redirect on desktop when all options selected
watch(
  () => [
    envStore.geography,
    envStore.forestType,
    envStore.standAge,
    envStore.vegetationType
  ],
  (vals) => {
    if (!isMobile.value && vals.every(v => !!v)) {
      router.push(computePath())
    }
  },
  { deep: true }
)
</script>
<template>


  <UPage class="flex-1 ">
  
    <UPageSection
    title="Utforska svampar i olika skogar"
    description="Här kan du ta reda på vilka mykorrhizasvampar som kan finns i en skog baserat på dels DNA-analyser av svampmycel i jordprover, dels vår samlade kunskap om var olika arters fruktkroppar förekommer."
orientation="horizontal"

  class="md:-mt-24 -mt-10 pointer-events-none"
    > <img
      src="public/_ipx/f_webp&s_900x600/images/svampbilder/RödlistadeSvampar/Amanita ceciliae-2-37.jpg"
      alt="Illustration"
      class="w-full rounded-md shadow "
    /></UPageSection>

    <!-- <template #left><div></div></template>
    <template #right><div></div></template>

    <div class="hidden mt-4">
      <UCard>
        <ul class="space-y-4 text-lg text-neutral-700 dark:text-neutral-300 ">
          <li>
            Klicka på respektive kategori för att göra dina val, eller
            använd knappen
            <UBadge label="Kombinationsvy" icon="mdi:chevron-down" trailing color="neutral" variant="soft" size="lg"/>
            för att se alla alternativ som radioknappar.
          </li>
          <li class="">
            Klicka på
            <UBadge label="Markinventeringsdata" icon="mdi:lock" trailing color="secondary" variant="soft" size="lg"/>
            för att begränsa urvalet till miljöer där det finns data från
            markinventeringen.
          </li>
        </ul>
      </UCard>
    </div> -->

    <!-- Mobile inline environment selector -->
    <!-- <div class="block md:hidden">
      
      <div class="w-full max-w-full p-3">
               <h1 class="text-3xl font-semibold my-3">Välj miljö</h1>

        <USelect
          size="xl"
          v-for="category in categories"
          :key="category.key"
          :items="enabledOptions[category.key]"
          v-model="envStore[category.key]"
          :placeholder="category.defaultLabel"
          class="flex-1 w-full my-1 text-lg"
          append-to-body
          variant="outline"
        >
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
          <UButton size="xl" trailing :icon="restrictionEnabled ? 'mdi:lock' : 'mdi:lock-open'" @click="toggleRestriction"
            shape="full" class="transition-all shrink-0" variant="ghost" :color="restrictionEnabled ? 'secondary' : 'neutral'">
            {{ restrictionEnabled ? "DNA-data" : "DNA-data" }}
          </UButton>
          <UModal fullscreen title="Kombinationer" class="w-full">
            <UButton size="xl" shape="full" trailing icon="mdi:apps" color="neutral" variant="outline">
              Kombinationer
            </UButton>
            <template #body>
              <UButton size="xl" trailing :icon="restrictionEnabled ? 'mdi:lock' : 'mdi:lock-open'" @click="toggleRestriction"
                shape="full" class="transition-all shrink-0 mb-2 w-full" variant="soft" :color="restrictionEnabled ? 'secondary' : 'neutral'">
                {{ restrictionEnabled ? "Begränsar till där det finns DNA-data" : "Inkluderar miljöer utan DNA-data" }}
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
      </div>
    </div> -->
  </UPage>

</template>
