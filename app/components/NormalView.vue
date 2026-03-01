<template>
  <div class="grid grid-cols-12 ">
    <div class="col-span-12">

      <div class="flex justify-between items-start border-b border-muted/50 p-2 pb-0" v-if="!isMobile">
        <UTabs :unmount-on-hide="false" v-model="activeTab" :items="normalViewTabs" size="lg" :ui="{
          root: '',
          list: 'flex-nowrap gap-2 bg-transparent',
          indicator: 'bg-white border border-muted/50 shadow',
          trigger: 'data-[state=active]:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
        }" />

        <div class="flex items-center gap-2 m-1">

          <USelect v-model="globalQuickFilters" multiple :items="globalQuickFilterOptions" item-value="value"
            item-label="label" placeholder="Filtrera" icon="i-lucide-list-filter" class=" ring-muted/50" size="lg"
            :ui="{ content: 'min-w-fit' }">
            <template #default="{ ui }">
              <span v-if="selectedGlobalQuickFilterItems.length"
                :class="ui.value({ class: 'flex items-center gap-1.5 min-w-0 overflow-hidden' })">
                <span v-for="item in selectedGlobalQuickFilterItems" :key="item.value"
                  class="inline-flex items-center gap-1.5 min-w-0 shrink-0">
                  <img v-if="item.image" :src="item.image" alt="" class="size-4 object-contain" />
                  <UIcon v-else-if="item.icon" :name="item.icon"
                    :class="['size-4', item.iconClass || 'text-neutral-500']" />
                  <span class="truncate text-sm text-neutral-700 dark:text-neutral-200">{{ item.label }}</span>
                </span>
              </span>
              <span v-else :class="ui.placeholder({ class: '' })">Filtrera</span>
            </template>
            <template #leading>
              <UIcon name="i-lucide-list-filter" class="size-4 text-neutral-500" />
            </template>
            <template #item="{ item }">
              <div v-if="item.type === 'separator'" class="my-1 h-px bg-muted/60 w-full" />
              <div v-else-if="item.type === 'label'"
                class="text-xs font-medium uppercase tracking-wide text-neutral-500 px-1 py-1">
                {{ item.label }}
              </div>
              <div v-else class="flex items-center justify-between gap-2 w-full">
                <div class="flex items-center gap-2 min-w-0">
                  <img v-if="item.image" :src="item.image" alt="" class="size-4 object-contain" />
                  <UIcon v-else-if="item.icon" :name="item.icon"
                    :class="['size-4', item.iconClass || 'text-neutral-500']" />
                  <span class="text-neutral-700 dark:text-neutral-200 truncate">{{ item.label }}</span>
                </div>
                <UIcon v-if="item.value && globalQuickFilters.includes(item.value)" name="heroicons:check"
                  class="size-5 text-neutral-800 dark:text-primary-400 shrink-0" />
              </div>
            </template>
          </USelect>
          <UInput v-model="globalSearchTerm" class="max-w-sm" size="lg" :ui="{ base: 'ring-muted/50' }"
            placeholder="Sök på namn" icon="i-heroicons-magnifying-glass" variant="outline" />
          <!-- <UButton color="neutral" variant="outline" size="lg" icon="i-heroicons-document-arrow-down"
            :loading="isGeneratingPdf" :disabled="isGeneratingPdf" label="Ladda ner PDF" class="ring-muted/50"
            @click="downloadSpeciesListPdf" /> -->
        </div>

        <!-- <div class=" flex flex-col sm:flex-row gap-1.5  w-fit h-fit">
          <UAlert v-if="activeTab !== 'dna'" :color="activeTab === 'dna' ? 'secondary' : 'neutral'" variant="outline"
            :ui="{ close: ' cursor-pointer' }"
            :title="activeTab === 'dna' ? 'Arterna är sorterade i fallande ordning baserat på hur många skogar deras DNA påträffats i.' : 'Arterna är sorterade i fallande ordning baserat på hur många gånger de har rapporterats i Artportalen.'"
            class=" h-fit max-w-96 text-muted ring-muted/50" @update:open="showImagesAlert = $event" />
        </div> -->



      </div>

      <Transition :name="contentTransitionName" mode="out-in">
        <div v-if="activeTab === 'dna'" key="dna" class="col-span-12">
          <div class="hidden md:block">
            <EdnaComponent :isNormalView="!isEdnaExpanded" :searchTerm="globalSearchTerm"
              :isActive="activeTab === 'dna'" :externalSvampFilter="globalExternalSvampFilter"
              :externalStatusFilter="globalExternalStatusFilter" :externalGruppFilter="globalExternalGruppFilter"
              @update:searchTerm="globalSearchTerm = $event" @enlarge="handleEdnaToggle" />
          </div>
          <div class="relative">
            <SpatialForest v-if="isMobile" />
            <div v-if="isMobile"
              class="pointer-events-none absolute bottom-0 inset-x-0 h-8 bg-linear-to-t from-muted via-muted  to-transparent" />
          </div>

          <UContainer class="md:hidden flex flex-col gap-3 pt-4 bg-muted/50">
            <UPageFeature class="mt-4" title="Enligt DNA" description="Från markinventeringens jordprover" />
            <ClientOnly>
              <UCard @click="emitEnlarge('FullScreenEdna')"
                class="ring-muted/50 cursor-pointer transition-all hover:shadow-md">
                <div class="flex justify-between items-center gap-3">
                  <div
                    class="size-12 rounded-md bg-secondary-100 text-secondary-600 flex items-center justify-center shrink-0">
                    <UIcon name="solar:dna-linear" class="size-6" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h1 class="text-xl font-semibold text-neutral-900 truncate">Alla mykorrhizasvampar</h1>
                    <USkeleton v-if="dnaCount === null" class="h-4 w-12 mt-1" />
                    <h1 v-else class="text-neutral-500">{{ dnaCount }} arter</h1>
                  </div>
                  <UButton icon="i-heroicons-chevron-right" class="rounded-full ring-muted/50 shrink-0" variant="soft"
                    color="neutral" size="lg" />
                </div>
              </UCard>
            </ClientOnly>
            <!-- <USeparator /> -->

            <UPageFeature class="mt-4" title="Enligt fruktkroppar" description="Utifrån vart fruktkroppar förekommer" />

            <ClientOnly>
              <UCard @click="emitEnlarge('FullScreenEdible')"
                class="ring-muted/50 cursor-pointer transition-all hover:shadow-md">
                <div class="flex justify-between items-center gap-3">
                  <div
                    class="size-12 rounded-md bg-warning-100 text-warning-600 flex items-center justify-center shrink-0">
                    <UIcon name="icon-park-solid:knife-fork" class="size-6" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h1 class="text-xl font-semibold text-neutral-900 truncate">Matsvampar</h1>
                    <USkeleton v-if="edibleCount === null" class="h-4 w-12 mt-1" />
                    <h1 v-else class="text-neutral-500">{{ edibleCount }} arter</h1>
                  </div>
                  <UButton icon="i-heroicons-chevron-right" class="rounded-full ring-muted/50 shrink-0" variant="soft"
                    color="neutral" size="lg" />
                </div>
              </UCard>
            </ClientOnly>
            <ClientOnly>
              <UCard @click="emitEnlarge('FullScreenPoison')"
                class="ring-muted/50 cursor-pointer transition-all hover:shadow-md">
                <div class="flex justify-between items-center gap-3">
                  <div
                    class="size-12 rounded-md bg-poison-100 text-poison-600 flex items-center justify-center shrink-0">
                    <UIcon name="i-hugeicons-danger" class="size-6" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h1 class="text-xl font-semibold text-neutral-900 truncate">Giftsvampar</h1>
                    <USkeleton v-if="edibleCount === null" class="h-4 w-12 mt-1" />
                    <h1 v-else class="text-neutral-500">{{ poisonCount }} arter</h1>
                  </div>
                  <UButton icon="i-heroicons-chevron-right" class="rounded-full ring-muted/50 shrink-0" variant="soft"
                    color="neutral" size="lg" />
                </div>
              </UCard>
            </ClientOnly>
            <ClientOnly>
              <UCard @click="emitEnlarge('RedlistedComponent')"
                class="ring-muted/50 cursor-pointer transition-all hover:shadow-md">
                <div class="flex justify-between items-center gap-3">
                  <div
                    class="size-12 rounded-md bg-signal-100 text-signal-600 flex items-center justify-center shrink-0">
                    <UIcon name="i-material-symbols-award-star-outline" class="size-6" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h1 class="text-xl font-semibold text-neutral-900 truncate">Naturvårdsarter</h1>
                    <USkeleton v-if="redlistCount === null" class="h-4 w-12 mt-1" />
                    <h1 v-else class="text-neutral-500">{{ redlistCount }} arter</h1>
                  </div>
                  <UButton icon="i-heroicons-chevron-right" class="rounded-full ring-muted/50 shrink-0" variant="soft"
                    color="neutral" size="lg" />
                </div>
              </UCard>
            </ClientOnly>
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
              <UModal :fullscreen="isMobile ? true : false" :title="page.underlag"
                :description="page.underlagdescription">
                <UAlert icon="i-heroicons-document-magnifying-glass" color="neutral" variant="outline" title="Underlag"
                  class="sm:w-fit h-fit  ring-muted/50 hover:opacity-85 hover:cursor-pointer" />
                <template #body>
                  <UnderlagContent :underlag="page.underlag" :underlagbild="page.underlagbild"
                    :sections="page.underlagSections" />
                </template>
              </UModal>

            </div>
          </UContainer>
        </div>
        <div v-else key="knowledge" class="col-span-12 ">
          <transition name="fade" mode="out-in">
            <div v-if="activeDetailComponent" class="space-y-4">
              <component :is="activeDetailComponent" v-bind="detailComponentProps" :key="detailComponentKey"
                :searchTerm="globalSearchTerm" @update:searchTerm="globalSearchTerm = $event"
                @enlarge="handleCloseDetail" class="w-full" />
            </div>
            <template v-else>
              <div class="col-span-12 grid-cols-12 rounded-2xl gap-y-3 hidden md:grid ">
                <div class="col-span-4 flex flex-col h-full border-r border-muted/50">
                  <FullscreenTable :isNormalView="true" @enlarge="emitEnlarge('FullScreenEdible')"
                    :searchTerm="globalSearchTerm" @update:searchTerm="globalSearchTerm = $event" title="Matsvampar"
                    icon="icon-park-solid:knife-fork" titleColorClass="text-warning-500 dark:text-neutral-300"
                    :titleClickable="true" cardClass="rounded-none sm:rounded-lg" countFolder="edible"
                    countType="edibledata" countFilterKey="Nyasvamp-boken" dataType="edibledata" dataTypeFolder="edible"
                    grupp="Svamp-grupp" mat="Nyasvamp-boken" obs="Rank matsvamp" obsLabel="Sannolikhet"
                    :filterEdible="true" tableKey="edna-edible" :externalSvampFilter="globalExternalSvampFilter"
                    :externalStatusFilter="globalExternalStatusFilter" :externalGruppFilter="globalExternalGruppFilter"
                    :key="route.fullPath" />
                </div>
                <div class="col-span-4 flex flex-col h-full border-r border-muted/50">
                  <FullscreenTable :isNormalView="true" @enlarge="emitEnlarge('FullScreenPoison')"
                    :searchTerm="globalSearchTerm" @update:searchTerm="globalSearchTerm = $event" title="Giftsvampar"
                    icon="i-hugeicons-danger" titleColorClass="text-poison-500 dark:text-neutral-300"
                    :titleClickable="true" cardClass="rounded-none sm:rounded-none border-muted/50" countFolder="edible"
                    countType="edibledata" countFilterKey="Giftsvamp" dataType="edibledata" dataTypeFolder="edible"
                    grupp="Svamp-grupp" mat="Nyasvamp-boken" obs="Rank giftsvamp" obsLabel="Sannolikhet"
                    :filterPoison="true" tableKey="edna-poison" :externalSvampFilter="globalExternalSvampFilter"
                    :externalStatusFilter="globalExternalStatusFilter" :externalGruppFilter="globalExternalGruppFilter"
                    :key="route.fullPath" />
                </div>
                <div class="col-span-4 flex flex-col">
                  <FullscreenTable :isNormalView="true" @enlarge="emitEnlarge('RedlistedComponent')"
                    :searchTerm="globalSearchTerm" @update:searchTerm="globalSearchTerm = $event"
                    title="Naturvårdsarter" icon="i-material-symbols-award-star-outline"
                    titleColorClass="text-signal-500 dark:text-neutral-300" :titleClickable="true"
                    cardClass="rounded-none sm:rounded-lg" countFolder="redlisted" countType="redlisted"
                    dataType="redlisted" dataTypeFolder="redlisted" grupp="Svamp-grupp" mat="Nyasvamp-boken"
                    obs="RankRed" obsLabel="Sannolikhet" tableKey="edna-redlisted"
                    :externalSvampFilter="globalExternalSvampFilter" :externalStatusFilter="globalExternalStatusFilter"
                    :externalGruppFilter="globalExternalGruppFilter" />
                </div>
              </div>
            </template>
          </transition>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import EdnaComponent from "./EdnaComponent.vue";
