<script setup lang="ts">
import { computed } from 'vue'

interface EcologyIntroItem {
  title?: string
  image?: string
  img?: string
  img2?: string
  description?: string
  noBorder?: boolean
}

interface EcologyIntroSection {
  title?: string
  description?: string
  items: EcologyIntroItem[]
}

const props = defineProps<{
  section?: EcologyIntroSection | null
  items?: EcologyIntroItem[] | null
  title?: string
  description?: string
}>()

const slides = computed<EcologyIntroItem[]>(() => props.items ?? props.section?.items ?? [])

const collageImagesMap: Record<string, string[]> = {
  'Många skogssvampar bildar mykorrhiza': [
    '/images/svampgrid/Cantharellus cibarius-3.jpg',
    '/images/svampgrid/Entoloma sinuatum-4-4037.jpg',
    '/images/svampgrid/Gomphus clavatus-1.jpg',
    '/images/svampgrid/Hygrocybe ovina-804.jpg',
    '/images/svampgrid/Tricholoma matsutake-166-6276.jpg',
    '/images/svampgrid/Tricholoma virgatum-60-.jpg',
  ],
}

function resolvePrimaryImage(item: EcologyIntroItem) {
  return (item?.image ?? item?.img ?? '') as string
}

function resolveSecondaryImage(item: EcologyIntroItem) {
  return (item?.img2 ?? '') as string
}

function resolveDescription(item: EcologyIntroItem) {
  return (item?.description ?? '') as string
}

function isCollage(item: EcologyIntroItem) {
  const title = (item?.title ?? '').trim()
  return !!collageImagesMap[title]
}

function collageImagesFor(item: EcologyIntroItem) {
  const title = (item?.title ?? '').trim()
  return collageImagesMap[title] ?? []
}

function collageGridClass(item: EcologyIntroItem) {
  const title = (item?.title ?? '').trim()
  if (title === 'Många skogssvampar bildar mykorrhiza') return 'grid grid-cols-3'
  return 'grid grid-cols-3'
}
</script>

<template>
  <section>
    <div class="flex flex-col gap-4 sm:gap-6 ">
      <article v-for="(item, i) in slides" :key="i" class="flex flex-col rounded-lg">
        <div v-if="isCollage(item)" :class="`${collageGridClass(item)} rounded-lg overflow-hidden`">
          <img v-for="(src, idx) in collageImagesFor(item)" :key="idx" :src="src" :alt="item.title || ''"
            class="rounded-none w-full h-full object-cover " />
        </div>
        <div v-else-if="resolvePrimaryImage(item) || resolveSecondaryImage(item)" class="relative w-full space-y-3">
          <img v-if="resolvePrimaryImage(item)" :src="resolvePrimaryImage(item)" :alt="item.title || ''"
            class=" rounded-lg w-full object-cover" />
          <img v-if="resolveSecondaryImage(item)" :src="resolveSecondaryImage(item)" :alt="item.title || ''" fit="cover"
            class=" rounded-lg w-full object-cover" />
        </div>
        <h3 v-if="item.title" class="text-xl font-semibold text-neutral-900 px-3 mt-6 mb-2">
          {{ item.title }}
        </h3>
        <MDC v-if="resolveDescription(item)" :value="resolveDescription(item)"
          class="prose prose-neutral max-w-none px-3 pb-3 pt-0 [&>*]:my-3 [&>*]:leading-relaxed" />
      </article>
    </div>

  </section>
</template>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari, Opera */
}
</style>
