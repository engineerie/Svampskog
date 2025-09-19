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
} from '~/stores/envParamsStore'

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

const items = ref([
  {
    title: 'Alla träd har mykorrhiza',
    description: 'Alla träd samarbetar med mykorrhizasvampar i symbios. Svamparna förstorar trädens rotsystem och förser dem med näring och vatten. I utbyte får svamparna socker från trädens fotosyntes.',
    img: '/images/Mycorrhiza Image.jpeg'
  },
  {
    title: 'Många skogssvampar bildar mykorrhiza',
    description: 'De flesta större svampar i skogen bildar mykorrhiza - både ätliga och giftiga. Dit hör bland annat spindelskivlingar, kremlor, riskor, soppar och kantareller.',
    img: '/images/Collage.png',
    specialBento: true,
    bentoImgs: [
      '/images/svampgrid/Cantharellus cibarius-3.jpg',
      'images/svampindex/Cortinarius sanguineus-179-.jpg',
      '/images/svampgrid/Gomphus clavatus-1.jpg',
      '/images/svampgrid/Tricholoma matsutake-166-6276.jpg',
      'images/svampindex/Ramaria pallida-256756.jpg',
      'images/svampindex/Tuber aestivum-1608.jpg',
      'images/svampindex/Inonotus dryophilus-883.jpg',
      'images/svampindex/Amanita pantherina-183-2978.jpg',
      'images/svampindex/Coprinus comatus-107-3442.jpg',
    ]
  },
  {
    title: 'Över 2000 arter i Sverige',
    description: 'I Sverige finns över 2 000 olika mykorrhizasvampar. Några är vanliga, men de flesta är ovanliga. I en äldre skog kan det finnas ett par hundra arter. Många bildar små och oansenliga fruktkroppar och är därför dåligt kända.',
    img: '/images/ArterDiagram2.jpg',
    noBorder: true,
  },
  {
    title: 'Det mesta är mycel i marken',
    description: 'Fruktkropparna är bara en liten del av svampen. Den största delen är mycel i marken, som växer året runt och kan leva i många år.',
    img: '/images/Screenshot 2024-08-24 at 18.46.21-3.jpg',
    specialGrid: true,
    gridTop: '/images/svampgrid/Cantharellus cibarius-3.jpg',
    gridRest: '/images/Mycorrhizae.jpg',
    gridCols: 5,
    gridRows: 3,
  },
  {
    title: 'Varje mycel är en individ',
    description: 'Varje mycel i marken är en svampindivid, ofta ungefär någon kvadratmeter stor. I en skog finns många individer, precis som det finns många hos växter och djur.',
    img: '/images/Söder_Tallskog_91_Blåbär_grupp.png'
  },
])

function buildGrid(item: any) {
  const cols = item.gridCols ?? 5
  const rows = item.gridRows ?? 4
  const total = cols * rows
  const top = item.gridTop || item.img
  const rest = item.gridRest || item.img
  return [top, ...Array(Math.max(total - 1, 0)).fill(rest)]
}

function bentoImages(item: any) {
  return Array.isArray(item.bentoImgs) ? item.bentoImgs : []
}
</script>
<template>



  <UPage class="flex-1 ">
    <UContainer class="w-full px-0">
      <UPageHero :ui="{ container: ' lg:py-24', title: 'sm:text-6xl', headline: 'text-neutral' }"
        title="Sök svampar i svenska skogar" headline="" description="Baserat på DNA-analyser av svampmycel i jordprover, och sammanställda uppgifter om var olika arters fruktkroppar finns.
" orientation="horizontal" class="">
        <NuxtImg src="/images/Adobe/Mushroom Forest Image.jpeg" width="700" format="webp" alt="Illustration"
          class=" rounded ring ring-neutral-300 " />
        <template v-if="isMobile" #links>
          <UModal title="Välj miljö" :ui="{ body: 'p-0', title: 'text-2xl' }">
            <UButton label="Sök skogsmiljö" size="xl" color="neutral" icon="i-heroicons-magnifying-glass" />
            <template #body>
              <div class=" w-full max-w-full p-4">
                <USelect size="xl" v-for="category in categories" :key="category.key"
                  :items="enabledOptions[category.key]" v-model="envStore[category.key]"
                  :placeholder="category.defaultLabel" class="flex-1 w-full my-1 text-lg" append-to-body
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
                <UButton trailing :disabled="!allSelected" @click="redirect" color="neutral"
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
                </div>
                <Transition name="fade" mode="out-in">
                  <SpatialForest class="rounded overflow-hidden border border-neutral-200 h-fit" />
                </Transition>
              </div>
            </template>
          </UModal>
        </template>
      </UPageHero>
      <div v-if="!isMobile">
        <EnvironmentSelector />
        <div class="flex w-full justify-end mb-4">
          <UButton :disabled="!allSelected" @click="redirect" color="neutral" icon="i-heroicons-arrow-right"
            label="Gå till miljö" />
        </div>
      </div>
      <!-- redirection button here
       
      -->

    </UContainer>

    <div class="bg-neutral-50 border-t border-muted">
      <UContainer class="w-full px-0 pb-8 pt-2 sm:pt-8">
        <!-- Mobile inline environment selector -->
        <div class="group">
          <UCarousel :ui="{ prev: 'ml-8 hidden group-hover:flex', next: 'mr-8 hidden group-hover:flex' }"
            v-slot="{ item }" :items="items" class="w-full mx-auto mb-8" arrows dots>
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
              <template v-else>
                <div class="flex justify-center w-full">
                  <NuxtImg :src="item.img" :class="['rounded ', { 'ring ring-neutral-200 shadow': !item.noBorder }]"
                    height="400" />
                </div>
              </template>
            </UPageCTA>
          </UCarousel>
        </div>
      </UContainer>
    </div>


  </UPage>
</template>