import FullscreenTable from "./FullscreenTable.vue";
import { useRoute } from "vue-router";
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useEnvParamsStore } from '~/stores/envParamsStore';
import { useTableStateStore } from '~/stores/tableStateStore';
import { hasEdnaDataset } from '~/utils/edna';

const { data: page } = await useAsyncData('mykorrhizasvampar-normal', () => queryCollection('mykorrhizasvampar').first())
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const showImagesAlert = ref(true)
const globalSearchTerm = ref('')

const open = ref(false)
const envStore = useEnvParamsStore();
const tableStateStore = useTableStateStore();
const route = useRoute();

const redlistCount = ref(null);
const edibleCount = ref(null);
const poisonCount = ref(null);
const dnaCount = ref(null);
const isGeneratingPdf = ref(false);
const globalQuickFilters = ref([]);

const naturvardsStatuses = ['VU', 'NT', 'EN', 'CR', 'DD', 'Signalart'];
const groupedQuickFilterChoices = [
  { label: 'Övrigt', value: 'group:ovrigt', groups: ['Övrigt'], image: '/images/svampgrupp/ovrigt.webp' },
  { label: 'Hattsvamp', value: 'group:hattsvamp', groups: ['Hattsvamp'], image: '/images/svampgrupp/hattsvamp.png' },
  { label: 'Kantarell', value: 'group:kantarell', groups: ['Kantarell'], image: '/images/svampgrupp/kantarell.webp' },
  { label: 'Sopp', value: 'group:sopp', groups: ['Sopp'], image: '/images/svampgrupp/sopp.png' },
  { label: 'Taggsvamp', value: 'group:taggsvamp', groups: ['Taggsvamp'], image: '/images/svampgrupp/taggsvamp.png' },
  { label: 'Fingersvamp', value: 'group:fingersvamp', groups: ['Fingersvamp'], image: '/images/svampgrupp/fingersvamp.webp' },
  { label: 'Skinnsvamp', value: 'group:skinnsvamp', groups: ['Skinnsvamp'], image: '/images/svampgrupp/skinnsvamp.webp' },
  { label: 'Skålsvamp', value: 'group:skalsvamp', groups: ['Skålsvamp'], image: '/images/svampgrupp/skalsvamp.webp' },
  { label: 'Tryffel', value: 'group:tryffel', groups: ['Tryffel'], image: '/images/svampgrupp/tryffel.webp' }
];

