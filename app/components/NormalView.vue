<template>
  <div class="grid grid-cols-12 ">
    <div class="col-span-12">

      <div class="flex justify-between p-3 border-b border-muted/50" v-if="!isMobile">
        <div class="flex gap-3">
          <UButton @click="activeTab = 'dna'"
            class="hover:bg-neutral-100 text-start ring-muted/50 cursor-pointer p-3 px-4 rounded-lg"
            :variant="activeTab === 'dna' ? 'subtle' : 'outline'" color="neutral">
            <UPageFeature title="Enligt DNA" description="Från markinventeringens jordprover" />
          </UButton>
          <UButton @click="activeTab = 'knowledge'"
            class="hover:bg-neutral-100 text-start ring-muted/50 cursor-pointer p-3 px-4 rounded-lg"
            :variant="activeTab === 'knowledge' ? 'subtle' : 'outline'" color="neutral">
            <UPageFeature title="Enligt fruktkroppar" description="Utifrån var fruktkroppar förekommer" />
          </UButton>
        </div>

        <div class=" flex flex-col sm:flex-row gap-1.5 p-1 rounded-lg ring ring-muted/50 w-fit h-fit bg-muted/30">

          <UModal :fullscreen="isMobile ? true : false" :title="page.ecologyintro?.title ?? ''"
            :description="page.ecologyintro?.description ?? ''" :ui="{
              header: 'items-start gap-2 shrink-0',
              title: 'whitespace-normal',
              description: 'whitespace-normal leading-snug'
            }">
            <UAlert icon="i-heroicons-newspaper" color="neutral" variant="outline" title="Ekologi"
              class="sm:w-fit h-fit  ring-muted/50 hover:opacity-85 hover:cursor-pointer" />
            <template #body>
              <EcologyIntro :section="page.ecologyintro" />
            </template>
          </UModal>
          <UModal :fullscreen="isMobile ? true : false" title="Underlag för svampars förekomst"
            :description="page.underlagdescription">
            <UAlert icon="i-heroicons-document-magnifying-glass" color="neutral" variant="outline" title="Underlag"
              class="sm:w-fit h-fit  ring-muted/50 hover:opacity-85 hover:cursor-pointer" />
            <template #body>
              <ImagePlaceholder />
              <MDC :value="page.underlag" />
              <NuxtLink to="/info" class="text-primary underline">Läs mer i dokumentationen</NuxtLink>
            </template>
          </UModal>

        </div>



      </div>


      <transition name="view-transition" mode="out-in">
        <div v-if="activeTab === 'dna'" key="dna" class="col-span-12 sm:pt-2">
          <div class="hidden md:block">
            <EdnaComponent :isNormalView="!isEdnaExpanded" @enlarge="handleEdnaToggle" />
          </div>
          <UContainer class="md:hidden space-y-3 pt-3 bg-muted/50">
            <UPageFeature title="Enligt DNA" description="Från markinventeringens jordprover" />
            <UCard @click="emitEnlarge('FullScreenEdna')" class="ring-muted/50">
              <div class="flex justify-between items-center text-secondary-500">
                <div class="truncate">
                  <div class="text-2xl font-semibold flex items-center ">
                    <UIcon name="solar:dna-linear" class="mr-2" />
                    <h1 class="truncate">Alla mykorrhizasvampar</h1>
                  </div>
                  <USkeleton v-if="dnaCount === null" class="h-4 w-12 mt-2" />
                  <h1 v-else class="text-neutral-500">{{ dnaCount }} arter</h1>
                </div>
                <UButton icon="i-heroicons-chevron-right" class="rounded-full " variant="ghost" color="neutral"
                  size="xl" />
              </div>
            </UCard>
            <!-- <USeparator /> -->

            <UPageFeature class="mt-6" title="Enligt fruktkroppar" description="Utifrån vart fruktkroppar förekommer" />

            <UCard @click="emitEnlarge('FullScreenEdible')" class="ring-muted/50">
              <div class="flex justify-between items-center text-warning-500">
                <div>
                  <h1 class="text-2xl font-semibold flex items-center">
                    <UIcon name="icon-park-solid:knife-fork" class="mr-2" />Matsvampar
                  </h1>
                  <USkeleton v-if="edibleCount === null" class="h-4 w-12 mt-2" />
                  <h1 v-else class="text-neutral-500">{{ edibleCount }} arter</h1>
                </div>
                <UButton icon="i-heroicons-chevron-right" class="rounded-full ring-muted/50" variant="ghost"
                  color="neutral" size="xl" />
              </div>
            </UCard>
            <UCard @click="emitEnlarge('FullScreenPoison')" class="ring-muted/50">
              <div class="flex justify-between items-center text-poison-500">
                <div>
                  <h1 class="text-2xl font-semibold flex items-center ">
                    <UIcon name="i-hugeicons-danger" class="mr-2" />Giftsvampar
                  </h1>
                  <USkeleton v-if="edibleCount === null" class="h-4 w-12 mt-2" />
                  <h1 v-else class="text-neutral-500">{{ poisonCount }} arter</h1>
                </div>
                <UButton icon="i-heroicons-chevron-right" class="rounded-full " variant="ghost" color="neutral"
                  size="xl" />
              </div>
            </UCard>
            <UCard @click="emitEnlarge('RedlistedComponent')" class="ring-muted/50">
              <div class="flex justify-between items-center text-signal-500">
                <div>
                  <h1 class="text-2xl font-semibold flex items-center">
                    <UIcon name="i-material-symbols-award-star-outline" class="mr-2" />
                    Naturvårdsarter
                  </h1>
                  <USkeleton v-if="redlistCount === null" class="h-4 w-12 mt-2" />
                  <h1 v-else class="text-neutral-500">{{ redlistCount }} arter</h1>
                </div>
                <UButton icon="i-heroicons-chevron-right" class="rounded-full " variant="ghost" color="neutral"
                  size="xl" />
              </div>
            </UCard>
            <USeparator class="my-6" />
            <div
              class=" flex flex-col sm:flex-row gap-1.5 p-1 rounded-lg ring ring-muted/50  sm:w-fit h-fit bg-muted/30">

              <UModal :fullscreen="isMobile ? true : false" :title="page.ecologyintro?.title ?? ''"
                :description="page.ecologyintro?.description ?? ''" :ui="{
                  header: 'items-start gap-2 shrink-0',
                  title: 'whitespace-normal',
                  description: 'whitespace-normal leading-snug'
                }">
                <UAlert icon="i-heroicons-newspaper" color="neutral" variant="outline" title="Ekologi"
                  class="sm:w-fit h-fit  ring-muted/50 hover:opacity-85 hover:cursor-pointer" />
                <template #body>
                  <EcologyIntro :section="page.ecologyintro" />
                </template>
              </UModal>
              <UModal :fullscreen="isMobile ? true : false" title="Underlag för svampars förekomst"
                :description="page.underlagdescription">
                <UAlert icon="i-heroicons-document-magnifying-glass" color="neutral" variant="outline" title="Underlag"
                  class="sm:w-fit h-fit  ring-muted/50 hover:opacity-85 hover:cursor-pointer" />
                <template #body>
                  <ImagePlaceholder />
                  <MDC :value="page.underlag" />
                  <NuxtLink to="/info" class="text-primary underline">Läs mer i dokumentationen</NuxtLink>
                </template>
              </UModal>

            </div>
          </UContainer>
        </div>
        <div v-else key="knowledge" class="col-span-12 sm:pt-2">
          <transition name="fade" mode="out-in">
            <div v-if="activeDetailComponent" class="space-y-4">
              <component :is="activeDetailComponent" v-bind="detailComponentProps" :key="detailComponentKey"
                @enlarge="handleCloseDetail" class="w-full" />
            </div>
            <template v-else>
              <div class="col-span-12 grid-cols-12 rounded-2xl gap-y-3 hidden md:grid gap-4">
                <div class="col-span-4 flex flex-col h-full">
                  <FullScreenEdible :geography="geography" :forestType="forestType" :standAge="standAge"
                    :vegetationType="vegetationType" :isNormalView="true" @enlarge="emitEnlarge('FullScreenEdible')"
                    :key="route.fullPath" />
                </div>
                <div class="col-span-4 flex flex-col">
                  <FullScreenPoison :geography="geography" :forestType="forestType" :standAge="standAge"
                    :vegetationType="vegetationType" :isNormalView="true" @enlarge="emitEnlarge('FullScreenPoison')"
                    :key="route.fullPath" />
                </div>
                <div class="col-span-4 flex flex-col">
                  <RedlistedComponent :isNormalView="true" @enlarge="emitEnlarge('RedlistedComponent')" />
                </div>
              </div>

            </template>
          </transition>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import EdnaComponent from "./EdnaComponent.vue";
