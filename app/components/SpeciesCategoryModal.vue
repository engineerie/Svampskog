<template>
  <div class="not-prose my-6">
    <UModal v-model:open="isOpen" :fullscreen="isMobile" :title="config.title" :description="config.description"
      :ui="{ content: 'sm:max-w-3xl', body: 'p-0 sm:p-0' }">
      <UButton :label="config.buttonLabel" :icon="config.icon" color="neutral" variant="outline" size="lg" trailing />

      <template #body>
        <div class="flex min-h-0 flex-col">
          <div class="border-b border-muted/50 p-4 sm:p-6">
            <div v-if="props.category === 'conservation'" class="mb-4 grid grid-cols-2 gap-2" role="group"
              aria-label="Välj typ av naturvårdsart">
              <UButton v-for="option in conservationOptions" :key="option.value" :label="option.label"
                :icon="option.icon" :variant="conservationView === option.value ? 'soft' : 'outline'"
                :color="conservationView === option.value ? option.color : 'neutral'" class="justify-center"
                @click="conservationView = option.value" />
            </div>

            <UInput v-model="searchTerm" icon="i-lucide-search" placeholder="Sök på svenskt eller vetenskapligt namn"
              size="lg" class="w-full" />
            <p v-if="!isLoading && !errorMessage" class="mt-2 text-sm text-muted">
              {{ filteredSpecies.length }} av {{ species.length }} arter
            </p>
          </div>

          <div class="max-h-[65vh] overflow-y-auto p-2 sm:p-4">
            <div v-if="isLoading" class="flex items-center justify-center gap-2 py-16 text-muted">
              <UIcon name="i-lucide-loader-circle" class="size-5 animate-spin" />
              Hämtar arter…
            </div>

            <UAlert v-else-if="errorMessage" color="error" variant="soft" icon="i-lucide-circle-alert"
              title="Listan kunde inte hämtas" :description="errorMessage" class="m-2" />

            <div v-else-if="filteredSpecies.length" role="list" class="divide-y divide-muted/50">
              <div v-for="row in filteredSpecies" :key="String(row.taxon || row.Scientificname || '')" role="listitem">
                <button type="button"
                  class="flex w-full items-center justify-between gap-4 rounded-md px-3 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
                  :aria-label="`Visa information om ${displayCommonName(row)}`" @click="selectSpecies(row)">
                  <div class="flex min-w-0 items-center gap-3">
                    <img v-if="hasSpeciesImage(row)" :src="getSpeciesImage(row)" :alt="`${displayCommonName(row)} bild`"
                      class="h-16 w-20 shrink-0 rounded-md border border-muted/50 object-cover" loading="lazy"
                      decoding="async" width="80" height="64" @error="markImageAsFailed(row)">
                    <div v-else
                      class="flex h-16 w-20 shrink-0 items-center justify-center rounded-md border border-muted/50 bg-muted/50">
                      <img :src="getGroupIconPath(row)" :alt="`${getSpeciesGroup(row) || 'Svamp'} ikon`"
                        class="size-8 object-contain" loading="lazy" decoding="async" width="32" height="32">
                    </div>

                    <div class="min-w-0">
                      <p class="truncate font-medium text-highlighted">
                        {{ displayCommonName(row) }}
                      </p>
                      <p class="truncate text-sm italic text-muted">
                        {{ row.Scientificname }}
                      </p>
                    </div>
                  </div>

                  <div v-if="props.category === 'edible' && isGoodEdibleSpecies(row)"
                    class="flex shrink-0 flex-wrap justify-end gap-1">
                    <UBadge color="warning" variant="soft">
                      God matsvamp
                    </UBadge>
                  </div>

                  <div v-if="props.category === 'conservation'" class="flex shrink-0 flex-wrap justify-end gap-1">
                    <UBadge v-if="isRedlisted(row)" color="error" variant="soft">
                      {{ row.RL2025kat || row.RL2020kat }}
                    </UBadge>
                    <UBadge v-if="isSignalSpecies(row)" color="signal" variant="soft">
                      Signalart
                    </UBadge>
                  </div>
                </button>
              </div>
            </div>

            <p v-else class="py-16 text-center text-muted">
              Inga arter matchar sökningen.
            </p>
          </div>
        </div>
      </template>
    </UModal>

    <MySlideover v-model="showSlideover" :pinned="isPinned" @update:pinned="isPinned = $event">
      <SpeciesInfo v-if="speciesStore.selectedSpecies" :species="speciesStore.selectedSpecies"
        :source="speciesStore.sourceComponent" />
    </MySlideover>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useSpeciesStore } from '~/stores/speciesStore'

type Category = 'edible' | 'poisonous' | 'conservation'

interface SpeciesRow {
  taxon?: number | string | null
  Scientificname?: string | null
  Commonname?: string | null
  RL2020kat?: string | null
  RL2025kat?: string | null
  SIGNAL_art?: string | null
  Giftsvamp?: string | null
  'Nyasvamp-boken'?: string | null
  'God matsvamp'?: string | null
  'Svamp-grupp'?: string | null
  'Svamp-grupp-släkte'?: string | null
  images?: string[] | null
}

const props = defineProps<{
  category: Category
}>()