const globalQuickFilterOptions = computed(() => [
  { label: 'Matsvampar', value: 'matsvamp', icon: 'icon-park-solid:knife-fork', iconClass: 'text-warning-600 dark:text-warning-400' },
  { label: 'Giftsvampar', value: 'giftsvamp', icon: 'i-hugeicons-danger', iconClass: 'text-poison-600 dark:text-poison-400' },
  { label: 'Naturvårdssvampar', value: 'naturvard', icon: 'i-material-symbols-award-star-outline', iconClass: 'text-signal-600 dark:text-signal-400' },
  { type: 'separator' },
  { type: 'label', label: 'Svampgrupper' },
  ...groupedQuickFilterChoices.map(({ label, value, image }) => ({ label, value, image }))
]);

const selectedGlobalQuickFilterItems = computed(() => {
  const optionMap = new Map(
    globalQuickFilterOptions.value
      .filter((option) => option.value)
      .map((option) => [option.value, option])
  );

  return globalQuickFilters.value
    .map((value) => optionMap.get(value))
    .filter(Boolean);
});

const globalExternalSvampFilter = computed(() => {
  const selected = new Set(globalQuickFilters.value);
  const values = [];
  if (selected.has('matsvamp')) values.push('Matsvamp');
  if (selected.has('giftsvamp')) values.push('Giftsvamp');
  return values;
});

