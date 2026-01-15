<script setup lang="ts">
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

const { data: svamparnavigation } = await useAsyncData('svamparnavigation', () => queryCollectionNavigation('mushroomInfo'), {
  transform: data => data.find(item => item.path === '/svampardocs')?.children || []
})

const { data: blognavigation } = await useAsyncData('blognavigation', () => queryCollectionNavigation('posts'), {
  transform: data => data.find(item => item.path === '/blog')?.children || []
})

const { data: skogsskotselNavigation } = await useAsyncData('skogsskotselnavigation', () => queryCollectionNavigation('forestryFrameworks'), {
  transform: data => {
    const root = data.find(item => item.path?.startsWith('/skogsskotsel'))
    return root?.children || []
  }
})

provide('navigation', navigation)
provide('svamparnavigation', svamparnavigation)
provide('blognavigation', blognavigation)
provide('skogsskotselnavigation', skogsskotselNavigation)

</script>

<template>
  <UApp>
    <!-- <UBanner class="" icon="i-fluent-emoji-high-contrast-construction" color="warning"
      title="Utvecklingsarbete pågår" /> -->
    <NuxtLoadingIndicator />
    <div data-vaul-drawer-wrapper>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>

  </UApp>
</template>
