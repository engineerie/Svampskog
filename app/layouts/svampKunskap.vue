<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('blognavigation')
</script>

<template>
  <div>
    <AppHeader />

    <UMain>
      <UContainer class="px-0">
        <UPage>
          <!-- <template #left>
            <UPageAside>
              <template #top>
                <UContentSearchButton
                  label="Search..."
                  variant="outline"
                  class="w-full"
                >
                  <template #trailing>
                    <div class="flex items-center gap-0.5 ms-auto">
                      <UKbd value="meta" />
                      <UKbd value="k" />
                    </div>
                  </template>
                </UContentSearchButton>
              </template>
              <UContentNavigation
                :navigation="navigation"
                variant="pill"
              />
            </UPageAside>
          </template> -->

          <slot />
        </UPage>
      </UContainer>
    </UMain>

    <AppFooter />
  </div>
</template>
