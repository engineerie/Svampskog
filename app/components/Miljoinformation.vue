<template>
  <!-- Preload images to make them available during static prerendering -->
  <div class="hidden">
    <NuxtImg v-for="(src, key) in imageMap" :key="key" :src="src" width="600" height="420" quality="80" format="webp"
      preload />
  </div>
  <div class="space-y-6 mt-4">
    <div>
      <h1 class="mb-2 text-2xl font-medium">Var i Sverige</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="option in geographyOptions" class=" rounded-xl overflow-hidden border border-neutral-200">
          <div class="px-3 pt-2 text-lg font-medium text-neutral-600">
            {{ option.label }}
          </div>
          <p class="px-3 pb-2 text-md text-neutral-500">{{ option.description }}</p>
        </div>
      </div>
    </div>
    <div>
      <h1 class="mb-2 text-2xl font-medium">Skogstyp</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="option in forestTypeOptions" class=" rounded-xl overflow-hidden border border-neutral-200">
          <div class="bg-gray-200 h-58 rounded-lg flex items-center justify-center">
            <NuxtImg v-if="imageMap[option.value]" :src="imageMap[option.value]" class="w-full h-full object-cover"
              width="600" height="420" quality="80" format="webp" />
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 text-neutral-400 text-md">
              Ingen bild</div>
          </div>
          <div class="px-3 pt-2 text-lg font-medium text-neutral-600">
            {{ option.label }}
          </div>
          <p class="px-3 pb-2 text-md text-neutral-500">{{ option.description }}</p>
        </div>
      </div>
    </div>
    <div>
      <h1 class="mb-2 text-2xl font-medium">Skogsålder</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="option in standAgeOptions" class=" rounded-xl overflow-hidden border border-neutral-200">
          <div class="px-3 pt-2 text-lg font-medium text-neutral-600">
            {{ option.label }}
          </div>
          <p class="px-3 pb-2 text-md text-neutral-500">{{ option.description }}</p>
        </div>
      </div>
    </div>
    <div>
      <h1 class="mb-2 text-2xl font-medium">Fältskikt</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="option in vegetationTypeOptions" class=" rounded-xl overflow-hidden border border-neutral-200">
          <div class="bg-gray-200 h-58 rounded-lg flex items-center justify-center">
            <NuxtImg v-if="imageMap[option.value]" :src="imageMap[option.value]" class="w-full h-full object-cover"
              width="600" height="420" quality="80" format="webp" />
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 text-neutral-400 text-md">
              Ingen bild</div>
          </div>
          <div class="px-3 pt-2 text-lg font-medium text-neutral-600">
            {{ option.label }}
          </div>
          <p class="px-3 pb-2 text-md text-neutral-500">{{ option.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { imageMap, geographyOptions, forestTypeOptions, standAgeOptions, vegetationTypeOptions } from '~/stores/envParamsStore'
</script>
