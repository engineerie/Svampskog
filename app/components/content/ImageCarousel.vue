<template>
  <div>
    <div v-if="resolvedImages.length === 1" :class="resolvedFrameClass">
      <ProseImg :src="resolvedImages[0]" :alt="alt" :class="resolvedImageClass" loading="lazy" decoding="async"
        width="900" format="webp" />
    </div>

    <UCarousel v-else v-slot="{ item }" :items="resolvedImages" :arrows="resolvedImages.length > 1" :fade="useFade"
      class="w-full" :ui="{ prev: 'start-4 sm:start-4', next: 'end-4 sm:end-4', item: resolvedItemClass }"
      @select="onSelect">
      <div :class="resolvedFrameClass">
        <ProseImg :src="item" :alt="alt" :class="resolvedImageClass" loading="lazy" decoding="async" width="900"
          format="webp" />
      </div>
    </UCarousel>

    <p v-if="activeCaption" class="mt-3 text-sm text-neutral-600">
      {{ activeCaption }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  images?: string | string[]
  captions?: string | string[]
  alt?: string
  itemClass?: string
  aspect?: 'video' | 'square' | 'auto'
  fade?: boolean
}>()

const activeIndex = ref(0)

const resolvedImages = computed(() => {
  if (Array.isArray(props.images)) {
    return props.images.filter(Boolean)
  }

  return String(props.images || '')
    .split('|')
    .map((value) => value.trim())
    .filter(Boolean)
})

const alt = computed(() => props.alt || 'Bildkarusell')
const resolvedItemClass = computed(() => `${props.itemClass || 'basis-full'} shrink-0`)
const useFade = computed(() => props.fade ?? true)
const resolvedFrameClass = computed(() => {
  const aspectClass = props.aspect === 'square'
    ? 'aspect-square'
    : props.aspect === 'video'
      ? 'aspect-video'
      : ''

  return ['overflow-hidden rounded-lg ', aspectClass]
    .filter(Boolean)
    .join(' ')
})
const resolvedImageClass = computed(() => {
  return ['w-full h-full object-cover']
    .filter(Boolean)
    .join(' ')
})
const resolvedCaptions = computed(() => {
  if (Array.isArray(props.captions)) {
    return props.captions
  }

  return String(props.captions || '')
    .split('|')
    .map((value) => value.trim())
    .filter(Boolean)
})
const activeCaption = computed(() => resolvedCaptions.value[activeIndex.value] || '')

function onSelect(index: number) {
  activeIndex.value = index
}
</script>
