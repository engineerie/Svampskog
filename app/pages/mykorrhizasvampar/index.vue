<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMediaQuery } from '@vueuse/core'
import {
  useEnvParamsStore,
  geographyOptions,
  forestTypeOptions,
  standAgeOptions,
  vegetationTypeOptions,
} from '~/stores/envParamsStore'

const { data: page } = await useAsyncData('mykorrhizasvampar', () => queryCollection('mykorrhizasvampar').first())
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

// Access the shared environment store
const envStore = useEnvParamsStore()

// Toggle for DNA restriction
const restrictionEnabled = ref(true)
function toggleRestriction() {
  restrictionEnabled.value = !restrictionEnabled.value
}

type Option = { value: string; label: string; description?: string; disabled?: boolean }

const categories = [
  { key: 'geography', defaultLabel: 'Välj plats' },
  { key: 'forestType', defaultLabel: 'Välj skogstyp' },
  { key: 'standAge', defaultLabel: 'Välj beståndsålder' },
  { key: 'vegetationType', defaultLabel: 'Välj fältskikt' }
] as const

type CategoryKey = typeof categories[number]['key']

// Handle selection clicks
function selectOption(
  categoryKey: CategoryKey,
  optionValue: string
) {
  envStore.$patch({ [categoryKey]: optionValue } as Partial<Record<CategoryKey, string | null>>)
}

const enabledOptions = computed<Record<CategoryKey, Option[]>>(() => ({
  geography: geographyOptions.map(opt => ({ ...opt, disabled: false })),
  forestType: forestTypeOptions.map(opt => ({ ...opt, disabled: false })),
  standAge: standAgeOptions.map(opt => ({ ...opt, disabled: false })),
  vegetationType: vegetationTypeOptions.map(opt => ({ ...opt, disabled: false }))
}))

// --- Mobile/desktop detection ---
const isMobile = useMediaQuery('(max-width: 767px)')
const indexTab = ref<'environment' | 'video'>('environment')
const indexTabItems = [
  { label: 'Välj miljö', value: 'environment', icon: 'i-heroicons-magnifying-glass' },
  { label: 'Instruktionsvideo', value: 'video', icon: 'i-lucide-clapperboard' }
]

// --- Navigation helpers ---
const router = useRouter()
function computePath() {
  const g = envStore.geography ?? ''
  const ft = envStore.forestType ?? ''
  const sa = envStore.standAge ?? ''
  const vt = envStore.vegetationType ?? ''
  return `/mykorrhizasvampar/${encodeURIComponent(g)}/${encodeURIComponent(ft)}/${encodeURIComponent(sa)}/${encodeURIComponent(vt)}`
}

// --- Enable button only when all selections are made ---
const allSelected = computed(() =>
  Boolean(
    envStore.geography &&
    envStore.forestType &&
    envStore.standAge &&
    envStore.vegetationType
  )
)

function redirect() {
  if (allSelected.value) {
    router.push(computePath())
  }
}

