<script setup>
import { storeToRefs } from "pinia";
import { useEnvParamsStore } from "~/stores/envParamsStore";

// Grab the store
const envParamsStore = useEnvParamsStore();

// Grab the label getters as refs
const { geographyLabel, forestTypeLabel, standAgeLabel, vegetationTypeLabel } =
  storeToRefs(envParamsStore);
</script>

<template>
  <div class="p-2">
    <!-- <h1 weight="medium" size="lg" class="text-neutral-900">
      {{ geographyLabel }} - {{ forestTypeLabel }} - {{ standAgeLabel }} -
      {{ vegetationTypeLabel }}
    </h1> -->
    <!-- <div class="flex gap-2 w-full mb-4">
      <UBadge
        icon="i-material-symbols-location-on-outline"
        size="sm"
        color="white"
        variant="solid"
        :ui="{ rounded: 'rounded-full' }"
        class="flex gap-1"
      >
        <Icon
          name="material-symbols:location-on-outline"
          class="text-fuchsia-500"
        />
        {{ geographyLabel }}
      </UBadge>
      <UBadge
        size="sm"
        color="white"
        variant="solid"
        :ui="{ rounded: 'rounded-full' }"
        class="flex gap-1"
      >
        <Icon name="lucide:trees" class="text-green-500" />
        {{ forestTypeLabel }}
      </UBadge>
      <UBadge
        size="sm"
        color="white"
        variant="solid"
        :ui="{ rounded: 'rounded-full' }"
        class="flex gap-1"
      >
        <Icon name="carbon:crop-growth" class="text-violet-500" />
        {{ standAgeLabel }}
      </UBadge>
      <UBadge
        size="sm"
        color="white"
        variant="solid"
        :ui="{ rounded: 'rounded-full' }"
        class="flex gap-1"
      >
        <Icon name="fluent-emoji-high-contrast:herb" class="text-teal-500" />
        {{ vegetationTypeLabel }}
      </UBadge>
    </div> -->
    <div class="">
      <h1 size="lg" weight="light" class="text-neutral-500">
        Här är underlaget från markinventeringen [gott] och visar [många] arter,
        så som [art1, art2]. I den här miljön finns det [få] Naturvårdsarter
        t.ex. [art3], [Många] matsvampar kan också finnas här, t.ex [art4].
      </h1>
    </div>
  </div>
</template>