import FullScreenEdible from "./FullScreenEdible.vue";
import FullScreenPoison from "./FullScreenPoison.vue";
import RedlistedComponent from "./RedlistedComponent.vue";
import { useRoute } from "vue-router";
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useEnvParamsStore } from '~/stores/envParamsStore';
import { hasEdnaDataset } from '~/utils/edna';

const { data: page } = await useAsyncData('mykorrhizasvampar', () => queryCollection('mykorrhizasvampar').first())
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}


const open = ref(false)
const envStore = useEnvParamsStore();
const route = useRoute();

const redlistCount = ref(null);
const edibleCount = ref(null);
const poisonCount = ref(null);
const dnaCount = ref(null);

// Define props
const props = defineProps({
  activeView: {
    type: String,
    default: null,
  },
});

// Define emits
const emit = defineEmits(["enlarge", "closeView"]);

const viewTabMap = {
  FullScreenEdible: 'knowledge',
  FullScreenPoison: 'knowledge',
  RedlistedComponent: 'knowledge',
  FullScreenEdna: 'knowledge'
}

const detailComponentMap = {
  FullScreenEdible,
  FullScreenPoison,
  RedlistedComponent,
  FullScreenEdna: EdnaComponent
}

const emitEnlarge = (componentName) => {
  if (viewTabMap[componentName]) {
    activeTab.value = viewTabMap[componentName]
  }
  emit("enlarge", componentName);
};