const globalExternalStatusFilter = computed(() =>
  globalQuickFilters.value.includes('naturvard') ? naturvardsStatuses : []
);

const globalExternalGruppFilter = computed(() => {
  const selected = new Set(globalQuickFilters.value);
  return groupedQuickFilterChoices
    .filter((choice) => selected.has(choice.value))
    .flatMap((choice) => choice.groups);
});

const REPORT_TABLES = [
  {
    id: 'edible',
    title: 'Matsvampar',
    dataTypeFolder: 'edible',
    dataType: 'edibledata',
    tableKey: 'edna-edible',
    grupp: 'Svamp-grupp',
    mat: 'Nyasvamp-boken',
    obs: 'Rank matsvamp',
    filterEdible: true
  },
  {
    id: 'poison',
    title: 'Giftsvampar',
    dataTypeFolder: 'edible',
    dataType: 'edibledata',
    tableKey: 'edna-poison',
    grupp: 'Svamp-grupp',
    mat: 'Nyasvamp-boken',
    obs: 'Rank giftsvamp',
    filterPoison: true
  },
  {
    id: 'redlisted',
    title: 'Naturvårdsarter',
    dataTypeFolder: 'redlisted',
    dataType: 'redlisted',
    tableKey: 'edna-redlisted',
    grupp: 'Svamp-grupp',
    mat: 'Nyasvamp-boken',
    obs: 'RankRed'
  }
]

