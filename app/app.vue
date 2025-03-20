<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ContentNavigationItem } from '@nuxt/content'


const colorMode = useColorMode()
const color = computed(() => colorMode.value === 'dark' ? '#111827' : 'white')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: { lang: 'en' }
})

useSeoMeta({
  titleTemplate: '%s - Nuxt UI Pro - SaaS template',
  ogImage: 'https://saas-template.nuxt.dev/social-card.png',
  twitterImage: 'https://saas-template.nuxt.dev/social-card.png',
  twitterCard: 'summary_large_image'
})

const route = useRoute()

// Create a reactive variable for navigation data.
const navigation = ref<ContentNavigationItem[]>([])

// Define a helper function to fetch navigation based on the current route.
async function fetchNavigation() {
  const isInfo = route.path.startsWith('/info')
  const collectionKey = isInfo ? 'information' : 'docs'
  const navRoot = isInfo ? '/info' : '/docs'
  
  const { data } = await useAsyncData('navigation', () =>
    queryCollectionNavigation(collectionKey),
    {
      transform: data => data.find(item => item.path === navRoot)?.children || []
    }
  )
  navigation.value = data.value || []
}

// Initial fetch.
fetchNavigation()

// Watch the route and re-fetch navigation when the path changes.
watch(() => route.path, () => {
  fetchNavigation()
})

// Use dynamic search sections query based on the current route.
const { data: files } = useLazyAsyncData('search', () =>
  queryCollectionSearchSections(route.path.startsWith('/info') ? 'information' : 'docs'),
  { server: false }
)

const links = [
  { label: 'Docs', icon: 'i-lucide-book', to: '/docs/guide' },
  { label: 'Pricing', icon: 'i-lucide-credit-card', to: '/pricing' },
  { label: 'Blog', icon: 'i-lucide-pencil', to: '/blog' }
]

// Provide the reactive navigation data to child components.
provide('navigation', navigation)
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        shortcut="meta_k"
        :navigation="navigation"
        :links="links"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>
  </UApp>
</template>