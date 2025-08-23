<template>
  <div class="grid grid-cols-12 ">
    <!-- <div class="col-span-12">
      <EnvImgInfo
      class="hidden md:flex"
        :geography="geography"
        :forestType="forestType"
        :standAge="standAge"
        :vegetationType="vegetationType"
      />
    </div> -->
    <div class="col-span-12">
      <UTabs :ui="{
        indicator: 'bg-white dark:bg-violet-400/9 border border-neutral-300/80 dark:border-violet-300/30',
        trigger: 'data-[state=active]:text-neutral-800 dark:data-[state=active]:text-violet-400/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        list: 'bg-transparent'
      }" v-model="activeTab" :items="tabs" :content="false" class=" my-1 mx-1 md:-mt-2 md:mx-0" :size="tabSize"
        color="neutral" variant="pill" />

      <div v-if="activeTab === 'dna'" class="col-span-12 ">
        <!-- <USeparator type="dashed" class="mt-4"/> -->


        <!-- <USeparator class="mt-2 mb-6"/> -->



        <!-- Main content -->
        <div>
          <EdnaComponent :isNormalView="false" @enlarge="emitEnlarge('FullScreenEdna')" />
        </div>


      </div>
    </div>

    <div v-if="activeTab === 'knowledge'" class="col-span-12">
      <!-- <USeparator type="dashed"/> -->
      <!-- <UBadge
            size="md"
            color="tertiary"
            variant="subtle"
           icon="lineicons:mushroom-1"
           label="Enligt samlad kunskap / var fruktkroppar förekommer"
              class="h-fit mt-4 md:hidden "
           /> -->
      <!-- <div class="flex justify-end  mb-2 sticky top-28 pt-2 z-10     ">
       
        <div  class="bg-white dark:bg-black rounded-md z-10">
          
           <UBadge
            size="lg"
            color="tertiary"
            variant="subtle"
            icon="lineicons:mushroom-1"
            label="Enligt samlad kunskap, främst var fruktkroppar förekommer"
            class="h-full hidden md:flex"
           />
           <UBadge
            size="lg"
            color="tertiary"
            variant="subtle"
            icon="lineicons:mushroom-1"
            class="h-full cursor-pointer md:hidden whitespace-normal break-words text-left"
            @click="knowledgeExpanded = !knowledgeExpanded"
           >
             {{ knowledgeExpanded
               ? 'Enligt samlad kunskap, främst var fruktkroppar förekommer'
               : 'Samlad kunskap' }}
           </UBadge>
      
     </div>
        

      </div> -->
      <!-- <USeparator /> -->

      <!-- <div
        class="rounded-3xl p-[1.5px] bg-gradient-to-tr from-amber-500 to-95%"
      >
        <div
          class="bg-white overflow-hidden rounded-tr-none rounded-[calc(1.5rem-1px)]"
        > -->
      <!-- <UCard :ui="{body: 'p-3 sm:p-3'}" variant="subtle"> -->
      <div class="col-span-12 grid-cols-12 rounded-2xl gap-y-3 hidden md:grid gap-4 mt-2">

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
      <UContainer class="md:hidden space-y-3 mt-3 ">

        <UCard @click="emitEnlarge('FullScreenEdible')">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-semibold text-warning-500">Matsvampar</h1>
              <h1 class="text-neutral-500">{{ edibleCount }} arter</h1>
            </div>
            <UButton icon="i-heroicons-chevron-right" class="rounded-full " variant="outline" color="neutral"
              size="xl" />
          </div>


        </UCard>
        <UCard @click="emitEnlarge('FullScreenPoison')">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-semibold text-poison-500">Giftsvampar</h1>
              <h1 class="text-neutral-500">{{ poisonCount }} arter</h1>
            </div>
            <UButton icon="i-heroicons-chevron-right" class="rounded-full " variant="outline" color="neutral"
              size="xl" />
          </div>
        </UCard>
        <UCard @click="emitEnlarge('RedlistedComponent')">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-semibold text-signal-500">Naturvårdsarter</h1>
              <h1 class="text-neutral-500">{{ redlistCount }} arter</h1>
            </div>
            <UButton icon="i-heroicons-chevron-right" class="rounded-full " variant="outline" color="neutral"
              size="xl" />
          </div>
        </UCard>
      </UContainer>
      <!-- </UCard> -->

      <!-- </div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import EdnaComponent from "./EdnaComponent.vue";
import { useRoute } from "vue-router";
import EnvImgInfo from "./EnvImgInfo.vue";
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useEnvParamsStore } from '~/stores/envParamsStore';
const envStore = useEnvParamsStore();
const route = useRoute();

const redlistCount = ref(0);
const edibleCount = ref(0);
const poisonCount = ref(0);

// Define props
const props = defineProps({
  geography: String,
  forestType: String,
  standAge: String,
  vegetationType: String,
  isNormalView: Boolean,
});

console.log("isNormalView in parent:", props.isNormalView); // Log to check the prop value in the parent component

// Define emits
const emit = defineEmits(["enlarge"]);

const emitEnlarge = (componentName) => {
  emit("enlarge", componentName);
};

const dnaExpanded = ref(false);
const knowledgeExpanded = ref(false);

const activeTab = ref('knowledge')
const tabs = [
  { label: 'Samlad kunskap', value: 'knowledge' },
  { label: 'DNA från markinventeringens provytor', value: 'dna' },
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
const tabSize = computed(() => windowWidth.value >= 768 ? 'lg' : 'lg');

async function fetchCount(folder, type, countRef, filterKey = null) {
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

// Update counts whenever environment parameters change
watch(
  () => [envStore.geography, envStore.forestType, envStore.standAge, envStore.vegetationType],
  () => {
    fetchCount('redlisted', 'redlisted', redlistCount);
    fetchCount('edible', 'edibledata', edibleCount, 'Nyasvamp-boken');
    fetchCount('edible', 'edibledata', poisonCount, 'Giftsvamp');
  },
  { immediate: true }
);

const tabsUi = computed(() => {
  if (activeTab.value === 'dna') {
    return {
      indicator: 'bg-violet-100 dark:bg-violet-400/9 border border-violet-300/80 dark:border-violet-300/30',
      trigger: 'data-[state=active]:text-violet-500 dark:data-[state=active]:text-violet-400/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
    }
  } else {
    return {
      indicator: 'bg-orange-100 dark:bg-orange-400/9 border border-orange-300/80 dark:border-orange-300/30',
      trigger: 'data-[state=active]:text-orange-500 dark:data-[state=active]:text-orange-400/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
    }
  }
})
</script>

<style scoped>
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
