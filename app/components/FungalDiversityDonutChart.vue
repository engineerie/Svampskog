<template>
  <figure class="my-6 w-full" aria-labelledby="fungal-diversity-donut-title">
    <!-- <figcaption>
      <h2 id="fungal-diversity-donut-title" class="text-lg font-semibold text-neutral-900">
        Kända svamparter i Sverige
      </h2>
    </figcaption> -->

    <div class="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-10">
      <div class="w-full max-w-72" :style="donutLabelColors">
        <ClientOnly>
          <VisSingleContainer :data="chartData" :height="280">
            <VisDonut :value="valueAccessor" :color="colorAccessor" :radius="112" :arc-width="48" :pad-angle="0.025"
              :corner-radius="4" central-label="15 000" central-sub-label="Arter i Sverige" />
          </VisSingleContainer>
        </ClientOnly>
      </div>

      <div class="grid w-full max-w-sm gap-3 text-sm text-neutral-700">
        <div v-for="item in chartData" :key="item.id" class="flex items-center gap-3">
          <span class="size-3 shrink-0 rounded-sm" :style="{ backgroundColor: item.color }" aria-hidden="true" />
          <span class="min-w-0 flex-1">{{ item.label }}</span>
          <strong class="tabular-nums text-neutral-900">{{ formatCount(item.value) }}</strong>
        </div>
      </div>
    </div>

    <!-- <p class="mt-3 text-sm text-neutral-600">
      Ungefärlig fördelning av närmare 15 000 kända arter. Mikrosvampar visas som återstående arter efter
      storsvampar och lavar.
    </p> -->
  </figure>
</template>

<script setup lang="ts">
import { VisDonut, VisSingleContainer } from '@unovis/vue'

type FungalGroupDatum = {
  id: string
  label: string
  value: number
  color: string
}

const chartData: FungalGroupDatum[] = [
  { id: 'macrofungi', label: 'Storsvampar', value: 5000, color: '#8e51ff' },
  { id: 'lichens', label: 'Lavar', value: 2000, color: '#22a06b' },
  { id: 'microfungi', label: 'Mikrosvampar', value: 8000, color: '#d1bba0' }
]

const donutLabelColors = {
  '--vis-donut-central-label-text-color': '#171717',
  '--vis-donut-central-sub-label-text-color': '#737373'
}

const valueAccessor = (datum: FungalGroupDatum) => datum.value
const colorAccessor = (datum: FungalGroupDatum) => datum.color
const formatCount = (value: number) => value.toLocaleString('sv-SE')
</script>