const activeTab = ref('dna')
const tabs = [
  { label: 'Samlad kunskap', value: 'knowledge', icon: 'lineicons:mushroom-1' },
  { label: 'DNA från markinventeringens provytor', value: 'dna', icon: 'solar:dna-linear' },
]
// Responsive tab size based on Tailwind md breakpoint (768px)
const windowWidth = ref(0);
const updateWidth = () => { windowWidth.value = window.innerWidth; };
onMounted(() => {
  updateWidth();
  window.addEventListener('resize', updateWidth);
});
onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
});

const tabSize = computed(() => windowWidth.value >= 768 ? 'md' : 'md');
const isMobile = computed(() => windowWidth.value < 768)

const geography = computed(() => envStore.geography)
const forestType = computed(() => envStore.forestType)
const standAge = computed(() => envStore.standAge)
const vegetationType = computed(() => envStore.vegetationType)

const activeDetailComponent = computed(() => detailComponentMap[props.activeView ?? ''] ?? null)

const detailComponentProps = computed(() => {
  if (!props.activeView) {
    return { isNormalView: false }
  }

  if (props.activeView === 'FullScreenEdible' || props.activeView === 'FullScreenPoison') {
    return {
      isNormalView: false,
      geography: geography.value,
      forestType: forestType.value,
      standAge: standAge.value,
      vegetationType: vegetationType.value,
    }
  }

  return { isNormalView: false }
})

const detailComponentKey = computed(() => props.activeView ? `${props.activeView}-${route.fullPath}` : undefined)

const viewLabels = {
  FullScreenEdible: 'Matsvampar',
  FullScreenPoison: 'Giftsvampar',
  RedlistedComponent: 'Naturvårdsarter',
  FullScreenEdna: 'Alla mykorrhizasvampar'
}

