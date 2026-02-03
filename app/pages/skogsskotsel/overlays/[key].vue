<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

definePageMeta({
  alias: ['/overlays/:key', '/skogsskotsel/overlays/texts/:key'],
})

const route = useRoute()
const overlayKey = computed(() => String(route.params.key || ''))
const overlayPath = computed(() => String(route.path || ''))

const { data: overlayDoc } = await useAsyncData(
  () => `overlay-text-${overlayKey.value}`,
  async () => {
    const byPath = await queryCollection('overlayTexts').path(overlayPath.value).first()
    if (byPath) return byPath
    return queryCollection('overlayTexts').where('key', '=', overlayKey.value).first()
  },
  { watch: [overlayKey, overlayPath] }
)

if (!overlayDoc.value) {
  throw createError({ statusCode: 404, statusMessage: 'Overlay not found' })
}

const navigation = inject<Ref<ContentNavigationItem[]>>('overlayTextsNavigation', ref([]))
</script>

<template>
  <UContainer>
    <UPage>
      <template #left>
        <UPageAside>
          <UContentNavigation :navigation="navigation" />
        </UPageAside>
      </template>
      <template #right>
        <div></div>
      </template>
      <UPageHeader :title="overlayDoc?.title" :description="overlayDoc?.description" />
      <UPageBody>
        <NuxtImg v-if="overlayDoc?.image" :src="overlayDoc?.image" width="800" format="webp" quality="80"
          alt="Illustration" class="w-full rounded-lg" />
        <ContentRenderer v-if="overlayDoc" :value="overlayDoc" />
      </UPageBody>
    </UPage>
  </UContainer>


</template>
