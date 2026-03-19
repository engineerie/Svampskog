<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { sv } from '@nuxt/ui/locale'
// const colorMode = useColorMode()

// const color = computed(() => colorMode.value === 'dark' ? '#111827' : 'white')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    // { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  titleTemplate: 'Svampskog',
  ogImage: '/images/social-card.png',
  twitterImage: '/images/social-card.png',
  twitterCard: 'summary_large_image'
})

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'), {
  transform: data => data.find(item => item.path === '/docs')?.children || []
})

const { data: blognavigation } = await useAsyncData('blognavigation', () => queryCollectionNavigation('posts'), {
  transform: data => data.find(item => item.path === '/svampkunskap')?.children || []
})

const { data: skogsskotselNavigation } = await useAsyncData('skogsskotselnavigation', () => queryCollectionNavigation('forestryFrameworks'), {
  transform: data => {
    const root = data.find(item => item.path?.startsWith('/skogsskotsel'))
    return root?.children || []
  }
})

const { data: omProjektNavigation } = await useAsyncData('omprojektnavigation', () => queryCollectionNavigation('information'), {
  transform: data => {
    const root = data.find(item => item.path?.startsWith('/om-projektet'))
    return root?.children || []
  }
})

const { data: overlayTextsNavigation } = await useAsyncData(
  'overlayTextsNavigation',
  () => queryCollectionNavigation('overlayTexts'),
  {
    transform: data => {
      const root = data.find(item => item.path?.startsWith('/skogsskotsel/markorer'))
      return root?.children?.length ? root.children : data
    }
  }
)

const commandLinks = [
  {
    label: 'Gå till svampar',
    icon: 'i-lineicons-mushroom-1',
    to: '/mykorrhizasvampar'
  },
  {
    label: 'Gå till skogsskötsel',
    icon: 'i-hugeicons-tree-06',
    to: '/skogsskotsel'
  },
  {
    label: 'Gå till svampkunskap',
    icon: 'i-lucide-book-open',
    to: '/svampkunskap'
  },
  {
    label: 'Gå till om projektet',
    icon: 'i-lucide-info',
    to: '/om-projektet'
  }
]

type BlogNavItem = {
  title?: string
  path?: string
  children?: BlogNavItem[]
}

type SearchSection = {
  id?: string
  title?: string
  titles?: string[]
}

type GlossaryEntry = {
  term?: string
  definition?: string
  aliases?: string[]
}

type SpeciesEntry = {
  Commonname?: string
  Scientificname?: string
  ekologi?: string
  images?: string[]
  Artfakta?: string
  Svampguiden?: string
  Giftsvamp?: string | null
  SIGNAL_art?: string | null
  'Nyasvamp-boken'?: string | null
  KALKmark?: string | null
  ANNANmark?: string | null
  'Svamp-grupp'?: string | null
  'Svamp-Undersvamp-grupp'?: string | null
}

function normalizePathKey(value: string) {
  return decodeURIComponent(value || '')
    .trim()
    .toLowerCase()
}

function articlePathFromAnchor(anchorPath: string) {
  return anchorPath.split('#')[0] || anchorPath
}

const svampkunskapPageItems = computed(() => {
  const result: Array<{ label: string, to: string, icon: string, suffix?: string }> = []
  const seen = new Set<string>()

  const walk = (item: BlogNavItem, trail: string[] = []) => {
    if (item?.title && item?.path) {
      const key = decodeURIComponent(item.path).trim().toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        result.push({
          label: item.title,
          to: item.path,
          icon: 'i-lucide-file-text',
          suffix: trail.length ? trail.join(' > ') : 'Artikel'
        })
      }
    }
    if (Array.isArray(item?.children) && item.children.length) {
      const nextTrail = item?.title ? [...trail, item.title] : trail
      item.children.forEach(child => walk(child, nextTrail))
    }
  }

    ; ((blognavigation.value as BlogNavItem[]) || []).forEach(item => walk(item))
  return result
})