const normalize = (value) => String(value ?? '').trim().toLowerCase()
const normalizeGroup = (value) => String(value ?? '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/\p{Diacritic}+/gu, '')

const hasValueX = (value) => normalize(value) === 'x'

const isUnassessedStatus = (value) => {
  const normalized = normalize(value)
  return normalized === '' || normalized === '0' || normalized === 'ne'
}

const isNotApplicableStatus = (value) => normalize(value) === 'na'

const compareValues = (left, right) => {
  if (left == null && right == null) return 0
  if (left == null) return 1
  if (right == null) return -1
  const leftNumber = Number(left)
  const rightNumber = Number(right)
  if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) {
    return leftNumber - rightNumber
  }
  return String(left).localeCompare(String(right), 'sv', { sensitivity: 'base', numeric: true })
}

const applyTableFilters = (rows, config, tableState) => {
  const searchTerm = normalize(globalSearchTerm.value)
  const selectedFilter = Array.isArray(tableState?.selectedFilter) ? tableState.selectedFilter : []
  const selectedStatus = Array.isArray(tableState?.selectedStatus) ? tableState.selectedStatus : []
  const selectedGrupp = Array.isArray(tableState?.selectedGrupp) ? tableState.selectedGrupp : []
  const selectedMark = Array.isArray(tableState?.selectedMark) ? tableState.selectedMark : []

  return rows.filter((row) => {
    if (searchTerm) {
      const searchable = `${row.Commonname ?? ''} ${row.Scientificname ?? ''}`.toLowerCase()
      if (!searchable.includes(searchTerm)) return false
    }

    if (config.filterEdible && !hasValueX(row[config.mat])) return false
    if (config.filterPoison && hasValueX(row[config.mat])) return false

    if (selectedFilter.length > 0) {
      const matchesSelectedFilter = selectedFilter.some((filterValue) => {
        if (filterValue === 'Matsvamp') return hasValueX(row[config.mat])
        if (filterValue === 'Giftsvamp') return hasValueX(row.Giftsvamp)
        return normalize(row[config.mat]) === normalize(filterValue)
      })
      if (!matchesSelectedFilter) return false
    }

    if (selectedStatus.length > 0) {
      const matchesStatus = selectedStatus.some((status) => {
        if (status === 'Signalart') return row.SIGNAL_art === 'S'
        if (status === 'Ej bedömd') return isUnassessedStatus(row.RL2020kat)
        if (status === 'Ej tillämplig') return isNotApplicableStatus(row.RL2020kat)
        return String(row.RL2020kat ?? '') === status
      })
      if (!matchesStatus) return false
    }

    if (selectedGrupp.length > 0) {
      const groupValue = normalizeGroup(row[config.grupp])
      const selectedNormalized = selectedGrupp.map(normalizeGroup)
      if (!selectedNormalized.includes(groupValue)) return false
    }

    if (selectedMark.length > 0) {
      const matchesMark = selectedMark.some((mark) => {
        if (mark === 'KALKmark') return Boolean(row.KALKmark)
        if (mark === 'ANNANmark') return Boolean(row.ANNANmark)
        return false
      })
      if (!matchesMark) return false
    }

    return true
  })
}

