<template>
  <!-- Image Section -->
  <div class="justify-center">
    <div v-if="imageUrl">
      <div class="relative">
        <NuxtImg
          height="505"
          width="805"
          :src="imageUrl"
          format="webp"
        />
      </div>
    </div>
    <USkeleton v-else class="h-20 w-32 mb-12 rounded-lg" />

    <div class="hidden">
      <NuxtImg
        v-for="(src, index) in allImageUrls"
        :key="index"
        :src="src"
        height="505"
        width="805"
        format="webp"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useEnvParamsStore } from "~/stores/envParamsStore";

const envParamsStore = useEnvParamsStore();
const { geography, forestType, standAge, vegetationType } =
  storeToRefs(envParamsStore);

// Now compute the final image URL from the store values
const imageUrl = computed(() => {
  if (
    geography.value &&
    forestType.value &&
    standAge.value &&
    vegetationType.value
  ) {
    const imageName = `${geography.value}_${forestType.value}_${standAge.value}_${vegetationType.value}`;
    const finalUrl = `/images/EDNA_bilder_skog/${imageName}.png`;
    console.log("Returning dynamic URL:", finalUrl);
    return finalUrl;
  }
  return null; // or fallback placeholder
});

// List of possible values for each prop
const geographies = ["Norr", "Söder"];
const forestTypes = [
  "Granskog",
  "Tallskog",
  "Barrblandskog",
  "Lövblandskog",
  "Lövskog",
  "Naturbete",
  "EkBokskog",
];
const vegetationTypes = ["Örter_grupp", "Blåbär_grupp", "Lingon_grupp"];
const standAges = ["1-40", "41-90", "91", "allaåldrar"];

// Generate all possible image URLs
const allImageUrls = computed(() => {
  const urls = [];
  for (const geography of geographies) {
    for (const forestType of forestTypes) {
      for (const vegetationType of vegetationTypes) {
        for (const standAge of standAges) {
          const imageName = `${geography}_${forestType}_${standAge}_${vegetationType}`;

          urls.push(`/images/EDNA_bilder_skog/${imageName}.png`);
        }
      }
    }
  }
  return urls;
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
