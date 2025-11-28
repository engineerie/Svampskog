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

const open = ref(false)
</script>
<template>

  <UPage v-if="page" class="flex-1">
    <UContainer class="w-full px-0">
      <UPageHero :ui="{ container: ' py-12 lg:py-24 lg:pb-12', title: ' sm:text-7xl', headline: 'text-neutral' }"
        :title="page.hero.title" :description="page.hero.description" :orientation="page.hero.orientation" class="">
        <template #headline v-if="page.hero.headline">
          <div class="flex justify-center items-center">
            <Motion :initial="{
              scale: 0.5,
              opacity: 0,
              // filter: 'blur(20px)'
            }" :animate="{
              scale: 1,
              opacity: 1,
              // filter: 'blur(0px)'
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
              // filter: 'blur(20px)'
            }" :animate="{
              scale: 1,
              opacity: 1,
              // filter: 'blur(0px)'
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
              // filter: 'blur(20px)'
            }" :animate="{
              scale: 1,
              opacity: 1,
              // filter: 'blur(0px)'
            }" :transition="{
              duration: 0.2,
              delay: 0.25
            }">
              <NuxtImg src="/images/svampgrid/Gomphus clavatus-1.jpg" width="300" height="300" format="webp"
                alt="Illustration"
                class="size-20 rounded-lg ring ring-muted/50 inline-flex mb-12 lg:mb-18 h-fit shadow-xl" />
            </Motion>
          </div>

        </template>
        <!-- <NuxtImg :src="page.hero.src" width="700" format="webp" alt="Illustration"
          class=" rounded ring ring-neutral-300 " /> -->
        <template v-if="isMobile && page?.hero?.links?.[0]" #links>
          <UModal title="Välj miljö" :ui="{ body: 'p-0 bg-neutral-50', title: 'text-2xl', content: '' }" fullscreen>
            <UButton :label="page.hero.links[0].label" size="xl" color="neutral" icon="i-heroicons-magnifying-glass" />
            <template #body>
              <div class=" w-full max-w-full p-4">
                <USelect size="xl" v-for="category in categories" :key="category.key"
                  :items="enabledOptions[category.key]" v-model="envStore[category.key]"
                  :placeholder="category.defaultLabel" class="flex-1 w-full my-1 text-lg ring-muted" append-to-body
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
                <UButton trailing :disabled="!allSelected" @click="redirect" color="primary"
                  icon="i-heroicons-arrow-right" label="Gå till miljö" size="xl" class="w-full my-1" />
                <div class="grid grid-cols-2 gap-2 mt-1 mb-2">



                  <UButton label="DNA-data" size="xl" trailing :icon="restrictionEnabled ? 'mdi:lock' : 'mdi:lock-open'"
                    @click="toggleRestriction" variant="subtle" :color="restrictionEnabled ? 'secondary' : 'neutral'" />
                  <UModal fullscreen title="Kombinationer" class="w-full" :ui="{ title: 'text-2xl' }">
                    <UButton label="Kombinationer" size="xl" shape="full" trailing icon="mdi:apps" color="neutral"
                      variant="outline" />


                    <template #body>
                      <UButton size="xl" trailing :icon="restrictionEnabled ? 'mdi:lock' : 'mdi:lock-open'"
                        @click="toggleRestriction" shape="full" class="transition-all shrink-0 mb-2 w-full"
                        variant="soft" :color="restrictionEnabled ? 'secondary' : 'neutral'">
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
                  <!-- <UModal fullscreen title="Miljööversikt" class="col-span-2"
                    :ui="{ content: 'overflow-y-scroll px-0', body: 'p-0', title: 'text-2xl' }">
                    <UButton size="xl" label="Alla miljöer" trailing icon="i-hugeicons-tree-06" color="neutral"
                      variant="subtle" />
                    <template #body>
                      <Miljoer />
                    </template>
                  </UModal> -->
                </div>

                <Transition name="fade" mode="out-in">
                  <SpatialForest class=" h-fit" />
                </Transition>
              </div>
            </template>
          </UModal>
        </template>
      </UPageHero>
      <div class="sm:mb-24" v-if="!isMobile">


        <Motion :initial="{
          opacity: 0,
          transform: 'translateY(10px)'
          // filter: 'blur(20px)'
        }" :animate="{
          opacity: 1,
          transform: 'translateY(0px)'
          // filter: 'blur(0px)'
        }" :transition="{
          duration: 0.3,
          delay: 0.6
        }">
          <EnvironmentSelector class="" />

          <div class="flex w-full justify-center mb-4">
            <UButton size="xl" trailing :disabled="!allSelected" @click="redirect" color="primary"
              icon="i-heroicons-arrow-right" label="Gå till miljö" />
          </div>
        </Motion>
      </div>
      <!-- redirection button here
       
      -->

    </UContainer>

    <!-- <div class="bg-neutral-50 border-t border-muted">
      <UContainer class="w-full px-0 pb-8 pt-2 sm:pt-8">
        <div class="group">
          <UCarousel :ui="{ prev: 'ml-8 hidden group-hover:flex', next: 'mr-8 hidden group-hover:flex' }"
            v-slot="{ item }" :items="page.carousel ?? []" class="w-full mx-auto mb-8" arrows dots>
            <UPageCTA :title="item.title"
              :ui="{ root: 'mx-3 lg:mx-8 my-1', container: 'border-none py-8', title: 'lg:text-5xl/14 font-medium' }"
              :description="item.description" orientation="horizontal">
              <template v-if="item.specialGrid">
                <div class="grid grid-cols-5 gap-4 lg:gap-6">
                  <div v-for="(src, i) in buildGrid(item)" :key="i"
                    class="rounded overflow-hidden ring ring-neutral-200 shadow">
                    <NuxtImg :src="src" :alt="i === 0 ? 'Mycel: huvudbild' : 'Mycel: rutbild'" width="400"
                      height="400" />
                  </div>
                </div>
              </template>
              <template v-else-if="item.specialBento">
                <div class="grid grid-cols-3 gap-4 lg:gap-4">
                  <div v-for="(src, i) in bentoImages(item)" :key="i"
                    class="rounded overflow-hidden ring ring-neutral-200 shadow">
                    <NuxtImg :src="src" :alt="`Svampbild ${i + 1}`" width="500" height="300" />
                  </div>
                </div>
              </template>
              <template v-else-if="item.img">
                <div class="flex justify-center w-full">
                  <NuxtImg :src="item.img" :class="['rounded ', { 'ring ring-neutral-200 shadow': !item.noBorder }]"
                    height="400" />
                </div>
              </template>
              <template v-else>
                <div class="flex justify-center items-center w-full min-h-60 text-neutral-500">
                  <span>Ingen bild tillgänglig</span>
                </div>
              </template>
            </UPageCTA>
          </UCarousel>
        </div>
      </UContainer>
    </div> -->

    <!-- <SCarousel :section="page.carousel" /> -->
    <Motion :initial="{
      opacity: 0,
      transform: 'translatex(-10px)'
      // filter: 'blur(20px)'
    }" :animate="{
      opacity: 1,
      transform: 'translateY(0px)'
      // filter: 'blur(0px)'
    }" :transition="{
      duration: 0.5,
      delay: 1
    }">

      <UContainer>
        <div class="mb-4 flex flex-col sm:flex-row gap-1.5 p-1 rounded-lg ring ring-muted/50 sm:w-fit bg-muted/30">
          <UModal v-if="page.ecologyintro" :fullscreen="isMobile ? true : false" :title="page.ecologyintro.title"
            :description="page.ecologyintro.description" :ui="{
              header: ' shrink-0',
            }">
            <UAlert icon="i-material-symbols-network-node" color="neutral" variant="outline"
              title="Mykorrhizans ekologi i korthet"
              class="sm:w-fit shadow ring-muted/50 hover:opacity-85 hover:cursor-pointer" />
            <template #body>
              <EcologyIntro :section="page.ecologyintro" />
            </template>
          </UModal>
          <UModal :fullscreen="isMobile ? true : false" :title="page.underlag" :description="page.underlagdescription"
            :ui="{
              header: 'shrink-0',
            }">
            <UAlert icon="i-heroicons-document-magnifying-glass" color="neutral" variant="outline"
              :title="page.underlag" class="sm:w-fit shadow ring-muted/50 hover:opacity-85 hover:cursor-pointer" />
            <template #body>
              <UnderlagContent :underlag="page.underlag" :underlagbild="page.underlagbild"
                :sections="page.underlagSections" />
            </template>
          </UModal>
        </div>
      </UContainer>
    </Motion>

  </UPage>
</template>