const svampkunskapHeaderItems = computed(() => {
  const rows = ((commandFiles.value as SearchSection[] | null) || [])
    .filter(row => typeof row?.id === 'string' && row.id.startsWith('/svampkunskap/') && row.id.includes('#'))

  const seen = new Set<string>()
  const items: Array<{ label: string, to: string, icon: string, suffix?: string }> = []

  for (const row of rows) {
    const to = String(row.id)
    const normalizedKey = decodeURIComponent(to).trim().toLowerCase()
    if (seen.has(normalizedKey)) continue
    seen.add(normalizedKey)

    const trail = Array.isArray(row.titles) ? row.titles.filter(Boolean) : []
    items.push({
      label: row.title || trail[trail.length - 1] || 'Rubrik',
      to,
      icon: 'i-lucide-heading',
      suffix: trail.length > 1 ? trail.slice(0, -1).join(' > ') : undefined
    })
  }

  return items
})

const svampkunskapSearchChildren = computed(() => {
  const pages = svampkunskapPageItems.value
  const headers = svampkunskapHeaderItems.value

  const headersByArticle = new Map<string, Array<{ label: string, to: string, icon: string, suffix?: string }>>()
  for (const header of headers) {
    const articlePath = articlePathFromAnchor(header.to)
    const key = normalizePathKey(articlePath)
    const list = headersByArticle.get(key) || []
    list.push(header)
    headersByArticle.set(key, list)
  }

  const combined: Array<{ label: string, to: string, icon: string, suffix?: string }> = []
  for (const page of pages) {
    combined.push(page)
    const key = normalizePathKey(page.to)
    const pageHeaders = headersByArticle.get(key) || []
    combined.push(...pageHeaders)
  }

  return combined
})

const { data: glossaryDoc } = await useAsyncData('glossary', () => queryCollection('glossary').first())

const { data: speciesData } = useLazyAsyncData('species-search-poc', async () => {
  try {
    return await $fetch<SpeciesEntry[]>('/edible/edibledata-Norr-Barrblandskog-1-40-Blåbär_grupp.json')
  } catch {
    return []
  }
}, {
  server: false
})

function stripDetailsFromURL(url?: string) {
  if (!url) return ''
  return url.replace('/detaljer', '').replace('/artinformation', '')
}

function speciesGroupIconPath(species?: SpeciesEntry) {
  const rawGroup = species?.['Svamp-grupp'] || species?.['Svamp-Undersvamp-grupp'] || 'övrigt'
  const group = String(rawGroup).trim().toLowerCase()

  const iconMapping: Record<string, string> = {
    övrigt: 'ovrigt.png',
    ovrigt: 'ovrigt.png',
    hattsvamp: 'hattsvamp.png',
    kantarell: 'kantarell.png',
    sopp: 'sopp.png',
    taggsvamp: 'taggsvamp.png',
    fingersvamp: 'fingersvamp.png',
    tryffel: 'tryffel.png',
    skinnsvamp: 'skinnsvamp.png',
    skålsvamp: 'skalsvamp.png',
    skalsvamp: 'skalsvamp.png'
  }

  return `/images/svampgrupp/${iconMapping[group] || 'default-icon.png'}`
}

const glossaryItems = computed(() => {
  const entries = ((glossaryDoc.value as any)?.entries || []) as GlossaryEntry[]
  const items = entries
    .filter(entry => entry?.term && entry?.definition)
    .map(entry => ({
      label: entry.term as string,
      icon: 'i-lucide-book-text',
      definition: entry.definition as string,
      suffix: Array.isArray(entry.aliases) && entry.aliases.length
        ? `Alias: ${entry.aliases.join(', ')}`
        : undefined,
      children: [
        {
          label: entry.term as string,
          slot: 'glossary-definition',
          definition: entry.definition as string,
          aliases: entry.aliases,
          disabled: true,
          class: 'cursor-default',
          ui: {
            item: 'items-start select-text cursor-text'
          }
        }
      ]
    }))

  if (!items.length) {
    return [
      {
        label: 'Ordlista laddas...',
        icon: 'i-lucide-loader-circle',
        suffix: 'Inga ord tillgängliga ännu.',
        disabled: true
      }
    ]
  }

  return items
})