</script>
<template>

  <UPage v-if="page" class="flex-1">
    <UContainer class="w-full px-0">
      <NuxtImg v-if="isMobile" :src="page.hero.src"
        class=" shadow ring ring-muted/50 w-full aspect-video object-cover " />
      <UPageHero :ui="{ container: '', title: ' sm:text-7xl' }" :title="page.hero.title"
        :description="page.hero.description" reverse :headline="isMobile ? 'Svampar' : ''"
        :orientation="isMobile ? 'horizontal' : 'horizontal'" class="">
        <!-- <template #headline v-if="page.hero.headline">
          <div class="flex justify-center items-center">
            <Motion :initial="{
              scale: 0.5,
              opacity: 0,

            }" :animate="{
              scale: 1,
              opacity: 1,
            }" :transition="{
              duration: 0.2,
              delay: 0.2
            }">
              <NuxtImg src="/images/svampindex/Cortinarius sanguineus-179-.jpg" width="300" height="300" format="webp"
                alt="Illustration"
                class="size-18 rounded-lg ring ring-muted/50 inline-flex mb-12 lg:mb-18 h-fit shadow-xl" />
            </Motion>
            <Motion :initial="{
              scale: 0.5,
              opacity: 0,
            }" :animate="{
              scale: 1,
              opacity: 1,
            }" :transition="{
              duration: 0.2,
              delay: 0.3
            }" class="-mx-4 z-50">
              <NuxtImg src="/images/svampgrid/Tricholoma matsutake-166-6276.jpg" width="300" height="300" format="webp"
                alt="Illustration"
                class="size-28 rounded-lg ring ring-muted/50 inline-flex mb-12 lg:mb-18 h-fit  z-50 shadow-xl" />
            </Motion>
            <Motion :initial="{
              scale: 0.5,
              opacity: 0,
            }" :animate="{
              scale: 1,
              opacity: 1,
            }" :transition="{
              duration: 0.2,
              delay: 0.25
            }">
              <NuxtImg src="/images/svampgrid/Gomphus clavatus-1.jpg" width="300" height="300" format="webp"
                alt="Illustration"
                class="size-20 rounded-lg ring ring-muted/50 inline-flex mb-12 lg:mb-18 h-fit shadow-xl" />
            </Motion>
          </div>

        </template> -->
        <!-- <NuxtImg :src="page.hero.src" width="700" format="webp" alt="Illustration"
          class=" rounded ring ring-neutral-300 " /> -->
        <NuxtImg :src="page.hero.src"
          class="rounded-lg lg:rounded-xl shadow ring ring-muted/50 w-full aspect-video object-cover object-top" />
      </UPageHero>
    </UContainer>
    <!-- <UContainer class="w-full py-2">
      <div class="lg:flex w-full justify-start">
        <UTabs v-model="indexTab" :items="indexTabItems" size="lg" :ui="{
          root: '',
          list: 'flex-nowrap gap-2 bg-transparent',
          indicator: 'bg-white border border-muted/50 shadow',
          trigger: 'data-[state=active]:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
        }" class="lg:w-fit" />
      </div>
    </UContainer> -->
    <div class="bg-muted border-y border-muted/50">


      <UContainer class="px-0">
        <UPageSection :ui="{ title: 'text-start', description: 'text-start' }" :title="page.environmentSection?.title"
          :description="page.environmentSection?.description">
          <div class="" v-if="indexTab === 'environment' && !isMobile">


            <Motion :initial="{
              opacity: 0,
              scale: 0.9,
              // transform: 'translateY(10px)'
              // filter: 'blur(20px)'
            }" :animate="{
              opacity: 1,
              scale: 1,
              // transform: 'translateY(0px)'
              // filter: 'blur(0px)'
            }" :transition="{
              duration: 0.3,
              delay: 0.1
            }">

              <EnvironmentSelector :show-spatial-forest="false" />


              <div class="flex w-full justify-center my-4">
                <UButton size="xl" trailing :disabled="!allSelected" @click="redirect" color="primary"
                  icon="i-heroicons-arrow-right" label="Gå till miljö" />
              </div>

            </Motion>
          </div>
          <div class="" v-if="indexTab === 'environment' && isMobile">
            <div class=" bg-muted rounded-lg">


              <USelect size="xl" v-for="category in categories" :key="category.key"
                :items="enabledOptions[category.key]" v-model="envStore[category.key]"
                :placeholder="category.defaultLabel" class="flex-1 w-full my-1 text-lg ring-muted/50" append-to-body
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
            </div>
            <div class="flex flex-col lg:flex-row gap-2 my-4">




              <!-- <UButton label="DNA-data" size="xl" trailing :icon="restrictionEnabled ? 'mdi:lock' : 'mdi:lock-open'"
                @click="toggleRestriction" variant="subtle" :color="restrictionEnabled ? 'secondary' : 'neutral'" /> -->
              <UDrawer fullscreen title="Kombinationer" class="w-full ring-muted/50 justify-center lg:justify-start"
                :ui="{ title: 'text-2xl' }">
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
              </UDrawer>
              <UButton trailing :disabled="!allSelected" @click="redirect" color="primary"
                icon="i-heroicons-arrow-right" label="Gå till miljö" size="xl"
                class="w-full justify-center lg:justify-start" />
            </div>
            <!-- <Transition name="fade" mode="out-in">
            <SpatialForest class="h-fit" />
          </Transition> -->
          </div>
        </UPageSection>
      </UContainer>




    </div>
    <UContainer class="w-full py-4">
      <UPageSection :title="page.factsSection?.title" :description="page.factsSection?.description">
        <UCarousel v-slot="{ item }" :items="page.factsSection?.items" arrows
          :ui="{ item: 'basis-full sm:basis-1/3 px-6' }">
          <UPageCard variant="naked" reverse :title="item.title" :description="item.description"
            :ui="{ title: 'text-lg text-neutral-700 ', description: 'text-base text-neutral-500' }">
            <div class="bg-neutral-400 rounded-md overflow-hidden">
              <NuxtImg v-if="item.image" :src="item.image" class="w-full aspect-video object-cover opacity-85"
                width="800" height="450" />
            </div>

          </UPageCard>
        </UCarousel>
      </UPageSection>
      <UPageSection :title="page.videoSection?.title" :description="page.videoSection?.description">
        <div class=" border-muted/60 rounded-xl bg-muted/20 min-h-64 flex items-center justify-center overflow-hidden">
          <NuxtImg :src="page.videoSection?.image" class="w-full" />

        </div>
      </UPageSection>


    </UContainer>
    <UContainer>
      <UPageSection :title="page.speciesListsIntro?.title"
        :ui="{ title: 'text-start lg:text-center', description: 'text-start lg:text-center', container: 'pb-0 sm:pb-0 lg:pb-0' }"
        :description="page.speciesListsIntro?.description" />
      <UPageSection orientation="horizontal" :reverse="isMobile ? true : false"
        :ui="{ title: 'text-2xl sm:text-3xl lg:text-4xl' }" :headline="page.dnaSection?.headline"
        :title="page.dnaSection?.title" :description="page.dnaSection?.description"
        :features="page.dnaSection?.features || []">
        <NuxtImg :src="page.dnaSection?.image" class="w-full rounded-xl mb-2 ring ring-muted/50 shadow" width="1000"
          height="600" />
      </UPageSection>
      <UPageSection orientation="horizontal" :reverse="true" :headline="page.fruitbodySection?.headline"
        :ui="{ title: 'text-2xl sm:text-3xl lg:text-4xl' }" :title="page.fruitbodySection?.title"
        :description="page.fruitbodySection?.description" :features="page.fruitbodySection?.features || []">
        <NuxtImg :src="page.fruitbodySection?.image" class="w-full rounded-xl mb-2 ring ring-muted/50 shadow"
          width="1000" height="600" />
      </UPageSection>
    </UContainer>
    <div class="bg-muted border-y border-muted/50">
      <UContainer>
        <KnowledgeSelectionSection
          :ui="{ title: 'text-start text-2xl sm:text-3xl lg:text-4xl', description: 'text-start' }"
          :title="page.knowledgeSection?.title" :description="page.knowledgeSection?.description"
          :indices="page.knowledgeSection?.indices || [0]" :limit="page.knowledgeSection?.limit || 3" />
      </UContainer>
    </div>
  </UPage>
</template>
