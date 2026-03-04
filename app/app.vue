<script setup lang="ts">
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
provide('overlayTextsNavigation', overlayTextsNavigation)

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
      <LazyUContentSearch icon="i-lucide-box" :close="false" :files="commandFiles" shortcut="meta_k"
        :groups="commandGroups" :links="[]" :fuse="{ resultLimit: 42 }" size="xl" :ui="{
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
      </LazyUContentSearch>
    </ClientOnly>

  </UApp>
</template>

<style>
.command-palette-root:has(.command-palette-back) .command-palette-label {
  display: none;
}
</style>