const sortRows = (rows, config, tableState) => {
  const rankSortDefault = config.obs.startsWith('Rank')
    ? [{ id: config.obs, desc: false }, { id: 'Commonname', desc: false }]
    : [{ id: config.obs, desc: true }]

  const sorting = Array.isArray(tableState?.sorting) && tableState.sorting.length > 0
    ? tableState.sorting
    : rankSortDefault

  return [...rows].sort((left, right) => {
    for (const sortDef of sorting) {
      const direction = sortDef?.desc ? -1 : 1
      const result = compareValues(left?.[sortDef.id], right?.[sortDef.id])
      if (result !== 0) return result * direction
    }
    return 0
  })
}

const resolveReportImageUrl = (row) => {
  const source = Array.isArray(row?.images) && row.images.length > 0
    ? row.images[0]
    : row?.image

  if (!source) return ''

  const raw = String(source).trim()
  if (!raw) return ''
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  if (raw.startsWith('//')) return `${window.location.protocol}${raw}`
  if (raw.startsWith('/')) return `${window.location.origin}${raw}`
  return `${window.location.origin}/${raw}`
}

const resolveGroupImageUrl = (group) => {
  const normalizedGroup = normalize(group)
  const iconMapping = {
    övrigt: 'ovrigt.webp',
    hattsvamp: 'hattsvamp.png',
    kantarell: 'kantarell.webp',
    sopp: 'sopp.png',
    taggsvamp: 'taggsvamp.png',
    fingersvamp: 'fingersvamp.webp',
    tryffel: 'tryffel.webp',
    skinnsvamp: 'skinnsvamp.webp',
    skålsvamp: 'skalsvamp.webp'
  }

  const iconFile = iconMapping[normalizedGroup] ?? 'default-icon.png'
  return `${window.location.origin}/images/svampgrupp/${iconFile}`
}

