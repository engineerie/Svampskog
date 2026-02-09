<template>
  <UCard variant="ghost" :class="cardClass">
    <div class="md:flex justify-between items-start w-full">
      <div class="md:flex gap-4 w-full">
        <div class="w-full flex justify-between items-start">
          <div>
            <div @click="handleTitleClick"
              :class="[titleClass, titleClickable ? 'group cursor-pointer' : 'cursor-default']">
              <UIcon :name="icon" class="mr-2" />
              <h1 class="truncate">
                {{ title }}
              </h1>
              <UIcon v-if="titleClickable" name="i-lucide-arrow-right"
                class="size-6 font-medium text-neutral transition-all opacity-0 group-hover:translate-x-1 group-hover:opacity-100" />
            </div>
            <h2 class="text-md text-neutral-500 md:mb-2">{{ countSummary }} {{ countLabel }}</h2>
          </div>
          <UButton v-if="!isNormalView" color="neutral" variant="outline" size="lg" @click="$emit('enlarge')"
            icon="i-heroicons-arrow-left" label="Tillbaka" class="hidden md:flex ring-muted/50" />
          <UButton v-if="!isNormalView" color="neutral" variant="soft" size="xl" @click="$emit('enlarge')"
            icon="i-heroicons-x-mark-solid" class="rounded-full md:hidden" />
        </div>
      </div>
    </div>

    <transition name="fade" mode="out-in" class="md:min-h-65">
      <SpeciesTable @enlarge="emit('enlarge')" :is-normal-view="isNormalView" :dataType="dataType"
        :dataTypeFolder="dataTypeFolder" :grupp="grupp" :mat="mat" :obs="obs" :obsLabel="obsLabel"
        :tableKey="tableKey" @update:visibleRange="tableVisibleRange = $event"
        :search-term="searchTerm" @update:searchTerm="value => emit('update:searchTerm', value)"
        :filterEdible="filterEdible" :filterPoison="filterPoison"
        :column-visibility-overrides="columnVisibilityOverrides" />
    </transition>
  </UCard>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useEnvParamsStore } from '~/stores/envParamsStore';

const props = defineProps({
  isNormalView: { type: Boolean, default: false },
  searchTerm: { type: String, default: '' },
  title: { type: String, required: true },
  icon: { type: String, required: true },
  titleColorClass: { type: String, required: true },
  titleClickable: { type: Boolean, default: true },
  cardClass: { type: String, default: 'rounded-none sm:rounded-lg' },
  countLabel: { type: String, default: 'arter' },
  countFolder: { type: String, required: true },
  countType: { type: String, required: true },
  countFilterKey: { type: String, default: '' },
  dataType: { type: String, required: true },
  dataTypeFolder: { type: String, required: true },
  grupp: { type: String, required: true },
  mat: { type: String, required: true },
  obs: { type: String, required: true },
  obsLabel: { type: String, required: true },
  tableKey: { type: String, default: '' },
  filterEdible: { type: Boolean, default: false },
  filterPoison: { type: Boolean, default: false },
  columnVisibilityOverrides: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['enlarge', 'update:searchTerm']);
const envStore = useEnvParamsStore();
const count = ref(0);
const tableVisibleRange = ref<{ startIndex: number; endIndex: number; total: number } | null>(null);

const filteredCount = computed(() => tableVisibleRange.value?.total ?? count.value);
const isFiltered = computed(() =>
  count.value > 0 && tableVisibleRange.value !== null && filteredCount.value !== count.value
);
const countSummary = computed(() =>
  isFiltered.value ? `${filteredCount.value} av ${count.value}` : `${count.value}`
);

const titleClass = computed(() =>
  `flex items-center text-4xl font-medium md:text-3xl ${props.titleColorClass}`
);

function handleTitleClick() {
  if (!props.titleClickable) return;
  emit('enlarge');
}

async function fetchCount() {
  const params = [envStore.geography, envStore.forestType, envStore.standAge, envStore.vegetationType];
  if (params.some(param => !param)) {
    count.value = 0;
    return;
  }
  const filename = `${props.countType}-${envStore.geography}-${envStore.forestType}-${envStore.standAge}-${envStore.vegetationType}.json`;
  try {
    const res = await fetch(`/${props.countFolder}/${filename}`);
    if (!res.ok) throw new Error('Network response was not ok');
    const arr = await res.json();
    count.value = props.countFilterKey
      ? arr.filter((row: any) => row[props.countFilterKey] === 'x').length
      : arr.length;
  } catch (err) {
    console.error('Failed to fetch count for', props.countType, err);
    count.value = 0;
  }
}

watch(
  () => [envStore.geography, envStore.forestType, envStore.standAge, envStore.vegetationType],
  fetchCount,
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
</style>
