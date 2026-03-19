<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const route = useRoute()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const omProjektNavigation = computed<ContentNavigationItem[]>(() => [
  {
    title: 'Om projektet',
    path: '/om-projektet'
  },
  {
    title: 'Ändringslogg',
    path: '/om-projektet/andringslogg'
  }
])

const currentNavigation = computed(() => {
  if (route.path.startsWith('/om-projektet')) {
    return omProjektNavigation.value
  }

  return navigation.value || []
})
</script>

<template>
  <div>
    <AppHeader />

    <UMain>
      <UContainer>
        <UPage :ui="{ root: 'pt-8 sm:pt-12 lg:pt-12', }">
          <template #left>
            <UPageAside>
              <!-- <UContentNavigation :navigation="currentNavigation" variant="link" /> -->
            </UPageAside>
          </template>

          <slot />
        </UPage>
      </UContainer>
    </UMain>

    <AppFooter />
  </div>
</template>