const fetchReportRows = async (config) => {
  const filename = `${config.dataType}-${envStore.geography}-${envStore.forestType}-${envStore.standAge}-${envStore.vegetationType}.json`
  const response = await fetch(`/${config.dataTypeFolder}/${filename}`)
  if (!response.ok) {
    return { rows: [], missingData: true }
  }
  const sourceRows = await response.json()
  const tableState = tableStateStore.getState(config.tableKey)
  const filteredRows = applyTableFilters(sourceRows, config, tableState)
  const sortedRows = sortRows(filteredRows, config, tableState)

  return {
    rows: sortedRows.map((row) => {
      const group = row[config.grupp] ?? ''
      return {
        commonName: row.Commonname ?? '',
        scientificName: row.Scientificname ?? '',
        group,
        groupImageUrl: resolveGroupImageUrl(group),
        status: row.RL2020kat ?? '',
        indicator: row.SIGNAL_art === 'S' ? 'Signalart' : '',
        mark: row.KALKmark ? 'Kalkmark' : row.ANNANmark ? 'Annan mark' : '',
        probability: row[config.obs] ?? '',
        imageUrl: resolveReportImageUrl(row)
      }
    }),
    missingData: false
  }
}

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

async function downloadSpeciesListPdf() {
  const params = [envStore.geography, envStore.forestType, envStore.standAge, envStore.vegetationType]
  if (params.some((param) => !param)) {
    window.alert('Välj geografi, skogstyp, ålder och vegetationstyp innan export.')
    return
  }

  isGeneratingPdf.value = true
  try {
    const sections = await Promise.all(REPORT_TABLES.map(async (config) => {
      const { rows, missingData } = await fetchReportRows(config)
      return {
        id: config.id,
        title: config.title,
        missingData,
        rowCount: rows.length,
        rows
      }
    }))

    const payload = {
      documentTitle: 'Artrapport',
      searchTerm: globalSearchTerm.value,
      generatedAt: new Date().toISOString(),
      environment: {
        geography: envStore.geographyLabel ?? envStore.geography,
        forestType: envStore.forestTypeLabel ?? envStore.forestType,
        standAge: envStore.standAgeLabel ?? envStore.standAge,
        vegetationType: envStore.vegetationTypeLabel ?? envStore.vegetationType
      },
      sections
    }

    const response = await fetch('/api/specieslist-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || 'PDF export failed')
    }

    const pdfBlob = await response.blob()
    const safeDate = new Date().toISOString().slice(0, 10)
    const filename = `arter-${envStore.geography}-${envStore.forestType}-${safeDate}.pdf`
    downloadBlob(pdfBlob, filename)
  } catch (error) {
    console.error('Failed to generate PDF', error)
    window.alert('PDF-kunde inte skapas just nu. Kontrollera serverkonfigurationen och försök igen.')
  } finally {
    isGeneratingPdf.value = false
  }
}

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
  FullScreenEdible: FullscreenTable,
  FullScreenPoison: FullscreenTable,
  RedlistedComponent: FullscreenTable,
  FullScreenEdna: EdnaComponent
}

const emitEnlarge = (componentName) => {
  if (viewTabMap[componentName]) {
    activeTab.value = viewTabMap[componentName]
  }
  emit("enlarge", componentName);
};