const speciesItems = computed(() => {
  const rows = (speciesData.value || []).filter(row => row?.Commonname || row?.Scientificname)

  const items = rows
    .map((row) => ({
      label: row.Commonname || row.Scientificname || 'Okänd art',
      avatar: {
        src: speciesGroupIconPath(row),
        alt: row['Svamp-grupp'] || row['Svamp-Undersvamp-grupp'] || 'Svampgrupp'
      },
      suffix: row.Scientificname,
      species: row,
      children: [
        {
          label: row.Commonname || row.Scientificname || 'Okänd art',
          slot: 'species-definition',
          species: row,
          disabled: true,
          class: 'cursor-default',
          ui: {
            item: 'items-start select-text cursor-text'
          }
        }
      ]
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'sv'))

  if (!items.length) {
    return [
      {
        label: 'Artlista laddas...',
        icon: 'i-lucide-loader-circle',
        suffix: 'Inga arter tillgängliga ännu.',
        disabled: true
      }
    ]
  }

  return items
})

const commandGroups = computed(() => [
  {
    id: 'svampkunskap-search',
    label: 'Sök',
    items: [
      {
        label: 'Sök i svampkunskap',
        icon: 'i-lucide-search',
        placeholder: 'Sök i svampkunskap',
        children: svampkunskapSearchChildren.value
      },
      {
        label: 'Sök i ordlista',
        icon: 'i-lucide-book-open-text',
        placeholder: 'Sök i ordlista',
        children: glossaryItems.value
      },
      {
        label: 'Sök arter',
        icon: 'i-lineicons-mushroom-1',
        placeholder: 'Sök arter',
        children: speciesItems.value
      }
    ]
  }
])

const uiLocale = computed(() => ({
  ...sv,
  messages: {
    ...sv.messages,
    contentSearch: {
      ...sv.messages.contentSearch,
      links: 'Sidor',
      theme: 'Artiklar svampkunskap'
    }
  }
}))

const { data: commandFiles } = useLazyAsyncData('global-command-search', async () => {
  const safeSections = async (collection: string) => {
    try {
      return await queryCollectionSearchSections(collection as any)
    } catch {
      return []
    }
  }

  const [docs, posts, forestry] = await Promise.all([
    safeSections('docs'),
    safeSections('posts'),
    safeSections('forestryFrameworks')
  ])

  return [...docs, ...posts, ...forestry]
}, {
  server: false
})

provide('navigation', navigation)
provide('blognavigation', blognavigation)
provide('skogsskotselnavigation', skogsskotselNavigation)
provide('omprojektnavigation', omProjektNavigation)
provide('overlayTextsNavigation', overlayTextsNavigation)

let paletteMutationObserver: MutationObserver | null = null
let speciesDetailWasVisible = false

function resetPaletteScrollToTop() {
  const root = document.querySelector('.command-palette-root')
  if (!(root instanceof HTMLElement)) return

  const viewport = root.querySelector('[data-slot="viewport"]')
  const content = root.querySelector('[data-slot="content"]')

  if (viewport instanceof HTMLElement) viewport.scrollTop = 0
  if (content instanceof HTMLElement) content.scrollTop = 0
}

onMounted(() => {
  paletteMutationObserver = new MutationObserver(() => {
    const speciesDetailVisible = !!document.querySelector('.species-definition-panel')

    if (speciesDetailVisible && !speciesDetailWasVisible) {
      requestAnimationFrame(() => {
        resetPaletteScrollToTop()
        requestAnimationFrame(() => resetPaletteScrollToTop())
      })
    }

    speciesDetailWasVisible = speciesDetailVisible
  })

  paletteMutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  })
})

onBeforeUnmount(() => {
  paletteMutationObserver?.disconnect()
  paletteMutationObserver = null
})

</script>