const categoryConfig: Record<Category, {
  title: string
  description: string
  buttonLabel: string
  icon: string
}> = {
  edible: {
    title: 'Gatsvampar',
    description: 'Matsvampar som är mykorrhizasvampar.',
    buttonLabel: 'Visa matsvampar som är mykorrhizasvampar',
    icon: 'icon-park-solid:knife-fork'
  },
  poisonous: {
    title: 'Giftsvampar',
    description: 'Giftsvampar som är mykorrhizasvampar.',
    buttonLabel: 'Visa giftsvampar som är mykorrhizasvampar',
    icon: 'i-hugeicons-danger'
  },
  conservation: {
    title: 'Naturvårdsarter',
    description: 'Rödlistade arter och signalarter som är mykorrhizasvampar.',
    buttonLabel: 'Visa naturvårdsarter som är mykorrhizasvampar',
    icon: 'i-material-symbols-award-star-outline'
  }
}

const redlistCategories = new Set(['VU', 'EN', 'CR', 'DD', 'NT', 'RE'])
type ConservationView = 'redlisted' | 'signal'
const isOpen = ref(false)
const showSlideover = ref(false)
const isPinned = ref(false)
const isLoading = ref(false)
const hasLoaded = ref(false)
const errorMessage = ref('')
const searchTerm = ref('')
const conservationView = ref<ConservationView>('redlisted')
const allSpecies = ref<SpeciesRow[]>([])
const failedImageKeys = ref<Set<string>>(new Set())
const isMobile = useMediaQuery('(max-width: 639px)')
const speciesStore = useSpeciesStore()

const config = computed(() => categoryConfig[props.category])

const redlistedSpecies = computed(() => allSpecies.value.filter(isRedlisted))
const signalSpecies = computed(() => allSpecies.value.filter(isSignalSpecies))
const conservationOptions = computed(() => [
  {
    value: 'redlisted' as const,
    label: `Rödlistade arter (${redlistedSpecies.value.length})`,
    icon: 'i-lucide-triangle-alert',
    color: 'error' as const
  },
  {
    value: 'signal' as const,
    label: `Signalarter (${signalSpecies.value.length})`,
    icon: 'i-material-symbols-flag',
    color: 'signal' as const
  }
])

function normalizedMarker(value: unknown) {
  return String(value ?? '').trim().toLowerCase()
}

function normalizeSearch(value: unknown) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('sv')
}

function isRedlisted(row: SpeciesRow) {
  return redlistCategories.has(String(row.RL2025kat || row.RL2020kat || '').trim().toUpperCase())
}

function isSignalSpecies(row: SpeciesRow) {
  return normalizedMarker(row.SIGNAL_art) === 's'
}

function isGoodEdibleSpecies(row: SpeciesRow) {
  return normalizedMarker(row['God matsvamp']) === 'x'
}

function displayCommonName(row: SpeciesRow) {
  const commonName = String(row.Commonname || '').trim()
  return commonName && commonName !== 'Saknar svenskt namn'
    ? commonName
    : 'Saknar svenskt namn'
}

function getImageKey(row: SpeciesRow) {
  return String(row.taxon || row.Scientificname || '')
}

function hasSpeciesImage(row: SpeciesRow) {
  return Boolean(row.images?.[0]) && !failedImageKeys.value.has(getImageKey(row))
}

function getSpeciesImage(row: SpeciesRow) {
  return row.images?.[0] || ''
}

function markImageAsFailed(row: SpeciesRow) {
  failedImageKeys.value = new Set([...failedImageKeys.value, getImageKey(row)])
}

function getSpeciesGroup(row: SpeciesRow) {
  return String(row['Svamp-grupp'] || row['Svamp-grupp-släkte'] || '')
    .trim()
    .toLocaleLowerCase('sv')
}

function getGroupIconPath(row: SpeciesRow) {
  const iconMapping: Record<string, string> = {
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

  return `/images/svampgrupp/${iconMapping[getSpeciesGroup(row)] || 'default-icon.png'}`
}

async function selectSpecies(row: SpeciesRow) {
  isOpen.value = false
  await nextTick()
  speciesStore.selectSpecies(row, 'all-species')
  showSlideover.value = true
}

const species = computed(() => {
  const rows = allSpecies.value.filter((row) => {
    if (props.category === 'edible') return normalizedMarker(row['Nyasvamp-boken']) === 'x'
    if (props.category === 'poisonous') return normalizedMarker(row.Giftsvamp) === 'x'
    return conservationView.value === 'redlisted'
      ? isRedlisted(row)
      : isSignalSpecies(row)
  })

  return rows.slice().sort((a, b) => {
    const nameA = displayCommonName(a) === 'Saknar svenskt namn' ? a.Scientificname : displayCommonName(a)
    const nameB = displayCommonName(b) === 'Saknar svenskt namn' ? b.Scientificname : displayCommonName(b)
    return String(nameA || '').localeCompare(String(nameB || ''), 'sv')
  })
})

const filteredSpecies = computed(() => {
  const search = normalizeSearch(searchTerm.value.trim())
  if (!search) return species.value

  return species.value.filter((row) =>
    normalizeSearch(row.Commonname).includes(search)
    || normalizeSearch(row.Scientificname).includes(search)
  )
})

async function loadSpecies() {
  if (hasLoaded.value || isLoading.value) return

  isLoading.value = true
  errorMessage.value = ''
  try {
    allSpecies.value = await $fetch<SpeciesRow[]>('/species/all-species.json')
    hasLoaded.value = true
  } catch {
    errorMessage.value = 'Försök igen genom att stänga och öppna listan.'
  } finally {
    isLoading.value = false
  }
}

watch(isOpen, (open) => {
  if (open) loadSpecies()
})

watch(showSlideover, (open) => {
  if (!open) speciesStore.clearSelection()
})
</script>