const activeTab = ref('dna');
const previousTab = ref(activeTab.value);
const normalViewTabs = [
  { label: 'Enligt DNA', value: 'dna', icon: 'solar:dna-linear' },
  { label: 'Enligt fruktkroppar', value: 'knowledge', icon: 'lineicons:mushroom-1' },
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
const tabOrder = ['dna', 'knowledge'];
const contentTransitionName = computed(() => {
  if (isMobile.value) return 'fade';
  if (activeTab.value === previousTab.value) return 'slide-right-fade';
  const fromIndex = tabOrder.indexOf(previousTab.value);
  const toIndex = tabOrder.indexOf(activeTab.value);
  if (fromIndex === -1 || toIndex === -1) return 'slide-right-fade';
  return toIndex > fromIndex ? 'slide-left-fade' : 'slide-right-fade';
})

const activeDetailComponent = computed(() => detailComponentMap[props.activeView ?? ''] ?? null)

const detailComponentProps = computed(() => {
  if (!props.activeView) {
    return {
      isNormalView: false,
      externalSvampFilter: globalExternalSvampFilter.value,
      externalStatusFilter: globalExternalStatusFilter.value,
      externalGruppFilter: globalExternalGruppFilter.value
    }
  }

  if (props.activeView === 'FullScreenEdible') {
    return {
      isNormalView: false,
      title: 'Matsvampar',
      icon: 'icon-park-solid:knife-fork',
      titleColorClass: 'text-warning-500 dark:text-neutral-300',
      titleClickable: false,
      cardClass: 'rounded-none sm:rounded-lg',
      countFolder: 'edible',
      countType: 'edibledata',
      countFilterKey: 'Nyasvamp-boken',
      dataType: 'edibledata',
      dataTypeFolder: 'edible',
      grupp: 'Svamp-grupp',
      mat: 'Nyasvamp-boken',
      obs: 'Rank matsvamp',
      obsLabel: 'Sannolikhet',
      tableKey: 'edna-edible',
      filterEdible: true,
      externalSvampFilter: globalExternalSvampFilter.value,
      externalStatusFilter: globalExternalStatusFilter.value,
      externalGruppFilter: globalExternalGruppFilter.value
    }
  }

  if (props.activeView === 'FullScreenPoison') {
    return {
      isNormalView: false,
      title: 'Giftsvampar',
      icon: 'i-hugeicons-danger',
      titleColorClass: 'text-poison-500 dark:text-neutral-300',
      titleClickable: false,
      cardClass: 'rounded-none sm:rounded-none border-muted/50',
      countFolder: 'edible',
      countType: 'edibledata',
      countFilterKey: 'Giftsvamp',
      dataType: 'edibledata',
      dataTypeFolder: 'edible',
      grupp: 'Svamp-grupp',
      mat: 'Nyasvamp-boken',
      obs: 'Rank giftsvamp',
      obsLabel: 'Sannolikhet',
      tableKey: 'edna-poison',
      filterPoison: true,
      externalSvampFilter: globalExternalSvampFilter.value,
      externalStatusFilter: globalExternalStatusFilter.value,
      externalGruppFilter: globalExternalGruppFilter.value
    }
  }

  if (props.activeView === 'RedlistedComponent') {
    return {
      isNormalView: false,
      title: 'Naturvårdsarter',
      icon: 'i-material-symbols-award-star-outline',
      titleColorClass: 'text-signal-500 dark:text-neutral-300',
      titleClickable: false,
      cardClass: 'rounded-none sm:rounded-lg',
      countFolder: 'redlisted',
      countType: 'redlisted',
      dataType: 'redlisted',
      dataTypeFolder: 'redlisted',
      grupp: 'Svamp-grupp',
      mat: 'Nyasvamp-boken',
      obs: 'RankRed',
      obsLabel: 'Sannolikhet',
      tableKey: 'edna-redlisted',
      externalSvampFilter: globalExternalSvampFilter.value,
      externalStatusFilter: globalExternalStatusFilter.value,
      externalGruppFilter: globalExternalGruppFilter.value
    }
  }

  if (props.activeView === 'FullScreenEdna') {
    return {
      isNormalView: false,
      externalSvampFilter: globalExternalSvampFilter.value,
      externalStatusFilter: globalExternalStatusFilter.value,
      externalGruppFilter: globalExternalGruppFilter.value
    }
  }

  return {
    isNormalView: false,
    externalSvampFilter: globalExternalSvampFilter.value,
    externalStatusFilter: globalExternalStatusFilter.value,
    externalGruppFilter: globalExternalGruppFilter.value
  }
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
  activeTab.value = isMobile.value ? 'dna' : 'knowledge'
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

watch(activeTab, (val, prev) => {
  previousTab.value = prev
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

.slide-left-fade-enter-active,
.slide-right-fade-enter-active {
  transition: opacity 0.3s ease, transform 0.25s ease;
}

.slide-left-fade-leave-active,
.slide-right-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.slide-left-fade-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}

.slide-left-fade-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

.slide-right-fade-enter-from {
  opacity: 0;
  transform: translateX(24px);
}

.slide-right-fade-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}


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