<template>
  <UApp :locale="uiLocale">
    <!-- <UBanner class="" icon="i-fluent-emoji-high-contrast-construction" color="warning"
      title="Utvecklingsarbete pågår" /> -->
    <NuxtLoadingIndicator />
    <div data-vaul-drawer-wrapper>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
    <ClientOnly>
      <LazyUContentSearch :close="false" :files="commandFiles" shortcut="meta_k" :groups="commandGroups" :links="[]"
        :fuse="{ resultLimit: 42 }" size="xl" :ui="{
          root: 'command-palette-root',
          modal: 'sm:max-w-xl',
          input: 'p-1.5 text-lg',
          group: 'p-2',
          label: 'command-palette-label px-2 py-1.5 text-xs font-semibold',
          back: 'command-palette-back',
          item: 'p-3.5 gap-2 ',
          itemLeadingIcon: 'size-5',
          itemTrailing: 'gap-2',
          viewport: 'divide-none'
        }">
        <template #glossary-definition="{ item }">
          <div class="w-full py-1 text-left select-text">
            <h3 class="text-3xl font-semibold text-neutral-900 mb-4">{{ item.label }}</h3>
            <p class="text-base text-neutral-700 leading-relaxed whitespace-normal">
              {{ item.definition }}
            </p>
            <p v-if="item.aliases?.length" class="text-xs text-neutral-500 mt-2">
              Alias: {{ item.aliases.join(', ') }}
            </p>
          </div>
        </template>
        <template #species-definition="{ item }">
          <div class="species-definition-panel w-full py-1 text-left select-text">
            <div class="  items-start">
              <div>
                <div>
                  <h3 class="text-3xl font-semibold text-neutral-900">{{ item.species?.Commonname || item.label }}</h3>
                  <p class="text-base italic text-neutral-600">{{ item.species?.Scientificname }}</p>

                </div>
                <div class="mt-3 flex flex-wrap gap-2">
                  <UButton v-if="item.species?.Artfakta && item.species.Artfakta !== 'Information saknas'"
                    :to="stripDetailsFromURL(item.species.Artfakta)" target="_blank" size="sm" variant="outline"
                    color="neutral" icon="i-heroicons-arrow-top-right-on-square-20-solid" label="Artfakta" />
                  <UButton v-if="item.species?.Svampguiden && item.species.Svampguiden !== '0'"
                    :to="stripDetailsFromURL(item.species.Svampguiden)" target="_blank" size="sm" variant="outline"
                    color="neutral" icon="i-heroicons-arrow-top-right-on-square-20-solid" label="Svampguiden" />
                </div>
                <div class="mt-3 flex flex-wrap gap-1.5">
                  <UBadge v-if="item.species?.['Nyasvamp-boken'] === 'x'" color="warning" size="md" variant="subtle">
                    Matsvamp
                  </UBadge>
                  <UBadge v-if="item.species?.Giftsvamp === 'x'" color="poison" size="md" variant="subtle">
                    Giftsvamp
                  </UBadge>
                  <UBadge v-if="item.species?.SIGNAL_art === 'S'" color="signal" size="md" variant="subtle">
                    Signalart
                  </UBadge>
                  <UBadge v-if="item.species?.KALKmark" color="kalkmark" size="md" variant="subtle">
                    Kalkmark
                  </UBadge>
                  <UBadge v-if="item.species?.ANNANmark" color="vanligmark" size="md" variant="subtle">
                    Vanlig skogsmark
                  </UBadge>
                </div>
              </div>
            </div>


            <p v-if="item.species?.ekologi" class="mt-3 text-base text-neutral-700 leading-relaxed whitespace-normal">
              {{ item.species.ekologi }}
            </p>

            <NuxtImg v-if="item.species?.images?.[0]" :src="item.species.images[0]" width="400" height="250"
              class="h-full w-full object-cover rounded-md my-6 shadow" :alt="item.species?.Commonname || item.label" />



          </div>
        </template>
      </LazyUContentSearch>
    </ClientOnly>

  </UApp>
</template>

<style>
.command-palette-root:has(.command-palette-back) .command-palette-label {
  display: none;
}
</style>
