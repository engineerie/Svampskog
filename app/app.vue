<script setup lang="ts">
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#111827' : 'white')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
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
  ogImage: 'https://saas-template.nuxt.dev/social-card.png',
  twitterImage: 'https://saas-template.nuxt.dev/social-card.png',
  twitterCard: 'summary_large_image'
})

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'), {
  transform: data => data.find(item => item.path === '/docs')?.children || []
})

const { data: svamparnavigation } = await useAsyncData('svamparnavigation', () => queryCollectionNavigation('mushroomInfo'), {
  transform: data => data.find(item => item.path === '/svampardocs')?.children || []
})

const { data: blognavigation } = await useAsyncData('blognavigation', () => queryCollectionNavigation('posts'), {
  transform: data => data.find(item => item.path === '/blog')?.children || []
})




// const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
//   server: false
// })

// const links = [{
//   label: 'Docs',
//   icon: 'i-lucide-book',
//   to: '/docs/getting-started'
// }, {
//   label: 'Pricing',
//   icon: 'i-lucide-credit-card',
//   to: '/pricing'
// }, {
//   label: 'Blog',
//   icon: 'i-lucide-pencil',
//   to: '/blog'
// }]

provide('navigation', navigation)
provide('svamparnavigation', svamparnavigation)
provide('blognavigation', blognavigation)

</script>

<template>
  <UApp>
    <!-- <UBanner class="hidden md:block" icon="i-fluent-emoji-high-contrast-construction" color="warning" title="Utvecklingsarbete och dokumentation pågår" /> -->

    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- <ClientOnly>
      <LazyUContentSearch
        :files="files"
        shortcut="meta_k"
        :navigation="navigation"
        :links="links"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly> -->
  </UApp>
</template>
