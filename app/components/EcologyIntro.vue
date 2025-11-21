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

function resolvePrimaryImage(item: EcologyIntroItem) {
  return (item?.image ?? item?.img ?? '') as string
}

function resolveSecondaryImage(item: EcologyIntroItem) {
  return (item?.img2 ?? '') as string
}

function resolveDescription(item: EcologyIntroItem) {
  return (item?.description ?? '') as string
}
</script>

<template>
  <section v-if="slides.length" class="hide-scrollbar overflow-scroll">
    <div class="">
      <div class="flex flex-col gap-4 sm:gap-6 ">
        <article v-for="(item, i) in slides" :key="i" class=" flex flex-col">
          <div v-if="resolvePrimaryImage(item) || resolveSecondaryImage(item)" class="relative w-full space-y-3">
            <NuxtImg v-if="resolvePrimaryImage(item)" :src="resolvePrimaryImage(item)" :alt="item.title || ''" fit="cover"
              class=" rounded-lg w-full object-cover" width="800" />
            <NuxtImg v-if="resolveSecondaryImage(item)" :src="resolveSecondaryImage(item)" :alt="item.title || ''" fit="cover"
              class=" rounded-lg w-full object-cover" width="800" />
          </div>
          <!-- <div class="px-6 py-3 sm:py-3"> -->
          <!-- <h3 v-if="item.title" class="text-2xl font-semibold text-neutral-900">
              {{ item.title }}
            </h3> -->
          <MDC v-if="resolveDescription(item)" :value="resolveDescription(item)"
            class="prose prose-neutral max-w-none" />
          <!-- </div> -->
        </article>
      </div>
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