const isEdnaExpanded = computed(() => props.activeView === 'FullScreenEdna')
const currentViewLabel = computed(() => viewLabels[props.activeView ?? ''] ?? '')

function handleCloseDetail() {
  activeTab.value = 'dna'
  emit('closeView')
}

const breadcrumbItems = computed(() => {
  if (!activeDetailComponent.value) {
    return []
  }
  return [
    { label: 'Enligt samlad kunskap', onClick: handleCloseDetail, class: 'cursor-pointer p-1 px-2 rounded hover:bg-muted' },
    { label: currentViewLabel.value, class: 'cursor-default text-neutral' }
  ]
})

const handleEdnaToggle = () => {
  if (isEdnaExpanded.value) {
    activeTab.value = 'knowledge'
    emit('closeView')
  } else {
    emitEnlarge('FullScreenEdna')
  }
}

watch(() => props.activeView, (val) => {
  if (val && viewTabMap[val]) {
    activeTab.value = viewTabMap[val]
  }
})

watch(activeTab, (val) => {
  if (props.activeView && viewTabMap[props.activeView] !== val) {
    emit('closeView')
  }
})

async function fetchCount(folder, type, countRef, filterKey = null) {
  const params = [envStore.geography, envStore.forestType, envStore.standAge, envStore.vegetationType]
  if (params.some(param => !param)) {
    countRef.value = 0
    return
  }
  const filename = `${type}-${envStore.geography}-${envStore.forestType}-${envStore.standAge}-${envStore.vegetationType}.json`;
  try {
    const res = await fetch(`/${folder}/${filename}`);
    if (!res.ok) throw new Error('Network response was not ok');
    const arr = await res.json();
    if (filterKey) {
      countRef.value = arr.filter(row => row[filterKey] === 'x').length;
    } else {
      countRef.value = arr.length;
    }
  } catch (err) {
    console.error('Failed to fetch count for', type, err);
    countRef.value = 0;
  }
}

async function fetchEdnaCount() {
  const geog = envStore.geography
  const forest = envStore.forestType
  const age = envStore.standAge
  const veg = envStore.vegetationType

  if (!geog || !forest || !age || !veg) {
    dnaCount.value = 0
    return
  }

  if (!hasEdnaDataset(geog, forest, age, veg)) {
    dnaCount.value = 0
    return
  }

  dnaCount.value = null

  const filename = `edna-${geog}-${forest}-${age}-${veg}.json`
  try {
    const res = await fetch(`/edna/${filename}`)
    if (!res.ok) {
      dnaCount.value = 0
      return
    }
    const data = await res.json()
    dnaCount.value = Array.isArray(data) ? data.length : 0
  } catch (error) {
    console.error('Failed to fetch DNA count', error)
    dnaCount.value = 0
  }
}

// Update counts whenever environment parameters change
watch(
  () => [envStore.geography, envStore.forestType, envStore.standAge, envStore.vegetationType],
  () => {
    fetchCount('redlisted', 'redlisted', redlistCount);
    fetchCount('edible', 'edibledata', edibleCount, 'Nyasvamp-boken');
    fetchCount('edible', 'edibledata', poisonCount, 'Giftsvamp');
    fetchEdnaCount();
  },
  { immediate: true }
);

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* .view-transition-enter-active,
.view-transition-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.view-transition-enter-from,
.view-transition-leave-to {
  opacity: 0;
  transform: translateY(10px);
} */

.rounded-tab {
  --r: 0.8em;
  border-inline: var(--r) solid #0000;
  border-radius: calc(2 * var(--r)) calc(2 * var(--r)) 0 0 / var(--r);
  mask: radial-gradient(var(--r) at var(--r) 0, #0000 98%, #000 101%) calc(-1 * var(--r)) 100%/100% var(--r) repeat-x,
    conic-gradient(#000 0 0) padding-box;
}

.rounded-tab.left {
  border-left-width: 0;
  border-top-left-radius: var(--r);
}

.rounded-tab.right {
  border-right-width: 0;
  border-top-right-radius: var(--r);
}
</style>
