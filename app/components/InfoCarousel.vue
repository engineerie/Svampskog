<script setup lang="ts">
import { computed } from 'vue'

interface CarouselItem {
  title?: string
  image?: string
  img?: string
  description?: string
  [key: string]: unknown
}

interface CarouselSection {
  title?: string
  description?: string
  items: CarouselItem[]
}

const props = defineProps<{
  section?: CarouselSection | null
  items?: CarouselItem[] | null
  title?: string
  description?: string
}>()

const slides = computed<CarouselItem[]>(() => props.items ?? props.section?.items ?? [])
const headingTitle = computed(() => props.section?.title ?? props.title ?? null)
const headingDescription = computed(() => props.section?.description ?? props.description ?? null)
const hasHeading = computed(() => Boolean(headingTitle.value || headingDescription.value))

function resolveImage(item: CarouselItem) {
  return (item?.image ?? item?.img ?? '') as string
}

function resolveDescription(item: CarouselItem) {
  return (item?.description ?? '') as string
}
</script>

<template>
  <section v-if="slides.length" class="hide-scrollbar overflow-scroll">
    <!-- <UContainer v-if="hasHeading" class="mb-8 sm:mb-10 px-6">
      <h2 v-if="headingTitle" class="text-3xl font-semibold sm:text-4xl text-neutral-900">
        {{ headingTitle }}
      </h2>
      <p v-if="headingDescription" class="mt-2 text-neutral-600 max-w-2xl">
        {{ headingDescription }}
      </p>
    </UContainer> -->

    <div class="px-0 sm:px-6">
      <div class="flex flex-col gap-4 sm:gap-6 ">
        <article v-for="(item, i) in slides" :key="i"
          class=" flex flex-col gap-4 rounded-2xl border border-muted/50 bg-white shadow-sm overflow-hidden">
          <div v-if="resolveImage(item)" class="relative w-full overflow-hidden bg-muted">
            <NuxtImg :src="resolveImage(item)" :alt="item.title || ''" fit="cover" class="w-full h-full object-cover"
              loading="lazy" decoding="async" />
          </div>
          <div class="p-5 sm:p-6 space-y-3">
            <h3 v-if="item.title" class="text-2xl font-semibold text-neutral-900">
              {{ item.title }}
            </h3>
            <MDC v-if="resolveDescription(item)" :value="resolveDescription(item)"
              class="prose prose-neutral max-w-none" />
          </div>
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